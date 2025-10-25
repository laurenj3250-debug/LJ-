/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Soft notebook greys - ethereal and whimsical
        paper: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
        // Soft charcoal for text - like pencil on paper
        ink: {
          50: '#f7f7f7',
          100: '#e3e3e3',
          200: '#c8c8c8',
          300: '#a4a4a4',
          400: '#818181',
          500: '#666666',
          600: '#515151',
          700: '#434343',
          800: '#383838',
          900: '#1a1a1a',
        },
        // Subtle accent for highlights - like a light pencil sketch
        sketch: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#d3d6db',
          300: '#b1b5be',
          400: '#8b91a0',
          500: '#6c7280',
          600: '#565c6a',
          700: '#464b56',
          800: '#393d47',
          900: '#2d3038',
        },
      },
      fontFamily: {
        display: ['Georgia', 'Palatino', 'serif'],
        body: ['Courier New', 'monospace'],
        handwriting: ['Brush Script MT', 'cursive'],
      },
      backgroundImage: {
        'paper-texture': "url('data:image/svg+xml,%3Csvg width=\"200\" height=\"200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"paper\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.04\" numOctaves=\"5\" /%3E%3CfeColorMatrix type=\"saturate\" values=\"0\" /%3E%3C/filter%3E%3Crect width=\"200\" height=\"200\" filter=\"url(%23paper)\" opacity=\"0.03\" /%3E%3C/svg%3E')",
        'line-pattern': "url('data:image/svg+xml,%3Csvg width=\"100%25\" height=\"30\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cline x1=\"0\" y1=\"29\" x2=\"100%25\" y2=\"29\" stroke=\"%23e0e0e0\" stroke-width=\"1\" /%3E%3C/svg%3E')",
      }
    },
  },
  plugins: [],
}
