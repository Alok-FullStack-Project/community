import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

const emptyAd = {
  name: "",
  description: "",
  order: "",
  image: "",
  startDate: "",
  endDate: "",
  publish: true,
  priority: "standard",
  mobile: "",
  link: "",
  file: null,
};

export default function AdvertiseForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [advertise, setAdvertise] = useState(emptyAd);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) fetchAd();
  }, [id]);

  // Fetch Advertisement (edit mode)
  const fetchAd = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/advertise/${id}`);

      setAdvertise({
        ...advertise,
        ...res.data,
        startDate: res.data.startDate?.split("T")[0] || "",
        endDate: res.data.endDate?.split("T")[0] || "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to fetch advertisement");
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setAdvertise((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  // Save or Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!advertise.name.trim()) {
      return alert("Advertisement name is required");
    }

    const formData = new FormData();
    formData.append("name", advertise.name);
    formData.append("description", advertise.description);
    formData.append("order", advertise.order);
    formData.append("startDate", advertise.startDate);
    formData.append("endDate", advertise.endDate);
    formData.append("priority", advertise.priority);
    formData.append("publish", advertise.publish);
    formData.append("mobile", advertise.mobile);
    formData.append("link", advertise.link);

    if (advertise.file) {
      formData.append("image", advertise.file);
    }

    try {
      if (id) {
        await api.put(`/advertise/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Advertisement Updated Successfully 🎉");
      } else {
        await api.post(`/advertise`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Advertisement Created Successfully 🎉");
      }

      navigate("/dashboard/admin/advertise");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">

      <h2 className="text-3xl font-semibold mb-6 text-slate-800 flex items-center gap-2">
        {id ? "✏️ Edit Advertisement" : "➕ Add Advertisement"}
      </h2>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >

          {/* Left Side */}
          <div className="space-y-4">

            {/* Name */}
            <div>
              <label className="font-medium text-gray-700">Advertisement Name</label>
              <input
                type="text"
                name="name"
                value={advertise.name}
                onChange={handleChange}
                required
                placeholder="e.g., Patel Electronics"
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-indigo-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={advertise.description}
                onChange={handleChange}
                placeholder="Write advertisement description..."
                className="w-full p-3 border rounded-lg shadow-sm"
                rows="3"
              ></textarea>
            </div>

            {/* Order */}
            <div>
              <label className="font-medium text-gray-700">Order No.</label>
              <input
                type="number"
                name="order"
                value={advertise.order}
                onChange={handleChange}
                placeholder="e.g., 1"
                className="w-full p-3 border rounded-lg shadow-sm"
              />
            </div>

            {/* Start & End Date */}
            <div>
              <label className="font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={advertise.startDate || ""}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm"
              />
            </div>

            <div>
              <label className="font-medium text-gray-700">End Date</label>
              <input
                type="date"
                name="endDate"
                value={advertise.endDate || ""}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg shadow-sm"
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="font-medium text-gray-700">Mobile Number</label>
              <input
                type="text"
                name="mobile"
                value={advertise.mobile}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full p-3 border rounded-lg shadow-sm"
              />
            </div>

            {/* Link */}
            <div>
              <label className="font-medium text-gray-700">Website / External Link</label>
              <input
                type="text"
                name="link"
                value={advertise.link}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full p-3 border rounded-lg shadow-sm"
              />
            </div>

            {/* Priority */}
            <div className="flex items-center gap-3 mt-2">
              <label className="font-medium text-gray-700">Priority</label>

              <select
                name="priority"
                value={advertise.priority}
                onChange={handleChange}
                className="border p-2 rounded"
              >
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
              </select>
            </div>

            {/* Publish */}
            <div className="flex items-center gap-3 mt-2">
              <label className="font-medium text-gray-700">Publish</label>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="publish"
                  checked={advertise.publish}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-all"></div>
                <span className="ml-3 text-sm peer-checked:text-green-700">Active</span>
              </label>
            </div>
          </div>

          {/* Right: Image Upload */}
          <div className="space-y-4">
            <label className="font-medium text-gray-700 block mb-1">Upload Image</label>
            <input
              type="file"
              name="file"
              accept="image/*"
              onChange={handleChange}
              className="w-full p-2 border rounded-lg bg-gray-50"
            />

            {(advertise.file || advertise.image) && (
              <div className="mt-4">
                <img
                  src={
                    advertise.file
                      ? URL.createObjectURL(advertise.file)
                      : advertise.image
                  }
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border shadow"
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate("/dashboard/admin/advertise")}
              className="px-6 py-2 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
            >
              {loading ? "Saving..." : id ? "Update Advertisement" : "Create Advertisement"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
