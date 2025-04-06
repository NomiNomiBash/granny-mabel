// src/scenes/ReturnTransition.jsx
import { useEffect, useState } from 'react';
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
    align-items: center;
    padding: 20px 20px 80px 20px;

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, transparent 0%, #144D53 70%, #66A5AD 100%);
        opacity: 0;
        transition: opacity 2s ease;
        animation: fadeInGradient 3s forwards;
        animation-delay: 2s;
        pointer-events: none;
        z-index: 1;
    }

    @keyframes fadeInGradient {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;

const GridContainer = styled(motion.div)`
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 1;
`;

// Matching the grid lines from TariffChamber
const GridLine = styled(motion.div)`
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

// Styled more like WorldMapPanel from TariffChamber
const MapInterface = styled(motion.div)`
    position: absolute;
    top: 140px;
    left: 20px;
    width: 40%;
    max-width: 560px;
    background-color: #1F2833;
    border: 2px solid #45A29E;
    border-radius: 5px;
    padding: 20px;
    height: 450px;
    z-index: 2;
`;

const MapTitle = styled.h2`
    margin-top: 0;
    margin-bottom: 20px;
    color: #66FCF1;
    font-size: 18px;
    text-align: center;
`;

const WorldMapContainer = styled.div`
    position: relative;
    width: 100%;
    height: calc(100% - 30px);
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const WorldMapSVG = styled.svg`
    width: 100%;
    height: 100%;
`;

// CountryMarker styled similar to those in TariffChamber
const CountryMarker = styled(motion.div)`
    position: absolute;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #66FCF1;
    opacity: 0.8;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: bold;
    box-shadow: 0 0 10px rgba(102, 252, 241, 0.5);
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        transform: translate(-50%, -50%) scale(1.1);
        box-shadow: 0 0 15px rgba(102, 252, 241, 0.7);
    }
`;

const TransitionMessage = styled(motion.div)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 4;
    color: #C5C6C7;
    text-align: center;
    font-size: 24px;
    max-width: 80%;
    background-color: rgba(31, 40, 51, 0.8);
    border: 2px solid #45A29E;
    border-radius: 5px;
    padding: 20px;
`;

const CoastalScene = styled(motion.div)`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 200px;
    z-index: 3;
    overflow: hidden;
`;

const CoastalOverlay = styled(motion.div)`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 150px;
    background: linear-gradient(to bottom, rgba(102, 165, 173, 0) 0%, rgba(102, 165, 173, 0.6) 40%, rgba(102, 165, 173, 1) 100%);
`;

const Wave = styled(motion.div)`
    position: absolute;
    width: 100%;
    height: 35px;
    bottom: ${props => props.bottom || 0}px;

    &::before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.25' fill='%23FFF8E1'%3E%3C/path%3E%3Cpath d='M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z' opacity='.5' fill='%23FFF8E1'%3E%3C/path%3E%3Cpath d='M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z' fill='%23FFF8E1'%3E%3C/path%3E%3C/svg%3E") no-repeat;
        background-size: cover;
    }
`;

// Specific tariff-related elements that fade out
const TariffElement = styled(motion.div)`
    position: absolute;
    background-color: #1F2833;
    border: 1px solid #45A29E;
    border-radius: 3px;
    padding: 8px;
    font-size: 14px;
    color: #C5C6C7;
    z-index: 3;
