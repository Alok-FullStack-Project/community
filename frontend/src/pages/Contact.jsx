import React from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import Footer from '../components/Footer';
import Slider from '../components/Slider';

const Contact = () => {
  return (
    <>
      <Slider />
      <section className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Have any questions or suggestions? We'd love to hear from you!
        </p>
        <form className="mt-6 max-w-lg mx-auto space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border rounded p-2"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full border rounded p-2"
          />
          <textarea
            placeholder="Your Message"
            className="w-full border rounded p-2"
          ></textarea>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Send Message
          </button>
        </form>
      </section>
    </>
  );
};

export default Contact;
