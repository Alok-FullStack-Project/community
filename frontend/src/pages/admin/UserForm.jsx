import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import { Section } from "../../components/Section";

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
  const [villageSearch, setVillageSearch] = useState("");
  const [emailSearch, setEmailSearch] = useState("");

  const filteredVillages = villages.filter(v =>
  v.name.toLowerCase().includes(villageSearch.toLowerCase())
);

const toggleVillage = (name) => {
  setUser(prev => {
    const exists = prev.nativePlaces.includes(name);
    return {
      ...prev,
      nativePlaces: exists
        ? prev.nativePlaces.filter(v => v !== name)
        : [...prev.nativePlaces, name],
    };
  });
};
//console.log(headEmails)
const filteredEmails = headEmails.filter(e =>
  e?.toLowerCase().includes(emailSearch.toLowerCase())
);
//const filteredEmails = headEmails;
//console.log(filteredEmails)

const toggleEmail = (email) => {
  setUser(prev => {
    const exists = prev.linkedEmails.includes(email);
    return {
      ...prev,
      linkedEmails: exists
        ? prev.linkedEmails.filter(e => e !== email)
        : [...prev.linkedEmails, email],
    };
  });
};



  // Load villages & emails
  useEffect(() => {
    const loadData = async () => {
      try {
        const vRes = await api.get("/villages/all");
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
     <>
        <Section title1="User" tittle2="Management"/>
    <div className="max-w-3xl mx-auto p-3 mt-5">
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

    {/* Search */}
    <input
      placeholder="Search village..."
      value={villageSearch}
      onChange={(e) => setVillageSearch(e.target.value)}
      className="mb-3 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-300"
    />

    {/* Dropdown list */}
    <div className="border rounded-lg max-h-48 overflow-y-auto bg-white">
      {filteredVillages.map((v) => (
        <label
          key={v._id}
          className="flex items-center gap-3 px-4 py-2 hover:bg-indigo-50 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={user.nativePlaces.includes(v.name)}
            onChange={() => toggleVillage(v.name)}
            className="accent-indigo-600"
          />
          <span>{v.name}</span>
        </label>
      ))}

      {filteredVillages.length === 0 && (
        <div className="px-4 py-3 text-sm text-gray-400">
          No villages found
        </div>
      )}
    </div>

    {/* Selected Chips */}
    {user.nativePlaces.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-4">
        {user.nativePlaces.map((v) => (
          <span
            key={v}
            className="flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
          >
            {v}
            <button
              type="button"
              onClick={() => toggleVillage(v)}
              className="hover:text-red-500 font-bold"
            >
              ✕
            </button>
          </span>
        ))}
      </div>
    )}
  </div>
)}


          {/* USER → SELECT HEAD EMAILS */}
{/* USER → SELECT HEAD EMAILS */}
{user.role === "user" && (
  <div className="pt-6 border-t">
    <h3 className="text-lg font-semibold mb-3 text-indigo-700">
      Linked Family Head Emails
    </h3>

    {/* Search */}
    <input
      placeholder="Search email..."
      value={emailSearch}
      onChange={(e) => setEmailSearch(e.target.value)}
      className="mb-3 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-300"
    />

    {/* Email list */}
    <div className="border rounded-lg max-h-48 overflow-y-auto bg-white">
      {filteredEmails.map((email,index) => (
        <label
          key={index}
          className="flex items-center gap-3 px-4 py-2 hover:bg-indigo-50 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={user.linkedEmails.includes(email)}
            onChange={() => toggleEmail(email)}
            className="accent-indigo-600"
            disabled={!email}
          />
          <span>{email}</span>
        </label>
      ))}

      {filteredEmails.length === 0 && (
        <div className="px-4 py-3 text-sm text-gray-400">
          No emails found
        </div>
      )}
    </div>

    {/* Selected Chips */}
    {user.linkedEmails.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-4">
        {user.linkedEmails.map((email) => (
          <span
            key={email}
            className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
          >
            {email}
            <button
              type="button"
              onClick={() => toggleEmail(email)}
              className="hover:text-red-500 font-bold"
            >
              ✕
            </button>
          </span>
        ))}
      </div>
    )}
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
    </>
  );
}
