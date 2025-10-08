// components/landing/Projects.jsx
import React from 'react';

const Projects = () => {
  const projects = [
    {
      title: "Fusión HDPE",
      image: "/images/fusionppr.jpg",
      category: "Sistema de unión"
    },
    {
      title: "Fusión PPR",
      image: "/images/hdpe.jpg", 
      category: "Sistema de tuberías"
    },
    {
      title: "Termografías",
      image: "/images/calor.jpg",
      category: "Análisis térmico"
    },
    {
      title: "Automatización de procesos",
      image: "/images/automatizacion.webp",
      category: "Control industrial"
    },
    {
      title: "Planes de mitigación y contingencia",
      image: "/images/mitigacion.jpg",
      category: "Gestión de riesgos"
    },
 
  ];

  return (
    <section id="proyectos" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Proyectos</h2>
          <p className="text-xl text-gray-600">Cómo abordamos nuestros proyectos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="h-64 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = '/images/otroproyecto.jpg'; // Fallback image
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
                <p className="text-gray-600">{project.category}</p>
                <div className="mt-4">
                  <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                    Ver más
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;