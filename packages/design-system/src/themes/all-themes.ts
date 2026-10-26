import type { LuvoraTheme } from '@luvora/shared-types';
import { pinkPookieTheme } from './pink-pookie';
import { midnightLoveTheme } from './midnight-love';

/** Lavender Dream */
const lavenderDreamTheme: LuvoraTheme = {
  id: 'lavender-dream',
  name: 'Lavender Dream',
  description: 'Soft lavender and lilac hues for a dreamy, calming atmosphere.',
  isDark: false,
  isBuiltIn: true,
  previewGradient: ['#E6E0FF', '#C4B5FD', '#DDD6FE'],
  colors: {
    primary: '#8B5CF6', primaryVariant: '#7C3AED', secondary: '#C4B5FD', accent: '#A78BFA',
    surface: '#FFFFFF', surfaceVariant: '#F5F3FF', background: '#FAFAFF',
    onSurface: '#1E1040', onSurfaceVariant: '#4A3880', onPrimary: '#FFFFFF', onBackground: '#1E1040',
    success: '#4CAF84', warning: '#FFB347', error: '#E53E3E', info: '#4299E1',
    sentBubble: '#8B5CF6', sentBubbleText: '#FFFFFF',
    receivedBubble: '#FFFFFF', receivedBubbleText: '#1E1040',
    navigationBar: '#FFFFFF', statusBar: '#FAFAFF',
    tabBar: '#FFFFFF', tabBarActive: '#8B5CF6', tabBarInactive: '#A8A0C0',
    inputBackground: '#F5F3FF', inputBorder: '#C4B5FD', inputText: '#1E1040', inputPlaceholder: '#A8A0C0',
    divider: '#EDE9FE', overlay: 'rgba(139, 92, 246, 0.12)',
  },
  typography: { fontFamily: 'System', fontFamilyMedium: 'System', fontFamilyBold: 'System', fontSizeBase: 16, lineHeightBase: 1.5, scaleCategory: 'normal' },
  bubbles: { shape: 'rounded', maxWidthFraction: 0.75, sentBorderRadius: { topLeft: 18, topRight: 4, bottomLeft: 18, bottomRight: 18 }, receivedBorderRadius: { topLeft: 4, topRight: 18, bottomLeft: 18, bottomRight: 18 } },
  animations: { level: 'normal', floatingHeartsEnabled: true, sendAnimationEnabled: true, reactionBurstEnabled: true },
  background: { type: 'gradient', gradient: ['#FAFAFF', '#F5F3FF'] },
};

/** Cherry Blossom */
const cherryBlossomTheme: LuvoraTheme = {
  id: 'cherry-blossom',
  name: 'Cherry Blossom',
  description: 'Delicate sakura pinks with warm cream – inspired by Japanese spring.',
  isDark: false,
  isBuiltIn: true,
  previewGradient: ['#FFB7C5', '#FF8FAB', '#FFF0F3'],
  colors: {
    primary: '#FF8FAB', primaryVariant: '#FF6B8A', secondary: '#FFB7C5', accent: '#FF4D72',
    surface: '#FFFBFC', surfaceVariant: '#FFF0F3', background: '#FFFBFC',
    onSurface: '#3D1520', onSurfaceVariant: '#7A3040', onPrimary: '#FFFFFF', onBackground: '#3D1520',
    success: '#52C77A', warning: '#FFB347', error: '#D53F52', info: '#4895D4',
    sentBubble: '#FF8FAB', sentBubbleText: '#FFFFFF',
    receivedBubble: '#FFFFFF', receivedBubbleText: '#3D1520',
    navigationBar: '#FFFFFF', statusBar: '#FFFBFC',
    tabBar: '#FFFFFF', tabBarActive: '#FF8FAB', tabBarInactive: '#C8909F',
    inputBackground: '#FFF0F3', inputBorder: '#FFB7C5', inputText: '#3D1520', inputPlaceholder: '#C8909F',
    divider: '#FFD6DF', overlay: 'rgba(255, 143, 171, 0.12)',
  },
  typography: { fontFamily: 'System', fontFamilyMedium: 'System', fontFamilyBold: 'System', fontSizeBase: 16, lineHeightBase: 1.5, scaleCategory: 'normal' },
  bubbles: { shape: 'pill', maxWidthFraction: 0.75, sentBorderRadius: { topLeft: 20, topRight: 4, bottomLeft: 20, bottomRight: 20 }, receivedBorderRadius: { topLeft: 4, topRight: 20, bottomLeft: 20, bottomRight: 20 } },
  animations: { level: 'expressive', floatingHeartsEnabled: true, sendAnimationEnabled: true, reactionBurstEnabled: true },
  background: { type: 'color', color: '#FFFBFC' },
};

