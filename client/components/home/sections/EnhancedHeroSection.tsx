import React, { useEffect, useRef, useState } from "react";
import Banner1 from "/slider1.webp";
import Banner2 from "/slider2.webp";

interface Banner {
    id: number;
    img: string;
}

const banners: Banner[] = [
    { id: 1, img: Banner1 },
    { id: 2, img: Banner2 },
];

const EnhancedHeroSection: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const resetTimeout = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === banners.length - 1 ? 0 : prevIndex + 1
            );
        }, 10000); // 10 seconds per slide
        return () => resetTimeout();
    }, [currentIndex]);

    return (
        <div className="w-full mt-20 select-none relative overflow-hidden aspect-[16/4] bg-black">
            {banners.map((banner, index) => (
                <img
                    key={banner.id}
                    src={banner.img}
                    alt=""
                    className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-[25000ms] ease-in-out ${
                        index === currentIndex ? "opacity-100" : "opacity-0"
                    }`}
                />
            ))}
        </div>
    );
};

export default EnhancedHeroSection;
