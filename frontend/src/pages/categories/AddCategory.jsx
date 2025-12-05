import React, { useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", type: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/categories", form);
      navigate("/dashboard/admin/categories");
    } catch (err) {
      console.error("Add category failed", err);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add Category</h2>

      <form className="space-y-5" onSubmit={submit}>
        <div>
          <label className="block font-medium mb-1">Category Name</label>
          <input
            type="text"
            name="name"
            required
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Type</label>
          <select
            name="type"
            required
            className="w-full border p-2 rounded"
            onChange={handleChange}
          >
            <option value="">Select Type</option>
            <option value="advertise">Advertise</option>
            <option value="event">Event</option>
          </select>
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Save
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
