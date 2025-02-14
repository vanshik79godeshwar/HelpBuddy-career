// components/HelperModel.tsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Torus, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion-3d';

export default function HelperModel() {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.3;
      groupRef.current.position.y = Math.sin(time) * 0.2;
    }
    
    if (sphereRef.current) {
      sphereRef.current.rotation.x = time * 0.2;
      sphereRef.current.rotation.y = time * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <motion.group
        animate={{
          scale: [1, 1.1, 1],
          rotateY: [0, Math.PI * 2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <mesh ref={sphereRef}>
          <sphereGeometry args={[1, 64, 64]} />
          <MeshDistortMaterial
            color="#3498db"
            roughness={0.1}
            metalness={0.8}
            distort={0.4}
            speed={2}
          />
        </mesh>

        <Torus args={[1.5, 0.05, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial
            color="#2ecc71"
            roughness={0.3}
            metalness={0.8}
            emissive="#2ecc71"
            emissiveIntensity={0.2}
          />
        </Torus>
      </motion.group>
    </group>
  );
}