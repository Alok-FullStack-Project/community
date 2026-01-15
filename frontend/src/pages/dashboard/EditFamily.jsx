import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL + '/family'; 

export default function EditFamily() {
  const { role, familyId, memberIdx } = useParams(); 
  const navigate = useNavigate();

  const [family, setFamily] = useState(null);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!familyId || typeof memberIdx === 'undefined') {
      alert('Invalid route params');
      navigate(`/dashboard/${role || 'admin'}/family-list`);
      return;
    }
    fetchFamily();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [familyId, memberIdx]);

  const fetchFamily = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/${familyId}`, { headers });
      const fam = data && data._id ? data : data.data || data;
      setFamily(fam);

      const idx = Number(memberIdx);
      const m = (fam.members && fam.members[idx]) ? { ...fam.members[idx] } : null;
      if (!m) {
        alert('Member not found');
        navigate(`/dashboard/${role || 'admin'}/family-list`);
        return;
      }

      // Normalize date format
      if (m.birthDate) m.birthDate = new Date(m.birthDate).toISOString().split('T')[0];
      setMember(m);
    } catch (err) {
      console.error(err);
      alert('Failed to load family/member');
      navigate(`/dashboard/${role || 'admin'}/family-list`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMember((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const idx = Number(memberIdx);
      const members = Array.isArray(family.members) ? [...family.members] : [];
      members[idx] = member;

      const payload = { ...family, members };
      await axios.put(`${API_BASE}/${familyId}`, payload, { headers });

      alert('✅ Member updated successfully!');
      navigate(`/dashboard/${role || 'admin'}/family-list`);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async () => {
    if (!window.confirm('Delete this member?')) return;
    setLoading(true);
    try {
      const idx = Number(memberIdx);
      const members = (family.members || []).filter((_, i) => i !== idx);
      const payload = { ...family, members };

      if (members.length === 0) {
        await axios.delete(`${API_BASE}/${familyId}`, { headers });
        alert('🗑️ Member deleted and family removed (no members left).');
      } else {
        await axios.put(`${API_BASE}/${familyId}`, payload, { headers });
        alert('🗑️ Member deleted successfully.');
      }

      navigate(`/dashboard/${role || 'admin'}/family-list`);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  if (!member) return <div className="p-4">Loading member...</div>;

  const relationOptions = [
    'Head',
    'Spouse',
    'Son',
    'Daughter',
    'Father',
    'Mother',
    'Brother',
    'Sister',
    'Grandfather',
    'Grandmother',
    'Other',
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center">Edit Family Member</h2>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block font-medium mb-1">Full Name</label>
            <input
              required
              name="name"
              value={member.name || ''}
              onChange={handleChange}
              className="p-2 border rounded w-full"
            />
          </div>

          {/* Relation */}
          <div>
            <label className="block font-medium mb-1">Relation</label>
            <select
              name="relation"
              value={member.relation || ''}
              onChange={handleChange}
              className="p-2 border rounded w-full"
              required
            >
              <option value="">Select Relation</option>
              {relationOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block font-medium mb-1">Gender</label>
            <input
              name="gender"
              value={member.gender || ''}
              onChange={handleChange}
              placeholder="Gender"
              className="p-2 border rounded w-full"
            />
          </div>

          {/* Birth Date */}
          <div>
            <label className="block font-medium mb-1">Birth Date</label>
            <input
              name="birthDate"
              type="date"
              value={member.birthDate || ''}
              onChange={handleChange}
              className="p-2 border rounded w-full"
            />
          </div>

          {/* Native Place */}
          <div>
            <label className="block font-medium mb-1">Native Place</label>
            <input
              name="nativePlace"
              value={member.nativePlace || ''}
              onChange={handleChange}
              placeholder="Native Place"
              className="p-2 border rounded w-full"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block font-medium mb-1">Mobile</label>
            <input
              name="mobile"
              value={member.mobile || ''}
              onChange={handleChange}
              placeholder="Mobile"
              className="p-2 border rounded w-full"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              name="email"
              value={member.email || ''}
              onChange={handleChange}
              placeholder="Email"
              className="p-2 border rounded w-full"
            />
          </div>

          {/* Profession */}
          <div>
            <label className="block font-medium mb-1">Profession</label>
            <input
              name="profession"
              value={member.profession || ''}
              onChange={handleChange}
              placeholder="Profession"
              className="p-2 border rounded w-full"
            />
          </div>
        </div>

        {/* Remarks */}
        <div>
          <label className="block font-medium mb-1">Remarks</label>
          <textarea
            name="remarks"
            value={member.remarks || ''}
            onChange={handleChange}
            placeholder="Remarks"
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 justify-end pt-3">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            type="button"
            onClick={() => navigate(`/dashboard/${role || 'admin'}/family-list`)}
            className="px-5 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDeleteMember}
            className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete Member
          </button>
        </div>
      </form>
    </div>
  );
}