`;

function ReturnTransition() {
    const navigate = useNavigate();
    const [showVietnamMarker, setShowVietnamMarker] = useState(false);

    // After animation completes, navigate to changed kitchen
    useEffect(() => {
        // Initial delay before starting transition animations
        // This allows the component to render in the same position as TariffChamber first
        const initialDelay = setTimeout(() => {
            setShowVietnamMarker(true);
        }, 1000);

        // Navigate to next scene after animations complete
        const navigationTimer = setTimeout(() => {
            navigate('/changed-kitchen');
        }, 5000);

        return () => {
            clearTimeout(initialDelay);
            clearTimeout(navigationTimer);
        };
    }, [navigate]);

    // Create grid lines that match TariffChamber's grid
    const horizontalGridLines = [];
    const verticalGridLines = [];

    // Using the same grid line pattern as TariffChamber
    for (let i = 1; i < 12; i++) {
        horizontalGridLines.push(
            <GridLine
                key={`h-${i}`}
                className="horizontal"
                style={{ top: `${i * 60}px` }}
                animate={{ opacity: 0 }}
                transition={{ duration: 2, delay: i * 0.1 }}
            />
        );
    }

    for (let i = 1; i < 24; i++) {
        verticalGridLines.push(
            <GridLine
                key={`v-${i}`}
                className="vertical"
                style={{ left: `${i * 60}px` }}
                animate={{ opacity: 0 }}
                transition={{ duration: 2, delay: i * 0.1 }}
            />
        );
    }

    // Country data similar to TariffChamber
    const countries = [
        { country: "European Union", position: { top: 40, left: 45 } },
        { country: "China", position: { top: 45, left: 70 } },
        { country: "Vietnam", position: { top: 55, left: 73 } },
        { country: "Thailand", position: { top: 60, left: 70 } },
        { country: "Japan", position: { top: 40, left: 80 } }
    ];

    return (
        <TransitionContainer>
            {/* Grid fading away - using same pattern as TariffChamber */}
            <GridContainer>
                {horizontalGridLines}
                {verticalGridLines}
            </GridContainer>

            {/* Map interface styled like WorldMapPanel from TariffChamber */}
            <MapInterface
                initial={{ opacity: 1 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <MapTitle>Global Trade Map - Transitioning</MapTitle>

                <WorldMapContainer>
                    {/* Simple world map outline - similar to TariffChamber */}
                    <WorldMapSVG viewBox="0 0 100 100">
                        <path
                            d="M10,30 Q20,25 30,30 Q40,35 50,30 Q60,25 70,35 Q80,40 90,35"
                            fill="none"
                            stroke="#45A29E"
                            strokeWidth="0.5"
                            opacity="0.5"
                        />
                        <path
                            d="M15,40 Q25,45 35,40 Q45,35 55,40 Q65,45 75,40 Q85,35 95,40"
                            fill="none"
                            stroke="#45A29E"
                            strokeWidth="0.5"
                            opacity="0.5"
                        />
                        <path
                            d="M10,50 Q20,55 30,50 Q40,45 50,50 Q60,55 70,50 Q80,45 90,50"
                            fill="none"
                            stroke="#45A29E"
                            strokeWidth="0.5"
                            opacity="0.5"
                        />
                        <path
                            d="M15,60 Q25,55 35,60 Q45,65 55,60 Q65,55 75,60 Q85,65 95,60"
                            fill="none"
                            stroke="#45A29E"
                            strokeWidth="0.5"
                            opacity="0.5"
                        />
                        <path
                            d="M10,70 Q20,65 30,70 Q40,75 50,70 Q60,65 70,70 Q80,65 90,70"
                            fill="none"
                            stroke="#45A29E"
                            strokeWidth="0.5"
                            opacity="0.5"
                        />
                    </WorldMapSVG>

                    {/* Tariff markers fading out */}
                    {countries.map((country) => (
                        <CountryMarker
                            key={country.country}
                            style={{ top: `${country.position.top}%`, left: `${country.position.left}%` }}
                            initial={{ opacity: 0.8 }}
                            animate={{
                                opacity: country.country === "Vietnam" ? 1 : 0,
                                backgroundColor: country.country === "Vietnam" ? "#E74C3C" : "#66FCF1",
                                scale: country.country === "Vietnam" ? 1.2 : 0.8
                            }}
                            transition={{ duration: 1.5, delay: country.country === "Vietnam" ? 1 : 0.5 }}
                        >
                            {country.country === "Vietnam" && showVietnamMarker && "📍"}
                        </CountryMarker>
                    ))}

                    {/* Tariff data elements that fade out */}
                    <TariffElement
                        style={{ top: '10%', right: '5%' }}
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    >
                        Tariff Rate: 46%
                    </TariffElement>

                    <TariffElement
                        style={{ bottom: '10%', left: '5%' }}
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                    >
                        Economic Impact: -0.8%
                    </TariffElement>
                </WorldMapContainer>
            </MapInterface>

            {/* Transition message */}
            <TransitionMessage
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
            >
                Leaving trade control chamber...
                <br />
                <span style={{ fontSize: '18px', opacity: 0.8 }}>Returning to grandmother's village in coastal Vietnam</span>
            </TransitionMessage>

            {/* Coastal overlay that hints at the kitchen */}
            <CoastalScene>
                <CoastalOverlay
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3, duration: 1.5 }}
                />

                <Wave
                    bottom={0}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    transition={{ delay: 3.5, duration: 1 }}
                />

                <Wave
                    bottom={30}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 3.7, duration: 1 }}
                />
            </CoastalScene>
        </TransitionContainer>
    );
}

export default ReturnTransition;