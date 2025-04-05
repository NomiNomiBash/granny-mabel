// src/scenes/ChangedKitchen.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const KitchenContainer = styled.div`
  background-color: #FFF8E1;
  height: 100vh;
  width: 100vw;
  position: relative;
`;

const Window = styled.div`
  position: absolute;
  top: 100px;
  right: 100px;
  width: 200px;
  height: 250px;
  background-color: #AED6F1;
  border: 8px solid #8D6E63;
  border-radius: 5px;
`;

const GrandmaFigure = styled.div`
  position: absolute;
  top: 90px;
  left: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GrandmaHead = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #5D4037;
`;

const GrandmaBody = styled.div`
  width: 30px;
  height: 40px;
  background-color: #5D4037;
  margin-top: 5px;
`;

const GrandmaArm = styled.div`
  position: absolute;
  top: 40px;
  right: -15px;
  width: 20px;
  height: 5px;
  background-color: #5D4037;
  transform: rotate(20deg);
`;

const KitchenCounter = styled.div`
  position: absolute;
  bottom: 100px;
  left: 50px;
  width: 700px;
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

const Refrigerator = styled.div`
  position: absolute;
  top: 275px;
  left: 100px;
  width: 120px;
  height: 220px;
  background-color: #ECEFF1;
  border-radius: 5px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 30px;
    background-color: #CFD8DC;
    border-radius: 5px 5px 0 0;
  }
`;

// IMPORTANT CHANGE: Empty seafood basket
const EmptyBasket = styled.div`
    position: absolute;
    top: 400px;
    left: 250px;
    width: 100px;
    height: 40px;
    border: 2px solid #8D6E63;
    border-radius: 50%/25%;
    opacity: ${props => props.$tariffImpact > 50 ? 1 : 0.5};
  
  &::before, &::after {
    content: '';
    position: absolute;
    background-color: #8D6E63;
  }
  
  &::before {
    left: 20px;
    top: -5px;
    width: 1px;
    height: 45px;
  }
  
  &::after {
    left: 50px;
    top: -5px;
    width: 1px;
    height: 45px;
  }
`;

const BasketLabel = styled.div`
  position: absolute;
  top: -15px;
  left: 20px;
  width: 60px;
  height: 12px;
  background-color: #FFE0B2;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 6px;
  color: #5D4037;
`;

// IMPORTANT CHANGE: Sticky note about no prawns
const StickyNote = styled.div`
  position: absolute;
  top: 325px;
  left: 130px;
  width: 80px;
  height: 60px;
  background-color: #FFF59D;
  transform: rotate(5deg);
  padding: 5px;
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

const Kettle = styled.div`
  position: absolute;
  top: -50px;
  left: 350px;
  width: 60px;
  height: 40px;
  background-color: #757575;
  border-radius: 10px 10px 0 0;
  
  &::before {
    content: '';
    position: absolute;
    top: -15px;
    left: 25px;
    width: 10px;
    height: 15px;
    background-color: #757575;
  }
`;

const SteamEffect = styled(motion.div)`
  position: absolute;
  top: -30px;
  left: 30px;
  width: 5px;
  height: 20px;
  background-color: white;
  border-radius: 5px;
  opacity: 0.7;
`;

const BreadLoaf = styled.div`
  position: absolute;
  top: -30px;
  right: 100px;
  width: 120px;
  height: 40px;
  background-color: #D4A76A;
  border-radius: 20px;
`;

const JamJars = styled.div`
  position: absolute;
  top: -40px;
  right: 20px;
  display: flex;
  gap: 10px;
`;

const JamJar = styled.div`
  width: 30px;
  height: 40px;
  background-color: ${props => props.color || '#D32F2F'};
  border-radius: 5px 5px 10px 10px;
  opacity: 0.8;
  
  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: 0;
    width: 30px;
    height: 5px;
    background-color: #BDBDBD;
  }
`;

const Television = styled.div`
  position: absolute;
  top: 275px;
  left: 250px;
  width: 150px;
  height: 100px;
  background-color: #212121;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const TVScreen = styled.div`
  width: 130px;
  height: 80px;
  background-color: #263238;
  border-radius: 2px;
`;

const Calendar = styled.div`
  position: absolute;
  top: 40px;
  right: 180px;
  width: 80px;
  height: 50px;
  background-color: white;
  border: 1px solid #BDBDBD;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CalendarMonth = styled.div`
  width: 100%;
  height: 20px;
  background-color: white;
  border-bottom: 1px solid #BDBDBD;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 10px;
  color: #333;
`;

const CalendarDay = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #E74C3C;
  margin-top: 3px;
`;

const CalendarNote = styled.div`
  font-size: 7px;
  color: #333;
  text-align: center;
  margin-top: 2px;
`;

function ChangedKitchen({ gameState }) {
    // Calculate impact based on tariff sliders
    const seafoodImpact = gameState.tariffRates.seafoodImports > 70 ? 'severe' :
        gameState.tariffRates.seafoodImports > 40 ? 'moderate' : 'light';

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

    return (
        <KitchenContainer>
            <Window>
                <GrandmaFigure>
                    <GrandmaHead />
                    <GrandmaBody />
                    <GrandmaArm />
                </GrandmaFigure>
            </Window>

            <KitchenCounter>
                <Kettle>
                    <SteamEffect
                        variants={steamVariants}
                        animate="animate"
                    />
                    <SteamEffect
                        style={{ left: '20px', top: '-25px' }}
                        variants={steamVariants}
                        animate="animate"
                    />
                </Kettle>

                <BreadLoaf />

                <JamJars>
                    <JamJar color="#D32F2F" />
                    <JamJar color="#7B1FA2" />
                </JamJars>

                {/* Empty Seafood Basket */}
                <EmptyBasket $tariffImpact={gameState.tariffRates.seafoodImports}>
                    <BasketLabel>SEAFOOD</BasketLabel>
                </EmptyBasket>
            </KitchenCounter>

            <Refrigerator>
                {/* Sticky Note with No Prawns */}
                <StickyNote>
                    <StickyNoteTitle>NO PRAWNS</StickyNoteTitle>
                    <StickyNoteText>at the market today</StickyNoteText>
                    {seafoodImpact === 'severe' && <StickyNoteText>...or this month</StickyNoteText>}
                </StickyNote>
            </Refrigerator>

            <Television>
                <TVScreen />
            </Television>

            <Calendar>
                <CalendarMonth>APRIL</CalendarMonth>
                <CalendarDay>9</CalendarDay>
                <CalendarNote>Effective date of</CalendarNote>
                <CalendarNote>new tariffs</CalendarNote>
            </Calendar>
        </KitchenContainer>
    );
}

export default ChangedKitchen;