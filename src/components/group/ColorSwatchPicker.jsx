import React, { useRef } from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import PaletteIcon from '@mui/icons-material/Palette';
import LockIcon from '@mui/icons-material/Lock';

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

// El picker de color personalizado (más allá de estos 8) es una
// función Pro — se ofrece siempre visible (así se sabe que existe),
// pero solo abre el selector nativo si isPro es true; si no, pide
// actualizar el plan. La API también valida esto en groups.service.js,
// así que no basta con saltarse este chequeo desde el frontend.
const ColorSwatchPicker = ({ value, onChange, label = 'Color del grupo', isPro = false, onRequestUpgrade }) => {
  const normalized = (value || '').toUpperCase();
  const isCustomColor = Boolean(normalized) && !GROUP_COLORS.includes(normalized);
  const nativeInputRef = useRef(null);

  const handleCustomClick = () => {
    if (isPro) {
      nativeInputRef.current?.click();
    } else {
      onRequestUpgrade?.();
    }
  };

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
        <Tooltip title={isPro ? 'Elegir un color personalizado' : 'Colores personalizados: función Pro'}>
          <Box
            component="button"
            type="button"
            onClick={handleCustomClick}
            aria-label="Color personalizado"
            aria-pressed={isCustomColor}
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: isCustomColor ? normalized : 'transparent',
              background: isCustomColor ? normalized : 'conic-gradient(from 0deg, #ED1651, #FAA918, #23B24A, #2E7DD1, #7C4DFF, #ED1651)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isCustomColor ? `0 0 0 3px #fff, 0 0 0 5px ${normalized}` : '0 2px 6px rgba(0,0,0,0.15)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              '&:hover': { transform: 'scale(1.1)' },
            }}
          >
            {isCustomColor ? (
              <CheckIcon sx={{ color: '#fff', fontSize: 20 }} />
            ) : isPro ? (
              <PaletteIcon sx={{ color: '#fff', fontSize: 18 }} />
            ) : (
              <LockIcon sx={{ color: '#fff', fontSize: 16 }} />
            )}
          </Box>
        </Tooltip>
        <input
          ref={nativeInputRef}
          type="color"
          value={isCustomColor ? normalized : '#000000'}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
          tabIndex={-1}
          aria-hidden="true"
        />
      </Box>
    </Box>
  );
};

export default ColorSwatchPicker;
