/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette
        gunmetal: '#30343f',
        'ghost-white': '#fafaff',
        periwinkle: '#e4d9ff',
        'delft-blue': '#273469',
        'space-cadet': '#1e2749',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      gridTemplateColumns: {
        'editor': '1fr 1fr',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        // Custom gradients from the palette
        "gradient-primary": "linear-gradient(45deg, #273469, #1e2749)",
        "gradient-accent": "linear-gradient(135deg, #e4d9ff, #fafaff)",
      },
    },
  },
  plugins: [],
}
