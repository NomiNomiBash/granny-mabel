import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Import or create components similar to the Kitchen scene
import { KitchenBackground } from '../components/kitchen/KitchenBackground';
import { CookingArea } from '../components/kitchen/CookingArea';
import { RecipeBook } from '../components/kitchen/RecipeBook';
import { TelevisionComponent } from '../components/kitchen/Television';
import {
    DiscoveryCounter,
    DiscoveryNotification,
    RecipeInstructions,
    CombineArea,
    Calendar,
    StickyNote
} from '../components/kitchen/KitchenUI';
import {InfiniteRecipes} from "../data/RecipeData.js";

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

    // Handle ingredient selection
    const selectIngredient = (ingredient) => {
        if (!ingredient) {
            console.error("Tried to select undefined ingredient");
            return;
        }

        // Check if ingredient is scarce
        const isIngredientScarce = getIngredientScarcity(ingredient.name);
        if (isIngredientScarce) {
            console.log(`${ingredient.name} is scarce due to high tariffs`);
        }

        // Create a new array with the updated ingredients
        let newSelectedIngredients = [...selectedIngredients];

        if (selectedIngredients[0] === null) {
            // First slot is empty, add to first slot
            newSelectedIngredients[0] = ingredient;
            setSelectedIngredients(newSelectedIngredients);
        } else if (selectedIngredients[1] === null) {
            // Second slot is empty, add to second slot and combine
            newSelectedIngredients[1] = ingredient;
            setSelectedIngredients(newSelectedIngredients);

            // We need to use setTimeout to ensure state is updated before combining
            setTimeout(() => {
                if (newSelectedIngredients[0] && newSelectedIngredients[1]) {
                    combineIngredients(newSelectedIngredients[0], newSelectedIngredients[1]);
                }
            }, 100);
        } else {
            // Both slots are full, reset and add to first slot
            newSelectedIngredients = [ingredient, null];
            setSelectedIngredients(newSelectedIngredients);
        }
    };

    // Combine ingredients
    const combineIngredients = (ingredient1, ingredient2) => {
        // Check both combinations (order doesn't matter)
        const combination = `${ingredient1.name}+${ingredient2.name}`;
        const reverseCombination = `${ingredient2.name}+${ingredient1.name}`;

        let result = InfiniteRecipes[combination] || InfiniteRecipes[reverseCombination];

        if (result) {
            // Check if this is a new discovery
            const alreadyDiscovered = ingredientsDiscovered.some(i => i.name === result.name);

            // Create new ingredient object
            const newIngredient = {
                id: ingredientsDiscovered.length + 1,
                name: result.name,
                emoji: result.emoji,
                color: result.color
            };

            if (!alreadyDiscovered) {
                // Add to discovered ingredients
                setIngredientsDiscovered(prev => [...prev, newIngredient]);

                // Show discovery notification
                setNewDiscovery(result.name);
                setTimeout(() => setNewDiscovery(null), 3000);

                // Automatically open the recipe book to show new discovery
                setShowCraftPanel(true);
            }

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
    };

    // Toggle recipe book
    const toggleCraftPanel = () => {
        setShowCraftPanel(prev => !prev);
    };

    return (
        <KitchenContainer>
            <KitchenBackground />

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

// Keep the main container here for cleaner imports
const KitchenContainer = styled.div`
    background-color: #87CEEB; // Sky blue background for the ocean view
    height: 100vh;
    width: 100vw;
    position: relative;
    overflow: hidden;
`;

export default ChangedKitchen;