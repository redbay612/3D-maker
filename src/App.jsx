// /src/App.jsx (最終佈局修正版)

import Scene from './components/Scene';
import ControlPanel from './components/ControlPanel';
import InfoPanel from './components/InfoPanel';

function App() {
  return (
    // 最外層容器，作為所有絕對定位的參考點
    <div className="w-screen h-screen bg-gray-900 relative">
      
      {/* 3D 場景作為背景，填滿整個畫面 */}
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

    </div>
  )
}

export default App;