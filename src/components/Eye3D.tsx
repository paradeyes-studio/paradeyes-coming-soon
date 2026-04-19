"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

function EyeModel() {
  const outerRef = useRef<THREE.Group>(null);
  const breathRef = useRef<THREE.Group>(null);
  const entryRef = useRef<THREE.Group>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
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
          bevelThickness: 6,
          bevelSize: 4,
          bevelSegments: 6,
          curveSegments: 48,
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
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state, delta) => {
    if (!outerRef.current || !breathRef.current || !entryRef.current) return;
    const now = state.clock.elapsedTime;
    const elapsed = performance.now() / 1000 - startTime;

    outerRef.current.rotation.y += delta * 0.15;

    const targetRotX = mouseRef.current.y * 0.12;
    outerRef.current.rotation.x +=
      (targetRotX - outerRef.current.rotation.x) * 0.05;
    outerRef.current.position.x +=
      (mouseRef.current.x * 0.12 - outerRef.current.position.x) * 0.08;
    outerRef.current.position.y +=
      (-mouseRef.current.y * 0.08 - outerRef.current.position.y) * 0.08;

    const breath = 1 + Math.sin((now * Math.PI * 2) / 6) * 0.015;
    breathRef.current.scale.setScalar(breath);

    const entryDelay = 0.4;
    const entryDuration = 1.8;
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
          <group
            scale={scale}
            position={[-offset.x * scale, -offset.y * scale, -offset.z * scale]}
          >
            {geometries.map((g, i) => (
              <mesh key={i} geometry={g} castShadow receiveShadow>
                <meshPhysicalMaterial
                  color={new THREE.Color("#57EEA1")}
                  metalness={0.85}
                  roughness={0.18}
                  iridescence={1}
                  iridescenceIOR={1.3}
                  iridescenceThicknessRange={[120, 760]}
                  clearcoat={1}
                  clearcoatRoughness={0.1}
                  envMapIntensity={1.4}
                />
              </mesh>
            ))}
          </group>
        </group>
      </group>
    </group>
  );
}

export default function Eye3D() {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 4], fov: 40 }}
      dpr={[1, 2]}
      style={{ background: "transparent" }}
    >
      <ambientLight color="#023236" intensity={0.4} />
      <directionalLight color="#ffffff" intensity={2.2} position={[3, 4, 5]} />
      <directionalLight
        color="#57EEA1"
        intensity={1.4}
        position={[-3, -2, 2]}
      />
      <pointLight color="#57EEA1" intensity={0.9} position={[0, 0, 1.5]} />
      <Suspense fallback={null}>
        <Environment preset="studio" />
        <EyeModel />
      </Suspense>
    </Canvas>
  );
}
