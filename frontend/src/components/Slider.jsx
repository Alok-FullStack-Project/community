// src/components/Slider.jsx
import React, { useEffect, useState, useCallback } from "react";
import api from "../api/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Slider = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchSliderImages = async () => {
      try {
        const res = await api.get("/events/event-images/slider");
        setImages(res.data || []);
      } catch (err) {
        console.error("Failed to load slider images", err);
      }
    };
    fetchSliderImages();
  }, []);

  /* ================= NAVIGATION ================= */
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  /* ================= AUTO PLAY ================= */
  useEffect(() => {
    if (images.length <= 1 || isHovered) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, images.length, isHovered]);

  if (images.length === 0) return null;

  return (
    // Pt-20 to account for the fixed Header height
    <section className="relative w-full overflow-hidden bg-slate-100 pt-20 group">
      
      {/* HEIGHT ADJUSTMENT: 
          Mobile: 300px | Tablet: 450px | Desktop: 500px 
      */}
      <div 
        className="relative h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        
        {/* SLIDING TRACK */}
        <div 
          className="flex h-full transition-transform duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((img, idx) => (
            <div key={idx} className="min-w-full h-full relative overflow-hidden">
              <img
                src={img.url}
                alt={img.caption || "Community Image"}
                // object-cover ensures no stretching
                // object-center keeps the middle of the image visible
                className="w-full h-full object-cover object-center transition-transform duration-[2000ms] ease-out"
                style={{
                  transform: currentIndex === idx ? "scale(1.05)" : "scale(1)"
                }}
              />
              
              {/* GRADIENT OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90" />
              
              {/* BOTTOM CAPTION - Adjusted for smaller height */}
              {img.caption && (
                <div className={`absolute bottom-16 left-6 md:left-12 lg:left-20 right-6 transition-all duration-1000 delay-300 transform ${
                  currentIndex === idx ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}>
                  <h2 className="text-white text-xl md:text-3xl lg:text-4xl font-bold max-w-2xl leading-snug drop-shadow-xl">
                    {img.caption}
                  </h2>
                  <div className="mt-3 h-1 w-12 bg-indigo-500 rounded-full" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* SIDE NAVIGATION (Arrows) */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-indigo-600 z-30 shadow-lg"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-indigo-600 z-30 shadow-lg"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* BOTTOM INDICATORS (Smaller bars for compact look) */}
        <div className="absolute bottom-6 left-6 md:left-12 lg:left-20 flex items-center gap-2 z-30">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="group py-2"
            >
              <div className={`h-[3px] transition-all duration-500 rounded-full ${
                currentIndex === index ? "w-10 bg-white" : "w-4 bg-white/30 group-hover:bg-white/50"
              }`} />
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Slider;