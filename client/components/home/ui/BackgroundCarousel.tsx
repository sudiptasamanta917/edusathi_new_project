import { useState, useEffect } from "react";

export default function BackgroundCarousel() {
  const [currentBg, setCurrentBg] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const backgroundImages = [
    "https://images.pexels.com/photos/9783353/pexels-photo-9783353.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
    "https://images.pexels.com/photos/8566445/pexels-photo-8566445.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
    "https://images.pexels.com/photos/6517274/pexels-photo-6517274.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // Preload images for better performance
  useEffect(() => {
    backgroundImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
    setImageLoaded(true);
  }, []);

  return (
    <div className="absolute inset-0 -mx-2 -my-8 sm:-mx-4 sm:-my-12 md:-mx-6 md:-my-16 lg:-mx-8 lg:-my-20 overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl">
      {/* Main background image with full visibility */}
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1500 ease-in-out ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `url('${backgroundImages[currentBg]}')`,
        }}
      />
      
      {/* Animated dots indicator */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {backgroundImages.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
              index === currentBg 
                ? 'bg-white/90 scale-125' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
