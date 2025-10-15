# Pantone Color Library

A beautiful, interactive color library web application built with React, Vite, and HeroUI that displays 2,369 Pantone colors with live search functionality.

## Features

- **2,369 Pantone Colors**: Complete library of Pantone colors extracted from the source HTML
- **Live Search**: Real-time filtering as you type - search by color name or Pantone code
- **Interactive Tooltips**: Hover over any color to see its Pantone code label
- **Responsive Grid**: Adaptive layout that shows more colors on larger screens
  - Mobile: 6 columns
  - Small: 8 columns
  - Medium: 12 columns
  - Large: 16 columns
  - XL: 20 columns
  - 2XL: 24 columns
- **Smooth Animations**: Hover effects with scale and shadow transitions
- **Hero UI Components**: Beautiful, accessible UI components
- **Dark Mode Support**: Built-in dark mode capability

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **HeroUI** - React UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library (via HeroUI)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

Dependencies are already installed. To run the application:

```bash
npm run dev
```

Open your browser and visit `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The optimized production build will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
pantone-app/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point
│   ├── index.css        # Global styles with Tailwind
│   └── colors.json      # Extracted Pantone color data (2,369 colors)
├── public/              # Static assets
├── index.html           # HTML template
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies and scripts
```

## Component Features

### Search Bar
- HeroUI Input component with clearable functionality
- Large size with bordered variant
- Shadow effect for depth
- Placeholder guidance text
- Real-time filtering with `useMemo` optimization

### Color Grid
- Responsive grid with custom column configurations
- Each color is a square tile (aspect-square)
- Rounded corners for visual appeal
- Smooth hover animations (scale 110% + elevated shadow)
- 1px gap between tiles

### Tooltips
- HeroUI Tooltip component with arrow
- Shows Pantone color name on hover
- Smart positioning (top placement)
- Accessible with proper ARIA labels

### Performance
- `useMemo` hook for optimized filtering
- Only re-filters when search query changes
- Efficient rendering of 2,369+ color tiles

## Color Data Format

Each color in the JSON has the following structure:
```json
{
  "name": "Yellow 012 C",
  "rgb": "rgb(255, 215, 0)",
  "r": 255,
  "g": 215,
  "b": 0
}
```

## Customization

### Changing Grid Columns

Edit `tailwind.config.js` to add more grid configurations:

```javascript
gridTemplateColumns: {
  '16': 'repeat(16, minmax(0, 1fr))',
  '20': 'repeat(20, minmax(0, 1fr))',
  '24': 'repeat(24, minmax(0, 1fr))',
  // Add more as needed
}
```

### Styling

The app uses Tailwind CSS classes. Key styling points:
- Background: Gradient from gray-50 to gray-100 (light) / gray-900 to gray-800 (dark)
- Color tiles: 1px gap with rounded-md corners
- Hover: 110% scale with elevated shadow

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Acknowledgments

- Pantone color data extracted from source HTML
- Built with [HeroUI](https://heroui.com) component library
- Powered by [Vite](https://vitejs.dev) and [React](https://react.dev)
