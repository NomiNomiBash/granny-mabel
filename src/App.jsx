// src/App.jsx
import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Kitchen from './scenes/Kitchen';
import TVNews from './scenes/TVNews';
import Transition from './scenes/Transition';
import TariffChamber from './scenes/TariffChamber';
import ReturnTransition from './scenes/ReturnTransition';
import ChangedKitchen from './scenes/ChangedKitchen';

function App() {
    const [gameState, setGameState] = useState({
        tariffRates: {
            seafoodImports: 50,
            agriculturalSubsidies: 50,
            tradeAgreements: 50
        }
    });

    return (
        <div className="app">
            <Routes>
                <Route path="/" element={<Kitchen gameState={gameState} setGameState={setGameState} />} />
                <Route path="/tv" element={<TVNews gameState={gameState} setGameState={setGameState} />} />
                <Route path="/transition" element={<Transition gameState={gameState} setGameState={setGameState} />} />
                <Route path="/tariff-chamber" element={<TariffChamber gameState={gameState} setGameState={setGameState} />} />
                <Route path="/return" element={<ReturnTransition gameState={gameState} setGameState={setGameState} />} />
                <Route path="/changed-kitchen" element={<ChangedKitchen gameState={gameState} setGameState={setGameState} />} />
            </Routes>
        </div>
    );
}

export default App;