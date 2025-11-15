import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '/logo.png';

const Header = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // 🔷 Compute Dashboard Link
  let dashboardLink = '/';
  if (user) {
    if (user.role === 'admin') dashboardLink = '/dashboard/admin/family-list';
    else if (user.role === 'representative')
      dashboardLink = '/dashboard/representative/family-list';
    else if (user.role === 'user')
      dashboardLink = '/dashboard/user/family-list';
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/community', label: 'Community' },
    { to: '/events', label: 'Events' },
    { to: '/advertise', label: 'Advertise' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* 🔷 Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src={logo}
            alt="Community Portal Logo"
            className="h-14 w-14 rounded-full object-cover border border-gray-300"
          />
          <span className="text-2xl font-bold text-blue-600">
            {/* Community Portal */}
          </span>
        </Link>

        {/* 🌐 Navigation */}
        <nav className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
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
            <>
              <Link
                to={dashboardLink}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Go To Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
