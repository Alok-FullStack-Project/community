import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function AddFamily() {
  const navigate = useNavigate();

  const [villages, setVillages] = useState([]);
  const [families, setFamilies] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState("");
  const [mode, setMode] = useState("new");
  const [selectedFamily, setSelectedFamily] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    gender: "Male",
    relation: "Head",
    birthDate: "",
    education: "",
    profession: "",
    profession_type: "",
    profession_address: "",
    residence_address: "",
    marital_status: "",
    blood_group: "",
    mobile: "",
    email: "",
    remarks: "",
    publish: true,
    image: null,
  });

  useEffect(() => {
    fetchVillages();
  }, []);

  useEffect(() => {
    if (mode === "member" && selectedVillage) {
      fetchFamilies(selectedVillage);
    } else {
      setFamilies([]);
      setSelectedFamily("");
    }
  }, [mode, selectedVillage]);

  const fetchVillages = async () => {
    try {
      const res = await api.get("/villages");
      setVillages(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load villages.");
    }
  };

  const fetchFamilies = async (village) => {
    try {
      const res = await api.get(`/family?village=${village}`);
      setFamilies(res.data.data || res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load families.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVillage) return alert("Please select a village first.");

    setLoading(true);
    try {
      const formData = new FormData();
      for (const key in form) {
        if (form[key] !== null) formData.append(key, form[key]);
      }
      formData.append("village", selectedVillage);

      if (mode === "new") {
        await api.post("/family", formData);
        alert("✅ Family head added successfully!");
      } else {
        if (!selectedFamily) {
          alert("Please select a family to add member.");
          setLoading(false);
          return;
        }
        await api.post(`/family/${selectedFamily}/members`, formData);
        alert("👨‍👩‍👧 Member added successfully!");
      }

      navigate("/dashboard/admin/family-list");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Save failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {mode === "new" ? "Add Family Head" : "Add Family Member"}
      </h2>

      {/* Village Selection */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Select Village</label>
        <select
          className="border p-3 rounded w-full"
          value={selectedVillage}
          onChange={(e) => setSelectedVillage(e.target.value)}
        >
          <option value="">-- Select Village --</option>
          {villages.map((v) => (
            <option key={v._id} value={v.name}>
              {v.name}
            </option>
          ))}
        </select>
      </div>

      {/* Mode Selection */}
      <div className="flex gap-6 mb-6">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="new"
            checked={mode === "new"}
            onChange={(e) => setMode(e.target.value)}
            className="accent-blue-600"
          />
          Add Family Head
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="member"
            checked={mode === "member"}
            onChange={(e) => setMode(e.target.value)}
            className="accent-blue-600"
          />
          Add Member
        </label>
      </div>

      {/* Family Select */}
      {mode === "member" && selectedVillage && (
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Select Family</label>
          <select
            className="border p-3 rounded w-full"
            value={selectedFamily}
            onChange={(e) => setSelectedFamily(e.target.value)}
          >
            <option value="">-- Select Family --</option>
            {families.map((f) => (
              <option key={f._id} value={f._id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {(mode === "new" || (mode === "member" && selectedFamily)) && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <div>
            <label className="block mb-1 font-semibold">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border p-3 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="border p-3 rounded w-full"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Relation</label>
            <select
              name="relation"
              value={form.relation}
              onChange={handleChange}
              disabled={mode === "new"}
              className="border p-3 rounded w-full"
            >
              {mode === "new" ? (
                <option value="Head">Head</option>
              ) : (
                <>
                  <option value="">Select Relation</option>
                  <option value="Wife">Wife</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Grandfather">Grandfather</option>
                  <option value="Grandmother">Grandmother</option>
                  <option value="Other">Other</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Birth Date</label>
            <input
              type="date"
              name="birthDate"
              value={form.birthDate}
              onChange={handleChange}
              className="border p-3 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Education</label>
            <input
              name="education"
              value={form.education}
              onChange={handleChange}
              placeholder="Education"
              className="border p-3 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Profession</label>
            <input
              name="profession"
              value={form.profession}
              onChange={handleChange}
              placeholder="Profession"
              className="border p-3 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Profession Type</label>
            <input
              name="profession_type"
              value={form.profession_type}
              onChange={handleChange}
              placeholder="Type"
              className="border p-3 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">
              Profession Address
            </label>
            <input
              name="profession_address"
              value={form.profession_address}
              onChange={handleChange}
              placeholder="Address"
              className="border p-3 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Residence Address</label>
            <input
              name="residence_address"
              value={form.residence_address}
              onChange={handleChange}
              placeholder="Residence"
              className="border p-3 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Marital Status</label>
            <select
              name="marital_status"
              value={form.marital_status}
              onChange={handleChange}
              className="border p-3 rounded w-full"
            >
              <option value="">Select</option>
              <option>Married</option>
              <option>UnMarried</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Blood Group</label>
            <input
              name="blood_group"
              value={form.blood_group}
              onChange={handleChange}
              placeholder="Blood Group"
              className="border p-3 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Mobile</label>
            <input
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="Mobile"
              className="border p-3 rounded w-full"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="border p-3 rounded w-full"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 font-semibold">Upload Image</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 font-semibold">Remarks</label>
            <textarea
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              placeholder="Remarks"
              className="border p-3 rounded w-full"
            />
          </div>

          <div className="flex items-center gap-2 md:col-span-2">
            <input
              type="checkbox"
              name="publish"
              checked={form.publish}
              onChange={handleChange}
            />
            <label className="font-medium">Publish</label>
          </div>

          <div className="flex gap-4 md:col-span-2 justify-end mt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {loading
                ? "Saving..."
                : mode === "new"
                ? "Create Family"
                : "Add Member"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard/admin/family-list")}
              className="border px-6 py-2 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