/** Minimal Cream */
const minimalCreamTheme: LuvoraTheme = {
  id: 'minimal-cream',
  name: 'Minimal Cream',
  description: 'Clean and minimal – warm cream tones with no decorative effects.',
  isDark: false,
  isBuiltIn: true,
  previewGradient: ['#FEFAE0', '#F5ECD7', '#EDE0C4'],
  colors: {
    primary: '#9B7B4A', primaryVariant: '#7A5C30', secondary: '#D4B896', accent: '#8B6914',
    surface: '#FFFFFF', surfaceVariant: '#FEFAE0', background: '#FEFCF8',
    onSurface: '#1C1612', onSurfaceVariant: '#4A3D2C', onPrimary: '#FFFFFF', onBackground: '#1C1612',
    success: '#4CAF84', warning: '#E6A817', error: '#C0392B', info: '#2980B9',
    sentBubble: '#9B7B4A', sentBubbleText: '#FFFFFF',
    receivedBubble: '#FFFFFF', receivedBubbleText: '#1C1612',
    navigationBar: '#FFFFFF', statusBar: '#FEFCF8',
    tabBar: '#FFFFFF', tabBarActive: '#9B7B4A', tabBarInactive: '#9B9080',
    inputBackground: '#FEFAE0', inputBorder: '#D4B896', inputText: '#1C1612', inputPlaceholder: '#9B9080',
    divider: '#EDE0C4', overlay: 'rgba(155, 123, 74, 0.10)',
  },
  typography: { fontFamily: 'System', fontFamilyMedium: 'System', fontFamilyBold: 'System', fontSizeBase: 16, lineHeightBase: 1.5, scaleCategory: 'normal' },
  bubbles: { shape: 'rounded', maxWidthFraction: 0.75, sentBorderRadius: { topLeft: 12, topRight: 4, bottomLeft: 12, bottomRight: 12 }, receivedBorderRadius: { topLeft: 4, topRight: 12, bottomLeft: 12, bottomRight: 12 } },
  animations: { level: 'none', floatingHeartsEnabled: false, sendAnimationEnabled: false, reactionBurstEnabled: false },
  background: { type: 'color', color: '#FEFCF8' },
};

/** Starlight – high-contrast accessible theme */
const starlightTheme: LuvoraTheme = {
  id: 'starlight',
  name: 'Starlight',
  description: 'High-contrast dark theme with golden accents – designed for accessibility.',
  isDark: true,
  isBuiltIn: true,
  previewGradient: ['#0F0F1A', '#1A1A2E', '#FFD700'],
  colors: {
    primary: '#FFD700', primaryVariant: '#FFC200', secondary: '#FF85A1', accent: '#00FFCC',
    surface: '#1A1A2E', surfaceVariant: '#252540', background: '#0F0F1A',
    onSurface: '#FFFFFF', onSurfaceVariant: '#E0E0E0', onPrimary: '#000000', onBackground: '#FFFFFF',
    success: '#00FF88', warning: '#FFD700', error: '#FF4444', info: '#00BFFF',
    sentBubble: '#FFD700', sentBubbleText: '#000000',
    receivedBubble: '#252540', receivedBubbleText: '#FFFFFF',
    navigationBar: '#0F0F1A', statusBar: '#0F0F1A',
    tabBar: '#1A1A2E', tabBarActive: '#FFD700', tabBarInactive: '#808080',
    inputBackground: '#252540', inputBorder: '#FFD700', inputText: '#FFFFFF', inputPlaceholder: '#808080',
    divider: '#333355', overlay: 'rgba(255, 215, 0, 0.15)',
  },
  typography: { fontFamily: 'System', fontFamilyMedium: 'System', fontFamilyBold: 'System', fontSizeBase: 17, lineHeightBase: 1.6, scaleCategory: 'large' },
  bubbles: { shape: 'rounded', maxWidthFraction: 0.80, sentBorderRadius: { topLeft: 16, topRight: 4, bottomLeft: 16, bottomRight: 16 }, receivedBorderRadius: { topLeft: 4, topRight: 16, bottomLeft: 16, bottomRight: 16 } },
  animations: { level: 'reduced', floatingHeartsEnabled: false, sendAnimationEnabled: true, reactionBurstEnabled: false },
  background: { type: 'color', color: '#0F0F1A' },
};

