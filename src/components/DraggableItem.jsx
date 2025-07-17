
##### **✅ 檔案 11: `ControlPanel.jsx`**
**請用以下完整程式碼，建立或覆蓋 `3D-maker/src/components/ControlPanel.jsx` 檔案：**
(此處貼上完整的 ControlPanel.jsx 程式碼)

##### **✅ 檔案 12: `InfoPanel.jsx`**
**請用以下完整程式碼，建立或覆蓋 `3D-maker/src/components/InfoPanel.jsx` 檔案：**
(此處貼上完整的 InfoPanel.jsx 程式碼)

##### **✅ 檔案 13: `DraggableItem.jsx`**
**請用以下完整程式碼，建立或覆蓋 `3D-maker/src/components/DraggableItem.jsx` 檔案：**
```javascript
import { useRef, useState, useCallback, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
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
    setIsDragging(true);
    if (orbitControlsRef.current) orbitControlsRef.current.enabled = false;
    const currentPos = body.current.translation();用以下完整程式碼，覆蓋掉您原本的 `/src/components/DraggableItem.jsx` 檔案：**
```javascript
import { useRef, useState, useCallback, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
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
    setIsDragging(true);
    if (orbitControlsRef.current) orbitControlsRef.current.enabled = false;
    const currentPos = body.current.translation();
    dragOffset.current.copy(currentPos).sub(e.point);
    dragPlane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), e.point);
    body.current.wakeUp();
    body.current.setBodyType(1); // Kinematic
  };

  const onPointerMove = useCallback((e) => {
    if (isDragging) {
      const ray = new THREE.Ray();
      const mouse = { x: (e.clientX / gl.domElement.clientWidth) * 2 - 1, y: -(e.clientY / gl.domElement.clientHeight) * 2 + 1 };
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
        if (orbitControlsRef.current) orbitControlsRef.current.enabled = true;
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

  const rotateItem = (e) => { e.stopPropagation(); if (isDragging) return; body.current.wakeUp(); const currentRotation = new THREE.Quaternion().copy(body.current.rotation()); const rotationY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2); currentRotation.multiply(rotationY); body.current.setRotation(currentRotation, true); };
  const { w, h, d } = item.dimensions;

  return (
    <RigidBody ref={body} colliders='cuboid' position={item.position} type="dynamic">
      <Box
    dragOffset.current.copy(currentPos).sub(e.point);
    dragPlane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), e.point);
    body.current.wakeUp();
    body.current.setBodyType(1);
  };
  
  const onPointerMove = useCallback((e) => {
    if (isDragging) {
      const ray = new THREE.Ray();
      const mouse = { x: (e.clientX / gl.domElement.clientWidth) * 2 - 1, y: -(e.clientY / gl.domElement.clientHeight) * 2 + 1 };
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
        if (orbitControlsRef.current) orbitControlsRef.current.enabled = true;
        body.current.setBodyType(0);
      }
      return false;
    });
   args={[w, h, d]} castShadow receiveShadow onPointerDown={onPointerDown} onContextMenu={(e) => { e.preventDefault(); rotateItem(e); }}>
        <meshStandardMaterial color={isDragging ? '#60a5fa' : '#f97316'} />
      </Box>
      <Text color="white" fontSize={Math.min(w, d, h) * 0.5} position={[0, h / 2 + 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} anchorX="center" anchorY="middle" maxWidth={w * 0.9} pointerEvents="none">
        {item.name}
      </Text>
    </RigidBody>
  );
}