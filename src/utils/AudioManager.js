// src/utils/AudioManager.js
import { useEffect, useState, useCallback } from 'react';

// Audio manager using HTML5 Audio elements directly
class AudioManager {
    constructor() {
        this.initialized = false;
        this.sounds = {}; // Map of sound ID to Audio element
        this.loops = {}; // Map of loop ID to {audio, gainNode} for loops
        this.masterVolume = 0.7; // Default volume
        this.loadingPromises = {}; // Track loading promises to avoid duplicate loads
    }

    init() {
        if (this.initialized) return;

        console.log("AudioManager initialized successfully");
        this.initialized = true;

        // Add event listeners to help with autoplay policy
        this.setupUserInteractionEvents();
    }

    // Setup events to detect user interaction for autoplay policy
    setupUserInteractionEvents() {
        const handleInteraction = () => {
            // When user interacts, we can try to play a silent sound to unlock audio
            this.unlockAudio();
        };

        // Add interaction listeners
        window.addEventListener('click', handleInteraction, { once: true });
        window.addEventListener('touchstart', handleInteraction, { once: true });
        window.addEventListener('keydown', handleInteraction, { once: true });
    }

    // Unlock audio playback on iOS and other restrictive browsers
    unlockAudio() {
        // Create temporary audio element
        const audio = new Audio();
        // Set to a short, silent audio file or use an empty buffer
        audio.src = 'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjM1LjEwNAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADLgD///////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjYyAAAAAAAAAAAAAAAAJAAAAAAAAAAAAy7/+YXkAAAAAAAAAAAAAAAAAAAAAP/7kGQAD/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
        audio.load();

        // Play and immediately pause
        audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
            console.log("Audio playback unlocked");
        }).catch(err => {
            console.warn("Could not unlock audio:", err);
        });
    }

    // Resolve file path consistently
    resolvePath(url) {
        // If already a full URL or data URL, return as is
        if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) {
            return url;
        }

        // For paths starting with /src/ - keep as is because these are relative to the project root
        if (url.startsWith('/src/')) {
            return url;
        }

        // For paths starting with just a slash but not /src/, remove the leading slash
        if (url.startsWith('/') && !url.startsWith('/src/')) {
            return url.substring(1);
        }

        // For paths not starting with /, assume they're relative and keep as is
        return url;
    }

    // Load a sound file
    async loadSound(id, url) {
        if (!this.initialized) this.init();

        // Return existing promise if we're already loading this sound
        if (this.loadingPromises[id]) {
            return this.loadingPromises[id];
        }

        // Return true immediately if sound is already loaded
        if (this.sounds[id] && this.sounds[id].readyState >= 2) {
            return true;
        }

        console.log(`Attempting to load sound ${id} from ${url}`);

        // Create loading promise
        this.loadingPromises[id] = new Promise((resolve, reject) => {
            try {
                // Resolve path
                const resolvedUrl = this.resolvePath(url);

                // Create audio element
                const audio = new Audio();

                // Audio loaded successfully
                audio.addEventListener('canplaythrough', () => {
                    this.sounds[id] = audio;
                    console.log(`Sound ${id} loaded successfully`);
                    delete this.loadingPromises[id];
                    resolve(true);
                }, { once: true });

                // Error loading audio
                audio.addEventListener('error', (e) => {
                    console.error(`Error loading sound ${id} from ${url}:`, e.target.error);
                    delete this.loadingPromises[id];
                    resolve(false); // Resolve with false instead of rejecting to avoid disrupting other loads
                }, { once: true });

                // Set source and load
                audio.src = resolvedUrl;
                audio.load();
            } catch (error) {
                console.error(`Error setting up audio for ${id}:`, error);
                delete this.loadingPromises[id];
                resolve(false);
            }
        });

        return this.loadingPromises[id];
    }

    // Play a sound once
    playSound(id, volume = 1) {
        if (!this.initialized) this.init();

        if (!this.sounds[id]) {
            console.warn(`Sound ${id} not loaded, cannot play`);
            return null;
        }

        try {
            // Create a clone of the audio element for playing
            // This allows playing the same sound multiple times simultaneously
            const audioClone = this.sounds[id].cloneNode();

            // Set volume
            audioClone.volume = volume * this.masterVolume;

            // Play
            const playPromise = audioClone.play();

            // Handle autoplay restrictions
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn(`Error playing sound ${id}:`, error);

                    // If autoplay was prevented, try to unlock audio for future plays
                    if (error.name === 'NotAllowedError') {
                        this.unlockAudio();
                    }
                });
            }

            return audioClone;
        } catch (error) {
            console.error(`Error playing sound ${id}:`, error);
            return null;
        }
    }

    // Start a looping sound
    startLoop(id, volume = 1) {
        if (!this.initialized) this.init();

        if (!this.sounds[id]) {
            console.warn(`Sound ${id} not loaded, cannot loop`);
            return;
        }

        // If the loop is already playing, stop it first
        if (this.loops[id]) {
            this.stopLoop(id);
        }

        try {
            // Create a clone for looping
            const audioClone = this.sounds[id].cloneNode();

            // Set properties
            audioClone.loop = true;
            audioClone.volume = volume * this.masterVolume;

            // Play
            const playPromise = audioClone.play();

            // Handle autoplay restrictions
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn(`Error starting loop ${id}:`, error);

                    // Clean up on error
                    delete this.loops[id];

                    // If autoplay was prevented, try to unlock audio
                    if (error.name === 'NotAllowedError') {
                        this.unlockAudio();
                    }
                });
            }

            // Store the audio element
            this.loops[id] = audioClone;
        } catch (error) {
            console.error(`Error starting loop ${id}:`, error);
        }
    }

    // Stop a looping sound
    stopLoop(id) {
        if (!this.loops[id]) return;

        try {
            this.loops[id].pause();
            this.loops[id].currentTime = 0;
            delete this.loops[id];
        } catch (error) {
            console.error(`Error stopping loop ${id}:`, error);
            // Clean up even if there was an error
            delete this.loops[id];
        }
    }

    // Set volume for a specific loop
    setLoopVolume(id, volume) {
        if (!this.loops[id]) {
            console.warn(`Loop ${id} not found, cannot set volume`);
            return;
        }

        try {
            this.loops[id].volume = volume * this.masterVolume;
        } catch (error) {
            console.error(`Error setting volume for loop ${id}:`, error);
        }
    }

    // Set master volume
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));

        // Update volume for all active loops
        Object.keys(this.loops).forEach(id => {
            try {
                const currentRelativeVolume = this.loops[id].volume / this.masterVolume;
                this.loops[id].volume = currentRelativeVolume * this.masterVolume;
            } catch (error) {
                console.warn(`Error updating volume for loop ${id}:`, error);
            }
        });
    }

    // Stop all sounds and loops
    stopAll() {
        // Stop all loops
        Object.keys(this.loops).forEach(id => {
            this.stopLoop(id);
        });
    }

    // Play a random sound from an array of sound IDs
    playRandomSound(soundIds, volume = 1) {
        if (!soundIds || soundIds.length === 0) return null;

        // Filter to only include sounds that are actually loaded
        const availableSounds = soundIds.filter(id => this.sounds[id]);

        if (availableSounds.length === 0) {
            console.warn('No available sounds to play randomly');
            return null;
        }

        const randomIndex = Math.floor(Math.random() * availableSounds.length);
        return this.playSound(availableSounds[randomIndex], volume);
    }

    // Check if a specific sound is loaded
    isSoundLoaded(id) {
        return !!this.sounds[id] && this.sounds[id].readyState >= 2;
    }

    // Get list of all loaded sound IDs
    getLoadedSoundIds() {
        return Object.keys(this.sounds).filter(id =>
            this.sounds[id] && this.sounds[id].readyState >= 2
        );
    }

    // Fade functions are approximated using volume changes over time
    fadeIn(id, duration = 2, targetVolume = 1) {
        if (!this.loops[id]) {
            console.warn(`Loop ${id} not found, cannot fade in`);
            return;
        }

        try {
            const audio = this.loops[id];
            const originalVolume = targetVolume * this.masterVolume;
            audio.volume = 0;

            let startTime = Date.now();
            const fadeInterval = setInterval(() => {
                const elapsed = (Date.now() - startTime) / 1000;
                const ratio = Math.min(elapsed / duration, 1);

                audio.volume = ratio * originalVolume;

                if (ratio >= 1) {
                    clearInterval(fadeInterval);
                }
            }, 50); // Update every 50ms
        } catch (error) {
            console.error(`Error fading in loop ${id}:`, error);
        }
    }

    fadeOut(id, duration = 2) {
        if (!this.loops[id]) {
            console.warn(`Loop ${id} not found, cannot fade out`);
            return;
        }

        try {
            const audio = this.loops[id];
            const originalVolume = audio.volume;

            let startTime = Date.now();
            const fadeInterval = setInterval(() => {
                const elapsed = (Date.now() - startTime) / 1000;
                const ratio = Math.min(elapsed / duration, 1);

                audio.volume = originalVolume * (1 - ratio);

                if (ratio >= 1) {
                    clearInterval(fadeInterval);
                    this.stopLoop(id);
                }
            }, 50); // Update every 50ms
        } catch (error) {
            console.error(`Error fading out loop ${id}:`, error);
        }
    }
}

