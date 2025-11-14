import React, { useState, useEffect } from "react";

function useImagePreview() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    setCoords({ x: e.pageX + 20, y: e.pageY + 20 });
  };

  useEffect(() => {
    if (previewUrl) {
      window.addEventListener("mousemove", handleMouseMove);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
    }
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [previewUrl]);

  const ImagePreview = () =>
    previewUrl ? (
      <div
        style={{
          position: "absolute",
          top: coords.y,
          left: coords.x,
          zIndex: 9999,
          pointerEvents: "none",
          background: "rgba(255,255,255,0.95)",
          padding: "6px",
          borderRadius: "16px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
          transition: "transform 0.1s ease-out",
        }}
      >
        <img
          src={previewUrl}
          alt="preview"
          style={{
            width: "320px", // ✅ medium-large
            height: "auto",
            maxHeight: "320px",
            objectFit: "cover", // ✅ no stretching
            borderRadius: "12px",
          }}
        />
      </div>
    ) : null;

  return { setPreviewUrl, ImagePreview };
}

export default useImagePreview;
