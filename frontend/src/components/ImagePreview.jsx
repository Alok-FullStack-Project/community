import React, { useState } from "react";

const ImagePreview = ({ src, alt = "", className = "" }) => {
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  if (!src) return (
    <img
      src="https://via.placeholder.com/80?text=No+Image"
      alt="no image"
      className={className}
    />
  );

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
    >
      <img
        src={src}
        alt={alt}
        className={`${className} cursor-pointer transition-transform duration-200 hover:scale-105`}
      />

      {hovered && (
        <div
          className="absolute z-50 border bg-white shadow-xl rounded-lg p-2"
          style={{
            top: pos.y + 20,
            left: pos.x + 20,
          }}
        >
          <img
            src={src}
            alt={alt}
            className="w-48 h-48 object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