/** Strawberry Milk */
const strawberryMilkTheme: LuvoraTheme = {
  id: 'strawberry-milk',
  name: 'Strawberry Milk',
  description: 'Pastel pink milk-glass aesthetic with soft strawberry tones.',
  isDark: false, isBuiltIn: true,
  previewGradient: ['#FFE4EC', '#FFBDD0', '#FFF0F5'],
  colors: {
    primary: '#FF6B95', primaryVariant: '#FF4070', secondary: '#FFBDD0', accent: '#FF1462',
    surface: '#FFFBFD', surfaceVariant: '#FFE9F0', background: '#FFF5F8',
    onSurface: '#330D1A', onSurfaceVariant: '#662040', onPrimary: '#FFFFFF', onBackground: '#330D1A',
    success: '#52C77A', warning: '#FFB347', error: '#E53E3E', info: '#4299E1',
    sentBubble: '#FF6B95', sentBubbleText: '#FFFFFF', receivedBubble: '#FFFFFF', receivedBubbleText: '#330D1A',
    navigationBar: '#FFFFFF', statusBar: '#FFF5F8', tabBar: '#FFFFFF', tabBarActive: '#FF6B95', tabBarInactive: '#C4A0AE',
    inputBackground: '#FFE9F0', inputBorder: '#FFBDD0', inputText: '#330D1A', inputPlaceholder: '#C4A0AE',
    divider: '#FFD6E5', overlay: 'rgba(255, 107, 149, 0.12)',
  },
  typography: { fontFamily: 'System', fontFamilyMedium: 'System', fontFamilyBold: 'System', fontSizeBase: 16, lineHeightBase: 1.5, scaleCategory: 'normal' },
  bubbles: { shape: 'rounded', maxWidthFraction: 0.75, sentBorderRadius: { topLeft: 18, topRight: 4, bottomLeft: 18, bottomRight: 18 }, receivedBorderRadius: { topLeft: 4, topRight: 18, bottomLeft: 18, bottomRight: 18 } },
  animations: { level: 'expressive', floatingHeartsEnabled: true, sendAnimationEnabled: true, reactionBurstEnabled: true },
  background: { type: 'gradient', gradient: ['#FFF5F8', '#FFE9F0'] },
};

/** Peach Romance */
const peachRomanceTheme: LuvoraTheme = {
  id: 'peach-romance',
  name: 'Peach Romance',
  description: 'Warm peach and apricot tones with a soft golden glow.',
  isDark: false, isBuiltIn: true,
  previewGradient: ['#FFDBB4', '#FFB380', '#FFF3E8'],
  colors: {
    primary: '#FF7043', primaryVariant: '#F4511E', secondary: '#FFAB76', accent: '#FF5722',
    surface: '#FFFAF5', surfaceVariant: '#FFF3E8', background: '#FFFAF5',
    onSurface: '#2C1507', onSurfaceVariant: '#5C3010', onPrimary: '#FFFFFF', onBackground: '#2C1507',
    success: '#52C77A', warning: '#FFCA28', error: '#C62828', info: '#1E88E5',
    sentBubble: '#FF7043', sentBubbleText: '#FFFFFF', receivedBubble: '#FFFFFF', receivedBubbleText: '#2C1507',
    navigationBar: '#FFFFFF', statusBar: '#FFFAF5', tabBar: '#FFFFFF', tabBarActive: '#FF7043', tabBarInactive: '#C4A078',
    inputBackground: '#FFF3E8', inputBorder: '#FFAB76', inputText: '#2C1507', inputPlaceholder: '#C4A078',
    divider: '#FFDCC2', overlay: 'rgba(255, 112, 67, 0.10)',
  },
  typography: { fontFamily: 'System', fontFamilyMedium: 'System', fontFamilyBold: 'System', fontSizeBase: 16, lineHeightBase: 1.5, scaleCategory: 'normal' },
  bubbles: { shape: 'rounded', maxWidthFraction: 0.75, sentBorderRadius: { topLeft: 18, topRight: 4, bottomLeft: 18, bottomRight: 18 }, receivedBorderRadius: { topLeft: 4, topRight: 18, bottomLeft: 18, bottomRight: 18 } },
  animations: { level: 'normal', floatingHeartsEnabled: false, sendAnimationEnabled: true, reactionBurstEnabled: true },
  background: { type: 'color', color: '#FFFAF5' },
};

