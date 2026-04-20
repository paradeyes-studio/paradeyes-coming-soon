"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
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
    inSphere(arr, { radius: 8 });
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x -= delta / 40;
    ref.current.rotation.y -= delta / 50;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#57EEA1"
        size={0.013}
        sizeAttenuation
        depthWrite={false}
        opacity={0.45}
      />
    </Points>
  );
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeElasticOut = (t: number) => {
  const c4 = (2 * Math.PI) / 3;
  if (t === 0) return 0;
  if (t === 1) return 1;
  return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

function EyeModel() {
  const groupRef = useRef<THREE.Group>(null);
  const leftArcRef = useRef<THREE.Group>(null);
  const rightArcRef = useRef<THREE.Group>(null);
  const starRef = useRef<THREE.Group>(null);
  const startTimeRef = useRef<number | null>(null);

  const data = useLoader(SVGLoader, "/logos/paradeyes-eye.svg");

  const { pathGeometries, offset, scale } = useMemo(() => {
    const pathGeos: THREE.BufferGeometry[][] = [];
    data.paths.forEach((path) => {
      const shapes = path.toShapes(true);
      const geosForPath: THREE.BufferGeometry[] = [];
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
        geosForPath.push(geo);
      });
      pathGeos.push(geosForPath);
    });

    const box = new THREE.Box3();
    pathGeos.forEach((geos) => {
      geos.forEach((g) => {
        g.computeBoundingBox();
        if (g.boundingBox) box.union(g.boundingBox);
      });
    });
    const c = new THREE.Vector3();
    box.getCenter(c);
    const sz = new THREE.Vector3();
    box.getSize(sz);
    const maxDim = Math.max(sz.x, sz.y);
    const targetSize = 2.6;
    const s = targetSize / maxDim;

    return { pathGeometries: pathGeos, offset: c, scale: s };
  }, [data]);

  const materials = useMemo(() => {
    const build = () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#57EEA1"),
        metalness: 0.45,
        roughness: 0.4,
        iridescence: 0.25,
        iridescenceIOR: 1.25,
        iridescenceThicknessRange: [150, 400],
        clearcoat: 0.25,
        clearcoatRoughness: 0.6,
        reflectivity: 0.3,
        envMapIntensity: 0.1,
        sheen: 0.15,
        sheenColor: new THREE.Color("#57EEA1"),
        sheenRoughness: 0.8,
        transparent: true,
        opacity: 0,
      });
    return { left: build(), right: build(), star: build() };
  }, []);

  useEffect(() => {
    return () => {
      materials.left.dispose();
      materials.right.dispose();
      materials.star.dispose();
    };
  }, [materials]);

  useFrame((state) => {
    if (
      !groupRef.current ||
      !leftArcRef.current ||
      !rightArcRef.current ||
      !starRef.current
    )
      return;

    if (startTimeRef.current === null) {
      startTimeRef.current = state.clock.getElapsedTime();
    }
    const t = state.clock.getElapsedTime() - startTimeRef.current;

    const ASSEMBLY_END = 3.0;
    const ROTATION_START = 3.5;

    if (t < ROTATION_START) {
      const leftStart = 0.5;
      const leftDuration = 2.0;
      const leftProgress = Math.max(
        0,
        Math.min(1, (t - leftStart) / leftDuration),
      );
      const leftEased = easeOutCubic(leftProgress);
      leftArcRef.current.position.x = -4 + 4 * leftEased;
      leftArcRef.current.position.y = 0;
      leftArcRef.current.scale.setScalar(0.7 + 0.3 * leftEased);
      materials.left.opacity = leftEased;

      const rightStart = 0.7;
      const rightDuration = 2.0;
      const rightProgress = Math.max(
        0,
        Math.min(1, (t - rightStart) / rightDuration),
      );
      const rightEased = easeOutCubic(rightProgress);
      rightArcRef.current.position.x = 4 - 4 * rightEased;
      rightArcRef.current.position.y = 0;
      rightArcRef.current.scale.setScalar(0.7 + 0.3 * rightEased);
      materials.right.opacity = rightEased;

      const starStart = 1.5;
      const starDuration = 1.3;
      const starProgress = Math.max(
        0,
        Math.min(1, (t - starStart) / starDuration),
      );
      const starEased = easeElasticOut(starProgress);
      starRef.current.position.x = 0;
      starRef.current.position.y = 4 - 4 * starEased;
      starRef.current.scale.setScalar(0.3 + 0.7 * starEased);
      starRef.current.rotation.z = Math.PI * (1 - starEased);
      materials.star.opacity = starProgress;

      if (t >= ASSEMBLY_END) {
        leftArcRef.current.position.x = 0;
        leftArcRef.current.scale.setScalar(1);
        rightArcRef.current.position.x = 0;
        rightArcRef.current.scale.setScalar(1);
        starRef.current.position.y = 0;
        starRef.current.scale.setScalar(1);
        starRef.current.rotation.z = 0;
        materials.left.opacity = 1;
        materials.right.opacity = 1;
        materials.star.opacity = 1;
      }

      groupRef.current.rotation.x = 0;
      groupRef.current.rotation.y = 0;
      groupRef.current.rotation.z = 0;
      return;
    }

    leftArcRef.current.position.x = 0;
    leftArcRef.current.scale.setScalar(1);
    rightArcRef.current.position.x = 0;
    rightArcRef.current.scale.setScalar(1);
    starRef.current.position.y = 0;
    starRef.current.scale.setScalar(1);
    starRef.current.rotation.z = 0;
    materials.left.opacity = 1;
    materials.right.opacity = 1;
    materials.star.opacity = 1;

    const rotTime = t - ROTATION_START;

    const amplitudeY = 0.9599;
    const periodY = 14;
    const frequencyY = (Math.PI * 2) / periodY;
    const phaseY = Math.sin(rotTime * frequencyY);
    const easedY = Math.sign(phaseY) * Math.pow(Math.abs(phaseY), 0.65);
    const rotY = easedY * amplitudeY;

    const amplitudeX = 0.0524;
    const periodX = 30;
    const frequencyX = (Math.PI * 2) / periodX;
    const rotX = Math.sin(rotTime * frequencyX + 1.3) * amplitudeX;

    groupRef.current.rotation.y = rotY;
    groupRef.current.rotation.x = rotX;
    groupRef.current.rotation.z = 0;
  });

  const offsetPos: [number, number, number] = [
    -offset.x * scale,
    -offset.y * scale,
    -offset.z * scale,
  ];

  const leftGeos = pathGeometries[0] ?? [];
  const rightGeos = pathGeometries[1] ?? [];
  const starGeos = pathGeometries[2] ?? [];

  return (
    <group ref={groupRef}>
      <group ref={leftArcRef}>
        <group scale={scale} position={offsetPos}>
          {leftGeos.map((g, i) => (
            <mesh key={`left-${i}`} geometry={g} material={materials.left} />
          ))}
        </group>
      </group>
      <group ref={rightArcRef}>
        <group scale={scale} position={offsetPos}>
          {rightGeos.map((g, i) => (
            <mesh key={`right-${i}`} geometry={g} material={materials.right} />
          ))}
        </group>
      </group>
      <group ref={starRef}>
        <group scale={scale} position={offsetPos}>
          {starGeos.map((g, i) => (
            <mesh key={`star-${i}`} geometry={g} material={materials.star} />
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
  const particleCount = lowPower ? 120 : 200;

  return (
    <Canvas
      gl={{
        antialias: true,
        alpha: true,
        premultipliedAlpha: false,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.85,
      }}
      camera={{ position: [0, 0, 4], fov: 40 }}
      dpr={[1, 2]}
      style={{ background: "transparent", pointerEvents: "none" }}
    >
      <ambientLight color="#023236" intensity={0.4} />

      <spotLight
        position={[4, 5, 5]}
        angle={0.5}
        penumbra={1}
        intensity={1.3}
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
          environmentIntensity={0.15}
          environmentRotation={[0, Math.PI / 4, 0]}
        />
        <EyeModel />
        <FloatingParticles count={particleCount} />
      </Suspense>

      <EffectComposer>
        <Noise
          premultiply
          blendFunction={BlendFunction.MULTIPLY}
          opacity={0.02}
        />
      </EffectComposer>
    </Canvas>
  );
}
