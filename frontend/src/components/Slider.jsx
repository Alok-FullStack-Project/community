import React, { useState, useEffect } from "react";

const Slider = () => {
  const images = [
    "https://picsum.photos/id/1018/1200/600",
    "https://picsum.photos/id/1015/1200/600",
    "https://picsum.photos/id/1019/1200/600",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full mx-auto mt-1 overflow-hidden rounded-2xl shadow-lg">
      {/* 🖼️ Image */}
      <img
        src={images[currentIndex]}
        alt="slider"
        className="w-full h-[400px] object-cover transition-all duration-700"
      />

      {/* ◀️ Prev Button */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-6 -translate-y-1/2 bg-black/50 text-white px-4 py-3 rounded-full hover:bg-black/70 transition"
      >
        ❮
      </button>

      {/* ▶️ Next Button */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-6 -translate-y-1/2 bg-black/50 text-white px-4 py-3 rounded-full hover:bg-black/70 transition"
      >
        ❯
      </button>

      {/* ⚪ Dots */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2.5 w-2.5 rounded-full ${
              currentIndex === index ? "bg-white" : "bg-gray-400"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Slider;
