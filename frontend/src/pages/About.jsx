import React, { useEffect, useState } from "react";
import Slider from "../components/Slider";
import api from "../api/api";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const About = () => {
  const [events, setEvents] = useState([]);
  const [ads, setAds] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingAds, setLoadingAds] = useState(true);
  const backend_url = import.meta.env.VITE_URL ;
  // Fetch Events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data.data || res.data || []);
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
        const res = await api.get("/advertise");
        const data = res.data.data || res.data || [];
        const published = Array.isArray(data)
          ? data.filter((a) => a.publish !== false)
          : [];
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
      {/* ✅ Full-width Slider */}
      <Slider />

      {/* ✅ Full-width container (3-6-3 grid) */}
      <section className="px-6 py-10 bg-gray-50 min-h-screen w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-[1600px] mx-auto">
          
          {/* -------- Column 1: Events (3 parts) -------- */}
          <div className="md:col-span-3 bg-white rounded-2xl shadow p-4 overflow-y-auto max-h-[700px]">
            <h2 className="text-xl font-bold mb-4 text-center">Upcoming Events</h2>
            {loadingEvents ? (
              <p className="text-gray-500 text-center">Loading events...</p>
            ) : events.length === 0 ? (
              <p className="text-gray-500 text-center">No events available.</p>
            ) : (
              events.map((event) => (
                <div
                  key={event._id}
                  className="mb-4 border-b border-gray-200 pb-3 last:border-none"
                >
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
                    {event.description?.slice(0, 60) || "No description"}
                    {event.description?.length > 60 && "..."}
                  </p>
                  <Link
                    to={`/events/${event._id}`}
                    className="text-sky-600 text-xs hover:underline"
                  >
                    View →
                  </Link>
                </div>
              ))
            )}
          </div>

          {/* -------- Column 2: About Section (6 parts) -------- */}
          <div className="md:col-span-6 bg-white rounded-2xl shadow p-10 flex flex-col justify-center text-center">
            <h2 className="text-3xl font-bold mb-6 text-blue-700">Our Story</h2>
            <p className="text-gray-700 mb-4 leading-relaxed text-lg">
              Our community is built on shared values, mutual respect, and cultural
              heritage. We believe in connecting families across generations.  
              We aim to preserve our traditions while embracing progress and unity.  
              Join us as we celebrate togetherness, compassion, and cultural pride.
            </p>
            <p className="text-gray-700 text-lg">
              Through community events, digital platforms, and mutual support,
              we’re building a network that honors our roots while nurturing
              future generations.
            </p>
          </div>

          {/* -------- Column 3: Advertisements (3 parts) -------- */}
          <div className="md:col-span-3 bg-white rounded-2xl shadow p-4 overflow-y-auto max-h-[700px]">
            <h2 className="text-xl font-bold mb-4 text-center">Advertisements</h2>
            {loadingAds ? (
              <p className="text-gray-500 text-center">Loading ads...</p>
            ) : ads.length === 0 ? (
              <p className="text-gray-500 text-center">No ads available.</p>
            ) : (
              ads.map((ad) => {
                const start = ad.startDate ? new Date(ad.startDate) : null;
                const end = ad.endDate ? new Date(ad.endDate) : null;
                return (
                  <div
                    key={ad._id}
                    className="mb-4 border-b border-gray-200 pb-3 last:border-none"
                  >
                    {ad.image ? (
                      <img
                        src={ad.image}
                        alt={ad.name}
                        className="h-32 w-full object-cover rounded-md mb-2"
                      />
                    ) : (
                      <div className="h-32 bg-gray-200 flex items-center justify-center text-gray-400 mb-2">
                        No Image
                      </div>
                    )}
                    <h3 className="font-semibold text-sm">{ad.name}</h3>
                    <p className="text-xs text-gray-600 mb-1">
                      {ad.description?.slice(0, 60) || "No description"}
                      {ad.description?.length > 60 && "..."}
                    </p>
                    <div className="text-xs text-gray-500 mb-2">
                      {start && (
                        <span>
                          {format(start, "dd MMM yyyy")}
                        </span>
                      )}
                      {start && end && <span className="mx-1">→</span>}
                      {end && (
                        <span>
                          {format(end, "dd MMM yyyy")}
                        </span>
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
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
