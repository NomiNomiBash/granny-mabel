// src/components/kitchen/KitchenAudio.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAudio } from '../../utils/AudioManager';

// List of all audio files to be used in the kitchen scene
const AUDIO_FILES = {
    // Background loops
    PIANO_MUSIC: {
        id: 'piano',
        url: '/src/assets/pianomusic.wav',
        type: 'loop',
        volume: 0.4
    },
    OCEAN_WAVES: {
        id: 'ocean',
        url: '/src/assets/ES_Small Waves, Ocean, Beach, Crickets - Epidemic Sound.wav',
        type: 'loop',
        volume: 0.2
    },
    CURLEW_WAVES: {
        id: 'curlew',
        url: '/src/assets/ES_Snipes, Curlew Calling, Crickets, Waves In Background - Epidemic Sound.wav',
        type: 'ambient',
        volume: 0.3
    },

    // Grandma sound effects
    GRANDMA_HMM: {
        id: 'grandma_hmm',
        url: '/src/assets/soundbites/grandma_hmm.mp3',
        type: 'reaction',
        volume: 1.0
    },
    GRANDMA_HAHA: {
        id: 'grandma_haha',
        url: '/src/assets/soundbites/grandma_ahaha.mp3', // Fixed name: ahaha not haha
        type: 'reaction',
        volume: 1.0
    },
    GRANDMA_MMM: {
        id: 'grandma_mmm',
        url: '/src/assets/soundbites/grandma_mmm.mp3',
        type: 'reaction',
        volume: 1.0
    },
    GRANDMA_MMHMM: {
        id: 'grandma_mmhmm',
        url: '/src/assets/soundbites/grandma_mmhmm.mp3',
        type: 'reaction',
        volume: 1.0
    },

    // Crafting success lines
    GRANDMA_CRAFT_SUCCESS_1: {
        id: 'grandma_success_1',
        url: '/src/assets/before/grandma_craft_success_1.mp3',
        type: 'craft',
        volume: 1.0
    },
    GRANDMA_CRAFT_SUCCESS_2: {
        id: 'grandma_success_2',
        url: '/src/assets/before/grandma_craft_success_2.mp3',
        type: 'craft',
        volume: 1.0
    },
    GRANDMA_CRAFT_SUCCESS_3: {
        id: 'grandma_success_3',
        url: '/src/assets/before/grandma_craft_success_3.mp3',
        type: 'craft',
        volume: 1.0
    },
    GRANDMA_CRAFT_SUCCESS_4: {
        id: 'grandma_success_4',
        url: '/src/assets/before/grandma_craft_success_4.mp3',
        type: 'craft',
        volume: 1.0
    },
    GRANDMA_CRAFT_SUCCESS_5: {
        id: 'grandma_success_5',
        url: '/src/assets/before/grandma_craft_success_5.mp3',
        type: 'craft',
        volume: 1.0
    },

    // UI sounds
    UI_CLICK: {
        id: 'ui_click',
        url: '/src/assets/ui_click.wav', // Changed to an existing file for UI click
        type: 'ui',
        volume: 0.6
    },
    UI_PAGE_TURN: {
        id: 'ui_page_turn',
        url: '/src/assets/ui_page_turn.wav', // Changed to an existing file for page turn
        type: 'ui',
        volume: 0.7
    }
};

