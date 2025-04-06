// src/components/common/AudioPreloader.jsx
import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import audioManager from '../../utils/AudioManager';

// List of essential audio files that must be preloaded
const ESSENTIAL_AUDIO = [
    { id: 'piano', url: '/src/assets/pianomusic.wav' },
    { id: 'ocean', url: '/src/assets/ES_Small Waves, Ocean, Beach, Crickets - Epidemic Sound.wav' },
    { id: 'grandma_success_1', url: '/src/assets/before/grandma_craft_success_1.mp3' }
];

// Non-essential audio that can be loaded in the background
const BACKGROUND_AUDIO = [
    { id: 'curlew', url: '/src/assets/ES_Snipes, Curlew Calling, Crickets, Waves In Background - Epidemic Sound.wav' },
    { id: 'grandma_hmm', url: '/src/assets/soundbites/grandma_hmm.mp3' },
    { id: 'grandma_haha', url: '/src/assets/soundbites/grandma_ahaha.mp3' }, // Fixed name
    { id: 'grandma_mmm', url: '/src/assets/soundbites/grandma_mmm.mp3' },
    { id: 'grandma_mmhmm', url: '/src/assets/soundbites/grandma_mmhmm.mp3' },
    { id: 'grandma_success_2', url: '/src/assets/before/grandma_craft_success_2.mp3' },
    { id: 'grandma_success_3', url: '/src/assets/before/grandma_craft_success_3.mp3' },
    { id: 'grandma_success_4', url: '/src/assets/before/grandma_craft_success_4.mp3' },
    { id: 'grandma_success_5', url: '/src/assets/before/grandma_craft_success_5.mp3' },
    { id: 'ui_click', url: '/src/assets/ui_click.wav' },
    { id: 'ui_page_turn', url: '/src/assets/ui_page_turn.wav' }
];

