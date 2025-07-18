// /src/components/DraggableItem.jsx (最終顏色修正版)

import { useRef, useState, useCallback, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';
import useStore from '../store/useStore';

const dragPlane = new THREE.Plane();
const intersection = new THREE.Vector3();

export default function DraggableItem({ item, orbitControlsRef }) {
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

    // ... onPointerDown, onPointerMove, onPointerUp, useEffect, rotateItem 函數保持不變 ...

    const { w, h, d } = item.dimensions;

    // VVVVVVVV 核心修改：更新顏色邏輯 VVVVVVVV
    let itemColor = '#f97316'; // 預設為橘色
    if (isDragging) {
        itemColor = '#60a5fa'; // 拖曳中為藍色
    } else if (!isInStorage) {
        itemColor = '#dc2626'; // 未拖曳且在倉庫外時為紅色
    }
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    return (
        <RigidBody ref={body} colliders='cuboid' position={item.position} type="dynamic" friction={0.8} restitution={0.1}>
            <Box args={[w, h, d]} castShadow receiveShadow onPointerDown={onPointerDown} onContextMenu={(e) => { e.preventDefault(); rotateItem(e); }}>
                <meshStandardMaterial color={itemColor} />
            </Box>
            <Text /* ... 保持不變 ... */ >{item.name}</Text>
        </RigidBody>
    );
}

// 為了方便您直接複製貼上，這裡提供完整的 DraggableItem.jsx 內容
// (省略了重複的邏輯，您只需要修改上面的 return 部分即可)