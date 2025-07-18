// /src/components/DraggableItem.jsx (出界變紅版)

import { useRef, useState, useCallback, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Box, Text } from '@react-three/drei';
import * as THREE from 'three';
import useStore from '../store/useStore';

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

    const onPointerDown = (e) => { /* ... 保持不變 ... */ };
    const onPointerMove = useCallback((e) => { /* ... 保持不變 ... */ }, [/* ... */]);
    const onPointerUp = useCallback(() => { /* ... 保持不變 ... */ }, []);
    useEffect(() => { /* ... 保持不變 ... */ }, [/* ... */]);
    const rotateItem = (e) => { /* ... 保持不變 ... */ };

    const { w, h, d } = item.dimensions;
    const itemColor = isInStorage ? '#f97316' : '#dc2626';

    return (
        <RigidBody ref={body} colliders='cuboid' position={item.position} type="dynamic">
            <Box args={[w, h, d]} castShadow receiveShadow onPointerDown={onPointerDown} onContextMenu={(e) => { e.preventDefault(); rotateItem(e); }}>
                <meshStandardMaterial color={isDragging ? '#60a5fa' : itemColor} />
            </Box>
            <Text /* ... 保持不變 ... */ >{item.name}</Text>
        </RigidBody>
    );
}