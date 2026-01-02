import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch Users
  const fetchUsers = async (query = q, pageNumber = 1) => {
    try {
      setLoading(true);

      const params = { page: pageNumber, limit };
      if (query) params.q = query;

      const res = await api.get("/users", { params });
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];

      setUsers(data);

      if (res.data.total && res.data.limit) {
        setTotalPages(Math.ceil(res.data.total / res.data.limit));
      } else {
        setTotalPages(1);
      }
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete User
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchUsers(q, 1);
  };

  const clearSearch = () => {
    setQ("");
    fetchUsers("", 1);
  };

  const handlePrev = () => {
    if (page <= 1) return;
    const newPage = page - 1;
    setPage(newPage);
    fetchUsers(q, newPage);
  };

  const handleNext = () => {
    if (page >= totalPages) return;
    const newPage = page + 1;
    setPage(newPage);
    fetchUsers(q, newPage);
  };

  const roleBadge = (role) => {
    const colors = {
      admin: "bg-red-100 text-red-700",
      representative: "bg-blue-100 text-blue-700",
      user: "bg-green-100 text-green-700",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[role] || "bg-gray-200"}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">

      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>

        <Link
          to="/dashboard/admin/add-user"
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          + Add User
        </Link>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="🔍 Search by name, email, role"
          className="border rounded-lg px-3 py-2 w-full sm:w-72 focus:ring-2 focus:ring-indigo-300"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Search
          </button>
          <button
            onClick={clearSearch}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : users.length === 0 ? (
        <div className="text-center py-10 text-gray-500 text-lg">No users found.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700 border-b">
                <th className="px-3 py-2 text-left">#</th>
                <th className="px-3 py-2 text-left">User</th>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">Phone</th>
                <th className="px-3 py-2 text-left">Description</th>
                <th className="px-3 py-2 text-left">Role</th>
                <th className="px-3 py-2 text-left">Created</th>
                <th className="px-3 py-2 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, i) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-3 py-2">{(page - 1) * limit + i + 1}</td>

                  {/* Avatar + Name */}
                  <td className="px-3 py-2 flex items-center gap-3">
                    <img
                      src={user.avatar || "/no_image.png"}
                      className="w-10 h-10 rounded-full border object-cover"
                    />
                    <span className="font-medium">{user.name}</span>
                  </td>

                  <td className="px-3 py-2">{user.email}</td>
                   <td className="px-3 py-2">{user.phone}</td>
                    <td className="px-3 py-2">{user.description}</td>

                  <td className="px-3 py-2">{roleBadge(user.role)}</td>

                  <td className="px-3 py-2 text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-3 py-2 text-center space-x-3">
                    <Link
                      to={`/dashboard/admin/edit-user/${user._id}`}
                      className="px-3 py-1 bg-yellow-400 rounded-lg"
                    >
                      ✏️ Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(user._id)}
                      className="px-3 py-1 bg-red-400 rounded-lg"
                    >
                       🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

      {/* Pagination */}
      {users.length > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Showing page <strong>{page}</strong> of <strong>{totalPages}</strong>
          </span>

          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={page <= 1}
              className="px-4 py-1 rounded-lg border disabled:opacity-40 hover:bg-gray-100 transition"
            >
              ← Prev
            </button>

            <button
              onClick={handleNext}
              disabled={page >= totalPages}
              className="px-4 py-1 rounded-lg border disabled:opacity-40 hover:bg-gray-100 transition"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
