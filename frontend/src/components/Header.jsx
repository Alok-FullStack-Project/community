import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Menu, X, User, LogOut, ChevronDown, 
  Home, Info, Users, Calendar, Megaphone, Mail, LayoutDashboard 
} from "lucide-react";
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
  const dropdownRef = useRef(null);

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const navigation = useMemo(() => {
    const base = [
      { name: "Home", href: "/", icon: <Home size={18} /> },
       { name: "About", href: "/about", icon: <Info size={18} /> },
      { name: "Communities", href: "/community", icon: <Users size={18} /> },
      { name: "Events", href: "/events", icon: <Calendar size={18} /> },
      { name: "Advertise", href: "/advertise", icon: <Megaphone size={18} /> },
      { name: "Contact", href: "/contact", icon: <Mail size={18} /> },
    ];

    let roleItems = [];
    if (user?.role === "admin") {
      roleItems = [{ name: "Dashboard", href: "/dashboard/admin", icon: <LayoutDashboard size={18} /> }];
    } else if (user?.role === "representative") {
      roleItems = [{ name: "Dashboard", href: "/dashboard/representative/family-list", icon: <LayoutDashboard size={18} /> }];
    } else if (user?.role === "user") {
      roleItems = [{ name: "Dashboard", href: "/dashboard/user/family-list", icon: <LayoutDashboard size={18} /> }];
    }

    return [...base, ...roleItems];
  }, [user?.role]);

  // Handle Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Handle Active Pill Animation
  useEffect(() => {
    const pill = pillRef.current;
    const el = itemRefs.current[pathname];
    if (!pill || !el) {
      if (pill) pill.style.opacity = "0";
      return;
    }
    const { offsetWidth, offsetLeft } = el;
    pill.style.opacity = "1";
    pill.style.width = `${offsetWidth}px`;
    pill.style.transform = `translateX(${offsetLeft}px)`;
  }, [pathname, navigation]);

  // Handle Outside Click for Avatar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAvatarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close Mobile Menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled 
            ? "bg-white/95 backdrop-blur-lg shadow-md py-1" 
            : "bg-white py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          
          {/* LOGO */}
          <Link to="/" className="group flex items-center gap-4 z-[110]">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
              <img
                src="/logo.jpeg"
                className="relative rounded-full border-2 border-white shadow-lg h-12 w-12 md:h-14 md:w-14"
                alt="Logo"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 text-base md:text-lg">42 Kadva <span className="text-indigo-600">Patidar</span></span>
              <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Samaj Portal</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1 relative">
            <span ref={pillRef} className="absolute bottom-[-4px] h-1 bg-indigo-600 rounded-full transition-all duration-300 ease-out" />
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                ref={(el) => (itemRefs.current[item.href] = el)}
                className={`px-4 py-2 text-sm font-bold transition-colors ${
                  pathname === item.href ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {!user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="px-5 py-2 text-sm font-bold text-slate-700">Sign In</Link>
                <Link to="/register" className="px-5 py-2 text-sm font-bold bg-indigo-600 text-white rounded-full">Join</Link>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setAvatarOpen(!avatarOpen)}
                  className="flex items-center gap-2 p-1 pr-3 rounded-full border border-slate-200 bg-white"
                >
                  <img 
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} 
                    className="h-8 w-8 rounded-full" 
                    alt="user"
                  />
                  <ChevronDown size={14} className={`transition-transform ${avatarOpen ? 'rotate-180' : ''}`} />
                </button>

                {avatarOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                    </div>
                    
                    {/* This container ensures the button has equal padding on all sides */}
                    <div className="p-3">
                      <LogoutButton className="w-full justify-center" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Toggle Button */}
            <button
              onClick={() => setOpen(true)}
              className="xl:hidden p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-indigo-50"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* ================= MOBILE DRAWER FIXED ================= */}
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[150] transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Drawer Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-[280px] bg-white z-[160] shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <span className="font-black text-indigo-600">MENU</span>
            <button onClick={() => setOpen(false)} className="p-2 rounded-full bg-slate-50"><X size={20} /></button>
          </div>

          <nav className="space-y-2 flex-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${
                  pathname === item.href 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>

          {!user && (
            <div className="mt-auto space-y-3 pt-6 border-t">
              <Link to="/login" className="block w-full text-center py-3 font-bold text-slate-700">Login</Link>
              <Link to="/register" className="block w-full text-center py-3 font-bold bg-indigo-600 text-white rounded-xl">Join Now</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}