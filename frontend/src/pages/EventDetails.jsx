import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";
import { format } from "date-fns";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Tag, 
  ArrowLeft, 
  Share2, 
  ChevronLeft, 
  ChevronRight, 
  X,
  MessageCircle,
  Facebook,
  Twitter
} from "lucide-react";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [images, setImages] = useState([]);
  const [popupImage, setPopupImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/events/${id}`);
        setEvent(res.data.data || res.data);

        const imgRes = await api.get(`/events/${id}/images/gallery`);
        setImages(imgRes.data || []);
      } catch (err) {
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
      <p className="text-slate-500 font-bold animate-pulse">Loading Event Details...</p>
    </div>
  );

  if (error || !event) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="text-center bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 max-w-md">
        <div className="bg-rose-50 text-rose-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">⚠️</div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">{error || "Event Not Found"}</h2>
        <Link to="/events" className="text-indigo-600 font-bold hover:underline">Return to Events</Link>
      </div>
    </div>
  );

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">
      
      {/* ================= MODERN EVENT BANNER ================= */}
<section className="relative w-full h-[450px] md:h-[600px] overflow-hidden bg-slate-900">
  {/* 1. Dynamic Background Blur - Creates depth using the event's own image */}
  <div 
    className="absolute inset-0 bg-cover bg-center scale-110 blur-2xl opacity-40 transition-transform duration-1000 hover:scale-100"
    style={{ backgroundImage: `url(${event.coverImage})` }}
  />
  
  {/* 2. Gradient Overlays - Ensures text readability and smooth transition to content */}
  <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent" />
  <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-transparent to-transparent" />

  <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center">
    {/* Navigation Breadcrumb */}
    <Link
      to="/events"
      className="inline-flex items-center gap-2 text-indigo-400 hover:text-white font-bold text-xs uppercase tracking-[0.2em] mb-8 transition-all group"
    >
      <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
      Back to Events
    </Link>
    
    <div className="max-w-3xl">
      {/* Category Tag */}
      {/* <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-indigo-500/20 border border-indigo-400/30 backdrop-blur-md">
        <Tag size={12} className="text-indigo-400" />
        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">
          {event.category || "Community Event"}
        </span>
      </div> */}

      {/* Main Title */}
      <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight drop-shadow-2xl mb-8">
        {event.name}
      </h1>

      {/* Floating Info Bar (Desktop Only View) */}
      <div className="hidden md:flex items-center gap-8 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-2xl w-fit">
        <div className="flex items-center gap-3 pr-8 border-r border-white/10">
          <Calendar className="text-indigo-400" size={20} />
          <div>
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-tighter">Event Date</p>
            <p className="text-sm font-bold text-white">{event.date ? format(new Date(event.date), "dd MMM, yyyy") : "TBA"}</p>
          </div>
        </div>
        {/* <div className="flex items-center gap-3 pr-8 border-r border-white/10">
          <Clock className="text-emerald-400" size={20} />
          <div>
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-tighter">Start Time</p>
            <p className="text-sm font-bold text-white">{event.time || "Morning"}</p>
          </div>
        </div> */}
        <div className="flex items-center gap-3">
          <MapPin className="text-rose-400" size={20} />
          <div>
            <p className="text-[10px] font-bold text-white/50 uppercase tracking-tighter">Location</p>
            <p className="text-sm font-bold text-white">{event.location || "Mumbai"}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* ================= CONTENT WRAPPER ================= */}
      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-20">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT: Main Details */}
          <div className="lg:col-span-12 space-y-12">
            {/* Primary Image Card */}
            <div className="bg-white p-4 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100">
              <div className="rounded-[2rem] overflow-hidden aspect-video">
                <img 
                  src={event.coverImage || "https://placehold.co/800x450?text=No+Image"} 
                  className="w-full h-full object-cover" 
                  alt={event.name} 
                />
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-slate-200 border border-slate-100">
              <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-indigo-600 rounded-full" />
                About This Event
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line font-medium">
                {event.description || "No detailed description available for this event."}
              </p>
            </div>

            {/* GALLERY */}
            {images.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-black text-slate-900 px-4">Event Gallery</h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((img) => (
                    <div 
                      key={img._id} 
                      className="group relative cursor-pointer rounded-2xl overflow-hidden aspect-square border-4 border-white shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                      onClick={() => setPopupImage(img)}
                    >
                      <img src={img.url} alt={img.caption} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" />
                      <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <span className="text-white text-xs font-bold uppercase tracking-widest">View Image</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Meta Sidebar */}
          {/* <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200 border border-slate-100 sticky top-28">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 text-center">Event Information</h4>
              
              <div className="space-y-6">
                <MetaItem icon={<Calendar className="text-indigo-600" />} label="Date" value={event.date ? format(new Date(event.date), "EEEE, dd MMM yyyy") : "TBD"} />
                <MetaItem icon={<Clock className="text-emerald-600" />} label="Time" value={event.time || "Check back soon"} />
                <MetaItem icon={<MapPin className="text-rose-600" />} label="Location" value={event.location || "Online"} />
                <MetaItem icon={<Tag className="text-amber-600" />} label="Category" value={event.category || "Community"} />
              </div>

              <div className="mt-10 pt-8 border-t border-slate-50">
                <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Spread the Word</p>
                <div className="flex justify-center gap-4">
                  <ShareBtn 
                    href={`https://wa.me/?text=${encodeURIComponent(event.name + " - " + window.location.href)}`}
                    icon={<MessageCircle size={20} />}
                    color="bg-emerald-50 text-emerald-600 hover:bg-emerald-600"
                  />
                  <ShareBtn 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                    icon={<Facebook size={20} />}
                    color="bg-blue-50 text-blue-600 hover:bg-blue-600"
                  />
                  <ShareBtn 
                    href={`https://twitter.com/intent/tweet?url=${window.location.href}`}
                    icon={<Twitter size={20} />}
                    color="bg-sky-50 text-sky-600 hover:bg-sky-600"
                  />
                </div>
              </div>
            </div>
          </div> */}

        </div>
      </div>

      {/* ================= IMAGE MODAL ================= */}
      {popupImage && (
        <div className="fixed inset-0 bg-slate-900/95 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-300">
          <button 
            onClick={() => setPopupImage(null)}
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
          >
            <X size={32} />
          </button>

          <div className="relative flex flex-col items-center max-w-6xl w-full">
            {/* Nav Controls */}
            <div className="absolute inset-y-0 -left-16 hidden md:flex items-center">
              <NavBtn 
                onClick={() => {
                  const idx = images.findIndex(i => i._id === popupImage._id);
                  setPopupImage(images[(idx - 1 + images.length) % images.length]);
                }}
                icon={<ChevronLeft size={32} />}
              />
            </div>
            <div className="absolute inset-y-0 -right-16 hidden md:flex items-center">
              <NavBtn 
                onClick={() => {
                  const idx = images.findIndex(i => i._id === popupImage._id);
                  setPopupImage(images[(idx + 1) % images.length]);
                }}
                icon={<ChevronRight size={32} />}
              />
            </div>

            <img 
              src={popupImage.url} 
              className="max-h-[80vh] w-auto rounded-3xl shadow-2xl border-4 border-white/10" 
              alt="Popup" 
            />
            {popupImage.caption && (
              <p className="mt-6 text-white text-lg font-bold bg-white/10 px-6 py-2 rounded-full backdrop-blur-md">
                {popupImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-components
const MetaItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-lg">
    <div className="mt-1">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-sm font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

const ShareBtn = ({ href, icon, color }) => (
  <a 
    href={href} 
    target="_blank" 
    className={`p-4 rounded-2xl transition-all hover:text-white hover:-translate-y-1 shadow-sm ${color}`}
  >
    {icon}
  </a>
);

const NavBtn = ({ onClick, icon }) => (
  <button 
    onClick={onClick}
    className="bg-white/10 hover:bg-white/20 text-white p-4 rounded-full backdrop-blur-md transition-all active:scale-95"
  >
    {icon}
  </button>
);

export default EventDetails;