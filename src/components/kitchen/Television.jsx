// src/components/kitchen/Television.jsx
import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

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
    cursor: pointer;
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

export const TelevisionComponent = ({ tvOn, showPrompt, turnOnTV }) => {
    return (
        <Television
            onClick={turnOnTV}
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
    );
};