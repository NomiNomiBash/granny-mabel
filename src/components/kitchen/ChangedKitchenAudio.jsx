import { useEffect, useRef, useState } from 'react';
import globalAudio from '../../utils/GlobalAudio';

// ChangedKitchenAudio component - redesigned to work with global audio system and synchronized timing
// Updated version for ChangedKitchen that plays failure sounds instead of success sounds
const ChangedKitchenAudio = ({
                                 isStirring = false,
                                 potContent = null,
                                 newDiscovery = false,
                                 showCraftPanel = null,
                                 tvOn = false,
                                 isMuted = false,
                                 onAudioDurationChange = null // Callback for reporting actual audio durations
                             }) => {
    // Keep track of previous state to detect changes
    const prevShowCraftPanelRef = useRef(showCraftPanel);
    const prevNewDiscoveryRef = useRef(newDiscovery);
    const prevTvOnRef = useRef(tvOn);
    const prevIsMutedRef = useRef(isMuted);
    const prevIsStirringRef = useRef(isStirring);

    // Track actual audio durations with a single synchronized value
    const [actualAudioDurations, setActualAudioDurations] = useState({
        stirring: 2000, // Default fixed value since we don't have stirring sound
        discovery: 2000 // Default value
    });

    // Refs for timers
    const ambientSoundTimerRef = useRef(null);
    const grandmaReactionTimerRef = useRef(null);

    // These refs track if we've started our setup
    const setupDoneRef = useRef(false);
    const backgroundStartedRef = useRef(false);

    // Track if a fail sound is currently playing
    const failSoundPlayingRef = useRef(false);
    const failSoundTimeoutRef = useRef(null);

    // Track if reaction has played initially
    const initialReactionPlayedRef = useRef(false);
    const initialReactionTimeoutRef = useRef(null);

    // Audio element references for duration tracking
    const failSoundRef = useRef(null);

    // Ref to track the last measured durations to avoid redundant updates
    const lastMeasuredDurationsRef = useRef({
        stirring: 2000, // Fixed value since we don't have stirring sound
        discovery: 0
    });

    // Audio file IDs
    const AUDIO_IDS = {
        PIANO: 'piano',
        OCEAN: 'ocean',
        CURLEW: 'curlew',
        UI_CLICK: 'ui_click',
        UI_PAGE_TURN: 'ui_page_turn',
        TECHNO: 'techno',

        // Grandma sounds
        GRANDMA_HMM: 'grandma_hmm',
        GRANDMA_HAHA: 'grandma_haha',
        GRANDMA_MMM: 'grandma_mmm',
        GRANDMA_MMHMM: 'grandma_mmhmm',

        // Craft fail sounds (for ChangedKitchen)
        GRANDMA_FAIL_1: 'grandma_fail_1',
        GRANDMA_FAIL_2: 'grandma_fail_2',
        GRANDMA_FAIL_3: 'grandma_fail_3',
        GRANDMA_FAIL_4: 'grandma_fail_4',
        GRANDMA_FAIL_5: 'grandma_fail_5',
    };

    // Helper to play a grandma reaction sound
    const playGrandmaReaction = () => {
        if (isMuted || failSoundPlayingRef.current) return false;

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
            console.log(`[ChangedKitchenAudio] Playing grandma reaction sound: ${soundId}`);
            // Increase volume to make sure we hear it
            globalAudio.playSound(soundId, 1.0);
            return true;
        }

        return false;
    };

    // Function to synchronize audio durations
    const synchronizeAudioDurations = () => {
        // For discovery sound only, since we don't have stirring sound
        const discoveryDuration = lastMeasuredDurationsRef.current.discovery;

        // Use discovery duration if available, otherwise use fixed value for stirring
        const maxDuration = discoveryDuration > 0 ? discoveryDuration : 2000;

        console.log(`[ChangedKitchenAudio] Synchronizing audio durations to: ${maxDuration}ms`);

        // Update state with synchronized durations
        setTimeout(() => {
            setActualAudioDurations({
                stirring: maxDuration, // Use same duration for all animations
                discovery: maxDuration
            });
        }, 0);
    };

    // Function to measure audio duration and update state
    const measureAudioDuration = (audioElement, soundType) => {
        if (!audioElement) return;

        // Only update durations if we have an actual audio element to measure
        const handleLoadedMetadata = () => {
            const duration = audioElement.duration * 1000; // Convert to milliseconds

            // Ensure we use at least the minimum duration of 2000ms
            let newDuration = Math.max(duration, 2000);

            // Store the measured duration to avoid redundant updates
            if (soundType === 'discovery') {
                console.log(`[ChangedKitchenAudio] Measured discovery sound duration: ${duration}ms`);
                lastMeasuredDurationsRef.current.discovery = newDuration;

                // Synchronize durations after measurement
                synchronizeAudioDurations();
            }
        };

        // Add event listener to measure duration once metadata is loaded
        audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);

        // If the metadata is already loaded, call the handler immediately
        if (audioElement.readyState >= 1) {
            handleLoadedMetadata();
        }

        // Return cleanup function
        return () => {
            audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    };

    // Initial setup - runs only once
    useEffect(() => {
        if (setupDoneRef.current) return;

        console.log("[ChangedKitchenAudio] Initial setup for ChangedKitchen");
        setupDoneRef.current = true;

        // Set the scene to kitchen in the global audio system
        globalAudio.setScene('kitchen');

        // Listen for sounds being loaded
        const handleSoundLoaded = (event) => {
            console.log(`[ChangedKitchenAudio] Sound loaded: ${event.id}`);

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
                        console.log("[ChangedKitchenAudio] Playing initial grandma reaction");
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
            console.log("[ChangedKitchenAudio] Starting piano background");
            globalAudio.startLoop(AUDIO_IDS.PIANO, 0.4);
        }

        if (oceanLoaded && !globalAudio.isLoopActive(AUDIO_IDS.OCEAN)) {
            console.log("[ChangedKitchenAudio] Starting ocean background");
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

        if (failSoundTimeoutRef.current) {
            clearTimeout(failSoundTimeoutRef.current);
            failSoundTimeoutRef.current = null;
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

    // Start grandma reaction timer
    const startGrandmaReactionTimer = () => {
        if (grandmaReactionTimerRef.current) {
            clearInterval(grandmaReactionTimerRef.current);
        }

        // Play the first reaction sound immediately
        if (!initialReactionPlayedRef.current && !isMuted && !failSoundPlayingRef.current) {
            setTimeout(() => {
                if (playGrandmaReaction()) {
                    initialReactionPlayedRef.current = true;
                }
            }, 1000);
        }

        const timer = setInterval(() => {
            // Skip if muted or if a fail sound is currently playing
            if (isMuted || failSoundPlayingRef.current) return;

            // 50% chance to play a reaction sound
            if (Math.random() < 0.5) {
                playGrandmaReaction();
            } else {
                console.log("[ChangedKitchenAudio] Random chance didn't trigger sound this time");
            }
        }, 5000); // Check every 5 seconds

        grandmaReactionTimerRef.current = timer;
    };

    // Effect for handling mute state changes
    useEffect(() => {
        // Only act on state change, not initial render
        if (prevIsMutedRef.current !== isMuted && prevIsMutedRef.current !== undefined) {
            console.log(`[ChangedKitchenAudio] Mute state changed: ${isMuted}`);

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

    // Effect for handling stirring state
    useEffect(() => {
        // Only trigger when stirring state changes from false to true
        if (isStirring && !prevIsStirringRef.current && !isMuted) {
            // We don't have a stirring sound, so we'll just play a UI click sound if available
            if (globalAudio.isSoundLoaded(AUDIO_IDS.UI_CLICK)) {
                console.log('[ChangedKitchenAudio] Playing UI click for stirring action');
                globalAudio.playSound(AUDIO_IDS.UI_CLICK, 0.5);
            }

            // Always use the synchronized duration
            synchronizeAudioDurations();
        }

        // Update the ref for next render
        prevIsStirringRef.current = isStirring;
    }, [isStirring, isMuted]);

    // Effect for handling new discovery (plays fail sound instead of success)
    useEffect(() => {
        // Only play sound when discovery state changes from false to true
        if (newDiscovery && !prevNewDiscoveryRef.current && !isMuted) {
            // Use fail sounds instead of success sounds for ChangedKitchen
            const craftSounds = [
                AUDIO_IDS.GRANDMA_FAIL_1,
                AUDIO_IDS.GRANDMA_FAIL_2,
                AUDIO_IDS.GRANDMA_FAIL_3,
                AUDIO_IDS.GRANDMA_FAIL_4,
                AUDIO_IDS.GRANDMA_FAIL_5
            ];

            const loadedCraftSounds = craftSounds.filter(id =>
                globalAudio.isSoundLoaded(id)
            );

            if (loadedCraftSounds.length > 0) {
                const randomIndex = Math.floor(Math.random() * loadedCraftSounds.length);
                const soundId = loadedCraftSounds[randomIndex];

                // Mark that a fail sound is playing to prevent reaction sounds
                failSoundPlayingRef.current = true;

                // Play the fail sound and store the audio element reference
                const audioElement = globalAudio.playSound(soundId, 1.0);
                failSoundRef.current = audioElement;

                console.log(`[ChangedKitchenAudio] Playing fail sound: ${soundId}`);

                // Measure the actual duration of the sound
                if (audioElement) {
                    measureAudioDuration(audioElement, 'discovery');

                    // Create event to detect when sound finishes playing
                    audioElement.addEventListener('ended', () => {
                        console.log('[ChangedKitchenAudio] Fail sound finished playing naturally');

                        // Reset state now that sound has finished
                        failSoundPlayingRef.current = false;
                        failSoundRef.current = null;
                    }, { once: true });
                }

                // Clear any existing timeout
                if (failSoundTimeoutRef.current) {
                    clearTimeout(failSoundTimeoutRef.current);
                }

                // Set a fallback timeout to prevent indefinite blocking of reaction sounds
                // Use synchronized duration with buffer
                const fallbackTimeout = Math.max(lastMeasuredDurationsRef.current.discovery || 2000, 5000);
                failSoundTimeoutRef.current = setTimeout(() => {
                    if (failSoundPlayingRef.current) {
                        failSoundPlayingRef.current = false;
                        console.log("[ChangedKitchenAudio] Fail sound fallback timeout completed");
                    }
                    failSoundTimeoutRef.current = null;
                }, fallbackTimeout);
            } else {
                // If no fail sounds are loaded yet, log the issue
                console.log("[ChangedKitchenAudio] No fail sounds loaded, checking sound status:");
                console.log(`grandma_fail_1 loaded: ${globalAudio.isSoundLoaded('grandma_fail_1')}`);
                console.log(`grandma_fail_2 loaded: ${globalAudio.isSoundLoaded('grandma_fail_2')}`);
                console.log(`grandma_fail_3 loaded: ${globalAudio.isSoundLoaded('grandma_fail_3')}`);
                console.log(`grandma_fail_4 loaded: ${globalAudio.isSoundLoaded('grandma_fail_4')}`);
                console.log(`grandma_fail_5 loaded: ${globalAudio.isSoundLoaded('grandma_fail_5')}`);
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

    // Effect for handling TV state
    useEffect(() => {
        if (tvOn !== prevTvOnRef.current) {
            if (tvOn) {
                // TV has been turned on - will be handled in the TVNews component
                // Fade out piano music in anticipation
                if (globalAudio.isLoopActive(AUDIO_IDS.PIANO)) {
                    globalAudio.setLoopVolume(AUDIO_IDS.PIANO, 0.1);
                }
            } else if (!tvOn && globalAudio.isLoopActive(AUDIO_IDS.PIANO)) {
                // TV has been turned off - restore normal volume for kitchen music
                globalAudio.setLoopVolume(AUDIO_IDS.PIANO, 0.4);
                // Make sure we're in kitchen scene
                globalAudio.setScene('kitchen');
            }
        }

        // Update the ref for next render
        prevTvOnRef.current = tvOn;
    }, [tvOn]);

    // Update audio durations and notify parent when they change
    useEffect(() => {
        if (onAudioDurationChange) {
            // When the actual measured audio durations change, notify the parent
            const discoveryDuration = lastMeasuredDurationsRef.current.discovery;
            const maxDuration = discoveryDuration > 0 ? discoveryDuration : 2000;

            // Report the synchronized durations to parent
            onAudioDurationChange({
                stirring: maxDuration,
                discovery: maxDuration
            });
        }
    }, [lastMeasuredDurationsRef.current.discovery, onAudioDurationChange]);

    // Cleanup function when component unmounts
    useEffect(() => {
        return () => {
            console.log("[ChangedKitchenAudio] Unmounting, cleaning up audio resources");

            if (failSoundRef.current) {
                failSoundRef.current.pause();
                failSoundRef.current = null;
            }

            // Don't stop background sounds on unmount as they should persist
            // between scene changes.

            // Clear timers
            cleanupTimers();
        };
    }, []);

    // This component doesn't render anything visible
    return null;
};

export default ChangedKitchenAudio;