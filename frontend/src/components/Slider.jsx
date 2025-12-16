import React, { useEffect, useState } from "react";
import api from "../api/api";

const Slider = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  /* ================= FETCH SLIDER IMAGES ================= */
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

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, images]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) return null;

  return (
    <div className="pt-[84px] md:pt-[84px]">
      <div className="relative w-full mx-auto mt-3 overflow-hidden rounded-3xl shadow-xl max-h-[420px]">

        {/* IMAGE */}
        <div className="transition-all duration-700 ease-in-out">
          <img
            src={images[currentIndex].url}
            alt={images[currentIndex].caption || "slider"}
            className="w-full h-[260px] sm:h-[350px] md:h-[420px] object-cover opacity-90"
          />
        </div>

        {/* OVERLAY */}
        {images[currentIndex].caption && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent flex items-end p-6">
            <h2 className="text-white text-xl md:text-2xl font-semibold drop-shadow-lg">
              {images[currentIndex].caption}
            </h2>
          </div>
        )}

        {/* LEFT BUTTON */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-md 
                         text-white p-3 rounded-full shadow-lg transition"
            >
              ❮
            </button>

            {/* RIGHT BUTTON */}
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-md 
                         text-white p-3 rounded-full shadow-lg transition"
            >
              ❯
            </button>
          </>
        )}

        {/* DOTS */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-3 w-3 rounded-full transition-all duration-300
                  ${
                    currentIndex === index
                      ? "bg-white scale-110 shadow-md"
                      : "bg-white/50"
                  }`}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Slider;
