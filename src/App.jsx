// /src/App.jsx (最終佈局修正版)

import Scene from './components/Scene';
import ControlPanel from './components/ControlPanel';
import InfoPanel from './components/InfoPanel';

function App() {
    return (
        <div className="w-screen h-screen bg-gray-900 relative">
            <div className="absolute inset-0 w-full h-full z-0">
                <Scene />
            </div>
            <div className="absolute top-4 left-4 z-10">
                <ControlPanel />
            </div>
            <div className="absolute top-4 right-4 z-10">
                <InfoPanel />
            </div>
        </div>
    )
}

export default App;