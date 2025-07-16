import create from 'zustand';

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
  setCustomSpace: (dims) => set((state) => ({ storageSpaces: { ...state.storageSpaces, Custom: dims }, selectedSpace: 'Custom', itemsInScene: [] })),
  addItemToScene: (item, quantity = 1) => { /* 函數內容省略 */ },
  removeItemFromScene: (instanceId) => set((state) => ({ itemsInScene: state.itemsInScene.filter((item) => item.instanceId !== instanceId) })),
  clearAllItems: () => set({ itemsInScene: [] }),
  getCalculations: () => { /* 函數內容省略 */ },
}));

useStore.setState({
  addItemToScene: (item, quantity = 1) => {
    const { storageSpaces, selectedSpace } = useStore.getState();
    const spaceDims = storageSpaces[selectedSpace];
    const newItems = [];
    for (let i = 0; i < quantity; i++) {
      newItems.push({
        ...item,
        instanceId: `${item.id}-${Date.now()}-${i}`,
        position: [ (Math.random() - 0.5) * (spaceDims.w * 0.1), spaceDims.h + i * 0.5, (Math.random() - 0.5) * (spaceDims.d * 0.1) ],
      });
    }
    useStore.setState((state) => ({ itemsInScene: [...state.itemsInScene, ...newItems] }));
  },
  getCalculations: () => {
    const { storageSpaces, selectedSpace, itemsInScene } = useStore.getState();
    const spaceDims = storageSpaces[selectedSpace];
    const spaceVolume = spaceDims.w * spaceDims.h * spaceDims.d;
    let itemsVolume = 0; let itemsCFT = 0;
    itemsInScene.forEach(item => {
      const w_m = item.dimensions.w; const h_m = item.dimensions.h; const d_m = item.dimensions.d;
      itemsVolume += w_m * h_m * d_m;
      const cft = (w_m * 100 * h_m * 100 * d_m * 100) / 28316.846592;
      itemsCFT += cft;
    });
    const usage = spaceVolume > 0 ? (itemsVolume / spaceVolume) * 100 : 0;
    return {
      spaceVolume: spaceVolume.toFixed(2), itemsVolume: itemsVolume.toFixed(2),
      itemsCFT: Math.round(itemsCFT), usage: Math.min(100, usage).toFixed(1),
    };
  }
});

export default useStore;