// layouts/AdminLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from '../components/Header';
import Footer from '../components/Footer';

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 container mx-auto p-0">
     
            <Outlet />
          </main>
          <Footer />
    </div>
  );
};

export default AdminLayout;
