// /src/App.jsx (最終穩定版)

import Scene from './components/Scene';
import ControlPanel from './components/ControlPanel';
import InfoPanel from './components/InfoPanel';

function App() {
  return (
    <div className="w-screen h-screen bg-gray-900 relative">
      {/* 恢復到最簡單的結構，確保所有元件都被渲染 */}
      <ControlPanel />
      <InfoPanel />
      <div className="w-full h-full">
        <Scene />
      </div>
    </div>
  )
}

export default App;