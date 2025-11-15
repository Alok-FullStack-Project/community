import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    nativePlaces: [],
    linkedEmails: [],
  });

  const [villages, setVillages] = useState([]);
  const [headEmails, setHeadEmails] = useState([]);

  // Load villages & head emails
  useEffect(() => {
    const loadLists = async () => {
      try {
        const vRes = await api.get("/villages");
        setVillages(vRes.data.data || []);

        const hRes = await api.get("/family/head-emails");
        setHeadEmails(hRes.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadLists();
  }, []);

  // Load user when editing
  useEffect(() => {
    if (isEdit) {
      const fetchUser = async () => {
        try {
          const res = await api.get(`/users/${id}`);
          setUser(res.data);
        } catch (err) {
          console.error("Error loading user:", err);
        }
      };
      fetchUser();
    }
  }, [id, isEdit]);

  // Handle general input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear dependent fields when role changes
    if (name === "role") {
      setUser((prev) => ({
        ...prev,
        role: value,
        nativePlaces: value === "representative" ? prev.nativePlaces : [],
        linkedEmails: value === "user" ? prev.linkedEmails : [],
      }));
      return;
    }

    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // Multi-select villages
  const handleVillageChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setUser((prev) => ({
      ...prev,
      nativePlaces: selected,
    }));
  };

  // Multi-select emails
  const handleEmailChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setUser((prev) => ({
      ...prev,
      linkedEmails: selected,
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
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
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">
        {isEdit ? "Edit User" : "Add User"}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

        {/* Name */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            name="name"
            value={user.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {/* Email */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            value={user.email}
            onChange={handleChange}
            type="email"
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {/* Password (Only Add) */}
        {!isEdit && (
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              name="password"
              value={user.password}
              onChange={handleChange}
              type="password"
              className="border p-2 rounded w-full"
              required
            />
          </div>
        )}

        {/* Role */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            name="role"
            value={user.role}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="user">User</option>
            <option value="representative">Representative</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Representative → Villages */}
        {user.role === "representative" && (
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">
              Assign Villages (Multiple)
            </label>
            <select
              multiple
              value={user.nativePlaces}
              onChange={handleVillageChange}
              className="border p-2 rounded w-full h-32"
            >
              {villages.map((v) => (
                <option key={v._id} value={v.name}>
                  {v.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Hold Ctrl (Windows) / Cmd (Mac) to select multiple.
            </p>
          </div>
        )}

        {/* User → Emails */}
        {user.role === "user" && (
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">
              Link Head Emails (Multiple)
            </label>
            <select
              multiple
              value={user.linkedEmails}
              onChange={handleEmailChange}
              className="border p-2 rounded w-full h-32"
            >
              {headEmails.map((email) => (
                <option key={email} value={email}>
                  {email}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              You can select multiple emails.
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="col-span-2 flex justify-between mt-6">
          <button
            type="button"
            className="bg-gray-400 text-white py-2 px-4 rounded"
            onClick={() => navigate("/dashboard/admin/user-list")}
          >
            Close
          </button>

          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 rounded"
          >
            Save Changes
          </button>
        </div>

      </form>
    </div>
  );
};

export default UserForm;
