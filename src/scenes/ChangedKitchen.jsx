import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Import the BackgroundImage utility directly
import { BackgroundImage } from '../components/shared/BackgroundImage';
import backgroundImage from '../assets/background.png';

// Import or create components similar to the Kitchen scene
import { CookingArea } from '../components/kitchen/CookingArea';
import { RecipeBook } from '../components/kitchen/RecipeBook';
import { TelevisionComponent } from '../components/kitchen/Television';
import ChangedKitchenAudio from '../components/kitchen/ChangedKitchenAudio';
import {
    DiscoveryCounter,
    DiscoveryNotification,
    RecipeInstructions,
    CombineArea,
    Calendar,
    StickyNote
} from '../components/kitchen/KitchenUI';
import {InfiniteRecipes} from "../data/RecipeData.js";

// Import GlobalAudio system
import globalAudio from '../utils/GlobalAudio';

// Add ingredient origin information
const IngredientOrigins = {
    "Water": { origin: "Local", tariffImpact: 0 },
    "Rice": { origin: "Local", tariffImpact: 0 }, // Vietnam is a major rice producer
    "Wheat Flour": { origin: "Imported", tariffImpact: 60 }, // Less common in Vietnamese cuisine
    "Salt": { origin: "Local", tariffImpact: 0 },
    "Vegetables": { origin: "Local", tariffImpact: 0 }, // Vietnam has robust agricultural production
    "Soy Sauce": { origin: "Imported", tariffImpact: 75 }, // Often imported from other Asian countries
    "Eggs": { origin: "Imported", tariffImpact: 70 }, // Now imported with high tariff impact
    "Chicken": { origin: "Local", tariffImpact: 0 },
    "Fruits": { origin: "Local", tariffImpact: 0 }, // Vietnam produces many tropical fruits
    "Sugar": { origin: "Imported", tariffImpact: 65 } // Sugar often requires imports
};

function ChangedKitchen({ gameState }) {
    const navigate = useNavigate();
    const [tvOn, setTvOn] = useState(false);
    const [showPrompt, setShowPrompt] = useState(true);
    const [isStirring, setIsStirring] = useState(false);
    const [newDiscovery, setNewDiscovery] = useState(null);
    const [showCraftPanel, setShowCraftPanel] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const audioTriggeredRef = useRef(false);

    // Initial ingredients with a focus on noodle-making
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

    // Initialize global audio system when component mounts
    useEffect(() => {
        console.log("ChangedKitchen scene mounted, initializing global audio");

        // This makes sure the global audio system is initialized
        // It won't re-initialize if already done
        globalAudio.init();

        return () => {
            // Cleanup code if needed
            // Note: we don't stop background loops on unmount
            // as they should continue between scenes
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

    // Determine resource scarcity based on tariff rates
    const getIngredientScarcity = (ingredientName) => {
        const ingredientOrigin = IngredientOrigins[ingredientName];
        if (!ingredientOrigin) return false;

        // If tariff is above 50, consider the ingredient scarce
        return ingredientOrigin.tariffImpact > 50;
    };

    // Calculate impact based on tariff sliders
    const seafoodImpact = gameState?.tariffRates?.seafoodImports > 70 ? 'severe' :
        gameState?.tariffRates?.seafoodImports > 40 ? 'moderate' : 'light';

    const tariffImpact = gameState?.tariffRates?.seafoodImports || 60;

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

        // Check if ingredient is scarce
        const isIngredientScarce = getIngredientScarcity(ingredient.name);
        if (isIngredientScarce) {
            console.log(`${ingredient.name} is scarce due to high tariffs`);
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
            // Check if this is a new discovery
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
                    setTimeout(() => setNewDiscovery(null), 3000);

                    // Automatically open the recipe book to show new discovery
                    setShowCraftPanel(true);

                    // Add to discovered ingredients
                    return [...prevDiscovered, newIngredient];
                }

                return prevDiscovered;
            });

            // Update pot contents
            setPotContent({
                name: result.name,
                color: result.color,
                emoji: result.emoji
            });

            // Animate cooking
            setIsStirring(true);
            setTimeout(() => setIsStirring(false), 2000);
        }

        // Clear selection slots after a short delay
        setTimeout(() => {
            setSelectedIngredients([null, null]);
        }, 1000);
    }, []);

    // Toggle recipe book
    const toggleCraftPanel = useCallback(() => {
        setShowCraftPanel(prev => !prev);
    }, []);

    return (
        <KitchenContainer onClick={enableAudio}>
            {/* Audio component - this will play the fail sounds instead of success sounds */}
            <ChangedKitchenAudio
                isStirring={isStirring}
                potContent={potContent}
                newDiscovery={newDiscovery}
                showCraftPanel={showCraftPanel}
                tvOn={tvOn}
                isMuted={!audioEnabled}
            />

            {/* Replace KitchenBackground with direct BackgroundImage usage */}
            <BackgroundImage image={backgroundImage} />

            <CookingArea
                potContent={potContent}
                isStirring={isStirring}
                tariffImpact={tariffImpact}
                seafoodImpact={seafoodImpact}
            />

            <RecipeBook onClick={toggleCraftPanel} />

            <CombineArea
                selectedIngredients={selectedIngredients}
            />

            {/* Recipe book panel with scarcity indicator */}
            {showCraftPanel && (
                <RecipeBook.Panel
                    ingredients={ingredientsDiscovered.map(ingredient => ({
                        ...ingredient,
                        scarce: getIngredientScarcity(ingredient.name)
                    }))}
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

            <Calendar
                month="APRIL"
                day="9"
                notes={["Effective date of", "new tariffs"]}
            />

            <StickyNote
                title="NO EGGS"
                text={[
                    "at the market today",
                    ...(seafoodImpact === 'severe' ? ["...or this month"] : [])
                ]}
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

export default ChangedKitchen;