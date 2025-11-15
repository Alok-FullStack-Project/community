import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";
import { format } from "date-fns";
import Slider from "../components/Slider";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const backend_url = import.meta.env.VITE_URL ;
  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/events/${id}`);
        setEvent(res.data.data || res.data);
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading event details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Event not found.
      </div>
    );
  }

  const startDate = event.startDate ? new Date(event.startDate) : null;
  const endDate = event.endDate ? new Date(event.endDate) : null;

  return (
    <>
      <Slider />

      <section className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-6">
          <Link
            to="/about"
            className="inline-block mb-4 text-sky-600 hover:underline"
          >
            ← Back to Events
          </Link>

          {/* Event Image */}
          {event.coverImage ? (
            <img
              src={event.coverImage}
              alt={event.name}
              className="w-full h-80 object-cover rounded-lg mb-6"
            />
          ) : (
            <div className="w-full h-80 bg-gray-200 flex items-center justify-center rounded-lg text-gray-400 mb-6">
              No Image
            </div>
          )}

          {/* Event Details */}
          <h1 className="text-3xl font-bold mb-4 text-center">{event.name}</h1>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mb-6">
            {startDate && (
              <span>
                <strong>Start:</strong>{" "}
                {format ? format(startDate, "dd MMM yyyy") : startDate.toLocaleDateString()}
              </span>
            )}
            {endDate && (
              <span>
                <strong>End:</strong>{" "}
                {format ? format(endDate, "dd MMM yyyy") : endDate.toLocaleDateString()}
              </span>
            )}
            {event.location && (
              <span>
                <strong>Location:</strong> {event.location}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
            {event.description || "No detailed description available."}
          </p>

          {/* Optional Links */}
          <div className="flex justify-center gap-4">
            {event.link && (
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
              >
                Visit Event Page
              </a>
            )}
            {event.contact && (
              <a
                href={`mailto:${event.contact}`}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Contact Organizer
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default EventDetails;
