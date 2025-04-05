// src/scenes/TariffChamber.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ChamberContainer = styled(motion.div)`
  background-color: #0B0C10;
  height: 100vh;
  width: 100vw;
  position: relative;
  color: #C5C6C7;
  overflow: hidden;
`;

// Background grid effect
const Grid = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
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

// World Map component
const WorldMap = styled.div`
  position: absolute;
  top: 50px;
  left: 50px;
  width: 250px;
  height: 180px;
  background-color: #1F2833;
  border: 2px solid #45A29E;
  border-radius: 5px;
  padding: 15px;
`;

const MapTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 15px;
  color: #C5C6C7;
  font-size: 16px;
`;

const MapContent = styled.div`
  position: relative;
  width: 100%;
  height: calc(100% - 30px);
`;

const TradeRoute = styled.div`
  position: absolute;
  height: 2px;
  background-color: #45A29E;
  opacity: 0.7;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }
  
  &::before {
    background-color: #FF4081;
    left: 0;
    top: -2px;
  }
  
  &::after {
    background-color: #FF4081;
    right: 0;
    top: -2px;
  }
`;

const VietnamPoint = styled.div`
  position: absolute;
  top: 65px;
  left: 140px;
  width: 10px;
  height: 10px;
  background-color: #E74C3C;
  border-radius: 50%;
  
  &::after {
    content: 'Vietnam';
    position: absolute;
    left: -20px;
    top: 12px;
    font-size: 9px;
    color: #C5C6C7;
    white-space: nowrap;
  }
`;

const USPoint = styled.div`
  position: absolute;
  top: 50px;
  left: 60px;
  width: 10px;
  height: 10px;
  background-color: #3498DB;
  border-radius: 50%;
  
  &::after {
    content: 'USA';
    position: absolute;
    left: -10px;
    top: -15px;
    font-size: 9px;
    color: #C5C6C7;
  }
`;

const TariffEffect = styled.div`
  position: absolute;
  top: 50px;
  left: 60px;
  width: 80px;
  height: 20px;
  border-bottom: 2px dashed #E74C3C;
  transform: rotate(30deg);
`;

// Forecast Panel component
const ForecastPanel = styled.div`
  position: absolute;
  top: 250px;
  left: 50px;
  width: 250px;
  height: 180px;
  background-color: #1F2833;
  border: 2px solid #45A29E;
  border-radius: 5px;
  padding: 15px;
`;

const ForecastTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 15px;
  color: #C5C6C7;
  font-size: 16px;
`;

const ChartContainer = styled.div`
  position: relative;
  width: 100%;
  height: calc(100% - 30px);
  border-left: 1px solid #66FCF1;
  border-bottom: 1px solid #66FCF1;
`;

const ChartLine = styled.div`
  position: absolute;
  height: 2px;
  background-color: ${props => props.color || '#FF4081'};
  transform-origin: left center;
  
  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: -3px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => props.color || '#FF4081'};
  }
`;

const ChartLabel = styled.div`
  position: absolute;
  right: -25px;
  top: -10px;
  font-size: 10px;
  color: ${props => props.color || '#FF4081'};
`;

// Control Panel component
const ControlPanel = styled.div`
  position: absolute;
  top: 50px;
  right: 50px;
  width: 430px;
  height: 380px;
  background-color: #1F2833;
  border: 2px solid #45A29E;
  border-radius: 5px;
  padding: 20px;
`;

const ControlTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 30px;
  color: #C5C6C7;
  font-size: 20px;
  text-align: center;
`;

const SliderSection = styled.div`
  margin-bottom: 30px;
`;

const SliderLabel = styled.div`
  color: #C5C6C7;
  font-size: 14px;
  margin-bottom: 10px;
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Slider = styled.input.attrs({ type: 'range' })`
  width: 350px;
  height: 10px;
  border-radius: 5px;
  background: ${props => `linear-gradient(to right, #66FCF1 ${props.value}%, #0B0C10 ${props.value}%)`};
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #45A29E;
    cursor: pointer;
  }
`;

const SliderValue = styled.div`
  color: #66FCF1;
  font-size: 12px;
  width: 40px;
  text-align: right;
`;

// Impact Analysis section
const ImpactSection = styled.div`
  margin-top: 40px;
`;

const ImpactTitle = styled.div`
  color: #C5C6C7;
  font-size: 14px;
  margin-bottom: 10px;
`;

// Welcome Prompt
const WelcomePrompt = styled.div`
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
  height: 70px;
  background-color: rgba(69, 162, 158, 0.2);
  border: 2px solid #45A29E;
  border-radius: 35px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  text-align: center;
`;

const WelcomeTitle = styled.div`
  color: #66FCF1;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const WelcomeText = styled.div`
  color: #C5C6C7;
  font-size: 14px;
