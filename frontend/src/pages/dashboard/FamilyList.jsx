import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

  const backend_url = import.meta.env.VITE_URL ;
  const API_BASE = import.meta.env.VITE_API_URL + '/family';
  const VILLAGE_API = import.meta.env.VITE_API_URL + '/villages';


// 🔹 API Helpers
const deleteFamily = async (familyId, token) => {
  await axios.delete(`${API_BASE}/${familyId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const deleteMember = async (familyId, memberId, token) => {
  await axios.delete(`${API_BASE}/${familyId}/member/${memberId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const reassignHead = async (familyId, memberId, token) => {
  await axios.put(
    `${API_BASE}/${familyId}/reassign-head`,
    { memberId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

const FamilyList = ({ role }) => {
  const [families, setFamilies] = useState([]);
  const [villages, setVillages] = useState([]);
  const [expandedFamilies, setExpandedFamilies] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // 🔹 Get logged-in user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 🔹 Fetch Families
  const fetchFamilies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = { page, limit: 10 };
      if (searchTerm) params.q = searchTerm;
      if (selectedVillage) params.village = selectedVillage;

      const { data } = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setFamilies(data.data);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
      alert('Failed to load families');
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch Villages
  const fetchVillages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(VILLAGE_API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVillages(res.data.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load villages');
    }
  };

  useEffect(() => {
    fetchFamilies();
    fetchVillages();
  }, [page, selectedVillage]);

  // 🔹 Debounce Search
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchFamilies();
    }, 500);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  // 🔹 Helper: Check if representative has permission
  const hasPermission = (family) => {
    if (user?.role === 'admin') return true;
    if (user?.role === 'representative') {
      const assignedVillages = user?.nativePlaces || [];
      const assignedEmails = user?.linkedEmails || [];
      return (
        assignedVillages.includes(family.village) ||
        assignedEmails.includes(family.email)
      );
    }
    return false;
  };

  // 🔹 Toggle Family Expand
  const toggleFamily = (familyId) => {
    setExpandedFamilies((prev) =>
      prev.includes(familyId)
        ? prev.filter((id) => id !== familyId)
        : [...prev, familyId]
    );
  };

  // 🔹 Member Modal
  const handleViewMember = (member) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMember(null);
  };

  const handleAddFamily = () => {
    navigate(`/dashboard/${role}/add-family`);
  };

  // 🔹 Pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // 🔹 Delete Family
  const handleDeleteFamily = async (familyId) => {
    if (!window.confirm('Are you sure you want to delete this family and all its members?')) return;
    try {
      const token = localStorage.getItem('token');
      await deleteFamily(familyId, token);
      alert('Family deleted successfully');
      fetchFamilies();
    } catch (err) {
      console.error(err);
      alert('Failed to delete family');
    }
  };

  // 🔹 Delete Member
  const handleDeleteMember = async (familyId, memberId) => {
    if (!window.confirm('Are you sure you want to remove this member from the family?')) return;
    try {
      const token = localStorage.getItem('token');
      await deleteMember(familyId, memberId, token);
      alert('Member removed successfully');
      fetchFamilies();
    } catch (err) {
      console.error(err);
      alert('Failed to delete member');
    }
  };

  // 🔹 Reassign Head
  const handleReassignHead = async (familyId, memberId) => {
    if (!window.confirm('Promote this member as new Family Head?')) return;
    try {
      const token = localStorage.getItem('token');
      await reassignHead(familyId, memberId, token);
      alert('Family head reassigned successfully');
      fetchFamilies();
    } catch (err) {
      console.error(err);
      alert('Failed to reassign head');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
        <h2 className="text-xl font-semibold">Family List</h2>

        <div className="flex flex-wrap gap-3">
          {/* Village Filter */}
          <select
            value={selectedVillage}
            onChange={(e) => setSelectedVillage(e.target.value)}
            className="border border-gray-300 rounded p-2"
          >
            <option value="">All Villages</option>
            {villages.map((v) => (
              <option key={v._id} value={v.name}>
                {v.name}
              </option>
            ))}
          </select>

          {/* Search */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, email, or mobile"
            className="border border-gray-300 rounded p-2 w-60"
          />

          {/* Add Family (only for Admin or Representative with assigned villages) */}
          {(user?.role === 'admin' ||
            (user?.role === 'representative' && (user?.nativePlaces?.length > 0 || user?.linkedEmails?.length > 0))) && (
            <button
              onClick={handleAddFamily}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              + Add Family
            </button>
          )}
        </div>
      </div>

      {/* Family List */}
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-center text-gray-500 py-4">Loading...</p>
        ) : families.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No families found.</p>
        ) : (
          families.map((family) => {
            const isExpanded = expandedFamilies.includes(family._id);
            const canEdit = hasPermission(family);

            return (
              <div key={family._id} className="mb-6 border rounded bg-white p-4 shadow">
                {/* Family Header */}
                <div className="flex justify-between items-center mb-2">
                  <h3
                    onClick={() => toggleFamily(family._id)}
                    className="font-bold text-lg text-gray-700 cursor-pointer select-none flex items-center space-x-4 relative group"
                  >
                    <div className="relative">
                      <img
                        src={
                          family.image
                            ? `${backend_url}${family.image}`
                            : "/no_image.png"
                        }
                        alt=""
                        className="w-12 h-12 rounded-full object-cover border border-gray-300"
                      />
                    </div>
                    <div className="flex items-center space-x-2 text-gray-800">
                      <span className="font-semibold text-gray-800">{family.headId}</span>
                      <span className="text-gray-800">–</span>
                      <span className="text-gray-900 font-semibold">{family.name}</span>
                      <span className="text-gray-600">— {family.village}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        [{isExpanded ? "Hide" : "Show"} Members]
                      </span>
                    </div>
                  </h3>

                  <div className="space-x-2">
                    <button
                      onClick={() => handleViewMember(family)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      View
                    </button>

                    {canEdit && (
                      <>
                        <Link
                          to={`/dashboard/${role}/edit-family/${family._id}/head`}
                          className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteFamily(family._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Members Table */}
                {isExpanded && (
                  <table className="min-w-full border">
                    <thead>
                      <tr className="bg-gray-200 text-gray-700">
                        <th className="px-4 py-2">Photo</th>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Relation</th>
                        <th className="px-4 py-2">Mobile</th>
                        <th className="px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {family.members.map((member) => (
                        <tr key={member._id} className="text-center border-t">
                          <td className="px-4 py-2">
                            <img
                              src={
                                member.image
                                  ? `${backend_url}${family.image}`
                                  : "/no_image.png"
                              }
                              alt={member.name}
                              className="w-12 h-12 rounded-full object-cover mx-auto border border-gray-300"
                            />
                          </td>
                          <td className="px-4 py-2">{member.memberID}</td>
                          <td className="px-4 py-2">{member.name}</td>
                          <td className="px-4 py-2">{member.relation}</td>
                          <td className="px-4 py-2">{member.mobile}</td>
                          <td className="px-4 py-2 space-x-2">
                            <button
                              onClick={() => handleViewMember(member)}
                              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                            >
                              View
                            </button>
                            {canEdit && (
                              <>
                                <Link
                                  to={`/dashboard/${role}/edit-family/${family._id}/${member._id}`}
                                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                >
                                  Edit
                                </Link>
                                <button
                                  onClick={() => handleDeleteMember(family._id, member._id)}
                                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                >
                                  Delete
                                </button>
                                <button
                                  onClick={() => handleReassignHead(family._id, member._id)}
                                  className="bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600"
                                >
                                  Make Head
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Popup Modal */}
      {showModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl font-bold"
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-4 text-center border-b pb-2">
              Member Details
            </h3>
            <div className="flex justify-center mb-4">
              <img
                src={
                  selectedMember.image
                    ? `${backend_url}${family.image}`
                    : "/no_image.png"
                }
                alt={selectedMember.name}
                className="w-32 h-32 object-cover rounded-full border-4 border-gray-300 shadow-md"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><strong>ID:</strong> {selectedMember.headId || selectedMember.memberID}</div>
              <div><strong>Name:</strong> {selectedMember.name}</div>
              <div><strong>Relation:</strong> {selectedMember.relation}</div>
              <div><strong>Gender:</strong> {selectedMember.gender}</div>
              <div><strong>Birth Date:</strong> {selectedMember.birthDate?.slice(0, 10)}</div>
              <div><strong>Education:</strong> {selectedMember.education}</div>
              <div><strong>Profession:</strong> {selectedMember.profession}</div>
              <div><strong>Profession Type:</strong> {selectedMember.profession_type}</div>
              <div><strong>Profession Address:</strong> {selectedMember.profession_address}</div>
              <div><strong>Residence:</strong> {selectedMember.residence_address}</div>
              <div><strong>Marital Status:</strong> {selectedMember.martial_status}</div>
              <div><strong>Blood Group:</strong> {selectedMember.blood_group}</div>
              <div><strong>Mobile:</strong> {selectedMember.mobile}</div>
              <div><strong>Email:</strong> {selectedMember.email}</div>
              <div className="col-span-2"><strong>Remarks:</strong> {selectedMember.remarks || 'N/A'}</div>
            </div>
            <div className="mt-5 flex justify-center">
              <button
                onClick={closeModal}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default FamilyList;