/** Moonlight */
const moonlightTheme: LuvoraTheme = {
  id: 'moonlight',
  name: 'Moonlight',
  description: 'Silver moonlight and deep blue – a serene dark theme.',
  isDark: true, isBuiltIn: true,
  previewGradient: ['#0D1B2A', '#1B2A4A', '#C0CFDE'],
  colors: {
    primary: '#90B4CE', primaryVariant: '#6A94B8', secondary: '#C0CFDE', accent: '#FFFFFF',
    surface: '#1B2A4A', surfaceVariant: '#253758', background: '#0D1B2A',
    onSurface: '#E8EFF5', onSurfaceVariant: '#A8C0D4', onPrimary: '#0D1B2A', onBackground: '#E8EFF5',
    success: '#3AC77A', warning: '#F0B429', error: '#FC5454', info: '#4DA8E2',
    sentBubble: '#3B5A8A', sentBubbleText: '#E8EFF5', receivedBubble: '#253758', receivedBubbleText: '#E8EFF5',
    navigationBar: '#0D1B2A', statusBar: '#0D1B2A', tabBar: '#1B2A4A', tabBarActive: '#90B4CE', tabBarInactive: '#506480',
    inputBackground: '#253758', inputBorder: '#3B5A8A', inputText: '#E8EFF5', inputPlaceholder: '#506480',
    divider: '#253758', overlay: 'rgba(144, 180, 206, 0.12)',
  },
  typography: { fontFamily: 'System', fontFamilyMedium: 'System', fontFamilyBold: 'System', fontSizeBase: 16, lineHeightBase: 1.5, scaleCategory: 'normal' },
  bubbles: { shape: 'rounded', maxWidthFraction: 0.75, sentBorderRadius: { topLeft: 18, topRight: 4, bottomLeft: 18, bottomRight: 18 }, receivedBorderRadius: { topLeft: 4, topRight: 18, bottomLeft: 18, bottomRight: 18 } },
  animations: { level: 'normal', floatingHeartsEnabled: false, sendAnimationEnabled: true, reactionBurstEnabled: true },
  background: { type: 'gradient', gradient: ['#0D1B2A', '#111E30'] },
};

/** Cloud Nine */
const cloudNineTheme: LuvoraTheme = {
  id: 'cloud-nine',
  name: 'Cloud Nine',
  description: 'Baby blue and cotton white – soft as clouds, bright as sky.',
  isDark: false, isBuiltIn: true,
  previewGradient: ['#BFEFFF', '#87CEEB', '#F0F8FF'],
  colors: {
    primary: '#2196F3', primaryVariant: '#1565C0', secondary: '#87CEEB', accent: '#03A9F4',
    surface: '#FFFFFF', surfaceVariant: '#F0F8FF', background: '#F5FBFF',
    onSurface: '#0D2137', onSurfaceVariant: '#1E4060', onPrimary: '#FFFFFF', onBackground: '#0D2137',
    success: '#4CAF84', warning: '#FFB347', error: '#E53E3E', info: '#2196F3',
    sentBubble: '#2196F3', sentBubbleText: '#FFFFFF', receivedBubble: '#FFFFFF', receivedBubbleText: '#0D2137',
    navigationBar: '#FFFFFF', statusBar: '#F5FBFF', tabBar: '#FFFFFF', tabBarActive: '#2196F3', tabBarInactive: '#90B8D0',
    inputBackground: '#F0F8FF', inputBorder: '#87CEEB', inputText: '#0D2137', inputPlaceholder: '#90B8D0',
    divider: '#D6EEFF', overlay: 'rgba(33, 150, 243, 0.10)',
  },
  typography: { fontFamily: 'System', fontFamilyMedium: 'System', fontFamilyBold: 'System', fontSizeBase: 16, lineHeightBase: 1.5, scaleCategory: 'normal' },
  bubbles: { shape: 'rounded', maxWidthFraction: 0.75, sentBorderRadius: { topLeft: 18, topRight: 4, bottomLeft: 18, bottomRight: 18 }, receivedBorderRadius: { topLeft: 4, topRight: 18, bottomLeft: 18, bottomRight: 18 } },
  animations: { level: 'normal', floatingHeartsEnabled: false, sendAnimationEnabled: true, reactionBurstEnabled: true },
  background: { type: 'color', color: '#F5FBFF' },
};

