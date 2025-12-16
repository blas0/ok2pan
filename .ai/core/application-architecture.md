# Application Architecture

## System Overview

OK2PAN is a client-side Single Page Application (SPA) built with React 19. The architecture follows a component-based design with clear separation between UI presentation, color science logic, and data management.

```
┌─────────────────────────────────────────────────────────────┐
│                         User Interface                       │
│  ┌───────────────────┐         ┌────────────────────────┐  │
│  │  OklchPicker      │────────▶│  NearestColors         │  │
│  │  (Color Input)    │         │  (Match Results)       │  │
│  └───────────────────┘         └────────────────────────┘  │
│           │                                  │              │
│           │                                  │              │
│           ▼                                  ▼              │
│  ┌───────────────────────────────────────────────────────┐ │
│  │          Color Matching Algorithm (Culori)             │ │
│  │  Phase 1: OKLab Fast Filter                            │ │
│  │  Phase 2: DeltaE 2000 Precision Ranking                │ │
│  │  Phase 3: Quality Classification                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                            │                                │
│                            ▼                                │
│                  ┌──────────────────┐                       │
│                  │  Pantone Colors  │                       │
│                  │  (colors.json)   │                       │
│                  │  2,369 colors    │                       │
│                  └──────────────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
ok2pan/
├── pantone-app/                  # Main React application
│   ├── src/
│   │   ├── App.jsx               # Main application component
│   │   ├── main.jsx              # Application entry point
│   │   ├── index.css             # Global styles (Tailwind)
│   │   ├── App.css               # Component-specific styles
│   │   ├── colors.json           # Pantone color database (2,369 colors)
│   │   ├── components/
│   │   │   ├── OklchPicker.jsx   # OKLCH color picker with sliders
│   │   │   ├── NearestColors.jsx # Match results display
│   │   │   └── AnimatedHero.jsx  # Entry animation component
│   │   ├── utils/
│   │   │   └── colorMatching.js  # Color science algorithms
│   │   ├── pages/                # Future routing pages (if needed)
│   │   └── assets/               # Static assets (logos, images)
│   ├── public/
│   │   ├── ok2pan.svg            # Application logo
│   │   └── ...                   # Other static files
│   ├── generate-acb.js           # Adobe Color Book (.acb) generator script
│   ├── package.json              # Dependencies and scripts
│   ├── vite.config.js            # Vite build configuration
│   ├── tailwind.config.js        # Tailwind CSS configuration
│   ├── postcss.config.js         # PostCSS configuration
│   └── eslint.config.js          # ESLint configuration
├── .ai/                          # AI agent documentation
├── .claude/                      # Claude memory system
├── docs/                         # Legacy documentation
├── olddoccontext/                # Archived old documentation
└── README.md                     # Project README
```

## Core Components

### App.jsx
**Purpose**: Main application orchestrator

**Responsibilities**:
- Manages hero animation state
- Provides color data to child components
- Handles initial page load sequence
- Orchestrates blur-to-fade entry animation

**Key Features**:
- Conditional rendering (hero → converter)
- Anime.js integration for smooth transitions
- Optional gallery view (currently hidden)

### OklchPicker.jsx
**Purpose**: Interactive OKLCH color picker

**State Management**:
```javascript
[lightness, setLightness]  // 0-1 (0% to 100%)
[chroma, setChroma]        // 0-0.4 typical range
[hue, setHue]              // 0-360 degrees
```

**Key Features**:
- Three HeroUI sliders for L, C, H values
- Real-time color preview with live updates
- Multi-format input (OKLCH, Hex, RGB)
- Editable color values (click to edit)
- Automatic color conversion via Culori
- Memoized color matching for performance

**Data Flow**:
```
User Input → OKLCH State → Color Matching → Nearest Colors
```

### NearestColors.jsx
**Purpose**: Display color match results

**Props Received**:
- `nearestColors`: Array of top 5 matches with quality data
- `targetColor`: User's input color for comparison

