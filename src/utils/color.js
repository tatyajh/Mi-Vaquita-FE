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

// Colores como el ámbar (#FAA918) o la lima (#9FCB3B) pasan el filtro
// de isNearWhite (no son "casi blancos") pero siguen siendo demasiado
// claros para que texto/íconos BLANCOS encima se lean bien — de ahí
// "Ver" o el nombre del grupo volviéndose casi invisibles en esos
// colores. Se elige entre blanco y un texto oscuro según cuál da más
// contraste contra el color de fondo real, en vez de asumir blanco
// siempre.
export const getContrastText = (hex) => (relativeLuminance(hex) > 0.6 ? '#36190d' : '#ffffff');

// Color de acento a usar: el del grupo/elemento si es válido y no es casi
// blanco (donde el texto/ícono blanco encima se volvería ilegible), o si
// no, un color determinístico de la paleta de acentos de marca.
export const resolveAccentColor = (flavors, id, explicitColor) => {
  if (explicitColor && !isNearWhite(explicitColor)) {
    return explicitColor;
  }
  return flavorForId(flavors, id);
};

// El mismo problema de ámbar/lima pero al revés: cuando el acento se
// usa como color de TEXTO/ícono sobre un fondo blanco o casi blanco
// (ExpenseCard), un ámbar o lima claro es casi ilegible aunque no sea
// "blanco sobre blanco" literal. En vez de saltar a otro color (lo que
// rompería la asociación "este id siempre es este color"), se oscurece
// el mismo tono lo suficiente para que sirva como texto.
export const readableAsText = (hex) => {
  if (relativeLuminance(hex) <= 0.55) return hex;
  const clean = (hex || '').replace('#', '');
  if (clean.length !== 6) return hex;
  const darken = (channel) => Math.round(parseInt(channel, 16) * 0.62).toString(16).padStart(2, '0');
  return `#${darken(clean.slice(0, 2))}${darken(clean.slice(2, 4))}${darken(clean.slice(4, 6))}`;
};
