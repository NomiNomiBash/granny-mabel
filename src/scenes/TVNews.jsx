// src/scenes/TVNews.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import anchorImage from '../assets/chihuahua.png'; // Update this path
import globalAudio from '../utils/GlobalAudio'; // Import global audio

const TVContainer = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: #FFF8E1;
    opacity: 0.9;
    position: relative;
    overflow: hidden;
`;

const KitchenBackground = styled.div`
    width: 100%;
    height: 100%;
    background-color: #FFF8E1;
    position: absolute;
    opacity: 0.3;
    filter: blur(5px);
`;

const Television = styled(motion.div)`
    position: absolute;
    background-color: #444444;
    border-radius: 20px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const TVScreen = styled(motion.div)`
    position: absolute;
    width: 87%;
    height: 78%;
    background-color: ${props => props.isOn ? '#222831' : '#111111'};
    border-radius: 10px;
    top: 7%;
    left: 7%;
    overflow: hidden;
`;

const TVControls = styled.div`
    position: absolute;
    bottom: 25px;
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 50px;
`;

const TVControl = styled.div`
    width: ${props => props.$main ? '30px' : '20px'};
    height: ${props => props.$main ? '30px' : '20px'};
    border-radius: 50%;
    background-color: #333333;
    border: 2px solid #555555;
    cursor: pointer; /* Add cursor pointer for interactive feel */

    &:hover {
        background-color: #444444; /* Hover effect */
    }

    &:active {
        background-color: #222222; /* Active effect */
    }
`;

const TVBrand = styled.div`
    position: absolute;
    bottom: 25px;
    left: 30px;
    color: #888888;
    font-family: Arial, sans-serif;
    font-size: 14px;
`;

const NewsHeader = styled(motion.div)`
    position: absolute;
    width: 100%;
    height: 50px;
    background-color: #D32F2F;
    top: 0;
    display: flex;
    align-items: center;
    padding: 0 20px;
`;

const NewsHeaderText = styled.div`
    color: white;
    font-family: Arial, sans-serif;
    font-weight: bold;
    font-size: 24px;
`;

const NewsContent = styled(motion.div)`
    position: absolute;
    top: 55px;
    width: 100%;
    height: calc(100% - 85px);
    background-color: #ECF0F1;
    padding: 10px;
`;

const NewsTicker = styled(motion.div)`
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 30px;
    background-color: #D32F2F;
    color: white;
    display: flex;
    align-items: center;
    padding: 0 15px;
    font-family: Arial, sans-serif;
    overflow: hidden;
`;

const NewsTickerText = styled(motion.div)`
    white-space: nowrap;
    animation: tickerScroll 20s linear infinite;

    @keyframes tickerScroll {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
    }
`;

const SplitScreen = styled.div`
    display: flex;
    gap: 10px;
`;

const AnchorBox = styled.div`
    width: 450px;
    height: 300px;
    background-color: #34495E;
    position: relative;
`;

const AnchorFigure = styled.div`
    position: absolute;
    width: 450px;
    left: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const MainStory = styled.div`
    flex: 1;
    background-color: white;
    padding: 10px;
    font-family: Arial, sans-serif;
`;

const MainStoryTitle = styled.h2`
    color: #2C3E50;
    font-size: 18px;
    margin-bottom: 10px;
`;

const TariffList = styled.ul`
    margin: 0;
    padding-left: 20px;
`;

const TariffItem = styled.li`
    color: #2C3E50;
    font-size: 14px;
    margin-bottom: 5px;
`;

const CountriesPanel = styled.div`
    margin-left: 50%;
    background-color: white;
    padding: 10px;
    display: flex;
    justify-content: space-between;
`;

const Country = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 60px;
    cursor: pointer; /* Add cursor pointer for interaction */

    &:hover {
        transform: scale(1.05); /* Add subtle hover effect */
    }
`;

const CountryFlag = styled.div`
    width: 40px;
    height: 30px;
    background-color: ${props => props.color || '#ccc'};
    margin-bottom: 5px;
`;

const CountryName = styled.div`
    font-size: 10px;
    color: #2C3E50;
`;

const CountryRate = styled.div`
    font-size: 12px;
    font-weight: bold;
    color: #E74C3C;
`;

const ZoomButton = styled(motion.div)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(52, 152, 219, 0.7);
    color: white;
    padding: 10px 20px;
    border-radius: 20px;
    font-family: Arial, sans-serif;
    font-weight: bold;
    cursor: pointer;
    z-index: 100;
`;

const TVScanLine = styled(motion.div)`
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: white;
    opacity: 0.3;
    top: 0;
`;

// Static effect overlay
const StaticEffect = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.2;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E");
    mix-blend-mode: overlay;
`;

