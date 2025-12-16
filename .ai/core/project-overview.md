# Project Overview

## What This Project Is

**OK2PAN** is a professional-grade OKLCH to Pantone color converter that bridges the digital-to-physical color workflow. It enables designers and developers to find accurate Pantone color matches for modern OKLCH colors using industry-standard color matching algorithms.

The application features an interactive color picker with real-time Pantone matching, powered by perceptual color science and the CIEDE2000 (DeltaE 2000) algorithm used in professional printing and Pantone systems.

## Core Mission

Bridge the gap between modern perceptually uniform digital color spaces (OKLCH) and physical print standardization (Pantone) through professional-grade color matching.

## Key Features

### Color Matching Engine
- **Hybrid Dual-Algorithm Matching**: 
  - Phase 1: Fast OKLab Euclidean filtering (3-4x faster than DeltaE 2000)
  - Phase 2: Precise CIEDE2000 ranking for professional accuracy
  - Phase 3: ISO-standard quality classification (Excellent ≤1, Good ≤2, Acceptable ≤3, Fair ≤5, Poor >5)

- **2,369 Pantone Colors**: Complete color library with LAB-based definitions
- **Real-time Matching**: Instant updates as you adjust OKLCH values
- **Visual Comparison**: Side-by-side preview of input color vs best match

### Interactive OKLCH Picker
- **Three-Slider Control**: Lightness (0-100%), Chroma (0-0.4), Hue (0-360°)
- **Multi-Format Input**: Accepts OKLCH, Hex, or RGB values
- **Live Preview**: Real-time color swatch with automatic format conversion
- **Editable Color Values**: Click any color value to paste/edit

### Color Match Results
- **Top 5 Matches**: Best Pantone matches ranked by perceptual similarity
- **Quality Badges**: Visual indicators (Excellent 🎯, Good ✅, Acceptable ⚠️, Fair ⚡, Poor ❌)
- **DeltaE Values**: Precise numerical color difference measurements
- **Match Percentage**: User-friendly similarity scores (0-100%)
- **Progress Bars**: Visual representation of match quality

### Adobe Integration
- **ACB File Generation**: Creates Adobe Color Book (.acb) files
- **LAB Color Space**: Uses D50 illuminant for Adobe compatibility
- **Professional Workflow**: Import Pantone library directly into Adobe applications

### User Experience
- **Animated Hero**: Smooth entry animation with blur-to-fade effect
- **Responsive Design**: Works on all screen sizes
- **Dark Mode Support**: Full dark theme implementation
- **Accessible UI**: HeroUI components with proper ARIA labels
- **Smooth Transitions**: Framer Motion and anime.js animations

## Target Users

- **Web Designers**: Converting OKLCH colors from design systems to Pantone for print materials
- **UI/UX Designers**: Bridging digital prototypes with physical brand guidelines
- **Brand Agencies**: Ensuring color consistency across digital and physical touchpoints
- **Print Designers**: Finding Pantone equivalents for screen-based colors
- **Developers**: Implementing color systems that work across digital and print media

## Architecture Philosophy

### Perceptual Color Science First
All color matching is based on how humans perceive color, not just mathematical RGB distances. OKLCH and LAB are both perceptually uniform color spaces, enabling accurate conversion despite their different applications (digital vs print).

### Performance Through Smart Algorithms
The hybrid dual-algorithm approach optimizes for both speed and accuracy:
- OKLab for fast filtering of large datasets (90-95% accuracy)
- DeltaE 2000 for precise refinement (industry-standard professional accuracy)

### Single-Page Application
Built as a pure client-side React SPA with:
- No backend required
- Static JSON data source
- Instant color calculations
- Offline-capable after initial load

### Modern Web Standards
Leverages cutting-edge web technologies:
- React 19 for modern component architecture
- Vite for lightning-fast development
- Tailwind CSS 4 for utility-first styling
- OKLCH as the primary color space (CSS Color Level 4)

### Professional-Grade Output
Generates Adobe Color Book files that professional designers can directly import into:
- Adobe Photoshop
- Adobe Illustrator
- Adobe InDesign
- Other applications supporting .acb format

---

See [application-architecture.md](application-architecture.md) for technical details and [technology-stack.md](technology-stack.md) for version information.
