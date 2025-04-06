import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Ingredient Item Component
const IngredientItemStyled = styled(motion.div)`
    width: 60px;
    height: 60px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: ${props => props.bgColor || '#FFF9C4'};
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    user-select: none;
    border: 2px solid #5D4037;
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

const IngredientItem = ({ ingredient, onClick }) => (
    <IngredientItemStyled
        bgColor={ingredient.color}
        onClick={() => onClick(ingredient)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
    >
        <IngredientIcon>{ingredient.emoji}</IngredientIcon>
        <IngredientName>{ingredient.name}</IngredientName>
    </IngredientItemStyled>
);

// Ingredients Row Component
const IngredientsRowStyled = styled.div.attrs(props => ({
    ...(props.isrecentrow !== undefined && { 'data-is-recent-row': props.isrecentrow.toString() })
}))`
    position: absolute;
    bottom: ${props => props.isrecentrow ? '250px' : '180px'};
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: center;
    gap: 20px;
    z-index: 40;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 10px 20px;
    border-radius: 10px;
    border: 3px solid #8B4513;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

export const IngredientRow = ({ baseIngredients, onIngredientClick, isrecentrow }) => (
    <IngredientsRowStyled isrecentrow={isrecentrow}>
        {baseIngredients.map(ingredient => (
            <IngredientItem
                key={ingredient.id}
                ingredient={ingredient}
                onClick={onIngredientClick}
            />
        ))}
    </IngredientsRowStyled>
);

// Calendar Component
const CalendarContainer = styled.div`
    position: absolute;
    top: 15px;
    left: 310px;
    width: 100px;
    height: 50px;
    background-color: white;
    border: 1px solid #BDBDBD;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 5;
`;

const CalendarMonth = styled.div`
    width: 100%;
    height: 20px;
    background-color: white;
    border-bottom: 1px solid #BDBDBD;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    color: #333;
`;

const CalendarDay = styled.div`
    font-size: 24px;
    font-weight: bold;
    color: #E74C3C;
`;

const CalendarNote = styled.div`
    font-size: 12px;
    font-weight: bold;
    color: #E74C3C;
    text-align: center;
    margin-top: 2px;
`;

export const Calendar = ({ month, day, notes = [] }) => {
    return (
        <CalendarContainer>
            <CalendarMonth>{month}</CalendarMonth>
            <CalendarDay>{day}</CalendarDay>
            {notes.map((note, index) => (
                <CalendarNote key={index}>{note}</CalendarNote>
            ))}
        </CalendarContainer>
    );
};

// Sticky Note Component
const StickyNoteContainer = styled.div`
    position: absolute;
    bottom: 80px;
    left: 45px;
    width: 80px;
    height: 60px;
    background-color: #FFF59D;
    transform: rotate(5deg);
    padding: 5px;
    z-index: 10;
`;

const StickyNoteTitle = styled.div`
    font-weight: bold;
    font-size: 10px;
    margin-bottom: 5px;
    color: #333;
`;

const StickyNoteText = styled.div`
    font-size: 8px;
    color: #333;
`;

export const StickyNote = ({ title, text = [] }) => {
    return (
        <StickyNoteContainer>
            <StickyNoteTitle>{title}</StickyNoteTitle>
            {text.map((line, index) => (
                <StickyNoteText key={index}>{line}</StickyNoteText>
            ))}
        </StickyNoteContainer>
    );
};

// Discovery Counter Component
const DiscoveryCounterStyled = styled.div`
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 16px;
    color: #5D4037;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px 15px;
    border-radius: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 25;
`;

export const DiscoveryCounter = ({
                                     discoveries,
                                     totalPossible,
                                     currentRecipe,
                                     showCraftPanel,
                                     toggleCraftPanel
                                 }) => (
    <DiscoveryCounterStyled>
        Discoveries: {discoveries}/{totalPossible}
        {currentRecipe && <span> | Current: {currentRecipe}</span>}
        <span
            style={{ marginLeft: '15px', cursor: 'pointer' }}
            onClick={toggleCraftPanel}
        >
            {showCraftPanel ? '[Close Book]' : '[Open Book]'}
        </span>
    </DiscoveryCounterStyled>
);

// Discovery Notification Component
const DiscoveryNotificationStyled = styled(motion.div)`
    position: absolute;
    top: 15px;
    left: 42%;
    transform: translateX(-50%);
    background-color: rgba(76, 175, 80, 0.9);
    color: white;
    padding: 10px 20px;
    border-radius: 20px;
    font-size: 18px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 300;
`;

export const DiscoveryNotification = ({ discovery }) => {
    const notificationVariants = {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    return (
        <DiscoveryNotificationStyled
            initial="initial"
            animate="animate"
            exit="exit"
            variants={notificationVariants}
            key="discovery-notification"
        >
            🎉 Discovered: {discovery}!
        </DiscoveryNotificationStyled>
    );
};

// Recipe Instructions Component
const RecipeInstructionsStyled = styled.div`
    position: absolute;
    top: 15px;
    left: 15px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 10px;
    padding: 10px 15px;
    font-size: 14px;
    color: #5D4037;
    max-width: 250px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 25;
`;

export const RecipeInstructions = () => (
    <RecipeInstructionsStyled>
        <strong>How to play:</strong>
        <ol style={{ paddingLeft: '20px', marginTop: '5px', fontSize: '12px' }}>
            <li>Click ingredients to combine them</li>
            <li>New discoveries appear in the pot</li>
            <li>Try combining new ingredients to discover more recipes!</li>
        </ol>
    </RecipeInstructionsStyled>
);

// Combine Area Component
const CombineAreaStyled = styled.div`
    position: absolute;
    bottom: 120px;
    left: 280px;
    width: 250px;
    height: 80px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 10px;
    border: 3px solid #8B4513;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    z-index: 25;
`;

const DropSlot = styled.div`
    width: 80px;
    height: 60px;
    border: 2px dashed ${props => props.$isActive ? '#4CAF50' : '#BDBDBD'};
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.$isFilled ? 'rgba(200, 230, 201, 0.5)' : 'transparent'};
`;

const DropSlotIcon = styled.div`
    font-size: 24px;
    color: ${props => props.$isActive ? '#4CAF50' : '#BDBDBD'};
`;

const PlusSign = styled.div`
    font-size: 24px;
    color: #5D4037;
`;

export const CombineArea = ({ selectedIngredients }) => (
    <CombineAreaStyled>
        <DropSlot
            $isFilled={selectedIngredients[0] !== null}
            $isActive={selectedIngredients[0] !== null}
        >
            {selectedIngredients[0] ? (
                <>
                    <IngredientIcon>{selectedIngredients[0].emoji}</IngredientIcon>
                    <IngredientName>{selectedIngredients[0].name}</IngredientName>
                </>
            ) : (
                <DropSlotIcon $isActive={false}>1</DropSlotIcon>
            )}
        </DropSlot>
        <PlusSign>+</PlusSign>
        <DropSlot
            $isFilled={selectedIngredients[1] !== null}
            $isActive={selectedIngredients[1] !== null}
        >
            {selectedIngredients[1] ? (
                <>
                    <IngredientIcon>{selectedIngredients[1].emoji}</IngredientIcon>
                    <IngredientName>{selectedIngredients[1].name}</IngredientName>
                </>
            ) : (
                <DropSlotIcon $isActive={false}>2</DropSlotIcon>
            )}
        </DropSlot>
    </CombineAreaStyled>
);