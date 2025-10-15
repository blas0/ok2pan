import type { Config } from 'tailwindcss';
import { heroui } from '@heroui/react';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '16': 'repeat(16, minmax(0, 1fr))',
        '20': 'repeat(20, minmax(0, 1fr))',
        '24': 'repeat(24, minmax(0, 1fr))',
      },
      fontFamily: {
        'lexend': ['Lexend', 'sans-serif'],
        'geist-mono': ['Geist Mono', 'monospace'],
      }
    },
  },
  darkMode: 'class',
  plugins: [heroui()],
} satisfies Config;
