import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        'gunmetal': '#30343f',
        'ghost-white': '#fafaff',
        'periwinkle': '#e4d9ff',
        'delft-blue': '#273469',
        'space-cadet': '#1e2749',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(#30343fff, #fafaffff, #e4d9ffff, #273469ff, #1e2749ff)',
        'gradient-top': 'linear-gradient(0deg, #30343fff, #fafaffff, #e4d9ffff, #273469ff, #1e2749ff)',
        'gradient-right': 'linear-gradient(90deg, #30343fff, #fafaffff, #e4d9ffff, #273469ff, #1e2749ff)',
        'gradient-bottom': 'linear-gradient(180deg, #30343fff, #fafaffff, #e4d9ffff, #273469ff, #1e2749ff)',
        'gradient-left': 'linear-gradient(270deg, #30343fff, #fafaffff, #e4d9ffff, #273469ff, #1e2749ff)',
        'gradient-top-right': 'linear-gradient(45deg, #30343fff, #fafaffff, #e4d9ffff, #273469ff, #1e2749ff)',
        'gradient-bottom-right': 'linear-gradient(135deg, #30343fff, #fafaffff, #e4d9ffff, #273469ff, #1e2749ff)',
        'gradient-top-left': 'linear-gradient(225deg, #30343fff, #fafaffff, #e4d9ffff, #273469ff, #1e2749ff)',
        'gradient-bottom-left': 'linear-gradient(315deg, #30343fff, #fafaffff, #e4d9ffff, #273469ff, #1e2749ff)',
      },
      fontFamily: {
        'space-grotesk': ['var(--font-space-grotesk)'],
        'geist-sans': ['var(--font-geist-sans)'],
        'geist-mono': ['var(--font-geist-mono)'],
        'roboto-mono': ['var(--font-roboto-mono)'],
      },
    },
  },
  plugins: [],
};

export default config; 