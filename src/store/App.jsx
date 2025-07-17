// /src/App.jsx (最終佈局版)

import Scene from './components/Scene';
import ControlPanel from './components/ControlPanel';
import InfoPanel from './components/InfoPanel';

function App() {
  return (
    // 最外層容器，作為所有絕對定位的參考點
    <div className="w-screen h-screen bg-gray-900 relative">
      
      {/* 3D 場程式碼變更說明:**
> 1.  最外層的 `div` 使用 `relative` 定位，作為內部所有 `absolute` 定位元素的參考基準。
> 2.  3D 場景 `<Scene />` 被放在一個使用 `absolute` 定位的 `div` 中，讓它可以填滿整個背景，並設定 `z-0` 將其層級置於最底層。
> 3.  左右兩側的面板分別被放在各自的 `div` 中，並使用 `absolute` 定位將它們固定在左上角和右上角，同時設定 `z-10` 確保它們的層級高於背景的 3D 場景作為背景，填滿整個畫面 */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Scene />
      </div>

      {/* 左側面板，使用絕對定位並提高層級 */}
      <div className="absolute top-4 left-4 z-10">
        <ControlPanel />
      </div>

      {/* 右側面板，使用絕對定位並提高層級 */}
      <div className="absolute top-4 right-4 z-10">
        <InfoPanel />
      </div>

    景，不會被覆蓋。

---

### **提供最終執行步驟**

在您用以上新程式碼完整覆蓋掉 `App.jsx` 檔案之後，請執行最後的部署流程。

1.  **打開 `Node.js command prompt`**。
2.  **用 `cd` 指令進入您的專案資料夾 (`3D-maker`)**。
3.  **執行上傳指令**：
    ```bash
    git add .
    ```
    ```bash
    git commit -m "修正：採用絕對定位實現三欄式佈局"
    ```
    ```bash
    git push origin main
    ```
4.  **執行部署指令**：
    ```bash
    npm run deploy
    ```
5.  </div>
  )
}

export default App;