// /src/App.jsx (最終佈局修正版)

import Scene from './components/Scene';
import ControlPanel from './components/ControlPanel';
import InfoPanel from './components/InfoPanel';

function App() {
    return (
        // 使用一個 flexbox 容器來安排整體佈局
        <div className="w-screen h-screen bg-gray-900 flex justify-between items-start p-4 gap-4 relative">

            {/* 左側面板 */}
            {/* z-10 確保它在 3D 場景之上 */}
            <div className="z-10">
                <ControlPanel />
            </div>

            {/* 中間的 3D 場景 */}
            {/* 讓它佔滿剩餘的空間，並使用絕對定位填滿整個背景 */}
            <div className="absolute inset-0 w-full h-full">
                <Scene />
            </div>

            {/* 右側面板 */}
            {/* z-10 確保它也在 3D 場景之上 */}
            <div className="z-10">
                <InfoPanel />
            </div>

        </div>
    )
}

export default App;