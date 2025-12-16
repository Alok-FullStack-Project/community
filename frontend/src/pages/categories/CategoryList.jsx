import React, { useEffect, useState } from "react";
import api from "../../api/api";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);

  // Form state
  const [form, setForm] = useState({ 
    name: "", 
    type: "", 
    description: "", 
    order: "" 
  });
  const [editId, setEditId] = useState(null);

  // UI helpers
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("az");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Save
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.type.trim() || !form.order) {
      return alert("Name, Type and Order are required.");
    }

    try {
      if (editId) {
        await api.put(`/categories/${editId}`, form);
        alert("Category updated successfully.");
      } else {
        await api.post("/categories", form);
        alert("Category added successfully.");
      }

      setForm({ name: "", type: "", description: "", order: "" });
      setEditId(null);

      fetchCategories();
    } catch (err) {
      console.error("Save failed", err);
      alert("Operation failed.");
    }
  };

  // Edit handler
  const handleEdit = (cat) => {
    setEditId(cat._id);
    setForm({ 
      name: cat.name, 
      type: cat.type,
      description: cat.description || "",
      order: cat.order || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // ---- FILTERING | SEARCH ----
  let filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  // ---- SORTING ----
  if (sortBy === "az") filtered.sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === "za") filtered.sort((a, b) => b.name.localeCompare(a.name));
  if (sortBy === "type") filtered.sort((a, b) => a.type.localeCompare(b.type));
  if (sortBy === "order") filtered.sort((a, b) => Number(a.order) - Number(b.order));

  // ---- PAGINATION ----
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const pageData = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="p-8 max-w-5xl mx-auto">

      {/* Title */}
      <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        📂 Category Management
      </h2>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-100 mb-8">

        <h3 className="text-xl font-semibold mb-4">
          {editId ? "✏️ Edit Category" : "➕ Add New Category"}
        </h3>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
          
          {/* Name */}
          <div>
            <label className="font-medium">Category Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg mt-1 shadow-sm"
            />
          </div>

          {/* Type */}
          <div>
            <label className="font-medium">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg mt-1 shadow-sm"
            >
              <option value="">Select Type</option>
              <option value="event">Event</option>
              <option value="advertise">Advertise</option>
            </select>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg mt-1 shadow-sm"
              placeholder="Write short description..."
            />
          </div>

          {/* Order Number */}
          <div>
            <label className="font-medium">Display Order (Number)</label>
            <input
              type="number"
              name="order"
              value={form.order}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg mt-1 shadow-sm"
              placeholder="e.g., 1"
            />
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex justify-end gap-4 mt-2">
            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setForm({ name: "", type: "", description: "", order: "" });
                }}
                className="px-5 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
            >
              {editId ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>

      {/* List Controls */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">

        <input
          type="text"
          placeholder="Search category..."
          className="border px-4 py-2 rounded-lg shadow-sm w-60"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="border px-4 py-2 rounded-lg shadow-sm"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="az">Sort: A → Z</option>
          <option value="za">Sort: Z → A</option>
          <option value="type">Sort by Type</option>
          <option value="order">Sort by Order</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow border">
        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Order</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : pageData.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No categories found.
                </td>
              </tr>
            ) : (
              pageData.map((cat) => (
                <tr
                  key={cat._id}
                  className="border-t hover:bg-indigo-50 cursor-pointer transition"
                >
                  <td className="p-3 font-medium">{cat.name}</td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        cat.type === "advertise"
                          ? "bg-teal-100 text-teal-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {cat.type}
                    </span>
                  </td>

                  <td className="p-3">{cat.order}</td>

                  <td className="p-3 text-gray-600">
                    {cat.description || "-"}
                  </td>

                  <td className="p-3 flex gap-3">
                    <button
                      className="px-3 py-1 bg-yellow-400 rounded-lg"
                      onClick={() => handleEdit(cat)}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded-lg"
                      onClick={() => handleDelete(cat._id)}
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">

          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-2 rounded ${
                page === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>

        </div>
      )}
    </div>
  );
}
