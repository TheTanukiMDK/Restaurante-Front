import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Utensils } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Inicio' },
  { href: '/categories', label: 'Categorías' },
  { href: '/permissions', label: 'Permisos' },
  { href: '/employee-permissions', label: 'Permisos de Empleados' },
  { href: '/kitchen-orders', label: 'Órdenes de Cocina' },
  { href: '/table-management', label: 'Gestión de Mesas' },
  { href: '/reservations', label: 'Reservaciones' },
];

export default function Navbar() {
  const location = useLocation(); // Obtener la ruta actual

  return (
    <nav className="bg-[#EC8439] p-4 text-white">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold">
          <Utensils />
          <span>RestaurantApp</span>
        </Link>
        <div className="flex space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`hover:text-[#FAB677] ${
                location.pathname === item.href ? 'font-bold underline' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
