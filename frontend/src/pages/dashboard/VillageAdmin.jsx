import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";

export default function VillageAdmin() {
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [publish, setPublish] = useState(true);
  const [editId, setEditId] = useState(null);

  // Search + Pagination states
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const fetchVillages = async () => {
    try {
      setLoading(true);
      const res = await api.get("/villages");
      setVillages(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load villages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVillages();
  }, []);

  // Create or Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Village name is required");

    try {
      if (editId) {
        await api.put(`/villages/${editId}`, { name, publish });
        toast.success("Village updated");
      } else {
        await api.post("/villages", { name, publish });
        toast.success("Village added");
      }

      setEditId(null);
      setName("");
      setPublish(true);
      fetchVillages();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Operation failed");
    }
  };

  // Delete village
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await api.delete(`/villages/${id}`);
      toast.success("Village deleted");
      fetchVillages();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // Edit village
  const handleEdit = (v) => {
    setEditId(v._id);
    setName(v.name);
    setPublish(v.publish);
  };

  // Apply search filter
  const filtered = villages.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const pageData = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="p-6 max-w-6xl mx-auto">

      <h1 className="text-3xl font-bold text-slate-800 mb-6">Village Management</h1>

      {/* Add / Edit Form */}
      <div className="bg-white border rounded-xl shadow p-6 mb-8">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-4 items-center"
        >
          <input
            type="text"
            placeholder="Village name"
            className="border rounded-lg p-3 w-full md:flex-1 shadow-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={publish}
              onChange={(e) => setPublish(e.target.checked)}
              className="w-4 h-4 accent-indigo-600"
            />
            Publish
          </label>

          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            {editId ? "Update" : "Add"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setName("");
                setPublish(true);
              }}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Search + Rows per page */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <input
          placeholder="Search village..."
          className="border rounded-lg px-3 py-2 w-60 shadow-sm"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="border rounded-lg px-3 py-2"
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value={5}>5 rows</option>
          <option value={10}>10 rows</option>
          <option value={20}>20 rows</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl shadow overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-4 py-3 text-left">Village Name</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : pageData.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-400">
                  No villages found
                </td>
              </tr>
            ) : (
              pageData.map((v) => (
                <tr key={v._id} className="border-t hover:bg-indigo-50 transition">
                  <td className="px-4 py-3 font-medium">{v.name}</td>

                  <td className="px-4 py-3">
                    {v.publish ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                        ✔ Published
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                        ✖ Unpublished
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(v.createdDate).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 flex gap-3">
                    <button
                      onClick={() => handleEdit(v)}
                      className="px-3 py-1 bg-yellow-400 rounded-lg"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(v._id)}
                      className="px-3 py-1 bg-red-400 rounded-lg"
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
        <div className="flex justify-center items-center gap-3 mt-6">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
