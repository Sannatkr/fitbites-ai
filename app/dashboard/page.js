"use client";
import { useRef, useEffect, useState } from "react";
import Hero from "@/components/Hero";
import FoodDetails from "@/components/FoodDetails";

export default function DashboardPage() {
  const foodDetailsRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isScrolling) {
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
  }, [isScrolling]);

  const handleGetDetails = () => {
    if (foodDetailsRef.current) {
      const elementPosition =
        foodDetailsRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - 100;

      setIsVisible(false);
      setIsScrolling(true);

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      let animationStartTime;
      const scrollDuration = 1000;

      const animateScroll = (currentTime) => {
        if (!animationStartTime) {
          animationStartTime = currentTime;
        }
        const timeElapsed = currentTime - animationStartTime;
        const scrollProgress = Math.min(timeElapsed / scrollDuration, 1);

        window.scrollTo({
          top: offsetPosition * scrollProgress,
          behavior: "instant",
        });

        if (scrollProgress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          setIsScrolling(false);
          setIsVisible(true);
        }
      };

      requestAnimationFrame(animateScroll);
    }
  };

  return (
    <>
      <Hero onGetDetails={handleGetDetails} />
      <div
        ref={foodDetailsRef}
        className={`transform transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <FoodDetails />
      </div>
    </>
  );
}
