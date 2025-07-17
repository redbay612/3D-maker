// src/components/StorageSpace.jsx

// 1. 將所有 import 語句移至檔案頂部
import { useRapier } from '@react-three/rapier'; // 2. 使用正確的 import 語法
import DraggableItem from './DraggableItem';
// 註：通常不需要在一個檔案中匯入自己，若非特殊用途，下面這行可以刪除
// import StorageSpace from './StorageSpace'; 

export default function StorageSpace() {
  // 假設您需要使用 useRapier 這個 hook
  const { rapier, world } = useRapier();

  // ...組件的其他邏輯...

  return (
    // ...JSX 內容...
  );
}