import React, { useState } from "react";
import Slider from "../components/Slider";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const whatsappNumber = "919876543210"; // Change to your official number

  // ------------------ VALIDATION ------------------ //
  const validate = () => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Enter a valid email.";

    if (!form.message.trim()) newErrors.message = "Message cannot be empty.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ------------------ FORM SUBMIT ------------------ //
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess("Thank you! Your message has been sent successfully.");
      setForm({ name: "", email: "", message: "" });
      setErrors({});
    }, 1200);
  };

  return (
    <>
      <Slider />

      <section className="px-6 py-12 bg-gradient-to-b from-indigo-50 to-white min-h-screen">
        <div className="max-w-6xl mx-auto">

          {/* HEADER */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-800 drop-shadow-sm">
              Contact Us
            </h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
              Have questions or need support? Reach out — we are here to help!
            </p>
          </div>

          {/* MAIN WRAPPER */}
          <div className="grid md:grid-cols-2 gap-10">

            {/* LEFT SIDE INFO */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Contact Information
              </h3>

              {/* Phone */}
              <div className="flex items-center gap-4 mb-5">
                <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">📞</div>
                <div>
                  <p className="font-semibold">Phone</p>
                  <p>+91 98765 43210</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 mb-5">
                <div className="bg-green-100 text-green-600 p-3 rounded-full">📧</div>
                <div>
                  <p className="font-semibold">Email</p>
                  <p>support@communityportal.com</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-center gap-4 mb-5">
                <div className="bg-pink-100 text-pink-600 p-3 rounded-full">📍</div>
                <div>
                  <p className="font-semibold">Address</p>
                  <p>Mumbai, Maharashtra, India</p>
                </div>
              </div>

              {/* WhatsApp Contact Button */}
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hello! I have a query regarding the community portal.`}
                target="_blank"
                className="mt-6 inline-flex items-center gap-3 px-5 py-3 bg-emerald-600 text-white rounded-xl shadow hover:bg-emerald-700 transition"
              >
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.52 3.48A11.86 11.86 0 0012 .6 11.4 11.4 0 00.6 12.06a11.41 11.41 0 001.56 5.82L.6 24l6.33-1.64a11.63
                    11.63 0 005.61 1.44H12a11.4 11.4 0 0011.4-11.4 11.75 11.75 0 00-2.88-7.92zM12 21.1a9.1 9.1 0 01-4.63-1.27l-.33-.2
                    -3.76 1 1-3.66-.22-.35A9.1 9.1 0 1112 21.1zm5.08-6.79c-.28-.14-1.63-.8-1.88-.89s-.44-.14-.63.14-.72.89-.88
                    1.07-.32.21-.6.07a7.43 7.43 0 01-2.18-1.34 8.17 8.17 0 01-1.5-1.87c-.15-.26 0-.4.11-.54s.26-.3.39-.46a1.85
                    1.85 0 00.26-.43.49.49 0 00-.02-.46c-.07-.14-.63-1.49-.86-2.04s-.46-.48-.63-.49h-.54a1 1 0 00-.72.34 3 3 0 00-.94
                    2.22 5.25 5.25 0 001.11 2.76A12.32 12.32 0 0014.53 18a2.95 2.95 0 002.23.96 2.48 2.48 0 001.67-.77
                    2 2 0 00.45-1.25c-.03-.26-.25-.41-.48-.53z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>

            {/* RIGHT SIDE FORM */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Send Us a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Name */}
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Message */}
                <div>
                  <textarea
                    placeholder="Your Message"
                    rows="5"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400"
                  ></textarea>
                  {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow transition disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Message →"}
                </button>

                {success && (
                  <p className="text-green-600 text-center mt-3 font-medium">
                    {success}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* GOOGLE MAP SECTION */}
<div className="max-w-6xl mx-auto mt-16">
  <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
    Find Us on Google Map
  </h3>

  <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-200">
    <iframe
      title="Google Map"
      width="100%"
      height="400"
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      className="w-full h-[350px] md:h-[450px]"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241309.39806085497!2d72.74110063606338!3d19.082197839876362!2m3!1f0!2f0!3f0!3m2!
      1i1024!2i768!4f13.1!3m3!1m2!
      1s0x3be7b63e2e2cc3dd%3A0xdeb3d299c24c45ea!2sMumbai%2C%20Maharashtra!
      5e0!3m2!1sen!2sin!4v1700000000000"
    ></iframe>
  </div>
</div>

      </section>

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=Hello! I need assistance.`}
        target="_blank"
        className="fixed bottom-6 right-6 bg-emerald-600 text-white p-4 rounded-full shadow-xl hover:bg-emerald-700 transition z-50"
      >
        💬
      </a>
    </>
  );
};

export default Contact;
