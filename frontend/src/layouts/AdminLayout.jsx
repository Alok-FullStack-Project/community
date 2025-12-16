// layouts/AdminLayout.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar role="admin">
        <LogoutButton />
      </Sidebar>

      <main className="flex-1 p-8">
        <Outlet /> {/* Each page loads here */}
      </main>
    </div>
  );
};

export default AdminLayout;
