// /src/components/StorageSpace.jsx (最終修正版 - 補上 import)

// VVVVVV 核心修改：補上遺漏的 RigidBody 引入 VVVVVVVV
import { RigidBody } from '@react-three/rapier';
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
import { Box, Edges } from '@react-three/drei';
import useStore from '../store/useStore';

export default function StorageSpace() {
  const { storageSpaces, selectedSpace } = useStore();
  const dims = storageSpaces[selectedSpace];
  
  return (
    // 我們使用 RigidBody 來讓倉庫的邊框也成為一個物理實體
    // 這樣從外部生成的物品就不會穿透倉庫的牆壁
    <RigidBody type="fixed" colliders="cuboid">
      <Box position={[0, dims.h / 2, 0]} args={[dims.w, dims.h, dims.d]}>
        <meshBasicMaterial transparent opacity={0.05} color="white" />
        <Edges color="white" lineWidth={2} />
      </Box>
    </RigidBody>
  );
}