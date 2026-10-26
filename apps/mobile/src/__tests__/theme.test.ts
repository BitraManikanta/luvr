import { BUILT_IN_THEMES, DEFAULT_THEME_ID } from '../../packages/design-system/src';

describe('Built-in themes', () => {
  it('has exactly 12 built-in themes', () => {
    expect(Object.keys(BUILT_IN_THEMES)).toHaveLength(12);
  });

  it('default theme exists', () => {
    expect(BUILT_IN_THEMES[DEFAULT_THEME_ID]).toBeDefined();
  });

  it('every theme has required color tokens', () => {
    const required: Array<keyof typeof BUILT_IN_THEMES[string]['colors']> = [
      'primary',
      'background',
      'sentBubble',
      'receivedBubble',
      'onSurface',
    ];

    for (const [id, theme] of Object.entries(BUILT_IN_THEMES)) {
      for (const key of required) {
        expect(theme.colors[key]).toBeTruthy();
      }
    }
  });

  it('every theme has a previewGradient with at least 2 colors', () => {
    for (const theme of Object.values(BUILT_IN_THEMES)) {
      expect(theme.previewGradient.length).toBeGreaterThanOrEqual(2);
    }
  });
});
