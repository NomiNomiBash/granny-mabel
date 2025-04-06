// src/scenes/Transition.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const TransitionContainer = styled.div`
    position: relative;
    width: 100vw;
    height: 100vh;
    background-color: #0B0C10;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const KitchenBackground = styled(motion.div)`
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #FFF8E1;
    z-index: 1;
`;

const DigitalOverlay = styled(motion.div)`
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(69, 162, 158, 0.2) 0%, rgba(11, 12, 16, 0.9) 70%);
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const GridContainer = styled(motion.div)`
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 3;
    opacity: 0;
`;

const GridLine = styled.div`
    position: absolute;
    background-color: #66FCF1;
    opacity: 0.15;

    &.horizontal {
        height: 1px;
        width: 100%;
        left: 0;
    }

    &.vertical {
        width: 1px;
        height: 100%;
        top: 0;
    }
`;

const TransitionMessage = styled(motion.div)`
    z-index: 4;
    color: #66FCF1;
    text-align: center;
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 30px;
    max-width: 80%;
`;

const LoadingBar = styled(motion.div)`
    width: 400px;
    height: 8px;
    background-color: #1F2833;
    border-radius: 4px;
    overflow: hidden;
    z-index: 4;
`;

const LoadingProgress = styled(motion.div)`
    height: 100%;
    background-color: #66FCF1;
`;

const TariffPanel = styled(motion.div)`
    margin-top: 50px;
    background-color: #1F2833;
    border: 2px solid #45A29E;
    border-radius: 5px;
    padding: 20px;
    width: 80%;
    max-width: 600px;
    z-index: 4;
    opacity: 0;
`;

const PanelTitle = styled.h2`
    color: #C5C6C7;
    text-align: center;
    margin-top: 0;
    margin-bottom: 20px;
`;

const PanelDescription = styled.p`
    color: #C5C6C7;
    text-align: center;
    margin-bottom: 20px;
`;

function Transition() {
    const navigate = useNavigate();

    // Auto-navigate after animation completes
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/tariff-chamber');
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    // Create grid lines
    const horizontalGridLines = [];
    const verticalGridLines = [];

    for (let i = 1; i < 10; i++) {
        horizontalGridLines.push(
            <GridLine
                key={`h-${i}`}
                className="horizontal"
                style={{ top: `${i * 100}px` }}
            />
        );
    }

    for (let i = 1; i < 12; i++) {
        verticalGridLines.push(
            <GridLine
                key={`v-${i}`}
                className="vertical"
                style={{ left: `${i * 100}px` }}
            />
        );
    }

    return (
        <TransitionContainer>
            {/* Kitchen background fading out */}
            <KitchenBackground
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 2 }}
            />

            {/* Digital world fading in */}
            <DigitalOverlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
            />

            {/* Grid appearing */}
            <GridContainer
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2 }}
            >
                {horizontalGridLines}
                {verticalGridLines}
            </GridContainer>

            {/* Clear message about what's happening */}
            <TransitionMessage
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
            >
                Entering Global Trade Simulation
            </TransitionMessage>

            {/* Loading bar for visual feedback */}
            <LoadingBar>
                <LoadingProgress
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 4 }}
                />
            </LoadingBar>

            {/* Tariff chamber preview */}
            <TariffPanel
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 2.5 }}
            >
                <PanelTitle>Tariff Control Chamber</PanelTitle>
                <PanelDescription>
                    Adjust global trade policies and observe their effects on international economies.
                    Your decisions will impact global trade patterns and food distribution.
                </PanelDescription>
            </TariffPanel>
        </TransitionContainer>
    );
}

export default Transition;