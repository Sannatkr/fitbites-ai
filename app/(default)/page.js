"use client";

import { useRef, useEffect, useState } from "react";
import Hero from "../../components/Hero";
import FoodDetails from "../../components/FoodDetails";
import ImageUpload from "../../components/ImageUpload";

export default function Home() {
  const foodDetailsRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (foodDetailsRef.current) {
      observer.observe(foodDetailsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleGetDetails = () => {
    if (foodDetailsRef.current) {
      const elementPosition =
        foodDetailsRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - 100;

      // Reset visibility to trigger animation again
      setIsVisible(false);

      // Start scroll animation
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Trigger fade-in animation slightly after scroll begins
      setTimeout(() => {
        setIsVisible(true);
      }, 100);
    }
  };

  return (
    <>
      <Hero onGetDetails={handleGetDetails} />
      <div
        ref={foodDetailsRef}
        className={`transform transition-all duration-700 ease-out
          ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
      >
        <FoodDetails />
      </div>
    </>
  );
}
