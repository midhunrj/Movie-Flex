import type { Config } from 'tailwindcss';

const config: Config = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#1fb6ff',
        secondary: '#7e5bef',
        accent: '#ff49db',
        warning: '#ff7849',
        success: '#13ce66',
        info: '#ffc82c',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'], // Optional: for movie-like typography
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          '-webkit-overflow-scrolling': 'touch',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
    },
    
  ],
};

export default config;
