/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [
      function({ addUtilities }) {
        addUtilities({
          '.no-scrollbar::-webkit-scrollbar': {
            'display': 'none',
          },
          '.no-scrollbar': {
            '-ms-overflow-style': 'none',  /* IE and Edge */
            'scrollbar-width': 'none',  /* Firefox */
          }
        });
      }
    ],
  }
