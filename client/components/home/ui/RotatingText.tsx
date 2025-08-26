import { useState, useEffect } from "react";

export default function RotatingText() {
  const [currentText, setCurrentText] = useState(0);

  const rotatingTexts = [
    "automate grading, personalize learning",
    "predict student outcomes instantly",
    "streamline administrative tasks",
    "boost student engagement 3x",
    "generate intelligent reports",
    "optimize learning pathways",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % rotatingTexts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [rotatingTexts.length]);

  return (
    <span className="inline-block">
      <span
        key={currentText}
        className="text-blue-700 font-bold animate-in fade-in duration-500"
      >
        {rotatingTexts[currentText]}
      </span>
    </span>
  );
}
