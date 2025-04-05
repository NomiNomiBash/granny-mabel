import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

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

export const KitchenBackground = () => {
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

    return (
        <>
            <OceanView>
                <WavesAnimation
                    variants={wavesVariants}
                    animate="animate"
                />
            </OceanView>
            <KitchenCounter />
        </>
    );
};