import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

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

const Grandma = styled.div`
    position: absolute;
    bottom: 120px;  // Adjusted from top: -120px
    left: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 5;
`;

const GrandmaHead = styled.div`
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #FFE0B2;

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

            <Grandma>
                <GrandmaHead />
                <GrandmaBody>
                    <GrandmaArm
                        side="left"
                        variants={armVariants}
                        animate={isStirring ? "stirring" : "idle"}
                    />
                    <GrandmaArm
                        side="right"
                        variants={armVariants}
                        animate={isStirring ? "stirring" : "idle"}
                        style={{ animationDelay: "0.5s" }}
                    />
                </GrandmaBody>
            </Grandma>
        </>
    );
};