// /src/store/useStore.js (最終堆疊演算法版)

import create from 'zustand';
import * as THREE from 'three';

const checkCollision = (box1, box2) => {
    return box1.min.x < box2.max.x && box1.max.x > box2.min.x &&
        box1.min.y < box2.max.y && box1.max.y > box2.min.y &&
        box1.min.z < box2.max.z && box1.max.z > box2.min.z;
};

const useStore = create((set, get) => ({
    // ... items 和 storageSpaces 列表保持不變 ...
    items: [ /* ... */],
    storageSpaces: { /* ... */ },
    selectedSpace: '200材',
    itemsInScene: [],

    // ... setStorageSpace, setCustomSpace 等 action 保持不變 ...

    addItemToScene: (item, quantity = 1) => {
        for (let i = 0; i < quantity; i++) {
            const { itemsInScene, storageSpaces, selectedSpace } = get();
            const spaceDims = storageSpaces[selectedSpace];
            const newItemDims = item.dimensions;

            if (newItemDims.w > spaceDims.w || newItemDims.h > spaceDims.h || newItemDims.d > spaceDims.d) {
                alert(`「${item.name}」的尺寸超過倉庫大小，無法放入！`);
                return;
            }

            let bestPosition = null;
            const step = 0.05; // 搜尋的精細度

            const existingBoxes = itemsInScene.map(it => {
                const pos = new THREE.Vector3().fromArray(it.position);
                const dim = it.dimensions;
                return new THREE.Box3().setFromCenterAndSize(pos, new THREE.Vector3(dim.w, dim.h, dim.d));
            });

            // VVVVVVVV 升級演算法：創建可放置的表面 VVVVVVVV
            const potentialSurfaces = [
                // 1. 地板表面
                { y: 0, minX: -spaceDims.w / 2, maxX: spaceDims.w / 2, minZ: -spaceDims.d / 2, maxZ: spaceDims.d / 2 }
            ];
            // 2. 已放置物品的頂部表面
            itemsInScene.forEach(existingItem => {
                potentialSurfaces.push({
                    y: existingItem.position[1] + existingItem.dimensions.h / 2,
                    minX: existingItem.position[0] - existingItem.dimensions.w / 2,
                    maxX: existingItem.position[0] + existingItem.dimensions.w / 2,
                    minZ: existingItem.position[2] - existingItem.dimensions.d / 2,
                    maxZ: existingItem.position[2] + existingItem.dimensions.d / 2,
                });
            });

            // 按高度從低到高排序，優先放在最底層
            potentialSurfaces.sort((a, b) => a.y - b.y);

            // 遍歷所有可能的表面尋找位置
            for (const surface of potentialSurfaces) {
                const potentialY = surface.y + newItemDims.h / 2;
                // 如果這個高度已經超出倉庫，就不用再找了
                if (potentialY + newItemDims.h / 2 > spaceDims.h) continue;

                let placed = false;
                for (let x = surface.minX + newItemDims.w / 2; x <= surface.maxX - newItemDims.w / 2; x += step) {
                    for (let z = surface.minZ + newItemDims.d / 2; z <= surface.maxZ - newItemDims.d / 2; z += step) {

                        // 檢查新位置是否超出倉庫邊界
                        if (x - newItemDims.w / 2 < -spaceDims.w / 2 || x + newItemDims.w / 2 > spaceDims.w / 2 ||
                            z - newItemDims.d / 2 < -spaceDims.d / 2 || z + newItemDims.d / 2 > spaceDims.d / 2) {
                            continue;
                        }

                        const newPos = new THREE.Vector3(x, potentialY, z);
                        const newBox = new THREE.Box3().setFromCenterAndSize(newPos, new THREE.Vector3(newItemDims.w, newItemDims.h, newItemDims.d));

                        let collision = false;
                        for (const existingBox of existingBoxes) {
                            if (checkCollision(newBox, existingBox)) {
                                collision = true;
                                break;
                            }
                        }

                        if (!collision) {
                            bestPosition = [newPos.x, newPos.y, newPos.z];
                            placed = true;
                            break;
                        }
                    }
                    if (placed) break;
                }
                if (placed) break;
            }
            // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

            if (bestPosition) {
                const newItem = { ...item, instanceId: `${item.id}-${Date.now()}-${i}`, position: bestPosition };
                set((state) => ({ itemsInScene: [...state.itemsInScene, newItem] }));
            } else {
                alert(`倉庫已滿或找不到合適空間，無法再放入「${item.name}」！`);
                return;
            }
        }
    },

    // ... 其他函數保持不變 ...
}));

// 確保其他函數的完整性
useStore.setState({ /* ... getCalculations 等函數 ... */ });
export default useStore;