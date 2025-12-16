# API & Routing

## Routing Architecture

### Current Implementation

OK2PAN is a **Single Page Application (SPA)** with minimal routing requirements.

**React Router DOM**: 7.9.4 (installed but not actively used)

### Application State

Currently, the application uses component-level state management without URL-based routing:

```javascript
// App.jsx - Conditional rendering without routes
const [showHero, setShowHero] = useState(true);
const [showConverter, setShowConverter] = useState(false);

if (showHero) {
  return <AnimatedHero onComplete={handleHeroComplete} />;
}

return <ConverterContent />;
```

### Future Routing Pattern

If routing is needed, follow this pattern:

```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ConverterPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Route Structure Recommendations

If expanding to multi-page:

```
/                 - Main OKLCH converter
/gallery          - Pantone color gallery (currently hidden)
/about            - Project information, color science explanation
/docs             - Documentation or help
```

## API Architecture

### Current Implementation

**No Backend API** - The application is entirely client-side.

### Data Sources

#### Static JSON Data
```javascript
// colors.json - Bundled at build time
import colorsData from './colors.json';

// Available immediately, no async loading
const colors = colorsData;  // 2,369 Pantone colors
```

**Data Format**:
```json
{
  "name": "Yellow 012 C",
  "rgb": "rgb(255, 215, 0)",
  "r": 255,
  "g": 215,
  "b": 0
}
```

**Size**: 242KB
**Count**: 2,369 colors

### Client-Side "API"

All color processing happens client-side via utility functions:

#### Color Matching API (`utils/colorMatching.js`)

```javascript
// Find nearest Pantone colors
const matches = findNearestPantoneColors(
  oklchColor,      // { mode: 'oklch', l, c, h }
  pantoneColors,   // Array of Pantone colors
  5,               // Number of matches to return
  {
    useFastMode: false,
    filterSize: 50
  }
);

// Returns array of match objects with quality classification
```

#### Color Conversion API

```javascript
import { 
  oklchToCSS,
  oklchToRgb,
  oklchToHex,
  calculateColorDistance,
  calculateColorDistanceFast 
} from './utils/colorMatching';

// Convert OKLCH to various formats
const css = oklchToCSS(0.65, 0.15, 180);    // "oklch(65.0% 0.150 180.0)"
const rgb = oklchToRgb(0.65, 0.15, 180);    // "rgb(0, 171, 147)"
const hex = oklchToHex(0.65, 0.15, 180);    // "#00ab93"

// Calculate color differences
const deltaE = calculateColorDistance(color1, color2);      // DeltaE 2000
const distance = calculateColorDistanceFast(color1, color2); // OKLab Euclidean
```

### Future Backend Integration

If implementing a backend:

#### Recommended Structure
```
API Endpoints (if added):
  GET  /api/colors              - Fetch Pantone color database
  POST /api/match               - Submit OKLCH, get matches
  GET  /api/colors/:id          - Get specific Pantone color
  POST /api/acb/generate        - Generate ACB file server-side
```

#### Example Implementation Pattern
```javascript
// API service module
export async function fetchPantoneColors() {
  const response = await fetch('/api/colors');
  if (!response.ok) throw new Error('Failed to fetch colors');
  return response.json();
}

export async function findMatches(oklchColor) {
  const response = await fetch('/api/match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(oklchColor)
  });
  if (!response.ok) throw new Error('Failed to match colors');
  return response.json();
}

// Component usage
const [colors, setColors] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchPantoneColors()
    .then(setColors)
    .finally(() => setLoading(false));
}, []);
```

## File Generation API

### ACB Generator (Node.js Script)

**Current Implementation**: Standalone script, not part of web app

```bash
node generate-acb.js
```

**Process**:
1. Reads `colors.json`
2. Converts RGB → LAB (D50)
3. Encodes to Adobe Color Book format
4. Writes `Pantone-LAB.acb` file

**Future**: Could be exposed as web API endpoint for on-demand generation

```javascript
// Potential future endpoint
POST /api/acb/generate
Body: { colors: [...], title: "Custom Book" }
Response: Binary .acb file download
```

## State Management API

### Component State

All state is managed via React hooks at component level:

```javascript
// OklchPicker.jsx
const [lightness, setLightness] = useState(0.65);
const [chroma, setChroma] = useState(0.15);
const [hue, setHue] = useState(180);

