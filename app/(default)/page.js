"use client";

import { useRef, useEffect, useState } from "react";
import Hero from "../../components/Hero";
import FoodDetails from "../../components/FoodDetails";

export default function Home() {
  const foodDetailsRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false); // Add scrolling state

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isScrolling) {
          // Only set visible if not already scrolling
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
  }, [isScrolling]); // Add isScrolling to the dependency array

  const handleGetDetails = () => {
    if (foodDetailsRef.current) {
      const elementPosition =
        foodDetailsRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - 100;

      setIsVisible(false);
      setIsScrolling(true); // Set scrolling state to true

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      // Use requestAnimationFrame for smoother and more accurate timing
      let animationStartTime;
      const scrollDuration = 1000; // Adjust scroll duration (milliseconds)
      const animateScroll = (currentTime) => {
        if (!animationStartTime) {
          animationStartTime = currentTime;
        }
        const timeElapsed = currentTime - animationStartTime;
        const scrollProgress = Math.min(timeElapsed / scrollDuration, 1); // Clamp to 0-1

        window.scrollTo({
          top: offsetPosition * scrollProgress, // Use progress for smooth animation
          behavior: "instant", // Important: use instant behavior here
        });

        if (scrollProgress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          setIsScrolling(false); // Reset scrolling state when animation finishes
          setIsVisible(true); //Show content once scrolled
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
