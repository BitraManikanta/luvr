import type { LuvoraTheme } from '@luvora/shared-types';

export const midnightLoveTheme: LuvoraTheme = {
  id: 'midnight-love',
  name: 'Midnight Love',
  description: 'Deep midnight purple with rose gold accents – elegant dark mode for night owls.',
  isDark: true,
  isBuiltIn: true,
  previewGradient: ['#1A0A2E', '#2D1B69', '#FF85A1'],

  colors: {
    primary: '#C084FC',
    primaryVariant: '#A855F7',
    secondary: '#FF85A1',
    accent: '#F472B6',

    surface: '#1E0A3C',
    surfaceVariant: '#2D1B4E',
    background: '#120726',

    onSurface: '#F0E6FF',
    onSurfaceVariant: '#C4A8E0',
    onPrimary: '#1A0A2E',
    onBackground: '#F0E6FF',

    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#60A5FA',

    sentBubble: '#7C3AED',
    sentBubbleText: '#FFFFFF',
    receivedBubble: '#2D1B4E',
    receivedBubbleText: '#F0E6FF',

    navigationBar: '#1E0A3C',
    statusBar: '#120726',
    tabBar: '#1E0A3C',
    tabBarActive: '#C084FC',
    tabBarInactive: '#6B4A8A',

    inputBackground: '#2D1B4E',
    inputBorder: '#4B2D6B',
    inputText: '#F0E6FF',
    inputPlaceholder: '#6B4A8A',

    divider: '#2D1B4E',
    overlay: 'rgba(192, 132, 252, 0.12)',
  },

  typography: {
    fontFamily: 'System',
    fontFamilyMedium: 'System',
    fontFamilyBold: 'System',
    fontSizeBase: 16,
    lineHeightBase: 1.5,
    scaleCategory: 'normal',
  },

  bubbles: {
    shape: 'rounded',
    maxWidthFraction: 0.75,
    sentBorderRadius: { topLeft: 18, topRight: 4, bottomLeft: 18, bottomRight: 18 },
    receivedBorderRadius: { topLeft: 4, topRight: 18, bottomLeft: 18, bottomRight: 18 },
    sentGradient: ['#7C3AED', '#6D28D9'],
  },

  animations: {
    level: 'normal',
    floatingHeartsEnabled: true,
    sendAnimationEnabled: true,
    reactionBurstEnabled: true,
  },

  background: {
    type: 'gradient',
    gradient: ['#120726', '#1A0A3C'],
  },
};