// Computed state
const nearestColors = useMemo(() => {
  return findNearestPantoneColors(...);
}, [lightness, chroma, hue, pantoneColors]);
```

### No Global State Manager

The application doesn't use Redux, MobX, or similar because:
- Limited shared state requirements
- Single-page application
- Component tree is shallow
- Props drilling is minimal

### If Global State Needed

For future expansion, consider:

**Option 1: React Context**
```javascript
const ColorContext = createContext();

function ColorProvider({ children }) {
  const [pantoneColors, setPantoneColors] = useState([]);
  const [settings, setSettings] = useState({});
  
  return (
    <ColorContext.Provider value={{ pantoneColors, settings }}>
      {children}
    </ColorContext.Provider>
  );
}

// Usage
const { pantoneColors } = useContext(ColorContext);
```

**Option 2: Zustand (lightweight state manager)**
```javascript
import create from 'zustand';

const useColorStore = create((set) => ({
  colors: [],
  setColors: (colors) => set({ colors }),
  
  oklch: { l: 0.65, c: 0.15, h: 180 },
  setOklch: (oklch) => set({ oklch })
}));

// Usage
const { colors, oklch } = useColorStore();
```

## Browser APIs

### Currently Used

#### Canvas API (potential)
Not currently used, but could be leveraged for:
- Color extraction from images
- Visual color palettes
- Custom color space rendering

#### Local Storage
Not currently used, but could store:
- User color preferences
- Recent color searches
- Favorite Pantone colors

**Pattern**:
```javascript
// Save OKLCH to localStorage
localStorage.setItem('savedColor', JSON.stringify({ l, c, h }));

// Load on mount
const saved = JSON.parse(localStorage.getItem('savedColor'));
if (saved) {
  setLightness(saved.l);
  setChroma(saved.c);
  setHue(saved.h);
}
```

#### File Download API
Used in ACB generator (Node.js):
```javascript
import { writeFileSync } from 'fs';
writeFileSync('Pantone-LAB.acb', buffer);
```

For browser-based download:
```javascript
function downloadACB(buffer, filename) {
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
```

## Third-Party Integration APIs

### Culori Color Library
Primary color science API:

```javascript
import { 
  converter,
  parse,
  formatRgb,
  formatHex,
  differenceEuclidean,
  differenceCiede2000 
} from 'culori';

// Create converters
const toOklch = converter('oklch');
const toRgb = converter('rgb');
const toLab = converter('lab');

// Parse any color format
const color = parse('#00ab93');
const oklch = toOklch(color);

// Calculate differences
const deltaE2000 = differenceCiede2000();
const difference = deltaE2000(color1, color2);
```

**Documentation**: https://culorjs.org/

### @atesgoral/acb Library
Adobe Color Book file generation:

```javascript
import { encodeAcb } from '@atesgoral/acb';

const colorBook = {
  id: 5000,
  title: 'Pantone Colors',
  colorModel: 'Lab',
  colors: [
    { name: 'Color Name', code: 'CODE01', components: [L, a, b] }
  ]
};

const buffer = Buffer.concat([...encodeAcb(colorBook)]);
```

## CORS & Security

### Current Setup
- **No CORS issues**: Client-side only, no API calls
- **No authentication**: Public, read-only application
- **No user data**: No personal information collected

### If Adding Backend
```javascript
// Express CORS middleware
import cors from 'cors';

app.use(cors({
  origin: ['https://ok2pan.com', 'http://localhost:5173'],
  methods: ['GET', 'POST'],
  credentials: false
}));
```

### CSP Headers (for production)
```
Content-Security-Policy: 
  default-src 'self';
  style-src 'self' 'unsafe-inline';
  script-src 'self';
  img-src 'self' data:;
```

## Error Handling Patterns

### Client-Side Error Handling
```javascript
// Color parsing with fallback
const handleColorInput = (colorString) => {
  try {
    const parsed = parse(colorString);
    if (parsed) {
      updateOklchState(parsed);
    }
  } catch (error) {
    console.error('Failed to parse color:', error);
    // Optionally show user feedback
  }
};
```

### Future API Error Handling
```javascript
async function fetchWithErrorHandling(url) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    // Show user-friendly error message
    throw error;
  }
}
```

---

See [application-architecture.md](../core/application-architecture.md) for overall architecture and [frontend-patterns.md](frontend-patterns.md) for React patterns.
