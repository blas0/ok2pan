import { useEffect, useRef, useState } from 'react';
import { Button } from '@heroui/react';
import { animate, createTimeline, createScope } from 'animejs';

function AnimatedHero({ onComplete }) {
  const root = useRef(null);
  const scope = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    scope.current = createScope({ root }).add(self => {
      // Entrance animation timeline
      const entranceTL = createTimeline({ autoplay: true });

      entranceTL
        // Animate SVG and button together with blur/fade effect
        .add(['.hero-svg', '.hero-cta'], {
          opacity: [0, 1],
          filter: ['blur(20px)', 'blur(0px)'],
          ease: 'linear',
          duration: 800,
          delay: 200
        });

      // Exit animation (called on button click)
      self.add('exitAnimation', () => {
        setIsAnimating(true);

        // Fade out SVG and button together with blur effect
        animate(['.hero-svg', '.hero-cta'], {
          opacity: 0,
          filter: 'blur(20px)',
          ease: 'linear',
          duration: 600
        });

        // Call onComplete after animation finishes
        setTimeout(() => {
          if (onComplete) {
            onComplete();
          }
        }, 850); // 600ms animation + 250ms delay
      });
    });

    return () => scope.current.revert();
  }, [onComplete]);

  const handleCtaClick = () => {
    if (!isAnimating && scope.current) {
      scope.current.methods.exitAnimation();
    }
  };

  return (
    <div
      ref={root}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
    >
      {/* SVG Logo */}
      <div className="hero-svg mb-12" style={{ opacity: 0, filter: 'blur(20px)' }}>
        <img
          src="/ok2pan.svg"
          alt="OKLCH to Pantone"
          className="w-full max-w-2xl h-auto"
        />
      </div>

      {/* CTA Button */}
      <Button
        className="hero-cta font-lexend border-2 border-black text-black hover:bg-black hover:text-white transition-colors duration-300"
        radius="full"
        variant="bordered"
        size="lg"
        onPress={handleCtaClick}
        style={{
          opacity: 0,
          filter: 'blur(20px)',
          fontWeight: 900,
          fontSize: '1.125rem',
          paddingLeft: '2rem',
          paddingRight: '2rem',
          paddingTop: '1.5rem',
          paddingBottom: '1.5rem'
        }}
        disabled={isAnimating}
      >
        START CONVERTING
      </Button>
    </div>
  );
}

export default AnimatedHero;
