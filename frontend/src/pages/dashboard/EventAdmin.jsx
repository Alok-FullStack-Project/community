import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

export default function EventAdmin() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);

  // Search & Filters
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Sorting
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Load categories
  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories?type=event");
      setCategories(res.data);
    } catch {}
  };

  // Load events
  const fetchEvents = async () => {
  try {
    setLoading(true);

    const res = await api.get("/events");
    const all = res.data.data || res.data || [];

    // Apply search filter (frontend)
    let filtered = all.filter((ev) =>
      ev.name.toLowerCase().includes(search.toLowerCase())
    );

    // Filter category
    if (filterCategory) {
      filtered = filtered.filter(
        (ev) => ev.category?._id === filterCategory
      );
    }

    // Filter status
    if (filterStatus !== "") {
      filtered = filtered.filter(
        (ev) => String(ev.publish) === filterStatus
      );
    }

    // Sorting (frontend)
    if (sortField === "name") {
      filtered.sort((a, b) =>
        sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
    }

    if (sortField === "category") {
      filtered.sort((a, b) =>
        sortOrder === "asc"
          ? (a.category?.name || "").localeCompare(b.category?.name || "")
          : (b.category?.name || "").localeCompare(a.category?.name || "")
      );
    }

    if (sortField === "createdAt") {
      filtered.sort((a, b) =>
        sortOrder === "asc"
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    // Pagination (frontend)
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);
    setTotalPages(Math.ceil(filtered.length / limit));

    setEvents(paginated);
  } catch (err) {
    console.error(err);
    alert("Failed to load events");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, [page, sortField, sortOrder]);

  // Search Debounce
  useEffect(() => {
    const delay = setTimeout(() => fetchEvents(), 300);
    return () => clearTimeout(delay);
  }, [search, filterCategory, filterStatus]);

  // Delete event
  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      fetchEvents();
    } catch {
      alert("Delete failed");
    }
  };

  // Toggle status
  const togglePublish = async (event) => {
    try {
      await api.put(`/events/${event._id}/publish`, {
        publish: !event.publish,
      });
      fetchEvents();
    } catch {
      alert("Unable to update status");
    }
  };

  // Sorting Handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-xl">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Event Management</h2>
        <Link
          to="/dashboard/admin/events/add"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
        >
          + Add Event
        </Link>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name..."
          className="p-3 border rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Category Filter */}
        <select
          className="p-3 border rounded-lg"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          className="p-3 border rounded-lg"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="true">Published</option>
          <option value="false">Unpublished</option>
        </select>

        {/* Reset Button */}
        <button
          className="p-3 border rounded-lg hover:bg-gray-100"
          onClick={() => {
            setSearch("");
            setFilterCategory("");
            setFilterStatus("");
            fetchEvents();
          }}
        >
          Reset Filters
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 cursor-pointer" onClick={() => handleSort("name")}>
                Name {sortField === "name" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="border px-3 py-2">Image</th>
              <th className="border px-3 py-2 cursor-pointer" onClick={() => handleSort("category.name")}>
                Category {sortField === "category.name" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="border px-3 py-2 cursor-pointer" onClick={() => handleSort("createdAt")}>
                Created {sortField === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-600">
                  No events found.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event._id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2 font-medium">{event.name}</td>

                  <td className="border px-3 py-2">
                    {event.coverImage ? (
                      <img
                        src={event.coverImage}
                        alt={event.name}
                        className="h-12 w-20 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </td>

                  <td className="border px-3 py-2">
                    {event.category?.name || "Uncategorized"}
                  </td>

                  <td className="border px-3 py-2">
                    {new Date(event.createdAt).toLocaleDateString()}
                  </td>

                  {/* Status Toggle */}
                  <td className="border px-3 py-2">
                    <button
                      onClick={() => togglePublish(event)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        event.publish
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {event.publish ? "Published" : "Unpublished"}
                    </button>
                  </td>

                  {/* Action Buttons */}
                  <td className="border px-3 py-2 space-x-3 text-center">
                    <Link
                      to={`/dashboard/admin/events/edit/${event._id}`}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      ✏️ Edit
                    </Link>

                    <button
                      onClick={() => deleteEvent(event._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      🗑 Delete
                    </button>

                    <Link
                      to={`/dashboard/admin/events/images/${event._id}`}
                      className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      + Images
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-6">
        <span className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
