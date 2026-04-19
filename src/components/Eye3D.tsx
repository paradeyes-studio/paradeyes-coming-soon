"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Environment, Points, PointMaterial } from "@react-three/drei";
import { EffectComposer, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { inSphere } from "maath/random";

function FloatingParticles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    inSphere(arr, { radius: 6 });
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x -= delta / 24;
    ref.current.rotation.y -= delta / 30;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#57EEA1"
        size={0.015}
        sizeAttenuation
        depthWrite={false}
        opacity={0.5}
      />
    </Points>
  );
}

function easeOutBack(x: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function clamp01(x: number): number {
  return Math.max(0, Math.min(1, x));
}

function EyeModel() {
  const groupRef = useRef<THREE.Group>(null);
  const bodyOpacityRefs = useRef<THREE.MeshPhysicalMaterial[]>([]);
  const wireOpacityRefs = useRef<THREE.LineBasicMaterial[]>([]);
  const starGroupRef = useRef<THREE.Group>(null);
  const starMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const isFineRef = useRef(false);
  const [startTime] = useState(() => performance.now() / 1000);

  const data = useLoader(SVGLoader, "/logos/paradeyes-eye.svg");

  const { bodyGeometries, starGeometries, offset, scale } = useMemo(() => {
    const body: THREE.BufferGeometry[] = [];
    const star: THREE.BufferGeometry[] = [];

    data.paths.forEach((path, idx) => {
      const shapes = path.toShapes(true);
      shapes.forEach((shape) => {
        const geo = new THREE.ExtrudeGeometry(shape, {
          depth: 18,
          bevelEnabled: true,
          bevelThickness: 3,
          bevelSize: 2,
          bevelSegments: 8,
          curveSegments: 56,
        });
        geo.applyMatrix4(new THREE.Matrix4().makeScale(1, -1, 1));
        geo.computeVertexNormals();
        // paths[2] is the central star (4 branches)
        if (idx === 2) {
          star.push(geo);
        } else {
          body.push(geo);
        }
      });
    });

    const all = [...body, ...star];
    const box = new THREE.Box3();
    all.forEach((g) => {
      g.computeBoundingBox();
      if (g.boundingBox) box.union(g.boundingBox);
    });
    const c = new THREE.Vector3();
    box.getCenter(c);
    const sz = new THREE.Vector3();
    box.getSize(sz);
    const maxDim = Math.max(sz.x, sz.y);
    const targetSize = 2.6;
    const s = targetSize / maxDim;

    return {
      bodyGeometries: body,
      starGeometries: star,
      offset: c,
      scale: s,
    };
  }, [data]);

  useEffect(() => {
    isFineRef.current = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    if (!isFineRef.current) return;
    const onMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mousePos.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const elapsed = performance.now() / 1000 - startTime;

    // Rotation auto fluide + tilt souris additif (pas de spring lourd)
    groupRef.current.rotation.y += delta * 0.5;
    groupRef.current.rotation.x += delta * 0.15;

    if (isFineRef.current) {
      const targetTiltX = mousePos.current.y * 0.2;
      const targetTiltY = mousePos.current.x * 0.2;
      groupRef.current.rotation.x +=
        (targetTiltX - groupRef.current.rotation.x * 0.1) * delta * 2;
      groupRef.current.rotation.y +=
        (targetTiltY - groupRef.current.rotation.y * 0.1) * delta * 2;
    }

    // Entrance orchestration
    // T=0.6 → 2.2 : wireframe stroke visible
    // T=1.2 → 2.2 : iridescent body fading in
    // T=2.2 → 2.8 : star pop with overshoot + 180deg rotation
    const wireStart = 0.6;
    const wireEnd = 2.2;
    const bodyStart = 1.2;
    const bodyEnd = 2.2;
    const starStart = 2.2;
    const starEnd = 2.8;

    // Wireframe opacity: fade in 0.6→1.0, hold, fade out 1.8→2.2
    let wireOpacity = 0;
    if (elapsed >= wireStart && elapsed < wireEnd) {
      if (elapsed < wireStart + 0.4) {
        wireOpacity = (elapsed - wireStart) / 0.4;
      } else if (elapsed > wireEnd - 0.4) {
        wireOpacity = (wireEnd - elapsed) / 0.4;
      } else {
        wireOpacity = 1;
      }
    }
    wireOpacityRefs.current.forEach((m) => {
      if (m) m.opacity = clamp01(wireOpacity);
    });

    // Body iridescent opacity: fade in 1.2→2.2
    let bodyOpacity = 0;
    if (elapsed >= bodyStart) {
      bodyOpacity = clamp01((elapsed - bodyStart) / (bodyEnd - bodyStart));
    }
    bodyOpacityRefs.current.forEach((m) => {
      if (m) m.opacity = bodyOpacity;
    });

    // Star pop: scale 0→1 with back.out + rotation z from PI to 0
    if (starGroupRef.current) {
      let starScale = 0;
      let starRotZ = Math.PI;
      if (elapsed >= starStart) {
        const t = clamp01((elapsed - starStart) / (starEnd - starStart));
        starScale = easeOutBack(t);
        starRotZ = Math.PI * (1 - t);
      }
      starGroupRef.current.scale.setScalar(starScale);
      starGroupRef.current.rotation.z = starRotZ;

      // Star emissive intensity ramps up with scale, sustained afterwards
      const emissive = Math.min(0.8, Math.max(0, (elapsed - starStart) * 1.6));
      starMaterialsRef.current.forEach((m) => {
        if (m) m.emissiveIntensity = emissive;
      });
    }
  });

  return (
    <group ref={groupRef}>
      <group
        scale={scale}
        position={[-offset.x * scale, -offset.y * scale, -offset.z * scale]}
      >
        {/* Body: hook + wave */}
        {bodyGeometries.map((g, i) => (
          <group key={`body-${i}`}>
            {/* Wireframe stroke overlay (electric green edges) */}
            <lineSegments>
              <wireframeGeometry args={[g]} />
              <lineBasicMaterial
                ref={(m) => {
                  if (m) wireOpacityRefs.current[i] = m;
                }}
                color="#57EEA1"
                transparent
                opacity={0}
                depthWrite={false}
                toneMapped={false}
              />
            </lineSegments>
            {/* Iridescent solid mesh */}
            <mesh geometry={g}>
              <meshPhysicalMaterial
                ref={(m) => {
                  if (m) bodyOpacityRefs.current[i] = m;
                }}
                color={new THREE.Color("#3FD98A")}
                metalness={0.6}
                roughness={0.25}
                iridescence={0.4}
                iridescenceIOR={1.3}
                iridescenceThicknessRange={[100, 400]}
                clearcoat={0.5}
                clearcoatRoughness={0.3}
                reflectivity={0.5}
                envMapIntensity={0.3}
                sheen={0.2}
                sheenColor={new THREE.Color("#57EEA1")}
                sheenRoughness={0.6}
                transparent
                opacity={0}
              />
            </mesh>
          </group>
        ))}

        {/* Star: central 4-branch shape, separate group for pop animation */}
        <group ref={starGroupRef} scale={0}>
          {starGeometries.map((g, i) => (
            <mesh key={`star-${i}`} geometry={g}>
              <meshStandardMaterial
                ref={(m) => {
                  if (m) starMaterialsRef.current[i] = m;
                }}
                color="#57EEA1"
                emissive="#57EEA1"
                emissiveIntensity={0}
                toneMapped={false}
                metalness={0.3}
                roughness={0.4}
              />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}

type Eye3DProps = {
  lowPower?: boolean;
};

export default function Eye3D({ lowPower = false }: Eye3DProps) {
  const particleCount = lowPower ? 180 : 400;

  return (
    <Canvas
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      camera={{ position: [0, 0, 4], fov: 40 }}
      dpr={[1, 2]}
      style={{ background: "transparent" }}
    >
      <ambientLight color="#023236" intensity={0.3} />

      <spotLight
        position={[4, 5, 5]}
        angle={0.5}
        penumbra={1}
        intensity={1.2}
        decay={0}
        color="#57EEA1"
      />
      <spotLight
        position={[-3, -2, 3]}
        angle={0.6}
        penumbra={1}
        intensity={0.8}
        decay={0}
        color="#57EEA1"
      />

      <Suspense fallback={null}>
        <Environment
          preset="studio"
          background={false}
          environmentIntensity={0.2}
          environmentRotation={[0, Math.PI / 4, 0]}
        />
        <EyeModel />
        <FloatingParticles count={particleCount} />
      </Suspense>

      <EffectComposer>
        <Noise
          premultiply
          blendFunction={BlendFunction.MULTIPLY}
          opacity={0.025}
        />
      </EffectComposer>
    </Canvas>
  );
}
