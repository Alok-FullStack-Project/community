import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import { Section } from "../../components/Section";
import { 
  User, Mail, Phone, Lock, FileText, 
  Shield, MapPin, AtSign, ArrowLeft, 
  Save, X, Search, CheckCircle2 
} from "lucide-react";
import { toast } from "react-toastify";

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
    password: "",
    role: "user",
    nativePlaces: [],
    linkedEmails: [],
  });

  const [villages, setVillages] = useState([]);
  const [headEmails, setHeadEmails] = useState([]);
  const [villageSearch, setVillageSearch] = useState("");
  const [emailSearch, setEmailSearch] = useState("");

  const filteredVillages = villages.filter(v =>
    v.name.toLowerCase().includes(villageSearch.toLowerCase())
  );

  const filteredEmails = headEmails.filter(e =>
    e?.toLowerCase().includes(emailSearch.toLowerCase())
  );

  const toggleVillage = (name) => {
    setUser(prev => {
      const exists = prev.nativePlaces.includes(name);
      return {
        ...prev,
        nativePlaces: exists
          ? prev.nativePlaces.filter(v => v !== name)
          : [...prev.nativePlaces, name],
      };
    });
  };

  const toggleEmail = (email) => {
    setUser(prev => {
      const exists = prev.linkedEmails.includes(email);
      return {
        ...prev,
        linkedEmails: exists
          ? prev.linkedEmails.filter(e => e !== email)
          : [...prev.linkedEmails, email],
      };
    });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const vRes = await api.get("/villages/all");
        setVillages(vRes.data.data || []);
        const hRes = await api.get("/family/head-emails");
        setHeadEmails(hRes.data || []);
      } catch (err) {
        toast.error("Error loading system metadata");
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (isEdit) {
      const loadUser = async () => {
        try {
          const res = await api.get(`/users/${id}`);
          setUser(res.data);
        } catch (err) {
          toast.error("Failed to load user data");
        }
      };
      loadUser();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "role") {
      setUser((prev) => ({
        ...prev,
        role: value,
        nativePlaces: value === "representative" ? prev.nativePlaces : [],
        linkedEmails: value === "user" ? prev.linkedEmails : [],
      }));
    } else {
      setUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/users/${id}`, user);
        toast.success("Account updated");
      } else {
        await api.post("/users", user);
        toast.success("User account created");
      }
      navigate("/dashboard/admin/user-list");
    } catch (err) {
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Section title1={isEdit ? "Edit" : "New"} tittle2="Account" />

      <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          
          {/* HEADER */}
          <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => navigate("/dashboard/admin/user-list")}
                className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-indigo-600 shadow-sm"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                {isEdit ? "Update User" : "Account Creation"}
              </h2>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              <Shield size={12} /> {user.role} Access
            </div>
          </div>

          <div className="p-8 space-y-10">
            {/* SECTION 1: PERSONAL INFO */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-1 bg-indigo-500 rounded-full"></div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Basic Identity</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    <User size={14} className="text-indigo-500" /> Full Name
                  </label>
                  <input
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
                    placeholder="Enter full name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    <Mail size={14} className="text-indigo-500" /> Primary Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={user.email}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
                    placeholder="email@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    <Phone size={14} className="text-indigo-500" /> Phone Number
                  </label>
                  <input
                    name="phone"
                    value={user.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
                    placeholder="+1 234 567 890"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    <Lock size={14} className={`text-indigo-500 ${isEdit ? 'opacity-30' : ''}`} /> {isEdit ? "Password (Restricted)" : "Initial Password"}
                  </label>
                  <input
                    name="password"
                    type="password"
                    value={user.password}
                    onChange={handleChange}
                    disabled={isEdit}
                    required={!isEdit}
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none disabled:opacity-50"
                    placeholder={isEdit ? "••••••••" : "Create password"}
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    <FileText size={14} className="text-indigo-500" /> Administrative Notes
                  </label>
                  <textarea
                    name="description"
                    value={user.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-medium text-slate-600 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none resize-none"
                    placeholder="Internal description or bio..."
                  />
                </div>
              </div>
            </section>

            {/* SECTION 2: PERMISSIONS */}
            <section className="space-y-6 pt-6 border-t border-slate-50">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-1 bg-amber-500 rounded-full"></div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Role Configuration</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {['user', 'representative', 'admin'].map((r) => (
                    <label 
                      key={r}
                      className={`relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all cursor-pointer ${user.role === r ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-md' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                    >
                      <input type="radio" name="role" value={r} checked={user.role === r} onChange={handleChange} className="absolute opacity-0" />
                      <CheckCircle2 size={16} className={`absolute top-2 right-2 ${user.role === r ? 'opacity-100' : 'opacity-0'}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{r}</span>
                    </label>
                  ))}
                </div>

                {/* ROLE DEPENDENT: VILLAGES */}
                {user.role === "representative" && (
                  <div className="bg-slate-50 rounded-[2rem] p-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    {user.role === "representative" && (
  <div className="bg-slate-50 rounded-[2rem] p-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
    <div className="flex items-center justify-between">
      <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">
        <MapPin size={14} /> Assigned Jurisdictions
      </label>

      <span className="text-[10px] font-bold text-indigo-600 bg-white px-3 py-1 rounded-full shadow-sm">
        {user.nativePlaces?.length || 0} Assigned
      </span>
    </div>

    {user.nativePlaces?.length > 0 ? (
      <div className="flex flex-wrap gap-2">
        {user.nativePlaces.map((place) => (
          <button
            key={place}
            type="button"
            onClick={() =>
              setUser((prev) => ({
                ...prev,
                nativePlaces: prev.nativePlaces.filter((p) => p !== place),
              }))
            }
            className="flex items-center gap-2 px-3 py-1 rounded-full
                       text-[11px] font-bold bg-indigo-100 text-indigo-700
                       hover:bg-red-100 hover:text-red-700 transition"
          >
            <MapPin size={12} />
            {place}
            <X size={12} />
          </button>
        ))}
      </div>
    ) : (
      <p className="text-xs text-slate-400 italic">
        No villages assigned
      </p>
    )}
  </div>
)}


                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input
                        placeholder="Filter villages..."
                        value={villageSearch}
                        onChange={(e) => setVillageSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white rounded-xl text-sm border-none shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 custom-scrollbar">
                      {filteredVillages.map((v) => (
                        <button
                          key={v._id}
                          type="button"
                          onClick={() => toggleVillage(v.name)}
                          className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${user.nativePlaces.includes(v.name) ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                        >
                          {v.name}
                          {user.nativePlaces.includes(v.name) && <X size={12} />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ROLE DEPENDENT: HEAD EMAILS */}
                {user.role === "user" && (
                  <div className="bg-slate-50 rounded-[2rem] p-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">
                        <AtSign size={14} /> Family Connections
                      </label>
                      <span className="text-[10px] font-bold text-emerald-600 bg-white px-3 py-1 rounded-full shadow-sm">{user.linkedEmails.length} Linked</span>
                    </div>

                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input
                        placeholder="Search system emails..."
                        value={emailSearch}
                        onChange={(e) => setEmailSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white rounded-xl text-sm border-none shadow-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                      {filteredEmails.map((email, idx) => (
                        <button
                          key={idx}
                          type="button"
                          disabled={!email}
                          onClick={() => toggleEmail(email)}
                          className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all border-2 ${user.linkedEmails.includes(email) ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-white text-slate-500 hover:border-slate-100'}`}
                        >
                          {email}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard/admin/user-list")}
              className="flex-1 px-6 py-4 bg-white text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? "Processing..." : <><Save size={16} /> {isEdit ? "Update Account" : "Activate User"}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}