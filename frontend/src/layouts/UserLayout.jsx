import React from 'react';
import Sidebar from '../components/Sidebar';
import LogoutButton from '../components/LogoutButton';
import { Outlet } from 'react-router-dom';

const ManagerLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar role="user">
        <div className="mt-auto">
          <LogoutButton />
        </div>
      </Sidebar>
      <main className="flex-1 p-8 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>
        <Outlet />
      </main>
    </div>
  );
};

export default ManagerLayout;
