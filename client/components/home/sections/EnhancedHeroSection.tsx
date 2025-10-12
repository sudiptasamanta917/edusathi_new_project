// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// // import publicPath from '@/public';
// import {
//   Sparkles,
//   Play,
//   ArrowRight,
//   Star,
//   Users,
//   Globe,
//   Clock,
//   TrendingUp,
//   BookOpen,
//   Lightbulb,
//   Target
// } from 'lucide-react';
// import { useInterval } from 'usehooks-ts';
// import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// export default function EnhancedHeroSection() {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [displayText, setDisplayText] = useState('');
//   const [isTyping, setIsTyping] = useState(true);
//   const [currentBgIndex, setCurrentBgIndex] = useState(0);

//   const bgImages = [
//   '/classroom1.avif',
//   '/class5.avif',
//   '/class10.avif',
//   '/class11.avif',
//   '/class9.avif',
//   ];

//   useInterval(() => {
//     setCurrentBgIndex((prev) => (prev + 1) % bgImages.length);
//   }, 5000);

//   // Three main texts for rotation
//   const mainTexts = [
//     "All Boards.",
//     "All Subjects.",
//     "All Students."
//   ];

//   // Reserve width to avoid layout shift while typing
//   const longestTextLength = Math.max(...mainTexts.map(t => t.length));

//   // Typing configuration
//   const TYPING_INTERVAL_MS = 150; // slightly slower typing
//   const PHRASE_HOLD_MS = 2000; // time to hold full phrase before switching

//   useEffect(() => {
//     const currentText = mainTexts[activeIndex];
//     let i = 0;
//     setDisplayText('');
//     setIsTyping(true);

//     const typingInterval = setInterval(() => {
//       if (i < currentText.length) {
//         setDisplayText(currentText.slice(0, i + 1));
//         i++;
//       } else {
//         clearInterval(typingInterval);
//         setIsTyping(false);

//         // Wait before changing to next text
//         setTimeout(() => {
//           setActiveIndex((prev) => (prev + 1) % mainTexts.length);
//         }, PHRASE_HOLD_MS);
//       }
//     }, TYPING_INTERVAL_MS); // Typing speed

//     return () => clearInterval(typingInterval);
//   }, [activeIndex]);

//   // Enhanced stats with better visuals
//   const stats = [
//     { number: "10K+", label: "Active Students", icon: <Users className="w-4 h-4" /> },
//     { number: "500+", label: "Institutions", icon: <Globe className="w-4 h-4" /> },
//     { number: "99.9%", label: "Uptime", icon: <Clock className="w-4 h-4" /> },
//     { number: "95%", label: "Satisfaction", icon: <TrendingUp className="w-4 h-4" /> },
//   ];

//   // Enhanced feature highlights
//   const features = [
//     { icon: <BookOpen className="w-5 h-5" />, text: "Smart Course Management", color: "blue" },
//     { icon: <Lightbulb className="w-5 h-5" />, text: "AI-Driven Insights", color: "purple" },
//     { icon: <Target className="w-5 h-5" />, text: "Personalized Learning", color: "emerald" },
//   ];

//   return (
//     <div className="relative min-h-screen overflow-hidden">
//       {/* Hero Section Background */}
//       <div className="absolute inset-0 -z-10">
//         {bgImages.map((image, index) => (
//           <div 
//             key={index}
//             className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
//               index === currentBgIndex ? 'opacity-100' : 'opacity-0'
//             }`}
//             style={{
//               backgroundImage: `url(${image})`,
//               backgroundPosition: 'center',
//               backgroundSize: 'cover',
//               backgroundRepeat: 'no-repeat',
//               filter: 'brightness(0.7)',
//               height: '100vh',
//               width: '100%'
//             }}
//           />
//         ))}
//         <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 to-slate-900/70" style={{
//           height: '100vh',
//           width: '100%',
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0
//         }} />
//       </div>

//       {/* Main Content */}
//       <section className="container max-w-7xl mx-auto px-4 py-16 sm:py-20 md:py-24 lg:py-32 text-center relative z-10">

//         {/* Enhanced Trust Badge */}
//         <div className="animate-in fade-in duration-700 delay-100 mt-10 mb-8">
//           <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 dark:from-blue-400/20 dark:via-purple-400/20 dark:to-indigo-400/20 border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-md shadow-lg">
//             <div className="flex items-center gap-1">
//               {[...Array(5)].map((_, i) => (
//                 <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
//               ))}
//             </div>
//             <span className="text-sm font-semibold text-fuchsia-950 dark:text-slate-300">
//               Trusted by 1000+ Educational Institutes Worldwide
//             </span>
//             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
//           </div>
//         </div>

//         {/* Enhanced Main Heading */}
//         <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 ">
//           <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
//             <span className="block bg-gradient-to-r from-cyan-500 via-blue-500 to-sky-400 dark:from-slate-100 dark:via-blue-100 dark:to-slate-100 bg-clip-text text-transparent ">
//               We Provide
//               Quality Classes  <br />
//               for{' '}
//               <span
//                 className="relative inline-block whitespace-nowrap text-left text-emerald-600 dark:text-emerald-400"
//                 style={{ minWidth: `${longestTextLength}ch` }}
//               >
//                 {displayText}
//                 {isTyping && (
//                   <span className="ml-1 animate-pulse text-current">|</span>
//                 )}
//               </span>
//             </span>
//             <span className="font-bold relative">
             
//             </span>
//             <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
//               <span className="inline-block">
//               </span>
//             </span>
//           </h1>
//         </div>

