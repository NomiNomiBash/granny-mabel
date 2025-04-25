import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import grannyBackImage from '../../assets/granny_back.png';
import grannyFaceImage from '../../assets/granny_face.png';
import grannyArmImage from '../../assets/granny_arm.png';
import kitchenCounterImage from '../../assets/kitchen_counter.png';

const KitchenCounter = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 103%;
    height: auto;
    display: flex;
    justify-content: center;
    z-index: 1;
`;

const CounterImage = styled.img`
    width: 100%;
    height: auto;
    object-fit: cover;
    display: block;
`;

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
    z-index: 2;
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
    left: 500px;
    z-index: 5;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative; /* Ensure positioning context for z-index to work */
`;

const GrandmaImage = styled.img`
    width: 600px;
    height: auto;
    position: relative;
    z-index: 2; /* Higher z-index to be in front */
`;

const StirringArm = styled(motion.img)`
    position: absolute;
    bottom: 0;
    right: -100px;
    width: 300px;
    height: auto;
    transform-origin: 20% 90%;
    z-index: 1; /* Lower z-index to be behind */
`;

const Background = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* Updated gradient for a smoother transition from sky to sea */
    background: linear-gradient(
            to bottom,
            #8ec4e6 0%,      /* Lighter sky blue at top */
            #87CEEB 40%,     /* Sky blue */
            #65b5e6 55%,     /* Transition color */
            #4aa6e2 60%,     /* Another transition color */
            #1E90FF 70%,     /* Deep sea blue */
            #0d75d1 100%     /* Deeper sea blue at bottom */
    );
    z-index: 0;
