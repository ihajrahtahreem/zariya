/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        zariya: {
          50:  '#fdf4f0',
          100: '#fbe6dc',
          200: '#f6ccb9',
          300: '#eeaa8e',
          400: '#e47d5e',
          500: '#d95a38',
          600: '#c0432a',
          700: '#9f3324',
          800: '#832c22',
          900: '#6c2720',
        },
        sage: {
          50:  '#f3f7f3',
          100: '#e4ede4',
          200: '#c8dbc8',
          300: '#9fc09f',
          400: '#729f72',
          500: '#4f7e4f',
          600: '#3c633c',
          700: '#314f31',
          800: '#293f29',
          900: '#223422',
        },
        blush: {
          50:  '#fef7f5',
          100: '#fde8e3',
          200: '#fbd1c8',
          300: '#f7b0a3',
          400: '#f18271',
          500: '#e75e4a',
          600: '#d44030',
          700: '#b13326',
          800: '#912d23',
          900: '#782b22',
        },
        cream: {
          50:  '#fefdfb',
          100: '#fdf9f3',
          200: '#faf1e4',
          300: '#f5e5cc',
          400: '#eed3ad',
          500: '#e4be8a',
          600: '#d5a265',
          700: '#c08848',
          800: '#a0703a',
          900: '#835c30',
        },
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'glow-bad': 'glowBad 1.5s ease-in-out infinite',
        'glow-good': 'glowGood 3s ease-in-out infinite',
      },
      keyframes: {
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        glowBad: {
          '0%, 100%': { boxShadow: '0 0 8px 2px rgba(239, 68, 68, 0.4)' },
          '50%': { boxShadow: '0 0 24px 8px rgba(239, 68, 68, 0.7)' },
        },
        glowGood: {
          '0%, 100%': { boxShadow: '0 0 8px 2px rgba(79, 126, 79, 0.3)' },
          '50%': { boxShadow: '0 0 20px 6px rgba(79, 126, 79, 0.5)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