const AudioPreloader = ({ onComplete }) => {
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [essentialLoaded, setEssentialLoaded] = useState(false);
    const [message, setMessage] = useState("Loading Granny Mabel vs the World...");
    const [userInteracted, setUserInteracted] = useState(false);
    const loadTimerRef = useRef(null);
    const loadStateRef = useRef({
        essentialCount: 0,
        essentialTotal: ESSENTIAL_AUDIO.length,
        backgroundCount: 0,
        backgroundTotal: BACKGROUND_AUDIO.length,
        hasStartedBackground: false
    });

    // Initialize audio and set up loading process
    useEffect(() => {
        let isMounted = true; // Track if component is mounted

        // Initialize audio context
        audioManager.init();

        // Start a timer to ensure we don't block indefinitely on audio loading
        loadTimerRef.current = setTimeout(() => {
            if (isMounted) {
                console.log("Audio loading timed out, continuing anyway");
                setEssentialLoaded(true);
                setLoadingProgress(100);
                setMessage("Ready! Click or press any key to continue...");
            }
        }, 10000); // 10 second timeout (increased from 5 for slower connections)

        // Function to load essential audio files with proper tracking and error handling
        const loadEssentialAudio = async () => {
            const state = loadStateRef.current;

            // Create an array of promises for all essential audio loads
            const loadPromises = ESSENTIAL_AUDIO.map(async (audio, index) => {
                try {
                    const success = await audioManager.loadSound(audio.id, audio.url);
                    if (isMounted) {
                        state.essentialCount++;
                        // Update progress to be proportional to essential audio loading (70% of total)
                        const essentialProgress = (state.essentialCount / state.essentialTotal) * 70;
                        setLoadingProgress(essentialProgress);

                        if (success) {
                            console.log(`Successfully loaded essential audio: ${audio.id}`);
                        } else {
                            console.warn(`Failed to load essential audio: ${audio.id}, but continuing`);
                        }
                    }
                } catch (error) {
                    console.error(`Error loading essential audio ${audio.id}:`, error);
                }
            });

            // Wait for all promises to settle (whether successful or not)
            await Promise.allSettled(loadPromises);

            if (isMounted) {
                // Clear timeout as we've completed essential loading
                if (loadTimerRef.current) {
                    clearTimeout(loadTimerRef.current);
                    loadTimerRef.current = null;
                }

                setEssentialLoaded(true);
                setMessage("Ready! Click or press any key to continue...");

                // Continue with background loading
                state.hasStartedBackground = true;
                loadBackgroundAudio();
            }
        };

        // Function to load background audio files in sequence
        const loadBackgroundAudio = async () => {
            const state = loadStateRef.current;

            // Load background audio files sequentially to avoid overwhelming the browser
            for (const audio of BACKGROUND_AUDIO) {
                if (!isMounted) break; // Stop if component unmounted

                try {
                    await audioManager.loadSound(audio.id, audio.url);
                    if (isMounted) {
                        state.backgroundCount++;
                        // Background loading is the remaining 30% of progress
                        const totalProgress = 70 + (state.backgroundCount / state.backgroundTotal) * 30;
                        setLoadingProgress(totalProgress);
                    }
                } catch (error) {
                    console.warn(`Background audio ${audio.id} failed to load, continuing anyway`, error);
                }
            }
        };

        // Start loading
        loadEssentialAudio();

        // Cleanup function
        return () => {
            isMounted = false;
            if (loadTimerRef.current) {
                clearTimeout(loadTimerRef.current);
                loadTimerRef.current = null;
            }
        };
    }, []);

    // Handle user interaction to start the audio context
    useEffect(() => {
        if (essentialLoaded && userInteracted) {
            // Make sure audio context is resumed before completing
            if (audioManager.context && audioManager.context.state === 'suspended') {
                audioManager.context.resume()
                    .then(() => {
                        // Complete loading and move to the main app
                        onComplete();
                    })
                    .catch(error => {
                        console.error("Failed to resume audio context:", error);
                        // Still complete even if audio context fails
                        onComplete();
                    });
            } else {
                // Complete loading and move to the main app
                onComplete();
            }
        }
    }, [essentialLoaded, userInteracted, onComplete]);

    // Handle user interaction events
    const handleInteraction = () => {
        if (essentialLoaded) {
            setUserInteracted(true);
        }
    };

    // Add and remove global event listeners
    useEffect(() => {
        const handleKeyDown = () => handleInteraction();
        const handleTouch = () => handleInteraction();

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('touchstart', handleTouch);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('touchstart', handleTouch);
        };
    }, [essentialLoaded]);

    return (
        <PreloaderContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleInteraction}
        >
            <ContentWrapper>
                <Title>Granny Mabel vs the World</Title>
                <ProgressBarContainer>
                    <ProgressBar
                        style={{
                            width: `${loadingProgress}%`,
                            transition: 'width 0.5s ease-out'
                        }}
                    />
                </ProgressBarContainer>
                <Message>{message}</Message>

                {essentialLoaded && (
                    <StartButton
                        onClick={handleInteraction}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Start Cooking
                    </StartButton>
                )}
            </ContentWrapper>
        </PreloaderContainer>
    );
};

const PreloaderContainer = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(to bottom, #87CEEB, #E0F7FA);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ContentWrapper = styled.div`
    background-color: rgba(255, 255, 255, 0.85);
    padding: 2rem 3rem;
    border-radius: 1rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 90%;
    width: 600px;
`;

const Title = styled.h1`
    font-family: 'Ubuntu', cursive, sans-serif;
    color: #8B4513;
    margin-bottom: 1.5rem;
    font-size: 2.5rem;
`;

const ProgressBarContainer = styled.div`
    width: 100%;
    height: 20px;
    background-color: #E0E0E0;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 1rem;
`;

const ProgressBar = styled.div`
    height: 100%;
    background-color: #80CBC4;
`;

const Message = styled.p`
    font-size: 1.1rem;
    color: #555;
    margin-bottom: 1.5rem;
`;

const StartButton = styled(motion.button)`
    background-color: #8B4513;
    color: white;
    border: none;
    padding: 0.8rem 2rem;
    font-size: 1.2rem;
    border-radius: 2rem;
    cursor: pointer;
    font-family: 'Ubuntu', cursive, sans-serif;
    transition: background-color 0.2s;

    &:hover {
        background-color: #A0522D;
    }
`;

export default AudioPreloader;