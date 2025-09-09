import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { SeminarBookingDialog } from '@/components/investment/SeminarBookingDialog';

const Invest = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#062042] to-[#0b3b6b] text-white px-3 sm:px-6 py-6 sm:py-8 relative overflow-hidden">
      {/* Professional Animation Styles */}
      <style>{`
        /* Modern Text Reveal Animations */
        @keyframes gradientWave {
          0% { 
            background-position: -200% 0;
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          50% {
            opacity: 1;
            transform: translateY(0) scale(1.02);
          }
          100% { 
            background-position: 200% 0;
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes letterDrop {
          0% { 
            opacity: 0; 
            transform: translateY(-50px) rotateX(90deg);
          }
          50% {
            opacity: 1;
            transform: translateY(10px) rotateX(0deg);
          }
          100% { 
            opacity: 1; 
            transform: translateY(0) rotateX(0deg);
          }
        }
        @keyframes shimmerReveal {
          0% { 
            opacity: 0;
            background-position: -100% 0;
            transform: translateY(20px);
          }
          100% { 
            opacity: 1;
            background-position: 100% 0;
            transform: translateY(0);
          }
        }
        
        /* Enhanced Entrance Animations */
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(40px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideInLeft {
          0% { opacity: 0; transform: translateX(-60px) rotateY(-15deg); }
          100% { opacity: 1; transform: translateX(0) rotateY(0deg); }
        }
        @keyframes slideInRight {
          0% { opacity: 0; transform: translateX(60px) rotateY(15deg); }
          100% { opacity: 1; transform: translateX(0) rotateY(0deg); }
        }
        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.8) rotateZ(-5deg); }
          100% { opacity: 1; transform: scale(1) rotateZ(0deg); }
        }
        @keyframes rotateReveal {
          0% { 
            opacity: 0; 
            transform: perspective(1000px) rotateY(-90deg) rotateX(15deg) scale(0.7);
          }
          50% {
            opacity: 0.8;
            transform: perspective(1000px) rotateY(-20deg) rotateX(5deg) scale(0.9);
          }
          90% { 
            opacity: 1; 
            transform: perspective(1000px) rotateY(2deg) rotateX(-1deg) scale(1.01);
          }
          100% { 
            opacity: 1; 
            transform: perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1);
          }
        }
        
        /* Professional Glow Effects */
        @keyframes premiumGlow {
          0%, 100% { 
            text-shadow: 0 0 10px rgba(255, 223, 91, 0.4), 0 0 20px rgba(255, 223, 91, 0.2);
            transform: scale(1);
          }
          50% { 
            text-shadow: 0 0 20px rgba(255, 223, 91, 0.8), 0 0 40px rgba(255, 223, 91, 0.4), 0 0 60px rgba(255, 223, 91, 0.2);
            transform: scale(1.02);
          }
        }
        @keyframes subtleFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(34, 197, 94, 0.3); }
          50% { box-shadow: 0 0 30px rgba(34, 197, 94, 0.6), 0 0 45px rgba(34, 197, 94, 0.3); }
        }
        
        /* Globe Animations */
        @keyframes barGrow {
          0% { transform: scaleY(0.05); opacity: 0; }
          30% { opacity: 1; }
          80% { transform: scaleY(1.05); }
          100% { transform: scaleY(1); opacity: 1; }
        }
        @keyframes arrowRise {
          0% { transform: translateY(40px) scale(0.7); opacity: 0; }
          40% { opacity: 0.8; }
          80% { transform: translateY(-5px) scale(1.05); opacity: 1; }
          100% { transform: translateY(-8px) scale(1); opacity: 1; }
        }
        @keyframes dotPulse {
          0% { transform: translateY(0) scale(0.8); opacity: 0.6; }
          50% { transform: translateY(-12px) scale(1.4); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 0.9; }
        }
        
        /* Animation Classes */
        .gradient-reveal-line1 {
          background: linear-gradient(90deg, 
            transparent 0%, 
            #ffffff 25%, 
            #ffd43b 50%, 
            #ffffff 75%, 
            transparent 100%);
          background-size: 400% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: gradientWave 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .shimmer-reveal-line2 {
          background: linear-gradient(90deg, 
            #ffd43b 0%, 
            #ffffff 25%, 
            #ffd43b 50%, 
            #ffdf5d 75%, 
            #ffd43b 100%);
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          animation: shimmerReveal 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          animation-delay: 1.2s;
        }
        
        .animate-fadeInUp { animation: fadeInUp 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .animate-slideInLeft { animation: slideInLeft 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .animate-slideInRight { animation: slideInRight 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .animate-scaleIn { animation: scaleIn 1s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .animate-rotateReveal { 
          animation: rotateReveal 3s cubic-bezier(0.4, 0, 0.2, 1) forwards; 
          animation-fill-mode: both;
          transform-style: preserve-3d;
          backface-visibility: hidden;
          will-change: transform;
        }
        .animate-premiumGlow { animation: premiumGlow 3s ease-in-out infinite; }
        .animate-subtleFloat { animation: subtleFloat 4s ease-in-out infinite; }
        .animate-pulseGlow { animation: pulseGlow 2s ease-in-out infinite; }
        
        .bar { 
          transform-origin: bottom center; 
          animation: barGrow 2s cubic-bezier(0.4, 0, 0.2, 1) forwards; 
          animation-fill-mode: both;
        }
        .bar.delay-1 { animation-delay: 0.5s; }
        .bar.delay-2 { animation-delay: 1.0s; }
        .bar.delay-3 { animation-delay: 1.5s; }
        .arrow { 
          animation: arrowRise 1.8s cubic-bezier(0.4, 0, 0.2, 1) forwards; 
          animation-fill-mode: both;
        }
        .arrow.delay-1 { animation-delay: 2.0s; }
        .arrow.delay-2 { animation-delay: 2.2s; }
        .dot { 
          animation: dotPulse 2.5s ease-in-out infinite; 
          animation-fill-mode: both;
        }
        .dot.delay-1 { animation-delay: 2.5s; }
        .dot.delay-2 { animation-delay: 2.7s; }
        
        .animate-delay-300 { animation-delay: 0.3s; }
        .animate-delay-600 { animation-delay: 0.6s; }
        .animate-delay-900 { animation-delay: 0.9s; }
        .animate-delay-1200 { animation-delay: 1.2s; }
        .animate-delay-1500 { animation-delay: 1.5s; }
        .animate-delay-1800 { animation-delay: 1.8s; }
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
      <div className="text-center mb-3 sm:mb-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-8 font-extrabold tracking-tight uppercase leading-tight">
          <div className="gradient-reveal-line1 inline-block">UNLOCK THE FUTURE OF</div>
          <br />
          <span className="text-[50px] line-clamp-2 mt-[20px] shimmer-reveal-line2 inline-block animate-premiumGlow">EDUCATION</span>
        </h1>
        <p className="mt-2 sm:mt-3 mb-3 sm:mb-10 text-yellow-300 text-lg sm:text-xl md:text-2xl font-bold uppercase animate-fadeInUp animate-delay-1200 animate-subtleFloat">
          INVEST IN EDUSATHI.NET
        </p>
      </div>

      {/* Combined Globe and Platform Info in Single White Container */}
      <div className="container  px-4 sm:px-0">
        <div className="bg-white text-[#062042] rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 max-w-5xl mx-auto animate-rotateReveal">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12">
            {/* Globe Section */}
            <div className="flex-1 flex justify-center items-center py-4 animate-slideInLeft animate-delay-1800">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80">
                {/* Globe */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 200 200"
                  className="w-full h-full rounded-full pt-8"
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
                <div className="absolute -top-8 sm:-top-10 md:-top-12 left-1/2 -translate-x-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-20 h-20 sm:w-24 pt-10 sm:h-24 md:w-28 md:h-28">
                    <polygon points="32,4 2,20 32,36 62,20" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                    <rect x="26" y="36" width="12" height="12" fill="#0f172a" />
                    <line x1="62" y1="20" x2="62" y2="40" stroke="#facc15" strokeWidth="3" />
                    <circle cx="62" cy="40" r="4" fill="#facc15" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Platform Info Section */}
            <div className="flex-1 max-w-lg lg:max-w-md animate-slideInRight animate-delay-1800">
              <div className="flex flex-col items-center lg:items-start h-full justify-center px-4 lg:px-0">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-6 w-full animate-fadeInUp animate-delay-1800">
                  <div className="w-12 h-12 rounded-md bg-[#0b3b6b] flex items-center justify-center flex-shrink-0 animate-subtleFloat">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L1 7l11 5 9-4.09V17h2V7L12 2z" fill="#FFD43B" />
                      <path d="M11 13v7h2v-7h-2z" fill="#ffffff" opacity="0.9" />
                    </svg>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-extrabold text-center lg:text-left animate-premiumGlow">EDUSATHI.NET</h2>
                </div>

                <div className="text-center lg:text-left w-full">
                  <p className="text-base lg:text-lg font-semibold text-[#0b3b6b] mb-6 leading-tight animate-fadeInUp animate-delay-600">REVENUE-READY EDTECH PLATFORM</p>

                  <ul className="text-sm lg:text-base space-y-4 text-gray-700">
                    <li className="flex items-center justify-center lg:justify-start gap-3 animate-fadeInUp animate-delay-900">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white font-bold text-xs flex-shrink-0 animate-pulseGlow">✓</span>
                      <span className="text-left">100% Complete Development</span>
                    </li>
                    <li className="flex items-center justify-center lg:justify-start gap-3 animate-fadeInUp animate-delay-1200">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white font-bold text-xs flex-shrink-0 animate-pulseGlow">✓</span>
                      <span className="text-left">Proven Market Outreach</span>
                    </li>
                    <li className="flex items-center justify-center lg:justify-start gap-3 animate-fadeInUp animate-delay-1500">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white font-bold text-xs flex-shrink-0 animate-pulseGlow">✓</span>
                      <span className="text-left">Seeking Investment Partners</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA block */}
      <div className="mt-4 sm:mt-8 text-center px-2 animate-fadeInUp animate-delay-1800">
        <div className="animate-scaleIn animate-delay-1800">
          <SeminarBookingDialog />
        </div>
        <p className="mt-2 sm:mt-3 text-xs sm:text-sm opacity-90 animate-fadeInUp animate-delay-1800">Showcasing Platform &amp; Insights</p>

        <div className="mt-3 sm:mt-4 flex items-baseline justify-center gap-2 sm:gap-3 animate-fadeInUp animate-delay-1800">
          <span className="text-yellow-300 font-extrabold text-lg sm:text-2xl md:text-3xl animate-premiumGlow">13Th Sep Onwards</span>
        </div>

        <p className="mt-2 sm:mt-3 text-xs sm:text-sm px-2 animate-fadeInUp animate-delay-1800">Learn More &amp; Register: <a href="https://edusathi.net/Invest" className="text-yellow-300 font-semibold break-all hover:animate-premiumGlow transition-all duration-300">EDUSATHI.NET/INVEST</a></p>
      </div>

      {/* Footer */}
      <footer className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-white/70 px-2 animate-fadeInUp animate-delay-1800">
        © {new Date().getFullYear()} EDUSATHI.NET — Unlock the future of education
      </footer>
    </div>
  </div>
      );
    }
    


export default Invest;
