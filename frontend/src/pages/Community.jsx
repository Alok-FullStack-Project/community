// src/pages/Community.jsx
import React, { useEffect, useState, useCallback } from "react";
import api from "../api/api";
import useImagePreview from "../hooks/useImagePreview"; // or same file if inline

export default function Community() {
  const [families, setFamilies] = useState([]);
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [village, setVillage] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(24);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  const [selectedFamily, setSelectedFamily] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setPreviewUrl, ImagePreview } = useImagePreview();
    const backend_url = import.meta.env.VITE_URL ;

  // 🔹 Fetch Villages
  const fetchVillages = useCallback(async () => {
    try {
      const res = await api.get("/villages");
      setVillages(res.data.data || []);
    } catch (err) {
      console.error("Failed to load villages", err);
    }
  }, []);

  // 🔹 Fetch Families
  const fetchFamilies = useCallback(
    async ({ pageNumber = 1, query = q, villageName = village } = {}) => {
      setLoading(true);
      setError(null);
      try {
        const params = { page: pageNumber, limit };
        if (query) params.q = query;
        if (villageName) params.village = villageName;

        const res = await api.get("/family", { params });
        const payload = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];

        setFamilies(payload);
        setTotalPages(
          res.data?.total && res.data?.limit
            ? Math.ceil(res.data.total / res.data.limit)
            : 1
        );
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || "Failed to fetch families");
      } finally {
        setLoading(false);
      }
    },
    [q, village, limit]
  );

  useEffect(() => {
    fetchVillages();
    fetchFamilies({ pageNumber: page });
  }, [fetchVillages, fetchFamilies, page]);

  // 🔹 Search + Filter
  const onSearchClick = () => {
    setPage(1);
    fetchFamilies({ pageNumber: 1, query: q, villageName: village });
  };

  const clearFilters = () => {
    setQ("");
    setVillage("");
    setPage(1);
    fetchFamilies({ pageNumber: 1, query: "", villageName: "" });
  };

  // 🔹 Modal
  const openFamilyModal = (family) => {
    setSelectedFamily(family);
    setIsModalOpen(true);
  };

  const closeFamilyModal = () => {
    setSelectedFamily(null);
    setIsModalOpen(false);
  };

  // 🔹 Pagination
  const handlePrev = () => {
    if (page <= 1) return;
    const np = page - 1;
    setPage(np);
    fetchFamilies({ pageNumber: np, query: q, villageName: village });
  };

  const handleNext = () => {
    if (page >= totalPages) return;
    const np = page + 1;
    setPage(np);
    fetchFamilies({ pageNumber: np, query: q, villageName: village });
  };

  const getImageUrl = (path) =>
    path ?  `${backend_url}${path}` : "/no";

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">
        Community Members (Family Heads)
      </h2>

      {/* Filters */}
      <div className="grid md:grid-cols-3 gap-3 mb-4">
        <select
          value={village}
          onChange={(e) => setVillage(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Villages</option>
          {villages.map((v) => (
            <option key={v._id || v.name} value={v.name}>
              {v.name}
            </option>
          ))}
        </select>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, email, or mobile"
          className="p-2 border rounded"
        />

        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={onSearchClick}
          >
            Search
          </button>
          <button className="px-4 py-2 border rounded" onClick={clearFilters}>
            Clear
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="ml-auto text-sm text-gray-600">
          {loading ? "Loading..." : `${families.length} family head(s)`}
        </div>
      </div>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      {/* 🔹 Family Head Listing */}
      {loading ? (
        <div className="p-4">Loading...</div>
      ) : families.length === 0 ? (
        <div className="p-4">No families found.</div>
      ) : (
<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {families.map((family) => (
    <div
      key={family._id}
      onClick={() => openFamilyModal(family)}
      className="group relative bg-white border rounded-2xl shadow hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="flex items-center gap-4 p-4">
        {/* 🖼️ Family Image */}
        <img
            src={getImageUrl(family.image)}
            alt=""
            className="w-20 h-20 rounded-full object-cover border cursor-pointer"
            onMouseEnter={() => setPreviewUrl(getImageUrl(family.image))}
            onMouseLeave={() => setPreviewUrl(null)}
          />


        {/* 🧾 Family Info */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">
            {family.name}
          </h3>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-700">Village:</span>{" "}
            {family.village || "-"}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-gray-700">Mobile:</span>{" "}
            {family.mobile || "-"}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t mx-4"></div>

      {/* 📊 Extra Info */}
      <div className="flex justify-between items-center p-4 text-sm text-gray-600">
        <div>
          <p>
            <span className="font-medium text-gray-700">Profession:</span>{" "}
            {family.profession || "-"}
          </p>
        </div>
        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
          {(family.members || []).length} Members
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-blue-600 bg-opacity-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  ))}
</div>

      )}

      {/* 🔹 Pagination */}
      {families.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={page <= 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={handleNext}
              disabled={page >= totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* 🔹 Family Modal */}
      {isModalOpen && selectedFamily && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-5xl w-full mx-4 p-6 relative overflow-y-auto max-h-[90vh]">
            {/* Close */}
            <button
              onClick={closeFamilyModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold"
            >
              ✕
            </button>

            {/* 🔸 Head Info */}
            <div className="flex items-center space-x-6 mb-6 border-b pb-4">
              <img
                        src={getImageUrl(selectedFamily.image)}
                        alt=""
                        className="w-24 h-24 rounded-full object-cover border"
                        onMouseEnter={() => setPreviewUrl(getImageUrl(selectedFamily.image))}
                        onMouseLeave={() => setPreviewUrl(null)}
              />
              <div>
                <h3 className="text-2xl font-bold">{selectedFamily.name}</h3>
                <p className="text-sm text-gray-600">{selectedFamily.village}</p>
                <p className="text-sm text-gray-600">
                  {selectedFamily.mobile} | {selectedFamily.email}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedFamily.profession}
                </p>
              </div>
            </div>

            {/* 🔸 Members */}
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">#</th>
                    <th className="border px-2 py-1">Image</th>
                    <th className="border px-2 py-1">Name</th>
                    <th className="border px-2 py-1">Relation</th>
                    <th className="border px-2 py-1">Mobile</th>
                    <th className="border px-2 py-1">Email</th>
                    <th className="border px-2 py-1">Profession</th>
                    <th className="border px-2 py-1">Birth Date</th>
                    <th className="border px-2 py-1">Residence</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedFamily.members || []).map((m, i) => (
                    <tr key={m._id || i} className="hover:bg-gray-50 text-center">
                      <td className="border px-2 py-1">{i + 1}</td>
                      <td className="border px-2 py-1">
                        <img
                        src={getImageUrl(m.image)}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover mx-auto border cursor-pointer"
                        onMouseEnter={() => setPreviewUrl(getImageUrl(m.image))}
                        onMouseLeave={() => setPreviewUrl(null)}
                      />

                      </td>
                      <td className="border px-2 py-1 font-medium">{m.name}</td>
                      <td className="border px-2 py-1">{m.relation || "-"}</td>
                      <td className="border px-2 py-1">{m.mobile || "-"}</td>
                      <td className="border px-2 py-1">{m.email || "-"}</td>
                      <td className="border px-2 py-1">{m.profession || "-"}</td>
                      <td className="border px-2 py-1">
                        {m.birthDate
                          ? new Date(m.birthDate).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="border px-2 py-1">
                        {m.residence_address || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-right">
              <button
                onClick={closeFamilyModal}
                className="px-4 py-2 border rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <ImagePreview />
    </div>
  );
}