**Visual Elements**:
- Side-by-side comparison (input vs best match)
- Top 5 ranked results with quality badges
- DeltaE values and match percentages
- Color swatches with tooltips
- Progress bars for visual quality indication

### AnimatedHero.jsx
**Purpose**: Entry animation component

**Behavior**:
- Displays on initial app load
- Animated sequence (implementation details in component)
- Calls `onComplete` callback when finished
- Unmounts after animation

## Data Models

### Pantone Color Object (colors.json)
```javascript
{
  "name": "Yellow 012 C",     // Pantone color name
  "rgb": "rgb(255, 215, 0)",  // CSS RGB string
  "r": 255,                    // Red (0-255)
  "g": 215,                    // Green (0-255)
  "b": 0                       // Blue (0-255)
}
```

**Size**: 242KB for 2,369 colors
**Loading**: Bundled at build time, loaded with app

### OKLCH Color Object (Internal)
```javascript
{
  mode: 'oklch',
  l: 0.65,      // Lightness (0-1)
  c: 0.15,      // Chroma (0-0.4 typical)
  h: 180        // Hue (0-360)
}
```

### Color Match Result Object
```javascript
{
  name: "PANTONE 320 C",           // Pantone name
  rgb: "rgb(0, 171, 147)",         // RGB string
  r: 0, g: 171, b: 147,            // RGB components
  distance: 1.42,                   // DeltaE 2000 value
  deltaE: 1.42,                     // Alias for clarity
  quality: "EXCELLENT",             // Quality tier key
  qualityLabel: "Excellent Match",  // Display label
  qualityIcon: "🎯",               // Visual indicator
  qualityColor: "#22c55e",         // Badge color
  qualityDescription: "...",        // Full description
  similarity: 85.8,                 // 0-100% score
  matchPercentage: 71.6            // Perceptual match %
}
```

## Service Layer

### Color Matching Module (`utils/colorMatching.js`)

**Core Functions**:

#### `findNearestPantoneColors(oklchColor, pantoneColors, count, options)`
Hybrid three-phase color matching algorithm:

**Phase 1 - Fast Filter**:
- Converts OKLCH to OKLab
- Calculates Euclidean distance for all 2,369 colors
- Filters to top 50 candidates
- ~3-4x faster than DeltaE 2000

**Phase 2 - Precise Ranking**:
- Applies CIEDE2000 to top candidates
- Industry-standard professional accuracy
- Corrects for perceptual non-uniformities

**Phase 3 - Quality Classification**:
- Maps DeltaE to ISO quality standards
- Adds match percentages and visual indicators
- Returns top N matches with full metadata

**Options**:
```javascript
{
  useFastMode: false,     // Skip Phase 2 (faster, ~95% accuracy)
  filterSize: 50          // Number of candidates for refinement
}
```

#### `calculateColorDistance(color1, color2)`
- Uses CIEDE2000 (DeltaE 2000) algorithm
- Industry-standard for professional color matching
- Returns perceptual color difference (0 = identical, >5 = very different)

#### `calculateColorDistanceFast(color1, color2)`
- Uses OKLab Euclidean distance
- 3-4x faster than DeltaE 2000
- 90-95% accuracy, ideal for filtering

#### Color Conversion Utilities
- `oklchToCSS(l, c, h)` → CSS oklch() string
- `oklchToRgb(l, c, h)` → RGB string
- `oklchToHex(l, c, h)` → Hex string

#### Quality Classification
```javascript
MATCH_QUALITY = {
  EXCELLENT: { max: 1.0, label, description, icon: '🎯', color: '#22c55e' },
  GOOD:      { max: 2.0, label, description, icon: '✅', color: '#84cc16' },
  ACCEPTABLE:{ max: 3.0, label, description, icon: '⚠️', color: '#eab308' },
  FAIR:      { max: 5.0, label, description, icon: '⚡', color: '#f97316' },
  POOR:      { max: ∞,   label, description, icon: '❌', color: '#ef4444' }
}
```

