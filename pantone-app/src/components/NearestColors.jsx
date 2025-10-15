import { Card, CardBody, CardHeader, Chip, Tooltip } from '@heroui/react';

function NearestColors({ nearestColors, targetColor }) {
  if (!nearestColors || nearestColors.length === 0) {
    return (
      <Card className="shadow-xl">
        <CardHeader className="flex-col items-start px-6 pt-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Nearest Pantone Matches
          </h2>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No matching colors found
          </p>
        </CardBody>
      </Card>
    );
  }

  // Get the closest match for special highlighting
  const closestMatch = nearestColors[0];

  return (
    <Card className="shadow-xl">
      <CardHeader className="flex-col items-start px-6 pt-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Nearest Pantone Matches
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Top 5 closest matches from 2,369 colors
        </p>
      </CardHeader>
      <CardBody className="px-6 pb-6">
        {/* Comparison Preview */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Your Color
            </p>
            <div
              className="w-full h-20 rounded-lg shadow border-2 border-white dark:border-gray-700"
              style={{ backgroundColor: targetColor }}
            />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Best Match
            </p>
            <div
              className="w-full h-20 rounded-lg shadow border-2 border-white dark:border-gray-700"
              style={{ backgroundColor: closestMatch.rgb }}
            />
          </div>
        </div>

        {/* List of nearest colors */}
        <div className="space-y-3">
          {nearestColors.map((color, index) => (
            <div
              key={`${color.name}-${index}`}
              className={`p-4 rounded-xl border-2 transition-all ${
                index === 0
                  ? 'bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700'
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Color Swatch */}
                <Tooltip content={color.name} placement="left" showArrow>
                  <div
                    className="w-16 h-16 rounded-lg shadow-md flex-shrink-0 cursor-pointer transition-transform hover:scale-110 border-2 border-white dark:border-gray-600"
                    style={{ backgroundColor: color.rgb }}
                  />
                </Tooltip>

                {/* Color Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-gray-800 dark:text-white text-sm leading-tight">
                      {color.name}
                    </h3>
                    {index === 0 && (
                      <Chip
                        size="sm"
                        color="primary"
                        variant="flat"
                        className="flex-shrink-0"
                      >
                        Best Match
                      </Chip>
                    )}
                  </div>

                  {/* Quality Badge and DeltaE */}
                  <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                    <Tooltip
                      content={color.qualityDescription || 'Color match quality'}
                      placement="top"
                      showArrow
                    >
                      <span
                        className="px-2.5 py-1 rounded-md font-bold text-white shadow-sm"
                        style={{ backgroundColor: color.qualityColor || '#6b7280' }}
                      >
                        {color.qualityIcon || ''} {color.qualityLabel || 'Match'}
                      </span>
                    </Tooltip>
                    <span className="px-2 py-1 bg-white dark:bg-gray-700 rounded font-mono text-gray-700 dark:text-gray-300">
                      ΔE: {(color.deltaE || color.distance).toFixed(2)}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded font-semibold text-blue-700 dark:text-blue-300">
                      {(color.matchPercentage || color.similarity).toFixed(0)}% match
                    </span>
                  </div>

                  {/* Progress bar for match quality */}
                  <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${color.matchPercentage || color.similarity}%`,
                        backgroundColor: color.qualityColor || '#22c55e'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

export default NearestColors;
