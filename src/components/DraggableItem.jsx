// /src/components/DraggableItem.jsx (最終穩定堆疊版)

import { useRef, useState, useCallback, useEffect } from 'react';
import { useFrame, useThree } from '@react--three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';
import useStore from '../store/useStore';

const dragPlane = new THREE.Plane();
const intersection = new THREE.Vector3();

export default function DraggableItem({ item, orbitControlsRef }) {
    const body = useRef();
    const [isDragging, setIsDragging] = useState(false);
    // VVVVVVVV 新增一個 state 來追蹤物品是否在倉庫內 VVVVVVVV
    const [isInStorage, setIsInStorage] = useState(true);
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    const { camera, gl } = useThree();
    const dragOffset = useRef(new THREE.Vector3());
    const selectedSpace = useStore(state => state.selectedSpace);
    const storageSpaces = useStore(state => state.storageSpaces);

    // VVVVVVVV 核心修改：在每一幀檢查位置 VVVVVVVV
    useFrame(() => {
        if (body.current) {
            const position = body.current.translation();
            const storageDims = storageSpaces[selectedSpace];
            const { w, h, d } = item.dimensions;

            // 檢查物體的整個邊界框是否在倉庫內
            const inX = position.x - w / 2 >= -storageDims.w / 2 && position.x + w / 2 <= storageDims.w / 2;
            const inY = position.y - h / 2 >= 0 && position.y + h / 2 <= storageDims.h;
            const inZ = position.z - d / 2 >= -storageDims.d / 2 && position.z + d / 2 <= storageDims.d / 2;

            setIsInStorage(inX && inY && inZ);
        }
    });
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    const onPointerDown = (e) => { /* ... 保持不變 ... */ };
    const onPointerMove = useCallback((e) => { /* ... 保持不變 ... */ }, [/* ... */]);
    const onPointerUp = useCallback(() => { /* ... 保持不變 ... */ }, []);
    useEffect(() => { /* ... 保持不變 ... */ }, [/* ... */]);
    const rotateItem = (e) => { /* ... 保持不變 ... */ };

    const { w, h, d } = item.dimensions;

    // 根據是否在倉庫內，決定物品的顏色
    const itemColor = isInStorage ? '#f97316' : '#dc2626'; // 在倉庫內是橘色，否則為紅色

    return (
        <RigidBody
            ref={body}
            colliders='cuboid'
            position={item.position}
            type="dynamic"
            // VVVVVVVV 核心修改：增加摩擦力以穩定堆疊 VVVVVVVV
            friction={0.8}
            restitution={0.1}
        // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        >
            <Box
                args={[w, h, d]} castShadow receiveShadow onPointerDown={onPointerDown} onContextMenu={(e) => { e.preventDefault(); rotateItem(e); }}>
                {/* 拖曳時顯示藍色，否則根據是否在倉庫內顯示顏色 */}
                <meshStandardMaterial color={isDragging ? '#60a5fa' : itemColor} />
            </Box>
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

// 為了方便您直接複製貼上，這裡提供完整的 DraggableItem.jsx 內容
const FullDraggableItem = ({ item, orbitControlsRef }) => {
    const body = useRef();
    const [isDragging, setIsDragging] = useState(false);
    const [isInStorage, setIsInStorage] = useState(true);
    const { camera, gl } = useThree();
    const dragOffset = useRef(new THREE.Vector3());
    const selectedSpace = useStore(state => state.selectedSpace);
    const storageSpaces = useStore(state => state.storageSpaces);

    useFrame(() => {
        if (body.current) {
            const position = body.current.translation();
            const storageDims = storageSpaces[selectedSpace];
            const { w, h, d } = item.dimensions;
            const inX = position.x - w / 2 >= -storageDims.w / 2 && position.x + w / 2 <= storageDims.w / 2;
            const inY = position.y - h / 2 >= 0 && position.y + h / 2 <= storageDims.h;
            const inZ = position.z - d / 2 >= -storageDims.d / 2 && position.z + d / 2 <= storageDims.d / 2;
            setIsInStorage(inX && inY && inZ);
        }
    });

    const onPointerDown = (e) => { e.stopPropagation(); setIsDragging(true); if (orbitControlsRef.current) orbitControlsRef.current.enabled = false; const currentPos = body.current.translation(); dragOffset.current.copy(currentPos).sub(e.point); dragPlane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), e.point); body.current.wakeUp(); body.current.setBodyType(1); };
    const onPointerMove = useCallback((e) => { if (isDragging) { const ray = new THREE.Ray(); const mouse = { x: (e.clientX / gl.domElement.clientWidth) * 2 - 1, y: -(e.clientY / gl.domElement.clientHeight) * 2 + 1 }; ray.setFromCamera(mouse, camera); if (ray.intersectPlane(dragPlane, intersection)) { const newPosition = new THREE.Vector3().copy(intersection).add(dragOffset.current); body.current.setNextKinematicTranslation(newPosition); } } }, [isDragging, camera, gl.domElement]);
    const onPointerUp = useCallback(() => { setIsDragging(isDraggingState => { if (isDraggingState) { if (orbitControlsRef.current) orbitControlsRef.current.enabled = true; body.current.setBodyType(0); } return false; }); }, []);
    useEffect(() => { if (isDragging) { gl.domElement.addEventListener('pointermove', onPointerMove); gl.domElement.addEventListener('pointerup', onPointerUp); gl.domElement.addEventListener('pointerleave', onPointerUp); } return () => { gl.domElement.removeEventListener('pointermove', onPointerMove); gl.domElement.removeEventListener('pointerup', onPointerUp); gl.domElement.removeEventListener('pointerleave', onPointerUp); }; }, [isDragging, gl.domElement, onPointerMove, onPointerUp]);
    const rotateItem = (e) => { e.stopPropagation(); if (isDragging) return; body.current.wakeUp(); const currentRotation = new THREE.Quaternion().copy(body.current.rotation()); const rotationY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2); currentRotation.multiply(rotationY); body.current.setRotation(currentRotation, true); };

    const { w, h, d } = item.dimensions;
    const itemColor = isInStorage ? '#f97316' : '#dc2626';

    return (
        <RigidBody ref={body} colliders='cuboid' position={item.position} type="dynamic" friction={0.8} restitution={0.1}>
            <Box args={[w, h, d]} castShadow receiveShadow onPointerDown={onPointerDown} onContextMenu={(e) => { e.preventDefault(); rotateItem(e); }}>
                <meshStandardMaterial color={isDragging ? '#60a5fa' : itemColor} />
            </Box>
            <Text color="white" fontSize={Math.min(w, d, h) * 0.5} position={[0, h / 2 + 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} anchorX="center" anchorY="middle" maxWidth={w * 0.9} pointerEvents="none">
                {item.name}
            </Text>
        </RigidBody>
    );
};

export { FullDraggableItem as default };