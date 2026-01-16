import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Users, UserPlus, Eye, Edit3, Trash2, 
  Crown, ChevronDown, ChevronUp, X, Phone, Mail, Filter, Info, Star,
  Briefcase, GraduationCap, Calendar, Heart
} from "lucide-react"; 

const API_BASE = import.meta.env.VITE_API_URL + '/family';
const VILLAGE_API = import.meta.env.VITE_API_URL + '/villages/all'; 

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

  // --- Close Modal on Esc Key ---
  const handleEsc = useCallback((event) => {
    if (event.key === 'Escape') {
      setShowModal(false);
    }
  }, []);

  useEffect(() => {
    if (showModal) {
      document.addEventListener('keydown', handleEsc);
    } else {
      document.removeEventListener('keydown', handleEsc);
    }
    return () => document.removeEventListener('keydown', handleEsc);
  }, [showModal, handleEsc]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const fetchFamilies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = { page, limit: 10, q: searchTerm, village: selectedVillage };
      const { data } = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setFamilies(data.data || []);
      setTotalPages(Math.ceil(data.total / 10));
      setFamilycount(data.familyCount || 0);
      setMembercount(data.memberCount || 0);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const fetchVillages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(VILLAGE_API, { headers: { Authorization: `Bearer ${token}` } });
      setVillages(res.data.data || []);
    } catch (err) { console.error(err); }
  };

  const reassignHead = async (familyId, memberId) => {
    if (!window.confirm("Make this member the Family Head?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE}/${familyId}/reassign-head`, { memberId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFamilies();
    } catch (err) { alert("Failed to reassign head"); }
  };

  const deleteMember = async (familyId, memberId) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE}/${familyId}/member/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFamilies();
    } catch (err) { alert("Failed to delete member"); }
  };

  useEffect(() => { fetchFamilies(); fetchVillages(); }, [page, selectedVillage]);

  useEffect(() => {
    const delay = setTimeout(() => fetchFamilies(), 400);
    return () => clearTimeout(delay);
  }, [searchTerm]);

 const hasPermission = (family) => {
  if (!user) return false;

  if (user.role === "admin") return true;

  if (user.role === "representative") {
    const village = family?.village?.toLowerCase();

    return (user.nativePlaces || [])
      .map(v => v.toLowerCase())
      .includes(village);
  }

  if (user.role === "user") {
    const email = family?.email?.toLowerCase();

    return (user.linkedEmails || [])
      .map(e => e.toLowerCase())
      .includes(email);
  }

  return false;
};


  const toggleFamily = (id) => {
    setExpandedFamilies(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const sortedFamilies = [...families].sort((a, b) => {
  const aPerm = hasPermission(a);
  const bPerm = hasPermission(b);

  if (aPerm === bPerm) return 0;
  return aPerm ? -1 : 1;
});

  return (
    <div className="min-h-screen bg-slate-50 pb-20 mt-10">
      
      {/* ================= HEADER ================= */}
      <section className="relative flex items-center justify-center h-[200px] overflow-hidden bg-[#0F172A] w-full">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-600 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-emerald-600 rounded-full blur-[100px]" />
        </div>
        <div className="relative z-10 text-center px-6">
          <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight">Family <span className="text-indigo-400">Directory</span></h1>
          <p className="text-slate-400 text-sm md:text-base font-medium">Managing {familyCount} Families & {memberCount} Members</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        {/* --- SEARCH & FILTERS --- */}
        <div className="bg-white p-3 rounded-3xl shadow-xl border border-slate-100 flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text" placeholder="Search by name, education, or mobile..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
              value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setPage(1);}}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="pl-4 pr-10 py-3 rounded-2xl bg-slate-50 border-none text-sm font-bold outline-none cursor-pointer"
              value={selectedVillage} onChange={(e) => {setSelectedVillage(e.target.value); setPage(1);}}
            >
              <option value="">All Villages</option>
              {villages.map(v => <option key={v._id} value={v.name}>{v.name}</option>)}
            </select>
            {(user?.role === 'admin' || (user?.role === 'representative' && user?.nativePlaces?.length > 0)) && (
              <button onClick={() => navigate(`/dashboard/${role}/add-family`)} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-600 transition-all flex items-center gap-2">
                <UserPlus size={18} /> <span className="hidden sm:inline">Add</span>
              </button>
            )}
          </div>
        </div>

        {/* --- FAMILY LIST --- */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto" /></div>
          ) : sortedFamilies.map((family) => (
            <div key={family._id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden transition-all">
              <div className="p-4 md:p-6 flex flex-col md:flex-row items-center gap-4">
                <div className="flex items-center gap-4 flex-grow w-full cursor-pointer" onClick={() => toggleFamily(family._id)}>
                  <div className="relative shrink-0">
                    <img src={family.image ? `${backend_url}${family.image}` : "/no_image.png"} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-50 shadow-sm" alt="" />
                    <div className="absolute -top-1 -left-1 bg-amber-400 text-white p-1 rounded-lg border-2 border-white"><Crown size={10} /></div>
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-slate-900 text-lg leading-tight uppercase">{family.name}</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1 flex items-center gap-1"><MapPin size={10} className="text-indigo-500" /> {family.village}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0">
                  <button onClick={() => {setSelectedMember(family); setShowModal(true);}} className="flex-1 md:flex-none p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">  <Eye size={18}/> </button>
                  {hasPermission(family) && (
                    <>
                      <Link to={`/dashboard/${role}/edit-family/${family._id}/head`} className="flex-1 md:flex-none p-3 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-400 hover:text-white transition-all flex justify-center"><Edit3 size={18}/></Link>
                      <button onClick={() => window.confirm("Delete Family?") && axios.delete(`${API_BASE}/${family._id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }).then(fetchFamilies)} className="flex-1 md:flex-none p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-500 hover:text-white transition-all flex justify-center"><Trash2 size={18}/></button>
                    </>
                  )}
                  <button onClick={() => toggleFamily(family._id)} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-200 transition-all">
                    {expandedFamilies.includes(family._id) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              {/* --- EXPANDED MEMBERS --- */}
              {expandedFamilies.includes(family._id) && (
                <div className="px-4 pb-6 animate-in slide-in-from-top-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-4 border-t border-slate-50">
                    {family.members?.map((m) => (
                      <div key={m._id} className="bg-slate-50/80 p-3 rounded-2xl flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            <img src={m.image ? `${backend_url}${m.image}` : "/no_image.png"} className="w-10 h-10 rounded-xl object-cover" alt="" />
                            <div>
                                <p className="text-sm font-bold text-slate-800 leading-tight uppercase">{m.name}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{m.relation}</p>
                            </div>
                        </div>
                        <div className="flex gap-1">
                             <button onClick={() => {setSelectedMember(m); setShowModal(true);}} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg"><Eye size={16}/></button>
                             {hasPermission(family) && (
                                <>
                                  <Link to={`/dashboard/${role}/edit-family/${family._id}/${m._id}`} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg"><Edit3 size={16}/></Link>
                                  <button onClick={() => reassignHead(family._id, m._id)} className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg"><Star size={16}/></button>
                                  <button onClick={() => deleteMember(family._id, m._id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={16}/></button>
                                </>
                             )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* --- PAGINATION --- */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-10">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 bg-white rounded-xl border border-slate-100 disabled:opacity-30 font-bold text-sm">Prev</button>
            <span className="text-sm font-bold text-slate-500">{page} / {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 bg-white rounded-xl border border-slate-100 disabled:opacity-30 font-bold text-sm">Next</button>
          </div>
        )}
      </div>

      {/* ================= UPDATED VIEW POPUP (MODAL) ================= */}
      {/* ================= UPDATED VIEW POPUP (FIXED IMAGE & PLACEMENT) ================= */}
      {showModal && selectedMember && (
        <div 
          className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex justify-center items-end md:items-center z-[100] p-0 md:p-4"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl w-full max-w-lg relative animate-in slide-in-from-bottom md:zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
            style={{ overflow: 'visible' }} // IMPORTANT: Allows image to pop out
          >
            {/* Header Banner */}
            <div className="h-28 bg-[#0F172A] rounded-t-[2.5rem] md:rounded-t-[3rem] relative z-10">
                <button 
                  onClick={() => setShowModal(false)} 
                  className="absolute top-5 right-5 p-2 bg-white/10 text-white rounded-full hover:bg-white hover:text-slate-900 transition-all z-50"
                >
                  <X size={20}/>
                </button>
            </div>

            {/* Profile Content Container */}
            <div className="px-6 md:px-10 pb-12 text-center relative z-20">
                {/* Floating Image Section */}
                <div className="relative -mt-16 mb-6 flex justify-center">
                    <div className="relative">
                        <img 
                          src={selectedMember.image ? `${backend_url}${selectedMember.image}` : "/no_image.png"} 
                          className="w-32 h-32 md:w-36 md:h-36 rounded-[2.5rem] object-cover border-[6px] border-white shadow-2xl bg-slate-100" 
                          alt={selectedMember.name}
                        />
                        {/* Member Role Badge */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border-2 border-white">
                           {selectedMember.relation || "Head"}
                        </div>
                    </div>
                </div>

                {/* Name & Title Section */}
                <div className="mb-8 pt-2">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight uppercase tracking-tight">
                      {selectedMember.name}
                    </h2>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                      Family Member Details
                    </p>
                </div>
                
                {/* Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left overflow-y-auto max-h-[40vh] pr-2 custom-scrollbar">
                    <DetailItem icon={<Info size={14}/>} label="Member ID" value={selectedMember.memberID} />
                    <DetailItem icon={<MapPin size={14}/>} label="Village" value={selectedMember.village} />
                    <DetailItem icon={<Phone size={14}/>} label="Mobile" value={selectedMember.mobile} />
                    <DetailItem icon={<Mail size={14}/>} label="Email" value={selectedMember.email} />
                    <DetailItem icon={<GraduationCap size={14}/>} label="Education" value={selectedMember.education} />
                    <DetailItem icon={<Heart size={14}/>} label="Blood Group" value={selectedMember.bloodGroup} />
                    <DetailItem icon={<Calendar size={14}/>} label="Birth Date" value={selectedMember.birthDate?.slice(0,10)} />
                    <DetailItem icon={<Briefcase size={14}/>} label="Profession" value={selectedMember.profession} />
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Component for Modal Items
const DetailItem = ({ icon, label, value }) => (
    <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors group">
        <p className="text-[10px] text-slate-400 uppercase font-black flex items-center gap-1.5 mb-1 tracking-wider group-hover:text-indigo-400 transition-colors">
          {icon} {label}
        </p>
        <p className="text-sm font-bold text-slate-800 break-words">
          {value || "---"}
        </p>
    </div>
);

export default FamilyList;