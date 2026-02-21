"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function BorderParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate particles only around outer screen space
  const particles = useMemo(() => {
    const positions = [];
    const count = 4000;

    for (let i = 0; i < count; i++) {
      let x = (Math.random() - 0.5) * 20;
      let y = (Math.random() - 0.5) * 12;
      let z = (Math.random() - 0.5) * 5;

      // Create empty center area
      const distanceFromCenter = Math.sqrt(x * x + y * y);
      if (distanceFromCenter < 4) continue;

      positions.push(x, y, z);
    }

    return new Float32Array(positions);
  }, []);

  useFrame(({ mouse, clock }) => {
    if (!pointsRef.current) return;

    const elapsed = clock.getElapsedTime();

    // Continuous slow rotation
    const autoRotateY = elapsed * 0.05;
    const autoRotateX = Math.sin(elapsed * 0.3) * 0.1;

    // Mouse influence (smooth lerp effect)
    const targetY = mouse.x * 0.5;
    const targetX = mouse.y * 0.3;

    pointsRef.current.rotation.y += (targetY - pointsRef.current.rotation.y) * 0.05;
    pointsRef.current.rotation.x += (targetX - pointsRef.current.rotation.x) * 0.05;

    // Add auto motion
    pointsRef.current.rotation.y += autoRotateY * 0.002;
    pointsRef.current.rotation.x += autoRotateX * 0.002;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#651FFF"
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.6}
      />
    </points>
  );
}

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0 ">
      <Canvas camera={{ position: [0, 0, 8] }}>
        <BorderParticles />
      </Canvas>
    </div>
  );
}