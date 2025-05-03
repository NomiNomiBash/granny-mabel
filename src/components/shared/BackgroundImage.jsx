import React from 'react';
import styled from 'styled-components';

// Create a reusable styled component for backgrounds
const BackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: ${props => props.$image ? `url(${props.$image})` : 'none'};
  background-color: ${props => props.$color || 'transparent'};
  background-size: ${props => props.$size || 'cover'};
  background-position: ${props => props.$position || 'center'};
  background-repeat: ${props => props.$repeat || 'no-repeat'};
  z-index: ${props => props.$zIndex || 0};
  opacity: ${props => props.$opacity || 1};
`;

/**
 * A reusable background component that can be used throughout the application
 *
 * @param {string} image - URL or imported image path
 * @param {string} color - Background color (used if no image or as fallback)
 * @param {string} size - Background size (cover, contain, etc.)
 * @param {string} position - Background position (center, top, etc.)
 * @param {string} repeat - Background repeat (no-repeat, repeat, etc.)
 * @param {number} zIndex - z-index value
 * @param {number} opacity - Opacity value between 0 and 1
 * @param {object} style - Additional inline styles
 * @param {object} props - Any additional props to pass to the container
 */
export const BackgroundImage = ({
                                    image,
                                    color,
                                    size,
                                    position,
                                    repeat,
                                    zIndex,
                                    opacity,
                                    style,
                                    ...props
                                }) => {
    return (
        <BackgroundContainer
            $image={image}
            $color={color}
            $size={size}
            $position={position}
            $repeat={repeat}
            $zIndex={zIndex}
            $opacity={opacity}
            style={style}
            {...props}
        />
    );
};