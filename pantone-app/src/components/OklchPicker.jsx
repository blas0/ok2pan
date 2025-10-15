import { useState, useMemo } from 'react';
import { Card, CardBody, CardHeader, Slider } from '@heroui/react';
import { findNearestPantoneColors, oklchToCSS, oklchToHex, oklchToRgb } from '../utils/colorMatching';
import NearestColors from './NearestColors';
import { parse, converter } from 'culori';

function OklchPicker({ pantoneColors }) {
  // OKLCH state values
  const [lightness, setLightness] = useState(0.65); // 0-1 (0% to 100%)
  const [chroma, setChroma] = useState(0.15); // 0-0.4 typical range
  const [hue, setHue] = useState(180); // 0-360 degrees

  // Converters
  const toOklch = converter('oklch');

  // Calculate nearest colors whenever OKLCH values change
  const nearestColors = useMemo(() => {
    return findNearestPantoneColors(
      { mode: 'oklch', l: lightness, c: chroma, h: hue },
      pantoneColors,
      5
    );
  }, [lightness, chroma, hue, pantoneColors]);

  // Get color representations
  const cssColor = oklchToCSS(lightness, chroma, hue);
  const rgbColor = oklchToRgb(lightness, chroma, hue);
  const hexColor = oklchToHex(lightness, chroma, hue);

  // Parse color input and update OKLCH values
  const handleColorInput = (colorString) => {
    try {
      const parsed = parse(colorString);
      if (parsed) {
        const oklch = toOklch(parsed);
        if (oklch && typeof oklch.l === 'number' && typeof oklch.c === 'number') {
          setLightness(oklch.l);
          setChroma(oklch.c);
          setHue(oklch.h || 0);
        }
      }
    } catch (error) {
      console.error('Failed to parse color:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Color Picker */}
      <Card className="shadow-xl">
        <CardHeader className="flex-col items-start px-6 pt-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            OKLCH Color Picker
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Adjust the sliders to create your color
          </p>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          {/* Live Color Preview */}
          <div className="mb-6">
            <div
              className="w-full h-32 rounded-xl shadow-lg border-4 border-white dark:border-gray-700 transition-colors duration-200"
              style={{ backgroundColor: rgbColor }}
            />
            <div className="mt-3 space-y-1 text-sm text-center">
              <input
                type="text"
                defaultValue={cssColor}
                key={cssColor}
                onBlur={(e) => handleColorInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleColorInput(e.target.value);
                    e.target.blur();
                  }
                }}
                className="w-full bg-transparent font-mono font-semibold text-gray-800 dark:text-white underline text-center border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                placeholder="oklch(65.0% 0.150 180.0)"
              />
              <div className="flex items-center justify-center gap-2 font-mono text-gray-600 dark:text-gray-400">
                <input
                  type="text"
                  defaultValue={hexColor}
                  key={hexColor}
                  onBlur={(e) => handleColorInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleColorInput(e.target.value);
                      e.target.blur();
                    }
                  }}
                  className="bg-transparent underline text-center border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                  placeholder="#00ab93"
                  style={{ width: '90px' }}
                />
                <span>·</span>
                <input
                  type="text"
                  defaultValue={rgbColor}
                  key={rgbColor}
                  onBlur={(e) => handleColorInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleColorInput(e.target.value);
                      e.target.blur();
                    }
                  }}
                  className="bg-transparent underline text-center border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                  placeholder="rgb(0, 171, 147)"
                  style={{ width: '150px' }}
                />
              </div>
            </div>
          </div>

          {/* Lightness Slider */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Lightness (L)
              </label>
              <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                {(lightness * 100).toFixed(0)}%
              </span>
            </div>
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
          </div>

          {/* Chroma Slider */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Chroma (C)
              </label>
              <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                {chroma.toFixed(3)}
              </span>
            </div>
            <Slider
              size="lg"
              step={0.001}
              minValue={0}
              maxValue={0.4}
              value={chroma}
              onChange={setChroma}
              aria-label="Chroma value"
              classNames={{
                track: "h-3",
                thumb: "w-6 h-6"
              }}
              color="secondary"
            />
          </div>

          {/* Hue Slider */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Hue (H)
              </label>
              <span className="text-sm font-mono text-gray-600 dark:text-gray-400">
                {hue}°
              </span>
            </div>
            <Slider
              size="lg"
              step={1}
              minValue={0}
              maxValue={360}
              value={hue}
              onChange={setHue}
              aria-label="Hue value"
              classNames={{
                track: "h-3",
                thumb: "w-6 h-6"
              }}
              color="primary"
            />
          </div>

          {/* Hue Reference */}
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Hue Reference:
            </p>
            <div className="grid grid-cols-4 gap-2 text-xs text-gray-600 dark:text-gray-400">
              <span>0° Red</span>
              <span>90° Yellow</span>
              <span>180° Cyan</span>
              <span>270° Purple</span>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Nearest Pantone Colors */}
      <NearestColors nearestColors={nearestColors} targetColor={rgbColor} />
    </div>
  );
}

export default OklchPicker;
