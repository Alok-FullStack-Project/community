import React, { useEffect, useState, useCallback } from "react";
import api from "../api/api";
import useImagePreview from "../hooks/useImagePreview";

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
  const backend_url = import.meta.env.VITE_URL;

  // Fetch Villages
  const fetchVillages = useCallback(async () => {
    try {
      const res = await api.get("/villages");
      setVillages(res.data.data || []);
    } catch (err) {
      console.error("Failed to load villages", err);
    }
  }, []);

  const [miniProfile, setMiniProfile] = useState(null);
const openMiniProfile = (m) => setMiniProfile(m);

  // Fetch Families
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

  const openFamilyModal = (family) => {
    setSelectedFamily(family);
    setIsModalOpen(true);
  };

  const closeFamilyModal = () => {
    setSelectedFamily(null);
    setIsModalOpen(false);
  };

  const handlePrev = () => {
    if (page <= 1) return;
    const np = page - 1;
    setPage(np);
    fetchFamilies({ pageNumber: np });
  };

  const handleNext = () => {
    if (page >= totalPages) return;
    const np = page + 1;
    setPage(np);
    fetchFamilies({ pageNumber: np });
  };

  const getImageUrl = (path) =>
    path ? `${path}` : "/no_image.png";

  const Info = ({ label, value }) => (
  <p>
    <span className="font-semibold text-gray-800">{label}:</span>{" "}
    <span className="text-gray-700">{value || "-"}</span>
  </p>
);

