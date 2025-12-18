import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function EventImagesAdmin() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  /* ================= STATES ================= */

  const [event, setEvent] = useState(null);
  const [images, setImages] = useState([]);

  // Add
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [showInSlider, setShowInSlider] = useState(false);
  const [showInGallery, setShowInGallery] = useState(true);

  // Edit
  const [editingId, setEditingId] = useState(null);
  const [editCaption, setEditCaption] = useState("");
  const [editSlider, setEditSlider] = useState(false);
  const [editGallery, setEditGallery] = useState(true);
  const [editFile, setEditFile] = useState(null);

  /* ================= FETCH ================= */

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${eventId}`);
      setEvent(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch event");
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

  /* ================= DELETE ================= */

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

  /* ================= EDIT ================= */

  const startEdit = (img) => {
    setEditingId(img._id);
    setEditCaption(img.caption || "");
    setEditSlider(!!img.showInSlider);
    setEditGallery(!!img.showInGallery);
    setEditFile(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditCaption("");
    setEditSlider(false);
    setEditGallery(true);
    setEditFile(null);
  };

  const saveEdit = async (id) => {
    try {
      console.log('alok');
      const formData = new FormData();
      formData.append("caption", editCaption);
      formData.append("showInSlider", editSlider);
      formData.append("showInGallery", editGallery);
      if (editFile) formData.append("url", editFile);

      await api.put(`/events/image/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      cancelEdit();
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

      {/* ADD IMAGE */}
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

      {/* IMAGES GRID */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.length === 0 && (
          <p className="text-gray-500">No images uploaded yet.</p>
        )}

        {images.map((img) => (
          <div key={img._id} className="bg-white shadow border rounded-lg p-3">

            <img
              src={img.url}
              alt={img.caption}
              className="h-40 w-full object-cover rounded mb-2"
            />

            {editingId === img._id ? (
              <>
                <textarea
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  className="border p-2 rounded w-full mb-2 text-sm"
                />

                <input
                  type="file"
                  onChange={(e) => setEditFile(e.target.files[0])}
                  className="text-sm mb-2"
                />

                <div className="space-y-1 mb-3 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editSlider}
                      onChange={(e) => setEditSlider(e.target.checked)}
                    />
                    Home Slider
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editGallery}
                      onChange={(e) => setEditGallery(e.target.checked)}
                    />
                    Gallery
                  </label>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(img._id)}
                    className="flex-1 bg-green-600 text-white py-1 rounded hover:bg-green-700"
                  >
                    Save
                  </button>

                  <button
                    onClick={cancelEdit}
                    className="flex-1 bg-gray-400 text-white py-1 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-700 mb-2">
                  {img.caption || "— No Caption —"}
                </p>

                <div className="text-xs text-gray-500 mb-2">
                  {img.showInSlider && "🏠 Slider "}
                  {img.showInGallery && "🖼️ Gallery"}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(img)}
                    className="flex-1 bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(img._id)}
                    className="flex-1 bg-red-600 text-white py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
