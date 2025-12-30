// src/components/Sidebar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ role, children }) => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const adminMenu = [
    { name: "Dashboard", path: "/dashboard/admin", icon: "📊" },
    { name: "Family List", path: "/dashboard/admin/family-list", icon: "👨‍👩‍👧" },
    // { name: "Add Family", path: "/dashboard/admin/add-family", icon: "➕" },
    { name: "Villages", path: "/dashboard/admin/villages", icon: "🏡" },
    { name: "Advertise", path: "/dashboard/admin/advertise", icon: "📢" },
    { name: "Events", path: "/dashboard/admin/events", icon: "🎉" },
   
    { name: "Users", path: "/dashboard/admin/user-list", icon: "👥" },
    { name: "Go To Frontend", path: "/", icon: "🌐", external: true },
  ];
  {/* { name: "Categories", path: "/dashboard/admin/categories", icon: "🗂️" },*/}

  const managerMenu = [
    { name: "Family List", path: "/dashboard/representative/family-list", icon: "👨‍👩‍👧" },
    { name: "Go To Frontend", path: "/", icon: "🌐", external: true },
  ];

  const userMenu = [
    { name: "Family List", path: "/dashboard/user/family-list", icon: "👨‍👩‍👧" },
    { name: "Go To Frontend", path: "/", icon: "🌐", external: true },
  ];

  const menu = role === "admin" ? adminMenu : role === "representative" ?   managerMenu : userMenu;

  return (
    <>
      {/* Mobile hamburger */}
      <button
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-[60] bg-slate-900 text-white p-2 rounded-lg shadow-lg"
      >
        ☰
      </button>

      {/* Backdrop for mobile */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity ${
          open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-full md:h-auto z-50
          w-72 max-w-[86%] md:w-64
          bg-gradient-to-b from-slate-900 to-slate-800 text-gray-200
          flex flex-col shadow-2xl transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-[110%] md:translate-x-0"}
        `}
      >
        {/* Header / Logo */}
        <div className="px-6 py-6 border-b border-slate-700">
          <div className="flex items-center gap-3 justify-center">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/logo.jpeg"
                alt="logo"
                className="h-12 w-12 md:h-14 md:w-14 rounded-full shadow-sm border bg-white"
              />
              <div className="text-left">
                <div className="text-sm font-bold text-indigo-300">42 Kadva Patidar Samaj</div>
                <div className="text-xs text-slate-400">
                  {role === "admin" ? "Admin Panel" : role === "representative" ? "Representative" : 'user'}</div>
              </div>
            </Link>
          </div>

          {/* close button on mobile */}
          <div className="md:hidden mt-4 flex justify-center">
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600"
            >
              Close
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {menu.map((item) => {
            const active = pathname === item.path;
            const baseClasses = `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all`;
            const activeClasses = "bg-indigo-600 text-white shadow-md";
            const inactiveClasses = "text-gray-300 hover:bg-slate-700 hover:text-white";

            if (item.external) {
              // external link: open in new tab
              return (
                <a
                  key={item.name}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className={`${baseClasses} ${inactiveClasses}`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </a>
              );
            }

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
                aria-current={active ? "page" : undefined}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer / children */}
        {children && (
          <div className="p-4 border-t border-slate-700 mt-auto">
            <div onClick={() => setOpen(false)}>{/* ensure mobile closes when clicked */}
              {/*
                Expectation: `children` will be a clickable element (logout button).
                Keep styles minimal here; the consumer can pass a button/link as children.
              */}
              <div className="w-full">{children}</div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
