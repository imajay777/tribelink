export const lightColors = {
  background: '#FFFFFF',
  surface: '#FAFAFA',
  surfaceLight: '#F5F5F5',
  card: '#FFFFFF',
  primary: '#C13584',
  primaryDark: '#833AB4',
  accent: '#FD1D1D',
  accentDark: '#F77737',
  text: '#000000',
  // Brighter secondary text for better contrast
  textSecondary: '#4A4A4A',
  textTertiary: '#AFAFAF',
  border: 'rgba(0, 0, 0, 0.1)',
  borderLight: 'rgba(0, 0, 0, 0.05)',
  success: '#00C851',
  successDark: '#00A844',
  warning: '#FFB800',
  error: '#FF3366',
  gradient: ['#833AB4', '#C13584', '#E1306C', '#FD1D1D'],
  overlay: 'rgba(0, 0, 0, 0.5)',
  cardTransparent: 'rgba(255, 255, 255, 0.1)',
};

export const darkColors = {
  background: '#000000',
  surface: '#121212',
  surfaceLight: '#1C1C1C',
  card: '#262626',
  primary: '#E1306C',
  primaryDark: '#C13584',
  accent: '#FD1D1D',
  accentDark: '#F77737',
  text: '#FFFFFF',
  // Keep dark theme secondary slightly brighter if used
  textSecondary: '#B0B0B0',
  textTertiary: '#737373',
  border: 'rgba(255, 255, 255, 0.1)',
  borderLight: 'rgba(255, 255, 255, 0.05)',
  success: '#00FF87',
  successDark: '#00CC6F',
  warning: '#FFB800',
  error: '#FF3366',
  gradient: ['#833AB4', '#C13584', '#E1306C', '#FD1D1D'],
  overlay: 'rgba(0, 0, 0, 0.7)',
  cardTransparent: 'rgba(38, 38, 38, 0.8)',
};

export type ColorScheme = typeof lightColors;

export default darkColors;
