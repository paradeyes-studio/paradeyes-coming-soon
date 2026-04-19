"use client";

import { Suspense, useMemo, useRef } from "react";
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
        size={0.012}
        sizeAttenuation
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  );
}

function EyeModel() {
  const groupRef = useRef<THREE.Group>(null);

  const data = useLoader(SVGLoader, "/logos/paradeyes-eye.svg");

  const { geometries, offset, scale } = useMemo(() => {
    const geos: THREE.BufferGeometry[] = [];
    data.paths.forEach((path) => {
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

  useFrame((state) => {
    if (!groupRef.current) return;
    // Oscillation sinusoïdale douce sur Y uniquement
    // Amplitude : ±45° (π/4), période : 12 secondes
    const time = state.clock.getElapsedTime();
    const amplitude = Math.PI / 4;
    const frequency = (Math.PI * 2) / 12;

    groupRef.current.rotation.y = Math.sin(time * frequency) * amplitude;
    groupRef.current.rotation.x = 0;
    groupRef.current.rotation.z = 0;
  });

  return (
    <group ref={groupRef}>
      <group
        scale={scale}
        position={[-offset.x * scale, -offset.y * scale, -offset.z * scale]}
      >
        {geometries.map((g, i) => (
          <mesh key={i} geometry={g}>
            <meshPhysicalMaterial
              color={new THREE.Color("#57EEA1")}
              metalness={0.5}
              roughness={0.3}
              iridescence={0.3}
              iridescenceIOR={1.25}
              iridescenceThicknessRange={[150, 400]}
              clearcoat={0.4}
              clearcoatRoughness={0.35}
              reflectivity={0.4}
              envMapIntensity={0.15}
              sheen={0.2}
              sheenColor={new THREE.Color("#57EEA1")}
              sheenRoughness={0.6}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

type Eye3DProps = {
  lowPower?: boolean;
};

export default function Eye3D({ lowPower = false }: Eye3DProps) {
  const particleCount = lowPower ? 60 : 100;

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
