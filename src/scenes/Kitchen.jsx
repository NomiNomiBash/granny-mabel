// src/scenes/Kitchen.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Define all styled components
const KitchenContainer = styled.div`
    background-color: #FFF8E1;
    height: 100vh;
    width: 100vw;
    position: relative;
`;

const Window = styled.div`
    position: absolute;
    top: 100px;
    right: 100px;
    width: 200px;
    height: 250px;
    background-color: #AED6F1;
    border: 8px solid #8D6E63;
    border-radius: 5px;
`;

const KitchenCounter = styled.div`
    position: absolute;
    bottom: 100px;
    left: 50px;
    width: 700px;
    height: 150px;
    background-color: #D7CCC8;

    &::after {
        content: '';
        position: absolute;
        top: 25px;
        left: 0;
        width: 100%;
        height: 125px;
        background-color: #8D6E63;
    }
`;

const Refrigerator = styled.div`
    position: absolute;
    top: 275px;
    left: 100px;
    width: 120px;
    height: 220px;
    background-color: #ECEFF1;
    border-radius: 5px;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 30px;
        background-color: #CFD8DC;
        border-radius: 5px 5px 0 0;
    }
`;

const StickyNote = styled.div`
    position: absolute;
    top: 50px;
    left: 10px;
    width: 80px;
    height: 60px;
    background-color: #FFF9C4;
    transform: rotate(5deg);
`;

const Kettle = styled.div`
  position: absolute;
  top: -50px;
  left: 350px;
  width: 60px;
  height: 40px;
  background-color: #757575;
  border-radius: 10px 10px 0 0;
  
  &::before {
    content: '';
    position: absolute;
    top: -15px;
    left: 25px;
    width: 10px;
    height: 15px;
    background-color: #757575;
  }
`;

const SteamEffect = styled(motion.div)`
  position: absolute;
  top: -30px;
  left: 30px;
  width: 5px;
  height: 20px;
  background-color: white;
  border-radius: 5px;
  opacity: 0.7;
`;

const BreadLoaf = styled.div`
  position: absolute;
  top: -30px;
  right: 100px;
  width: 120px;
  height: 40px;
  background-color: #D4A76A;
  border-radius: 20px;
`;

const JamJars = styled.div`
  position: absolute;
  top: -40px;
  right: 20px;
  display: flex;
  gap: 10px;
`;

const JamJar = styled.div`
  width: 30px;
  height: 40px;
  background-color: ${props => props.color || '#D32F2F'};
  border-radius: 5px 5px 10px 10px;
  opacity: 0.8;
  
  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: 0;
    width: 30px;
    height: 5px;
    background-color: #BDBDBD;
  }
`;

const Television = styled.div`
  position: absolute;
  top: 275px;
  left: 250px;
  width: 150px;
  height: 100px;
  background-color: #212121;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const TVScreen = styled(motion.div)`
  width: 130px;
  height: 80px;
  background-color: ${props => props.isOn ? '#4CA5FF' : '#263238'};
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const TVPrompt = styled(motion.div)`
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 14px;
  cursor: pointer;
  z-index: 5;
`;

const TVGlow = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%);
  opacity: 0;
`;

const TVTurnOnFlash = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  opacity: 0;
`;

function Kitchen() {
    const navigate = useNavigate();
    const [tvOn, setTvOn] = useState(false);
    const [showPrompt, setShowPrompt] = useState(true);

    // Listen for E key press
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key.toLowerCase() === 'e' && !tvOn) {
                turnOnTV();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [tvOn]);

    // TV turn on sequence
    const turnOnTV = () => {
        setShowPrompt(false);
        setTvOn(true);

        // Navigate to TV News scene after brief animation
        setTimeout(() => {
            navigate('/tv');
        }, 1000);
    };

    // Steam animation
    const steamVariants = {
        animate: {
            y: [-20, -40],
            opacity: [0.7, 0],
            transition: {
                repeat: Infinity,
                duration: 2
            }
        }
    };

    return (
        <KitchenContainer>
            <Window />

            <KitchenCounter>
                <Kettle>
                    <SteamEffect
                        variants={steamVariants}
                        animate="animate"
                    />
                    <SteamEffect
                        style={{ left: '20px', top: '-25px' }}
                        variants={steamVariants}
                        animate="animate"
                    />
                </Kettle>

                <BreadLoaf />

                <JamJars>
                    <JamJar color="#D32F2F" />
                    <JamJar color="#7B1FA2" />
                </JamJars>
            </KitchenCounter>

            <Refrigerator>
                <StickyNote />
            </Refrigerator>

            <Television>
                <TVScreen isOn={tvOn}>
                    {showPrompt && (
                        <TVPrompt
                            onClick={turnOnTV}
                            animate={{
                                opacity: [0.8, 1, 0.8],
                                scale: [1, 1.05, 1]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                        >
                            🛈 Press E
                        </TVPrompt>
                    )}

                    <TVTurnOnFlash
                        animate={tvOn ? {
                            opacity: [0, 1, 0],
                        } : {}}
                        transition={{ duration: 0.5 }}
                    />

                    <TVGlow
                        animate={tvOn ? { opacity: 0.6 } : {}}
                        transition={{ delay: 0.3, duration: 0.3 }}
                    />
                </TVScreen>
            </Television>
        </KitchenContainer>
    );
}

export default Kitchen;