/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    text: '#F7FAFF',
    tint: '#8BC9FF',
    background: '#071A33',
    foreground: '#F7FAFF',
    card: 'rgba(255,255,255,0.12)',
    cardForeground: '#F7FAFF',
    primary: '#8BC9FF',
    primaryForeground: '#071A33',
    secondary: 'rgba(255,255,255,0.10)',
    secondaryForeground: '#D8E7F7',
    muted: 'rgba(255,255,255,0.08)',
    mutedForeground: '#A9BCD2',
    accent: '#FFD77D',
    accentForeground: '#071A33',
    destructive: '#FF9E9E',
    destructiveForeground: '#071A33',
    border: 'rgba(255,255,255,0.15)',
    input: 'rgba(255,255,255,0.16)',
    sky: '#0D3157',
    skyMid: '#164B78',
    skyDeep: '#071A33',
    onSky: '#F7FAFF',
    cloud: '#DDEAF7',
    softCloud: '#AFC8DE',
    warm: '#FFD77D',
    cool: '#8BC9FF',
    success: '#9FE0C4',
  },

  dark: {
    text: '#F7FAFF',
    tint: '#8BC9FF',
    background: '#071A33',
    foreground: '#F7FAFF',
    card: 'rgba(255,255,255,0.12)',
    cardForeground: '#F7FAFF',
    primary: '#8BC9FF',
    primaryForeground: '#071A33',
    secondary: 'rgba(255,255,255,0.10)',
    secondaryForeground: '#D8E7F7',
    muted: 'rgba(255,255,255,0.08)',
    mutedForeground: '#A9BCD2',
    accent: '#FFD77D',
    accentForeground: '#071A33',
    destructive: '#FF9E9E',
    destructiveForeground: '#071A33',
    border: 'rgba(255,255,255,0.15)',
    input: 'rgba(255,255,255,0.16)',
    sky: '#0D3157',
    skyMid: '#164B78',
    skyDeep: '#071A33',
    onSky: '#F7FAFF',
    cloud: '#DDEAF7',
    softCloud: '#AFC8DE',
    warm: '#FFD77D',
    cool: '#8BC9FF',
    success: '#9FE0C4',
  },

  radius: 22,
};

export default colors;