const InfoRow = ({ icon, text, link }) => (
  <div className="flex items-center gap-2">
    {icon && <img src={icon} className="w-4 h-4 opacity-70" />}
    {link ? (
      <a href={link} className="text-blue-600 hover:underline" target="_blank">
        {text}
      </a>
    ) : (
      <span>{text}</span>
    )}
  </div>
);


  return (
    <div className="pt-[84px] md:pt-[84px]">
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
      </h2>

      {/* FILTERS */}
      <div className="bg-white shadow rounded-2xl p-4 mb-6 border border-gray-100">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          <select
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400"
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
            placeholder="Search name, email, mobile..."
            className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400"
          />

          <div className="flex gap-2">
            <button
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              onClick={onSearchClick}
            >
              Search
            </button>
            <button
              className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
              onClick={clearFilters}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* RESULTS COUNT */}
      <div className="flex justify-between mb-4 text-gray-600 text-sm">
        <span>{loading ? "Loading..." : `${families.length} family head(s)`}</span>
      </div>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      {/* FAMILY LIST */}
      {loading ? (
        <div className="p-4 text-center">Loading...</div>
      ) : families.length === 0 ? (
        <div className="p-4 text-center">No families found.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {families.map((family) => (
            <div
              key={family._id}
              onClick={() => openFamilyModal(family)}
              className="group bg-white border rounded-2xl shadow hover:shadow-xl transition-all cursor-pointer overflow-hidden"
            >
              <div className="flex items-center gap-4 p-5">
                <img
                  src={getImageUrl(family.image)}
                  alt=""
                  className="w-20 h-20 rounded-full object-cover border shadow-sm"
                  onMouseEnter={() => setPreviewUrl(getImageUrl(family.image))}
                  onMouseLeave={() => setPreviewUrl(null)}
                />

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800">
                    {family.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    <strong>Village:</strong> {family.village || "-"}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Mobile:</strong> {family.mobile || "-"}
                  </p>
                </div>
              </div>

              <div className="border-t mx-4"></div>

              <div className="flex justify-between items-center p-4 text-sm text-gray-700">
                <span>
                  <strong>Profession:</strong> {family.profession || "-"}
                </span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                  {(family.members || []).length} Members
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {families.length > 0 && (
        <div className="mt-8 flex justify-between items-center">
          <span className="text-gray-600">
            Page {page} of {totalPages}
          </span>

          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={page <= 1}
              className="px-4 py-2 rounded-xl border bg-white disabled:opacity-40 hover:bg-gray-100"
            >
              Prev
            </button>

            <button
              onClick={handleNext}
              disabled={page >= totalPages}
              className="px-4 py-2 rounded-xl border bg-white disabled:opacity-40 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      )}

          {/* =========================
              FAMILY MODAL (UPGRADED)
          ========================= */}
          {isModalOpen && selectedFamily && (
            <CommunityFamilyModal
              selectedFamily={selectedFamily}
              onClose={closeFamilyModal}
              openMiniProfile={openMiniProfile}
            />
          )}

          {/* MINI PROFILE POPUP */}
          {miniProfile && (
            <MiniProfilePopup
              member={miniProfile}
              onClose={() => setMiniProfile(null)}
              getImageUrl={getImageUrl}
            />
          )}


      


      <ImagePreview />
    </div>
    </div>
  );
}

function CommunityFamilyModal({ selectedFamily, onClose, openMiniProfile }) {
  const [tab, setTab] = useState("info");
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const gallery = [
    selectedFamily.image && { src: selectedFamily.image, alt: selectedFamily.name },

    ...(selectedFamily.members || [])
      .filter(m => m.image)
      .map(m => ({ src: m.image, alt: m.name })),

    ...(selectedFamily.gallery || []).map(g => ({
      src: typeof g === "string" ? g : g.url,
      alt: g.caption || "Gallery Image"
    }))
  ].filter(Boolean);

  // ESC close + arrow navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (viewerOpen && e.key === "ArrowRight")
        setViewerIndex(i => Math.min(i + 1, gallery.length - 1));
      if (viewerOpen && e.key === "ArrowLeft")
        setViewerIndex(i => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [viewerOpen]);

  const getUrl = (p) => (p ? p : "/no_image.png");

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden animate-scaleIn relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 rounded-full p-2 text-xl"
        >
          ✕
        </button>

        {/* HEADER */}
        <div className="flex gap-6 p-8 border-b">
          <img
            src={getUrl(selectedFamily.image)}
            className="w-32 h-32 rounded-2xl object-cover border shadow"
          />

          <div>
            <h2 className="text-3xl font-bold">{selectedFamily.name}</h2>
            <p className="text-gray-600">{selectedFamily.village}</p>
            <p className="text-gray-600">{selectedFamily.mobile}</p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-4 border-b px-8 py-3 bg-gray-50">
          <Tab active={tab === "info"} onClick={() => setTab("info")}>Family Info</Tab>
          <Tab active={tab === "members"} onClick={() => setTab("members")}>
            Members ({selectedFamily.members?.length || 0})
          </Tab>
          <Tab active={tab === "gallery"} onClick={() => setTab("gallery")}>
            Gallery ({gallery.length})
          </Tab>
        </div>

        {/* CONTENT */}
        <div className="p-8 max-h-[70vh] overflow-y-auto">
          
          {/* INFO TAB */}
          {tab === "info" && (
            <div className="grid md:grid-cols-2 gap-4 text-gray-700">
              <InfoRow label="Village" value={selectedFamily.village} />
              <InfoRow label="Mobile" value={selectedFamily.mobile} />
              <InfoRow label="Email" value={selectedFamily.email} />
              <InfoRow label="Birth Date" value={selectedFamily.birthDate} />
              <InfoRow label="Profession" value={selectedFamily.profession} />
              <InfoRow label="Education" value={selectedFamily.education} />
              <InfoRow label="Residence" value={selectedFamily.residence_address} />
              <InfoRow label="Blood Group" value={selectedFamily.blood_group} />
              <InfoRow label="Remarks" value={selectedFamily.remarks} />
            </div>
          )}

          {/* MEMBERS TAB */}
          {tab === "members" && (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {(selectedFamily.members || []).map((m, i) => (
                <div
                  key={i}
                  className="p-5 bg-white rounded-2xl shadow hover:shadow-xl cursor-pointer group"
                  onClick={() => openMiniProfile(m)}
                >
                  <img
                    src={getUrl(m.image)}
                    className="w-24 h-24 rounded-full mx-auto border shadow"
                  />

                  <h3 className="mt-4 text-lg font-semibold text-center">{m.name}</h3>

                  <p className="text-xs text-indigo-600 text-center bg-indigo-100 rounded-full px-3 py-1 inline-block mt-1">
                    {m.relation}
                  </p>

                  <div className="text-sm text-gray-700 mt-4 space-y-1">
                    <p>📞 {m.mobile || "-"}</p>
                    <p>📧 {m.email || "-"}</p>
                    <p>💼 {m.profession || "-"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* GALLERY TAB */}
          {tab === "gallery" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {gallery.map((img, i) => (
                <div
                  key={i}
                  onClick={() => { setViewerIndex(i); setViewerOpen(true); }}
                  className="cursor-pointer relative group"
                >
                  <img
                    src={getUrl(img.src)}
                    className="w-full h-40 object-cover rounded-xl group-hover:opacity-80 transition"
                  />
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* FULLSCREEN VIEWER */}
      {viewerOpen && (
        <div className="fixed inset-0 bg-black/80 z-[9999] flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setViewerOpen(false)}
            className="absolute top-6 right-6 text-white text-3xl"
          >
            ✕
          </button>

          <img
            src={getUrl(gallery[viewerIndex].src)}
            className="max-h-[80vh] object-contain rounded-xl"
          />

          <div className="flex justify-between w-full mt-4 text-white text-xl">
            <button
              disabled={viewerIndex === 0}
              onClick={() => setViewerIndex(i => i - 1)}
              className="px-4 py-2 disabled:opacity-40"
            >
              ⬅ Prev
            </button>

            <button
              disabled={viewerIndex === gallery.length - 1}
              onClick={() => setViewerIndex(i => i + 1)}
              className="px-4 py-2 disabled:opacity-40"
            >
              Next ➡
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
function MiniProfilePopup({ member, onClose, getImageUrl }) {
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  if (!member) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-6 relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 rounded-full p-2"
        >
          ✕
        </button>

        <div className="text-center">
          <img
            src={getImageUrl(member.image)}
            className="w-28 h-28 rounded-full mx-auto border-4 shadow"
          />

          <h2 className="mt-3 text-2xl font-bold">{member.name}</h2>
          <p className="text-gray-500">{member.relation}</p>

          <div className="mt-6 grid grid-cols-1 gap-2 text-gray-700 text-sm">
            <InfoRow label="Mobile" value={member.mobile} />
            <InfoRow label="Email" value={member.email} />
            <InfoRow label="Profession" value={member.profession} />
            <InfoRow label="Birth Date" value={member.birthDate} />
            <InfoRow label="Residence" value={member.residence_address} />
            <InfoRow label="Education" value={member.education} />
            <InfoRow label="Blood Group" value={member.blood_group} />
            <InfoRow label="Remarks" value={member.remarks} />
          </div>
        </div>

      </div>
    </div>
  );
}

function Tab({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium ${
        active ? "bg-white shadow text-indigo-600" : "text-gray-600 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );
}

function InfoRow({ label, value }) {
  return (
    <p className="text-gray-700 text-sm">
      <span className="font-semibold">{label}: </span>
      {value || "-"}
    </p>
  );
}
