// components/landing/FAQ.jsx
import React, { useState } from 'react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "¿Cómo se manejan las emergencias, como cortes o fallas en el sistema de distribución?",
      answer: "Tenemos un protocolo de emergencia para actuar de manera inmediata ante cualquier fallo en el sistema, asegurando la pronta restauración del servicio."
    },
    {
      question: "¿Cuáles son los costos asociados al mantenimiento de sistemas de agua potable rural?",
      answer: "Los costos varían según el tipo de servicio requerido, el tamaño de la planta y la frecuencia de mantenimiento, por lo que ofrecemos presupuestos personalizados."
    },
    {
      question: "¿Qué tipos de servicios de mantenimiento ofrecen para sistemas de agua potable rural?",
      answer: "Ofrecemos mantenimiento preventivo y correctivo de bombas, tuberías, filtros y sistemas de distribución. También brindamos automatización de procesos, análisis y gestión energética, y control y gestión de planta."
    }
  ];

  const progressItems = [
    { label: "Trabajo Calificado", percent: 100 },
    { label: "Servicio de calidad", percent: 100 },
    { label: "Mantenimiento continuo", percent: 100 }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Progress Bars */}
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-8">Preguntas Frecuentes</h3>
            
            <div className="space-y-6">
              {progressItems.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-700">{item.label}</span>
                    <span className="text-blue-600 font-bold">{item.percent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${item.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Accordion */}
          <div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors font-medium text-gray-800 flex justify-between items-center"
                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  >
                    <span>{faq.question}</span>
                    <span className="text-blue-600 text-xl">
                      {activeIndex === index ? '−' : '+'}
                    </span>
                  </button>
                  {activeIndex === index && (
                    <div className="px-6 py-4 bg-white">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;