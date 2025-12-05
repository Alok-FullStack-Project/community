import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ role, children }) => {
  const adminMenu = [
    { name: 'Family List', path: '/dashboard/admin/family-list' },
    { name: 'Add Family', path: '/dashboard/admin/add-family' },
    { name: 'Villages', path: '/dashboard/admin/villages' }, // NEW
    { name: 'Advertise', path: '/dashboard/admin/advertise' }, // NEW
    { name: 'Events', path: '/dashboard/admin/events' }, // NEW
     { name: 'Categories', path: '/dashboard/admin/categories' }, // NEW
    { name: 'users', path: '/dashboard/admin/user-list' }, // NEW
    { name: 'Go To Frontend', path: '/' },
  ];  

  const managerMenu = [
    { name: 'Family List', path: '/dashboard/representative/family-list' },
     { name: 'Go To Frontend', path: '/' },

  ]; {/*{ name: 'Add Family', path: '/dashboard/representative/add-family' }, */}

  const menu = role === 'admin' ? adminMenu : managerMenu;

  return (
    <aside className="flex flex-col w-64 bg-gray-800 text-gray-200 min-h-screen p-4">
      <div className="p-6 font-bold text-xl text-white">Dashboard</div>

      {/* Menu links */}
      <nav className="flex-1 flex flex-col space-y-2">
        {menu.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Render children (logout button) at the bottom */}
      {children && <div className="mt-auto">{children}</div>}
    </aside>
  );
};

export default Sidebar;
