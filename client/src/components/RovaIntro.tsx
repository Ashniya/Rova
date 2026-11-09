import React, { useEffect, useState } from 'react';
import MaskedHeading from './MaskedHeading';

interface RovaIntroProps {
  onComplete: () => void;
  durationSeconds?: number;
}

export const RovaIntro: React.FC<RovaIntroProps> = ({ onComplete, durationSeconds = 3 }) => {
  const [typedTagline, setTypedTagline] = useState('');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const fullTagline = 'Where routes become journeys.';

  // Typewriter effect for the tagline
  useEffect(() => {
    let index = 0;
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        if (index < fullTagline.length) {
          setTypedTagline(fullTagline.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 55);

      return () => clearInterval(interval);
    }, 600);

    return () => clearTimeout(startDelay);
  }, []);

  // 3-second auto-transition to landing page
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        onComplete();
      }, 400);
    }, durationSeconds * 1000);

    return () => clearTimeout(fadeTimer);
  }, [durationSeconds, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1C1917] text-white px-6 transition-opacity duration-500 selection:bg-[#B91C1C] select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="w-full max-w-4xl flex flex-col items-center text-center">
        {/* Masked Heading for Rova with scenic coach exterior photo masked through letters */}
        <div className="w-full mb-4">
          <MaskedHeading
            text="Rova"
            tag="h1"
            mediaType="image"
            src="/images/coach-exterior.jpg"
            fillScale={1.3}
            parallax={20}
            drift={15}
            brightness={1.05}
            saturation={1.2}
            reveal="rise"
            duration={1.2}
            trigger="auto"
            align="center"
            weight={900}
            tracking={-0.03}
            textScale={0.16}
            outline={true}
            outlineColor="#F59E0B"
            outlineWidth={0.5}
            className="text-white drop-shadow-sm font-black"
          />
        </div>

        {/* Typewriter animated tagline below */}
        <div className="h-8 flex items-center justify-center">
          <p className="text-sm sm:text-base md:text-lg font-medium text-[#ECE7E1] tracking-wide">
            <span>{typedTagline}</span>
            <span className="inline-block w-0.5 h-4 bg-[#B91C1C] ml-1.5 animate-pulse align-middle"></span>
          </p>
        </div>

        <p className="text-[11px] font-mono tracking-widest text-[#A8A29E] uppercase mt-4 opacity-75">
          EXPEDITIONS &amp; INTERCITY TRANSIT
        </p>
      </div>

      {/* Skip button in bottom-right corner */}
      <button
        onClick={() => {
          setIsFadingOut(true);
          setTimeout(onComplete, 200);
        }}
        className="absolute bottom-8 right-8 text-xs font-mono text-[#A8A29E] hover:text-white px-3 py-1.5 rounded-full border border-stone-800 hover:border-stone-600 transition-colors cursor-pointer"
      >
        Skip to Landing &rarr;
      </button>
    </div>
  );
};

export default RovaIntro;
