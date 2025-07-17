import { useRef, useState, useCallback, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';

const dragPlane = new THREE.Plane();
const intersection = new THREE.Vector3();

export default function DraggableItem({ item, orbitControlsRef }) {
  const body = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const { camera, gl } = useThree();
  const dragOffset = useRef(new THREE.Vector3());

  const onPointerDown = (e) => {
    e.stopPropagation();
    // 透過 e.target.closest() 確保我們操作的是整個 RigidBody
    const rigidBodyElement = e.target.closest('[data-group]');
    if (!rigidBodyElement) return;

    setIsDragging(true);
    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = false;
    }
    
    const currentPos = body.current.translation();
    dragOffset.current.copy(currentPos).sub(e.point);
    dragPlane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), e.point);

    body.current.wakeUp();
    body.current.setBodyType(1); // Kinematic
  };
  
  const onPointerMove = useCallback((e) => {
    if (isDragging) {
      const ray = new THREE.Ray();
      const mouse = {
        x: (e.clientX / gl.domElement.clientWidth) * 2 - 1,
        y: -(e.clientY / gl.domElement.clientHeight) * 2 + 1,
      };
      ray.setFromCamera(mouse, camera);

      if (ray.intersectPlane(dragPlane, intersection)) {
        const newPosition = new THREE.Vector3().copy(intersection).add(dragOffset.current);
        body.current.setNextKinematicTranslation(newPosition);
      }
    }
  }, [isDragging, camera, gl.domElement]);

  const onPointerUp = useCallback(() => {
    setIsDragging(isDraggingState => {
      if (isDraggingState) {
        if (orbitControlsRef.current) {
          orbitControlsRef.current.enabled = true;
        }
        body.current.setBodyType(0); // Dynamic
      }
      return false;
    });
  }, []);

  useEffect(() => {
    if (isDragging) {
      gl.domElement.addEventListener('pointermove', onPointerMove);
      gl.domElement.addEventListener('pointerup', onPointerUp);
      gl.domElement.addEventListener('pointerleave', onPointerUp);
    }
    return () => {
      gl.domElement.removeEventListener('pointermove', onPointerMove);
      gl.domElement.removeEventListener('pointerup', onPointerUp);
      gl.domElement.removeEventListener('pointerleave', onPointerUp);
    };
  }, [isDragging, gl.domElement, onPointerMove, onPointerUp]);

  const rotateItem = (e) => {
    e.stopPropagation();
    if (isDragging) return;
    body.current.wakeUp();
    const currentRotation = new THREE.Quaternion().copy(body.current.rotation());
    const rotationY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
    currentRotation.multiply(rotationY);
    body.current.setRotation(currentRotation, true);
  };

  const { w, h, d } = item.dimensions;

  return (
    // 我們將事件監聽器綁定在一個 group 上，這個 group 和 RigidBody 一起移動
    <RigidBody
      ref={body}
      colliders={false} // 我們將手動創建碰撞體
      position={item.position}
      type="dynamic"
    >
      <group
        onPointerDown={onPointerDown}
        onContextMenu={(e) => { e.preventDefault(); rotateItem(e); }}
        data-group // 用於事件代理
      >
        {/* 看得見的視覺物件 */}
        <Box
          args={[w, h, d]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color={isDragging ? '#60a5fa' : '#f97316'} />
        </Box>
        {/* 看不見但能被點擊的物理碰撞體 */}
        <CuboidCollider args={[w / 2, h / 2, d / 2]} />
      </group>

      <Text
        color="white"
        fontSize={Math.min(w, d, h) * 0.5}
        position={[0, h / 2 + 0.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        anchorX="center"
        anchorY="middle"
        maxWidth={w * 0.9}
        pointerEvents="none"
      >
        {item.name}
      </Text>
    </RigidBody>
  );
}