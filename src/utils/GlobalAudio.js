// src/utils/GlobalAudio.js

// Define audio file mapping
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
    // UI sounds
    UI_CLICK: {
        id: 'ui_click',
        url: '/src/assets/ui_click.wav',
        type: 'ui',
        volume: 0.6
    },
    UI_PAGE_TURN: {
        id: 'ui_page_turn',
        url: '/src/assets/ui_page_turn.wav',
        type: 'ui',
        volume: 0.7
    },
    // New techno music for TV scene
    TECHNO_MUSIC: {
        id: 'techno',
        url: '/src/assets/techbrotechno.wav', // Update this with your actual techno music file path
        type: 'loop',
        volume: 0.5
    },
    // Add these to the AUDIO_FILES constant in GlobalAudio.js
    GRANDMA_FAIL_1: {
        id: 'grandma_fail_1',
        url: '/src/assets/after/grandma_craft_fail_1.mp3',
        type: 'ui',
        volume: 1.0
    },
    GRANDMA_FAIL_2: {
        id: 'grandma_fail_2',
        url: '/src/assets/after/grandma_craft_fail_2.mp3',
        type: 'ui',
        volume: 1.0
    },
    GRANDMA_FAIL_3: {
        id: 'grandma_fail_3',
        url: '/src/assets/after/grandma_craft_fail_3.mp3',
        type: 'ui',
        volume: 1.0
    },
    GRANDMA_FAIL_4: {
        id: 'grandma_fail_4',
        url: '/src/assets/after/grandma_craft_fail_4.mp3',
        type: 'ui',
        volume: 1.0
    },
    GRANDMA_FAIL_5: {
        id: 'grandma_fail_5',
        url: '/src/assets/after/grandma_craft_fail_5.mp3',
        type: 'ui',
        volume: 1.0
    },
};

/**
 * GlobalAudio - A singleton audio manager that exists outside React's lifecycle
 * This prevents audio from restarting on component re-renders
 */
class GlobalAudio {
    constructor() {
        // Flag to prevent multiple initializations
        this.initialized = false;

        // Storage for audio elements
        this.sounds = {};
        this.loops = {};

        // Track which loops are actively playing
        this.activeLoops = {};

        // Volume settings
        this.masterVolume = 0.7;

        // Event listeners
        this.listeners = {
            soundLoaded: []
        };

        // Keep track of loaded sound IDs
        this.loadedSoundIds = [];

        // Current scene
        this.currentScene = 'kitchen';
    }

    // Initialize the audio system - call this once at app startup
    init() {
        if (this.initialized) return;

        console.log("[GlobalAudio] Initializing audio system");
        this.initialized = true;

        // Add event listeners for user interaction to unlock audio
        this.setupUserInteractionEvents();

        // Preload essential sounds
        this.preloadEssentialSounds();
    }

    // Setup events to detect user interaction for autoplay policy
    setupUserInteractionEvents() {
        const handleInteraction = () => {
            this.unlockAudio();

            // Remove listeners after first interaction
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
            window.removeEventListener('keydown', handleInteraction);
        };

        window.addEventListener('click', handleInteraction);
        window.addEventListener('touchstart', handleInteraction);
        window.addEventListener('keydown', handleInteraction);
    }

    // Unlock audio playback on iOS and other restrictive browsers
    unlockAudio() {
        // Create a very short audio buffer (0.1 seconds of silence)
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();
            const buffer = audioContext.createBuffer(1, 1, 22050);
            const source = audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContext.destination);
            source.start(0);

            // Also try a simpler method as fallback
            const audio = new Audio();
            audio.play().then(() => {
                audio.pause();
                console.log("[GlobalAudio] Audio playback unlocked");
            }).catch(err => {
                console.log("[GlobalAudio] Could not unlock with HTML5 Audio, already tried AudioContext");
            });

