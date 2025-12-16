import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import Slider from "../components/Slider";
import { format } from "date-fns";

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
    <>
      <Slider />

      {/* HERO SECTION */}
      <section className="px-6 py-16 bg-gradient-to-b from-indigo-50/60 to-white">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 drop-shadow-sm">
            Events
          </h1>

          <p className="text-gray-600 mt-3 text-lg max-w-2xl mx-auto">
            Stay connected with all upcoming community events, programs, and gatherings.
          </p>
        </div>

        {/* SKELETON LOADING */}
        {loading && (
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 max-w-7xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-2xl shadow p-4 h-80"
              >
                <div className="h-40 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 w-3/4 mb-2 rounded"></div>
                <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {!loading && events.length === 0 && (
          <p className="text-center text-gray-500 text-lg py-10">
            No events available yet.
          </p>
        )}

        {/* EVENTS GRID */}
        {!loading && events.length > 0 && (
          <div className="grid gap-10 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 max-w-7xl mx-auto">
            {events.map((event) => (
              <div
                key={event._id}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl
                transition-all duration-300 overflow-hidden relative border border-gray-100"
              >
                {/* DATE BADGE */}
                <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-sm 
                border border-white rounded-xl px-3 py-1 shadow text-gray-900 text-sm font-semibold">
                  {event.date ? format(new Date(event.date), "dd MMM yyyy") : "TBA"}
                </div>

                {/* IMAGE WRAPPER */}
                <div className="overflow-hidden relative h-56">
                  {event.coverImage ? (
                    <img
                      src={event.coverImage}
                      alt={event.name}
                      className="h-full w-full object-cover group-hover:scale-110 
                      transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}

                  {/* GRADIENT OVERLAY FOR DEPTH */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>

                {/* CARD CONTENT */}
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition">
                    {event.name}
                  </h3>

                  <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                    {event.description?.slice(0, 110) || "No description available"}
                    {event.description?.length > 110 && "..."}
                  </p>

                  {/* BUTTON */}
                  <Link
                    to={`/events/${event._id}`}
                    className="inline-block px-5 py-2 bg-indigo-600 
                    hover:bg-indigo-700 text-white rounded-xl shadow 
                    transition focus:ring-2 focus:ring-indigo-400 text-sm"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
