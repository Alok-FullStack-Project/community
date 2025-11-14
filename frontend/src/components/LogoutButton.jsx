import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');

    // Optionally clear other user data
    localStorage.removeItem('user');

    // Redirect to login page
    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
