import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";
import Slider from "../components/Slider";
import { format } from "date-fns";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [images, setImages] = useState([]);
  const [popupImage, setPopupImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const backend_url = import.meta.env.VITE_URL;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/events/${id}`);
        setEvent(res.data.data || res.data);

        const imgRes = await api.get(`/events/${id}/images/gallery`);
        setImages(imgRes.data || []);

      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading event details...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  if (!event)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Event not found.
      </div>
    );

  return (
    <>
      {/* TOP HERO SLIDER */}
      <Slider />

      {/* MAIN CONTENT */}
      <section className="px-4 py-10 bg-gradient-to-b from-indigo-50 to-white min-h-screen">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-gray-100">

          {/* Back */}
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium mb-6"
          >
            ← Back to Events
          </Link>

          {/* Cover Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg mb-8">
            {event.coverImage ? (
              <img
                src={event.coverImage}
                alt={event.name}
                className="w-full h-80 object-cover"
              />
            ) : (
              <div className="w-full h-80 bg-gray-200 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}

            {/* Overlay Title */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <h1 className="text-white text-3xl md:text-4xl font-bold drop-shadow-lg">
                {event.name}
              </h1>
            </div>
          </div>

          {/* Event Meta Info */}
          <div className="flex flex-wrap gap-4 mb-8">

            {/* DATE */}
            {event.date && (
              <span className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium">
                📅 {format(new Date(event.date), "dd MMM yyyy")}
              </span>
            )}

            {/* TIME */}
            {event.time && (
              <span className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                ⏰ {event.time}
              </span>
            )}

            {/* LOCATION */}
            {event.location && (
              <span className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium">
                📍 {event.location}
              </span>
            )}

            {/* CATEGORY */}
            {event.category && (
              <span className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                🏷️ {event.category}
              </span>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Event</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {event.description || "No detailed description available."}
            </p>
          </div>

          {/* SOCIAL SHARE */}
          <div className="mb-10 flex gap-4 items-center">
            <span className="text-gray-700 font-semibold">Share:</span>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(event.name + " - " + window.location.href)}`}
              target="_blank"
              className="text-green-600 hover:scale-105 transition text-2xl"
            >
              🟢
            </a>

            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
              target="_blank"
              className="text-blue-600 hover:scale-105 transition text-2xl"
            >
              📘
            </a>

            <a
              href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=${encodeURIComponent(event.name)}`}
              target="_blank"
              className="text-sky-500 hover:scale-105 transition text-2xl"
            >
              🐦
            </a>
          </div>

          {/* GALLERY */}
          {images.length > 0 && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-4">Event Gallery</h2>

              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {images.map((img) => (
                  <div key={img._id} className="relative group">
                    <img
                      src={img.url}
                      alt={img.caption}
                      className="h-48 w-full object-cover rounded-xl shadow-md cursor-pointer group-hover:scale-105 transition"
                      onClick={() => setPopupImage(img)}
                    />

                    {img.caption && (
                      <p className="text-gray-600 text-sm mt-2">{img.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* POPUP IMAGE MODAL WITH PREV/NEXT BUTTONS */}
        {popupImage && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4">

            <div className="bg-white rounded-3xl shadow-2xl p-4 max-w-4xl w-full relative">

              {/* CLOSE BUTTON */}
              <button
                className="absolute top-3 right-3 text-gray-700 hover:text-black text-2xl"
                onClick={() => setPopupImage(null)}
              >
                ✕
              </button>

              {/* PREV BUTTON */}
              <button
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 text-white px-4 py-2 rounded-full hover:bg-black transition"
                onClick={() => {
                  const currentIndex = images.findIndex(i => i._id === popupImage._id);
                  const prevIndex = (currentIndex - 1 + images.length) % images.length;
                  setPopupImage(images[prevIndex]);
                }}
              >
                ← Prev
              </button>

              {/* NEXT BUTTON */}
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 text-white px-4 py-2 rounded-full hover:bg-black transition"
                onClick={() => {
                  const currentIndex = images.findIndex(i => i._id === popupImage._id);
                  const nextIndex = (currentIndex + 1) % images.length;
                  setPopupImage(images[nextIndex]);
                }}
              >
                Next →
              </button>

              {/* POPUP IMAGE */}
              <img
                src={popupImage.url}
                alt={popupImage.caption}
                className="w-full max-h-[80vh] object-contain rounded-2xl"
              />

              {popupImage.caption && (
                <p className="text-center mt-4 text-gray-700">{popupImage.caption}</p>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default EventDetails;
