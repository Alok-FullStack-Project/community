import React, { useEffect, useState, useRef } from "react";
import api from "../api/api";
import { format } from "date-fns";
import { 
  ExternalLink, 
  Phone, 
  MessageCircle, 
  Star, 
  Calendar, 
  X,
  LayoutGrid,
  Info,
  Clock
} from "lucide-react";

const Advertise = () => {
  const [ads, setAds] = useState({ premium: [], standard: [] });
  // const [dailySpecial, setDailySpecial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAd, setSelectedAd] = useState(null);
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return path.startsWith("/") ? backend_url + path : backend_url + "/" + path;
  };

  const handleVisit = async (ad, action) => {
    try {
      await api.post("/advertise/track", {
        adId: ad._id,
        action,
        timestamp: new Date().toISOString(),
      });
    } catch (err) { console.error("Tracking failed", err); }

    if (action === "website") window.open(ad.link, "_blank");
    if (action === "call") window.location.href = `tel:${ad.mobile}`;
    if (action === "whatsapp") window.open(`https://wa.me/${ad.mobile}`, "_blank");
  };

  const fetchAds = async () => {
    try {
      setLoading(true);
      const res = await api.get("/advertise");
      let data = res.data.data || res.data || [];
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 1. FILTER: Active ads between start and end dates
      const activeAds = data.filter(ad => {
        const start = new Date(ad.startDate);
        const end = ad.endDate ? new Date(ad.endDate) : null;
        const isPublished = ad.publish !== false;
        const isOngoing = end ? today <= end : true;
        const hasStarted = ad.startDate ? today >= start : true;
        return isPublished && hasStarted && isOngoing;
      });

      // 2. DAILY SPECIAL LOGIC (Changes every 24 hours)
      let special = null;
      if (activeAds.length > 0) {
        const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
        const dailyIndex = daysSinceEpoch % activeAds.length;
        special = activeAds[dailyIndex];
      }

      // 3. GROUPING & SHUFFLING
      const premium = activeAds.filter(a => a.priority === "premium");
      const standard = activeAds.filter(a => a.priority !== "premium").sort(() => Math.random() - 0.5);

      setAds({ premium, standard });
      // setDailySpecial(special);
    } catch (err) {
      setError("Failed to load advertisements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAds(); }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO BANNER */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-[#0F172A]">
        <div className="absolute top-0 left-0 w-full h-full z-0 opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-indigo-600 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-emerald-600 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">Community <span className="text-indigo-400">Marketplace</span></h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">Discover and support businesses within our Samaj community.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        
        {/* DAILY SPECIAL BANNER */}
        {/* {dailySpecial && !loading && (
          <div className="mb-20 relative group" onClick={() => setSelectedAd(dailySpecial)}>
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl flex flex-col md:flex-row items-center cursor-pointer">
              <div className="w-full md:w-2/5 h-64 md:h-80 overflow-hidden">
                <img src={getImageUrl(dailySpecial.image)} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" alt="Special" />
              </div>
              <div className="w-full md:w-3/5 p-8 md:p-12 text-left">
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-emerald-600 text-xs font-black uppercase tracking-widest">Daily Spotlight</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">{dailySpecial.name}</h2>
                <p className="text-slate-500 text-lg mb-8 line-clamp-2 italic">"{dailySpecial.description}"</p>
                <div className="flex gap-4">
                  <button onClick={(e) => { e.stopPropagation(); handleVisit(dailySpecial, "whatsapp"); }} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition flex items-center gap-2">
                    Connect Now <MessageCircle size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )} */}

        {/* PREMIUM SECTION */}
        {ads.premium.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Star className="text-amber-500 fill-amber-500" size={20} />
              <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Premium Partners</h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              {ads.premium.map(ad => <AdCard key={ad._id} ad={ad} isPremium={true} onSelect={setSelectedAd} getImageUrl={getImageUrl} />)}
            </div>
          </div>
        )}

        {/* STANDARD SECTION */}
        {ads.standard.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <LayoutGrid className="text-slate-400" size={20} />
              <h2 className="text-xl font-bold text-slate-700 uppercase tracking-tight">Community Listings</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
              {ads.standard.map(ad => <AdCard key={ad._id} ad={ad} isPremium={false} onSelect={setSelectedAd} getImageUrl={getImageUrl} />)}
            </div>
          </div>
        )}

        {loading && <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-[2.5rem]" />)}
        </div>}
      </section>

      {/* MODAL */}
      {selectedAd && <AdModal ad={selectedAd} onClose={() => setSelectedAd(null)} getImageUrl={getImageUrl} handleVisit={handleVisit} />}
    </div>
  );
};

/* REUSABLE CARD COMPONENT */
const AdCard = ({ ad, isPremium, onSelect, getImageUrl }) => (
  <div 
    onClick={() => onSelect(ad)}
    className={`group relative flex flex-col bg-white rounded-[2.5rem] overflow-hidden border transition-all duration-500 hover:-translate-y-2 cursor-pointer
    ${isPremium ? 'border-indigo-100 shadow-xl shadow-indigo-100/50' : 'border-slate-100 shadow-sm'}`}
  >
    <div className={`relative ${isPremium ? 'h-52' : 'h-40'} overflow-hidden`}>
      <img src={getImageUrl(ad.image)} className="h-full w-full object-cover group-hover:scale-110 transition duration-700" alt={ad.name} />
      {isPremium && <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-sm"><Star size={16} className="text-indigo-600 fill-indigo-600" /></div>}
    </div>
    <div className="p-6">
      <h3 className={`font-bold text-slate-900 truncate ${isPremium ? 'text-xl' : 'text-md'}`}>{ad.name}</h3>
      <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">{ad.description}</p>
    </div>
  </div>
);

/* MODAL COMPONENT WITH BUBBLING FIX */
const AdModal = ({ ad, onClose, getImageUrl, handleVisit }) => {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-5 right-5 z-20 p-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white hover:text-slate-900 transition-all"><X size={20} /></button>
        <div className="h-64 sm:h-80 relative">
          <img src={getImageUrl(ad.image)} className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </div>
        <div className="p-8 -mt-10 relative bg-white rounded-t-[2.5rem]">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full">{ad.category || "Business"}</span>
          <h2 className="text-3xl font-black text-slate-900 my-4">{ad.name}</h2>
          <p className="text-slate-600 leading-relaxed mb-8">{ad.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ad.link && <button onClick={() => handleVisit(ad, "website")} className="flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition"><ExternalLink size={18} /> Website</button>}
            {ad.mobile && (
              <>
                <button onClick={() => handleVisit(ad, "call")} className="flex items-center justify-center gap-2 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition"><Phone size={18} /> Call</button>
                <button onClick={() => handleVisit(ad, "whatsapp")} className="flex items-center justify-center gap-2 py-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition"><MessageCircle size={18} /> WhatsApp</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advertise;