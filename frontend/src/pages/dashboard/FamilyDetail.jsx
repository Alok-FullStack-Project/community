import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


  const API_BASE = import.meta.env.VITE_API_URL + '/family';

const emptyMember = {
  name: '',
  gender: 'Male', 
  relation: 'Head',
  birthDate: '',
  nativePlace: '',
  mobile: '',
  email: '',
  profession: '',
  remarks: '',
};

export default function FamilyDetail() {
  const { id: familyId } = useParams();
  const navigate = useNavigate();

  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // Add-member modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState(emptyMember);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFamily();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [familyId]);

  const fetchFamily = async () => {
    try {
      setLoading(true);
      setError(null);
      //const res = await api.get(`/family/${familyId}`);
      const res = await axios.get(API_BASE, { headers });
      setFamily(res.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to load family');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!window.confirm('Delete this member?')) return;
    try {
      await api.delete(`/family/member/${memberId}`);
      // refresh list
      fetchFamily();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Failed to delete member');
    }
  };

  const handleEditMember = (memberId) => {
    // navigate to your edit route format: /dashboard/:role/edit-family/:familyId/:memberId
    // defaulting to admin — adjust as needed or derive role from localStorage user
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = user?.role || 'admin';
    navigate(`/dashboard/${role}/edit-family/${familyId}/${memberId}`);
  };

  const openAddModal = () => {
    setNewMember(emptyMember);
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const handleNewMemberChange = (e) => {
    const { name, value } = e.target;
    setNewMember((p) => ({ ...p, [name]: value }));
  };

  const submitNewMember = async (e) => {
    e.preventDefault();
    if (!newMember.name) return alert('Name is required');
    try {
      setSaving(true);
      await api.post(`/family/${familyId}/member`, newMember);
      setShowAddModal(false);
      fetchFamily();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Failed to add member');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Loading family...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!family) return <div className="p-4">No family found.</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">{family.headName}</h1>
          <p className="text-sm text-gray-600">{family.village}</p>
          <p className="text-sm text-gray-600">{family.mobile || ''} {family.email ? `• ${family.email}` : ''}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={openAddModal}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            + Add Member
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1 border rounded"
          >
            Back
          </button>
        </div>
      </div>

      <div className="bg-white border rounded p-4">
        <h2 className="font-semibold mb-3">Members</h2>
        {Array.isArray(family.members) && family.members.length > 0 ? (
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Relation</th>
                <th className="px-3 py-2">Mobile</th>
                <th className="px-3 py-2">Profession</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {family.members.map((m) => (
                <tr key={m._id} className="border-t">
                  <td className="px-3 py-2">{m.name}</td>
                  <td className="px-3 py-2">{m.relation}</td>
                  <td className="px-3 py-2">{m.mobile}</td>
                  <td className="px-3 py-2">{m.profession}</td>
                  <td className="px-3 py-2 space-x-2">
                    <button
                      onClick={() => handleEditMember(m._id)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMember(m._id)}
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No members found for this family.</p>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg w-full max-w-lg p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-700"
              onClick={closeAddModal}
            >
              ✕
            </button>

            <h3 className="text-lg font-semibold mb-3">Add Member to {family.headName}</h3>

            <form onSubmit={submitNewMember} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  name="name"
                  value={newMember.name}
                  onChange={handleNewMemberChange}
                  placeholder="Name"
                  className="p-2 border rounded"
                  required
                />
                <select
                  name="relation"
                  value={newMember.relation}
                  onChange={handleNewMemberChange}
                  className="p-2 border rounded"
                >
                  <option>Head</option>
                  <option>Wife</option>
                  <option>Son</option>
                  <option>Daughter</option>
                  <option>Other</option>
                </select>

                <select
                  name="gender"
                  value={newMember.gender}
                  onChange={handleNewMemberChange}
                  className="p-2 border rounded"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>

                <input
                  name="birthDate"
                  type="date"
                  value={newMember.birthDate}
                  onChange={handleNewMemberChange}
                  className="p-2 border rounded"
                />
                <input
                  name="mobile"
                  value={newMember.mobile}
                  onChange={handleNewMemberChange}
                  placeholder="Mobile"
                  className="p-2 border rounded"
                />
                <input
                  name="email"
                  value={newMember.email}
                  onChange={handleNewMemberChange}
                  placeholder="Email"
                  className="p-2 border rounded"
                />
              </div>

              <input
                name="profession"
                value={newMember.profession}
                onChange={handleNewMemberChange}
                placeholder="Profession"
                className="p-2 border rounded w-full"
              />
              <textarea
                name="remarks"
                value={newMember.remarks}
                onChange={handleNewMemberChange}
                placeholder="Remarks"
                className="p-2 border rounded w-full"
              />

              <div className="flex justify-end gap-2">
                <button type="button" onClick={closeAddModal} className="px-4 py-2 border rounded">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-sky-600 text-white rounded">
                  {saving ? 'Saving...' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
