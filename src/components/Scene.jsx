// /src/components/Scene.jsx (最終穩定版)

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { Physics, CuboidCollider } from '@react-three/rapier';
import DraggableItem from './DraggableItem';
import StorageSpace from './StorageSpace';
import useStore from '../store/useStore';
import { useRef } from 'react';

export default function Scene() {
  const itemsInScene = useStore((state) => state.itemsInScene);
  const orbitControlsRef = useRef();

  return (
    <Canvas camera={{ position: [4, 4, 4], fov: 50 }} shadows>
      <ambientLight intensity={0.7} />
      <directionalLight 
        position={[5, 10, 7]} 
        intensity={1.0} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <OrbitControls ref={orbitControlsRef} makeDefault />
      <Grid infiniteGrid={true} fadeDistance={50} fadeStrength={5} />
      
      <Physics gravity={[0, -9.8, 0]}>
        {/* 透明的巨大地面 */}
        <RigidBody type="fixed" colliders="cuboid">
            <mesh position={[0, -0.05, 0]} userData={{ isGround: true }}>
                <boxGeometry args={[200, 0.1, 200]} />
                <meshStandardMaterial transparent opacity={0} />
            </mesh>
        </RigidBody>
        
        <StorageSpace />
        {itemsInScene.map((item) => (
          <DraggableItem 
            key={item.instanceId} 
            item={item} 
            orbitControlsRef={orbitControlsRef}
          />
        ))}
      </Physics>
    </Canvas>
  );
}