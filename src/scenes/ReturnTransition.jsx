// src/scenes/ReturnTransition.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const TransitionContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to bottom, #0B0C10 0%, #144D53 70%, #66A5AD 100%);
  overflow: hidden;
`;

// Grid that's fading away
const Grid = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.15;
  pointer-events: none;
`;

const GridLine = styled(motion.div)`
  position: absolute;
  background-color: #66FCF1;
  
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

// Map interface that we're clicking on
const WorldMapInterface = styled(motion.div)`
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
  height: 250px;
  background-color: #1F2833;
  border: 2px solid #45A29E;
  border-radius: 5px;
  padding: 20px;
  color: #C5C6C7;
`;

const MapTitle = styled.h3`
  margin-top: 0;
  color: #C5C6C7;
  font-family: Arial, sans-serif;
`;

// Abstract world map with pin
const WorldMap = styled.div`
  margin-top: 20px;
  height: 180px;
  position: relative;
`;

const MapLine = styled(motion.path)`
  fill: none;
  stroke: #66FCF1;
  stroke-width: 1.5;
`;

// Vietnam pin that gets clicked
const VietnamPin = styled(motion.div)`
  position: absolute;
  top: 65px;
  left: 270px;
  width: 30px;
  height: 30px;
  background-color: #E74C3C;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  color: white;
  transform-origin: bottom center;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 8px;
    border-style: solid;
    border-color: #E74C3C transparent transparent transparent;
  }
`;

const PinLabel = styled.div`
  position: absolute;
  top: 100px;
  left: 240px;
  color: white;
  font-size: 12px;
  text-align: center;
  width: 120px;
`;

// Data lines melting into natural forms
const DataLine = styled(motion.path)`
  fill: none;
  stroke-width: 2;
`;

// Emerging coast with watercolor effect
const EmergingCoast = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200px;
  background: linear-gradient(to bottom, rgba(102, 165, 173, 0) 0%, rgba(102, 165, 173, 0.6) 100%);
`;

const CoastDetail = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 150px;
`;

// Wave elements
const Wave = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 20px;
  bottom: ${props => props.bottom || 0}px;
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.25' fill='%235DADE2'%3E%3C/path%3E%3Cpath d='M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z' opacity='.5' fill='%235DADE2'%3E%3C/path%3E%3Cpath d='M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z' fill='%235DADE2'%3E%3C/path%3E%3C/svg%3E") no-repeat;
    background-size: cover;
  }
`;

// Kitchen elements starting to appear
const KitchenHint = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #FFF8E1;
  opacity: 0;
`;

// Palm trees or other coastal elements
const PalmTree = styled(motion.div)`
  position: absolute;
  bottom: 150px;
  
  &.left {
    left: 300px;
  }
  
  &.right {
    right: 200px;
  }
`;

const PalmTrunk = styled.div`
  width: 10px;
  height: 50px;
  background-color: #795548;
  margin: 0 auto;
`;

const PalmLeaves = styled.div`
  position: relative;
  height: 40px;
  
  &::before, &::after {
    content: '';
    position: absolute;
    height: 30px;
    width: 80px;
    background-color: #2E7D32;
    border-radius: 50% 50% 0 0;
    bottom: 0;
  }
  
  &::before {
    transform: rotate(-20deg);
    left: -40px;
  }
  
  &::after {
    transform: rotate(20deg);
    right: -40px;
  }
`;

// Dripping data effect
const DataDrip = styled(motion.div)`
  position: absolute;
  width: 2px;
  background-color: ${props => props.color || '#4FC3F7'};
  top: 0;
  opacity: 0.6;
