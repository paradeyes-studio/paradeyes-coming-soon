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
        size={0.013}
        sizeAttenuation
        depthWrite={false}
        opacity={0.45}
      />
    </Points>
  );
}

function EyeModel() {
  const groupRef = useRef<THREE.Group>(null);
  const startTimeRef = useRef<number | null>(null);

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

    const elapsed = state.clock.getElapsedTime();
    if (startTimeRef.current === null) startTimeRef.current = elapsed;
    const t = elapsed - startTimeRef.current;

    if (t < 3.5) {
      groupRef.current.rotation.x = 0;
      groupRef.current.rotation.y = 0;
      groupRef.current.rotation.z = 0;
      return;
    }

    const rotTime = t - 3.5;

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
              metalness={0.15}
              roughness={0.15}
              transmission={0.35}
              thickness={1.2}
              ior={1.45}
              iridescence={0.9}
              iridescenceIOR={1.4}
              iridescenceThicknessRange={[150, 900]}
              clearcoat={0.65}
              clearcoatRoughness={0.35}
              reflectivity={0.5}
              envMapIntensity={0.45}
              sheen={0.5}
              sheenColor={new THREE.Color("#7FFFAB")}
              sheenRoughness={0.3}
              emissive={new THREE.Color("#57EEA1")}
              emissiveIntensity={0.15}
              attenuationColor={new THREE.Color("#57EEA1")}
              attenuationDistance={2.5}
              transparent={false}
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
  const particleCount = lowPower ? 120 : 200;

  return (
    <Canvas
      gl={{
        antialias: true,
        alpha: true,
        premultipliedAlpha: false,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.9,
      }}
      camera={{ position: [0, 0, 4], fov: 40 }}
      dpr={[1, 2]}
      style={{ background: "transparent", pointerEvents: "none" }}
    >
      <ambientLight color="#57EEA1" intensity={0.5} />

      <spotLight
        position={[5, 6, 6]}
        angle={0.55}
        penumbra={1}
        intensity={2.5}
        color="#7FFFAB"
        decay={1.5}
      />
      <spotLight
        position={[-4, -3, 4]}
        angle={0.65}
        penumbra={1}
        intensity={1.6}
        color="#57EEA1"
        decay={1.8}
      />
      <spotLight
        position={[0, 4, -3]}
        angle={0.7}
        penumbra={0.9}
        intensity={1.0}
        color="#A7FFD0"
        decay={2}
      />
      <Suspense fallback={null}>
        <Environment
          preset="studio"
          background={false}
          environmentIntensity={0.55}
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
