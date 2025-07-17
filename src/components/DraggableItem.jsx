// /src/components/DraggableItem.jsx (最終穩定版 v3)

import { useRef, useState } from 'react';
import { RigidBody } from '@react-three/rapier';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';

export default function DraggableItem({ item, orbitControlsRef }) {
    const body = useRef();
    const [isDragging, setIsDragging] = useState(false);

    // 將拖曳相關的變數移到 ref 中，以在 re-render 之間保持，且不觸發渲染
    const dragPlane = useRef(new THREE.Plane());
    const dragOffset = useRef(new THREE.Vector3());

    const onPointerDown = (e) => {
        e.stopPropagation();
        if (orbitControlsRef.current) {
            orbitControlsRef.current.enabled = false;
        }

        // 計算偏移量
        const currentPos = body.current.translation();
        dragOffset.current.copy(currentPos).sub(e.point);

        // 設置拖曳平面在當前物體的高度
        dragPlane.current.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), e.point);

        body.current.wakeUp();
        body.current.setBodyType(1); // Kinematic
        setIsDragging(true);
    };

    const onPointerMove = (e) => {
        // 只有在 isDragging 為 true 時才執行
        if (isDragging) {
            e.stopPropagation();
            const intersection = new THREE.Vector3();
            // 在 onPointerMove 事件中計算與平面的交點
            if (e.ray.intersectPlane(dragPlane.current, intersection)) {
                // 加上偏移量來計算新位置
                const newPosition = intersection.add(dragOffset.current);
                body.current.setNextKinematicTranslation(newPosition);
            }
        }
    };

    const onPointerUp = (e) => {
        e.stopPropagation();
        if (isDragging) {
            if (orbitControlsRef.current) {
                orbitControlsRef.current.enabled = true;
            }
            body.current.setBodyType(0); // Dynamic
            setIsDragging(false);
        }
    };

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
        <RigidBody
            ref={body}
            colliders='cuboid'
            position={item.position}
            type="dynamic"
        >
            <Box
                args={[w, h, d]}
                castShadow
                receiveShadow
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerOut={onPointerUp} // 當滑鼠移出也停止拖曳
                onContextMenu={(e) => { e.preventDefault(); rotateItem(e); }}
            >
                <meshStandardMaterial color={isDragging ? '#60a5fa' : '#f97316'} />
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