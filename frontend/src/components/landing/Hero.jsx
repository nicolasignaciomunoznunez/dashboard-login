// components/landing/Hero.jsx
import React, { useState, useEffect } from 'react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/images/portada4.webp",
      title: "Ingeniería para un",
      highlighted: "futuro sostenible",
      subtitle: "Soluciones innovadoras para plantas de agua potable",
      showButton: false
    },
    {
      image: "/images/portada1.jpg",
      title: "Tu planta de agua",
      highlighted: "Nuestro Compromiso",
      subtitle: "Calidad y eficiencia en cada proyecto",
      showButton: true
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section id="inicio" className="pt-24"> {/* Aumentado el padding-top para compensar header más grande */}
      <div className="relative h-screen overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url('${slide.image}')` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="relative h-full flex items-center">
              <div className="container mx-auto px-4 text-white">
                <div className="max-w-3xl"> {/* Aumentado el max-width */}
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                    {slide.title} <span className="text-blue-400 block">{slide.highlighted}</span>
                  </h1>
                  <p className="text-2xl md:text-3xl mb-8 opacity-90">
                    {slide.subtitle}
                  </p>
                  {slide.showButton && (
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg text-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
                      Contáctanos
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white bg-opacity-50'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;