function TVNews() {
    const navigate = useNavigate();
    // Start with TV already on since it was on in Kitchen scene
    const [isOn, setIsOn] = useState(true);
    const [showContent, setShowContent] = useState(false);
    const [scanLinePosition, setScanLinePosition] = useState(0);
    const [isCentering, setIsCentering] = useState(false);


    useEffect(() => {
// Show content after a brief delay to allow for position animation to start
        const showContentTimer = setTimeout(() => {
            setShowContent(true);
        }, 400);

        return () => {
            clearTimeout(showContentTimer);
        };
    }, []);

    useEffect(() => {
        if (isOn) {
            const scanInterval = setInterval(() => {
                setScanLinePosition((prev) => (prev > 350 ? 0 : prev + 2));
            }, 50);

            return () => clearInterval(scanInterval);
        }
    }, [isOn]);

    const handleZoomClick = () => {

    };

    // Handle TV control clicks
    const handleTVControlClick = () => {
        playClickSound(); // Play click sound
    };

    // Handle country click
    const handleCountryClick = () => {
        playClickSound(); // Play click sound
    };

    return (
        <TVContainer>
            <KitchenBackground />

            <Television
                initial={{
                    left: '250px',
                    top: '275px',
                    width: '150px',
                    height: '100px',
                    borderRadius: '5px',
                    opacity: 0.9,
                }}
                animate={{

                }}
                transition={{
                    duration: 1,
                    ease: 'easeInOut',
                }}
            >
                <TVScreen isOn={isOn}>
                    <AnimatePresence>
                        {showContent && (
                            <>
                                <NewsHeader
                                    initial={{ y: -50 }}
                                    animate={{ y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                >
                                    <NewsHeaderText>BREAKING NEWS</NewsHeaderText>
                                </NewsHeader>

                                <NewsContent
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6, duration: 0.8 }}
                                >
                                    <SplitScreen>
                                        <AnchorBox>
                                            <AnchorFigure>
                                                <img
                                                    src={anchorImage}
                                                    alt="News Anchor"
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: '100%',
                                                        objectFit: 'contain'
                                                    }}
                                                />
                                            </AnchorFigure>
                                        </AnchorBox>

                                        <MainStory>
                                            <MainStoryTitle>NEW TARIFF STRUCTURE</MainStoryTitle>
                                            <TariffList>
                                                <TariffItem>10% baseline tariff on all imports</TariffItem>
                                                <TariffItem>Custom rates for "worst offenders"</TariffItem>
                                            </TariffList>
                                        </MainStory>
                                    </SplitScreen>

                                    <CountriesPanel>
                                        <Country onClick={handleCountryClick}>
                                            <CountryFlag color="#DE2910" />
                                            <CountryName>CHINA</CountryName>
                                            <CountryRate>54%</CountryRate>
                                        </Country>

                                        <Country onClick={handleCountryClick}>
                                            <CountryFlag color="#003399" />
                                            <CountryName>EU</CountryName>
                                            <CountryRate>20%</CountryRate>
                                        </Country>

                                        <Country onClick={handleCountryClick}>
                                            <CountryFlag color="#DA251D" />
                                            <CountryName>VIETNAM</CountryName>
                                            <CountryRate>46%</CountryRate>
                                        </Country>


                                            <CountryName>JAPAN</CountryName>
                                            <CountryRate>24%</CountryRate>
                                        </Country>


                                                <div style={{ height: '10px', backgroundColor: '#ED1C24' }} />
                                                <div style={{ height: '10px', backgroundColor: '#241D4F' }} />
                                                <div style={{ height: '10px', backgroundColor: '#ED1C24' }} />
                                            </CountryFlag>
                                            <CountryName>THAILAND</CountryName>
                                            <CountryRate>36%</CountryRate>
                                        </Country>
                                    </CountriesPanel>

                                    <ZoomButton
                                        onClick={handleZoomClick}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        animate={{
                                            opacity: [0.7, 1, 0.7],
                                            scale: [1, 1.05, 1],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatType: 'reverse',
                                        }}
                                    >
                                        🔍 Zoom In
                                    </ZoomButton>
                                </NewsContent>

                                <NewsTicker
                                    initial={{ y: 30 }}
                                    animate={{ y: 0 }}
                                    transition={{ delay: 0.9, duration: 0.5 }}
                                >
                                    <NewsTickerText>
                                        NEW TARIFFS ANNOUNCED • GLOBAL MARKETS RESPOND • TRADE TENSIONS ESCALATE •
                                        ECONOMIC IMPACT ANALYSIS
                                    </NewsTickerText>
                                </NewsTicker>

                                <TVScanLine style={{ top: `${scanLinePosition}px` }} />
                                <StaticEffect />
                            </>
                        )}
                    </AnimatePresence>
                </TVScreen>

                <TVControls>

                </TVControls>

                <TVBrand>RETROTV</TVBrand>
            </Television>
        </TVContainer>
    );
}

export default TVNews;