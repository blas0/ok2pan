# Frontend Patterns

## React Component Patterns

### Component Structure

#### Functional Components with Hooks
All components use functional component pattern with React hooks:

```javascript
import { useState, useMemo } from 'react';

function ComponentName({ prop1, prop2 }) {
  // State declarations
  const [state, setState] = useState(initialValue);
  
  // Computed values with memoization
  const computedValue = useMemo(() => {
    return expensiveCalculation(state);
  }, [state]);
  
  // Event handlers
  const handleEvent = (e) => {
    // Handler logic
  };
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}

export default ComponentName;
```

#### Component Organization
**Pattern**: Co-locate related logic
- State near the top
- Memoized values after state
- Event handlers before render
- Return JSX at the bottom

### State Management

#### Local Component State
Use `useState` for component-specific state:

```javascript
// OklchPicker.jsx example
const [lightness, setLightness] = useState(0.65);  // Default 65%
const [chroma, setChroma] = useState(0.15);        // Default 0.15
const [hue, setHue] = useState(180);               // Default 180°
```

**When to use**:
- UI state (form inputs, toggles, etc.)
- Component-specific values
- No need to share with siblings

#### Computed State with useMemo
Use `useMemo` for expensive calculations:

```javascript
// Recalculate only when dependencies change
const nearestColors = useMemo(() => {
  return findNearestPantoneColors(
    { mode: 'oklch', l: lightness, c: chroma, h: hue },
    pantoneColors,
    5
  );
}, [lightness, chroma, hue, pantoneColors]);
```

**When to use**:
- Expensive computations (color matching, filtering)
- Derived state from multiple sources
- Prevent unnecessary re-renders

**When NOT to use**:
- Simple calculations (string concatenation, basic math)
- Values that change frequently anyway

#### Conditional Rendering State
```javascript
const [showHero, setShowHero] = useState(true);
const [showConverter, setShowConverter] = useState(false);

// Conditional component mounting
if (showHero) {
  return <AnimatedHero onComplete={handleHeroComplete} />;
}

return <ConverterContent />;
```

### Props Patterns

#### Props Destructuring
```javascript
// Clean and explicit
function NearestColors({ nearestColors, targetColor }) {
  // Use props directly without 'props.' prefix
}
```

#### Props with Defaults
```javascript
function findNearestPantoneColors(
  oklchColor,
  pantoneColors,
  count = 5,        // Default parameter
  options = {}      // Default object
) {
  const {
    useFastMode = false,      // Default destructured value
    filterSize = 50
  } = options;
}
```

#### Callback Props
```javascript
// Parent defines handler
function App() {
  const handleHeroComplete = () => {
    setShowHero(false);
    setShowConverter(true);
  };
  
  return <AnimatedHero onComplete={handleHeroComplete} />;
}

// Child calls it
function AnimatedHero({ onComplete }) {
  // When animation finishes
  onComplete();
}
```

## HeroUI Component Library Patterns

### Card Components
```javascript
import { Card, CardHeader, CardBody } from '@heroui/react';

<Card className="shadow-xl">
  <CardHeader className="flex-col items-start px-6 pt-6">
    <h2 className="text-2xl font-bold">Title</h2>
    <p className="text-sm text-gray-600">Subtitle</p>
  </CardHeader>
  <CardBody className="px-6 pb-6">
    {/* Content */}
  </CardBody>
</Card>
```

### Sliders
```javascript
import { Slider } from '@heroui/react';

<Slider
  size="lg"
  step={0.01}
  minValue={0}
  maxValue={1}
  value={lightness}
  onChange={setLightness}
  aria-label="Lightness value"
  classNames={{
    track: "h-3",
    thumb: "w-6 h-6"
  }}
  color="foreground"
/>
```

**Pattern**: Direct state binding
- `value` prop binds to state
- `onChange` prop updates state directly
- No event object wrapping needed

### Tooltips
```javascript
import { Tooltip } from '@heroui/react';

<Tooltip 
  content={color.qualityDescription} 
  placement="top" 
  showArrow
>
  <span className="...">
    Hover me
  </span>
</Tooltip>
```

**Pattern**: Wrap the trigger element
- Content can be string or JSX
- Use `placement` for positioning
- `showArrow` for visual connection

