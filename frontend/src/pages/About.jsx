import React, { useEffect, useState } from "react";
import Slider from "../components/Slider";
import api from "../api/api";
import { Link } from "react-router-dom";
import { format } from "date-fns";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const About = () => {
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

      <section className="px-6 py-10 bg-gray-50 min-h-screen w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-[1600px] mx-auto">

          {/* EVENTS VERTICAL SLIDER - 3 SHOW AT A TIME */}
          <div className="md:col-span-3 bg-white rounded-2xl shadow p-4">
            <h2 className="text-xl font-bold mb-4 text-center">Upcoming Events</h2>

            {loadingEvents ? (
              <p className="text-gray-500 text-center">Loading events...</p>
            ) : events.length === 0 ? (
              <p className="text-gray-500 text-center">No events available.</p>
            ) : (
              <Swiper
                modules={[Navigation, Autoplay, Pagination]}
                direction="vertical"
                autoplay={{ delay: 1800, disableOnInteraction: false }}
                navigation
                pagination={{ clickable: true }}
                loop={true}
                slidesPerView={3}
                spaceBetween={15}
                className="h-[650px]"
              >
                {events.map((event) => (
                  <SwiperSlide key={event._id}>
                    <div className="mb-4 pb-3 border-b border-gray-100">

                      {event.coverImage ? (
                        <img
                          src={event.coverImage}
                          alt={event.name}
                          className="h-32 w-full object-cover rounded-md mb-2"
                        />
                      ) : (
                        <div className="h-32 bg-gray-200 flex items-center justify-center text-gray-400 mb-2">
                          No Image
                        </div>
                      )}

                      <h3 className="font-semibold text-sm">{event.name}</h3>

                      <p className="text-xs text-gray-600 mb-1">
                        {event.description?.slice(0, 60)}
                        {event.description?.length > 60 && "..."}
                      </p>

                      <Link
                        to={`/events/${event._id}`}
                        className="text-sky-600 text-xs hover:underline"
                      >
                        View →
                      </Link>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>

          {/* ABOUT SECTION */}
          <div className="md:col-span-6 bg-white rounded-2xl shadow p-10 text-center">
            <h2 className="text-3xl font-bold mb-6 text-blue-700">Our Story</h2>
            <p className="text-gray-700 mb-4 text-lg">
              Our community is built on shared values and cultural heritage.
            </p>
            <p className="text-gray-700 text-lg">
              We’re building a network that honors our roots while nurturing future generations.
            </p>
          </div>

          {/* ADS VERTICAL SLIDER - 3 SHOW AT A TIME */}
          <div className="md:col-span-3 bg-white rounded-2xl shadow p-4">
            <h2 className="text-xl font-bold mb-4 text-center">Advertisements</h2>

            {loadingAds ? (
              <p className="text-gray-500 text-center">Loading ads...</p>
            ) : ads.length === 0 ? (
              <p className="text-gray-500 text-center">No ads available.</p>
            ) : (
              <Swiper
                modules={[Navigation, Autoplay, Pagination]}
                direction="vertical"
                autoplay={{ delay: 1900, disableOnInteraction: false }}
                navigation
                pagination={{ clickable: true }}
                loop={true}
                slidesPerView={3}
                spaceBetween={15}
                className="h-[650px]"
              >
                {ads.map((ad) => (
                  <SwiperSlide key={ad._id}>
                    <div className="mb-4 pb-3 border-b border-gray-100">

                      {ad.image ? (
                        <Link to={ad.link} target="_blank" rel="noopener noreferrer">
                                                 <img
                                                   src={ad.image}
                                                   alt={ad.name}
                                                   className="h-32 w-full object-cover rounded-md mb-2 cursor-pointer"
                                                 />
                                               </Link>
                      ) : (
                        <div className="h-32 bg-gray-200 flex items-center justify-center text-gray-400 mb-2">
                          No Image
                        </div>
                      )}

                     {/*} <h3 className="font-semibold text-sm">{ad.name}</h3>

                      <p className="text-xs text-gray-600 mb-1">
                        {ad.description?.slice(0, 60)}
                        {ad.description?.length > 60 && "..."}
                      </p>

                      <div className="text-xs text-gray-500 mb-2">
                        {ad.startDate && (
                          <span>{format(new Date(ad.startDate), "dd MMM yyyy")}</span>
                        )}
                        {ad.endDate && " → "}
                        {ad.endDate && (
                          <span>{format(new Date(ad.endDate), "dd MMM yyyy")}</span>
                        )}
                      </div>

                      {ad.link && (
                        <a
                          href={ad.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-600 text-xs hover:underline"
                        >
                          Visit →
                        </a>
                      )} */}
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

export default About;
