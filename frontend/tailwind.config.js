/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aubergine: {
          DEFAULT: '#292337',
          dark: '#1D1827',
          light: '#383049',
          900: '#14101B',
          800: '#201B2B',
          700: '#292337',
        },
        ivory: {
          DEFAULT: '#F7F5F0',
          light: '#FCFBF9',
          dark: '#EAE6DC',
          border: '#E2DCD0',
        },
        rose: {
          dust: '#D58C96',
          dustDark: '#B8727C',
          dustLight: '#E8ADB5',
        },
        sage: {
          DEFAULT: '#91A997',
          dark: '#76907D',
          light: '#AFC2B4',
          subtle: '#EEF3F0',
        },
        lavender: {
          DEFAULT: '#B8AECF',
          dark: '#9E92B9',
          light: '#D3CCE2',
          subtle: '#F4F2F8',
        },
        graphite: {
          DEFAULT: '#34343C',
          dark: '#222228',
          light: '#4C4C56',
        }
      },
      fontFamily: {
        devanagari: ['"Noto Sans Devanagari"', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        mono: ['Fira Code', 'monospace'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px rgba(41, 35, 55, 0.05)',
        'soft-md': '0 4px 18px rgba(41, 35, 55, 0.08)',
        'soft-lg': '0 12px 30px rgba(41, 35, 55, 0.12)',
        'aubergine-glow': '0 0 20px rgba(41, 35, 55, 0.25)',
        'sage-glow': '0 0 16px rgba(145, 169, 151, 0.35)',
      },
      animation: {
        'subtle-pulse': 'subtlePulse 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.35s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
      },
      keyframes: {
        subtlePulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
