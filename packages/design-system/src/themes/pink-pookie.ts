import type { LuvoraTheme } from '@luvora/shared-types';

export const pinkPookieTheme: LuvoraTheme = {
  id: 'pink-pookie',
  name: 'Pink Pookie',
  description: 'Soft blush pink with dreamy rose accents – the iconic Luvora default.',
  isDark: false,
  isBuiltIn: true,
  previewGradient: ['#FFB3C6', '#FF85A1', '#FFC8DD'],

  colors: {
    primary: '#FF85A1',
    primaryVariant: '#FF4D7E',
    secondary: '#FFC8DD',
    accent: '#FF1493',

    surface: '#FFFFFF',
    surfaceVariant: '#FFF0F5',
    background: '#FFF5F7',

    onSurface: '#2D1B24',
    onSurfaceVariant: '#6B4050',
    onPrimary: '#FFFFFF',
    onBackground: '#2D1B24',

    success: '#4CAF84',
    warning: '#FFB347',
    error: '#E53E3E',
    info: '#4299E1',

    sentBubble: '#FF85A1',
    sentBubbleText: '#FFFFFF',
    receivedBubble: '#FFFFFF',
    receivedBubbleText: '#2D1B24',

    navigationBar: '#FFFFFF',
    statusBar: '#FFF5F7',
    tabBar: '#FFFFFF',
    tabBarActive: '#FF85A1',
    tabBarInactive: '#C4A0AD',

    inputBackground: '#FFF0F5',
    inputBorder: '#FFB3C6',
    inputText: '#2D1B24',
    inputPlaceholder: '#C4A0AD',

    divider: '#FFE0EB',
    overlay: 'rgba(255, 133, 161, 0.15)',
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
    sentGradient: ['#FF85A1', '#FF6B95'],
  },

  animations: {
    level: 'expressive',
    floatingHeartsEnabled: true,
    sendAnimationEnabled: true,
    reactionBurstEnabled: true,
  },

  background: {
    type: 'gradient',
    gradient: ['#FFF5F7', '#FFF0F5'],
  },
};
