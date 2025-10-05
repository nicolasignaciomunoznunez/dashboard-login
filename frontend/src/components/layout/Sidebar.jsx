import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: '📊' },
    { name: 'Plantas', href: '/plantas', icon: '🏭' },
    { name: 'Incidencias', href: '/incidencias', icon: '⚠️' },
    { name: 'Mantenimiento', href: '/mantenimientos', icon: '🔧' },
    { name: 'Reportes', href: '/reportes', icon: '📈' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 shadow-sm">
          <h1 className="text-xl font-bold text-primary-600">Sistema Plantas</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors ${
                  isActive ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600' : ''
                }`
              }
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}