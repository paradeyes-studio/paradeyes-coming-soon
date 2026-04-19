"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Environment, Points, PointMaterial } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
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
    ref.current.rotation.x -= delta / 22;
    ref.current.rotation.y -= delta / 28;
  });

  return (
    <Points
      ref={ref}
      positions={positions}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        color="#57EEA1"
        size={0.02}
        sizeAttenuation
        depthWrite={false}
        opacity={0.55}
      />
    </Points>
  );
}

function EyeModel({ lowPower = false }: { lowPower?: boolean }) {
  const outerRef = useRef<THREE.Group>(null);
  const breathRef = useRef<THREE.Group>(null);
  const entryRef = useRef<THREE.Group>(null);
  const blinkRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRot = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const blinkTargetRef = useRef(1);
  const isFineRef = useRef(false);
  const [startTime] = useState(() => performance.now() / 1000);

  const data = useLoader(SVGLoader, "/logos/paradeyes-eye.svg");

  const { geometries, offset, scale } = useMemo(() => {
    const geos: THREE.BufferGeometry[] = [];
    data.paths.forEach((path) => {
      const shapes = path.toShapes(true);
      shapes.forEach((shape) => {
        const geo = new THREE.ExtrudeGeometry(shape, {
          depth: 40,
          bevelEnabled: true,
          bevelThickness: 8,
          bevelSize: 5,
          bevelSegments: 10,
          curveSegments: 56,
        });
        geo.applyMatrix4(new THREE.Matrix4().makeScale(1, -1, 1));
        geo.computeVertexNormals();
        geos.push(geo);
      });
    });

    const box = new THREE.Box3();
    geos.forEach((g) => {
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

    return { geometries: geos, offset: c, scale: s };
  }, [data]);

  useEffect(() => {
    isFineRef.current = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    if (!isFineRef.current) return;
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    let closeTimeout: number | undefined;
    let openTimeout: number | undefined;
    let nextTimeout: number | undefined;
    const schedule = () => {
      const delay = 8000 + Math.random() * 4000;
      nextTimeout = window.setTimeout(() => {
        blinkTargetRef.current = 0.08;
        closeTimeout = window.setTimeout(() => {
          blinkTargetRef.current = 1;
          openTimeout = window.setTimeout(schedule, 400);
        }, 160);
      }, delay);
    };
    schedule();
    return () => {
      if (closeTimeout) window.clearTimeout(closeTimeout);
      if (openTimeout) window.clearTimeout(openTimeout);
      if (nextTimeout) window.clearTimeout(nextTimeout);
    };
  }, []);

  useFrame((state, delta) => {
    if (
      !outerRef.current ||
      !breathRef.current ||
      !entryRef.current ||
      !blinkRef.current
    )
      return;
    const now = state.clock.elapsedTime;
    const elapsed = performance.now() / 1000 - startTime;

    if (isFineRef.current) {
      targetRot.current.x = mouseRef.current.y * 0.22;
      targetRot.current.y = mouseRef.current.x * 0.38;
      const stiffness = 0.05;
      const damping = 0.85;
      const dx = targetRot.current.x - outerRef.current.rotation.x;
      const dy = targetRot.current.y - outerRef.current.rotation.y;
      velocity.current.x = velocity.current.x * damping + dx * stiffness;
      velocity.current.y = velocity.current.y * damping + dy * stiffness;
      outerRef.current.rotation.x += velocity.current.x;
      outerRef.current.rotation.y += velocity.current.y;
    } else {
      outerRef.current.rotation.y += delta * 0.08;
    }

    const breath = 1 + Math.sin((now * Math.PI * 2) / 6) * 0.018;
    breathRef.current.scale.setScalar(breath);

    const currentY = blinkRef.current.scale.y;
    blinkRef.current.scale.y =
      currentY + (blinkTargetRef.current - currentY) * 0.28;

    const entryDelay = 1.6;
    const entryDuration = 1.4;
    const p = Math.max(
      0,
      Math.min(1, (elapsed - entryDelay) / entryDuration),
    );
    const eased = 1 - Math.pow(1 - p, 3);
    entryRef.current.scale.setScalar(eased);
  });

  return (
    <group ref={outerRef}>
      <group ref={entryRef} scale={0}>
        <group ref={breathRef}>
          <group ref={blinkRef}>
            <group
              scale={scale}
              position={[
                -offset.x * scale,
                -offset.y * scale,
                -offset.z * scale,
              ]}
            >
              {geometries.map((g, i) => (
                <mesh key={i} geometry={g} castShadow receiveShadow>
                  <meshPhysicalMaterial
                    color={new THREE.Color("#3FD98A")}
                    metalness={lowPower ? 0.55 : 0.85}
                    roughness={lowPower ? 0.35 : 0.15}
                    iridescence={lowPower ? 0.45 : 0.65}
                    iridescenceIOR={1.3}
                    iridescenceThicknessRange={[100, 400]}
                    clearcoat={lowPower ? 0.6 : 1.0}
                    clearcoatRoughness={lowPower ? 0.2 : 0.05}
                    reflectivity={lowPower ? 0.6 : 0.9}
                    envMapIntensity={lowPower ? 0.8 : 1.2}
                    sheen={0.3}
                    sheenColor={new THREE.Color("#57EEA1")}
                    sheenRoughness={0.5}
                    transmission={0}
                  />
                </mesh>
              ))}
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

type Eye3DProps = {
  lowPower?: boolean;
};

export default function Eye3D({ lowPower = false }: Eye3DProps) {
  const particleCount = lowPower ? 140 : 520;
  const envIntensity = lowPower ? 0.55 : 0.8;
  const keyIntensity = lowPower ? 2.0 : 3.2;

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
      <ambientLight color="#023236" intensity={0.2} />

      <spotLight
        position={[5, 5, 5]}
        angle={0.4}
        penumbra={0.8}
        intensity={keyIntensity}
        decay={0}
        color="#FFFFFF"
        castShadow
      />
      <spotLight
        position={[-3, -2, 4]}
        angle={0.6}
        penumbra={1}
        intensity={2.0}
        decay={0}
        color="#57EEA1"
      />
      <spotLight
        position={[0, 3, -5]}
        angle={0.5}
        penumbra={1}
        intensity={1.8}
        decay={0}
        color="#57EEA1"
      />

      <Suspense fallback={null}>
        <Environment
          preset="studio"
          background={false}
          environmentIntensity={envIntensity}
          environmentRotation={[0, Math.PI / 4, 0]}
        />
        <EyeModel lowPower={lowPower} />
        <FloatingParticles count={particleCount} />
      </Suspense>

      {!lowPower && (
        <EffectComposer>
          <Bloom
            intensity={0.7}
            luminanceThreshold={0.35}
            luminanceSmoothing={0.9}
            mipmapBlur
            radius={0.75}
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={[0.0008, 0.0008]}
            radialModulation={false}
            modulationOffset={0}
          />
          <Vignette offset={0.3} darkness={0.55} eskil={false} />
          <Noise
            premultiply
            blendFunction={BlendFunction.ADD}
            opacity={0.035}
          />
        </EffectComposer>
      )}
    </Canvas>
  );
}
