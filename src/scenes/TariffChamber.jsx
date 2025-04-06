// src/scenes/TariffChamber.jsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ChamberContainer = styled.div`
    background-color: #0B0C10;
    min-height: 100vh;
    width: 100vw;
    position: relative;
    color: #C5C6C7;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 20px 80px 20px;
`;

// Background grid effect
const Grid = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
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

const TitlePanel = styled.div`
    background-color: #1F2833;
    border: 2px solid #45A29E;
    border-radius: 5px;
    padding: 15px 25px;
    text-align: center;
    margin-bottom: 30px;
    z-index: 1;
`;

const Title = styled.h1`
    color: #66FCF1;
    margin: 0;
    font-size: 24px;
`;

const Subtitle = styled.p`
    color: #C5C6C7;
    margin: 10px 0 0 0;
    font-size: 16px;
`;

// Update ContentContainer to use a more rigid layout structure
const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 95%;
    max-width: 1400px;
    z-index: 1;
`;

// Create a new row container for the top panels
const TopRowContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 0; // Remove gap between rows
`;

// Adjust WorldMapPanel width to fit properly
const WorldMapPanel = styled.div`
    width: 40%;
    background-color: #1F2833;
    border: 2px solid #45A29E;
    border-radius: 5px;
    padding: 20px;
    height: 450px;
`;

// Ensure ControlPanel matches WorldMapPanel
const ControlPanel = styled.div`
    width: 60%;
    background-color: #1F2833;
    border: 2px solid #45A29E;
    border-radius: 5px;
    padding: 20px;
    height: 450px;
    display: flex;
    flex-direction: column;
    margin-left: 0; // Ensure no gap between panels
`;

// Update ForecastPanel to attach directly to the top row
const ForecastPanel = styled.div`
    width: 100%;
    background-color: #1F2833;
    border: 2px solid #45A29E;
    border-radius: 5px;
    padding: 20px;
    z-index: 1;
    position: relative;
    margin-top: 0; // Remove gap between rows
`;

const MapTitle = styled.h2`
    margin-top: 0;
    margin-bottom: 20px;
    color: #66FCF1;
    font-size: 18px;
`;

const MapContainer = styled.div`
    position: relative;
    width: 100%;
    height: calc(100% - 30px);
    overflow: hidden;
`;

// Updated CountryMarker to dynamically size based on tariffRate
const CountryMarker = styled.div`
    position: absolute;
    width: ${props => Math.max(10, Math.min(40, props.size * (props.tariffRate / props.baseTariff)))}px;
    height: ${props => Math.max(10, Math.min(40, props.size * (props.tariffRate / props.baseTariff)))}px;
    border-radius: 50%;
    background-color: ${props => {
        if (props.tariffRate >= 50) return '#E74C3C';
        if (props.tariffRate >= 30) return '#FF7F50';
        if (props.tariffRate >= 20) return '#FFA500';
        if (props.tariffRate > 10) return '#FFD700';
        return '#66FCF1';
    }};
    opacity: 0.8;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: ${props => Math.max(8, Math.min(16, (props.size * (props.tariffRate / props.baseTariff)) / 2))}px;
    color: white;
    font-weight: bold;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
        z-index: 10;
        transform: translate(-50%, -50%) scale(1.2);
        box-shadow: 0 0 15px rgba(102, 252, 241, 0.7);
    }

    &::after {
        content: '${props => props.tariffRate}%';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
        font-size: 10px;
        margin-top: 3px;
        font-weight: normal;
        color: ${props => {
            if (props.tariffRate >= 50) return '#E74C3C';
            if (props.tariffRate >= 30) return '#FF7F50';
            if (props.tariffRate >= 20) return '#FFA500';
            if (props.tariffRate > 10) return '#FFD700';
            return '#66FCF1';
        }};
    }
`;

const ControlTitle = styled.h2`
    margin-top: 0;
    margin-bottom: 20px;
    color: #66FCF1;
    font-size: 18px;
`;

const TariffInfo = styled.div`
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(102, 252, 241, 0.3);
`;

const InfoText = styled.p`
    color: #C5C6C7;
    margin: 5px 0;
    font-size: 14px;
`;

const TimerBar = styled.div`
    width: 100%;
    height: 10px;
    background-color: #0B0C10;
    border-radius: 5px;
    margin: 15px 0;
    overflow: hidden;
