import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0A0A0B',
          secondary: '#1A1A1C',
          tertiary: '#2A2A2E',
        },
        soft: {
          cream: '#F5F4F0',
          warmGray: '#C4C2B8',
          coral: '#E85A4F',
          charcoal: '#2D2D2A',
        },
        neon: {
          pink: '#FF6B9D',
          pinkGlow: '#FF6B9D33',
          blue: '#4ECDC4',
          blueGlow: '#4ECDC433',
          purple: '#A8E6CF',
          purpleGlow: '#A8E6CF33',
        },
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'typing': 'typing 3.5s steps(40, end)',
        'blink-caret': 'blink-caret 1s step-end infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        glow: {
          '0%': { 'box-shadow': '0 0 20px rgba(255, 107, 157, 0.5)' },
          '100%': { 'box-shadow': '0 0 30px rgba(255, 107, 157, 0.8)' },
        },
        typing: {
          '0%': { width: '0' },
          '100%': { width: '100%' }
        },
        'blink-caret': {
          '0%, 50%': { 'border-color': 'transparent' },
          '51%, 100%': { 'border-color': '#FF6B9D' },
        }
      }
    },
  },
  plugins: [],
}

export default config