### Chips/Badges
```javascript
import { Chip } from '@heroui/react';

<Chip
  size="sm"
  color="primary"
  variant="flat"
  className="flex-shrink-0"
>
  Best Match
</Chip>
```

## Styling Patterns

### Tailwind CSS Utility Classes
**Pattern**: Compose styles from utilities

```javascript
<div className="
  min-h-screen 
  bg-gradient-to-br 
  from-gray-50 to-gray-100 
  dark:from-gray-900 dark:to-gray-800 
  font-geist-mono
">
```

**Common Patterns**:
- **Responsive**: `sm:` `md:` `lg:` `xl:` `2xl:` prefixes
- **Dark Mode**: `dark:` prefix
- **Hover**: `hover:` prefix
- **Transitions**: `transition-all duration-300`

### Dynamic Inline Styles
Use `style` prop for dynamic values (colors, dimensions):

```javascript
<div
  className="w-full h-32 rounded-xl shadow-lg"
  style={{ backgroundColor: rgbColor }}
/>
```

**When to use inline styles**:
- Dynamic color values
- Calculated dimensions
- Programmatic animations

**When NOT to use**:
- Static values (use Tailwind classes)
- Hover/focus states (use Tailwind pseudo-classes)

### Conditional Classes
```javascript
className={`
  p-4 rounded-xl border-2 transition-all 
  ${index === 0
    ? 'bg-blue-50 border-blue-300'
    : 'bg-gray-50 border-gray-200'
  }
`}
```

**Pattern**: Template literals with ternary operators

### Custom CSS Classes
Global styles in `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom utilities or component styles */
.font-geist-mono {
  font-family: 'Geist Mono', monospace;
}
```

## Color Conversion Patterns

### Culori Integration
```javascript
import { converter, parse } from 'culori';

// Create converters once
const toOklch = converter('oklch');
const toRgb = converter('rgb');
const toLab = converter('lab');

// Convert colors
const oklch = toOklch(rgbColor);
const rgb = toRgb(oklchColor);
```

**Pattern**: Create converters at module level, reuse throughout

### Color Parsing from Input
```javascript
const handleColorInput = (colorString) => {
  try {
    const parsed = parse(colorString);
    if (parsed) {
      const oklch = toOklch(parsed);
      if (oklch && typeof oklch.l === 'number') {
        setLightness(oklch.l);
        setChroma(oklch.c);
        setHue(oklch.h || 0);
      }
    }
  } catch (error) {
    console.error('Failed to parse color:', error);
  }
};
```

**Pattern**: Defensive parsing
- Parse input string
- Validate parsed result
- Check for required properties
- Handle errors gracefully

### Color Format Display
```javascript
// Editable color inputs
<input
  type="text"
  defaultValue={hexColor}
  key={hexColor}  // Force re-render on color change
  onBlur={(e) => handleColorInput(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      handleColorInput(e.target.value);
      e.target.blur();
    }
  }}
  className="..."
/>
```

**Pattern**: Uncontrolled input with key reset
- `defaultValue` for initial value
- `key={value}` to reset on parent change
- `onBlur` to process changes
- `Enter` key to submit and blur

## Animation Patterns

### Anime.js Integration
```javascript
import { animate } from 'animejs';

useEffect(() => {
  if (showConverter && converterRef.current) {
    animate(converterRef.current, {
      opacity: [0, 1],
      filter: ['blur(20px)', 'blur(0px)'],
      ease: 'linear',
      duration: 800
    });
  }
}, [showConverter]);
```

**Pattern**: useEffect for mount animations
- Check element ref exists
- Animate from starting state to ending state
- Use dependency array to trigger on state change

### Framer Motion (via HeroUI)
HeroUI components include Framer Motion animations automatically:

```javascript
// No explicit animation code needed
<Card>  {/* Automatically animates on mount */}
  <CardBody>Content</CardBody>
</Card>
```

### CSS Transitions
```javascript
className="transition-transform hover:scale-110 hover:z-10"
```

**Pattern**: Tailwind transition utilities
- `transition-{property}` defines what animates
- `duration-{time}` sets animation speed
- Pseudo-classes trigger the change

## Data Fetching Patterns

