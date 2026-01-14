import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";
import { Section } from "../../components/Section";

export default function AdvertiseAdmin() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters, Sorting, Pagination
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("status"); // NEW
  const [statusFilter, setStatusFilter] = useState("all"); // NEW
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const res = await api.get("/advertise");
      setAds(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch advertisements");
    } finally {
      setLoading(false);
    }
  };

  // ------------------ STATUS LOGIC ------------------
  const getDateStatus = (start, end) => {
    const today = new Date();
    const s = start ? new Date(start) : null;
    const e = end ? new Date(end) : null;

    if (!s && !e)
      return {
        key: "none",
        label: "No Dates",
        badge: "bg-gray-200 text-gray-700",
        row: "bg-gray-50",
        countdown: "",
      };

    if (s && today < s) {
      const diff = Math.ceil((s - today) / (1000 * 60 * 60 * 24));
      return {
        key: "upcoming",
        label: "Upcoming",
        badge: "bg-orange-100 text-orange-700",
        row: "bg-orange-50/40",
        countdown: `Starts in ${diff} day(s)`,
      };
    }

    if (e && today > e) {
      const diff = Math.ceil((today - e) / (1000 * 60 * 60 * 24));
      return {
        key: "expired",
        label: "Expired",
        badge: "bg-red-100 text-red-700",
        row: "bg-red-50/40",
        countdown: `Expired ${diff} day(s) ago`,
      };
    }

    const diff = Math.ceil((new Date(end) - today) / (1000 * 60 * 60 * 24));
    return {
      key: "running",
      label: "Running",
      badge: "bg-green-100 text-green-700",
      row: "bg-green-50/40",
      countdown: `${diff} day(s) left`,
    };
  };

  // ------------------ SEARCH ------------------
  let filtered = ads.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  // ------------------ FILTER BY STATUS ------------------
  filtered = filtered.filter((a) => {
    const status = getDateStatus(a.startDate, a.endDate).key;
    if (statusFilter === "all") return true;
    return status === statusFilter;
  });

  // ------------------ SORTING ------------------
  if (sortBy === "az") filtered.sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === "za") filtered.sort((a, b) => b.name.localeCompare(a.name));

  // Status sorting order
  const order = { running: 1, upcoming: 2, expired: 3, none: 4 };

  if (sortBy === "status") {
    filtered.sort(
      (a, b) =>
        order[getDateStatus(a.startDate, a.endDate).key] -
        order[getDateStatus(b.startDate, b.endDate).key]
    );
  }

  // ------------------ PAGINATION ------------------
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const pageData = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // ------------------ DELETE ------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await api.delete(`/advertise/${id}`);
      setAds((prev) => prev.filter((x) => x._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <>
    <Section title1="Advertise" tittle2="Management"/>
    <div className="max-w-6xl mx-auto p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
       {/** <h2 className="text-3xl font-semibold text-slate-800">Manage Advertisements</h2>*/} 

        <Link
          to="/dashboard/admin/advertise/add"
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
        >
          + Add New
        </Link>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-between mb-4">

        {/* Search */}
        <input
          type="text"
          placeholder="Search ads..."
          className="border px-4 py-2 rounded-lg shadow-sm w-60"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {/* Status Filter */}
        <select
          className="border px-4 py-2 rounded-lg shadow-sm"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All Status</option>
          <option value="running">Running</option>
          <option value="upcoming">Upcoming</option>
          <option value="expired">Expired</option>
        </select>

        {/* Sort */}
        <select
          className="border px-4 py-2 rounded-lg shadow-sm"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="status">Sort by Status</option>
          <option value="az">Name A → Z</option>
          <option value="za">Name Z → A</option>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>

      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow border">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-4 py-3 text-left">Preview</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Dates</th>
              <th className="px-4 py-3 text-left">Mobile</th>
              <th className="px-4 py-3 text-left">Link</th>
              <th className="px-4 py-3 text-left">Priority</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="py-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : pageData.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-6 text-center text-gray-400">
                  No advertisements found.
                </td>
              </tr>
            ) : (
              pageData.map((ad) => {
                const status = getDateStatus(ad.startDate, ad.endDate);

                return (
                  <tr
                    key={ad._id}
                    className={`border-t hover:bg-indigo-50 transition ${status.row}`}
                  >
                    {/* IMAGE */}
                    <td className="px-4 py-3">
                      {ad.image ? (
                        <img
                           src={`${backend_url}${ad.image}`}
                          className="h-12 w-12 rounded object-cover shadow"
                        />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </td>

                    {/* NAME */}
                    <td className="px-4 py-3 font-medium">{ad.name}</td>

                    {/* DATE RANGE + COUNTDOWN */}
                    <td className="px-4 py-3">
                      {ad.startDate ? new Date(ad.startDate).toLocaleDateString() : "-"} →{" "}
                      {ad.endDate ? new Date(ad.endDate).toLocaleDateString() : "-"}
                      <div className="text-xs text-indigo-700 mt-1">
                        {status.countdown}
                      </div>
                    </td>

                    {/* MOBILE */}
                    <td className="px-4 py-3">{ad.mobile || "-"}</td>

                    {/* LINK */}
                    <td className="px-4 py-3">
                      <a href={ad.link} target="_blank" className="text-indigo-600 underline">
                        {ad.link || "-"}
                      </a>
                    </td>
                    {/* PRIORITY */}
                    <td className="px-4 py-3">{ad.priority}</td>
                    
                    {/* STATUS BADGE */}
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${status.badge}`}
                      >
                        {status.label}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3 flex gap-2">

                      <Link
                        to={`/dashboard/admin/advertise/edit/${ad._id}`}
                        className="px-3 py-1 bg-yellow-400 rounded-lg"
                      >
                        ✏️ Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(ad._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg"
                      >
                        🗑 Delete
                      </button>

                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
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
              className={`px-3 py-2 rounded ${
                page === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => setPage(i + 1)}
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
    </>
  );
}
