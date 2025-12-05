import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";
import Slider from "../components/Slider";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [images, setImages] = useState([]);
  const [popupImage, setPopupImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/events/${id}`);
        setEvent(res.data.data || res.data);

        const imgRes = await api.get(`/events/${id}/images`);
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading event details...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  if (!event) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Event not found.</div>;
  }

  return (
    <>
      <Slider />

      <section className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-6">

          <Link to="/about" className="inline-block mb-4 text-sky-600 hover:underline">
            ← Back to Events
          </Link>

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

          <h1 className="text-3xl font-bold mb-4 text-center">{event.name}</h1>

          <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
            {event.description || "No detailed description available."}
          </p>

          {/* EVENT GALLERY */}
          {images.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-3">Event Gallery</h2>

              <div className="flex gap-4 overflow-x-auto pb-3">
                {images.map((img) => (
                  <div key={img._id} className="min-w-[200px]">
                    <img
                      src={img.url}
                      alt={img.caption}
                      className="h-40 w-64 object-cover rounded-lg shadow cursor-pointer hover:scale-105 transition"
                      onClick={() => setPopupImage(img)}
                    />
                    <p className="text-center text-sm mt-1">{img.caption}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* POPUP MODAL */}
        {popupImage && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg max-w-3xl mx-auto relative">

              <button
                className="absolute top-2 right-2 text-2xl font-bold text-gray-700 hover:text-black"
                onClick={() => setPopupImage(null)}
              >
                ×
              </button>

              <img
                src={popupImage.url}
                alt={popupImage.caption}
                className="w-full max-h-[80vh] object-contain rounded"
              />

              {popupImage.caption && (
                <p className="text-center mt-3 text-gray-700">{popupImage.caption}</p>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default EventDetails;
