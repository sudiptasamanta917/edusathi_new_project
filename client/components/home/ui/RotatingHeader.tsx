import { useState, useEffect } from "react";

export default function RotatingHeader() {
  const [currentHeader, setCurrentHeader] = useState(0);

  const headerTexts = [
    { first: "Take your institute", second: "online—fast." },
    { first: "Transform education with", second: "AI technology." },
    { first: "Scale your institute", second: "effortlessly." },
    { first: "Revolutionize learning", second: "experience." },
    { first: "Automate everything", second: "grow faster." },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeader((prev) => (prev + 1) % headerTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [headerTexts.length]);

  return (
    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6 leading-tight">
      <span
        key={`first-${currentHeader}`}
        className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-in fade-in duration-500 block"
      >
        {headerTexts[currentHeader].first}
      </span>
      <span
        key={`second-${currentHeader}`}
        className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent animate-in fade-in duration-500 block"
      >
        {headerTexts[currentHeader].second}
      </span>
    </h1>
  );
}
