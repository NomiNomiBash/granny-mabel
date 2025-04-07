// src/components/kitchen/KitchenAudio.jsx
import { useEffect, useRef } from 'react';
import globalAudio from '../../utils/GlobalAudio';

// KitchenAudio component - redesigned to work with global audio system
const KitchenAudio = ({
                          isStirring = false,
                          potContent = null,
                          newDiscovery = false,
                          showCraftPanel = null,
                          tvOn = false,
                          isMuted = false
                      }) => {
    // Keep track of previous state to detect changes
    const prevShowCraftPanelRef = useRef(showCraftPanel);
    const prevNewDiscoveryRef = useRef(newDiscovery);
    const prevTvOnRef = useRef(tvOn);
    const prevIsMutedRef = useRef(isMuted);

    // Refs for timers
    const ambientSoundTimerRef = useRef(null);
    const grandmaReactionTimerRef = useRef(null);

    // These refs track if we've started our setup
    const setupDoneRef = useRef(false);
    const backgroundStartedRef = useRef(false);

    // Track if a success sound is currently playing
    const successSoundPlayingRef = useRef(false);
    const successSoundTimeoutRef = useRef(null);

    // Track if reaction has played initially
    const initialReactionPlayedRef = useRef(false);
    const initialReactionTimeoutRef = useRef(null);

    // Audio file IDs
    const AUDIO_IDS = {
        PIANO: 'piano',
        OCEAN: 'ocean',
        CURLEW: 'curlew',
        UI_CLICK: 'ui_click',
        UI_PAGE_TURN: 'ui_page_turn',

        // Grandma sounds
        GRANDMA_HMM: 'grandma_hmm',
        GRANDMA_HAHA: 'grandma_haha',
        GRANDMA_MMM: 'grandma_mmm',
        GRANDMA_MMHMM: 'grandma_mmhmm',

        // Craft success sounds
        GRANDMA_SUCCESS_1: 'grandma_success_1',
        GRANDMA_SUCCESS_2: 'grandma_success_2',
        GRANDMA_SUCCESS_3: 'grandma_success_3',
        GRANDMA_SUCCESS_4: 'grandma_success_4',
        GRANDMA_SUCCESS_5: 'grandma_success_5',
    };

    // Helper to play a grandma reaction sound
    const playGrandmaReaction = () => {
        if (isMuted || successSoundPlayingRef.current) return false;

        const reactionSounds = [
            AUDIO_IDS.GRANDMA_HMM,
            AUDIO_IDS.GRANDMA_HAHA,
            AUDIO_IDS.GRANDMA_MMM,
            AUDIO_IDS.GRANDMA_MMHMM
        ];

        const loadedReactions = reactionSounds.filter(id =>
            globalAudio.isSoundLoaded(id)
        );

        if (loadedReactions.length > 0) {
            const randomIndex = Math.floor(Math.random() * loadedReactions.length);
            const soundId = loadedReactions[randomIndex];
            console.log(`[KitchenAudio] Playing grandma reaction sound: ${soundId}`);
            // Increase volume to make sure we hear it
            globalAudio.playSound(soundId, 1.0);
            return true;
        }

        return false;
    };

    // Initial setup - runs only once
    useEffect(() => {
        if (setupDoneRef.current) return;

        console.log("[KitchenAudio] Initial setup");
        setupDoneRef.current = true;

        // Listen for sounds being loaded
        const handleSoundLoaded = (event) => {
            console.log(`[KitchenAudio] Sound loaded: ${event.id}`);

            // Start background loops once sounds are loaded
            startBackgroundIfReady();

            // Schedule an initial reaction sound soon after sounds are loaded
            if (!initialReactionPlayedRef.current &&
                (event.id === AUDIO_IDS.GRANDMA_HMM ||
                    event.id === AUDIO_IDS.GRANDMA_HAHA ||
                    event.id === AUDIO_IDS.GRANDMA_MMM ||
                    event.id === AUDIO_IDS.GRANDMA_MMHMM)) {

                if (initialReactionTimeoutRef.current) {
                    clearTimeout(initialReactionTimeoutRef.current);
                }

                initialReactionTimeoutRef.current = setTimeout(() => {
                    if (!initialReactionPlayedRef.current && !isMuted) {
                        console.log("[KitchenAudio] Playing initial grandma reaction");
                        if (playGrandmaReaction()) {
                            initialReactionPlayedRef.current = true;
                        }
                    }
                }, 3000); // Play an initial reaction soon after loading
            }
        };

        globalAudio.addEventListener('soundLoaded', handleSoundLoaded);

        return () => {
            globalAudio.removeEventListener('soundLoaded', handleSoundLoaded);
            cleanupTimers();
        };
    }, [isMuted]);

    // Function to start background sounds if ready
    const startBackgroundIfReady = () => {
        // Don't restart if already started or if muted
        if (backgroundStartedRef.current || isMuted) return;

        const pianoLoaded = globalAudio.isSoundLoaded(AUDIO_IDS.PIANO);
        const oceanLoaded = globalAudio.isSoundLoaded(AUDIO_IDS.OCEAN);

        if (pianoLoaded && !globalAudio.isLoopActive(AUDIO_IDS.PIANO)) {
            console.log("[KitchenAudio] Starting piano background");
            globalAudio.startLoop(AUDIO_IDS.PIANO, 0.4);
        }

        if (oceanLoaded && !globalAudio.isLoopActive(AUDIO_IDS.OCEAN)) {
            console.log("[KitchenAudio] Starting ocean background");
            globalAudio.startLoop(AUDIO_IDS.OCEAN, 0.2);
        }

        // If we've started at least one background sound, consider it started
        if ((pianoLoaded && globalAudio.isLoopActive(AUDIO_IDS.PIANO)) ||
            (oceanLoaded && globalAudio.isLoopActive(AUDIO_IDS.OCEAN))) {
            backgroundStartedRef.current = true;

            // Start timers for ambient sounds
            startAmbientSoundTimer();
            startGrandmaReactionTimer();
        }
    };

    // Clean up timers
    const cleanupTimers = () => {
        if (ambientSoundTimerRef.current) {
            clearInterval(ambientSoundTimerRef.current);
            ambientSoundTimerRef.current = null;
        }

        if (grandmaReactionTimerRef.current) {
            clearInterval(grandmaReactionTimerRef.current);
            grandmaReactionTimerRef.current = null;
        }

        if (successSoundTimeoutRef.current) {
            clearTimeout(successSoundTimeoutRef.current);
            successSoundTimeoutRef.current = null;
        }

        if (initialReactionTimeoutRef.current) {
            clearTimeout(initialReactionTimeoutRef.current);
            initialReactionTimeoutRef.current = null;
        }
    };

    // Start ambient sound timer (curlew sounds)
    const startAmbientSoundTimer = () => {
        if (ambientSoundTimerRef.current) {
            clearInterval(ambientSoundTimerRef.current);
        }

        const timer = setInterval(() => {
            if (!isMuted && globalAudio.isSoundLoaded(AUDIO_IDS.CURLEW)) {
                // 30% chance to play the sound
                if (Math.random() < 0.3) {
                    globalAudio.playSound(AUDIO_IDS.CURLEW, 0.3);
                }
            }
        }, 20000); // Check every 20 seconds

        ambientSoundTimerRef.current = timer;
    };

    // Start grandma reaction timer - now with a faster interval
    const startGrandmaReactionTimer = () => {
        if (grandmaReactionTimerRef.current) {
            clearInterval(grandmaReactionTimerRef.current);
        }

        // Play the first reaction sound immediately
        if (!initialReactionPlayedRef.current && !isMuted && !successSoundPlayingRef.current) {
            setTimeout(() => {
                if (playGrandmaReaction()) {
                    initialReactionPlayedRef.current = true;
                }
            }, 1000);
        }

        const timer = setInterval(() => {
            // Skip if muted or if a success sound is currently playing
            if (isMuted || successSoundPlayingRef.current) return;

            // 50% chance to play a reaction sound
            if (Math.random() < 0.5) {
                playGrandmaReaction();
            } else {
                console.log("[KitchenAudio] Random chance didn't trigger sound this time");
            }
        }, 5000); // Check every 5 seconds

        grandmaReactionTimerRef.current = timer;
    };

    // Effect for handling mute state changes
    useEffect(() => {
        // Only act on state change, not initial render
        if (prevIsMutedRef.current !== isMuted && prevIsMutedRef.current !== undefined) {
            console.log(`[KitchenAudio] Mute state changed: ${isMuted}`);

            // If unmuting, try to start background
            if (!isMuted) {
                startBackgroundIfReady();
            } else {
                // If muting, stop all loops
                globalAudio.stopLoop(AUDIO_IDS.PIANO);
                globalAudio.stopLoop(AUDIO_IDS.OCEAN);

                // Clear reference so we can restart later
                backgroundStartedRef.current = false;
            }
        }

        // Update the ref for next render
        prevIsMutedRef.current = isMuted;
    }, [isMuted]);

    // Effect for handling new discovery (plays success sound)
    useEffect(() => {
        // Only play sound when discovery state changes from false to true
        if (newDiscovery && !prevNewDiscoveryRef.current && !isMuted) {
            const craftSounds = [
                AUDIO_IDS.GRANDMA_SUCCESS_1,
                AUDIO_IDS.GRANDMA_SUCCESS_2,
                AUDIO_IDS.GRANDMA_SUCCESS_3,
                AUDIO_IDS.GRANDMA_SUCCESS_4,
                AUDIO_IDS.GRANDMA_SUCCESS_5
            ];

            const loadedCraftSounds = craftSounds.filter(id =>
                globalAudio.isSoundLoaded(id)
            );

            if (loadedCraftSounds.length > 0) {
                const randomIndex = Math.floor(Math.random() * loadedCraftSounds.length);
                const soundId = loadedCraftSounds[randomIndex];

                // Mark that a success sound is playing to prevent reaction sounds
                successSoundPlayingRef.current = true;

                // Play the success sound
                globalAudio.playSound(soundId, 1.0);
                console.log(`[KitchenAudio] Playing success sound: ${soundId}`);

                // Clear any existing timeout
                if (successSoundTimeoutRef.current) {
                    clearTimeout(successSoundTimeoutRef.current);
                }

                // Set timeout to allow reactions again after 5 seconds
                successSoundTimeoutRef.current = setTimeout(() => {
                    successSoundPlayingRef.current = false;
                    successSoundTimeoutRef.current = null;
                    console.log("[KitchenAudio] Success sound timeout complete, reactions enabled");
                }, 5000);
            }
        }

        // Update the ref for next render
        prevNewDiscoveryRef.current = newDiscovery;
    }, [newDiscovery, isMuted]);

    // Effect for handling recipe book sound
    useEffect(() => {
        // Only play sound when showCraftPanel changes to a different value
        if (showCraftPanel !== undefined &&
            showCraftPanel !== prevShowCraftPanelRef.current &&
            !isMuted &&
            globalAudio.isSoundLoaded(AUDIO_IDS.UI_PAGE_TURN)) {

            globalAudio.playSound(AUDIO_IDS.UI_PAGE_TURN, 0.7);
        }

        // Update the ref for next render
        prevShowCraftPanelRef.current = showCraftPanel;
    }, [showCraftPanel, isMuted]);

    // Effect for handling stirring sound
    useEffect(() => {
        // Play sound when user starts stirring
        if (isStirring && !isMuted && globalAudio.isSoundLoaded(AUDIO_IDS.UI_CLICK)) {
            // Play UI click sound as a stirring sound
            globalAudio.playSound(AUDIO_IDS.UI_CLICK, 0.3);
        }
    }, [isStirring, isMuted]);

    // Effect for handling TV state (adjust background volume)
    useEffect(() => {
        if (tvOn !== prevTvOnRef.current) {
            if (tvOn && globalAudio.isLoopActive(AUDIO_IDS.PIANO)) {
                // Fade out background music when TV is on
                globalAudio.setLoopVolume(AUDIO_IDS.PIANO, 0.1);
            } else if (!tvOn && globalAudio.isLoopActive(AUDIO_IDS.PIANO)) {
                // Restore normal volume
                globalAudio.setLoopVolume(AUDIO_IDS.PIANO, 0.4);
            }
        }

        // Update the ref for next render
        prevTvOnRef.current = tvOn;
    }, [tvOn]);

    // Cleanup function when component unmounts
    useEffect(() => {
        return () => {
            console.log("[KitchenAudio] Unmounting, cleaning up audio resources");

            // Don't stop background sounds on unmount, as they should persist
            // between scene changes. If you want to stop them, uncomment:
            // globalAudio.stopLoop(AUDIO_IDS.PIANO);
            // globalAudio.stopLoop(AUDIO_IDS.OCEAN);

            // Clear timers
            cleanupTimers();
        };
    }, []);

    // This component doesn't render anything visible
    return null;
};

export default KitchenAudio;