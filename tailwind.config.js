/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        scrollDown: 'scrollDown 720s linear infinite',
        scrollUp: 'scrollUp 720s linear infinite',
        glow: 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        scrollDown: {
          '0%': { transform: 'translateY(-50%)' },
          '100%': { transform: 'translateY(0)' },
        },
        scrollUp: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.5)' },
        },
      },
      boxShadow: {
        glow: '0 0 10px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.3)',
      },
    },
  },
  variants: {
    extend: {
      scale: ['group-hover'],
      brightness: ['group-hover'],
      boxShadow: ['hover'],
      animation: ['hover'],
      opacity: ['hover'],
    },
  },
  plugins: [],
};