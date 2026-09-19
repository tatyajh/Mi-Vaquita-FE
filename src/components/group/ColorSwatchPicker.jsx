import React from 'react';
import { Box, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

// Paleta curada de marca (magenta/ámbar/verdes Cosechas + algunos
// acentos extra), en vez del selector RGBA crudo de react-color —
// se ve como parte del producto, no como una herramienta de
// desarrollador, y es mucho más cómodo de usar en el celular.
export const GROUP_COLORS = [
  '#ED1651', // magenta
  '#FAA918', // ámbar
  '#23B24A', // verde
  '#9FCB3B', // lima
  '#6D236A', // ciruela
  '#2E7DD1', // azul
  '#FF6F91', // coral
  '#7C4DFF', // violeta
];

const ColorSwatchPicker = ({ value, onChange, label = 'Color del grupo' }) => {
  const normalized = (value || '').toUpperCase();

  return (
    <Box sx={{ mt: 2 }}>
      {label && (
        <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 700, color: 'text.secondary' }}>
          {label}
        </Typography>
      )}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
        {GROUP_COLORS.map((color) => {
          const isSelected = normalized === color;
          return (
            <Box
              key={color}
              component="button"
              type="button"
              onClick={() => onChange(color)}
              aria-label={color}
              aria-pressed={isSelected}
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: color,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isSelected ? `0 0 0 3px #fff, 0 0 0 5px ${color}` : '0 2px 6px rgba(0,0,0,0.15)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                '&:hover': { transform: 'scale(1.1)' },
              }}
            >
              {isSelected && <CheckIcon sx={{ color: '#fff', fontSize: 20 }} />}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default ColorSwatchPicker;
