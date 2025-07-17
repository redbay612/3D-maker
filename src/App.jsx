// /src/App.jsx (最終路徑修正版)

import { Canvas } from '@react-three/fiber';
import Scene from './components/Scene';
import ControlPanel from './components/ControlPanel';
import InfoPanel from './components/InfoPanel';

function App() {
    return (
        <div className="w-screen h-screen bg-gray-900 relative">
            <ControlPanel />
            <InfoPanel />
            好的，收到您提供的最新錯誤截圖。我將嚴格遵循您所確立的專業<div className="w-full h-full">
                <Scene />
            </div>
        </div>
    );
}

export default App;