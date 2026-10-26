/** Luvora theme system – design tokens.
 *
 * All colors use hex strings. Gradients use arrays of hex strings.
 * The theme engine applies tokens to all components; individual screens
 * do NOT hold hard-coded color values.
 */

export type ThemeId = string;

export interface LuvoraTheme {
  id: ThemeId;
  name: string;
  description: string;
  isDark: boolean;
  isBuiltIn: boolean;
  previewGradient: string[]; // 2–3 colors for the theme picker swatch

  colors: ThemeColors;
  typography: ThemeTypography;
  bubbles: ThemeBubbles;
  animations: ThemeAnimations;
  background: ThemeBackground;
}

export interface ThemeColors {
  // Core palette
  primary: string;
  primaryVariant: string;
  secondary: string;
  accent: string;

  // Surfaces
  surface: string;
  surfaceVariant: string;
  background: string;

  // Text
  onSurface: string;
  onSurfaceVariant: string;
  onPrimary: string;
  onBackground: string;

  // Semantic
  success: string;
  warning: string;
  error: string;
  info: string;

  // Chat specific
  sentBubble: string;
  sentBubbleText: string;
  receivedBubble: string;
  receivedBubbleText: string;

  // Nav & chrome
  navigationBar: string;
  statusBar: string;
  tabBar: string;
  tabBarActive: string;
  tabBarInactive: string;

  // Input
  inputBackground: string;
  inputBorder: string;
  inputText: string;
  inputPlaceholder: string;

  // Dividers
  divider: string;
  overlay: string;
}

export interface ThemeTypography {
  fontFamily: string;
  fontFamilyMedium: string;
  fontFamilyBold: string;
  fontSizeBase: number;
  lineHeightBase: number;
  scaleCategory: 'small' | 'normal' | 'large' | 'xlarge';
}

export interface ThemeBubbles {
  sentBorderRadius: BubbleRadii;
  receivedBorderRadius: BubbleRadii;
  shape: 'rounded' | 'pill' | 'square';
  maxWidthFraction: number; // 0.6–0.85
  sentGradient?: string[]; // optional gradient override
  receivedGradient?: string[];
}

export interface BubbleRadii {
  topLeft: number;
  topRight: number;
  bottomLeft: number;
  bottomRight: number;
}

export interface ThemeAnimations {
  level: 'none' | 'reduced' | 'normal' | 'expressive';
  floatingHeartsEnabled: boolean;
  sendAnimationEnabled: boolean;
  reactionBurstEnabled: boolean;
}

export interface ThemeBackground {
  type: 'color' | 'gradient' | 'pattern' | 'image';
  color?: string;
  gradient?: string[];
  patternId?: string;
  imageUri?: string; // local user-selected photo URI
}

/** The 12 built-in themes shipped with the app. */
export const BUILT_IN_THEME_IDS = [
  'pink-pookie',
  'lavender-dream',
  'cherry-blossom',
  'strawberry-milk',
  'peach-romance',
  'midnight-love',
  'moonlight',
  'cloud-nine',
  'teddy-bear',
  'rose-garden',
  'starlight',
  'minimal-cream',
] as const;

export type BuiltInThemeId = (typeof BUILT_IN_THEME_IDS)[number];