// Main KitchenAudio component
const KitchenAudio = ({
                          isStirring = false,
                          potContent = null,
                          newDiscovery = false,
                          showCraftPanel = null,
                          tvOn = false,
                          isMuted = false
                      }) => {
    const {
        isReady,
        loadedSounds,
        loadSound,
        playSound,
        startLoop,
        stopLoop,
        setLoopVolume,
        isSoundLoaded
    } = useAudio();

    const [localIsMuted, setLocalIsMuted] = useState(isMuted);
    const ambientSoundTimerRef = useRef(null);
    const grandmaReactionTimerRef = useRef(null);
    const prevShowCraftPanelRef = useRef(showCraftPanel);
    const prevNewDiscoveryRef = useRef(newDiscovery);

    // Flag to track loading attempts
    const [loadingAttempted, setLoadingAttempted] = useState(false);

    // Track active loops to ensure they're properly managed
    const activeLoopsRef = useRef({
        piano: false,
        ocean: false
    });

    // Update local mute state when prop changes
    useEffect(() => {
        setLocalIsMuted(isMuted);

        // If mute status changes, update all active loops
        if (isReady && loadingAttempted) {
            Object.entries(activeLoopsRef.current).forEach(([id, isActive]) => {
                if (isActive) {
                    if (isMuted) {
                        stopLoop(id);
                        activeLoopsRef.current[id] = false;
                    } else {
                        const soundConfig = Object.values(AUDIO_FILES).find(audio => audio.id === id);
                        if (soundConfig) {
                            startLoop(id, soundConfig.volume);
                            activeLoopsRef.current[id] = true;
                        }
                    }
                }
            });
        }
    }, [isMuted, isReady, loadingAttempted, startLoop, stopLoop]);

    // Load all audio files when component mounts - with graceful fallback
    useEffect(() => {
        if (isReady && !loadingAttempted) {
            setLoadingAttempted(true);

            console.log("Attempting to load audio files for kitchen scene...");

            // Try to load sounds individually to allow partial success
            Object.values(AUDIO_FILES).forEach(audio => {
                // Check if already loaded first
                if (!isSoundLoaded(audio.id)) {
                    loadSound(audio.id, audio.url).catch(err => {
                        console.warn(`Audio file ${audio.id} could not be loaded, continuing without this sound`);
                    });
                }
            });
        }
    }, [isReady, loadSound, loadingAttempted, isSoundLoaded]);

    // Start background loops for any successfully loaded sounds
    useEffect(() => {
        // Only proceed if we've attempted loading and audio is ready
        if (!isReady || !loadingAttempted || localIsMuted) return;

        // Check which background sounds loaded successfully
        const pianoLoaded = loadedSounds.includes(AUDIO_FILES.PIANO_MUSIC.id);
        const oceanLoaded = loadedSounds.includes(AUDIO_FILES.OCEAN_WAVES.id);

        // Start any successful background loops
        if (pianoLoaded && !activeLoopsRef.current.piano) {
            startLoop(AUDIO_FILES.PIANO_MUSIC.id, AUDIO_FILES.PIANO_MUSIC.volume);
            activeLoopsRef.current.piano = true;
        }

        if (oceanLoaded && !activeLoopsRef.current.ocean) {
            startLoop(AUDIO_FILES.OCEAN_WAVES.id, AUDIO_FILES.OCEAN_WAVES.volume);
            activeLoopsRef.current.ocean = true;
        }

        // Only start timers if we have the relevant sounds and they aren't already running
        if (loadedSounds.includes(AUDIO_FILES.CURLEW_WAVES.id) && !ambientSoundTimerRef.current) {
            startAmbientSoundTimer();
        }

        if ((loadedSounds.includes(AUDIO_FILES.GRANDMA_HMM.id) ||
                loadedSounds.includes(AUDIO_FILES.GRANDMA_HAHA.id)) &&
            !grandmaReactionTimerRef.current) {
            startGrandmaReactionTimer();
        }

        // Return cleanup function
        return () => {
            // Clear timers when component unmounts
            if (ambientSoundTimerRef.current) {
                clearInterval(ambientSoundTimerRef.current);
                ambientSoundTimerRef.current = null;
            }
            if (grandmaReactionTimerRef.current) {
                clearInterval(grandmaReactionTimerRef.current);
                grandmaReactionTimerRef.current = null;
            }

            // Stop all loops this component started
            if (activeLoopsRef.current.piano) {
                stopLoop(AUDIO_FILES.PIANO_MUSIC.id);
            }
            if (activeLoopsRef.current.ocean) {
                stopLoop(AUDIO_FILES.OCEAN_WAVES.id);
            }
        };
    }, [loadedSounds, localIsMuted, loadingAttempted, isReady, startLoop, stopLoop]);

    // Play ambient curlew sounds periodically
    const startAmbientSoundTimer = useCallback(() => {
        if (ambientSoundTimerRef.current) {
            clearInterval(ambientSoundTimerRef.current);
        }

        const timer = setInterval(() => {
            if (!localIsMuted) {
                const curlew = AUDIO_FILES.CURLEW_WAVES;
                if (loadedSounds.includes(curlew.id)) {
                    // 30% chance to play the sound
                    if (Math.random() < 0.3) {
                        playSound(curlew.id, curlew.volume);
                    }
                }
            }
        }, 30000); // Check every 30 seconds

        ambientSoundTimerRef.current = timer;
    }, [loadedSounds, localIsMuted, playSound]);

    // Play grandma reaction sounds periodically
    const startGrandmaReactionTimer = useCallback(() => {
        if (grandmaReactionTimerRef.current) {
            clearInterval(grandmaReactionTimerRef.current);
        }

        const timer = setInterval(() => {
            if (localIsMuted) return;

            const reactionSounds = [
                AUDIO_FILES.GRANDMA_HMM,
                AUDIO_FILES.GRANDMA_HAHA
            ];

            const loadedReactions = reactionSounds.filter(sound =>
                loadedSounds.includes(sound.id)
            );

            if (loadedReactions.length > 0) {
                // 20% chance to play a random reaction
                if (Math.random() < 0.2) {
                    const randomIndex = Math.floor(Math.random() * loadedReactions.length);
                    const sound = loadedReactions[randomIndex];
                    playSound(sound.id, sound.volume);
                }
            }
        }, 10000); // Check every 10 seconds

        grandmaReactionTimerRef.current = timer;
    }, [loadedSounds, localIsMuted, playSound]);

    // Play success sound when a new discovery is made
    useEffect(() => {
        // Only play sound when discovery state changes from false to true
        if (
            newDiscovery &&
            !prevNewDiscoveryRef.current &&
            !localIsMuted &&
            loadingAttempted
        ) {
            const craftSounds = [
                AUDIO_FILES.GRANDMA_CRAFT_SUCCESS_1,
                AUDIO_FILES.GRANDMA_CRAFT_SUCCESS_2,
                AUDIO_FILES.GRANDMA_CRAFT_SUCCESS_3
            ];

            const loadedCraftSounds = craftSounds.filter(sound =>
                loadedSounds.includes(sound.id)
            );

            if (loadedCraftSounds.length > 0) {
                const randomIndex = Math.floor(Math.random() * loadedCraftSounds.length);
                const sound = loadedCraftSounds[randomIndex];
                playSound(sound.id, sound.volume);
            }
        }

        // Update the ref for next render
        prevNewDiscoveryRef.current = newDiscovery;
    }, [newDiscovery, localIsMuted, loadedSounds, playSound, loadingAttempted]);

    // Play UI sounds
    useEffect(() => {
        // Only play sound when showCraftPanel changes to a different value
        if (
            showCraftPanel !== undefined &&
            showCraftPanel !== prevShowCraftPanelRef.current &&
            !localIsMuted &&
            loadingAttempted &&
            loadedSounds.includes(AUDIO_FILES.UI_PAGE_TURN.id)
        ) {
            playSound(AUDIO_FILES.UI_PAGE_TURN.id, AUDIO_FILES.UI_PAGE_TURN.volume);
        }

        // Update the ref for next render
        prevShowCraftPanelRef.current = showCraftPanel;
    }, [showCraftPanel, localIsMuted, loadedSounds, playSound, loadingAttempted]);

    // Handle stirring sound effects
    useEffect(() => {
        // Play sound when user starts stirring
        if (isStirring && !localIsMuted && loadedSounds.includes(AUDIO_FILES.UI_CLICK.id)) {
            // Play UI click sound as a stirring sound
            playSound(AUDIO_FILES.UI_CLICK.id, 0.3);
        }
    }, [isStirring, localIsMuted, loadedSounds, playSound]);

    // Adjust audio when TV is turned on
    useEffect(() => {
        if (!loadingAttempted || !isReady) return;

        if (tvOn && loadedSounds.includes(AUDIO_FILES.PIANO_MUSIC.id) && activeLoopsRef.current.piano) {
            // Fade out background music when TV is on
            setLoopVolume(AUDIO_FILES.PIANO_MUSIC.id, 0.1);
        } else if (loadedSounds.includes(AUDIO_FILES.PIANO_MUSIC.id) && activeLoopsRef.current.piano) {
            // Restore normal volume
            setLoopVolume(AUDIO_FILES.PIANO_MUSIC.id, AUDIO_FILES.PIANO_MUSIC.volume);
        }
    }, [tvOn, loadedSounds, setLoopVolume, loadingAttempted, isReady]);

    // For debugging purposes, we can log what sounds are loaded
    useEffect(() => {
        if (loadedSounds.length > 0) {
            console.log("KitchenAudio: Currently loaded sounds:", loadedSounds);
        }
    }, [loadedSounds]);

    // This component doesn't render anything visible
    return null;
};

export default KitchenAudio;