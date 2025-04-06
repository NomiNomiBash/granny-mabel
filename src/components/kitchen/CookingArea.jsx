import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import grannyImage from '../../assets/granny.png';
import grannyArmImage from '../../assets/granny_arm.png';

const CookingPot = styled.div`
    position: absolute;
    bottom: 200px;
    left: 350px;
    width: 100px;
    height: 60px;
    background-color: #424242;
    border-radius: 10px 10px 40px 40px;
    border-bottom: 10px solid #616161;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
`;

const PotContents = styled.div`
    width: 100%;
    height: 100%;
    background-color: ${props => props.color || '#FFF59D'};
    border-radius: 10px 10px 35px 35px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const PotContentEmoji = styled.div`
    font-size: 48px;
    position: absolute;
`;

const SteamEffect = styled(motion.div)`
    position: absolute;
    top: -30px;
    left: ${props => props.position || '30px'};
    width: 5px;
    height: 20px;
    background-color: white;
    border-radius: 5px;
    opacity: 0.7;
`;

const GrandmaContainer = styled.div`
    position: absolute;
    width: 600px;
    bottom: 0;
    right: 200px;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const GrandmaImage = styled.img`
    width: 600px;
    height: auto;
`;

const StirringArm = styled(motion.img)`
    position: absolute;
    bottom: 60px;
    right: -100px;
    width: 300px;
    height: auto;
    transform-origin: 20% 90%;
`;

// Fallback SVG for missing images
const GRANDMA_FALLBACK_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='200' viewBox='0 0 150 200'%3E%3Crect width='150' height='200' fill='%23f0d0c0'/%3E%3Ccircle cx='75' cy='60' r='30' fill='%23ffe0b2'/%3E%3Crect x='45' y='95' width='60' height='80' fill='%23f06292'/%3E%3Crect x='55' y='85' width='40' height='20' fill='%23ffffff'/%3E%3C/svg%3E";

const ARM_FALLBACK_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='30' viewBox='0 0 80 30'%3E%3Crect width='60' height='10' fill='%23ffe0b2' rx='5' ry='5'/%3E%3C/svg%3E";

export const CookingArea = ({ potContent, isStirring }) => {
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
    const stirringVariants = {
        stirring: {
            rotate: [0, 20, 0, -20, 0],
            transition: {
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut"
            }
        },
        idle: {
            rotate: 0
        }
    };

    // Function to handle image load errors
    const handleImageError = (e, fallbackSvg) => {
        console.error(`Failed to load image: ${e.target.src}`);
        e.target.src = fallbackSvg;
    };

    return (
        <>
            <CookingPot>
                <PotContents color={potContent.color}>
                    {potContent.name && (
                        <PotContentEmoji>{potContent.emoji}</PotContentEmoji>
                    )}
                </PotContents>
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

            <GrandmaContainer>
                <GrandmaImage 
                    src={grannyImage} 
                    alt="Grandma" 
                    onError={(e) => handleImageError(e, GRANDMA_FALLBACK_SVG)}
                />
                <StirringArm 
                    src={grannyArmImage}
                    alt="Grandma's Arm"
                    variants={stirringVariants}
                    animate={isStirring ? "stirring" : "idle"}
                    onError={(e) => handleImageError(e, ARM_FALLBACK_SVG)}
                />
            </GrandmaContainer>
        </>
    );
};