import { useState } from 'react';
import Scene from './components/Scene';
import ControlPanel from './components/ControlPanel';
import InfoPanel from './components/InfoPanel';

function App() {
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  return (
    <div className="w-screen h-screen bg-gray-900 overflow-hidden relative">
      <ControlPanel isOpen={isLeftPanelOpen} onClose={() => setIsLeftPanelOpen(false)} />
      <InfoPanel isOpen={isRightPanelOpen} onClose={() => setIsRightPanelOpen(false)} />
      
      <div className="w-full h-full">
        <Scene />
      </div>

      <div className="md:hidden absolute top-4 left-4 z-20">
        <button onClick={() => setIsLeftPanelOpen(true)} className="bg-gray-800/80 text-white p-3 rounded-full shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      <div className="md:hidden absolute top-4 right-4 z-20">
        <button onClick={() => setIsRightPanelOpen(true)} className="bg-gray-800/80 text-white p-3 rounded-full shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
        </button>
      </div>
    </div>
  )
}

export default App;