import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    password: "",
    role: "user",
    nativePlaces: [],
    linkedEmails: [],
  });

  const [villages, setVillages] = useState([]);
  const [headEmails, setHeadEmails] = useState([]);

  // Load villages & emails
  useEffect(() => {
    const loadData = async () => {
      try {
        const vRes = await api.get("/villages");
        setVillages(vRes.data.data || []);

        const hRes = await api.get("/family/head-emails");
        setHeadEmails(hRes.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, []);

  // Load existing user
  useEffect(() => {
    if (isEdit) {
      const loadUser = async () => {
        try {
          const res = await api.get(`/users/${id}`);
          setUser(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      loadUser();
    }
  }, [id, isEdit]);

  // Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;

    // If role changes → reset dependent fields
    if (name === "role") {
      setUser((prev) => ({
        ...prev,
        role: value,
        nativePlaces: value === "representative" ? prev.nativePlaces : [],
        linkedEmails: value === "user" ? prev.linkedEmails : [],
      }));
    } else {
      setUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Multi-select villages
  const handleVillageChange = (e) => {
    const selected = [...e.target.options]
      .filter((o) => o.selected)
      .map((o) => o.value);
    setUser((prev) => ({ ...prev, nativePlaces: selected }));
  };

  // Multi-select emails
  const handleEmailChange = (e) => {
    const selected = [...e.target.options]
      .filter((o) => o.selected)
      .map((o) => o.value);
    setUser((prev) => ({ ...prev, linkedEmails: selected }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await api.put(`/users/${id}`, user);
      } else {
        await api.post("/users", user);
      }

      alert("User saved successfully");
      navigate("/dashboard/admin/user-list");
    } catch (err) {
      console.error(err);
      alert("Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          {isEdit ? "Edit User" : "Add New User"}
        </h2>

        <button
          onClick={() => navigate("/dashboard/admin/user-list")}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          ← Back
        </button>
      </div>

      {/* Form Card */}
      <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* USER INFO */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-indigo-700">
              User Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="font-medium text-sm">Full Name</label>
                <input
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  required
                  className="mt-1 p-3 border rounded-lg w-full focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              <div>
                <label className="font-medium text-sm">Email</label>
                <input
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  type="email"
                  required
                  className="mt-1 p-3 border rounded-lg w-full focus:ring-2 focus:ring-indigo-300"
                />
              </div>

               <div>
                <label className="font-medium text-sm">Phone</label>
                <input
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  type="text"
                  required
                  className="mt-1 p-3 border rounded-lg w-full focus:ring-2 focus:ring-indigo-300"
                />
              </div>

               <div>
                <label className="font-medium text-sm">Description</label>
                <textarea
                  name="description"
                  value={user.description}
                  onChange={handleChange}
                  type="text"
                  required
                  className="mt-1 p-3 border rounded-lg w-full focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              {!isEdit && (
                <div className="md:col-span-2">
                  <label className="font-medium text-sm">Password</label>
                  <input
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    type="password"
                    required
                    className="mt-1 p-3 border rounded-lg w-full focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              )}
            </div>
          </div>

          {/* ROLE */}
          <div className="pt-4 border-t">
            <h3 className="text-lg font-semibold mb-3 text-indigo-700">
              Role & Permissions
            </h3>

            <select
              name="role"
              value={user.role}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full md:w-1/2 focus:ring-2 focus:ring-indigo-300"
            >
              <option value="user">User</option>
              <option value="representative">Representative</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* REPRESENTATIVE → SELECT VILLAGES */}
          {user.role === "representative" && (
            <div className="pt-4 border-t">
              <h3 className="text-lg font-semibold mb-3 text-indigo-700">
                Assigned Villages
              </h3>

              <select
                multiple
                value={user.nativePlaces}
                onChange={handleVillageChange}
                className="p-3 border rounded-lg w-full h-40"
              >
                {villages.map((v) => (
                  <option key={v._id} value={v.name}>
                    {v.name}
                  </option>
                ))}
              </select>

              {/* Selected Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {user.nativePlaces.map((v) => (
                  <span
                    key={v}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* USER → SELECT HEAD EMAILS */}
          {user.role === "user" && (
            <div className="pt-4 border-t">
              <h3 className="text-lg font-semibold mb-3 text-indigo-700">
                Linked Family Head Emails
              </h3>

              <select
                multiple
                value={user.linkedEmails}
                onChange={handleEmailChange}
                className="p-3 border rounded-lg w-full h-40"
              >
                {headEmails.map((email) => (
                  <option key={email} value={email}>
                    {email}
                  </option>
                ))}
              </select>

              {/* Selected Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {user.linkedEmails.map((em) => (
                  <span
                    key={em}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                  >
                    {em}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate("/dashboard/admin/user-list")}
              className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow"
            >
              {loading ? "Saving..." : "Save User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
