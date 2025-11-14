// layouts/AdminLayout.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar role="admin">
        <div className="mt-auto">
          <LogoutButton />
        </div>
      </Sidebar>
      <main className="flex-1 p-8 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
