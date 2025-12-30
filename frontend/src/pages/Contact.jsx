import React, { useState } from "react";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  MessageCircle, 
  CheckCircle2, 
  Globe,
  ArrowRight
} from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const whatsappNumber = "919427022568"; 

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess("Your message has been received! We'll get back to you shortly.");
      setForm({ name: "", email: "", message: "" });
      setErrors({});
      setTimeout(() => setSuccess(""), 5000);
    }, 1500);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      
      {/* ================= PROPER HERO BANNER ================= */}
      <section className="relative pt-32 pb-40 overflow-hidden bg-[#0F172A]">
        {/* Background Mesh Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -mr-60 -mt-40" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -ml-40 -mb-20" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <nav className="flex justify-center items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-6">
            <span>Home</span>
            <ArrowRight size={12} />
            <span className="text-white/60">Contact Us</span>
          </nav>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Touch</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Have a question or want to contribute to the community? We are here to listen and help you connect.
          </p>
        </div>
      </section>

      {/* ================= CONTENT SECTION ================= */}
      <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-20 pb-20">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
              <h3 className="text-xl font-black text-slate-900 mb-8">Quick Support</h3>
              
              <div className="space-y-6">
                <ContactInfo 
                  icon={<Phone size={20} />} 
                  label="Call Support" 
                  value="+91 94270 22568" 
                  color="bg-blue-50 text-blue-600"
                />
                <ContactInfo 
                  icon={<Mail size={20} />} 
                  label="Email Us" 
                  value="hello@community.com" 
                  color="bg-indigo-50 text-indigo-600"
                />
                <ContactInfo 
                  icon={<MapPin size={20} />} 
                  label="Our Location" 
                  value="Sathamba, Gujarat 383340" 
                  color="bg-rose-50 text-rose-600"
                />
              </div>

              <div className="mt-10 pt-8 border-t border-slate-50">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Follow Our Community</p>
                <div className="flex gap-3">
                  {['Facebook', 'Instagram', 'Twitter'].map((social) => (
                    <button key={social} className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl transition-all">
                      {social}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* WhatsApp Integration Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-200/50">
              <MessageCircle size={40} className="mb-4 opacity-80" />
              <h4 className="text-2xl font-black mb-2">WhatsApp Chat</h4>
              <p className="text-emerald-50 font-medium mb-6 opacity-90">Prefer chatting? Connect with our support team instantly on WhatsApp.</p>
              <a 
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                className="inline-flex items-center justify-center w-full py-4 bg-white text-emerald-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-50 transition-all shadow-lg"
              >
                Start Conversation
              </a>
            </div>
          </div>

          {/* RIGHT: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-slate-200/60 border border-slate-50">
              <div className="mb-10">
                <h3 className="text-3xl font-black text-slate-900 mb-2">Send Message</h3>
                <p className="text-slate-500 font-medium">We usually respond within 24 hours.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormInput 
                    label="Your Name" 
                    placeholder="XYX PATEL" 
                    value={form.name}
                    error={errors.name}
                    onChange={(val) => setForm({...form, name: val})}
                  />
                  <FormInput 
                    label="Email Address" 
                    placeholder="abc@example.com" 
                    value={form.email}
                    error={errors.email}
                    onChange={(val) => setForm({...form, email: val})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Message</label>
                  <textarea
                    rows="5"
                    placeholder="Tell us how we can help..."
                    value={form.message}
                    onChange={(e) => setForm({...form, message: e.target.value})}
                    className={`w-full px-6 py-4 rounded-[1.5rem] bg-slate-50 border-2 outline-none transition-all resize-none ${errors.message ? 'border-red-200 focus:border-red-400' : 'border-slate-50 focus:border-blue-500 focus:bg-white'}`}
                  />
                  {errors.message && <p className="text-red-500 text-[10px] font-bold ml-2">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full py-5 bg-[#0F172A] hover:bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl shadow-slate-200"
                >
                  {loading ? "Processing..." : (
                    <>
                      Send Message 
                      <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {success && (
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl animate-pulse">
                    <CheckCircle2 className="text-emerald-500" />
                    <p className="text-emerald-700 text-sm font-bold">{success}</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* MAP SECTION */}
        <div className="mt-20">
          <div className="bg-white p-4 rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden group">
            <div className="rounded-[2.5rem] overflow-hidden relative h-[450px]">
              <div className="absolute inset-0 bg-blue-900/5 pointer-events-none group-hover:bg-transparent transition-all" />
              <iframe
                title="Location Map"
                width="100%"
                height="100%"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3084.464212642948!2d73.33105584579161!3d23.167762389170537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e068da5fcce0f%3A0x9d1ec1b5123ca1ea!2sSathamba%2C%20Gujarat%20383340!5e0!3m2!1sen!2sin!4v1766843367746!5m2!1sen!2sin"
                className="border-0 grayscale-[0.3] contrast-[1.1] hover:grayscale-0 transition-all duration-700"
                allowFullScreen
                loading="lazy"
              />
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const ContactInfo = ({ icon, label, value, color }) => (
  <div className="flex items-center gap-5 group cursor-pointer">
    <div className={`p-4 rounded-2xl transition-all group-hover:scale-110 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-lg font-bold text-slate-800 leading-none">{value}</p>
    </div>
  </div>
);

const FormInput = ({ label, placeholder, value, error, onChange }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{label}</label>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-6 py-4 rounded-[1.5rem] bg-slate-50 border-2 outline-none transition-all ${error ? 'border-red-200 focus:border-red-400' : 'border-slate-50 focus:border-blue-500 focus:bg-white'}`}
    />
    {error && <p className="text-red-500 text-[10px] font-bold ml-2">{error}</p>}
  </div>
);

export default Contact;