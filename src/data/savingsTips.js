// Consejos de ahorro estáticos, filtrados por tipo de paseo. No se
// conecta a ninguna API externa de precios/lugares en tiempo real —
// es un dataset curado a mano, coincidiendo por categoría.

export const TRIP_TYPES = [
  { value: 'playa', label: 'Playa', emoji: '🏖️' },
  { value: 'montana', label: 'Montaña', emoji: '⛰️' },
  { value: 'ciudad', label: 'Ciudad', emoji: '🏙️' },
  { value: 'camping', label: 'Camping', emoji: '⛺' },
  { value: 'cumpleanos', label: 'Cumpleaños', emoji: '🎂' },
];

const SAVINGS_TIPS = {
  playa: [
    'Compren protector solar, sombrilla y nevera de icopor entre todos antes de llegar — en zonas turísticas de playa cuestan 2-3 veces más.',
    'Busquen hospedaje a 3-5 cuadras del malecón/frente de playa: el precio baja bastante y caminar esa distancia no es problema.',
    'Coman donde comen los locales, no en el primer restaurante frente al mar — suele ser igual de bueno y bastante más barato.',
    'Si van a alquilar lancha/moto acuática/parasailing, negocien un paquete grupal — casi siempre hay descuento por grupo grande.',
    'Lleven agua y snacks propios para la playa en vez de comprarle a los vendedores ambulantes todo el día.',
  ],
  montana: [
    'Reserven cabañas o refugios con cocina propia — cocinar entre todos sale mucho más barato que comer afuera cada comida.',
    'Pregunten por transporte compartido/shuttle hacia el punto de partida de caminatas en vez de varios taxis por separado.',
    'Lleven ropa por capas propia en vez de alquilar equipo de frío en el destino, que suele tener sobreprecio turístico.',
    'Si hay guías obligatorios para alguna ruta, contraten un solo guía para todo el grupo en vez de que cada quien busque el suyo.',
  ],
  ciudad: [
    'Usen transporte público o apps de viajes compartidos en vez de taxis individuales para moverse en grupo.',
    'Busquen el "menú del día" al almuerzo en vez de cenar siempre a la carta — suele ser la mitad de precio por platos similares.',
    'Revisen si los museos/atracciones tienen día o franja horaria gratis o con descuento (muchos lo tienen entre semana).',
    'Alojarse un poco afuera del centro histórico y moverse en metro/bus suele salir bastante más barato que dormir en el centro turístico.',
  ],
  camping: [
    'Repartan el equipo pesado (carpas, cocinetas, neveras) entre el grupo en vez de que cada quien lleve/compre el suyo.',
    'Compren la comida no perecedera en un solo mercado grande antes de salir — los pueblos cerca de zonas de camping suelen cobrar más caro.',
    'Verifiquen si el sitio de camping cobra por persona o por carpa — a veces conviene menos carpas más llenas.',
  ],
  cumpleanos: [
    'Hagan una sola compra grande de decoración/bebidas/snacks entre todos en vez de que cada quien traiga cosas sueltas y sobre.',
    'Si van a un lugar con reserva, pregunten por paquetes de grupo — muchos sitios tienen tarifa especial para cumpleaños en grupo.',
    'Definan un presupuesto por persona ANTES de salir para el regalo/torta, así nadie se pasa ni queda corto.',
  ],
  general: [
    'Anoten los gastos apenas ocurran, no al final del día — es más fácil no olvidar nada y las cuentas quedan más justas.',
    'Definan un presupuesto aproximado por persona antes de empezar el paseo, así todos entran con la misma expectativa.',
    'Cuando compren algo para todo el grupo, que siempre pague la misma persona (o roten) para que la liquidación final sea más simple.',
    'Revisen si hay descuentos por pagar en efectivo — muchos negocios pequeños cobran menos por evitar comisiones de tarjeta.',
  ],
};

export const getTipsForTripType = (tripType) => {
  return SAVINGS_TIPS[tripType] && SAVINGS_TIPS[tripType].length > 0
    ? SAVINGS_TIPS[tripType]
    : SAVINGS_TIPS.general;
};

export default SAVINGS_TIPS;
