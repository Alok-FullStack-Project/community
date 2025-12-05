import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", type: "" });

  useEffect(() => {
    api.get(`/categories/${id}`).then((res) => {
      setForm({
        name: res.data.name,
        type: res.data.type,
      });
    });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/categories/${id}`, form);
      navigate("/dashboard/admin/categories");
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Edit Category</h2>

      <form className="space-y-5" onSubmit={submit}>
        <div>
          <label className="block font-medium mb-1">Category Name</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Type</label>
          <select
            name="type"
            required
            value={form.type}
            className="w-full border p-2 rounded"
            onChange={handleChange}
          >
            <option value="">Select Type</option>
            <option value="advertise">Advertise</option>
            <option value="event">Event</option>
          </select>
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Update
        </button>
      </form>
    </div>
  );
};

export default EditCategory;
