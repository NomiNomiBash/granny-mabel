// src/App.jsx
import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Kitchen from './scenes/Kitchen';
import TVNews from './scenes/TVNews';
import Transition from './scenes/Transition';
import TariffChamber from './scenes/TariffChamber';
import ReturnTransition from './scenes/ReturnTransition';
import ChangedKitchen from './scenes/ChangedKitchen';
import AudioPreloader from './components/shared/AudioPreloader';

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [gameState, setGameState] = useState({
        tariffRates: {
            seafoodImports: 50,
            agriculturalSubsidies: 50,
            tradeAgreements: 50
        }
    });

    // Handle completion of audio preloading
    const handlePreloadComplete = () => {
        setIsLoading(false);
    };

    return (
        <div className="app">
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <AudioPreloader
                        key="preloader"
                        onComplete={handlePreloadComplete}
                    />
                ) : (
                    <Routes>
                        <Route path="/" element={<Kitchen gameState={gameState} setGameState={setGameState} />} />
                        <Route path="/tv" element={<TVNews gameState={gameState} setGameState={setGameState} />} />
                        <Route path="/transition" element={<Transition gameState={gameState} setGameState={setGameState} />} />
                        <Route path="/tariff-chamber" element={<TariffChamber gameState={gameState} setGameState={setGameState} />} />
                        <Route path="/return" element={<ReturnTransition gameState={gameState} setGameState={setGameState} />} />
                        <Route path="/changed-kitchen" element={<ChangedKitchen gameState={gameState} setGameState={setGameState} />} />
                    </Routes>
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;