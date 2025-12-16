import React, { useEffect, useState } from "react";
import Slider from "../components/Slider";
import api from "../api/api";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
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
        const res = await api.get("/events");
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
    <>
      <Slider />

      <section className="px-4 sm:px-6 py-10 bg-gradient-to-br from-slate-50 via-white to-indigo-50 min-h-screen w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-7xl mx-auto">

          {/* EVENTS VERTICAL SLIDER */}
          <div className="md:col-span-3 bg-white rounded-2xl shadow-lg p-5 border border-slate-100">
            <h2 className="text-xl font-semibold mb-4 text-center text-slate-800">
              Events
            </h2>

            {loadingEvents ? (
  <p className="text-gray-500 text-center">Loading events...</p>
) : events.length === 0 ? (
  <p className="text-gray-500 text-center">No events available.</p>
) : (
  <div className="relative">

  {/* Swiper */}
  <Swiper
    modules={[Navigation, Autoplay, Pagination]}
    autoplay={{ delay: 1800, disableOnInteraction: false }}
    loop={true}
    navigation
    pagination={false}
    spaceBetween={15}
    className="md:h-[650px] relative"
    breakpoints={{
      0: { direction: "horizontal", slidesPerView: 1 },
      640: { direction: "vertical", slidesPerView: 3 },
    }}
  >
    {events.map((event) => (
      <SwiperSlide key={event._id}>
        <div className="mb-4 pb-4 border-b border-slate-200">
          <div className="rounded-xl overflow-hidden mb-3">
            {event.coverImage ? (
              <img
                src={event.coverImage}
                alt={event.name}
                className="h-32 w-full object-cover"
              />
            ) : (
              <div className="h-32 bg-slate-200 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          <h3 className="font-semibold text-sm text-slate-800">{event.name}</h3>
          <p className="text-xs text-gray-600 mt-1 mb-2">
            {event.description?.slice(0, 60)}
            {event.description?.length > 60 && "..."}
          </p>

          <Link
            to={`/events/${event._id}`}
            className="text-indigo-600 text-xs hover:underline font-medium"
          >
            View →
          </Link>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>

  
</div>

)}

          </div>

          {/* ABOUT SECTION */}
          <div className="md:col-span-6 bg-white rounded-3xl shadow-xl p-10 border border-slate-100 text-center">
            <h2 className="text-4xl font-extrabold mb-6 text-indigo-700 drop-shadow-sm">
              Welcome to Our Community
            </h2>

            <p className="text-slate-700 mb-4 text-lg leading-relaxed">
              Our community is built on shared values and cultural heritage.
            </p>

            <p className="text-slate-700 text-lg leading-relaxed">
              We are a connected family of members helping each other grow and stay
              in touch. Join us to explore stories, events, and rich cultural heritage.
            </p>

            <div className="mt-8">
              <Link
                to="/community"
                className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 transition"
              >
                Explore Communities
              </Link>
            </div>
          </div>

          {/* ADS VERTICAL SLIDER */}
          <div className="md:col-span-3 bg-white rounded-2xl shadow-lg p-5 border border-slate-100">
            <h2 className="text-xl font-semibold mb-4 text-center text-slate-800">
              Advertisements
            </h2>

            {loadingAds ? (
              <p className="text-gray-500 text-center">Loading ads...</p>
            ) : ads.length === 0 ? (
              <p className="text-gray-500 text-center">No ads available.</p>
            ) : (
              <Swiper
                modules={[Navigation, Autoplay, Pagination]}
                autoplay={{ delay: 1900, disableOnInteraction: false }}
                navigation
                pagination={false}
                loop={true}
                spaceBetween={15}
                className="md:h-[650px]"
                breakpoints={{
                  0: {
                    direction: "horizontal",
                    slidesPerView: 1,
                  },
                  640: {
                    direction: "vertical",
                    slidesPerView: 3,
                  },
                }}
              >
                {ads.map((ad) => (
                  <SwiperSlide key={ad._id}>
                    <div className="mb-4 pb-4 border-b border-slate-200">
                      <Link
                        to={ad.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-xl overflow-hidden"
                      >
                        {ad.image ? (
                          <img
                            src={ad.image}
                            alt={ad.name}
                            className="h-32 w-full object-cover"
                          />
                        ) : (
                          <div className="h-32 bg-slate-200 flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                      </Link>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

        </div>
      </section>
    </>
  );
};

export default Home;
