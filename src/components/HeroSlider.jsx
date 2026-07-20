import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const bannerSlides = [
  {
    bgImage: "https://decantrebd.com/wp-content/uploads/2025/12/main-bannerJPG-scaled-1.jpg",
    tagline: "Enchanting aromas for every unique moment",
    title: "INDULGE IN LUXURY",
    buttonText: "SHOP OUR COLLECTION"
  },
  {
    bgImage: "https://decantrebd.com/wp-content/uploads/2026/07/main_banner-2.jpg",
    tagline: "Elevate your olfactory signature",
    title: "CRAFT IN ELEGANCE",
    buttonText: "DISCOVER THE ART"
  },
  {
    bgImage: "https://decantrebd.com/wp-content/uploads/2026/07/main_banner-1.jpg",
    tagline: "Exquisite rare ingredients hand-poured with mastery",
    title: "ROYAL SIGNATURES",
    buttonText: "EXPLORE THE SELECTIONS"
  }
];

export const HeroSlider = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play the slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="hero-slider" className="relative h-[80vh] bg-[#050505] overflow-hidden border-b border-gold/15">
      {bannerSlides.map((slide, index) => (
        <div 
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
          }`}
        >
          {/* Rich full-color background image with elegant gradient dark overlays */}
          <div className="absolute inset-0 bg-black">
            <img 
              src={slide.bgImage} 
              alt={slide.title} 
              className="w-full h-full object-cover object-center opacity-85"
              referrerPolicy="no-referrer"
            />
            {/* Top, Bottom and center dark protection overlays for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70"></div>
            <div className="absolute inset-0 bg-black/35"></div>
          </div>

          {/* Centered Content overlay */}
          <div className="absolute inset-0 flex items-center justify-center text-center p-4">
            <div className="max-w-[75%] sm:max-w-4xl mx-auto space-y-6 sm:space-y-8">
              
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.45em] text-zinc-300 font-sans font-medium block animate-fade-in drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {slide.tagline}
              </span>
              
              <h1 className="text-3xl sm:text-5xl lg:text-6.5xl font-serif font-light text-white leading-tight tracking-[0.1em] sm:tracking-[0.15em] uppercase select-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                {slide.title}
              </h1>

              <div className="pt-8 sm:pt-12 flex justify-center">
                <button 
                  onClick={() => navigate('/shop')}
                  className="inline-flex items-center justify-center w-[220px] sm:w-[260px] h-12 sm:h-13 bg-white text-black hover:bg-gold hover:text-black text-[10px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.35em] font-sans font-bold rounded-none transition-all duration-300 shadow-xl border border-white hover:border-gold cursor-pointer"
                >
                  {slide.buttonText}
                </button>
              </div>

            </div>
          </div>
        </div>
      ))}

      {/* Slider Controls (Bottom Dot Indicators with elegant long active pills) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {bannerSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
              idx === currentSlide ? 'bg-gold w-6' : 'bg-white/40 hover:bg-white/70 w-2'
            }`}
            title={`Slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Left & Right Arrows */}
      <button 
        onClick={() => setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-black/40 hover:bg-gold text-white hover:text-black rounded-full border border-white/10 hover:border-gold transition-all duration-300 cursor-pointer"
        title="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button 
        onClick={() => setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-black/40 hover:bg-gold text-white hover:text-black rounded-full border border-white/10 hover:border-gold transition-all duration-300 cursor-pointer"
        title="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </section>
  );
};

export default HeroSlider;
