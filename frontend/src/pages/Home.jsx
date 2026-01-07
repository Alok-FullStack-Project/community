// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import Slider from "../components/Slider";
import api from "../api/api";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { Calendar, Megaphone, ArrowRight, Heart, Users, ShieldCheck } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [ads, setAds] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingAds, setLoadingAds] = useState(true);

  // Fetch Events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events?publish=true");
        setEvents(res.data.data || []);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  // Fetch Ads
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await api.get("/advertise/active");
        const data = res.data.data || [];
        const published = data.filter((a) => a.publish !== false);
        setAds(published);
      } catch (err) {
        console.error("Failed to fetch adverts", err);
      } finally {
        setLoadingAds(false);
      }
    };
    fetchAds();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      <Slider />

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ================= LEFT: EVENTS FEED ================= */}
          <aside className="lg:col-span-3 order-2 lg:order-1">
            <div className="sticky top-28 bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Calendar size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Latest Events</h2>
              </div>

              {loadingEvents ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => <div key={i} className="h-40 bg-slate-100 animate-pulse rounded-2xl" />)}
                </div>
              ) : events.length === 0 ? (
                <p className="text-slate-400 text-sm italic">No upcoming events.</p>
              ) : (
                <Swiper
                  modules={[Navigation, Autoplay]}
                  autoplay={{ delay: 3000 }}
                  direction="vertical"
                  loop={true}
                  className="h-[600px] rounded-2xl"
                  slidesPerView={3}
                  spaceBetween={20}
                >
                  {events.map((event) => (
                    <SwiperSlide key={event._id}>
                      <div className="group bg-slate-50 hover:bg-white p-3 rounded-2xl border border-transparent hover:border-indigo-100 hover:shadow-md transition-all duration-300">
                        <div className="relative h-28 w-full rounded-xl overflow-hidden mb-3">
                          <img 
                            src={event.coverImage || "/api/placeholder/400/320"} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            alt={event.name} 
                          />
                        </div>
                        <h3 className="font-bold text-slate-800 text-sm line-clamp-1">{event.name}</h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{event.description}</p>
                        <Link to={`/events/${event._id}`} className="mt-2 inline-flex items-center text-indigo-600 text-xs font-bold hover:gap-2 transition-all">
                          View Details <ArrowRight size={14} className="ml-1" />
                        </Link>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </aside>

          {/* ================= CENTER: MAIN ABOUT ================= */}
          <section className="lg:col-span-6 order-1 lg:order-2">
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-indigo-100/50 border border-slate-100 p-8 md:p-12 text-center overflow-hidden relative">
              {/* Decorative background element */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50" />
              
              <div className="relative z-10">
                <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 rounded-full">
                  ESTABLISHED HERITAGE
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
                  Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Our Community</span>
                </h1>
                
                <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto font-medium">
                  We are a connected family built on shared values and cultural heritage, helping each member grow and stay in touch.
                </p>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <div className="p-6 bg-slate-50 rounded-3xl">
                    <Heart className="mx-auto text-pink-500 mb-3" />
                    <h4 className="font-bold text-slate-800">Unity</h4>
                    <p className="text-xs text-slate-500">Connecting hearts across borders.</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-3xl">
                    <Users className="mx-auto text-indigo-500 mb-3" />
                    <h4 className="font-bold text-slate-800">Support</h4>
                    <p className="text-xs text-slate-500">Growing together as one family.</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-3xl">
                    <ShieldCheck className="mx-auto text-emerald-500 mb-3" />
                    <h4 className="font-bold text-slate-800">Heritage</h4>
                    <p className="text-xs text-slate-500">Preserving our rich culture.</p>
                  </div>
                </div>

                <Link
                  to="/community"
                  className="inline-flex items-center gap-3 px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all"
                >
                  Explore Communities <ArrowRight size={20} />
                </Link>
              </div>
            </div>
          </section>

          {/* ================= RIGHT: ADVERTISEMENTS ================= */}
          <aside className="lg:col-span-3 order-3">
            <div className="sticky top-28 bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <Megaphone size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Marketplace</h2>
              </div>

              {loadingAds ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-2xl" />)}
                </div>
              ) : ads.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed">
                  <p className="text-slate-400 text-sm">Space available for ads</p>
                </div>
              ) : (
                <Swiper
                  modules={[Autoplay, Pagination]}
                  autoplay={{ delay: 3500 }}
                  loop={true}
                  className="h-[600px] rounded-2xl"
                  direction="vertical"
                  slidesPerView={2}
                  spaceBetween={20}
                >
                  {ads.map((ad) => (
                    <SwiperSlide key={ad._id}>
                      <Link
                        to={ad.link}
                        target="_blank"
                        className="block relative group h-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                      >
                        <img 
                          src={ad.image} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          alt={ad.name} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-end">
                          <p className="text-white text-xs font-bold">{ad.name}</p>
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
};

export default Home;