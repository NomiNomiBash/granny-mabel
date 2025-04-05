import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const RecipeBookButton = styled.div`
    position: absolute;
    bottom: 200px;
    left: 45px;
    width: 80px;
    height: 60px;
    background-color: #FFECB3;
    transform: rotate(-5deg);
    border: 3px solid #8B4513;
    cursor: pointer;
    z-index: 30;

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

    &::after {
        content: 'Recipe Book (Click or Press R)';
        position: absolute;
        bottom: -20px;
        left: 0;
        width: 100px;
        font-size: 10px;
        font-weight: bold;
        color: white;
        text-shadow: 1px 1px 1px #000;
        text-align: center;
    }
`;

const CraftPanel = styled.div`
    position: absolute;
    top: 75px;
    right: 15px;
    width: 400px;
    height: 200px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 10px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 200;
    max-height: 300px;
    overflow-y: auto;
`;

const PanelTitle = styled.div`
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #5D4037;
`;

const IngredientGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 15px;
    max-height: 250px;
    overflow-y: auto;
`;

const Ingredient = styled(motion.div)`
    width: 100%;
    height: 50px;
    background-color: ${props => props.bgColor || '#FFF9C4'};
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: grab;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    user-select: none;
`;

const IngredientIcon = styled.div`
    font-size: 24px;
    margin-bottom: 4px;
`;

const IngredientName = styled.div`
    font-size: 10px;
    font-weight: bold;
    color: #5D4037;
`;

const RecipeBookComponent = ({ onClick }) => (
    <RecipeBookButton
        onClick={(e) => {
            e.stopPropagation(); // Prevent event bubbling
            onClick();
        }}
    />
);

// Panel subcomponent
const RecipeBookPanel = ({ ingredients, onIngredientClick }) => (
    <CraftPanel>
        <PanelTitle>Grandma's Recipe Book <small style={{ fontSize: '12px' }}>(Click ingredients to use them)</small></PanelTitle>
        <IngredientGrid>
            {ingredients.map((ingredient) => (
                <Ingredient
                    key={ingredient.id}
                    bgColor={ingredient.color}
                    onClick={() => onIngredientClick(ingredient)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <IngredientIcon>{ingredient.emoji}</IngredientIcon>
                    <IngredientName>{ingredient.name}</IngredientName>
                </Ingredient>
            ))}
        </IngredientGrid>
    </CraftPanel>
);

// Export the recipe book with its panel as a property
export const RecipeBook = Object.assign(RecipeBookComponent, {
    Panel: RecipeBookPanel
});