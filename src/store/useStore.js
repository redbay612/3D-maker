// /src/store/useStore.js (緊密堆疊演算法版)

import create from 'zustand';
import * as THREE from 'three';

const checkCollision = (box1, box2) => { /* 函數內容省略 */ };

const useStore = create((set, get) => ({
    // ... items 和 storageSpaces 列表保持不變 ...

    // VVVVVV 核心修改：升級 addItemToScene 演算法 VVVVVV
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
            let lowestY = Infinity;
            const step = 0.01; // 提高搜尋精度

            const existingBoxes = itemsInScene.map(it => {
                const pos = new THREE.Vector3().fromArray(it.position);
                const dim = it.dimensions;
                return new THREE.Box3().setFromCenterAndSize(pos, new THREE.Vector3(dim.w, dim.h, dim.d));
            });

            const potentialSurfaces = [{ y: 0, w: spaceDims.w, d: spaceDims.d, x: 0, z: 0 }];
            itemsInScene.forEach(existingItem => {
                potentialSurfaces.push({
                    y: existingItem.position[1] + existingItem.dimensions.h / 2,
                    w: existingItem.dimensions.w, d: existingItem.dimensions.d,
                    x: existingItem.position[0], z: existingItem.position[2],
                });
            });

            potentialSurfaces.sort((a, b) => a.y - b.y);

            for (const surface of potentialSurfaces) {
                const potentialY = surface.y + newItemDims.h / 2;
                if (potentialY + newItemDims.h / 2 > spaceDims.h) continue;

                let placed = false;
                // 從表面的左後角開始掃描
                for (let x = surface.x - surface.w / 2 + newItemDims.w / 2; x <= surface.x + surface.w / 2 - newItemDims.w / 2; x += step) {
                    for (let z = surface.z - surface.d / 2 + newItemDims.d / 2; z <= surface.z + surface.d / 2 - newItemDims.d / 2; z += step) {

                        // 檢查新位置的邊界是否超出倉庫
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
                            if (potentialY < lowestY) {
                                lowestY = potentialY;
                                bestPosition = [newPos.x, newPos.y, newPos.z];
                            }
                        }
                    }
                }
            }

            if (bestPosition) {
                const newItem = { ...item, instanceId: `${item.id}-${Date.now()}-${i}`, position: bestPosition };
                set((state) => ({ itemsInScene: [...state.itemsInScene, newItem] }));
            } else {
                alert(`倉庫已滿或找不到合適空間，無法再放入「${item.name}」！`);
                return;
            }
        }
    },
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    // ... 其他函數保持不變 ...
}));

// ... 確保其他函數的完整性 ...
useStore.setState({ /* ... */ });
export default useStore;