`;

// Fallback SVG for missing images
const GRANDMA_FALLBACK_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='200' viewBox='0 0 150 200'%3E%3Crect width='150' height='200' fill='%23f0d0c0'/%3E%3Ccircle cx='75' cy='60' r='30' fill='%23ffe0b2'/%3E%3Crect x='45' y='95' width='60' height='80' fill='%23f06292'/%3E%3Crect x='55' y='85' width='40' height='20' fill='%23ffffff'/%3E%3C/svg%3E";

const ARM_FALLBACK_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='30' viewBox='0 0 80 30'%3E%3Crect width='60' height='10' fill='%23ffe0b2' rx='5' ry='5'/%3E%3C/svg%3E";

const COUNTER_FALLBACK_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='300' viewBox='0 0 800 300'%3E%3Crect width='800' height='100' y='200' fill='%23a67c52'/%3E%3Crect width='800' height='20' y='200' fill='%23d4a76a'/%3E%3C/svg%3E";

export const CookingArea = ({
                                potContent,
                                isStirring,
                                audioLength = 1500 // Default audio length in milliseconds
                            }) => {
    // Create state for which grandma image to show
    const [currentGrannyImage, setCurrentGrannyImage] = useState(grannyBackImage);

    // Create a state to control arm animation duration
    const [stirringDuration, setStirringDuration] = useState(audioLength);

    // Keep reference to animation control
    const stirringAnimationRef = useRef(null);

    // Reference to the face timer
    const faceTimerRef = useRef(null);

    // Keep track of when stirring started (to handle dynamic duration changes)
    const stirringStartTimeRef = useRef(null);

    // Keep track of previously used audio length to detect changes
    const prevAudioLengthRef = useRef(audioLength);

    // Log for debugging
    useEffect(() => {
        console.log("isStirring changed:", isStirring);
        console.log("Using audioLength:", audioLength, "ms");

        // If audio length is very short, use our default duration instead
        if (audioLength < 1000) {
            console.log(`Audio length is too short, using default duration of ${DEFAULT_STIRRING_DURATION}ms instead`);
            setStirringDuration(DEFAULT_STIRRING_DURATION);
        } else {
            setStirringDuration(audioLength);
        }
    }, [isStirring, audioLength]);

    // Handle audio length changes mid-stirring
    useEffect(() => {
        // If audio length changes during active stirring, adjust the timer
        if (isStirring &&
            prevAudioLengthRef.current !== audioLength &&
            stirringStartTimeRef.current !== null) {

            console.log(`Audio length changed during stirring from ${prevAudioLengthRef.current}ms to ${audioLength}ms`);

            // If audio length is very short (<1s), use our default 
            if (audioLength < 1000) {
                console.log(`Audio length is too short, using default duration of ${DEFAULT_STIRRING_DURATION}ms instead`);
                setStirringDuration(DEFAULT_STIRRING_DURATION);
            } else {
                // Update stirring duration to match audio length
                setStirringDuration(audioLength);
            }

            // Clear existing timer
            if (faceTimerRef.current) {
                clearTimeout(faceTimerRef.current);
                faceTimerRef.current = null;
            }
        }

        // Update ref to current audio length
        prevAudioLengthRef.current = audioLength;
    }, [audioLength, isStirring]);

    // Effect to handle face animation based on stirring state
    useEffect(() => {
        // When stirring starts, show the face and record start time
        if (isStirring) {
            console.log("Showing granny's face");
            setCurrentGrannyImage(grannyFaceImage);
            stirringStartTimeRef.current = Date.now();

            // Clear any existing timer to prevent issues
            if (faceTimerRef.current) {
                console.log("Cleaning up previous timer");
                clearTimeout(faceTimerRef.current);
                faceTimerRef.current = null;
            }
        }
        // When stirring stops, switch back to granny's back immediately
        else if (currentGrannyImage === grannyFaceImage) {
            console.log("Stirring stopped - switching back to granny's back");
            setCurrentGrannyImage(grannyBackImage);
            stirringStartTimeRef.current = null;

            // Clear any timer if it exists
            if (faceTimerRef.current) {
                clearTimeout(faceTimerRef.current);
                faceTimerRef.current = null;
            }
        }

        // Cleanup function
        return () => {
            if (faceTimerRef.current) {
                console.log("Cleaning up timer on effect cleanup");
                clearTimeout(faceTimerRef.current);
                faceTimerRef.current = null;
            }
        };
    }, [isStirring, currentGrannyImage, audioLength]);

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

    // Calculate stirring speed to match the full stirring duration
    // The key change: Dynamically adjust the animation duration based on stirringDuration
    const stirringCyclesPerSecond = 0.5; // How many full stir cycles per second (adjust as needed)
    const totalStirringCycles = Math.max(1, Math.ceil(stirringDuration / 1000 * stirringCyclesPerSecond));
    const cycleTime = stirringDuration / totalStirringCycles;

    // Arm stirring animation with dynamic duration based on audio length
    const stirringVariants = {
        stirring: {
            rotate: [0, 20, 0, -20, 0],
            transition: {
                repeat: totalStirringCycles - 1, // Subtract 1 because the first cycle is included in the animation
                duration: cycleTime / 1000, // Convert ms to seconds for the animation
                ease: "easeInOut",
                repeatType: "loop"
            }
        },
        idle: {
            rotate: 0,
            transition: {
                duration: 0.3 // Quick transition to idle
            }
        }
    };

    // Function to handle image load errors
    const handleImageError = (e, fallbackSvg) => {
        console.error(`Failed to load image: ${e.target.src}`);
        e.target.src = fallbackSvg;
    };

    return (
        <>
            {/* Simple sky and sea background with smoother gradient */}
            <Background />

            <KitchenCounter>
                <CounterImage
                    src={kitchenCounterImage}
                    alt="Kitchen Counter"
                    onError={(e) => handleImageError(e, COUNTER_FALLBACK_SVG)}
                />
            </KitchenCounter>

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
                {/* Use currentGrannyImage state to determine which image to show */}
                <GrandmaImage
                    key={`granny-${isStirring ? 'stirring' : 'idle'}`} // Force re-render when stirring state changes
                    src={currentGrannyImage}
                    alt="Grandma"
                    onError={(e) => handleImageError(e, GRANDMA_FALLBACK_SVG)}
                />
                <StirringArm
                    src={grannyArmImage}
                    alt="Grandma's Arm"
                    variants={stirringVariants}
                    animate={isStirring ? "stirring" : "idle"}
                    onError={(e) => handleImageError(e, ARM_FALLBACK_SVG)}
                    ref={stirringAnimationRef}
                    key={`arm-${stirringDuration}`} // Force animation update when duration changes
                />
            </GrandmaContainer>
        </>
    );
};