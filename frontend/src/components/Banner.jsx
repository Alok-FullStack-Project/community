import React from 'react';

const Banner = ({ title, image, subtitle, ctaText, ctaLink }) => {
  return (
    <section
      className="relative h-64 md:h-96 bg-cover bg-center flex items-center justify-center transition-transform duration-500 hover:scale-105"
      style={{
        backgroundImage: `linear-gradient(
          rgba(0,0,0,0.4), 
          rgba(0,0,0,0.6)
        ), url(${
          image ||
          'https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1350&q=80'
        })`,
      }}
    >
      <div className="text-center px-4 md:px-8">
        <h1 className="text-white text-3xl md:text-5xl font-extrabold drop-shadow-lg mb-2 animate-fadeIn">
          {title}
        </h1>
        {subtitle && (
          <p className="text-white text-lg md:text-2xl font-medium mb-4 drop-shadow-md animate-fadeIn delay-200">
            {subtitle}
          </p>
        )}
        {ctaText && ctaLink && (
          <a
            href={ctaLink}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105 animate-fadeIn delay-400"
          >
            {ctaText}
          </a>
        )}
      </div>
    </section>
  );
};

export default Banner;
