import { readFileSync, writeFileSync } from 'fs';
import { Buffer } from 'buffer';
import { converter } from 'culori';
import { encodeAcb } from '@atesgoral/acb';
import { Readable } from 'stream';
import { AcbStreamDecoder } from '@atesgoral/acb';

const toLab = converter('lab');

// Test with first color from colors.json
const testColor = {
  name: "Yellow 012 C",
  r: 255,
  g: 215,
  b: 0
};

console.log('=== Testing LAB Roundtrip ===\n');
console.log(`Original RGB: rgb(${testColor.r}, ${testColor.g}, ${testColor.b})`);

// Convert RGB to LAB
const rgbColor = {
  mode: 'rgb',
  r: testColor.r / 255,
  g: testColor.g / 255,
  b: testColor.b / 255
};

const labColor = toLab(rgbColor);
console.log(`\nCulori LAB (raw): L=${labColor.l}, a=${labColor.a}, b=${labColor.b}`);

const L = Math.round(labColor.l);
const a = Math.round(labColor.a);
const b = Math.round(labColor.b);

console.log(`Culori LAB (rounded): L=${L}, a=${a}, b=${b}`);

// Create a minimal ACB file with just this color
const testBook = {
  id: 9999,
  title: 'Test',
  description: 'Test',
  colorNamePrefix: '',
  colorNamePostfix: '',
  pageSize: 1,
  pageKey: 0,
  colorModel: 'Lab',
  colors: [
    {
      name: testColor.name,
      code: 'TEST  ',
      components: [L, a, b]
    }
  ]
};

console.log('\n=== Encoding Test ACB ===');
const buffer = Buffer.concat([...encodeAcb(testBook)]);
writeFileSync('test.acb', buffer);
console.log('Test ACB file created');

// Now decode it
console.log('\n=== Decoding Test ACB ===');
const decoder = new AcbStreamDecoder();

decoder.on('book', (book) => {
  const decodedColor = book.colors[0];
  console.log(`Decoded color: ${decodedColor.name}`);
  console.log(`Decoded components: [${decodedColor.components.join(', ')}]`);

  const [decodedL, decodedA, decodedB] = decodedColor.components;
  console.log(`Decoded LAB: L=${decodedL}, a=${decodedA}, b=${decodedB}`);

  // Compare
  console.log('\n=== Comparison ===');
  console.log(`Input LAB:   L=${L}, a=${a}, b=${b}`);
  console.log(`Output LAB:  L=${decodedL}, a=${decodedA}, b=${decodedB}`);
  console.log(`Difference:  ΔL=${Math.abs(L - decodedL)}, Δa=${Math.abs(a - decodedA)}, Δb=${Math.abs(b - decodedB)}`);

  // Now look at the raw bytes in the file
  console.log('\n=== Raw Bytes Analysis ===');
  const fileBuffer = readFileSync('test.acb');

  // ACB header is variable length, but we can find the color data
  // Color data is at the end after all the strings
  // Let's just look at the last 20 bytes
  console.log('Last 20 bytes of file:');
  for (let i = fileBuffer.length - 20; i < fileBuffer.length; i++) {
    const byte = fileBuffer[i];
    const signed = byte > 127 ? byte - 256 : byte;
    console.log(`  Offset ${i}: ${byte} (unsigned) / ${signed} (signed) / 0x${byte.toString(16).padStart(2, '0')}`);
  }
});

decoder.on('error', (error) => {
  console.error('Decode error:', error);
});

Readable.from(buffer).pipe(decoder);
