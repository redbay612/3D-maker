// /src/components/StorageSpace.jsx (最終正確版 - 補上 import)

import { RigidBody } from '@react-three/rapier';
import { Box, Edges } from '@react-three/drei';
import useStore from '../store/useStore';

export default function StorageSpace() {
  const { storageSpaces, selectedSpace } = useStore();
  const dims = storageSpaces[selectedSpace];
  
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <Box position={[0, dims.h / 2, 0]} args={[dims.w, dims.h, dims.d]}>
        <meshBasicMaterial transparent opacity={0.05} color="white" />
        <Edges color="white" lineWidth={2} />
      </Box>
    </RigidBody>
  );
}