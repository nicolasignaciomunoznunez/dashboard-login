// components/landing/Counter.jsx
import React from 'react';

const Counter = () => {
  const stats = [
    { number: "30+", label: "Clientes felices", icon: "👥" },
    { number: "60+", label: "Soluciones tecnológicas", icon: "⚙️" },
    { number: "8+", label: "Clientes actuales", icon: "💼" },
    { number: "33+", label: "Proyectos completados", icon: "✅" }
  ];

  return (
    <section className="py-20 bg-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-4">{stat.icon}</div>
              <div className="text-5xl font-bold mb-2">{stat.number}</div>
              <div className="text-xl opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Counter;