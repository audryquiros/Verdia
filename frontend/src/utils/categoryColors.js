/**
 * Identidad visual única para categorías financieras.
 *
 * Regla de Verdia: una categoría conserva el mismo color en todas las
 * pantallas donde aparece. Los fondos son variantes suaves del mismo color
 * para mantener legibilidad sin perder la identidad.
 */
export const CATEGORY_COLORS = {
  Alimentación: {
    color: '#B85C38',
    background: '#FBE8DF',
    border: '#E8B29B',
  },
  Transporte: {
    color: '#7359C9',
    background: '#EEE9FF',
    border: '#B7A8EC',
  },
  Servicios: {
    color: '#B07A16',
    background: '#FFF2D9',
    border: '#E3C47A',
  },
  Entretenimiento: {
    color: '#C46A4F',
    background: '#FBE9E1',
    border: '#F0B39A',
  },
  Salud: {
    color: '#3F82C7',
    background: '#E8F3FF',
    border: '#A9CBEA',
  },
  Hogar: {
    color: '#7A5A3A',
    background: '#F2EAE2',
    border: '#D8C2AE',
  },
  Salario: {
    color: '#3F6F8F',
    background: '#E7F0F5',
    border: '#AFC9D8',
  },
  Viajes: {
    color: '#B66A2C',
    background: '#FFF0DF',
    border: '#E8B88A',
  },
  Tecnología: {
    color: '#5B63B8',
    background: '#ECEEFF',
    border: '#B8BCEB',
  },
  Educación: {
    color: '#A34D78',
    background: '#F8E8F0',
    border: '#D9A7BF',
  },
  Emergencias: {
    color: '#B95454',
    background: '#FBE9E9',
    border: '#E7B0B0',
  },
  Préstamos: {
    color: '#8A5A44',
    background: '#F4EAE4',
    border: '#D6B8A7',
  },
  Tarjetas: {
    color: '#4F6D8A',
    background: '#EAF0F6',
    border: '#AFC1D2',
  },
  Vivienda: {
    color: '#6B5EAA',
    background: '#EEEAFE',
    border: '#BBB2DF',
  },
  Otros: {
    color: '#65736C',
    background: '#EEF2EF',
    border: '#CBD7D0',
  },
};

export function getCategoryColor(category) {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.Otros;
}
