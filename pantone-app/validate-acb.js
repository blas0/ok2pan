import { readFileSync } from 'fs';
import { Readable } from 'stream';
import { AcbStreamDecoder } from '@atesgoral/acb';
import { converter } from 'culori';

// Initialize converters
const toLab = converter('lab');
const toRgb = converter('rgb');

console.log('Reading and decoding ACB file...\n');

// Read the ACB file
const buffer = readFileSync('./Pantone-LAB.acb');

// Decode the ACB file
const decoder = new AcbStreamDecoder();

decoder.on('book', (book) => {
  console.log('=== ACB File Decoded Successfully ===');
  console.log(`Title: ${book.title}`);
  console.log(`Description: ${book.description}`);
  console.log(`Color Model: ${book.colorModel}`);
  console.log(`Total Colors: ${book.colors.length}\n`);

  // Read original colors for comparison
  const originalColors = JSON.parse(
    readFileSync('../colors.json', 'utf-8')
  );

  console.log('=== Validation: Checking Sample Colors ===\n');

  // Check first 5 colors
  for (let i = 0; i < Math.min(5, book.colors.length); i++) {
    const acbColor = book.colors[i];
    const original = originalColors[i];

    console.log(`Color ${i + 1}: ${acbColor.name}`);
    console.log(`  Original RGB: rgb(${original.r}, ${original.g}, ${original.b})`);

    // Get decoded LAB values (library already decoded them)
    const [decodedL, decodedA, decodedB] = acbColor.components;

    console.log(`  ACB LAB (decoded): L=${decodedL.toFixed(2)}, a=${decodedA.toFixed(2)}, b=${decodedB.toFixed(2)}`);

    // Convert original RGB to LAB for comparison
    const rgbColor = {
      mode: 'rgb',
      r: original.r / 255,
      g: original.g / 255,
      b: original.b / 255
    };
    const expectedLab = toLab(rgbColor);

    console.log(`  Expected LAB: L=${expectedLab.l.toFixed(2)}, a=${expectedLab.a.toFixed(2)}, b=${expectedLab.b.toFixed(2)}`);

    // Calculate error
    const errorL = Math.abs(decodedL - expectedLab.l);
    const errorA = Math.abs(decodedA - expectedLab.a);
    const errorB = Math.abs(decodedB - expectedLab.b);

    console.log(`  Error: ΔL=${errorL.toFixed(3)}, Δa=${errorA.toFixed(3)}, Δb=${errorB.toFixed(3)}`);

    // Convert decoded LAB back to RGB to check roundtrip
    const labColor = { mode: 'lab', l: decodedL, a: decodedA, b: decodedB };
    const rgbFromLab = toRgb(labColor);
    const r = Math.round(rgbFromLab.r * 255);
    const g = Math.round(rgbFromLab.g * 255);
    const b = Math.round(rgbFromLab.b * 255);

    console.log(`  Roundtrip RGB: rgb(${r}, ${g}, ${b})`);
    console.log(`  RGB Error: ΔR=${Math.abs(r - original.r)}, ΔG=${Math.abs(g - original.g)}, ΔB=${Math.abs(b - original.b)}`);

    console.log();
  }

  // Check naming format
  console.log('=== Validation: Color Naming ===');
  const hasPantonePrefix = book.colors.every(c => c.name.startsWith('PANTONE '));
  console.log(`All colors have "PANTONE " prefix: ${hasPantonePrefix ? '✓ YES' : '✗ NO'}`);

  if (!hasPantonePrefix) {
    console.log('Sample names without prefix:');
    book.colors.filter(c => !c.name.startsWith('PANTONE ')).slice(0, 5).forEach(c => {
      console.log(`  - ${c.name}`);
    });
  }

  console.log('\n=== Validation Complete ===');
});

decoder.on('error', (error) => {
  console.error('Error decoding ACB file:', error);
});

Readable.from(buffer).pipe(decoder);
