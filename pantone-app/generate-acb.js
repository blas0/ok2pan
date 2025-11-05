import { readFileSync, writeFileSync } from 'fs';
import { converter } from 'culori';
import { encodeAcb } from '@atesgoral/acb';
import { Buffer } from 'buffer';

// Initialize LAB converter
const toLab = converter('lab');

// Read the Pantone colors from JSON
const colorsJson = JSON.parse(
  readFileSync('../colors.json', 'utf-8')
);

console.log(`Processing ${colorsJson.length} Pantone colors...`);

// Convert RGB colors to LAB and format for ACB
const colors = colorsJson.map((color, index) => {
  // Convert RGB (0-255) to culori format (0-1)
  const rgbColor = {
    mode: 'rgb',
    r: color.r / 255,
    g: color.g / 255,
    b: color.b / 255
  };

  // Convert to LAB (D50 illuminant, which Adobe uses)
  const labColor = toLab(rgbColor);

  // LAB values for @atesgoral/acb library:
  // The library expects LAB in their natural ranges and handles encoding internally:
  // - L: 0-100 range (library will encode to byte)
  // - a: -128 to 127 range (library will add 128 offset)
  // - b: -128 to 127 range (library will add 128 offset)
  // Note: Must be integers (int16), so we round the values
  const L = Math.round(labColor.l);
  const a = Math.round(labColor.a);
  const b = Math.round(labColor.b);

  // Generate a 6-character code from the name
  // Take first 6 characters, pad with spaces if needed
  const code = color.name
    .replace(/\s+/g, '')
    .substring(0, 6)
    .padEnd(6, ' ');

  if ((index + 1) % 100 === 0) {
    console.log(`Processed ${index + 1} colors...`);
  }

  return {
    name: `PANTONE ${color.name}`,
    code: code,
    components: [L, a, b]
  };
});

console.log('Creating color book...');

// Create the ACB color book structure
const colorBook = {
  id: 5000, // Custom ID (Adobe stock books start at 3000)
  title: 'Pantone Colors (LAB)',
  description: 'Pantone color library with precise LAB values. Generated from ok2pan project.',
  colorNamePrefix: '',
  colorNamePostfix: '',
  pageSize: 9, // Standard page size
  pageKey: 5, // Middle color index for page preview
  colorModel: 'Lab',
  colors: colors
};

console.log('Encoding ACB file...');

// Generate the ACB file
const buffer = Buffer.concat([...encodeAcb(colorBook)]);

// Write to file
writeFileSync('Pantone-LAB.acb', buffer);

console.log(`Successfully created Pantone-LAB.acb with ${colors.length} colors!`);
console.log('File location:', process.cwd() + '/Pantone-LAB.acb');
