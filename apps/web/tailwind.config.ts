import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Luvora brand palette
        luvora: {
          50: '#FFF5F7',
          100: '#FFE0EB',
          200: '#FFB3C6',
          300: '#FF85A1',
          400: '#FF6B95',
          500: '#FF4D7E',
          600: '#E03560',
          700: '#B01F45',
          800: '#7A0F2E',
          900: '#3D0018',
        },
        lavender: {
          100: '#F5F3FF',
          200: '#EDE9FE',
          300: '#DDD6FE',
          400: '#C4B5FD',
          500: '#A78BFA',
          600: '#8B5CF6',
          700: '#7C3AED',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-cal-sans)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'luvora-gradient': 'linear-gradient(135deg, #FF85A1 0%, #C084FC 50%, #60A5FA 100%)',
        'hero-gradient': 'linear-gradient(180deg, #FFF5F7 0%, #FFFFFF 100%)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'fade-up': 'fade-up 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
