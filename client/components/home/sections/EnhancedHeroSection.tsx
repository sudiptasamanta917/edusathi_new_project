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
    { id: 1, img: Banner1 },
    { id: 2, img: Banner2 },
    { id: 3, img: Banner3 },
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
        }, 4000);
        return () => resetTimeout();
    }, [currentIndex]);

    const prev = () => {
        resetTimeout();
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? banners.length - 1 : prevIndex - 1
        );
    };

    const next = () => {
        resetTimeout();
        setCurrentIndex((prevIndex) =>
            prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <div className="w-full mt-20 select-none relative overflow-hidden aspect-[16/3.3]">
            <div className="w-full h-full relative">
                {banners.map((banner, index) => (
                    <img
                        key={banner.id}
                        src={banner.img}
                        alt=""
                        className={`absolute top-0 left-0 w-full h-full object-contain block transition-opacity duration-1000 ease-in-out ${
                            index === currentIndex
                                ? "opacity-100 z-10"
                                : "opacity-0 z-0"
                        }`}
                        style={{ margin: 0, padding: 0, display: "block" }}
                    />
                ))}
            </div>
        </div>
    );

};

export default EnhancedHeroSection;