            console.log("[GlobalAudio] Audio Context unlocking attempted");
        } catch (err) {
            console.warn("[GlobalAudio] Could not unlock audio:", err);
        }
    }

    // Preload essential sounds like background music
    preloadEssentialSounds() {
        // Load background music and ambient sounds first
        const essentialSounds = [
            AUDIO_FILES.PIANO_MUSIC,
            AUDIO_FILES.OCEAN_WAVES,
            AUDIO_FILES.UI_CLICK,
            AUDIO_FILES.TECHNO_MUSIC // Preload techno music
        ];

        essentialSounds.forEach(sound => {
            this.loadSound(sound.id, sound.url);
        });
    }

    // Set current scene and adjust audio accordingly
    setScene(sceneName) {
        console.log(`[GlobalAudio] Switching to scene: ${sceneName}`);
        this.currentScene = sceneName;

        // Change background music based on scene
        if (sceneName === 'tvnews') {
            // Pause kitchen music
            if (this.isLoopActive('piano')) {
                this.stopLoop('piano');
            }
            if (this.isLoopActive('ocean')) {
                this.stopLoop('ocean');
            }

            // Start techno music
            this.startLoop('techno', 0.5);
        } else if (sceneName === 'kitchen') {
            // Pause techno music if it's playing
            if (this.isLoopActive('techno')) {
                this.stopLoop('techno');
            }

            // Start kitchen music if not already playing
            if (!this.isLoopActive('piano')) {
                this.startLoop('piano', 0.4);
            }
            if (!this.isLoopActive('ocean')) {
                this.startLoop('ocean', 0.2);
            }
        }
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

    // Load a sound
    loadSound(id, url) {
        if (!this.initialized) this.init();

        // If sound is already loaded, do nothing
        if (this.isSoundLoaded(id)) {
            return Promise.resolve(true);
        }

        console.log(`[GlobalAudio] Loading sound ${id} from ${url}`);

        return new Promise((resolve, reject) => {
            try {
                // Resolve path
                const resolvedUrl = this.resolvePath(url);

                // Create audio element
                const audio = new Audio();

                // Audio loaded successfully
                audio.addEventListener('canplaythrough', () => {
                    this.sounds[id] = audio;

                    // Add to loaded sound IDs if not already there
                    if (!this.loadedSoundIds.includes(id)) {
                        this.loadedSoundIds.push(id);

                        // Notify listeners
                        this.notifyListeners('soundLoaded', { id });
                    }

                    console.log(`[GlobalAudio] Sound ${id} loaded successfully`);
                    resolve(true);
                }, { once: true });

                // Error loading audio
                audio.addEventListener('error', (e) => {
                    console.error(`[GlobalAudio] Error loading sound ${id} from ${url}:`, e.target.error);
                    resolve(false);
                }, { once: true });

                // Set source and load
                audio.src = resolvedUrl;
                audio.load();
            } catch (error) {
                console.error(`[GlobalAudio] Error setting up audio for ${id}:`, error);
                resolve(false);
            }
        });
    }

    // Play a sound once
    playSound(id, volume = 1) {
        if (!this.initialized) this.init();

        // If sound is not loaded, try to load it first
        if (!this.sounds[id]) {
            // Look up the sound in AUDIO_FILES
            const soundConfig = Object.values(AUDIO_FILES).find(s => s.id === id);
            if (soundConfig) {
                this.loadSound(id, soundConfig.url);
            }
            console.warn(`[GlobalAudio] Sound ${id} not loaded, cannot play`);
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
                    console.warn(`[GlobalAudio] Error playing sound ${id}:`, error);

                    // If autoplay was prevented, try to unlock audio for future plays
                    if (error.name === 'NotAllowedError') {
                        this.unlockAudio();
                    }
                });
            }

            return audioClone;
        } catch (error) {
            console.error(`[GlobalAudio] Error playing sound ${id}:`, error);
            return null;
        }
    }

    // Start a looping sound - key method that ensures no duplicate loops
    startLoop(id, volume = 1) {
        if (!this.initialized) this.init();

        // IMPORTANT: Check if the loop is already active
        // This is the key to preventing restart on re-renders
        if (this.activeLoops[id]) {
            console.log(`[GlobalAudio] Loop ${id} is already playing, not restarting`);
            return;
        }

        // If sound is not loaded, try to load it
        if (!this.sounds[id]) {
            const soundConfig = Object.values(AUDIO_FILES).find(s => s.id === id);
            if (soundConfig) {
                this.loadSound(id, soundConfig.url).then(success => {
                    if (success) this.startLoop(id, volume);
                });
            }
            return;
        }

        console.log(`[GlobalAudio] Starting loop ${id}`);

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
                    console.warn(`[GlobalAudio] Error starting loop ${id}:`, error);

                    // Remove from active loops if it failed
                    delete this.activeLoops[id];

                    // If autoplay was prevented, try to unlock audio
                    if (error.name === 'NotAllowedError') {
                        this.unlockAudio();
                    }
                });
            }

            // Store the audio element and mark as active
            this.loops[id] = audioClone;
            this.activeLoops[id] = true;
        } catch (error) {
            console.error(`[GlobalAudio] Error starting loop ${id}:`, error);
            delete this.activeLoops[id];
        }
    }

    // Stop a looping sound
    stopLoop(id) {
        if (!this.loops[id]) return;

        try {
            console.log(`[GlobalAudio] Stopping loop ${id}`);
            this.loops[id].pause();
            this.loops[id].currentTime = 0;
            delete this.loops[id];
            delete this.activeLoops[id];
        } catch (error) {
            console.error(`[GlobalAudio] Error stopping loop ${id}:`, error);
            // Clean up even if there was an error
            delete this.loops[id];
            delete this.activeLoops[id];
        }
    }

    // Set volume for a specific loop
    setLoopVolume(id, volume) {
        if (!this.loops[id]) {
            console.warn(`[GlobalAudio] Loop ${id} not found, cannot set volume`);
            return;
        }

        try {
            this.loops[id].volume = volume * this.masterVolume;
        } catch (error) {
            console.error(`[GlobalAudio] Error setting volume for loop ${id}:`, error);
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
                console.warn(`[GlobalAudio] Error updating volume for loop ${id}:`, error);
            }
        });
    }

    // Check if a loop is currently active
    isLoopActive(id) {
        return !!this.activeLoops[id];
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
            console.warn('[GlobalAudio] No available sounds to play randomly');
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
        return [...this.loadedSoundIds];
    }

    // Event listener functionality
    addEventListener(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);

        // If it's a 'soundLoaded' event, also call the callback for existing sounds
        if (event === 'soundLoaded') {
            this.loadedSoundIds.forEach(id => {
                callback({ id });
            });
        }
    }

    removeEventListener(event, callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }

    notifyListeners(event, data) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`[GlobalAudio] Error in ${event} listener:`, error);
            }
        });
    }

    /**
     * Helper method to play UI click sound
     * @param {number} volume Volume for the click (default: 0.6)
     */
    playUIClick(volume = 0.6) {
        if (this.isSoundLoaded('ui_click')) {
            this.playSound('ui_click', volume);
            return true;
        }
        return false;
    }

    /**
     * Helper method to play page turn sound
     * @param {number} volume Volume for the page turn (default: 0.7)
     */
    playPageTurn(volume = 0.7) {
        if (this.isSoundLoaded('ui_page_turn')) {
            this.playSound('ui_page_turn', volume);
            return true;
        }
        return false;
    }

    /**
     * Play appropriate UI sound for different button types
     * @param {string} type - The type of button ('book', 'toggle', 'button')
     * @param {number} volume - Volume for the sound effect
     */
    playUISound(type, volume) {
        if (this.masterVolume === 0) return false;

        switch (type.toLowerCase()) {
            case 'book':
            case 'page':
            case 'recipe':
                return this.playPageTurn(volume || 0.7);

            case 'toggle':
            case 'button':
            case 'click':
            default:
                return this.playUIClick(volume || 0.6);
        }
    }
}

// Create singleton instance
const globalAudio = new GlobalAudio();

// Initialize at script load time
globalAudio.init();

// Export singleton
export default globalAudio;