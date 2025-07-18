// /src/store/useStore.js (智慧堆疊演算法版 v2)

import create from 'zustand';
import * as THREE from 'three';

const checkCollision = (box1, box2) => {
    const buffer = 0.001; // 添加一個微小的緩衝區防止精度問題
    return (
        box1.min.x < box2.max.x - buffer && box1.max.x > box2.min.x + buffer &&
        box1.min.y < box2.max.y - buffer && box1.max.y > box2.min.y + buffer &&
        box1.min.z < box2.max.z - buffer && box1.max.z > box2.min.z + buffer
    );
};

const useStore = create((set, get) => ({
    items: [
        { id: 's-box', name: '小紙箱', dimensions: { w: 0.35, h: 0.25, d: 0.30 } },
        { id: 'm-box', name: '中紙箱', dimensions: { w: 0.48, h: 0.32, d: 0.36 } },
        { id: 'l-box', name: '大型箱 (L)', dimensions: { w: 0.6, h: 0.4, d: 0.45 } },
        { id: 'washer', name: '直立洗衣機', dimensions: { w: 0.65, h: 1.05, d: 0.65 } },
        { id: 'mattress', name: '單人床墊', dimensions: { w: 0.9, h: 1.9, d: 0.2 } },
        { id: 'fridge', name: '小冰箱', dimensions: { w: 0.6, h: 1.0, d: 0.6 } },
    ],
    storageSpaces: {
        '100材': { w: 1.1, h: 2.4, d: 1.1 }, '200材': { w: 1.5, h: 2.4, d: 1.5 },
        '300材': { w: 1.9, h: 2.4, d: 1.9 }, 'Custom': { w: 2, h: 2.5, d: 2 },
    },
    selectedSpace: '200材',
    itemsInScene: [],

    setStorageSpace: (size) => set({ selectedSpace: size, itemsInScene: [] }),
    setCustomSpace: (dims) => set((state) => ({ storageSpaces: { ...state.storageSpaces, Custom: dims }, selectedSpace: 'Custom', itemsInScene: [] })),

    addItemToScene: (item, quantity = 1) => {
        for (let i = 0; i < quantity; i++) {
            const { itemsInScene, storageSpaces, selectedSpace } = get();
            const spaceDims = storageSpaces[selectedSpace];
            const newItemDims = item.dimensions;

            if (newItemDims.w > spaceDims.w || newItemDims.h > spaceDims.h || newItemDims.d > spaceDims.d) {
                alert(`「${item.name}」的尺寸超過倉庫大小，無法放入！`); return;
            }

            let bestPosition = null;
            let lowestY = Infinity;
            const step = 0.05;

            const existingBoxes = itemsInScene.map(it => new THREE.Box3().setFromCenterAndSize(new THREE.Vector3().fromArray(it.position), new THREE.Vector3(it.dimensions.w, it.dimensions.h, it.dimensions.d)));

            const potentialSurfaces = [{ y: 0, w: spaceDims.w, d: spaceDims.d, x: 0, z: 0 }];
            itemsInScene.forEach(it => {
                potentialSurfaces.push({
                    y: it.position[1] + it.dimensions.h / 2,
                    w: it.dimensions.w, d: it.dimensions.d,
                    x: it.position[0], z: it.position[2],
                });
            });

            potentialSurfaces.sort((a, b) => a.y - b.y);

            for (const surface of potentialSurfaces) {
                const potentialY = surface.y + newItemDims.h / 2;
                if (potentialY + newItemDims.h / 2 > spaceDims.h) continue;

                let placedInSurface = false;
                for (let x = -spaceDims.w / 2 + newItemDims.w / 2; x <= spaceDims.w / 2 - newItemDims.w / 2; x += step) {
                    for (let z = -spaceDims.d / 2 + newItemDims.d / 2; z <= spaceDims.d / 2 - newItemDims.d / 2; z += step) {

                        const newPos = new THREE.Vector3(x, potentialY, z);
                        const newBox = new THREE.Box3().setFromCenterAndSize(newPos, new THREE.Vector3(newItemDims.w, newItemDims.h, newItemDims.d));

                        if (newBox.min.x < -spaceDims.w / 2 || newBox.max.x > spaceDims.w / 2 ||
                            newBox.min.z < -spaceDims.d / 2 || newBox.max.z > spaceDims.d / 2) {
                            continue;
                        }

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
                                placedInSurface = true;
                            }
                        }
                    }
                }
                // 如果在當前最低層級找到了位置，就使用它並停止搜索更高層級
                if (placedInSurface && bestPosition) {
                    break;
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

    removeItemFromScene: (instanceId) => set((state) => ({ itemsInScene: state.itemsInScene.filter((item) => item.instanceId !== instanceId) })),
    clearAllItems: () => set({ itemsInScene: [] }),
    getCalculations: () => { /* 函數內容省略 */ },
}));

useStore.setState({ getCalculations: useStore.getState().getCalculations });

export default useStore;