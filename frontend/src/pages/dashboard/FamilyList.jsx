// --- Imports ---
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Section } from "../../components/Section";

const backend_url = import.meta.env.VITE_URL;
const API_BASE = import.meta.env.VITE_API_URL + '/family';
const VILLAGE_API = import.meta.env.VITE_API_URL + '/villages/all';

// --- API Helpers ---
const deleteFamily = async (familyId, token) => {
  await axios.delete(`${API_BASE}/${familyId}`, { headers: { Authorization: `Bearer ${token}` } });
};

const deleteMember = async (familyId, memberId, token) => {
  await axios.delete(`${API_BASE}/${familyId}/member/${memberId}`, {
    headers: { Authorization: `Bearer ${token}` }
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
  const [familyCount, setFamilycount] = useState(0);
  const [memberCount, setMembercount] = useState(0);

  const navigate = useNavigate();

  const backend_url = import.meta.env.VITE_BACKEND_URL;

  // --- Get logged-in user ---
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // --- Fetch Families ---
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
      setTotalPages(Math.ceil(data.total / 20));
      setFamilycount(data.familyCount);
      setMembercount(data.memberCount);
    } catch (err) {
      console.error(err);
      alert('Failed to load families');
    } finally {
      setLoading(false);
    }
  };

  // --- Fetch Villages ---
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

  const fetchFamilyCount = async () => {
    try {
        const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE}/count`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFamilycount(res.data.familyCount);
    } catch (err) {
      console.error(err);
      alert('Failed to load.');
    }
  };



  useEffect(() => {
    fetchFamilies();
    fetchVillages();
   // fetchFamilyCount();
  }, [page, selectedVillage]);

  // --- Debounced search ---
  useEffect(() => {
    const delay = setTimeout(() => fetchFamilies(), 400);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  // --- Permission Logic ---
  const hasPermission = (family) => {
    if (!user) return false;

    // --- ADMIN ---
    if (user.role === 'admin') return true;

    // --- REPRESENTATIVE ---
    if (user.role === 'representative') {
      const assignedVillages = user.nativePlaces || [];
      return assignedVillages.includes(family.village);
    }

    // --- USER ---
    if (user.role === 'user') {
      const assignedEmails = user.linkedEmails || [];
      return assignedEmails.includes(family.email);
    }

    return false;
  };

  // Toggle expand
  const toggleFamily = (id) => {
    setExpandedFamilies((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Member Modal
  const handleViewMember = (member) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  const handleAddFamily = () => {
    navigate(`/dashboard/${role}/add-family`);
  };

  // Pagination
  const handlePageChange = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  return (
   
    <div className="pt-3 mt-6">
      <Section title1="Family" tittle2="List"/>
       <div className="pt-3 mt-6"></div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
        
        <h2 className="text-xl font-semibold">{`Registered families (${familyCount}) Registered Members (${memberCount})`}</h2>

        <div className="flex flex-wrap gap-3">
          {/* Village Filter */}
          <select
            value={selectedVillage}
            onChange={(e) => {
              setSelectedVillage(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded p-2"
          >
            <option value="">All Villages</option>
            {villages.map((v) => (
              <option key={v._id} value={v.name}>{v.name}</option>
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
            className="border border-gray-300 rounded p-2 w-60"
            placeholder="Search By name, mobile, email,profession,education,blood group,address..."
          />

          {/* Add Family (Admin and Representative only) */}
          {user?.role === 'admin' ||
          (user?.role === 'representative' && user?.nativePlaces?.length > 0) ? (
            <button
              onClick={handleAddFamily}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              + Add Family
            </button>
          ) : null}
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
            const canEdit = hasPermission(family);

            return (
              <div key={family._id} className="mb-6 border rounded bg-white p-4 shadow">
                {/* Family Header */}
                <div className="flex justify-between items-center mb-2">
                  <h3
  onClick={() => toggleFamily(family._id)}
  className="font-bold text-lg text-gray-700 cursor-pointer flex items-center space-x-4"
>
  <img
    src={family.image ? `${backend_url}${family.image}` : "/no_image.png"}
    className="w-12 h-12 rounded-full object-cover border"
  />

  <span className="text-gray-800">{family.name}</span>
  <span className="text-gray-600">({family.village})</span>

 
  <span className="text-sm text-gray-500 ml-3">
    [{expandedFamilies.includes(family._id) ? "Hide" : "Show"} Members ({family.members?.length || 0})]
  </span>
</h3>

                  <div className="space-x-2">
                    <button
                      onClick={() => handleViewMember(family)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                     🔍 View
                    </button>

                    {canEdit && (
                      <>
                        <Link
                          to={`/dashboard/${role}/edit-family/${family._id}/head`}
                          className="bg-yellow-500 text-white px-2 py-1 rounded"
                        >
                          ✏️ Edit
                        </Link>

                        <button
                          onClick={() => {
							  if (window.confirm("Are you sure you want to delete this Family?")) {
							   deleteFamily(family._id, localStorage.getItem("token")).then(fetchFamilies)
						  }}}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          🗑️ Delete
                        </button>
                      </>
                    )}
                  </div>
                  
                </div>

                {/* Members Table */}
                {expandedFamilies.includes(family._id) && (
                  <table className="min-w-full border">
                    <thead>
                      <tr className="bg-gray-200 text-gray-700">
                        <th className="px-4 py-2">Photo</th>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Relation</th>
                        <th className="px-4 py-2">Mobile</th>
                        <th className="px-4 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {family.members.map((m) => (
                        <tr key={m._id} className="text-center border-t">
                          <td className="px-4 py-2">
                            <img
                              src={m.image ?  `${backend_url}${m.image}` : "/no_image.png"}
                              className="w-12 h-12 rounded-full object-cover mx-auto border"
                            />
                          </td>
                          <td>{m.memberID}</td>
                          <td>{m.name}</td>
                          <td>{m.relation}</td>
                          <td>{m.mobile}</td>

                          <td className="space-x-2">
                            <button
                              onClick={() => handleViewMember(m)}
                              className="bg-blue-500 text-white px-2 py-1 rounded"
                            >
                              🔍 View
                            </button>

                            {canEdit && (
                              <>
                                <Link
                                  to={`/dashboard/${role}/edit-family/${family._id}/${m._id}`}
                                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                                >
                                  ✏️ Edit
                                </Link>

                               <button
								  onClick={() => {
									if (window.confirm("Are you sure you want to delete this member?")) {
									  deleteMember(
										family._id,
										m._id,
										localStorage.getItem("token")
									  ).then(fetchFamilies);
									}
								  }}
								  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
								>
								  🗑️ Delete
								</button>

                                <button
                                  onClick={() =>
                                    reassignHead(family._id, m._id, localStorage.getItem("token")).then(
                                      fetchFamilies
                                    )
                                  }
                                  className="bg-purple-500 text-white px-2 py-1 rounded"
                                >
                                  👨‍👩‍👧 Make Head
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
            className="px-3 py-1 bg-gray-200 rounded"
            disabled={page === 1}
            onClick={() => handlePageChange(page - 1)}
          >
            Prev
          </button>

          <span>Page {page} of {totalPages}</span>

          <button
            className="px-3 py-1 bg-gray-200 rounded"
            disabled={page === totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Member Modal */}
      {showModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-600 text-xl"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>

            <h3 className="text-xl font-semibold mb-4 text-center border-b pb-2">Details</h3>

            <div className="flex justify-center mb-4">
              <img
                src={
                  selectedMember.image
                    ? `${backend_url}${selectedMember.image}` 
                    : "/no_image.png"
                }
                className="w-32 h-32 rounded-full object-cover border-4 shadow-md"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div><strong>ID:</strong> {selectedMember.memberID}</div>
              <div><strong>Name:</strong> {selectedMember.name}</div>
              <div><strong>Relation:</strong> {selectedMember.relation}</div>
              <div><strong>Gender:</strong> {selectedMember.gender}</div>
              <div><strong>Birth Date:</strong> {selectedMember.birthDate?.slice(0, 10)}</div>
              <div><strong>Mobile:</strong> {selectedMember.mobile}</div>
              <div><strong>Email:</strong> {selectedMember.email}</div>
              <div className="col-span-2"><strong>Remarks:</strong> {selectedMember.remarks || "N/A"}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyList;