Based on ISO 13655 professional printing tolerances.

## Build & Generation Tools

### ACB Generator (`generate-acb.js`)

**Purpose**: Create Adobe Color Book (.acb) files from Pantone colors

**Process**:
1. Reads `colors.json` (2,369 Pantone colors)
2. Converts RGB to LAB (D50 illuminant for Adobe compatibility)
3. Formats for @atesgoral/acb library:
   - L: 0-100 range
   - a: -128 to 127 range
   - b: -128 to 127 range
4. Creates ACB color book structure:
   ```javascript
   {
     id: 5000,
     title: 'Pantone Colors (LAB)',
     description: '...',
     pageSize: 9,
     colorModel: 'Lab',
     colors: [...]
   }
   ```
5. Encodes to binary ACB format
6. Writes `Pantone-LAB.acb` file

**Usage**:
```bash
cd pantone-app
node generate-acb.js
```

**Output**: `Pantone-LAB.acb` - Importable into Adobe applications

## State Management

**Approach**: Component-level state with React hooks

**No Global State Manager**: The application is simple enough that React's built-in state management (`useState`, `useMemo`) is sufficient.

**State Location**:
- **OklchPicker**: OKLCH values (L, C, H)
- **App**: Hero animation visibility state
- **NearestColors**: Stateless presentation component

**Optimization**:
- `useMemo` for expensive color matching calculations
- Prevents re-calculation unless OKLCH values change

## Performance Considerations

### Color Matching Optimization
- **Hybrid Algorithm**: OKLab filter reduces DeltaE 2000 calls by 98%
- **Memoization**: Color matching only recalculates when inputs change
- **Efficient Data Structure**: Pantone colors pre-parsed at load time

### Bundle Size
- **colors.json**: 242KB (largest asset)
- **Tree Shaking**: Vite eliminates unused code
- **Code Splitting**: Currently single bundle (SPA is small enough)

### Runtime Performance
- **Single Page Load**: No routing or page transitions
- **Client-Side Only**: No server round-trips for color calculations
- **Static Assets**: colors.json cached after first load

## Color Space Architecture

### Supported Color Spaces

**Primary Input**: OKLCH (CSS Color Level 4)
- Perceptually uniform
- Designed for digital displays
- Natural for UI designers

**Internal Processing**: OKLab
- Perceptually uniform
- Euclidean distance works correctly
- Fast calculations

**Output/Display**: RGB (sRGB)
- Standard web display
- Pantone color database format

**Adobe Integration**: LAB (D50)
- Adobe standard illuminant
- Professional color accuracy
- ACB file generation

### Conversion Flow
```
User Input (OKLCH) → OKLab (filtering) → RGB (display)
                    ↓
               DeltaE 2000 (precision)
                    ↓
            Pantone RGB ← LAB (Adobe output)
```

## Error Handling

### Color Conversion Errors
- Invalid OKLCH values return fallback colors (#000000)
- Out-of-gamut colors handled by Culori automatically
- Parse failures logged to console

### Data Validation
- Pantone colors filtered if RGB parsing fails
- `null` pantoneRgb objects excluded from matching

### UI Resilience
- Empty match results show "No matching colors found"
- Input validation on color value edits

## Extension Points

### Adding New Color Spaces
1. Add converter in `colorMatching.js`
2. Update UI inputs in `OklchPicker.jsx`
3. Add conversion utilities

### Expanding Pantone Database
1. Update `colors.json` with new colors
2. No code changes required
3. Re-generate ACB file if needed

### Alternative Matching Algorithms
- Modify `findNearestPantoneColors()` options
- Add new distance functions to `colorMatching.js`

---

See [technology-stack.md](technology-stack.md) for version details and [frontend-patterns.md](../patterns/frontend-patterns.md) for React patterns.
