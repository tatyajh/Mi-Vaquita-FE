// Forma de tarjeta compartida ("bolsa de leche"): esquinas superiores
// casi rectas (como el sellado de la bolsa) y esquinas inferiores bien
// abultadas y redondeadas (el cuerpo de la bolsa).
//
// Se define como string de CSS (no como número) a propósito: el
// shorthand numérico de `borderRadius` en el `sx` de MUI se multiplica
// por `theme.shape.borderRadius`, lo que antes convertía un inocente
// `borderRadius: 6` en 108px reales — un radio enorme que recortaba el
// contenido de las tarjetas (ver GroupCard/FriendCard/ExpenseCard). Un
// string como este se usa tal cual, sin multiplicador.
export const MILK_BAG_RADIUS = '8px 8px 28px 28px';
export const MILK_CARTON_CLIP = 'polygon(9% 0, 91% 0, 100% 11%, 100% 90%, 94% 100%, 6% 100%, 0 90%, 0 11%)';
