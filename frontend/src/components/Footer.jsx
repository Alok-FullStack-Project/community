// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#0d1b2a] text-slate-300 mt-12 pt-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* LOGO + ABOUT */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <img
            src="/logo.jpeg"
            alt="Logo"
            className="h-20 w-20 rounded-full border border-indigo-500 shadow-md mb-4"
          />

          <h3 className="text-lg font-semibold text-indigo-300 tracking-wide mb-2">
            42 Kadva Patidar Samaj
          </h3>

          <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
            Bringing people together — community updates, events, family
            connections, and local activities all in one place.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="flex flex-col items-center lg:items-start">
          <h4 className="text-sm font-semibold text-indigo-300 mb-4 uppercase tracking-wide">
            Quick Links
          </h4>

          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-indigo-400">Home</Link></li>
            <li><Link to="/about" className="hover:text-indigo-400">About</Link></li>
            <li><Link to="/community" className="hover:text-indigo-400">Communities</Link></li>
            <li><Link to="/events" className="hover:text-indigo-400">Events</Link></li>
            <li><Link to="/advertise" className="hover:text-indigo-400">Advertise</Link></li>
            <li><Link to="/contact" className="hover:text-indigo-400">Contact</Link></li>
          </ul>
        </div>

        {/* CONTACT SECTION */}
        <div className="flex flex-col items-center lg:items-start">
          <h4 className="text-sm font-semibold text-indigo-300 mb-4 uppercase tracking-wide">
            Contact Us
          </h4>

          <ul className="space-y-3 text-sm">
            {/* Address */}
            <li className="flex items-start gap-3">
              <span className="text-indigo-400 text-lg">📍</span>
              <p className="text-slate-300 leading-snug">
                42 Kadva Patidar Samaj<br />
                Mumbai, Maharashtra, India
              </p>
            </li>

            {/* Phone */}
            <li className="flex items-center gap-3">
              <span className="text-indigo-400 text-lg">📞</span>
              <a
                href="tel:+919876543210"
                className="hover:text-indigo-400 transition"
              >
                +91 98765 43210
              </a>
            </li>

            {/* Email */}
            <li className="flex items-center gap-3">
              <span className="text-indigo-400 text-lg">📧</span>
              <a
                href="mailto:support@communityportal.com"
                className="hover:text-indigo-400 transition"
              >
                support@communityportal.com
              </a>
            </li>
          </ul>
        </div>

        {/* SOCIAL MEDIA */}
        <div className="flex flex-col items-center lg:items-start">
          <h4 className="text-sm font-semibold text-indigo-300 mb-4 uppercase tracking-wide">
            Follow Us
          </h4>

          <div className="flex gap-5 text-2xl">
            <a href="#" className="hover:text-indigo-400 transition hover:scale-110">🌐</a>
            <a href="#" className="hover:text-indigo-400 transition hover:scale-110">📘</a>
            <a href="#" className="hover:text-indigo-400 transition hover:scale-110">🐦</a>
            <a href="#" className="hover:text-pink-400 transition hover:scale-110">📸</a>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="mt-10 border-t border-slate-700 py-4 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} <b>42 Kadva Patidar Samaj</b>. All rights reserved.
      </div>
    </footer>
  );
}
