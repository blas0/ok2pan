# Development Workflow

## Initial Setup

### Prerequisites
- **Node.js**: v16 or higher
- **npm**: Comes with Node.js
- **Git**: For version control
- **Modern Browser**: Chrome, Firefox, Safari, or Edge (latest versions)

### Installation

```bash
# Clone the repository
git clone https://github.com/blas0/ok2pan.git
cd ok2pan

# Navigate to the application directory
cd pantone-app

# Install dependencies
npm install
```

## Development Commands

### Start Development Server
```bash
cd pantone-app
npm run dev
```

- Starts Vite dev server on `http://localhost:5173`
- Hot Module Replacement (HMR) enabled
- Fast refresh for React components
- Opens automatically in default browser

### Linting
```bash
npm run lint
```

- Runs ESLint on all source files
- Checks for code quality issues
- Enforces React Hooks rules
- Validates React Refresh patterns

### Build for Production
```bash
npm run build
```

- Creates optimized production build in `dist/` directory
- Minifies JavaScript and CSS
- Optimizes assets
- Tree-shakes unused code
- Generates source maps

### Preview Production Build
```bash
npm run preview
```

- Serves the production build locally
- Tests production optimizations
- Verifies build output before deployment

### Generate Adobe Color Book
```bash
cd pantone-app
node generate-acb.js
```

- Reads `colors.json` (2,369 Pantone colors)
- Converts RGB to LAB (D50 illuminant)
- Creates `Pantone-LAB.acb` file
- Output compatible with Adobe Photoshop, Illustrator, InDesign

## Project Structure

### Main Application
```
pantone-app/
├── src/                    # Source code
│   ├── App.jsx             # Main component
│   ├── main.jsx            # Entry point
│   ├── components/         # React components
│   ├── utils/              # Utility functions
│   └── colors.json         # Pantone color database
├── public/                 # Static assets
├── dist/                   # Production build (generated)
└── package.json            # Dependencies and scripts
```

### Configuration Files
- **vite.config.js**: Vite build configuration
- **tailwind.config.js**: Tailwind CSS customization (if exists)
- **postcss.config.js**: PostCSS plugins
- **eslint.config.js**: ESLint rules

### Documentation
- **.ai/**: AI agent documentation (you are here)
- **.claude/**: Claude memory system
- **docs/**: Legacy documentation
- **olddoccontext/**: Archived documentation
- **README.md**: Project overview

## Development Workflow

### Feature Development
1. **Create a feature branch**:
   ```bash
   git checkout -b feat/feature-name
   ```

2. **Start dev server**:
   ```bash
   npm run dev
   ```

3. **Make changes with hot reload**:
   - Edit source files in `src/`
   - Changes appear instantly in browser
   - React components update without full page reload

4. **Test your changes**:
   - Manually test in browser
   - Verify color matching accuracy
   - Check responsive design

5. **Lint your code**:
   ```bash
   npm run lint
   ```

6. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add feature description"
   ```

### Bug Fixes
1. **Create a fix branch**:
   ```bash
   git checkout -b fix/bug-description
   ```

2. **Reproduce the bug**: Identify the issue

3. **Fix and test**: Verify the fix works

4. **Commit**:
   ```bash
   git commit -m "fix: description of the bug fix"
   ```

### Conventional Commits
Use conventional commit format:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `chore:` Maintenance tasks
- `test:` Adding tests

## Common Development Tasks

### Adding a New Component
1. Create component file in `src/components/`:
   ```javascript
   // src/components/MyComponent.jsx
   import { Card, CardBody } from '@heroui/react';
   
   function MyComponent({ prop1, prop2 }) {
     return (
       <Card>
         <CardBody>
           {/* Component content */}
         </CardBody>
       </Card>
     );
   }
   
   export default MyComponent;
   ```

2. Import in parent component:
   ```javascript
   import MyComponent from './components/MyComponent';
   ```

3. Use in JSX:
   ```javascript
   <MyComponent prop1={value1} prop2={value2} />
   ```

### Updating Color Database
1. Edit `src/colors.json`
2. Maintain format:
   ```json
   {
     "name": "Color Name",
     "rgb": "rgb(R, G, B)",
     "r": 0-255,
     "g": 0-255,
     "b": 0-255
   }
   ```
3. Re-generate ACB if needed:
   ```bash
   node generate-acb.js
   ```

### Modifying Color Matching Algorithm
1. Edit `src/utils/colorMatching.js`
2. Update relevant functions:
   - `findNearestPantoneColors()` - Main algorithm
   - `calculateColorDistance()` - DeltaE 2000
   - `calculateColorDistanceFast()` - OKLab distance
3. Test with various OKLCH values
4. Verify match quality classifications

### Styling Changes
1. **Global styles**: Edit `src/index.css` (Tailwind directives)
2. **Component styles**: Use Tailwind utility classes in JSX
3. **Tailwind config**: Edit `tailwind.config.js` for theme customization

### Adding Dependencies
```bash
# Add production dependency
npm install package-name

