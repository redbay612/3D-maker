// /src/App.jsx (�̲׸��|�ץ���)

import { Canvas } from '@react-three/fiber';
import Scene from './components/Scene';
import ControlPanel from './components/ControlPanel';
import InfoPanel from './components/InfoPanel';

function App() {
    return (
        <div className="w-screen h-screen bg-gray-900 relative">
            <ControlPanel />
            <InfoPanel />
            �n���A����z���Ѫ��̷s���~�I�ϡC�ڱN�Y���`�z�ҽT�ߪ��M�~<div className="w-full h-full">
                <Scene />
            </div>
        </div>
    );
}

export default App;