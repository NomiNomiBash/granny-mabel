import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const AudioTest = () => {
    const [message, setMessage] = useState('');
    const audioRef = useRef(null);

    // Load the external audio file when component mounts
    useEffect(() => {
        loadExternalAudio();
    }, []);

    // Set audio to use an external file
    const loadExternalAudio = () => {
        if (!audioRef.current) return;

        try {
            // Set the audio source to the external file
            audioRef.current.src = '/src/assets/pianomusic.wav';

            // Add event listeners to track loading status
            audioRef.current.onloadeddata = () => {
                setMessage('External audio file loaded successfully');
            };

            audioRef.current.onerror = (e) => {
                setMessage(`Error loading audio file: ${audioRef.current.error?.message || 'Unknown error'}`);
                console.error('Audio error:', audioRef.current.error);
            };

        } catch (error) {
            setMessage(`Error setting external audio: ${error.message}`);
        }
    };

    // Test playing an audio element
    const playTestAudio = () => {
        try {
            if (!audioRef.current) {
                setMessage('Audio element not found');
                return;
            }

            // Try to play the audio
            const playPromise = audioRef.current.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setMessage('Test audio played successfully!');
                    })
                    .catch(error => {
                        setMessage(`Error playing test audio: ${error.message}`);

                        // If user interaction is required, show that in the message
                        if (error.name === 'NotAllowedError') {
                            setMessage('Audio playback requires user interaction first. Try clicking again.');
                        }
                    });
            }
        } catch (error) {
            setMessage(`Error playing test audio: ${error.message}`);
        }
    };

    return (
        <TestContainer>
            <h2>Audio Test Panel</h2>

            <TestButton onClick={playTestAudio}>
                Play Test Audio
            </TestButton>

            <TestButton onClick={loadExternalAudio}>
                Load Piano Music
            </TestButton>

            <audio
                ref={audioRef}
                controls
                style={{ width: '100%', marginTop: '10px' }}
            />

            <MessageDisplay>
                {message}
            </MessageDisplay>
        </TestContainer>
    );
};

const TestContainer = styled.div`
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 15px;
    border-radius: 8px;
    z-index: 1000;
    width: 300px;
`;

const TestButton = styled.button`
    display: block;
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 15px;
    margin: 10px 0;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    width: 100%;

    &:hover {
        background-color: #45a049;
    }
`;

const MessageDisplay = styled.div`
    margin-top: 15px;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    min-height: 40px;
`;

export default AudioTest;