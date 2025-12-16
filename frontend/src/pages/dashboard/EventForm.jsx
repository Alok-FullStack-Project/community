import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";

const emptyEvent = {
  name: "",
  description: "",
  publish: true,
  coverImage: "",
  category: "", // must be _id
};

export default function EventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(emptyEvent);
  const [categories, setCategories] = useState([]);
  const isEdit = Boolean(id);

  // ------------------------------
  // Fetch Categories
  // ------------------------------
   useEffect(() => {
    if (id) 
      {
        fetchEvent();
        fetchCategories();
      }
  }, [id]);

  useEffect(() => {
        fetchCategories();
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${id}`);
      setEvent(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch event');
    }
  };


  const fetchCategories = async () => {
  try {
    const res = await api.get('/categories?type=event');
    setCategories(res.data);
  } catch (err) {
    console.error(err);
    alert("Failed to load categories");
  }
};



  // ------------------------------
  // Handle Input Change
  // ------------------------------
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setEvent((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files[0]
          : value,
    }));
  };

  // ------------------------------
  // Submit Form
  // ------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();
      fd.append("name", event.name);
      fd.append("description", event.description);
      fd.append("publish", event.publish);
      fd.append("category", event.category);

      if (event.file) fd.append("coverImage", event.file);

      if (isEdit) {
        await api.put(`/events/${id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Event updated!");
      } else {
        await api.post(`/events`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Event created!");
      }

      navigate("/dashboard/admin/events");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  // ------------------------------
  // UI
  // ------------------------------
  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-xl mx-auto">

      <h2 className="text-2xl font-bold mb-6">
        {isEdit ? "Edit Event" : "Add Event"}
      </h2>

      <form className="space-y-5" onSubmit={handleSubmit}>

        {/* CATEGORY */}
        <div>
          <label className="block font-medium mb-1">Category</label>
          <select
            name="category"
            value={event.category}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            >
            <option value="">Select Category</option>
            {categories.map(cat => (
            <option key={cat._id} value={cat._id}>
            {cat.name} ({cat.type})
            </option>
            ))}
            </select>
        </div>

        {/* EVENT NAME */}
        <div>
          <label className="block font-medium mb-1">Event Name</label>
          <input
            type="text"
            name="name"
            value={event.name}
            onChange={handleChange}
            placeholder="Enter event name"
            className="w-full border p-3 rounded"
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={event.description}
            onChange={handleChange}
            placeholder="Write event description..."
            className="w-full border p-3 rounded"
            rows="4"
          ></textarea>
        </div>

        {/* PUBLISH */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="publish"
            checked={event.publish}
            onChange={handleChange}
          />
          <label className="font-medium">Publish</label>
        </div>

        {/* IMAGE UPLOAD */}
        <div>
          <label className="block font-medium mb-1">Cover Image</label>
          <input type="file" name="file" onChange={handleChange} />

          {/* Preview */}
          {event.file ? (
            <img
              src={URL.createObjectURL(event.file)}
              alt="preview"
              className="h-40 mt-3 rounded shadow"
            />
          ) : event.coverImage ? (
            <img
              src={event.coverImage}
              alt="preview"
              className="h-40 mt-3 rounded shadow"
            />
          ) : null}
        </div>

        {/* BUTTONS */}
        <div className="flex justify-between pt-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/admin/events")}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Event
          </button>
        </div>
      </form>
    </div>
  );
}
