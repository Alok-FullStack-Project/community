import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

  const API_BASE = import.meta.env.VITE_API_URL + '/family';

const FamilyView = () => {
  const { familyId, memberId } = useParams();
  const [member, setMember] = useState(null); 

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${API_BASE}/member/${memberId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMember(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load member details");
      }
    };
    fetchMember();
  }, [memberId]);

  if (!member) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Member Details</h2>

      <div className="grid grid-cols-2 gap-4">
        <p><strong>ID:</strong> {member.memeberID}</p>
        <p><strong>Name:</strong> {member.name}</p>
        <p><strong>Gender:</strong> {member.gender}</p>
        <p><strong>Relation:</strong> {member.relation}</p>
        <p><strong>Mobile:</strong> {member.mobile}</p>
        <p><strong>Email:</strong> {member.email}</p>
        <p><strong>Birth Date:</strong> {new Date(member.birthDate).toLocaleDateString()}</p>
        <p><strong>Blood Group:</strong> {member.blood_group}</p>
        <p><strong>Education:</strong> {member.education}</p>
        <p><strong>Profession:</strong> {member.profession}</p>
        <p><strong>Profession Type:</strong> {member.profession_type}</p>
        <p><strong>Profession Address:</strong> {member.profession_address}</p>
        <p><strong>Residence Address:</strong> {member.residence_address}</p>
        <p><strong>Marital Status:</strong> {member.martial_status}</p>
      </div>

      <div className="mt-6 flex justify-between">
        <Link
          to={`/dashboard/admin/family-list`}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back
        </Link>
        <Link
          to={`/dashboard/edit-family/${familyId}/${memberId}`}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Edit
        </Link>
      </div>
    </div>
  );
};

export default FamilyView;
