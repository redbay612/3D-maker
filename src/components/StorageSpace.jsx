
#### **✅ 檔案 1: `/src/components/StorageSpace.jsx`**

**請用以下【最終修正版】的完整程式碼，覆蓋掉您原本的 `/src/components/StorageSpace.jsx` 檔案：**

```javascript
// /src/components/StorageSpace.jsx (最終修正版 - javascript
// /src/components/StorageSpace.jsx (最終修正版 - 補上 import)

// VVVVVV 核心修改：補上遺漏的 RigidBody 引入 VVVVVV
import { RigidBody } from '@react-three/rapier';
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
import { Box, Edges } from '@react-three/drei';
import useStore from '../補上 import)

// VVVVVVVV 核心修改：補上遺漏的 RigidBody 引入 VVVVVVVV
import { RigidBody } from '@react-three/rapier';
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
import { Box, Edges } from '@react-three/drei';
import useStore from '../store/useStore';

export default function StorageSpace() {
  store/useStore';

export default function StorageSpace() {
  const { storageSpaces, selectedSpace } = useStore();
  const dims = storageSpaces[selectedSpace];
  return (
    // 我們將物理實體和視覺效果分開處理
    <>
      {/* 視覺效果：白色的邊框 */}
      <Box position={[0, dims.h / 2, 0]} args={[dims.w, dims.hconst { storageSpaces, selectedSpace } = useStore();
  const dims = storageSpaces[selectedSpace];
  
  return (
    // 我們使用 RigidBody 來讓倉庫的邊框也成為一個物理實體
    // 這樣從外部生成的物品就不會穿透倉庫的牆壁
    <RigidBody type="fixed" coll, dims.d]}>
        <meshBasicMaterial transparent opacity={0} />
        <Edges color="white" lineWidth={2} />
      </Box>

      {/* 物理碰撞體 */}
      <RigidBody type="fixed" colliders="cuboid">
        <Box position={[0, dims.h / iders="cuboid">
      <Box position={[0, dims.h / 2, 0]} args={[dims.w, dims.h, dims.d]}>
        <meshBasicMaterial transparent opacity={0.05} color="white" />
        <Edges color="white" lineWidth={2} />
      </Box>
    </RigidBody>
  );
}