// src/scenes/Kitchen.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Define all styled components
const KitchenContainer = styled.div`
    background-color: #87CEEB; // Sky blue background for the ocean view
    height: 100vh;
    width: 100vw;
    position: relative;
    overflow: hidden;
`;

const OceanView = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 60%;
    background: linear-gradient(to bottom, #87CEEB, #1E90FF);

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 20px;
        background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.3));
    }
`;

const WavesAnimation = styled(motion.div)`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 200%;
    height: 40px;
    background: repeating-linear-gradient(45deg, #1E90FF, #4169E1 20px);
    opacity: 0.7;
`;

const KitchenCounter = styled.div`
    position: absolute;
    bottom: 100px;
    left: 0;
    width: 100%;
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

const CookingPot = styled.div`
    position: absolute;
    top: -70px;
    left: 350px;
    width: 100px;
    height: 60px;
    background-color: #424242;
    border-radius: 10px 10px 40px 40px;
    border-bottom: 10px solid #616161;

    &::before {
        content: '';
        position: absolute;
        top: 10px;
        left: 10px;
        width: 80px;
        height: 20px;
        background-color: #FFF59D; // Yellow for noodles
        border-radius: 5px;
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

const Grandma = styled.div`
    position: absolute;
    top: -120px;
    left: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const GrandmaHead = styled.div`
    width: 60px;
    height: 60px;
    background-color: #FFE0B2;
    border-radius: 50%;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: -15px;
        left: 5px;
        width: 50px;
        height: 30px;
        background-color: #E0E0E0; // Gray hair
        border-radius: 50% 50% 0 0;
    }
`;

const GrandmaBody = styled.div`
    width: 80px;
    height: 100px;
    background-color: #F06292; // Pink dress
    border-radius: 20px 20px 0 0;

    &::before {
        content: '';
        position: absolute;
        top: 30px;
        left: 15px;
        width: 50px;
        height: 20px;
        background-color: #FFFFFF; // White apron
        border-radius: 5px;
    }
`;

const GrandmaArm = styled(motion.div)`
    position: absolute;
    top: 40px;
    ${props => props.side === 'left' ? 'left: -10px;' : 'right: -10px;'}
    width: 40px;
    height: 10px;
    background-color: #FFE0B2;
    border-radius: 5px;
    transform-origin: ${props => props.side === 'left' ? 'right' : 'left'} center;
`;

const SpiceJars = styled.div`
    position: absolute;
    top: -40px;
    right: 20px;
    display: flex;
    gap: 10px;
`;

const SpiceJar = styled.div`
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

const Vegetables = styled.div`
    position: absolute;
    top: -30px;
    right: 200px;
    display: flex;
    gap: 15px;
`;

const Vegetable = styled.div`
    width: ${props => props.size || '30px'};
    height: ${props => props.size || '30px'};
    background-color: ${props => props.color || '#4CAF50'};
    border-radius: ${props => props.round ? '50%' : '5px'};
`;

const RecipeBook = styled.div`
    position: absolute;
    top: -40px;
    left: 100px;
    width: 80px;
    height: 60px;
    background-color: #FFECB3;
    transform: rotate(-5deg);
    border-left: 5px solid #FFA000;

    &::before {
        content: '';
        position: absolute;
        top: 10px;
        left: 10px;
        width: 60px;
        height: 5px;
        background-color: #FFA000;
        box-shadow: 0 10px 0 #FFA000, 0 20px 0 #FFA000, 0 30px 0 #FFA000;
    }
`;

const Television = styled(motion.div)`
    position: absolute;
    top: 275px;
    left: 250px;
    width: 150px;
    height: 100px;
    background-color: #444444;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
`;

const TVScreen = styled(motion.div)`
    width: 87%;
    height: 78%;
    background-color: ${props => props.isOn ? '#222831' : '#111111'};
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

const CookingInstructions = styled(motion.div)`
    position: absolute;
    top: -90px;
    left: 500px;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 10px;
    font-size: 14px;
    max-width: 180px;
`;

function Kitchen() {
    const navigate = useNavigate();
    const [tvOn, setTvOn] = useState(false);
    const [showPrompt, setShowPrompt] = useState(true);
    const [cookingStage, setCookingStage] = useState(0);

    // Listen for E key press
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key.toLowerCase() === 'e' && !tvOn) {
                turnOnTV();
            } else if (e.key === ' ' || e.key === 'Space') {
                // Space to progress cooking
                setCookingStage(prev => (prev + 1) % 4);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [tvOn]);

    // TV turn on sequence
    const turnOnTV = () => {
        setShowPrompt(false);
        setTvOn(true);

        // Delay navigation to allow TV turn-on animation to complete
        setTimeout(() => {
            navigate('/tv');
        }, 800);
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

    // Arm stirring animation
    const armVariants = {
        stirring: {
            rotate: [0, 30, 0, -30, 0],
            transition: {
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut"
            }
        },
        idle: {
            rotate: 0
        }
    };

    // Ocean waves animation
    const wavesVariants = {
        animate: {
            x: [0, -200],
            transition: {
                repeat: Infinity,
                duration: 8,
                ease: "linear"
            }
        }
    };

    // Cooking instructions based on stage
    const cookingInstructions = [
        "Press SPACE to start cooking the noodles",
        "Add vegetables and stir (Press SPACE)",
        "Season with spices (Press SPACE)",
        "Noodles are ready! Serve them (Press SPACE)"
    ];

    return (
        <KitchenContainer>
            <OceanView>
                <WavesAnimation
                    variants={wavesVariants}
                    animate="animate"
                />
            </OceanView>

            <KitchenCounter>
                <RecipeBook />

                <CookingPot>
                    <SteamEffect
                        variants={steamVariants}
                        animate="animate"
                    />
                    <SteamEffect
                        style={{ left: '40px', top: '-25px' }}
                        variants={steamVariants}
                        animate="animate"
                    />
                    <SteamEffect
                        style={{ left: '60px', top: '-20px' }}
                        variants={steamVariants}
                        animate="animate"
                    />
                </CookingPot>

                <Grandma>
                    <GrandmaHead />
                    <GrandmaBody>
                        <GrandmaArm
                            side="left"
                            variants={armVariants}
                            animate={cookingStage > 0 ? "stirring" : "idle"}
                        />
                        <GrandmaArm
                            side="right"
                            variants={armVariants}
                            animate={cookingStage > 0 ? "stirring" : "idle"}
                            style={{ animationDelay: "0.5s" }}
                        />
                    </GrandmaBody>
                </Grandma>

                <Vegetables>
                    <Vegetable color="#4CAF50" size="25px" /> {/* Green */}
                    <Vegetable color="#FF5722" size="20px" round={true} /> {/* Orange carrot */}
                    <Vegetable color="#FFEB3B" size="15px" /> {/* Yellow */}
                </Vegetables>

                <SpiceJars>
                    <SpiceJar color="#D32F2F" /> {/* Red */}
                    <SpiceJar color="#FFA000" /> {/* Orange */}
                    <SpiceJar color="#388E3C" /> {/* Green */}
                </SpiceJars>

                <CookingInstructions
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {cookingInstructions[cookingStage]}
                </CookingInstructions>
            </KitchenCounter>

            <Television
                animate={tvOn ? {
                    scale: 1.05,
                } : {}}
                transition={{ duration: 0.5 }}
            >
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