// components/Header.tsx
import React, { useEffect, useState } from "react";

type HeaderProps = {
  theme: string; // "light" | "dark"
  toggleTheme: () => void;
};

const DarkModeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z" />
  </svg>
);

const LightModeIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5 S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1 s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0 c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95 c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41 L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41 s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06 c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z" />
  </svg>
);

export default function Header({ theme, toggleTheme }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = document
        .querySelector(".header-container")
        ?.getBoundingClientRect();
      if (rect) {
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="grid w-full">
      {/* Header */}
      <div
        className={`header-container fixed top-6 left-1/2 -translate-x-1/2 
          w-[85%] sm:w-[90%] md:w-[85%] max-w-[1200px]
          transition-all duration-700 ease-out z-50 group
          ${isScrolled ? "top-1 w-[60%] sm:w-[75%] scale-90 sm:scale-95" : ""}`}
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-400/20 backdrop-blur-xl" />
          <div
            className="absolute inset-0 opacity-30 transition-opacity duration-500 group-hover:opacity-50"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(147, 51, 234, 0.28), rgba(59, 130, 246, 0.18), transparent 50%)`,
            }}
          />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-[1500ms]" />
          </div>
        </div>

        {/* Glass border with glow */}
        <div className="absolute inset-0 rounded-2xl border border-white/20 group-hover:border-white/30 transition-colors duration-500" />
        <div className="absolute inset-0 rounded-2xl border border-purple-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

        {/* Content */}
        <div className="relative px-4 sm:px-6 md:px-8 py-2 sm:py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 animate-pulse" />
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 animate-ping opacity-75" />
            </div>

            <h1
              className="relative text-base sm:text-xl md:text-2xl font-bold bg-clip-text text-transparent fredoka-bold tracking-wide
    bg-gradient-to-r  from-purple-700 to-blue-600
    dark:from-gray-200 dark:via-purple-300 dark:to-cyan-300"
            >
              Mervlot
              <span
                className="absolute inset-0 text-base sm:text-xl md:text-2xl font-bold blur-sm fredoka-bold tracking-wide
      text-gray-400/30 dark:text-gray-400/20"
              >
                Mervlot
              </span>
            </h1>
          </div>

          {/* Right side: nav dots + theme toggle (props) */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              aria-pressed={theme === "dark"}
              aria-label="Toggle theme"
              className="flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 border border-white/10 bg-white/70 dark:bg-gray-800/60 dark:border-gray-700 shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <span className="w-5 h-5 text-gray-800 dark:text-yellow-400">
                {theme === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </span>
              <span className="hidden sm:inline text-sm font-medium text-gray-800 dark:text-gray-100">
                {theme === "dark" ? "Light" : "Dark"}
              </span>
            </button>
          </div>
        </div>

        {/* Bottom glow */}
        <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none z-40">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-pulse"
            style={{
              left: `${12 + i * 14}%`,
              top: `${14 + (i % 2) * 6}%`,
              animationDelay: `${i * 0.45}s`,
              animationDuration: `${2 + i * 0.35}s`,
            }}
            aria-hidden
          />
        ))}
      </div>
    </div>
  );
}
