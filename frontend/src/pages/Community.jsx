import React, { useEffect, useState, useCallback, useRef } from "react";
import api from "../api/api";
import useImagePreview from "../hooks/useImagePreview";
import { 
  Search, MapPin, Users, Briefcase, Phone, X, 
  ChevronRight, Mail, GraduationCap, Heart, 
  Calendar, Droplets, Building, Info
} from "lucide-react";

// Helper hook for ESC and Outside Click
function useCloseEvents(onClose, isActive) {
  const modalRef = useRef(null);
  

  useEffect(() => {
    if (!isActive) return; // Only listen if this specific modal is active

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation(); // ✋ Stop the event here
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    // 'true' uses the Capture phase so the top modal gets the event first
    document.addEventListener("keydown", handleEsc, true);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("keydown", handleEsc, true);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, isActive]);

  return modalRef;
}

export default function Community() {
	const [totalCount, setTotalCount] = useState(0);
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
  const [miniProfile, setMiniProfile] = useState(null);
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const openMiniProfile = (m) => setMiniProfile(m);

  const fetchVillages = useCallback(async () => {
    try {
      const res = await api.get("/villages/all");
      setVillages(res.data.data || []);
    } catch (err) {
      console.error("Failed to load villages", err);
    }
  }, []);

  const fetchFamilies = useCallback(
    async ({ pageNumber = 1, query = q, villageName = village } = {}) => {
      setLoading(true);
      setError(null);
      try {
        const params = { page: pageNumber, limit };
        if (query) params.q = query;
        if (villageName) params.village = villageName;

        const res = await api.get("/family", { params });
        const payload = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setFamilies(payload);
        setTotalPages(res.data?.total && res.data?.limit ? Math.ceil(res.data.total / res.data.limit) : 1);
       setTotalCount(res.data.familyCount);
      } catch (err) {
        setError("Failed to fetch families");
      } finally {
        setLoading(false);
      }
    },
    [q, village, limit]
  );

  useEffect(() => {
    fetchVillages();
    fetchFamilyCount();
    fetchFamilies({ pageNumber: page });
  }, [fetchVillages, fetchFamilies, page]);

  const fetchFamilyCount = async () => {
    try {
        const token = localStorage.getItem('token');
      const res = await api.get('family/count');
     // setFamilycount(res.data.familyCount);
      setTotalCount(res.data.familyCount + res.data.memberCount)
    } catch (err) {
      console.error(err);
      alert('Failed to load.');
    }
  };

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

  const getImageUrl = (path) => path ? `${backend_url}${path}` : "/no_image.png";

  return (
    <div className="min-h-screen bg-slate-50/50">
      
      {/* ================= COMMUNITY BANNER ================= */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-[#1E293B]">
        <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[120px] -mr-40 -mt-40" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] -ml-40 -mb-40" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
            Our Samaj Directory
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            Community <span className="text-blue-400">Directory</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Connect with family members across all villages. Find professionals, neighbors, and kin within our community network.
          </p>
        </div>
      </section>

      {/* ================= FILTERS SECTION ================= */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 p-6 md:p-8 border border-slate-100">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-3 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
              >
                <option value="">All Villages</option>
                {villages.map((v) => (
                  <option key={v._id || v.name} value={v.name}>{v.name}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-6 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search By name, mobile, email,profession,education,blood group,address..."
                className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="md:col-span-3 flex gap-2">
              <button
                onClick={onSearchClick}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition shadow-lg shadow-blue-200 py-4"
              >
                Search
              </button>
              <button
                onClick={clearFilters}
                className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition py-4"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Users className="text-blue-600" size={24} />
                {loading ? "Refreshing..." : `Registered family (${totalCount})`}
            </h2>
        </div>

        {error && <div className="p-4 mb-6 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-center font-medium">{error}</div>}

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-40 bg-white border border-slate-100 rounded-[2rem] animate-pulse" />
            ))}
          </div>
        ) : families.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <Users size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-800">No families found</h3>
            <p className="text-slate-500">Try adjusting your search or village filters.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {families.map((family) => (
              <div
                key={family._id}
                onClick={() => openFamilyModal(family)}
                className="group bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 cursor-pointer relative overflow-hidden"
              >
                <div className="flex items-start gap-5">
                  <div className="relative shrink-0">
                    <img
                      src={getImageUrl(family.image)}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-50 shadow-md group-hover:scale-105 transition-transform duration-500"
                      onMouseEnter={() => setPreviewUrl(getImageUrl(family.image))}
                      onMouseLeave={() => setPreviewUrl(null)}
                      alt=""
                    />
                    <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white w-8 h-8 rounded-xl flex items-center justify-center border-4 border-white shadow-sm">
                        <span className="text-[10px] font-black">{(family.members || []).length}</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                      {family.name}
                    </h3>
                    <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <MapPin size={14} className="text-slate-400" />
                            <span className="truncate">{family.village || "Unknown Village"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                             <Phone size={14} />
                            <span className="text-xs font-medium">{family.mobile || "N/A"}</span>
                        </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between text-blue-600">
                    <span className="text-xs font-black uppercase tracking-widest flex items-center gap-1">
                        View Profile <ChevronRight size={14} />
                    </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {families.length > 0 && (
          <div className="mt-16 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-6 rounded-[2.5rem] border border-slate-100">
            <span className="text-slate-500 font-medium">
              Showing page <span className="text-slate-900 font-bold">{page}</span> of <span className="text-slate-900 font-bold">{totalPages}</span>
            </span>
            <div className="flex gap-3">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-6 py-3 rounded-2xl border border-slate-200 bg-white font-bold text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition"
              >
                Previous
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-6 py-3 rounded-2xl bg-slate-900 font-bold text-white disabled:opacity-40 hover:bg-slate-800 transition shadow-lg"
              >
                Next Page
              </button>
            </div>
          </div>
        )}
      </section>

      {/* MODALS */}
      {isModalOpen && selectedFamily && (
        <CommunityFamilyModal
          selectedFamily={selectedFamily}
          onClose={() => setIsModalOpen(false)}
          openMiniProfile={openMiniProfile}
          isMiniProfileOpen={!!miniProfile} // <--- Pass this new prop
        />
      )}

      {miniProfile && (
        <MiniProfilePopup
          member={miniProfile}
          onClose={() => setMiniProfile(null)}
          getImageUrl={getImageUrl}
        />
      )}

      <ImagePreview />
    </div>
  );
}

// ================= MODERN FAMILY MODAL =================
function CommunityFamilyModal({ selectedFamily, onClose, openMiniProfile, isMiniProfileOpen }) {
  const [tab, setTab] = useState("info");
  const modalRef = useCloseEvents(onClose, !isMiniProfileOpen);

  const getUrl = (p) => p ? p : "/no_image.png";
  const formatDate = (date) => date ? new Date(date).toLocaleDateString() : "—";

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[9998] flex items-center justify-center p-4 overflow-y-auto">
      <div ref={modalRef} className="bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative flex flex-col my-auto">
        <button onClick={onClose} className="absolute top-6 right-6 z-20 p-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors">
          <X size={20} />
        </button>

        <div className="md:flex">
            {/* Sidebar */}
            <div className="md:w-1/3 bg-slate-50 p-8 border-r border-slate-100">
                <div className="text-center">
                    <img src={getUrl(selectedFamily.image)} className="w-32 h-32 rounded-[2rem] mx-auto object-cover border-4 border-white shadow-xl mb-6" alt="" />
                    <h2 className="text-2xl font-black text-slate-900 leading-tight">{selectedFamily.name}</h2>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full mt-2">
                        Family Head
                    </span>
                    
                    <div className="mt-8 space-y-4 text-left">
                        <div className="flex items-center gap-3 text-slate-600">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm"><MapPin size={16}/></div>
                            <span className="text-sm font-medium">{selectedFamily.village}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm"><Phone size={16}/></div>
                            <span className="text-sm font-medium">{selectedFamily.mobile}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600">
                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm"><Mail size={16}/></div>
                            <span className="text-sm font-medium truncate">{selectedFamily.email || "N/A"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col max-h-[85vh]">
                <div className="flex gap-1 p-4 bg-white border-b border-slate-50">
                    <Tab active={tab === "info"} onClick={() => setTab("info")}>Information</Tab>
                    <Tab active={tab === "members"} onClick={() => setTab("members")}>Family Members ({(selectedFamily.members || []).length})</Tab>
                </div>

                <div className="p-8 overflow-y-auto">
                    {tab === "info" && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Detail label="Profession" value={selectedFamily.profession} icon={<Briefcase size={16}/>} />
                                <Detail label="Profession Type" value={selectedFamily.profession_type} icon={<Building size={16}/>} />
                                <Detail label="Education" value={selectedFamily.education} icon={<GraduationCap size={16}/>} />
                                <Detail label="Marital Status" value={selectedFamily.marital_status} icon={<Heart size={16}/>} />
                                <Detail label="Birth Date" value={formatDate(selectedFamily.birthDate)} icon={<Calendar size={16}/>} />
                                <Detail label="Blood Group" value={selectedFamily.blood_group} icon={<Droplets size={16}/>} />
                            </div>

                            <div className="grid grid-cols-1 gap-6 border-t border-slate-100 pt-6">
                                <Detail label="Profession Address" value={selectedFamily.profession_address} icon={<Building size={16}/>} />
                                <div>
                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <MapPin size={14}/> Residential Address
                                    </h4>
                                    <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        {selectedFamily.residence_address || "No address provided."}
                                    </p>
                                </div>
                                {selectedFamily.remarks && (
                                    <div>
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <Info size={14}/> Remarks
                                        </h4>
                                        <p className="text-slate-600 text-sm italic bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                                            "{selectedFamily.remarks}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {tab === "members" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {(selectedFamily.members || []).map((m, i) => (
                                <div key={i} onClick={() => openMiniProfile(m)} className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group">
                                    <img src={getUrl(m.image)} className="w-12 h-12 rounded-xl object-cover" alt="" />
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 truncate">{m.name}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">{m.relation}</p>
                                    </div>
                                    <ChevronRight className="ml-auto text-slate-300" size={16} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

// ================= MINI PROFILE POPUP =================
function MiniProfilePopup({ member, onClose, getImageUrl }) {
  const modalRef = useCloseEvents(onClose);

  // Helper to handle close button click without closing the parent modal
  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation(); // ✋ Prevent bubbling to Family Modal
    }
    onClose();
  };
  // Helper to format date safely
  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[99999] flex items-center justify-center p-4"
      // No onClick here - the hook handles the outside click via modalRef
    >
      <div 
        ref={modalRef} 
        className="bg-white rounded-[2.5rem] w-full max-w-md p-8 relative shadow-2xl ..."
        onClick={(e) => e.stopPropagation()} // ✋ Prevent clicks inside from closing
      >
        <button 
          onClick={handleClose} 
          className="absolute top-6 right-6 p-2 bg-slate-50 hover:bg-red-50 rounded-full transition-colors"
        >
          <X size={18} />
        </button>

        <div className="text-center">
          {/* Member Image */}
          <img 
            src={getImageUrl(member.image)} 
            className="w-24 h-24 rounded-[2rem] mx-auto object-cover border-4 border-slate-50 shadow-lg mb-4" 
            alt={member.name} 
          />
          
          <h2 className="text-2xl font-black text-slate-900 leading-tight">{member.name}</h2>
          <p className="text-blue-600 font-bold text-xs uppercase tracking-widest bg-blue-50 px-4 py-1 rounded-full inline-block mt-2">
            {member.relation}
          </p>
          
          {/* Info Grid */}
          <div className="mt-8 grid grid-cols-1 gap-y-4 text-left">
              <Detail label="Birth Date" value={formatDate(member.birthDate)} icon={<Calendar size={14}/>} />
              <Detail label="Email Address" value={member.email} icon={<Mail size={14}/>} />
              <Detail label="Mobile" value={member.mobile} icon={<Phone size={14}/>} />
              <Detail label="Education" value={member.education} icon={<GraduationCap size={14}/>} />
              <Detail label="Profession" value={`${member.profession || ''} ${member.profession_type ? `(${member.profession_type})` : ''}`} icon={<Briefcase size={14}/>} />
              <Detail label="Blood Group" value={member.blood_group} icon={<Droplets size={14}/>} />
          </div>
          
          {/* Conditionally Render Remarks */}
          {member.remarks && (
            <div className="mt-6 pt-4 border-t border-slate-100 text-left">
                <h4 className="text-[10px] font-black text-slate-400 uppercase leading-none mb-2 flex items-center gap-2">
                    <Info size={12}/> Remarks
                </h4>
                <p className="text-sm text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{member.remarks}"
                </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ================= UTILITY COMPONENTS =================

function Tab({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 px-2 text-[11px] font-black uppercase tracking-widest transition-all border-b-2 
      ${active ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}
    >
      {children}
    </button>
  );
}

function Detail({ label, value, icon }) {
    return (
        <div className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">{label}</p>
                <p className="text-sm font-bold text-slate-700 truncate">{value || "—"}</p>
            </div>
        </div>
    )
}