`;

const TimerProgress = styled.div`
    height: 100%;
    width: ${props => props.value}%;
    background-color: #45A29E;
    transition: width 0.3s linear;
`;

const CountryList = styled.div`
    flex: 1;
    overflow-y: auto;
    margin-top: 20px;

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: #0B0C10;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: #45A29E;
        border-radius: 4px;
    }
`;

const CountryItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    border-bottom: 1px solid rgba(102, 252, 241, 0.1);

    &:hover {
        background-color: rgba(102, 252, 241, 0.05);
    }
`;

const CountryName = styled.div`
    flex: 1;
    font-size: 14px;
    color: #C5C6C7;
`;

const CountryRegion = styled.div`
    flex: 1;
    font-size: 12px;
    color: #C5C6C7;
    opacity: 0.7;
`;

const TariffControls = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const TariffValue = styled.span`
    width: 40px;
    text-align: center;
    font-weight: bold;
    color: ${props => {
        if (props.value >= 50) return '#E74C3C';
        if (props.value >= 30) return '#FF7F50';
        if (props.value >= 20) return '#FFA500';
        if (props.value > 10) return '#FFD700';
        return '#66FCF1';
    }};
`;

// Updated TariffButton to handle disabled state
const TariffButton = styled.button`
    background-color: ${props => props.disabled ? '#566164' : props.color || '#45A29E'};
    color: ${props => props.disabled ? '#888888' : 'white'};
    border: none;
    width: 70px;
    height: 28px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    font-weight: bold;
    font-size: 12px;
    opacity: ${props => props.disabled ? 0.7 : 1};

    &:hover {
        filter: ${props => props.disabled ? 'none' : 'brightness(1.2)'};
    }

    &:active {
        transform: ${props => props.disabled ? 'none' : 'scale(0.95)'};
    }
`;

// Unlock notification for boost all
const UnlockNotification = styled(motion.div)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(31, 40, 51, 0.95);
    border: 2px solid #66FCF1;
    border-radius: 5px;
    padding: 20px;
    color: #FFFFFF;
    text-align: center;
    z-index: 100;
    min-width: 300px;
`;

const NotificationTitle = styled.h3`
    color: #66FCF1;
    margin-top: 0;
`;

const NotificationText = styled.p`
    color: #C5C6C7;
    margin-bottom: 20px;
`;

const ForecastTitle = styled.h2`
    margin-top: 0;
    margin-bottom: 20px;
    color: #66FCF1;
    font-size: 18px;
`;

const ForecastContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const ForecastItem = styled.div`
    flex: 1;
    padding: 12px;
    text-align: center;
    border-radius: 5px;
    background-color: rgba(11, 12, 16, 0.5);
    margin: 0 10px;
`;

const ForecastLabel = styled.h3`
    color: #C5C6C7;
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 16px;
`;

const ForecastValue = styled.div`
    color: ${props => props.positive ? '#4CAF50' : '#E74C3C'};
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
`;

const ForecastDescription = styled.p`
    color: #C5C6C7;
    margin: 0;
    font-size: 14px;
`;

const GraphContainer = styled.div`
    margin-top: 20px;
    width: 100%;
    height: 100px;
    background-color: rgba(11, 12, 16, 0.5);
    border-radius: 5px;
    padding: 10px;
    position: relative;
`;

const GraphYAxis = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 5px 0;
`;

const GraphYLabel = styled.div`
    font-size: 10px;
    color: #C5C6C7;
    text-align: right;
    padding-right: 5px;
`;

const GraphContent = styled.div`
    position: relative;
    height: 100%;
    margin-left: 40px;
    border-left: 1px solid rgba(102, 252, 241, 0.3);
    border-bottom: 1px solid rgba(102, 252, 241, 0.3);
`;

const GraphLine = styled.div`
    position: absolute;
    height: 2px;
    background-color: ${props => props.color};
    left: 0;
    width: 100%;
    opacity: 0.2;
`;

const GraphPoint = styled.div`
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${props => props.color};
    transform: translate(-50%, -50%);
`;

const GraphPath = styled.svg`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
`;

const GraphPathLine = styled.path`
    fill: none;
    stroke: ${props => props.color};
    stroke-width: 2;
`;

// ESC Prompt
const EscPrompt = styled.div`
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 180px;
    height: 40px;
    background-color: rgba(69, 162, 158, 0.2);
    border: 1px solid #45A29E;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #C5C6C7;
    font-size: 14px;
    z-index: 10;
`;

