import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { SeminarBookingDialog } from '@/components/investment/SeminarBookingDialog';

const InvestmentLanding = () => {
  return (
  
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#062042] to-[#0b3b6b] text-white px-6 py-12 relative overflow-hidden">
    {/* Inline animation styles (keyframes) */}
    <style>{`
      @keyframes barGrow {
        0% { transform: scaleY(0.06); }
        60% { transform: scaleY(1.05); }
        100% { transform: scaleY(1); }
      }
      @keyframes arrowRise {
        0% { transform: translateY(20px) scale(0.9); opacity: 0; }
        50% { opacity: 1; }
        100% { transform: translateY(-8px) scale(1); opacity: 1; }
      }
      @keyframes dotPulse {
        0% { transform: translateY(0) scale(1); opacity: 0.9; }
        50% { transform: translateY(-6px) scale(1.25); opacity: 1; }
        100% { transform: translateY(0) scale(1); opacity: 0.9; }
      }
      .bar { transform-origin: bottom center; animation: barGrow 1s ease-out forwards; }
      .bar.delay-1 { animation-delay: 0.15s; }
      .bar.delay-2 { animation-delay: 0.30s; }
      .bar.delay-3 { animation-delay: 0.45s; }
      .arrow { animation: arrowRise 1.2s cubic-bezier(.22,.9,.36,1) forwards; transform-origin: center; }
      .arrow.delay-1 { animation-delay: 0.2s; }
      .arrow.delay-2 { animation-delay: 0.35s; }
      .dot { animation: dotPulse 1.6s ease-in-out infinite; }
      .dot.delay-1 { animation-delay: 0.1s; }
      .dot.delay-2 { animation-delay: 0.4s; }
    `}</style>

    {/* Decorative background network pattern */}
    <svg
      className="pointer-events-none absolute inset-0 w-full h-full opacity-20"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 800"
      aria-hidden
    >
      <rect width="1200" height="800" fill="url(#bg-gradient)" />
      <defs>
        <linearGradient id="bg-gradient" x1="0" x2="1">
          <stop offset="0%" stopColor="#0b3b6b" />
          <stop offset="100%" stopColor="#062042" />
        </linearGradient>
      </defs>
      <g stroke="#7fb3ff" strokeOpacity="0.12" strokeWidth="1">
        <line x1="120" y1="120" x2="420" y2="60" />
        <line x1="240" y1="240" x2="640" y2="200" />
        <line x1="860" y1="120" x2="980" y2="260" />
        <line x1="200" y1="520" x2="520" y2="420" />
        <line x1="760" y1="420" x2="1080" y2="520" />
      </g>
      <g fill="#9fd0ff" fillOpacity="0.14">
        <circle cx="120" cy="120" r="6" />
        <circle cx="420" cy="60" r="5" />
        <circle cx="640" cy="200" r="5" />
        <circle cx="980" cy="260" r="6" />
        <circle cx="520" cy="420" r="5" />
        <circle cx="1080" cy="520" r="6" />
      </g>
    </svg>

    <div className="relative z-10 w-full max-w-3xl">
      {/* Top headline */}
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight uppercase text-white">
          UNLOCK THE FUTURE OF EDUCATION
        </h1>
        <p className="mt-3 mb-5 text-yellow-300 text-xl sm:text-2xl font-bold uppercase">
          INVEST IN EDUSATHI.NET
        </p>
      </div>

      {/* Illustration with animated bars, arrows and dots */}
      <div className="flex justify-center mb-6 mt-5">
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 mt-5">
          {/* Globe */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
            className="w-full h-full rounded-full"
          >
            <defs>
              <radialGradient id="g1" cx="50%" cy="35%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#1e40af" />
              </radialGradient>
            </defs>

            <circle cx="100" cy="100" r="90" fill="url(#g1)" stroke="#60a5fa" strokeWidth="3" />

            {/* Simple meridians */}
            <g stroke="#93c5fd" strokeWidth="1">
              <path d="M100 10a90 90 0 000 180" fill="none" strokeOpacity="0.25" />
              <path d="M10 100a90 90 0 00180 0" fill="none" strokeOpacity="0.25" />
              <path d="M35 25c40 40 90 40 130 0" fill="none" strokeOpacity="0.12" />
            </g>

            {/* Bar chart (animated) - positioned in front-right of globe */}
            <g transform="translate(80,48)">
              <rect className="bar delay-1" x="0" y="48" width="10" height="52" rx="2" fill="#ffdf5d" transform="scaleY(0.06)" />
              <rect className="bar delay-2" x="18" y="30" width="10" height="70" rx="2" fill="#ffd43b" transform="scaleY(0.06)" />
              <rect className="bar delay-3" x="36" y="8" width="10" height="92" rx="2" fill="#f59e0b" transform="scaleY(0.06)" />
            </g>

            {/* Growth arrow (animated) - overlay */}
            <g transform="translate(40,42)" className="arrow delay-2" style={{opacity:0}}>
              <path d="M20 80 C60 40, 100 60, 140 20" fill="none" stroke="#facc15" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <polygon points="140,20 132,16 142,10 152,20" fill="#facc15" />
            </g>

            {/* Dots on a rising line with small connecting lines */}
            <g>
              <line x1="28" y1="120" x2="60" y2="92" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1" />
              <circle className="dot delay-1" cx="28" cy="120" r="3.5" fill="#facc15" />

              <line x1="60" y1="92" x2="100" y2="76" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1" />
              <circle className="dot delay-2" cx="60" cy="92" r="4" fill="#facc15" />

              <line x1="100" y1="76" x2="140" y2="52" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1" />
              <circle className="dot" cx="100" cy="76" r="4.5" fill="#facc15" />
            </g>
          </svg>

          {/* Graduation Cap positioned above globe (static) */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-24 h-24">
              <polygon points="32,4 2,20 32,36 62,20" fill="#0f172a" stroke="#334155" strokeWidth="2" />
              <rect x="26" y="36" width="12" height="12" fill="#0f172a" />
              <line x1="62" y1="20" x2="62" y2="40" stroke="#facc15" strokeWidth="3" />
              <circle cx="62" cy="40" r="4" fill="#facc15" />
            </svg>
          </div>
        </div>
      </div>

      {/* White card with platform name and bullets */}
      <div className="bg-white text-[#062042] rounded-2xl shadow-xl p-6 sm:p-8 mx-4 -mt-4">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-[#0b3b6b] flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2z" fill="#FFD43B" />
                <path d="M11 13v7h2v-7h-2z" fill="#ffffff" opacity="0.9" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-5">EDUSATHI.NET</h2>
          </div>

          <p className="mt-4 text-sm sm:text-base font-semibold">REVENUE-READY EDTECH PLATFORM</p>

          <ul className="mt-4 text-sm sm:text-base space-y-2 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white font-bold">✓</span>
              <span>100% Complete Development</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white font-bold">✓</span>
              <span>Proven Market Outreach</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white font-bold">✓</span>
              <span>Seeking Investment Partners</span>
            </li>
          </ul>
        </div>
      </div>

      {/* CTA block */}
      <div className="mt-6 text-center">
        <SeminarBookingDialog />
        <p className="mt-3 text-sm opacity-90">Showcasing Platform &amp; Insights</p>

        <div className="mt-4 flex items-baseline justify-center gap-3">
          <span className="text-yellow-300 font-extrabold text-2xl sm:text-3xl">13 SEPT Onwords</span>
          {/* <span className="text-white/80 font-bold">-</span>
          <span className="text-yellow-300 font-extrabold text-2xl sm:text-3xl">15 SEPT</span> */}
        </div>

        <p className="mt-3 text-sm">Learn More &amp; Register: <a href="https://edusathi.net/invest" className="text-yellow-300 font-semibold">EDUSATHI.NET/INVEST</a></p>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-sm text-white/70">
        © {new Date().getFullYear()} EDUSATHI.NET — Unlock the future of education
      </footer>
    </div>
  </div>
      );
    }
    



export default InvestmentLanding;
