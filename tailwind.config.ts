import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      colors: {
        'caribbean-teal': '#00CED1',
        'sunset-coral': '#FF6F61',
        'golden-sand': '#F4A460',
        'deep-navy': '#1A2A3A',
        'slate-gray': '#4A5568',
        'light-gray': '#E2E8F0',
        'cloud-white': '#F8F9FA',
        'success': '#2ECC71',
        'warning': '#F39C12',
        'error': '#E74C3C',
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;