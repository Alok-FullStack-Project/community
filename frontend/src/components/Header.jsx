// src/components/Header.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navRef = useRef(null);
  const pillRef = useRef(null);
  const itemRefs = useRef({});
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  
const navigationBase = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Communities", href: "/community" },
  { name: "Events", href: "/events" },
  { name: "Advertise", href: "/advertise" },
  { name: "Contact", href: "/contact" },
];

// 👇 Single variable for role-based menu
let roleItems = [];

if (user?.role === "admin") {
  roleItems = [
    { name: "Dashboard", href: "/dashboard/admin" },
  ];
} 
else if (user?.role === "representative") {
  roleItems = [
    { name: "Dashboard", href: "/dashboard/representative/family-list" },
  ];
} 
else if (user?.role === "user") {
  roleItems = [
    { name: "Dashboard", href: "/dashboard/user/family-list" },
  ];
}

const navigation = [...navigationBase, ...roleItems];

  // Sticky shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active pill animation
  useEffect(() => {
    const pill = pillRef.current;
    const nav = navRef.current;
    const el = itemRefs.current[pathname];

    if (!pill || !nav || !el) return;

    const navRect = nav.getBoundingClientRect();
    const rect = el.getBoundingClientRect();

    pill.style.width = `${rect.width}px`;
    pill.style.transform = `translateX(${rect.left - navRect.left}px)`;
  }, [pathname, navigation, open]);

  // Prevent page scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };
  // Logout actions menu
  const handleAvatarAction = (action) => {
    setAvatarOpen(false);
    if (action === "profile") navigate("/profile");
    if (action === "edit") navigate("/profile/edit");
    if (action === "ads") navigate("/my/advertisements");
    if (action === "events") navigate("/my/events");
    if (action === "password") navigate("/account/change-password");
    if (action === "logout") handleLogout();
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md min-h-[90px]">


      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1 flex items-center justify-between">

        {/* Logo */}
        <Link
  to="/"
  className="flex flex-col items-center justify-center text-center z-50 leading-tight"
>
  <img
    src="/logo.jpeg"
    className="h-12 w-12 md:h-14 md:w-14 rounded-full shadow-sm border bg-white"
    alt="logo"
  />

  <span className="mt-1 font-bold tracking-wide text-[13px] md:text-sm text-indigo-700">
    42 Kadva Patidar Samaj
  </span>
</Link>





        {/* Desktop Nav */}
        <nav ref={navRef} className="hidden md:flex items-center gap-8 relative">
          {/* Animated Active Pill */}
          <span
            ref={pillRef}
            className="absolute bottom-0 h-[3px] bg-indigo-600 rounded transition-all duration-300"
            style={{ width: 0, transform: "translateX(-9999px)" }}
          />

          {navigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              ref={(el) => (itemRefs.current[item.href] = el)}
              className={`text-sm font-medium py-2 transition 
                ${pathname === item.href ? "text-indigo-600" : "text-slate-700 hover:text-indigo-600"}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-4">

          {/* Desktop Auth / Avatar */}
          {!user ? (
            <div className="hidden md:flex gap-3">
              <Link
                to="/register"
                className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg text-sm"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <div className="relative hidden md:block">
                           <LogoutButton />

             {/* <button
                onClick={() => setAvatarOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <img
                  src={user.avatar || "/assets/default-avatar.png"}
                  className="h-8 w-8 rounded-full border"
                  alt=""
                />
                <span className="text-sm">{user.name}</span>
              </button>*/} 

{avatarOpen && (
  <div className="dropdown-menu absolute right-0 mt-3 w-52 z-[99999] rounded-xl shadow-xl border border-gray-700">
    {/* <button onClick={() => handleAvatarAction("profile")} className="block w-full text-left px-4 py-3">Profile</button>
   <button onClick={() => handleAvatarAction("edit")} className="block w-full text-left px-4 py-3">Edit Profile</button>
    <button onClick={() => handleAvatarAction("ads")} className="block w-full text-left px-4 py-3">My Advertisements</button>
    <button onClick={() => handleAvatarAction("events")} className="block w-full text-left px-4 py-3">My Events</button>
    <button onClick={() => handleAvatarAction("password")} className="block w-full text-left px-4 py-3">Change Password</button>
    <button onClick={() => handleAvatarAction("logout")} className="block w-full text-left px-4 py-3 text-red-400">Logout</button>*/}
  </div>
)}

            </div>
          )}

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setOpen(true)}
            className="md:hidden p-2 border rounded-lg hover:bg-gray-100"
          >
            <svg className="h-6 w-6 text-slate-700" stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

        </div>
      </div>

      {/* Mobile Overlay */}
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] transition-opacity 
        ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setOpen(false)}
        />


      {/* Mobile Drawer */}
      <aside className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-[10000]
        transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>

        <div className="p-6 flex flex-col h-full">

          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-indigo-700 text-lg">Menu</h3>
            <button onClick={() => setOpen(false)} className="text-2xl">✕</button>
          </div>

          <nav className="flex flex-col gap-3">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className={`py-3 px-3 rounded-lg text-base 
                ${pathname === item.href ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-gray-100"}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="mt-6 border-t pt-4">
            {!user ? (
              <div className="flex flex-col gap-3">
                <Link to="/register" onClick={() => setOpen(false)} className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg text-center">Register</Link>
                <Link to="/login" onClick={() => setOpen(false)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-center">Sign In</Link>
              </div>
            ) : (
              <>
                <button onClick={() => { handleAvatarAction("profile"); setOpen(false); }} className="w-full text-left px-4 py-3 rounded-lg border">Profile</button>
                <button onClick={() => { handleAvatarAction("logout"); setOpen(false); }} className="w-full text-left px-4 py-3 rounded-lg bg-red-500 text-white mt-2">Logout</button>
              </>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-auto pt-6">
            © {new Date().getFullYear()} Community Portal
          </p>
        </div>
      </aside>
    </header>
  );
}
