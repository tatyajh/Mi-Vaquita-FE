import React from 'react';
import { Box } from '@mui/material';

/**
 * Reusable scalloped/wavy SVG divider, inspired by cosechasexpress.com's
 * organic section breaks. Renders a row of half-circle "scallops" in a
 * solid color, meant to sit flush between two sections.
 *
 * Props:
 * - color: fill color for the scallops (defaults to theme secondary)
 * - flip: mirrors the divider vertically (scallops pointing up instead of down)
 * - height: SVG height in px (default 32)
 */
const WaveDivider = ({ color = '#7b2ff7', flip = false, height = 32, sx = {} }) => {
  // 10 repeating scallops across a 0-200 viewBox, tiled via preserveAspectRatio="none"
  const scallopPath =
    'M0,0 C 8.33,20 16.67,20 25,0 C 33.33,20 41.67,20 50,0 ' +
    'C 58.33,20 66.67,20 75,0 C 83.33,20 91.67,20 100,0 ' +
    'C 108.33,20 116.67,20 125,0 C 133.33,20 141.67,20 150,0 ' +
    'C 158.33,20 166.67,20 175,0 C 183.33,20 191.67,20 200,0 L200,0 L0,0 Z';

  return (
    <Box
      aria-hidden="true"
      sx={{
        width: '100%',
        lineHeight: 0,
        transform: flip ? 'scaleY(-1)' : 'none',
        ...sx,
      }}
    >
      <svg
        viewBox="0 0 200 20"
        preserveAspectRatio="none"
        width="100%"
        height={height}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={scallopPath} fill={color} />
      </svg>
    </Box>
  );
};

export default WaveDivider;
