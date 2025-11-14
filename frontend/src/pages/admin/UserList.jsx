import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // 🔹 Fetch users
  const fetchUsers = async (query = q, pageNumber = 1) => {
    try {
      setLoading(true);
      const params = { page: pageNumber, limit };
      if (query) params.q = query;

      const res = await api.get("/users", { params });
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setUsers(data);

      if (res.data.total && res.data.limit)
        setTotalPages(Math.ceil(res.data.total / res.data.limit));
      else setTotalPages(1);
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

  // 🔹 Delete user
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
    const np = page - 1;
    setPage(np);
    fetchUsers(q, np);
  };

  const handleNext = () => {
    if (page >= totalPages) return;
    const np = page + 1;
    setPage(np);
    fetchUsers(q, np);
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
        <h2 className="text-2xl font-semibold">User Management</h2>
        <Link
          to="/dashboard/admin/add-user"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add User
        </Link>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or email"
          className="border rounded-lg px-3 py-2 w-full sm:w-64"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Search
          </button>
          <button
            onClick={clearSearch}
            className="px-4 py-2 border rounded-lg"
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
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="border px-3 py-2">#</th>
                <th className="border px-3 py-2">Name</th>
                <th className="border px-3 py-2">Email</th>
                <th className="border px-3 py-2">Role</th>
                <th className="border px-3 py-2">Created</th>
                <th className="border px-3 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="border px-3 py-2 text-center">{i + 1}</td>
                  <td className="border px-3 py-2 font-medium">{user.name}</td>
                  <td className="border px-3 py-2">{user.email}</td>
                  <td className="border px-3 py-2 capitalize">{user.role}</td>
                  <td className="border px-3 py-2 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border px-3 py-2 text-center space-x-2">
                    <Link
                      to={`/dashboard/admin/edit-user/${user._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
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
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={page <= 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={handleNext}
              disabled={page >= totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