//         {/* Enhanced Description */}
//         <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 mb-12">
//           <p className="text-lg sm:text-xl md:text-2xl text-white dark:text-slate-300 max-w-5xl mx-auto leading-relaxed">
//             Harness the power of{" "}
//             <span className="font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
//               artificial intelligence
//             </span>{" "}
//             to revolutionize education and drive your institution towards excellence with our comprehensive platform for{" "}
//             <span className="inline-block min-w-[200px] text-left">
//               <span
//                 className="font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent relative inline-block whitespace-nowrap"
//                 style={{ minWidth: `${longestTextLength}ch` }}
//               >
//                 {displayText}
//                 {isTyping && (
//                   <span className="ml-1 animate-pulse text-emerald-600">|</span>
//                 )}
//               </span>
//             </span>
//           </p>
//         </div>

//         {/* Enhanced Feature Highlights */}
//         <div className="animate-in fade-in scale-in duration-700 delay-400 mb-12">
//           <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
//             {features.map((feature, index) => (
//               <div
//                 key={index}
//                 className={`group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-${feature.color}-50 to-${feature.color}-100 dark:from-${feature.color}-900/30 dark:to-${feature.color}-800/30 border border-${feature.color}-200/50 dark:border-${feature.color}-700/50 rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-default`}
//               >
//                 <div className={`text-${feature.color}-600 dark:text-${feature.color}-400 group-hover:scale-110 transition-transform duration-300`}>
//                   {feature.icon}
//                 </div>
//                 <span className={`font-semibold text-${feature.color}-700 dark:text-${feature.color}-300 text-sm sm:text-base`}>
//                   {feature.text}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Enhanced CTA Buttons */}
//         <div className="animate-in fade-in scale-in duration-700 delay-500 mb-16">
//           <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
//             <Link to="/get-started">
//               <Button
//                 size="lg"
//                 className="group relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white px-10 py-6 text-xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 w-full sm:w-auto font-bold rounded-2xl border-0"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
//                 <Sparkles className="w-6 h-6 mr-3 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
//                 <span className="relative z-10">Start Free Trial</span>
//                 <ArrowRight className="w-6 h-6 ml-3 relative z-10 transform group-hover:translate-x-2 transition-transform duration-300" />
//               </Button>
//             </Link>

//             <Button
//               variant="outline"
//               size="lg"
//               className="group border-2 border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 px-10 py-6 text-xl hover:shadow-xl transition-all duration-500 hover:scale-110 w-full sm:w-auto font-bold bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl relative overflow-hidden"
//             >
//               <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/20 dark:to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//               <Play className="w-6 h-6 mr-3 relative z-10 group-hover:scale-125 transition-transform duration-300" />
//               <span className="relative z-10">Watch Demo</span>
//             </Button>
//           </div>
//         </div>
         
//       </section>
//     </div>
//   );
// }



import React, { useEffect, useRef, useState } from "react";
import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";
import Banner1 from "../../../src/assets/banner1.webp";
import Banner2 from "../../../src/assets/banner2.webp";
import Banner3 from "../../../src/assets/banner3.jpg";

interface Banner {
    id: number;
    img: string;
}

const banners: Banner[] = [
    {
        id: 1,
        img: Banner1,
    },
    {
        id: 2,
        img: Banner2,
    },
    {
        id: 3,
        img: Banner3,
    },
];

// We add a cloned first banner at the end for seamless looping
const bannersWithClone = [...banners, banners[0]];

const EnhancedHeroSection: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [transitionEnabled, setTransitionEnabled] = useState(true);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const resetTimeout = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    useEffect(() => {
        resetTimeout();

        timeoutRef.current = setTimeout(() => {
            if (currentIndex === banners.length) {
                // When we move to cloned slide (index == banners.length),
                // immediately reset without transition to real first slide (index 0)
                setTransitionEnabled(false);
                setCurrentIndex(0);
            } else {
                setTransitionEnabled(true);
                setCurrentIndex(currentIndex + 1);
            }
        }, 4000);

        return () => resetTimeout();
    }, [currentIndex]);

    // When transitionEnabled is false (instant reset), re-enable transition on next render
    useEffect(() => {
        if (!transitionEnabled) {
            // After setting instant reset to first slide, enable transition again
            const t = setTimeout(() => setTransitionEnabled(true), 50);
            return () => clearTimeout(t);
        }
    }, [transitionEnabled]);

    const prev = () => {
        resetTimeout();
        setTransitionEnabled(true);
        if (currentIndex === 0) {
            // Jump to cloned slide instantly for backward infinite scroll effect
            setTransitionEnabled(false);
            setCurrentIndex(banners.length);
        } else {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const next = () => {
        resetTimeout();
        setTransitionEnabled(true);
        if (currentIndex === banners.length) {
            setTransitionEnabled(false);
            setCurrentIndex(0);
        } else {
            setCurrentIndex(currentIndex + 1);
        }
    };

    return (
        <div className="relative w-full mt-20 overflow-hidden select-none">
            <div
                className={`flex h-full ${
                    transitionEnabled
                        ? "transition-transform duration-700 ease-in-out"
                        : ""
                }`}
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {bannersWithClone.map((banner, idx) => (
                    <div key={idx} className="w-full flex-shrink-0 h-full">
                        <img
                            src={banner.img}
                            alt=""
                            className="object-contain"
                        />
                    </div>
                ))}
            </div>

            <button
                onClick={prev}
                aria-label="Previous Banner"
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 text-2xl rounded-full hover:bg-opacity-70 focus:outline-none"
            >
                <RiArrowLeftSLine />
            </button>

            <button
                onClick={next}
                aria-label="Next Banner"
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 text-2xl rounded-full hover:bg-opacity-70 focus:outline-none"
            >
                <RiArrowRightSLine />
            </button>
        </div>
    );
};

export default EnhancedHeroSection;

