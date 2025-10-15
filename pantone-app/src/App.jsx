import { useState, useMemo, useEffect, useRef } from 'react'
import { Input, Tooltip } from '@heroui/react'
import colorsData from './colors.json'
import OklchPicker from './components/OklchPicker'
import AnimatedHero from './components/AnimatedHero'
import { animate } from 'animejs'

function App() {
  const [showHero, setShowHero] = useState(true)
  const [showConverter, setShowConverter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const converterRef = useRef(null)

  const filteredColors = useMemo(() => {
    if (!searchQuery.trim()) {
      return colorsData
    }

    const query = searchQuery.toLowerCase()
    return colorsData.filter(color =>
      color.name.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const handleHeroComplete = () => {
    setShowHero(false)
    setShowConverter(true)
  }

  // Animate converter content in when it becomes visible with blur-to-fade effect
  useEffect(() => {
    if (showConverter && converterRef.current) {
      animate(converterRef.current, {
        opacity: [0, 1],
        filter: ['blur(20px)', 'blur(0px)'],
        ease: 'linear',
        duration: 800
      })
    }
  }, [showConverter])

  // Show animated hero initially
  if (showHero) {
    return <AnimatedHero onComplete={handleHeroComplete} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 font-geist-mono">
      <div ref={converterRef} className="converter-content container mx-auto px-4 py-8" style={{ opacity: 0, filter: 'blur(20px)' }}>
        {/* OKLCH Color Picker */}
        <OklchPicker pantoneColors={colorsData} />

        {/* Gallery section hidden but kept for backend use */}
        {false && (
          <>
            {/* Search Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
                Browse All Pantone Colors
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
                {filteredColors.length} colors available
              </p>

              <div className="max-w-2xl mx-auto">
                <Input
                  isClearable
                  type="text"
                  label="Search colors"
                  placeholder="Search by Pantone code or name..."
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  size="lg"
                  variant="bordered"
                  classNames={{
                    input: "text-lg",
                    inputWrapper: "shadow-lg"
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-16 xl:grid-cols-20 2xl:grid-cols-24 gap-1">
              {filteredColors.map((color, index) => (
                <Tooltip
                  key={`${color.name}-${index}`}
                  content={color.name}
                  placement="top"
                  showArrow
                  classNames={{
                    content: "font-semibold text-sm px-3 py-2"
                  }}
                >
                  <button
                    className="aspect-square rounded-md cursor-pointer transition-transform hover:scale-110 hover:z-10 shadow-sm hover:shadow-xl border-0 p-0 w-full"
                    style={{ backgroundColor: color.rgb }}
                    aria-label={color.name}
                  />
                </Tooltip>
              ))}
            </div>

            {filteredColors.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-gray-500 dark:text-gray-400">
                  No colors found matching "{searchQuery}"
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default App
