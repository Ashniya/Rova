import React, { useEffect, useState } from 'react';
import { Bus, Radio, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onFinish?: () => void;
  minDuration?: number; // ms
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  minDuration = 2000,
}) => {
  const [progress, setProgress] = useState(12);
  const [statusText, setStatusText] = useState('Initializing transit telemetry...');
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(45);
      setStatusText('Connecting to intercity fleet radar...');
    }, 450);

    const timer2 = setTimeout(() => {
      setProgress(78);
      setStatusText('Calibrating seat integrity engine...');
    }, 1000);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusText('Rova Transit System Ready.');
    }, 1600);

    const timer4 = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        if (onFinish) onFinish();
      }, 400);
    }, minDuration);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [minDuration, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1A0B2E] text-white transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background ambient radial gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-coral-500/10 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-6 text-center">
        {/* Animated Transit Radar Dot */}
        <div className="mb-6 relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-3xl bg-sidebar-card border border-purple-500/20 flex items-center justify-center shadow-lg">
            <Radio className="w-8 h-8 text-coral-400 animate-pulse" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-coral-500"></span>
          </span>
        </div>

        {/* Brand Name: Just 'Rova' in white (no logo symbol) */}
        <h1 className="text-5xl font-black tracking-tight text-white mb-1.5 animate-fadeIn">
          Rova
        </h1>

        {/* Tagline */}
        <p className="text-sm font-semibold tracking-wide text-coral-400 uppercase mb-1">
          Where routes become journeys
        </p>

        <p className="text-[11px] tracking-widest text-slate-400 uppercase font-bold mb-8">
          INTERCITY TRANSIT NETWORK
        </p>

        {/* Sleek Progress Track */}
        <div className="w-full bg-purple-950/80 rounded-full h-2 p-0.5 border border-purple-500/20 overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-coral-400 to-coral-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status text & progress % */}
        <div className="flex items-center justify-between w-full text-[11px] font-mono text-slate-400">
          <span className="truncate pr-2">{statusText}</span>
          <span className="font-bold text-coral-400">{progress}%</span>
        </div>
      </div>

      {/* Subtle bottom note */}
      <div className="absolute bottom-6 text-[10px] text-slate-500 tracking-wider font-mono">
        ENTERPRISE TRANSIT DISPATCH v2.4 • ALGIONS AI LABS
      </div>
    </div>
  );
};

export default SplashScreen;