function TariffChamber({ gameState, setGameState }) {
    const navigate = useNavigate();
    const timerRef = useRef(null);

    // Initial tariff data based on provided information
    const [tariffs, setTariffs] = useState([
        { country: "European Union", region: "Europe", tariffRate: 20, baseTariff: 20, position: { top: 40, left: 45 }, size: 35 },
        { country: "China", region: "Asia", tariffRate: 54, baseTariff: 54, position: { top: 45, left: 70 }, size: 40 },
        { country: "Vietnam", region: "Asia", tariffRate: 46, baseTariff: 46, position: { top: 55, left: 73 }, size: 25 },
        { country: "Thailand", region: "Asia", tariffRate: 36, baseTariff: 36, position: { top: 60, left: 70 }, size: 22 },
        { country: "Japan", region: "Asia", tariffRate: 24, baseTariff: 24, position: { top: 40, left: 80 }, size: 30 },
        { country: "Cambodia", region: "Asia", tariffRate: 49, baseTariff: 49, position: { top: 58, left: 72 }, size: 20 },
        { country: "South Africa", region: "Africa", tariffRate: 30, baseTariff: 30, position: { top: 65, left: 50 }, size: 25 },
        { country: "Taiwan", region: "Asia", tariffRate: 32, baseTariff: 32, position: { top: 50, left: 75 }, size: 20 },
        { country: "United Kingdom", region: "Europe", tariffRate: 10, baseTariff: 10, position: { top: 35, left: 40 }, size: 25 },
        { country: "Singapore", region: "Asia", tariffRate: 10, baseTariff: 10, position: { top: 60, left: 75 }, size: 15 },
        { country: "Brazil", region: "South America", tariffRate: 10, baseTariff: 10, position: { top: 65, left: 25 }, size: 30 },
        { country: "Australia", region: "Oceania", tariffRate: 10, baseTariff: 10, position: { top: 70, left: 85 }, size: 30 },
        { country: "New Zealand", region: "Oceania", tariffRate: 10, baseTariff: 10, position: { top: 80, left: 90 }, size: 20 },
        { country: "Turkey", region: "Europe/Asia", tariffRate: 10, baseTariff: 10, position: { top: 45, left: 55 }, size: 20 },
        { country: "Colombia", region: "South America", tariffRate: 10, baseTariff: 10, position: { top: 60, left: 20 }, size: 20 },
        { country: "Argentina", region: "South America", tariffRate: 10, baseTariff: 10, position: { top: 75, left: 25 }, size: 25 },
        { country: "El Salvador", region: "Central America", tariffRate: 10, baseTariff: 10, position: { top: 55, left: 15 }, size: 15 },
        { country: "United Arab Emirates", region: "Middle East", tariffRate: 10, baseTariff: 10, position: { top: 50, left: 60 }, size: 20 },
        { country: "Saudi Arabia", region: "Middle East", tariffRate: 10, baseTariff: 10, position: { top: 50, left: 57 }, size: 25 },
    ]);

    // Update forecasts based on tariff changes
    const [forecasts, setForecasts] = useState({
        economicGrowth: { value: -0.8, description: "Global economic growth projection" },
        domesticJobs: { value: +120000, description: "Annual projected job changes" },
        consumerPrices: { value: +2.4, description: "Expected consumer price increase" },
        tradeVolume: { value: -12.5, description: "Change in global trade volume" }
    });

    // Timer state for decay
    const [timer, setTimer] = useState(100);

    // History for the graph
    const [forecastHistory, setForecastHistory] = useState({
        economicGrowth: [-0.8],
        domesticJobs: [120000],
        consumerPrices: [2.4],
        tradeVolume: [-12.5]
    });

    // Add state for the BOOST ALL button unlock
    const [boostAllUnlocked, setBoostAllUnlocked] = useState(false);
    const [showUnlockNotification, setShowUnlockNotification] = useState(false);

    // Track tariff changes to unlock BOOST ALL
    const [totalTariffIncreases, setTotalTariffIncreases] = useState(0);

    // Create grid lines
    const horizontalGridLines = [];
    const verticalGridLines = [];

    for (let i = 1; i < 12; i++) {
        horizontalGridLines.push(
            <GridLine
                key={`h-${i}`}
                className="horizontal"
                style={{ top: `${i * 60}px` }}
            />
        );
    }

    for (let i = 1; i < 24; i++) {
        verticalGridLines.push(
            <GridLine
                key={`v-${i}`}
                className="vertical"
                style={{ left: `${i * 60}px` }}
            />
        );
    }

    // Listen for ESC key to return
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Escape') {
                navigate('/return');
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [navigate]);

    // Setup the decay timer
    useEffect(() => {
        // Function to decay tariffs over time
        const decayTariffs = () => {
            setTimer(prevTimer => {
                if (prevTimer <= 0) {
                    // Reset timer and decay tariffs
                    const newTariffs = tariffs.map(tariff => {
                        const decayAmount = Math.ceil(Math.random() * 3); // Random decay between 1-3%
                        const newRate = Math.max(10, tariff.tariffRate - decayAmount);
                        return { ...tariff, tariffRate: newRate };
                    });

                    setTariffs(newTariffs);
                    updateForecasts(newTariffs);
                    return 100; // Reset timer
                }
                return prevTimer - 1;
            });
        };

        // Start the decay timer
        timerRef.current = setInterval(decayTariffs, 100); // Update every 100ms

        // Clean up timer on component unmount
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [tariffs]);

    // Update history for graphs
    useEffect(() => {
        const updateInterval = setInterval(() => {
            setForecastHistory(prev => {
                // Limit history to 20 points
                const maxPoints = 20;

                return {
                    economicGrowth: [...prev.economicGrowth, forecasts.economicGrowth.value].slice(-maxPoints),
                    domesticJobs: [...prev.domesticJobs, forecasts.domesticJobs.value].slice(-maxPoints),
                    consumerPrices: [...prev.consumerPrices, forecasts.consumerPrices.value].slice(-maxPoints),
                    tradeVolume: [...prev.tradeVolume, forecasts.tradeVolume.value].slice(-maxPoints)
                };
            });
        }, 2000); // Update every 2 seconds

        return () => clearInterval(updateInterval);
    }, [forecasts]);

    // Check if boost all should be unlocked
    useEffect(() => {
        if (totalTariffIncreases >= 25000 && !boostAllUnlocked) {
            setBoostAllUnlocked(true);
            setShowUnlockNotification(true);

            // Hide notification after 3 seconds
            setTimeout(() => {
                setShowUnlockNotification(false);
            }, 3000);
        }
    }, [totalTariffIncreases, boostAllUnlocked]);

    // Handle tariff boost
    const boostTariff = (country) => {
        const boostAmount = 1; // Boost by 1% per click

        const newTariffs = tariffs.map(tariff => {
            if (tariff.country === country) {
                const currentRate = tariff.tariffRate;
                const newRate = Math.min(100, currentRate + boostAmount);

                // Only count if there was an actual increase
                if (newRate > currentRate) {
                    setTotalTariffIncreases(prev => prev + 1);
                }

                return { ...tariff, tariffRate: newRate };
            }
            return tariff;
        });

        setTariffs(newTariffs);
        updateForecasts(newTariffs);
        setTimer(100); // Reset the timer on boost
    };

    // Boost all tariffs at once by a smaller amount
    const boostAllTariffs = () => {
        if (!boostAllUnlocked) return; // Prevent action if not unlocked

        const boostAmount = 2; // Smaller boost for all at once

        const newTariffs = tariffs.map(tariff => {
            const newRate = Math.min(100, tariff.tariffRate + boostAmount);
            return { ...tariff, tariffRate: newRate };
        });

        setTariffs(newTariffs);
        updateForecasts(newTariffs);
        setTimer(100); // Reset the timer on boost
    };

    // Reset tariffs to original values
    const resetTariffs = () => {
        const newTariffs = tariffs.map(tariff => {
            return { ...tariff, tariffRate: tariff.baseTariff };
        });

        setTariffs(newTariffs);
        updateForecasts(newTariffs);
        setTimer(100);
    };

    // Update economic forecasts based on tariff changes
    const updateForecasts = (newTariffs) => {
        // Calculate weighted average tariff rate - give more weight to major trading partners
        const totalWeight = newTariffs.reduce((sum, t) => sum + t.size, 0);
        const weightedAvgTariff = newTariffs.reduce((sum, t) => sum + (t.tariffRate * t.size), 0) / totalWeight;

        // Calculate number of high-tariff countries (more than 30%)
        const highTariffCount = newTariffs.filter(t => t.tariffRate > 30).length;

        // Check tariffs on specific regions
        const chinaTariff = newTariffs.find(t => t.country === "China")?.tariffRate || 0;
        const euTariff = newTariffs.find(t => t.country === "European Union")?.tariffRate || 0;

        // Create more complex, realistic economic model
        const newForecasts = {
            economicGrowth: {
                value: parseFloat((-0.5 - (weightedAvgTariff - 10) * 0.03 - highTariffCount * 0.04).toFixed(1)),
                description: "Global economic growth projection"
            },
            domesticJobs: {
                // Higher tariffs create some jobs but very high tariffs hurt overall economy
                value: Math.round((weightedAvgTariff - 10) * 5000 - Math.max(0, (weightedAvgTariff - 40) * 3000)),
                description: "Annual projected job changes"
            },
            consumerPrices: {
                // Consumer prices rise with tariffs, especially with China and EU
                value: parseFloat((1.5 + (weightedAvgTariff - 10) * 0.05 + (chinaTariff - 50) * 0.02 + (euTariff - 20) * 0.02).toFixed(1)),
                description: "Expected consumer price increase"
            },
            tradeVolume: {
                // Trade volume drops significantly with higher tariffs
                value: parseFloat((-5 - (weightedAvgTariff - 10) * 0.5 - highTariffCount * 0.3).toFixed(1)),
                description: "Change in global trade volume"
            }
        };

        setForecasts(newForecasts);
    };

    // Format numbers for display
    const formatNumber = (num) => {
        if (num >= 0) return `+${num}`;
        return num.toString();
    };

    // Generate graph path for forecast history
    const generateGraphPath = (data, min, max) => {
        if (data.length < 2) return "";

        const graphWidth = 100; // Percentage width
        const step = graphWidth / (data.length - 1);

        // Scale the y-value to fit in the graph (0-100%)
        const scaleY = (value) => {
            const range = max - min;
            return 100 - ((value - min) / range * 100);
        };

        // Start the path
        let path = `M 0,${scaleY(data[0])}`;

        // Add points
        for (let i = 1; i < data.length; i++) {
            path += ` L ${step * i},${scaleY(data[i])}`;
        }

        return path;
    };

    return (
        <ChamberContainer>
            {/* Background grid */}
            <Grid>
                {horizontalGridLines}
                {verticalGridLines}
            </Grid>

            {/* Title */}
            <TitlePanel>
                <Title>US Tariff Control Chamber</Title>
                <Subtitle>Maintain tariffs to control global trade - Click to boost tariff rates before they decay!</Subtitle>
            </TitlePanel>

            <ContentContainer>
                {/* Top row with world map and controls side by side */}
                <TopRowContainer>
                    {/* World Map Panel */}
                    <WorldMapPanel>
                        <MapTitle>Global Trade Map - US Tariff Rates</MapTitle>
                        <MapContainer>
                            {/* Simple world map outline */}
                            <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ position: 'absolute' }}>
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
                            </svg>

                            {/* Country markers - clickable to boost tariffs */}
                            {tariffs.map((country) => (
                                <CountryMarker
                                    key={country.country}
                                    style={{ top: `${country.position.top}%`, left: `${country.position.left}%` }}
                                    tariffRate={country.tariffRate}
                                    baseTariff={country.baseTariff}
                                    size={country.size}
                                    onClick={() => boostTariff(country.country)}
                                />
                            ))}
                        </MapContainer>
                    </WorldMapPanel>

                    {/* Tariff Control Panel */}
                    <ControlPanel>
                        <ControlTitle>US Tariff Controls</ControlTitle>

                        <TariffInfo>
                            <InfoText><strong>TARIFF DECAY:</strong> Trade pressures are constantly reducing tariff effectiveness!</InfoText>
                            <InfoText><strong>YOUR GOAL:</strong> Click on countries or use the boost buttons to maintain tariff levels</InfoText>
                            {!boostAllUnlocked && (
                                <InfoText><strong>UNLOCK BOOST ALL:</strong> Boost individual country tariffs 25,000 times to unlock the BOOST ALL feature</InfoText>
                            )}
                        </TariffInfo>

                        {/* Tariff decay timer */}
                        <TimerBar>
                            <TimerProgress value={timer} />
                        </TimerBar>

                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            <TariffButton
                                onClick={boostAllTariffs}
                                disabled={!boostAllUnlocked}
                                style={{ flex: 1 }}
                            >
                                {boostAllUnlocked ? "BOOST ALL +2%" : "LOCKED"}
                            </TariffButton>
                            <TariffButton onClick={resetTariffs} color="#E74C3C" style={{ flex: 1 }}>
                                RESET TO BASELINE
                            </TariffButton>
                        </div>

                        <CountryList>
                            {tariffs.map((country) => (
                                <CountryItem key={country.country}>
                                    <CountryName>{country.country}</CountryName>
                                    <CountryRegion>{country.region}</CountryRegion>
                                    <TariffControls>
                                        <TariffValue value={country.tariffRate}>{country.tariffRate}%</TariffValue>
                                        <TariffButton onClick={() => boostTariff(country.country)}>
                                            BOOST +1%
                                        </TariffButton>
                                    </TariffControls>
                                </CountryItem>
                            ))}
                        </CountryList>
                    </ControlPanel>
                </TopRowContainer>

                {/* Bottom row with forecast panel spanning full width */}
                <ForecastPanel>
                    <ForecastTitle>Economic Impact Forecast</ForecastTitle>
                    <ForecastContainer>
                        <ForecastItem>
                            <ForecastLabel>Global Economic Growth</ForecastLabel>
                            <ForecastValue positive={forecasts.economicGrowth.value >= 0}>
                                {formatNumber(forecasts.economicGrowth.value)}%
                            </ForecastValue>
                            <ForecastDescription>{forecasts.economicGrowth.description}</ForecastDescription>
                        </ForecastItem>

                        <ForecastItem>
                            <ForecastLabel>US Jobs</ForecastLabel>
                            <ForecastValue positive={forecasts.domesticJobs.value >= 0}>
                                {formatNumber(forecasts.domesticJobs.value)}
                            </ForecastValue>
                            <ForecastDescription>{forecasts.domesticJobs.description}</ForecastDescription>
                        </ForecastItem>

                        <ForecastItem>
                            <ForecastLabel>Consumer Prices</ForecastLabel>
                            <ForecastValue positive={false}>
                                {formatNumber(forecasts.consumerPrices.value)}%
                            </ForecastValue>
                            <ForecastDescription>{forecasts.consumerPrices.description}</ForecastDescription>
                        </ForecastItem>

                        <ForecastItem>
                            <ForecastLabel>Trade Volume</ForecastLabel>
                            <ForecastValue positive={forecasts.tradeVolume.value >= 0}>
                                {formatNumber(forecasts.tradeVolume.value)}%
                            </ForecastValue>
                            <ForecastDescription>{forecasts.tradeVolume.description}</ForecastDescription>
                        </ForecastItem>
                    </ForecastContainer>

                    {/* Forecast trend graph */}
                    <GraphContainer>
                        <GraphYAxis>
                            <GraphYLabel>+5%</GraphYLabel>
                            <GraphYLabel>0%</GraphYLabel>
                            <GraphYLabel>-5%</GraphYLabel>
                        </GraphYAxis>

                        <GraphContent>
                            {/* Reference lines */}
                            <GraphLine style={{ top: '25%' }} color="#66FCF1" />
                            <GraphLine style={{ top: '50%' }} color="#66FCF1" />
                            <GraphLine style={{ top: '75%' }} color="#66FCF1" />

                            {/* Economic growth line */}
                            <GraphPath>
                                <GraphPathLine
                                    d={generateGraphPath(forecastHistory.economicGrowth, -5, 5)}
                                    color="#66FCF1"
                                />
                            </GraphPath>

                            {/* Trade volume line */}
                            <GraphPath>
                                <GraphPathLine
                                    d={generateGraphPath(forecastHistory.tradeVolume, -20, 5)}
                                    color="#E74C3C"
                                />
                            </GraphPath>
                        </GraphContent>
                    </GraphContainer>
                </ForecastPanel>
            </ContentContainer>

            {/* ESC Prompt */}
            <EscPrompt>Press ESC to return</EscPrompt>

            {/* Unlock Notification */}
            {showUnlockNotification && (
                <UnlockNotification
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                >
                    <NotificationTitle>New Feature Unlocked!</NotificationTitle>
                    <NotificationText>You've unlocked the BOOST ALL feature! Now you can increase all tariffs by 2% with a single click.</NotificationText>
                </UnlockNotification>
            )}
        </ChamberContainer>
    );
}

export default TariffChamber;