/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      colors: {
        'inn-brown': '#8B4513',
        'inn-gold': '#FFD700',
        'inn-dark': '#1a1a1a',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

