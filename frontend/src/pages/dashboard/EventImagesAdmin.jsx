import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function EventImagesAdmin() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [images, setImages] = useState([]);

  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [showInSlider, setShowInSlider] = useState(false);
  const [showInGallery, setShowInGallery] = useState(true);

  /* ================= FETCH DATA ================= */

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${eventId}`);
      setEvent(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch event details");
    }
  };

  const fetchImages = async () => {
    try {
      const res = await api.get(`/events/${eventId}/images`);
      setImages(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch images");
    }
  };

  useEffect(() => {
    fetchEvent();
    fetchImages();
  }, [eventId]);

  /* ================= ADD IMAGE ================= */

  const handleAdd = async () => {
    if (!file) return alert("Select an image");

    try {
      const formData = new FormData();
      formData.append("url", file);
      formData.append("caption", caption);
      formData.append("showInSlider", showInSlider);
      formData.append("showInGallery", showInGallery);

      await api.post(`/events/${eventId}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // reset
      setFile(null);
      setCaption("");
      setShowInSlider(false);
      setShowInGallery(true);

      fetchImages();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  /* ================= DELETE IMAGE ================= */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await api.delete(`/events/image/${id}`);
      fetchImages();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  /* ================= TOGGLE FLAGS ================= */

  const toggleFlag = async (id, field, value) => {
    try {
      await api.put(`/events/image/${id}`, {
        [field]: value,
      });
      fetchImages();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-6xl mx-auto">

      {/* Back */}
      <button
        onClick={() => navigate("/dashboard/admin/events")}
        className="mb-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
      >
        ← Back to Events
      </button>

      {/* Title */}
      <h2 className="text-3xl font-bold mb-6">
        Manage Images {event && `– ${event.name}`}
      </h2>

      {/* Upload Section */}
      <div className="bg-white shadow p-4 rounded-lg mb-8 border">
        <h3 className="text-lg font-semibold mb-3">Add New Image</h3>

        <div className="flex flex-col gap-4">

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2 rounded"
          />

          <textarea
            placeholder="Enter caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="border p-2 rounded min-h-[70px]"
          />

          {/* Flags */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showInSlider}
                onChange={(e) => setShowInSlider(e.target.checked)}
              />
              Show on Home Slider
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showInGallery}
                onChange={(e) => setShowInGallery(e.target.checked)}
              />
              Show in Gallery
            </label>
          </div>

          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-fit"
          >
            Upload Image
          </button>
        </div>
      </div>

      {/* Images Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.length === 0 && (
          <p className="text-gray-500">No images uploaded yet.</p>
        )}

        {images.map((img) => (
          <div
            key={img._id}
            className="bg-white shadow border rounded-lg p-3"
          >
            <img
              src={img.url}
              alt={img.caption}
              className="h-40 w-full object-cover rounded mb-2"
            />

            <p className="text-sm text-gray-700 mb-2">
              {img.caption || "— No Caption —"}
            </p>

            {/* Flags */}
            <div className="space-y-1 mb-2 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={img.showInSlider}
                  onChange={(e) =>
                    toggleFlag(img._id, "showInSlider", e.target.checked)
                  }
                />
                Home Slider
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={img.showInGallery}
                  onChange={(e) =>
                    toggleFlag(img._id, "showInGallery", e.target.checked)
                  }
                />
                Gallery
              </label>
            </div>

            <button
              onClick={() => handleDelete(img._id)}
              className="px-3 py-1 w-full bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
