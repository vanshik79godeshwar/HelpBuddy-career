'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

// Function to generate a random float between min and max
function randomFloatBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// Custom random color generator function
function generateRandomColor() {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return "#" + randomColor.padStart(6, '0');
}

export function ParticleField(props: any) {
  const points = useRef<any>();
  const { viewport } = useThree();
  const count = 500;

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions.set(
        [
          randomFloatBetween(-viewport.width, viewport.width),
          randomFloatBetween(-viewport.height, viewport.height),
          randomFloatBetween(-50, 50),
        ],
        i * 3
      );

      // Use the custom random color generator
      const color = generateRandomColor();
      colors.set(new THREE.Color(color).toArray(), i * 3);
    }
    return { positions, colors };
  }, [viewport]);

  useFrame(({ clock }) => {
    if (points.current) {
      points.current.rotation.y = clock.getElapsedTime() * 0.05;
      points.current.rotation.x = clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <points ref={points} {...props}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          itemSize={3}
          array={particles.positions}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          itemSize={3}
          array={particles.colors}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
