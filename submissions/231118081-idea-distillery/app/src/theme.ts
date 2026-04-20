import { Platform } from 'react-native';

export const COLORS = {
  background: '#0d0e10',
  surfaceLow: '#121316',
  surface: '#181a1d',
  surfaceHigh: '#1d2024',
  surfaceHighest: '#23262b',
  surfaceBright: '#282c33',
  text: '#e3e5ed',
  textMuted: '#a9abb2',
  outline: '#73757c',
  outlineVariant: '#45484e',
  ghostBorder: 'rgba(69, 72, 78, 0.34)',
  primary: '#bbc9d0',
  primaryDim: '#adbbc2',
  secondary: '#87a2af',
  secondaryContainer: '#253f4a',
  tertiary: '#85ecff',
  tertiaryDim: '#4ed1e7',
  danger: '#ee7d77',
  dangerDim: '#bb5551',
  dangerContainer: '#7f2927',
  success: '#7dc9a7',
  successContainer: '#17362b',
  warning: '#d3ad63',
  warningContainer: '#3c2f12',
};

export const FONTS = {
  displayMedium: 'SpaceGrotesk_500Medium',
  displayBold: 'SpaceGrotesk_700Bold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),
};

export const SPACING = {
  xxs: 4,
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
};

export const RADIUS = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
};

export const SHADOW = {
  shadowColor: '#000000',
  shadowOpacity: 0.24,
  shadowRadius: 20,
  shadowOffset: { width: 0, height: 8 },
  elevation: 4,
};

