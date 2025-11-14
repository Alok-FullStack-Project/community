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

  // ✅ Fetch Village list & Head Email list
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch villages
        //const villageRes = await api.get("/villages", {
        //  headers: { Authorization: `Bearer ${token}` },
        //});
         const res = await api.get('/villages');
         setVillages(res.data.data);
       // setVillages(villageRes.data.data || []);

        // Fetch head emails
        const headEmailRes = await api.get("/family/head-emails");
        setHeadEmails(headEmailRes.data || []);
      } catch (err) {
        console.error("Error fetching lists:", err);
      }
    };

    fetchLists();
  }, []);

  // ✅ Load existing user (edit mode)
  useEffect(() => {
    if (isEdit) {
      const fetchUser = async () => {
        try {
          const res = await api.get(`/users/${id}`);
          setUser(res.data);
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      };
      fetchUser();
    }
  }, [id, isEdit]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle multi-village select
  const handleVillageChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setUser((prev) => ({ ...prev, nativePlaces: selected }));
  };

  // ✅ Handle multi-email select
  const handleEmailChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setUser((prev) => ({ ...prev, linkedEmails: selected }));
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user)
    try {
      if (isEdit) {
        await api.put(`/users/${id}`, user);
      } else {
        await api.post("/users", user);
      }
      alert("User saved successfully!");
      navigate("/dashboard/admin/user-list");
    } catch (err) {
      console.error("Error saving user:", err);
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
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Email */}
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Password (only on Add) */}
        {!isEdit && (
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
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

       {user.role === "representative" && (
  <>
    {/* Multi-select Villages */}
    <div className="col-span-2">
      <label className="block text-sm font-medium mb-1">
        Select Villages (multiple)
      </label>
      <select
        multiple
        value={user.nativePlaces}
        onChange={(e) => {
          const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
          setUser((prev) => ({
            ...prev,
            nativePlaces: selected,
            linkedEmails: selected.length > 0 ? [] : prev.linkedEmails, // clear emails if villages selected
          }));
        }}
        disabled={user.linkedEmails.length > 0} // disable if emails chosen
        className="border p-2 rounded w-full h-32 disabled:bg-gray-100"
      >
        {villages.map((v) => (
          <option key={v._id} value={v.name}>
            {v.name}
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-500 mt-1">
        Hold Ctrl (Windows) or Cmd (Mac) to select multiple.
      </p>
    </div>

    {/* Multi-select Head Emails */}
    <div className="col-span-2">
      <label className="block text-sm font-medium mb-1">
        Linked Family Head Emails
      </label>
      <select
        multiple
        value={user.linkedEmails}
        onChange={(e) => {
          const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
          setUser((prev) => ({
            ...prev,
            linkedEmails: selected,
            nativePlaces: selected.length > 0 ? [] : prev.nativePlaces, // clear villages if emails selected
          }));
        }}
        disabled={user.nativePlaces.length > 0} // disable if villages chosen
        className="border p-2 rounded w-full h-32 disabled:bg-gray-100"
      >
        {headEmails.map((email) => (
          <option key={email} value={email}>
            {email}
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-500 mt-1">
        You can choose either villages OR head emails, not both.
      </p>
    </div>
  </>
)}

        {/* Buttons */}
        <div className="col-span-2 flex justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate("/users")}
            className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500 transition"
          >
            Close
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