`;

// ESC Prompt
const EscPrompt = styled.div`
  position: absolute;
  bottom: 50px;
  left: 50px;
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
`;

function TariffChamber({ gameState, setGameState }) {
    const navigate = useNavigate();

    // Create grid lines
    const horizontalGridLines = [];
    const verticalGridLines = [];

    for (let i = 1; i < 6; i++) {
        horizontalGridLines.push(
            <GridLine
                key={`h-${i}`}
                className="horizontal"
                style={{ top: `${i * 100}px` }}
            />
        );
    }

    for (let i = 1; i < 8; i++) {
        verticalGridLines.push(
            <GridLine
                key={`v-${i}`}
                className="vertical"
                style={{ left: `${i * 100}px` }}
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

    // Handle slider changes
    const handleSliderChange = (e, slider) => {
        setGameState({
            ...gameState,
            tariffRates: {
                ...gameState.tariffRates,
                [slider]: parseInt(e.target.value)
            }
        });
    };

    return (
        <ChamberContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Background grid */}
            <Grid>
                {horizontalGridLines}
                {verticalGridLines}
            </Grid>

            {/* World Map */}
            <WorldMap>
                <MapTitle>Global Trade Map</MapTitle>
                <MapContent>
                    <TradeRoute
                        style={{
                            width: '80px',
                            top: '50px',
                            left: '60px',
                            transform: 'rotate(30deg)'
                        }}
                    />
                    <VietnamPoint />
                    <USPoint />
                    <TariffEffect />
                </MapContent>
            </WorldMap>

            {/* Forecast Panel */}
            <ForecastPanel>
                <ForecastTitle>Trade Forecast</ForecastTitle>
                <ChartContainer>
                    <ChartLine
                        color="#FF4081"
                        style={{
                            width: '180px',
                            top: '20px',
                            transform: 'rotate(-10deg)'
                        }}
                    >
                        <ChartLabel color="#FF4081">EU</ChartLabel>
                    </ChartLine>

                    <ChartLine
                        color="#3498DB"
                        style={{
                            width: '180px',
                            top: '80px',
                            transform: 'rotate(5deg)'
                        }}
                    >
                        <ChartLabel color="#3498DB">US</ChartLabel>
                    </ChartLine>

                    <ChartLine
                        color="#E74C3C"
                        style={{
                            width: '180px',
                            top: '60px',
                            transform: 'rotate(15deg)'
                        }}
                    >
                        <ChartLabel color="#E74C3C">Asia</ChartLabel>
                    </ChartLine>
                </ChartContainer>
            </ForecastPanel>

            {/* Control Panel with Sliders */}
            <ControlPanel>
                <ControlTitle>Tariff Control Chamber</ControlTitle>

                <SliderSection>
                    <SliderLabel>Seafood Imports</SliderLabel>
                    <SliderContainer>
                        <Slider
                            value={gameState.tariffRates.seafoodImports}
                            onChange={(e) => handleSliderChange(e, 'seafoodImports')}
                            min="0"
                            max="100"
                        />
                        <SliderValue>{gameState.tariffRates.seafoodImports}%</SliderValue>
                    </SliderContainer>
                </SliderSection>

                <SliderSection>
                    <SliderLabel>Agricultural Subsidies</SliderLabel>
                    <SliderContainer>
                        <Slider
                            value={gameState.tariffRates.agriculturalSubsidies}
                            onChange={(e) => handleSliderChange(e, 'agriculturalSubsidies')}
                            min="0"
                            max="100"
                        />
                        <SliderValue>{gameState.tariffRates.agriculturalSubsidies}%</SliderValue>
                    </SliderContainer>
                </SliderSection>

                <SliderSection>
                    <SliderLabel>Trade Agreements</SliderLabel>
                    <SliderContainer>
                        <Slider
                            value={gameState.tariffRates.tradeAgreements}
                            onChange={(e) => handleSliderChange(e, 'tradeAgreements')}
                            min="0"
                            max="100"
                        />
                        <SliderValue>{gameState.tariffRates.tradeAgreements}%</SliderValue>
                    </SliderContainer>
                </SliderSection>

                <ImpactSection>
                    <ImpactTitle>Economic Impact Analysis</ImpactTitle>
                    {/* Visual impact graph would go here - simplified for the prototype */}
                    <div style={{
                        height: '80px',
                        background: `linear-gradient(90deg, 
              rgba(255,64,129,0.3) ${gameState.tariffRates.seafoodImports}%, 
              rgba(52,152,219,0.3) ${gameState.tariffRates.agriculturalSubsidies}%, 
              rgba(231,76,60,0.3) ${gameState.tariffRates.tradeAgreements}%)`
                    }}></div>
                </ImpactSection>
            </ControlPanel>

            {/* Welcome Banner */}
            <WelcomePrompt>
                <WelcomeTitle>Welcome to the Tariff Chamber</WelcomeTitle>
                <WelcomeText>Adjust trade levers to observe the effects on global economies</WelcomeText>
            </WelcomePrompt>

            {/* ESC Prompt */}
            <EscPrompt>Press ESC to return</EscPrompt>
        </ChamberContainer>
    );
}

export default TariffChamber;