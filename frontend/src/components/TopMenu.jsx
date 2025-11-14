import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function TopMenu() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="text-xl font-bold">
          <Link to="/">CommunitySite</Link>
        </div>
        <nav className="space-x-4 hidden md:block">
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <Link to="/about" className="hover:underline">
            About
          </Link>
          <Link to="/community" className="hover:underline">
            Community
          </Link>
          <Link to="/events" className="hover:underline">
            Events
          </Link>
          <Link to="/advertise" className="hover:underline">
            Advertise
          </Link>
          <Link to="/contact" className="hover:underline">
            Contact
          </Link>
        </nav>
        <div>
          {user ? (
            <div className="flex items-center gap-3">
              <span>{user.name}</span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-2">
              <Link to="/login" className="px-3 py-1 border rounded">
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
