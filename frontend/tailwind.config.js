import daisyui from 'daisyui';

/** @type {import {"tailwindcss"}.config} */
export default{content: [
    './src/**/*.{js,jsx,ts,tsx}',  // Make sure this matches your file structure
    './public/index.html',  // Include HTML files
  ],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui,
  ],
};
