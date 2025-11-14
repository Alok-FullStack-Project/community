import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL + '/family';

const FamilyEdit = ({ role }) => {
  const { familyId, memberId } = useParams();
  const [member, setMember] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const token = localStorage.getItem("token");

        if (memberId === "head") {
          const { data } = await axios.get(
            `${API_BASE}/${familyId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setMember(data);
        } else {
          const { data } = await axios.get(
            `${API_BASE}/member/${memberId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setMember(data);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load member details");
      }
    };
    fetchMember();
  }, [memberId, familyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (memberId === "head") {
        await axios.put(`${API_BASE}/${familyId}`, member, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Family updated successfully!");
      } else {
        await axios.put(
          `${API_BASE}/member/${memberId}`,
          member,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Member updated successfully!");
      }

      navigate(`/dashboard/admin/family-list`);
    } catch (err) {
      console.error(err);
      alert("Failed to update member");
    }
  };

  if (!member) return <p>Loading...</p>;

  const relationOptions = [
    "Head",
    "Son",
    "Daughter",
    "Father",
    "Mother",
    "Brother",
    "Sister",
    "Grandfather",
    "Grandmother",
    "Other",
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Family Member</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={member.name || ""}
            onChange={handleChange}
            placeholder="Enter full name"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-gray-700 mb-1">Gender</label>
          <select
            name="gender"
            value={member.gender || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        {/* Relation */}
        <div>
          <label className="block text-gray-700 mb-1">Relation</label>
          <select
            name="relation"
            value={member.relation || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
            disabled={member.relation === "Head"}
          >
            <option value="">Select Relation</option>
            {relationOptions
              .filter((r) =>
                member.relation === "Head" ? r === "Head" : r !== "Head"
              )
              .map((r) => (
                <option key={r}>{r}</option>
              ))}
          </select>
        </div>

        {/* Birth Date */}
        <div>
          <label className="block text-gray-700 mb-1">Birth Date</label>
          <input
            type="date"
            name="birthDate"
            value={member.birthDate ? member.birthDate.split("T")[0] : ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Education */}
        <div>
          <label className="block text-gray-700 mb-1">Education</label>
          <input
            type="text"
            name="education"
            value={member.education || ""}
            onChange={handleChange}
            placeholder="Enter education"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Profession */}
        <div>
          <label className="block text-gray-700 mb-1">Profession</label>
          <input
            type="text"
            name="profession"
            value={member.profession || ""}
            onChange={handleChange}
            placeholder="Enter profession"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Profession Type */}
        <div>
          <label className="block text-gray-700 mb-1">Profession Type</label>
          <input
            type="text"
            name="profession_type"
            value={member.profession_type || ""}
            onChange={handleChange}
            placeholder="Enter profession type"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Profession Address */}
        <div className="col-span-2">
          <label className="block text-gray-700 mb-1">Profession Address</label>
          <input
            type="text"
            name="profession_address"
            value={member.profession_address || ""}
            onChange={handleChange}
            placeholder="Enter profession address"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Residence Address */}
        <div className="col-span-2">
          <label className="block text-gray-700 mb-1">Residence Address</label>
          <input
            type="text"
            name="residence_address"
            value={member.residence_address || ""}
            onChange={handleChange}
            placeholder="Enter residence address"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Marital Status */}
        <div>
          <label className="block text-gray-700 mb-1">Marital Status</label>
          <select
            name="martial_status"
            value={member.martial_status || ""}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="">Select Marital Status</option>
            <option>Married</option>
            <option>UnMarried</option>
            <option>Other</option>
          </select>
        </div>

        {/* Blood Group */}
        <div>
          <label className="block text-gray-700 mb-1">Blood Group</label>
          <input
            type="text"
            name="blood_group"
            value={member.blood_group || ""}
            onChange={handleChange}
            placeholder="Enter blood group"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-gray-700 mb-1">Mobile Number</label>
          <input
            type="text"
            name="mobile"
            value={member.mobile || ""}
            onChange={handleChange}
            placeholder="Enter mobile number"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={member.email || ""}
            onChange={handleChange}
            placeholder="Enter email"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Remarks */}
        <div className="col-span-2">
          <label className="block text-gray-700 mb-1">Remarks</label>
          <textarea
            name="remarks"
            value={member.remarks || ""}
            onChange={handleChange}
            placeholder="Additional remarks"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Publish */}
        <div className="col-span-2 flex items-center gap-2">
          <label className="text-gray-700">Publish:</label>
          <input
            type="checkbox"
            name="publish"
            checked={member.publish || false}
            onChange={(e) =>
              setMember((prev) => ({ ...prev, publish: e.target.checked }))
            }
          />
        </div>

        {/* Buttons */}
<div className="col-span-2 flex justify-end gap-3 mt-4">
  <button
    type="button"
    onClick={() => navigate("/dashboard/admin/family-list")}
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

export default FamilyEdit;
