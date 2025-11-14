import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* About */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">
            About Community
          </h3>
          <p className="text-sm">
            A connected family portal bringing together people, events, and
            stories from our community.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-blue-400">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-400">
                About
              </Link>
            </li>
            <li>
              <Link to="/community" className="hover:text-blue-400">
                Community
              </Link>
            </li>
            <li>
              <Link to="/events" className="hover:text-blue-400">
                Events
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-blue-400">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-white">Contact Us</h3>
          <p>
            Email:{' '}
            <a href="mailto:info@community.com" className="hover:text-blue-400">
              info@community.com
            </a>
          </p>
          <p>
            Phone:{' '}
            <a href="tel:+919999999999" className="hover:text-blue-400">
              +91 99999 99999
            </a>
          </p>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Community Portal. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
