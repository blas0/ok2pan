# Technology Stack

**SINGLE SOURCE OF TRUTH** for all version numbers and dependencies.

## Overview

| Category | Technology | Version |
|----------|------------|---------|
| Language | JavaScript | ES2020+ |
| Runtime | Node.js | v16+ |
| Framework | React | 19.1.1 |
| Build Tool | Vite | 7.1.7 |
| Styling | Tailwind CSS | 4.1.14 |

## Frontend

### Core Framework
- **React**: 19.1.1
- **React DOM**: 19.1.1
- **React Router DOM**: 7.9.4

### UI Components & Styling
- **HeroUI React**: 2.8.5 - Component library with accessible UI components
- **Tailwind CSS**: 4.1.14 - Utility-first CSS framework
- **PostCSS**: 8.5.6 - CSS transformation tool
- **Autoprefixer**: 10.4.21 - Automatic vendor prefixing

### Animation
- **Framer Motion**: 12.23.24 - Production-ready motion library (via HeroUI)
- **anime.js**: 4.2.2 - JavaScript animation engine

### Color Science & Manipulation
- **Culori**: 4.0.2 - Comprehensive color library with:
  - OKLCH ↔ RGB conversion
  - DeltaE 2000 (CIEDE2000) implementation
  - OKLab Euclidean distance
  - Perceptually uniform color spaces
- **@atesgoral/acb**: 0.4.0 - Adobe Color Book (.acb) file generation

## Development Tools

### Build & Bundling
- **Vite**: 7.1.7 - Next generation frontend tooling
- **@vitejs/plugin-react**: 5.0.4 - Official React plugin for Vite

### Linting & Code Quality
- **ESLint**: 9.36.0 - JavaScript/JSX linting
- **@eslint/js**: 9.36.0 - ESLint JavaScript configs
- **eslint-plugin-react-hooks**: 5.2.0 - React Hooks linting rules
- **eslint-plugin-react-refresh**: 0.4.22 - React Fast Refresh linting

### Type Definitions
- **@types/react**: 19.1.16
- **@types/react-dom**: 19.1.9

### Utilities
- **globals**: 16.4.0 - Global identifiers for ESLint

## Data Assets

### Color Database
- **colors.json**: 242KB static file containing 2,369 Pantone colors
  - Format: `{ name, rgb, r, g, b }`
  - RGB values in 0-255 range
  - Source: Extracted from official Pantone color data

## Infrastructure

### Package Manager
- **npm** - Node Package Manager (version determined by Node.js)

### Module System
- **ES Modules** (ESM) - `"type": "module"` in package.json

## Color Space Standards

### Supported Color Spaces
- **OKLCH** - Primary input format (perceptually uniform)
- **OKLab** - Internal fast filtering (Euclidean distance)
- **LAB (D50)** - Adobe Color Book generation
- **RGB (sRGB)** - Display and Pantone color data
- **Hex** - Web color representation

### Color Matching Algorithms
- **CIEDE2000 (DeltaE 2000)** - Industry-standard perceptual color difference
- **OKLab Euclidean** - Fast perceptual distance for filtering

## Browser Targets

Based on Vite defaults and modern React:
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Modern ES2020+ support required

---

**Note**: All version references across documentation should link back to this file.

**Last Updated**: 2025-12-16
