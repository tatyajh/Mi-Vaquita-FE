// Utilidades de color compartidas para tarjetas con acento configurable
// (grupos, amigos, gastos).

// Elige un color determinístico de una paleta de acentos a partir de un
// id/string, así el mismo elemento siempre recibe el mismo acento.
export const flavorForId = (flavors, id) => {
  const keys = Object.keys(flavors);
  const str = String(id ?? '');
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return flavors[keys[hash % keys.length]];
};

// Luminancia relativa aproximada (0 = negro, 1 = blanco) para decidir si
// un color de fondo es "casi blanco" y por lo tanto no sirve como acento
// (el texto/botón blanco que suele ir encima quedaría invisible).
const relativeLuminance = (hex) => {
  const clean = (hex || '').replace('#', '');
  if (clean.length !== 6) return 1;
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const isNearWhite = (hex) => relativeLuminance(hex) > 0.9;

// Color de acento a usar: el del grupo/elemento si es válido y no es casi
// blanco (donde el texto/ícono blanco encima se volvería ilegible), o si
// no, un color determinístico de la paleta de acentos de marca.
export const resolveAccentColor = (flavors, id, explicitColor) => {
  if (explicitColor && !isNearWhite(explicitColor)) {
    return explicitColor;
  }
  return flavorForId(flavors, id);
};