# Add development dependency
npm install --save-dev package-name
```

Update `package.json` manually or via npm commands.

## Testing Strategy

### Manual Testing Checklist
- [ ] OKLCH sliders update color preview in real-time
- [ ] Color input fields accept and parse various formats (OKLCH, Hex, RGB)
- [ ] Top 5 Pantone matches display correctly
- [ ] DeltaE values are reasonable (0-5 for good matches)
- [ ] Quality badges match DeltaE thresholds
- [ ] Side-by-side comparison shows correct colors
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] Dark mode displays correctly
- [ ] Animations are smooth
- [ ] Hero animation completes and transitions properly

### Browser Testing
Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Performance Testing
- [ ] Initial load < 2 seconds
- [ ] Color matching updates < 100ms
- [ ] No lag when dragging sliders
- [ ] Smooth animations

## Troubleshooting

### Dev Server Won't Start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### HMR Not Working
- Check browser console for errors
- Restart dev server
- Clear browser cache

### Build Fails
```bash
# Check for linting errors
npm run lint

# Fix errors and rebuild
npm run build
```

### Color Matching Seems Off
- Verify colors.json format
- Check Culori version compatibility
- Test with known color values
- Compare with online color converters

## Deployment

### Static Hosting (Recommended)
1. Build the app:
   ```bash
   npm run build
   ```

2. Deploy `dist/` folder to:
   - **Vercel**: `vercel deploy`
   - **Netlify**: Drag and drop `dist/` folder
   - **GitHub Pages**: Push `dist/` to gh-pages branch
   - **AWS S3**: Upload `dist/` contents

### Configuration
- Set base path in `vite.config.js` if deploying to subdirectory
- Configure CORS if needed (currently not required)

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd pantone-app && npm install
      - run: cd pantone-app && npm run lint
      - run: cd pantone-app && npm run build
```

## Code Quality Tools

### ESLint Configuration
- **React Hooks**: Enforces rules of hooks
- **React Refresh**: Validates fast refresh patterns
- **ES2020+**: Modern JavaScript syntax

### Formatting
- Consider adding Prettier for consistent formatting:
  ```bash
  npm install --save-dev prettier
  ```

## Performance Optimization

### Bundle Analysis
```bash
# Install bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Add to vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  plugins: [react(), visualizer()]
}

# Build and view report
npm run build
```

### Code Splitting
- Currently single bundle (acceptable for SPA size)
- Consider lazy loading if adding more features:
  ```javascript
  const LazyComponent = lazy(() => import('./components/Heavy'));
  ```

## Version Control

### Branch Strategy
- **main**: Production-ready code
- **feat/**: Feature branches
- **fix/**: Bug fix branches
- **docs/**: Documentation updates

### Pull Request Workflow
1. Create feature branch
2. Make changes
3. Run lint and build
4. Commit with conventional commits
5. Push to remote
6. Create PR with description
7. Review and merge

---

See [testing-patterns.md](testing-patterns.md) for testing strategies and [technology-stack.md](../core/technology-stack.md) for version information.