// Create a singleton instance
const audioManager = new AudioManager();

// React hook for using the audio manager
export function useAudio() {
    const [isReady, setIsReady] = useState(false);
    const [loadedSounds, setLoadedSounds] = useState([]);

    // Initialize the audio manager
    useEffect(() => {
        if (!audioManager.initialized) {
            audioManager.init();
        }
        setIsReady(true);

        // Update the initial loaded sounds list
        setLoadedSounds(audioManager.getLoadedSoundIds());

        // Set up an interval to periodically update the list of loaded sounds
        const updateInterval = setInterval(() => {
            const currentLoaded = audioManager.getLoadedSoundIds();
            if (currentLoaded.length !== loadedSounds.length) {
                setLoadedSounds(currentLoaded);
            }
        }, 1000);

        // Cleanup when component unmounts
        return () => {
            clearInterval(updateInterval);
        };
    }, [loadedSounds.length]);

    // Load a sound and track its loading state
    const loadSound = useCallback(async (id, url) => {
        const success = await audioManager.loadSound(id, url);
        if (success) {
            setLoadedSounds(prev => {
                if (prev.includes(id)) return prev;
                return [...prev, id];
            });
        }
        return success;
    }, []);

    return {
        isReady,
        loadedSounds,
        loadSound,
        playSound: audioManager.playSound.bind(audioManager),
        startLoop: audioManager.startLoop.bind(audioManager),
        stopLoop: audioManager.stopLoop.bind(audioManager),
        setLoopVolume: audioManager.setLoopVolume.bind(audioManager),
        setMasterVolume: audioManager.setMasterVolume.bind(audioManager),
        stopAll: audioManager.stopAll.bind(audioManager),
        playRandomSound: audioManager.playRandomSound.bind(audioManager),
        fadeIn: audioManager.fadeIn.bind(audioManager),
        fadeOut: audioManager.fadeOut.bind(audioManager),
        isSoundLoaded: audioManager.isSoundLoaded.bind(audioManager)
    };
}

export default audioManager;