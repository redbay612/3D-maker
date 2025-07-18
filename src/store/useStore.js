// /src/store/useStore.js (最終修正版 - 清理語法錯誤)

import create from 'zustand';
import * as THREE from 'three';

const checkCollision = (box1, box2) => {
    return box1.min.x < box2.max.x && box1.max.x > box2.min.x &&
        box1.min.y < box2.max.y && box1.max.y > box2.min.y &&
        box1.min.z < box2.max.z && box1.max.z > box2.min.z;
};

// 這是 useStore 的唯一創建實例
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
        '100材': { w: 1.1, h: 2.4, d: 1.1 },
        '200材': { w: 1.5, h: 2.4, d: 1.5 },
        '300材': { w: 1.9, h: 2.4, d: 1.9 },
        'Custom': { w: 2, h: 2.5, d: 2 },
    },
    selectedSpace: '200材',
    itemsInScene: [],

    setStorageSpace: (size) => set({ selectedSpace: size, itemsInScene: [] }),
    setCustomSpace: (dims) => set((state) => ({
        storageSpaces: { ...state.storageSpaces, Custom: dims },
        selectedSpace: 'Custom',
        itemsInScene: []
    })),

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
            const step = 0.05;

            const existingBoxes = itemsInScene.map(it => {
                const pos = new THREE.Vector3().fromArray(it.position);
                const dim = it.dimensions;
                return new THREE.Box3().setFromCenterAndSize(pos, new THREE.Vector3(dim.w, dim.h, dim.d));
            });

            const potentialSurfaces = [{ y: 0, minX: -spaceDims.w / 2, maxX: spaceDims.w / 2, minZ: -spaceDims.d / 2, maxZ: spaceDims.d / 2 }];
            itemsInScene.forEach(existingItem => {
                potentialSurfaces.push({
                    y: existingItem.position[1] + existingItem.dimensions.h / 2,
                    minX: existingItem.position[0] - existingItem.dimensions.w / 2, maxX: existingItem.position[0] + existingItem.dimensions.w / 2,
                    minZ: existingItem.position[2] - existingItem.dimensions.d / 2, maxZ: existingItem.position[2] + existingItem.dimensions.d / 2,
                });
            });

            potentialSurfaces.sort((a, b) => a.y - b.y);

            for (const surface of potentialSurfaces) {
                const potentialY = surface.y + newItemDims.h / 2;
                if (potentialY + newItemDims.h / 2 > spaceDims.h) continue;

                let placed = false;
                for (let x = -spaceDims.w / 2 + newItemDims.w / 2; x <= spaceDims.w / 2 - newItemDims.w / 2; x += step) {
                    for (let z = -spaceDims.d / 2 + newItemDims.d / 2; z <= spaceDims.d / 2 - newItemDims.d / 2; z += step) {

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

    getCalculations: () => {
        const { storageSpaces, selectedSpace, itemsInScene } = get();
        const spaceDims = storageSpaces[selectedSpace];
        const spaceVolume = spaceDims.w * spaceDims.h * spaceDims.d;
        let itemsVolume = 0;
        let itemsCFT = 0;

        itemsInScene.forEach(item => {
            const w_m = item.dimensions.w;
            const h_m = item.dimensions.h;
            const d_m = item.dimensions.d;
            itemsVolume += w_m * h_m * d_m;
            const cft = (w_m * 100 * h_m * 100 * d_m * 100) / 28316.846592;
            itemsCFT += cft;
        });

        const usage = spaceVolume > 0 ? (itemsVolume / spaceVolume) * 100 : 0;

        return {
            spaceVolume: spaceVolume.toFixed(2),
            itemsVolume: itemsVolume.toFixed(2),
            itemsCFT: Math.round(itemsCFT),
            usage: Math.min(100, usage).toFixed(1),
        };
    },
}));

// 這是唯一的導出
export default useStore;