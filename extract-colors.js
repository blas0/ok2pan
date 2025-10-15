const fs = require('fs');

const html = fs.readFileSync('pantone.html', 'utf8');

// Extract all color entries
const colorRegex = /data-testid="grid-chip-([^"]+)"[^>]*background-color:\s*rgb\((\d+),\s*(\d+),\s*(\d+)\)/g;
const colors = [];

let match;
while ((match = colorRegex.exec(html)) !== null) {
  const [, name, r, g, b] = match;
  colors.push({
    name: name,
    rgb: `rgb(${r}, ${g}, ${b})`,
    r: parseInt(r),
    g: parseInt(g),
    b: parseInt(b)
  });
}

console.log(`Extracted ${colors.length} colors`);

// Save to JSON file
fs.writeFileSync('colors.json', JSON.stringify(colors, null, 2));
console.log('Colors saved to colors.json');
