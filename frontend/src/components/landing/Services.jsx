// components/landing/Services.jsx
import React from 'react';

const Services = () => {
  const services = [
    {
      title: "Planes de contingencia y mitigación",
      description: "Elaboramos estrategias integrales para anticipar y responder de manera efectiva a situaciones imprevistas, minimizando riesgos y asegurando la continuidad operativa.",
      icon: "🛡️"
    },
    {
      title: "Mantenimiento eléctrico",
      description: "Realizamos inspecciones, reparaciones y optimización de sistemas eléctricos para garantizar su funcionamiento, prevenir fallas y extender su vida útil.",
      icon: "⚡"
    },
    {
      title: "Mantenimiento Industrial",
      description: "Garantizamos la operatividad y seguridad de equipos y sistemas mediante inspecciones, reparaciones y mejoras, optimizando su rendimiento y vida útil.",
      icon: "🔧"
    },
    {
      title: "Automatización de procesos",
      description: "Diseñamos e implementamos soluciones tecnológicas para optimizar tareas, mejorar la eficiencia, reducir costos y aumentar la productividad operativa.",
      icon: "🤖"
    },
    {
      title: "Control y gestión de la planta",
      description: "Implementamos sistemas para supervisar, optimizar y coordinar procesos productivos, garantizando eficiencia, seguridad y mejores resultados operativos.",
      icon: "📊"
    },
    {
      title: "Análisis y Gestión Energética",
      description: "Realizamos auditorías energéticas, identificamos oportunidades de ahorro y diseñamos estrategias para optimizar el consumo y mejorar la eficiencia energética.",
      icon: "💡"
    }
  ];

  return (
    <section id="servicios" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className="text-2xl text-blue-600 font-semibold mb-4">Nuestros servicios</h3>
          <h2 className="text-4xl font-bold text-gray-800 max-w-3xl mx-auto">
            Proveemos soluciones integrales adaptadas a tus necesidades industriales, optimizando recursos y garantizando eficiencia en cada proyecto.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8 border border-gray-100">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;