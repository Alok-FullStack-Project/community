import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '/logo.png'; // ✅ Adjust the path if needed

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* 🔷 Logo + Title */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src={logo}
            alt="Community Portal Logo"
            className="h-15 w-16 rounded-full object-cover border border-gray-300"
          />
          <span className="text-2xl font-bold text-blue-600">
            Community Portal
          </span>
        </Link>

        {/* 🌐 Navigation */}
        <nav className="hidden md:flex space-x-6">
          {[
            { to: '/', label: 'Home' },
            { to: '/about', label: 'About' },
            { to: '/community', label: 'Community' },
            { to: '/events', label: 'Events' },
            { to: '/advertise', label: 'Advertise' },
            { to: '/contact', label: 'Contact' },
          ].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-700 hover:text-blue-600'
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* 👤 Auth Buttons */}
        <div className="hidden md:flex space-x-2">
          {!user ? (
            <>
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