`;

function ReturnTransition({ gameState }) {
    const navigate = useNavigate();

    // After animation completes, navigate to changed kitchen
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/changed-kitchen');
        }, 5000); // 5 seconds for full transition

        return () => clearTimeout(timer);
    }, [navigate]);

    // Create grid lines that are fading out
    const horizontalGridLines = [];
    const verticalGridLines = [];

    for (let i = 1; i < 6; i++) {
        horizontalGridLines.push(
            <GridLine
                key={`h-${i}`}
                className="horizontal"
                style={{ top: `${i * 100}px` }}
                animate={{ opacity: 0 }}
                transition={{ duration: 2, delay: i * 0.1 }}
            />
        );
    }

    for (let i = 1; i < 8; i++) {
        verticalGridLines.push(
            <GridLine
                key={`v-${i}`}
                className="vertical"
                style={{ left: `${i * 100}px` }}
                animate={{ opacity: 0 }}
                transition={{ duration: 2, delay: i * 0.1 }}
            />
        );
    }

    // Create data drips
    const dataDrips = [];
    const colors = ['#4FC3F7', '#FF4081', '#FFC107', '#4CAF50'];

    for (let i = 0; i < 8; i++) {
        const left = 100 + (i * 80);
        const height = 200 + Math.random() * 200;
        const delay = Math.random() * 2;
        const duration = 2 + Math.random() * 3;
        const color = colors[i % colors.length];

        dataDrips.push(
            <DataDrip
                key={i}
                color={color}
                style={{ left: `${left}px`, height: '0px' }}
                animate={{ height: `${height}px` }}
                transition={{ duration, delay }}
            />
        );
    }

    // Handle pin click - for demo purposes we auto-click
    useEffect(() => {
        const clickTimer = setTimeout(() => {
            const pinAnimation = document.querySelector('.pin-animation');
            if (pinAnimation) {
                pinAnimation.classList.add('clicked');
            }
        }, 1000);

        return () => clearTimeout(clickTimer);
    }, []);

    return (
        <TransitionContainer>
            {/* Grid fading away */}
            <Grid>
                {horizontalGridLines}
                {verticalGridLines}
            </Grid>

            {/* Map interface */}
            <WorldMapInterface
                animate={{ y: [-50, 0], opacity: [0, 1] }}
                transition={{ duration: 1 }}
            >
                <MapTitle>Global Map</MapTitle>

                <WorldMap>
                    <svg width="100%" height="100%" viewBox="0 0 360 180">
                        <MapLine
                            d="M20,40 Q40,35 60,45 Q80,40 100,35 L120,25 Q140,30 160,40 L180,50"
                            animate={{ opacity: [1, 0.3] }}
                            transition={{ duration: 3, delay: 2 }}
                        />
                        <MapLine
                            d="M30,70 Q50,65 70,75 Q90,70 110,65 L130,55 Q150,60 170,70"
                            animate={{ opacity: [1, 0.3] }}
                            transition={{ duration: 3, delay: 2 }}
                        />

                        {/* Vietnam pin with animation */}
                        <g className="pin-animation">
                            <circle
                                cx="270"
                                cy="65"
                                r="15"
                                fill="#E74C3C"
                                className="pin-circle"
                            >
                                <animate
                                    attributeName="r"
                                    from="15"
                                    to="100"
                                    dur="2s"
                                    begin="indefinite"
                                    fill="freeze"
                                    id="pinExpand"
                                />
                                <animate
                                    attributeName="opacity"
                                    from="1"
                                    to="0"
                                    dur="2s"
                                    begin="indefinite"
                                    fill="freeze"
                                />
                            </circle>
                        </g>
                    </svg>

                    <VietnamPin
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                            // Trigger SVG animations
                            document.getElementById('pinExpand').beginElement();

                            // Add delay before navigation
                            setTimeout(() => {
                                navigate('/changed-kitchen');
                            }, 2000);
                        }}
                    >
                        📍
                    </VietnamPin>

                    <PinLabel>Coastal Vietnam - Grandma's Pin</PinLabel>
                </WorldMap>
            </WorldMapInterface>

            {/* Data drips */}
            {dataDrips}

            {/* Data lines transforming */}
            <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
                <DataLine
                    d="M0,400 Q200,380 400,410 Q600,380 800,400"
                    stroke="#4FC3F7"
                    strokeWidth="3"
                    animate={{
                        d: "M0,450 Q200,440 400,450 Q600,440 800,450"
                    }}
                    transition={{ duration: 4 }}
                />

                <DataLine
                    d="M0,420 Q200,440 400,420 Q600,440 800,420"
                    stroke="#4FC3F7"
                    strokeWidth="2"
                    opacity="0.7"
                    animate={{
                        d: "M0,470 Q200,480 400,470 Q600,480 800,470"
                    }}
                    transition={{ duration: 5 }}
                />
            </svg>

            {/* Emerging coastline */}
            <EmergingCoast
                animate={{ opacity: [0, 1] }}
                transition={{ duration: 3, delay: 2 }}
            />

            {/* Waves */}
            <Wave
                bottom={0}
                animate={{ opacity: [0, 0.8] }}
                transition={{ duration: 2, delay: 3 }}
            />

            <Wave
                bottom={30}
                animate={{ opacity: [0, 0.5] }}
                transition={{ duration: 2, delay: 3.3 }}
            />

            {/* Palm trees */}
            <PalmTree className="left"
                      animate={{ opacity: [0, 0.8], y: [20, 0] }}
                      transition={{ duration: 2, delay: 3.5 }}
            >
                <PalmLeaves />
                <PalmTrunk />
            </PalmTree>

            <PalmTree className="right"
                      animate={{ opacity: [0, 0.8], y: [20, 0] }}
                      transition={{ duration: 2, delay: 3.7 }}
            >
                <PalmLeaves />
                <PalmTrunk />
            </PalmTree>

            {/* Kitchen hint appearing */}
            <KitchenHint
                animate={{ opacity: [0, 0.1, 0.2] }}
                transition={{ duration: 2, delay: 4 }}
            />

            {/* Script to handle pin click animation */}
            <script dangerouslySetInnerHTML={{
                __html: `
          document.addEventListener('DOMContentLoaded', function() {
            const pinAnimation = document.querySelector('.pin-animation');
            
            // Function to handle animation when the pin is clicked
            function handlePinClick() {
              const expandAnimation = document.getElementById('pinExpand');
              expandAnimation.beginElement();
            }
            
            // Listen for the class change we're doing in the useEffect
            const observer = new MutationObserver(function(mutations) {
              mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                  if (pinAnimation.classList.contains('clicked')) {
                    handlePinClick();
                  }
                }
              });
            });
            
            observer.observe(pinAnimation, { attributes: true });
          });
        `
            }} />
        </TransitionContainer>
    );
}

export default ReturnTransition;