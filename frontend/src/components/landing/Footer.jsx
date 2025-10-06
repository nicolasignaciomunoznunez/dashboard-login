// components/landing/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16"> {/* Aumentado el padding */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo MUCHO más grande */}
          <div className="text-center md:text-left">
            <img 
              src="/images/finalogotr.png" 
              alt="RYV SPA" 
              className="h-32 w-auto mx-auto md:mx-0 mb-6" // Aumentado de h-20 a h-28
              onError={(e) => {
                e.target.src = '/images/finalogo.jpeg';
              }}
            />
            <p className="text-gray-400 mt-4 text-lg leading-relaxed">
              Soluciones integrales para plantas de agua potable
            </p>
          </div>

          {/* Soporte */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Soporte 24/7</h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              Estamos disponibles para emergencias las 24 horas del día.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Información de contacto</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-blue-400 mr-4 mt-1 text-xl">📍</span>
                <span className="text-gray-400 text-lg">Ubicación: Quinta Normal 4830</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-400 mr-4 text-xl">📞</span>
                <span className="text-gray-400 text-lg">Teléfono: +56 937492604</span>
              </div>
              <div className="flex items-center">
                <span className="text-blue-400 mr-4 text-xl">✉️</span>
                <span className="text-gray-400 text-lg">Email: contacto@ryvspa.com</span>
              </div>
            </div>
          </div>

          {/* Horario */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Horario de Trabajo</h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex justify-between text-lg">
                <span>Lunes - Miércoles</span>
                <span>08:00 - 20:00</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Jueves - Viernes</span>
                <span>09:00 - 18:00</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Sábados - Domingos</span>
                <span>10:00 - 14:00</span>
              </div>
              <div className="flex justify-between text-blue-400 font-semibold text-lg mt-4 pt-4 border-t border-gray-700">
                <span>Emergencias:</span>
                <span>+56 965368132</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-800 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-lg">
            &copy; 2025 R&V SPA. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;