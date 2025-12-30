// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Instagram, 
  Twitter, 
  Globe, 
  ArrowRight 
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B1221] text-slate-400 pt-16 pb-8 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

        {/* SECTION 1: LOGO & IDENTITY */}
        <div className="flex flex-col items-center lg:items-start space-y-5">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <img
              src="/logo.jpeg"
              alt="42 Kadva Patidar Samaj Logo"
              className="relative h-20 w-20 rounded-full border-2 border-slate-800 object-cover"
            />
          </div>
          
          <div className="text-center lg:text-left">
            <h3 className="text-xl font-bold text-white tracking-tight">
              42 Kadva <span className="text-indigo-400">Patidar Samaj</span>
            </h3>
            <p className="mt-3 text-sm leading-relaxed max-w-xs">
              Empowering our community through digital connection. Stay updated with events, family networks, and cultural heritage.
            </p>
          </div>
        </div>

        {/* SECTION 2: NAVIGATION LINKS */}
        <div className="flex flex-col items-center lg:items-start">
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em] mb-6">
            Explore
          </h4>
          <ul className="grid grid-cols-2 lg:grid-cols-1 gap-y-3 gap-x-8 text-sm">
            {[
              { name: "Home", path: "/" },
              // { name: "About Us", path: "/about" },
              { name: "Communities", path: "/community" },
              { name: "Events", path: "/events" },
              { name: "Advertise", path: "/advertise" },
              { name: "Contact", path: "/contact" }
            ].map((link) => (
              <li key={link.name}>
                <Link 
                  to={link.path} 
                  className="group flex items-center hover:text-white transition-colors duration-300"
                >
                  <ArrowRight size={12} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-indigo-500" />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* SECTION 3: CONTACT INFO */}
        <div className="flex flex-col items-center lg:items-start">
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em] mb-6">
            Get In Touch
          </h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3 group">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-indigo-500 transition-colors">
                <MapPin size={16} className="text-indigo-400" />
              </div>
              <span className="leading-snug">
                42 Kadva Patidar Samaj<br />
                <span className="text-slate-500">Sathamba, Gujarat 383340, India</span>
              </span>
            </li>
            
            <li className="flex items-center gap-3 group">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-indigo-500 transition-colors">
                <Phone size={16} className="text-indigo-400" />
              </div>
              <a href="tel:+919427022568" className="hover:text-white transition-colors">
                +91 94270 22568
              </a>
            </li>

            <li className="flex items-center gap-3 group">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-indigo-500 transition-colors">
                <Mail size={16} className="text-indigo-400" />
              </div>
              <a href="mailto:hello@community.com" className="hover:text-white transition-colors">
                hello@community.com
              </a>
            </li>
          </ul>
        </div>

        {/* SECTION 4: SOCIAL CONNECT */}
        <div className="flex flex-col items-center lg:items-start">
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em] mb-6">
            Follow Our Journey
          </h4>
          <p className="text-xs text-slate-500 mb-6 text-center lg:text-left">
            Connect with us on social media for real-time community updates.
          </p>
          <div className="flex gap-3">
            {[
              { icon: <Facebook size={18} />, href: "#", color: "hover:bg-blue-600" },
              { icon: <Instagram size={18} />, href: "#", color: "hover:bg-pink-600" },
              { icon: <Twitter size={18} />, href: "#", color: "hover:bg-sky-500" },
              { icon: <Globe size={18} />, href: "#", color: "hover:bg-indigo-600" }
            ].map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                className={`p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all duration-300 hover:-translate-y-1 ${social.color} hover:border-transparent shadow-lg`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* COPYRIGHT AREA */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-800/50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[13px]">
          <p className="text-slate-500">
            © {currentYear} <span className="text-slate-300 font-semibold">42 Kadva Patidar Samaj</span>. All rights reserved.
          </p>
          <div className="flex gap-6 text-slate-500">
            <Link to="/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-indigo-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}