/** Teddy Bear */
const teddyBearTheme: LuvoraTheme = {
  id: 'teddy-bear',
  name: 'Teddy Bear',
  description: 'Warm caramel, honey, and cream – cozy and comforting.',
  isDark: false, isBuiltIn: true,
  previewGradient: ['#D4956A', '#C4783A', '#FFF5E6'],
  colors: {
    primary: '#C4783A', primaryVariant: '#A85C20', secondary: '#D4956A', accent: '#8B4513',
    surface: '#FFFBF5', surfaceVariant: '#FFF0DC', background: '#FFFBF5',
    onSurface: '#2C1A09', onSurfaceVariant: '#5C3A15', onPrimary: '#FFFFFF', onBackground: '#2C1A09',
    success: '#4CAF84', warning: '#FFC107', error: '#C62828', info: '#1565C0',
    sentBubble: '#C4783A', sentBubbleText: '#FFFFFF', receivedBubble: '#FFFFFF', receivedBubbleText: '#2C1A09',
    navigationBar: '#FFFFFF', statusBar: '#FFFBF5', tabBar: '#FFFFFF', tabBarActive: '#C4783A', tabBarInactive: '#C49A6A',
    inputBackground: '#FFF0DC', inputBorder: '#D4956A', inputText: '#2C1A09', inputPlaceholder: '#C49A6A',
    divider: '#EED5B4', overlay: 'rgba(196, 120, 58, 0.10)',
  },
  typography: { fontFamily: 'System', fontFamilyMedium: 'System', fontFamilyBold: 'System', fontSizeBase: 16, lineHeightBase: 1.5, scaleCategory: 'normal' },
  bubbles: { shape: 'rounded', maxWidthFraction: 0.75, sentBorderRadius: { topLeft: 18, topRight: 4, bottomLeft: 18, bottomRight: 18 }, receivedBorderRadius: { topLeft: 4, topRight: 18, bottomLeft: 18, bottomRight: 18 } },
  animations: { level: 'reduced', floatingHeartsEnabled: false, sendAnimationEnabled: true, reactionBurstEnabled: false },
  background: { type: 'color', color: '#FFFBF5' },
};

/** Rose Garden */
const roseGardenTheme: LuvoraTheme = {
  id: 'rose-garden',
  name: 'Rose Garden',
  description: 'Deep rose red with forest green – romantic and lush.',
  isDark: false, isBuiltIn: true,
  previewGradient: ['#B00040', '#800028', '#FFF0F3'],
  colors: {
    primary: '#B00040', primaryVariant: '#800028', secondary: '#FF6680', accent: '#2E7D32',
    surface: '#FFFBFC', surfaceVariant: '#FFF0F3', background: '#FFFBFC',
    onSurface: '#2A0010', onSurfaceVariant: '#550020', onPrimary: '#FFFFFF', onBackground: '#2A0010',
    success: '#2E7D32', warning: '#F9A825', error: '#B71C1C', info: '#1565C0',
    sentBubble: '#B00040', sentBubbleText: '#FFFFFF', receivedBubble: '#FFFFFF', receivedBubbleText: '#2A0010',
    navigationBar: '#FFFFFF', statusBar: '#FFFBFC', tabBar: '#FFFFFF', tabBarActive: '#B00040', tabBarInactive: '#B09098',
    inputBackground: '#FFF0F3', inputBorder: '#F8A0B8', inputText: '#2A0010', inputPlaceholder: '#B09098',
    divider: '#F8D0DA', overlay: 'rgba(176, 0, 64, 0.10)',
  },
  typography: { fontFamily: 'System', fontFamilyMedium: 'System', fontFamilyBold: 'System', fontSizeBase: 16, lineHeightBase: 1.5, scaleCategory: 'normal' },
  bubbles: { shape: 'rounded', maxWidthFraction: 0.75, sentBorderRadius: { topLeft: 18, topRight: 4, bottomLeft: 18, bottomRight: 18 }, receivedBorderRadius: { topLeft: 4, topRight: 18, bottomLeft: 18, bottomRight: 18 } },
  animations: { level: 'normal', floatingHeartsEnabled: true, sendAnimationEnabled: true, reactionBurstEnabled: true },
  background: { type: 'color', color: '#FFFBFC' },
};

/** All 12 built-in themes, indexed by ID. */
export const BUILT_IN_THEMES: Record<string, LuvoraTheme> = {
  'pink-pookie': pinkPookieTheme,
  'lavender-dream': lavenderDreamTheme,
  'cherry-blossom': cherryBlossomTheme,
  'strawberry-milk': strawberryMilkTheme,
  'peach-romance': peachRomanceTheme,
  'midnight-love': midnightLoveTheme,
  'moonlight': moonlightTheme,
  'cloud-nine': cloudNineTheme,
  'teddy-bear': teddyBearTheme,
  'rose-garden': roseGardenTheme,
  'starlight': starlightTheme,
  'minimal-cream': minimalCreamTheme,
};

export const DEFAULT_THEME_ID = 'pink-pookie';
