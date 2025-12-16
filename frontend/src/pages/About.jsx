import React, { useEffect, useState } from "react";
import Slider from "../components/Slider";
import api from "../api/api";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const About = () => {
  const [events, setEvents] = useState([]);
  const [ads, setAds] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingAds, setLoadingAds] = useState(true);

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

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await api.get("/advertise/active");
        const filtered = (res.data.data || []).filter((a) => a.publish !== false);
        setAds(filtered);
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

      <section className="px-6 py-14 bg-gradient-to-b from-indigo-50 to-white min-h-screen w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 max-w-[1600px] mx-auto">

          {/* EVENTS SLIDER */}
          <div className="md:col-span-3 bg-white rounded-3xl shadow-xl p-6 border border-gray-100 relative">
            <h2 className="text-xl font-bold mb-4 text-center text-indigo-700">Upcoming Events</h2>

            {loadingEvents ? (
              <p className="text-gray-500 text-center">Loading events...</p>
            ) : events.length === 0 ? (
              <p className="text-gray-500 text-center">No events available.</p>
            ) : (
              <>
                <Swiper
                  modules={[Navigation, Autoplay]}
                  autoplay={{ delay: 1800 }}
                  loop={true}
                  navigation={{
                    nextEl: ".event-next",
                    prevEl: ".event-prev",
                  }}
                  breakpoints={{
                    0: { direction: "horizontal", slidesPerView: 1 },
                    768: { direction: "vertical", slidesPerView: 3 },
                  }}
                  spaceBetween={20}
                  className="md:h-[650px]"
                >
                  {events.map((event) => (
                    <SwiperSlide key={event._id}>
                      <div className="bg-white rounded-xl p-3 shadow-sm border hover:shadow-md transition">
                        {event.coverImage ? (
                          <img
                            src={event.coverImage}
                            className="h-32 w-full object-cover rounded-lg mb-3"
                            alt={event.name}
                          />
                        ) : (
                          <div className="h-32 flex items-center justify-center bg-gray-200 rounded-lg text-gray-400 mb-3">
                            No Image
                          </div>
                        )}

                        <h3 className="font-semibold text-sm text-gray-800">{event.name}</h3>
                        <p className="text-xs text-gray-600">
                          {event.description?.slice(0, 60)}...
                        </p>

                        <Link to={`/events/${event._id}`} className="text-indigo-600 text-xs hover:underline mt-2 inline-block">
                          View →
                        </Link>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                <button className="event-prev swiper-button-prev absolute left-1/2 -translate-x-1/2 top-3"></button>
                <button className="event-next swiper-button-next absolute left-1/2 -translate-x-1/2 bottom-3"></button>
              </>
            )}
          </div>

          {/* ABOUT SECTION */}
          <div className="md:col-span-6 bg-white rounded-3xl shadow-xl p-10 border border-gray-100 text-center">
            <h2 className="text-4xl font-extrabold mb-6 text-indigo-700">
              Our Community Story
            </h2>

            <p className="text-gray-700 mb-4 text-lg leading-relaxed">
              Our community thrives on shared culture, unity, and togetherness. Built
              over generations, our traditions continue to inspire and connect us.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed">
              We honor our heritage while empowering future generations to stay
              connected, grow, and succeed together.
            </p>

            {/* Decorative Divider */}
            <div className="w-20 h-1 bg-indigo-600 rounded-full mx-auto mt-6"></div>
          </div>

          {/* ADS SLIDER */}
          <div className="md:col-span-3 bg-white rounded-3xl shadow-xl p-6 border border-gray-100 relative">
            <h2 className="text-xl font-bold mb-4 text-center text-indigo-700">Advertisements</h2>

            {loadingAds ? (
              <p className="text-gray-500 text-center">Loading ads...</p>
            ) : ads.length === 0 ? (
              <p className="text-gray-500 text-center">No ads available.</p>
            ) : (
              <>
                <Swiper
                  modules={[Navigation, Autoplay]}
                  autoplay={{ delay: 2000 }}
                  loop={true}
                  navigation={{
                    nextEl: ".ads-next",
                    prevEl: ".ads-prev",
                  }}
                  breakpoints={{
                    0: { direction: "horizontal", slidesPerView: 1 },
                    768: { direction: "vertical", slidesPerView: 3 },
                  }}
                  spaceBetween={20}
                  className="md:h-[650px]"
                >
                  {ads.map((ad) => (
                    <SwiperSlide key={ad._id}>
                      <div className="bg-white rounded-xl p-3 shadow-sm border hover:shadow-md transition">
                        <Link to={ad.link} target="_blank">
                          <img
                            src={ad.image}
                            alt={ad.name}
                            className="h-32 w-full object-cover rounded-lg mb-3"
                          />
                        </Link>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                <button className="ads-prev swiper-button-prev absolute left-1/2 -translate-x-1/2 top-3"></button>
                <button className="ads-next swiper-button-next absolute left-1/2 -translate-x-1/2 bottom-3"></button>
              </>
            )}
          </div>

        </div>
      </section>
    </>
  );
};

export default About;
