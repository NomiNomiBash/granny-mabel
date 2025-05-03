// src/scenes/Kitchen.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { BackgroundImage } from '../components/shared/BackgroundImage'; // Import the utility component
import backgroundImage from '../assets/background.png'; // Import the background image
import { CookingArea } from '../components/kitchen/CookingArea';
import { RecipeBook } from '../components/kitchen/RecipeBook';
import { TelevisionComponent } from '../components/kitchen/Television';
import KitchenAudio from '../components/kitchen/KitchenAudio';
import { InfiniteRecipes } from '../data/RecipeData';
import {
    DiscoveryCounter,
    DiscoveryNotification,
    RecipeInstructions,
    CombineArea
} from '../components/kitchen/KitchenUI';

// Import GlobalAudio system
import globalAudio from '../utils/GlobalAudio';

function Kitchen() {
    const navigate = useNavigate();
    const [tvOn, setTvOn] = useState(false);
    const [showPrompt, setShowPrompt] = useState(true);
    const [isStirring, setIsStirring] = useState(false);
    const [newDiscovery, setNewDiscovery] = useState(null);
    const [showCraftPanel, setShowCraftPanel] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const audioTriggeredRef = useRef(false);

    // Default animation duration if no audio is present
    const DEFAULT_ANIMATION_DURATION = 2000; // 2 seconds

    // Audio duration - will be updated based on actual audio duration
    const [audioDuration, setAudioDuration] = useState(DEFAULT_ANIMATION_DURATION);

    // Callback to update audio duration when it changes
    const handleAudioDurationChange = (newDurations) => {
        // Use the discovery duration as our primary duration
        // (since we don't have stirring sound)
        const newDuration = newDurations.discovery || DEFAULT_ANIMATION_DURATION;

        if (newDuration > 0 && newDuration !== audioDuration) {
            console.log(`[Kitchen] Audio duration updated to: ${newDuration}ms`);
            setAudioDuration(newDuration);
        }
    };

    // Ingredients state for infinite craft
    const [ingredientsDiscovered, setIngredientsDiscovered] = useState([
        { id: 1, name: "Water", emoji: "💧", color: "#E3F2FD", category: "base" },
        { id: 2, name: "Rice", emoji: "🍚", color: "#FFF9C4", category: "grain" },
        { id: 3, name: "Wheat Flour", emoji: "🌾", color: "#F5F5F5", category: "grain" },
        { id: 4, name: "Salt", emoji: "🧂", color: "#F0F0F0", category: "seasoning" },
        { id: 5, name: "Vegetables", emoji: "🥬", color: "#E8F5E9", category: "produce" },
        { id: 6, name: "Soy Sauce", emoji: "🥢", color: "#4A4A4A", category: "sauce" },
        { id: 7, name: "Eggs", emoji: "🥚", color: "#FFF3E0", category: "protein" },
        { id: 8, name: "Chicken", emoji: "🍗", color: "#FFEBEE", category: "protein" },
        { id: 9, name: "Fruits", emoji: "🍎", color: "#FFE0B2", category: "produce" },
        { id: 10, name: "Sugar", emoji: "🍬", color: "#FFFFFF", category: "seasoning" }
    ]);

    const [selectedIngredients, setSelectedIngredients] = useState([null, null]);
    const [potContent, setPotContent] = useState({ name: "", color: "#E3F2FD", emoji: "" });

    // Track when stirring animation should end
    const stirringTimeoutRef = useRef(null);

    // Initialize global audio system when component mounts
    useEffect(() => {
        console.log("Kitchen scene mounted, initializing global audio");

        // This makes sure the global audio system is initialized
        // It won't re-initialize if already done
        globalAudio.init();

        return () => {
            // Cleanup code if needed
            if (stirringTimeoutRef.current) {
                clearTimeout(stirringTimeoutRef.current);
            }
        };
    }, []);

    // User interaction to enable audio
    const enableAudio = useCallback(() => {
        if (!audioTriggeredRef.current) {
            setAudioEnabled(true);
            audioTriggeredRef.current = true;
        }
    }, []);

    // Listen for any user interaction to enable audio (browser policy)
    useEffect(() => {
        const handleUserInteraction = () => {
            enableAudio();
        };

        window.addEventListener('click', handleUserInteraction);
        window.addEventListener('keydown', handleUserInteraction);

        return () => {
            window.removeEventListener('click', handleUserInteraction);
            window.removeEventListener('keydown', handleUserInteraction);
        };
    }, [enableAudio]);

    // Listen for E key press and R key press
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key.toLowerCase() === 'e' && !tvOn) {
                turnOnTV();
            } else if (e.key.toLowerCase() === 'r') {
                setShowCraftPanel(prev => !prev);
            } else if (e.key.toLowerCase() === 'm') {
                // Toggle audio on/off with M key
                setAudioEnabled(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [tvOn]);

    // Listen for audio duration changes - handle stirring animation timing
    useEffect(() => {
        // If stirring is currently active, update the timeout to match the new duration
        if (isStirring) {
            console.log(`[Kitchen] Audio duration for stirring updated to: ${audioDuration}ms`);

            // Clear existing timeout if it exists
            if (stirringTimeoutRef.current) {
                clearTimeout(stirringTimeoutRef.current);
            }

            // Set a new timeout to stop stirring after the audio duration
            stirringTimeoutRef.current = setTimeout(() => {
                console.log('[Kitchen] Stirring animation timeout complete, stopping stirring');
                setIsStirring(false);
                stirringTimeoutRef.current = null;
            }, audioDuration);
        }

        // Cleanup function - clear timeout if component unmounts or isStirring changes
        return () => {
            if (stirringTimeoutRef.current) {
                clearTimeout(stirringTimeoutRef.current);
                stirringTimeoutRef.current = null;
            }
        };
    }, [audioDuration, isStirring]);

    // TV turn on sequence
    const turnOnTV = useCallback(() => {
        setShowPrompt(false);
        setTvOn(true);

        // Delay navigation to allow TV turn-on animation to complete
        setTimeout(() => {
            navigate('/tv');
        }, 800);
    }, [navigate]);

    // Handle ingredient selection
    const selectIngredient = useCallback((ingredient) => {
        if (!ingredient) {
            console.error("Tried to select undefined ingredient");
            return;
        }

        setSelectedIngredients(prevSelected => {
            // Create a new array with the updated ingredients
            let newSelectedIngredients = [...prevSelected];

            if (prevSelected[0] === null) {
                // First slot is empty, add to first slot
                newSelectedIngredients[0] = ingredient;
                return newSelectedIngredients;
            } else if (prevSelected[1] === null) {
                // Second slot is empty, add to second slot
                newSelectedIngredients[1] = ingredient;

                // We need to use setTimeout to ensure state is updated before combining
                setTimeout(() => {
                    combineIngredients(newSelectedIngredients[0], ingredient);
                }, 100);

                return newSelectedIngredients;
            } else {
                // Both slots are full, reset and add to first slot
                return [ingredient, null];
            }
        });
    }, []);

    // Combine ingredients
    const combineIngredients = useCallback((ingredient1, ingredient2) => {
        // Check both combinations (order doesn't matter)
        const combination = `${ingredient1.name}+${ingredient2.name}`;
        const reverseCombination = `${ingredient2.name}+${ingredient1.name}`;

        let result = InfiniteRecipes[combination] || InfiniteRecipes[reverseCombination];

        if (result) {
            // Update pot contents
            setPotContent({
                name: result.name,
                color: result.color,
                emoji: result.emoji
            });

            // Start stirring animation immediately
            setIsStirring(true);

            // Check if this is a new discovery - handles discovery notification
            setIngredientsDiscovered(prevDiscovered => {
                const alreadyDiscovered = prevDiscovered.some(i => i.name === result.name);

                // Create new ingredient object
                const newIngredient = {
                    id: prevDiscovered.length + 1,
                    name: result.name,
                    emoji: result.emoji,
                    color: result.color,
                    category: result.category || "crafted"
                };

                if (!alreadyDiscovered) {
                    // Show discovery notification
                    setNewDiscovery(result.name);

                    // Use the current audio duration plus a buffer for notification
                    // This needs to be long enough to cover the discovery sound
                    const notificationDuration = Math.max(audioDuration, 5000) + 500;
                    console.log(`[Kitchen] Setting discovery notification timeout: ${notificationDuration}ms`);

                    setTimeout(() => setNewDiscovery(null), notificationDuration);

                    // Automatically open the recipe book to show new discovery
                    setShowCraftPanel(true);

                    // Add to discovered ingredients
                    return [...prevDiscovered, newIngredient];
                }

                return prevDiscovered;
            });

            // NOTE: We do NOT set a timeout to end stirring here!
            // Instead, we let the KitchenAudio component tell us when to stop stirring
            // by updating the audioDuration, which will be picked up in the useEffect below
        }

        // Clear selection slots after a short delay
        setTimeout(() => {
            setSelectedIngredients([null, null]);
        }, 1000);
    }, [audioDuration]);

    // Toggle recipe book
    const toggleCraftPanel = useCallback(() => {
        setShowCraftPanel(prev => !prev);
    }, []);

    return (
        <KitchenContainer onClick={enableAudio}>
            {/* Audio component - now using discovery sound duration */}
            <KitchenAudio
                isStirring={isStirring}
                potContent={potContent}
                newDiscovery={newDiscovery}
                showCraftPanel={showCraftPanel}
                tvOn={tvOn}
                isMuted={!audioEnabled}
                onAudioDurationChange={handleAudioDurationChange}
            />

            {/* Replace KitchenBackground with direct BackgroundImage usage */}
            <BackgroundImage image={backgroundImage} />

            <CookingArea
                potContent={potContent}
                isStirring={isStirring}
                audioLength={audioDuration} // Pass the audio duration to cooking area
            />

            <RecipeBook onClick={toggleCraftPanel} />

            <CombineArea
                selectedIngredients={selectedIngredients}
            />

            {/* Recipe book panel */}
            {showCraftPanel && (
                <RecipeBook.Panel
                    ingredients={ingredientsDiscovered}
                    onIngredientClick={selectIngredient}
                />
            )}

            {/* Sound toggle button */}
            <SoundToggle
                onClick={() => setAudioEnabled(prev => !prev)}
            >
                {audioEnabled ? '🔊' : '🔇'}
            </SoundToggle>

            <DiscoveryCounter
                discoveries={ingredientsDiscovered.length}
                totalPossible={Object.keys(InfiniteRecipes).length + 4}
                currentRecipe={potContent.name}
                showCraftPanel={showCraftPanel}
                toggleCraftPanel={toggleCraftPanel}
            />

            <AnimatePresence>
                {newDiscovery && (
                    <DiscoveryNotification discovery={newDiscovery} />
                )}
            </AnimatePresence>

            <RecipeInstructions />

            <TelevisionComponent
                tvOn={tvOn}
                showPrompt={showPrompt}
                turnOnTV={turnOnTV}
            />
        </KitchenContainer>
    );
}

// Sound toggle button component
const SoundToggle = styled.button`
    position: absolute;
    top: 150px;
    left: 20px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.8);
    border: none;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    transition: all 0.2s ease;

    &:hover {
        background-color: rgba(255, 255, 255, 1);
        transform: scale(1.1);
    }

    &:active {
        transform: scale(0.95);
    }
`;

// Keep the main container here for cleaner imports
const KitchenContainer = styled.div`
    background-color: transparent; /* Changed from #87CEEB to transparent */
    height: 100vh;
    width: 100vw;
    position: relative;
    overflow: hidden;
`;

export default Kitchen;