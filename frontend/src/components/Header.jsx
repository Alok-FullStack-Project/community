import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Menu, X, User, LogOut, ChevronDown, 
  Home, Info, Users, Calendar, Megaphone, 
  Mail, LayoutDashboard, Settings, Bell, Search
} from "lucide-react";
import LogoutButton from "./LogoutButton";

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pillRef = useRef(null);
  const itemRefs = useRef({});
  const dropdownRef = useRef(null);

  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Navigation Logic
  const navigation = useMemo(() => [
    { name: "Home", href: "/", icon: <Home size={18} /> },
    { name: "About", href: "/about", icon: <Info size={18} /> },
    { name: "Communities", href: "/community", icon: <Users size={18} /> },
    { name: "Events", href: "/events", icon: <Calendar size={18} /> },
    { name: "Advertise", href: "/advertise", icon: <Megaphone size={18} /> },
    { name: "Contact", href: "/contact", icon: <Mail size={18} /> },
  ], []);

  const menu = useMemo(() => {
  if (user?.role === "admin") return [
    { name: "Admin Dashboard", path: "/dashboard/admin", icon: <LayoutDashboard size={18} /> },
    { name: "Family Directory", path: "/dashboard/admin/family-list", icon: <Users size={18} /> },
    { name: "Village Manager", path: "/dashboard/admin/villages", icon: <Home size={18} /> },
    { name: "Ad Campaigns", path: "/dashboard/admin/advertise", icon: <Megaphone size={18} /> },
    { name: "Manage Events", path: "/dashboard/admin/events", icon: <Calendar size={18} /> },
    { name: "Manage User", path: "/dashboard/admin/user-list", icon: <User size={18} /> },
    // Added Event Link Here
  ];
  
  if (user?.role === "representative") return [
    { name: "Rep Dashboard", path: "/dashboard/representative/family-list", icon: <LayoutDashboard size={18} /> },
  ];
  
  return [{ name: "My Profile", path: "/dashboard/user/family-list", icon: <User size={18} /> }];
}, [user?.role]);

  // Effects
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const pill = pillRef.current;
    const el = itemRefs.current[pathname];
    if (!pill) return;
    if (!el) {
      pill.style.opacity = "0";
      return;
    }
    const { offsetWidth, offsetLeft } = el;
    pill.style.opacity = "1";
    pill.style.width = `${offsetWidth}px`;
    pill.style.left = `${offsetLeft}px`;
  }, [pathname, navigation]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setAvatarOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${
          scrolled 
            ? "bg-white/80 backdrop-blur-xl shadow-sm py-2 border-slate-100" 
            : "bg-white py-4 border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-8">
          
          {/* BRANDING */}
          <Link to="/" className="group flex items-center gap-3 flex-shrink-0 z-[110]">
            <div className="relative">
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-indigo-500 to-indigo-300 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-500" />
              <img
                src="/logo.jpeg"
                className="relative rounded-2xl h-11 w-11 md:h-12 md:w-12 shadow-sm object-cover transition-transform duration-500 group-hover:scale-105"
                alt="Logo"
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-black text-slate-900 leading-tight text-lg tracking-tight">
                42 Kadva  <span className="text-indigo-600">Patidar</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Sathamba Samaj Portal</span>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden lg:flex items-center bg-slate-100/50 p-1 rounded-2xl relative">
            <span ref={pillRef} className="absolute h-[calc(100%-8px)] bg-white rounded-xl shadow-sm transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]" />
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                ref={(el) => (itemRefs.current[item.href] = el)}
                className={`relative px-5 py-2 text-[13px] font-black uppercase tracking-wider transition-colors z-10 ${
                  pathname === item.href ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* ACTION GROUP */}
          <div className="flex items-center gap-3">
            {!user ? (
              <div className="flex items-center gap-2">
                <Link to="/login" className="hidden md:block px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-600 hover:text-indigo-600 transition-colors">Login</Link>
                <Link to="/register" className="px-6 py-2.5 text-xs font-black uppercase tracking-widest bg-slate-900 text-white rounded-xl hover:bg-indigo-600 shadow-lg shadow-slate-200 transition-all active:scale-95">Join</Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* <button className="hidden sm:flex p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors relative">
                  <Bell size={20} />
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white" />
                </button> */}

                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setAvatarOpen(!avatarOpen)}
                    className="group flex items-center gap-2 p-1 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all duration-300"
                  >
                    <img 
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff&bold=true`} 
                      className="h-9 w-9 rounded-xl object-cover" 
                      alt="user"
                    />
                    <div className="hidden md:block text-left px-1">
                      <p className="text-[11px] font-black text-slate-900 leading-none">{user.name.split(' ')[0]}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{user.role}</p>
                    </div>
                    <ChevronDown size={14} className={`text-slate-400 mr-1 transition-transform duration-300 ${avatarOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* DROP-DOWN MENU */}
                  {avatarOpen && (
                    <div className="absolute right-0 mt-4 w-64 bg-white rounded-[2rem] shadow-2xl shadow-indigo-100 border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                      <div className="p-5 bg-indigo-600 text-white">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Verified Member</p>
                        <p className="text-sm font-bold truncate mt-1">{user.name}</p>
                        <p className="text-[11px] opacity-80 truncate">{user.email}</p>
                      </div>
                      
                      <div className="p-3 space-y-1">
                        {menu.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setAvatarOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                          >
                            <span className="p-2 bg-slate-50 rounded-lg group-hover:bg-white transition-colors">{item.icon}</span>
                            {item.name}
                          </Link>
                        ))}
                        
                      </div>

                      <div className="p-3 bg-slate-50 border-t border-slate-100">
                        <LogoutButton className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={() => setOpen(true)}
              className="lg:hidden p-3 rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-200 active:scale-90 transition-transform"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      <div 
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[150] transition-opacity duration-500 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setOpen(false)}
      />

      <div 
        className={`fixed top-4 bottom-4 right-4 w-[300px] bg-white z-[160] rounded-[2.5rem] shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          open ? "translate-x-0" : "translate-x-[120%]"
        }`}
      >
        <div className="flex flex-col h-full p-8">
          <div className="flex items-center justify-between mb-10">
            <span className="text-[10px] font-black tracking-[0.3em] text-indigo-600 uppercase">Navigation</span>
            <button 
              onClick={() => setOpen(false)} 
              className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-4 p-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                  pathname === item.href 
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100" 
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>

          {!user && (
            <div className="pt-8 border-t border-slate-100 space-y-4">
              <Link to="/login" onClick={() => setOpen(false)} className="block w-full text-center py-4 font-black uppercase tracking-widest text-slate-900 text-xs">Sign In</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="block w-full text-center py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100">Join Community</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}