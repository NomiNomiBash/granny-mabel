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
`;

const KitchenFadeOut = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #FFF8E1;
  opacity: 0.3;
  filter: blur(8px);
`;

const GridLines = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  
  &::before, &::after {
    content: '';
    position: absolute;
    background: #66FCF1;
    opacity: 0.15;
  }
  
  /* Horizontal lines */
  &::before {
    top: ${props => props.index * 100}px;
    left: 0;
    width: 100%;
    height: 1px;
  }
  
  /* Vertical lines */
  &::after {
    top: 0;
    left: ${props => props.index * 100}px;
    width: 1px;
    height: 100%;
  }
`;

const NewsAnchor = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 250px;
`;

const AnchorHead = styled(motion.div)`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #7F8C8D;
  margin: 0 auto;
`;

const AnchorBody = styled(motion.div)`
  width: 120px;
  height: 140px;
  background-color: #7F8C8D;
  margin: 0 auto;
  margin-top: 10px;
`;

const WireframeLines = styled(motion.path)`
  fill: none;
  stroke: #4FC3F7;
  stroke-width: 1;
`;

const DataLine = styled(motion.path)`
  fill: none;
  stroke-width: 2;
`;

const InterfaceUIContainer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
`;

const Panel = styled(motion.div)`
  position: absolute;
  background-color: #1F2833;
  border: 2px solid #45A29E;
  border-radius: 5px;
  opacity: 0;
`;

const WorldMapPanel = styled(Panel)`
  top: 50px;
  left: 50px;
  width: 250px;
  height: 180px;
`;

const ControlPanel = styled(Panel)`
  top: 50px;
  right: 50px;
  width: 430px;
  height: 380px;
`;

const ForecastPanel = styled(Panel)`
  bottom: 50px;
  left: 50px;
  width: 250px;
  height: 180px;
`;

function Transition() {
    const navigate = useNavigate();

    // Auto-navigate to the Tariff Chamber after animation completes
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/tariff-chamber');
        }, 5000); // 5 seconds for the full transition

        return () => clearTimeout(timer);
    }, [navigate]);

    // Create multiple grid lines
    const gridLines = [];
    for (let i = 0; i < 10; i++) {
        gridLines.push(
            <GridLines
                key={i}
                index={i}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 1 + (i * 0.1), duration: 0.5 }}
            />
        );
    }

    return (
        <TransitionContainer>
            {/* Kitchen fading out */}
            <KitchenFadeOut
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 0, filter: 'blur(20px)' }}
                transition={{ duration: 3 }}
            />

            {/* Grid appearing */}
            {gridLines}

            {/* News anchor transforming to wireframe */}
            <NewsAnchor
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ delay: 2.5, duration: 1 }}
            >
                <AnchorHead />
                <AnchorBody />
            </NewsAnchor>

            {/* Wireframe appearing */}
            <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                <g transform="translate(400, 300)">
                    <WireframeLines
                        d="M0,-50 L-30,-10 L30,-10 Z"  // Head
                        initial={{ opacity: 0, pathLength: 0 }}
                        animate={{ opacity: 1, pathLength: 1 }}
                        transition={{ delay: 2, duration: 1.5 }}
                    />

                    <WireframeLines
                        d="M0,-10 L0,50"  // Body
                        initial={{ opacity: 0, pathLength: 0 }}
                        animate={{ opacity: 1, pathLength: 1 }}
                        transition={{ delay: 2.2, duration: 1.5 }}
                    />

                    <WireframeLines
                        d="M0,0 L-30,30 M0,0 L30,30"  // Arms
                        initial={{ opacity: 0, pathLength: 0 }}
                        animate={{ opacity: 1, pathLength: 1 }}
                        transition={{ delay: 2.4, duration: 1.5 }}
                    />

                    <WireframeLines
                        d="M-40,-30 L-20,-40 L20,-40 L40,-30 L40,30 L20,40 L-20,40 L-40,30 Z"  // Screen
                        initial={{ opacity: 0, pathLength: 0 }}
                        animate={{ opacity: 1, pathLength: 1 }}
                        transition={{ delay: 2.6, duration: 1.5 }}
                    />
                </g>

                {/* Data visualization lines appearing */}
                <DataLine
                    d="M100,400 Q200,350 300,400 Q400,450 500,400 Q600,350 700,400"
                    stroke="#00BCD4"
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: 1, pathLength: 1 }}
                    transition={{ delay: 3, duration: 1.5 }}
                />

                <DataLine
                    d="M100,300 Q200,350 300,300 Q400,250 500,300 Q600,350 700,300"
                    stroke="#FFC107"
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: 1, pathLength: 1 }}
                    transition={{ delay: 3.3, duration: 1.5 }}
                />

                <DataLine
                    d="M100,200 Q200,150 300,200 Q400,250 500,200 Q600,150 700,200"
                    stroke="#FF4081"
                    initial={{ opacity: 0, pathLength: 0 }}
                    animate={{ opacity: 1, pathLength: 1 }}
                    transition={{ delay: 3.6, duration: 1.5 }}
                />
            </svg>

            {/* Interface UI appearing */}
            <InterfaceUIContainer
                animate={{ opacity: 1 }}
                transition={{ delay: 3.8, duration: 1 }}
            >
                <WorldMapPanel
                    animate={{ opacity: 1 }}
                    transition={{ delay: 4, duration: 0.5 }}
                />

                <ControlPanel
                    animate={{ opacity: 1 }}
                    transition={{ delay: 4.2, duration: 0.5 }}
                />

                <ForecastPanel
                    animate={{ opacity: 1 }}
                    transition={{ delay: 4.4, duration: 0.5 }}
                />
            </InterfaceUIContainer>
        </TransitionContainer>
    );
}

export default Transition;