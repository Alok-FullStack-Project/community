// src/pages/Events.jsx
import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Calendar, ArrowRight, MapPin, Search, Filter } from "lucide-react";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await api.get("/events");
        setEvents(res.data.data || res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50">
      
      {/* ================= PROPER EVENT BANNER ================= */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-[#0B1221]">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-[0.2em] text-indigo-400 uppercase bg-indigo-500/10 border border-indigo-500/20 rounded-full">
            Community Gatherings
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Events</span>
          </h1>
          <p className="text-slate-400 mt-3 text-lg max-w-2xl mx-auto leading-relaxed">
            Discover cultural programs, youth meets, and community celebrations. Stay connected with your roots.
          </p>
        </div>
      </section>

      {/* ================= CONTENT SECTION ================= */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        
        {/* SKELETON LOADING STATE */}
        {loading && (
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-3xl shadow-sm p-4 h-[450px] border border-slate-100">
                <div className="h-52 bg-slate-200 rounded-2xl mb-6"></div>
                <div className="h-6 bg-slate-200 w-3/4 mb-4 rounded-lg"></div>
                <div className="h-4 bg-slate-200 w-full mb-2 rounded-lg"></div>
                <div className="h-4 bg-slate-200 w-2/3 rounded-lg"></div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && events.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-sm">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              <Calendar size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No Events Found</h3>
            <p className="text-slate-500 mt-2">We're planning something great. Check back soon!</p>
          </div>
        )}

        {/* EVENTS GRID */}
        {!loading && events.length > 0 && (
          <div className="grid gap-8 lg:gap-10 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
            {events.map((event) => (
              <div
                key={event._id}
                className="group bg-white rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 
                transition-all duration-500 overflow-hidden border border-slate-100 flex flex-col h-full hover:-translate-y-2"
              >
                {/* IMAGE AREA */}
                <div className="relative h-60 overflow-hidden">
                  {event.coverImage ? (
                    <img
                      src={event.coverImage}
                      alt={event.name}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <Calendar size={48} strokeWidth={1} />
                    </div>
                  )}

                  {/* DATE BADGE (Floating Glassmorphism) */}
                  {/* <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md border border-white/50 rounded-2xl p-2.5 shadow-xl text-center min-w-[65px]">
                    <span className="block text-xs font-bold text-indigo-600 uppercase tracking-tighter">
                      {event.date ? format(new Date(event.date), "MMM") : "TBA"}
                    </span>
                    <span className="block text-xl font-black text-slate-900 leading-none">
                      {event.date ? format(new Date(event.date), "dd") : "?"}
                    </span>
                  </div> */}
                  
                  {/* Subtle Gradient Overlay */}
                  {/* <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" /> */}
                </div>

                {/* CONTENT AREA */}
                <div className="p-8 flex flex-col flex-grow">
                  {/* <div className="flex items-center gap-2 mb-3 text-indigo-600">
                    <MapPin size={14} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">Mumbai Center</span>
                  </div> */}

                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                    {event.name}
                  </h3>

                  <p className="text-slate-500 text-sm mb-8 leading-relaxed line-clamp-3">
                    {event.description || "Join us for this special community gathering where we celebrate our culture and bond as a family."}
                  </p>

                  {/* ACTION AREA */}
                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <Link
                      to={`/events/${event._id}`}
                      className="flex items-center gap-2 text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-all"
                    >
                      View Event <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    
                    {/* <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200" />
                      ))}
                      <div className="w-7 h-7 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                        +12
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}