### Static JSON Import
```javascript
import colorsData from './colors.json';

// Use directly - no async needed
const filteredColors = colorsData.filter(...);
```

**Pattern**: Bundle data at build time
- No loading states needed
- Data available immediately
- Suitable for static datasets

### Future: Dynamic Data Loading
If implementing dynamic data:

```javascript
const [colors, setColors] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch('/api/colors')
    .then(res => res.json())
    .then(data => {
      setColors(data);
      setLoading(false);
    });
}, []);

if (loading) return <Spinner />;
```

## Performance Optimization Patterns

### Memoization
**Use Case**: Expensive calculations

```javascript
// GOOD: Memoized color matching
const nearestColors = useMemo(() => {
  return findNearestPantoneColors(oklchColor, pantoneColors, 5);
}, [lightness, chroma, hue, pantoneColors]);

// BAD: Recalculates every render
const nearestColors = findNearestPantoneColors(oklchColor, pantoneColors, 5);
```

### Key Optimization in Lists
```javascript
// GOOD: Stable, unique keys
{nearestColors.map((color, index) => (
  <div key={`${color.name}-${index}`}>
    {color.name}
  </div>
))}

// AVOID: Index-only keys (if list can be reordered)
{colors.map((color, index) => (
  <div key={index}>{color.name}</div>
))}
```

### Conditional Rendering
```javascript
// GOOD: Early return for loading/error states
if (!nearestColors || nearestColors.length === 0) {
  return <EmptyState />;
}

return <ColorResults colors={nearestColors} />;

// AVOID: Nested ternaries
return (
  <div>
    {nearestColors
      ? nearestColors.length > 0
        ? <ColorResults />
        : <EmptyState />
      : <Loading />
    }
  </div>
);
```

## Error Handling Patterns

### Safe Color Conversion
```javascript
export function oklchToRgb(l, c, h) {
  const rgb = toRgb({ mode: 'oklch', l, c, h });
  if (!rgb) return 'rgb(0, 0, 0)';  // Fallback
  
  return formatRgb(rgb);
}
```

**Pattern**: Always provide fallback values
- Check for null/undefined results
- Return sensible defaults
- Prevent UI crashes

### Array Filtering
```javascript
const parsedPantoneColors = pantoneColors
  .map(pantone => {
    const pantoneRgb = parseRgb(pantone.rgb);
    return { ...pantone, pantoneRgb };
  })
  .filter(p => p.pantoneRgb !== null);  // Remove invalid colors
```

**Pattern**: Filter out invalid data before processing

## Accessibility Patterns

### ARIA Labels
```javascript
<Slider
  aria-label="Lightness value"
  value={lightness}
  onChange={setLightness}
/>

<button
  aria-label={color.name}
  style={{ backgroundColor: color.rgb }}
/>
```

**Pattern**: Provide descriptive labels for interactive elements

### Semantic HTML
```javascript
// GOOD: Semantic elements
<h2>Title</h2>
<p>Description</p>
<button onClick={handler}>Click</button>

// AVOID: Div soup
<div className="title">Title</div>
<div className="description">Description</div>
<div onClick={handler}>Click</div>
```

### Keyboard Navigation
```javascript
onKeyDown={(e) => {
  if (e.key === 'Enter') {
    handleColorInput(e.target.value);
    e.target.blur();
  }
}}
```

**Pattern**: Support keyboard interactions (Enter, Escape, Tab, etc.)

## Code Organization

### Module Exports
```javascript
// Named exports for utilities
export function calculateColorDistance(c1, c2) { }
export function oklchToRgb(l, c, h) { }
export const MATCH_QUALITY = { };

// Default export for components
export default OklchPicker;
```

**Pattern**:
- Named exports for utilities and constants
- Default export for main component

### Import Organization
```javascript
// React and hooks
import { useState, useMemo } from 'react';

// Third-party libraries
import { Card, Slider } from '@heroui/react';
import { converter } from 'culori';

// Local utilities
import { findNearestPantoneColors } from '../utils/colorMatching';

// Local components
import NearestColors from './NearestColors';

// Assets
import colorsData from './colors.json';
```

**Pattern**: Group imports by category with blank lines

---

See [application-architecture.md](../core/application-architecture.md) for architecture details and [development-workflow.md](../development/development-workflow.md) for workflows.
