import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";
import { Section } from "../../components/Section";
import { 
  Search, Plus, Edit2, Trash2, ExternalLink, 
  Phone, Calendar, Filter, ArrowUpDown, 
  AlertCircle, CheckCircle2, Clock, PlayCircle 
} from "lucide-react"; 
import { toast } from "react-toastify";

export default function AdvertiseAdmin() { 
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("status");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const res = await api.get("/advertise");
      setAds(res.data.data || res.data);
    } catch (err) {
      toast.error("Failed to fetch advertisements");
    } finally {
      setLoading(false);
    }
  };

  const getDateStatus = (start, end) => {
    const today = new Date();
    const s = start ? new Date(start) : null;
    const e = end ? new Date(end) : null;

    if (!s && !e) return { key: "none", label: "No Dates", color: "slate", icon: <AlertCircle size={14}/> };
    if (s && today < s) return { key: "upcoming", label: "Upcoming", color: "orange", icon: <Clock size={14}/> };
    if (e && today > e) return { key: "expired", label: "Expired", color: "rose", icon: <AlertCircle size={14}/> };
    return { key: "running", label: "Running", color: "emerald", icon: <PlayCircle size={14}/> };
  };

  // Logic for filtered data
  let filtered = ads.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()));
  if (statusFilter !== "all") {
    filtered = filtered.filter((a) => getDateStatus(a.startDate, a.endDate).key === statusFilter);
  }

  // Sorting logic
  const order = { running: 1, upcoming: 2, expired: 3, none: 4 };
  filtered.sort((a, b) => {
    if (sortBy === "az") return a.name.localeCompare(b.name);
    if (sortBy === "za") return b.name.localeCompare(a.name);
    if (sortBy === "status") return order[getDateStatus(a.startDate, a.endDate).key] - order[getDateStatus(b.startDate, b.endDate).key];
    return 0;
  });

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const pageData = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleDelete = async (id) => {
    if (!window.confirm("Permanent delete this advertisement?")) return;
    try {
      await api.delete(`/advertise/${id}`);
      setAds((prev) => prev.filter((x) => x._id !== id));
      toast.success("Ad removed successfully");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Section title1="Advertise" tittle2="Management" />

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        
        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Ads', count: ads.length, color: 'bg-indigo-600' },
            { label: 'Running', count: ads.filter(a => getDateStatus(a.startDate, a.endDate).key === 'running').length, color: 'bg-emerald-500' },
            { label: 'Upcoming', count: ads.filter(a => getDateStatus(a.startDate, a.endDate).key === 'upcoming').length, color: 'bg-orange-400' },
            { label: 'Expired', count: ads.filter(a => getDateStatus(a.startDate, a.endDate).key === 'expired').length, color: 'bg-rose-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-slate-800">{stat.count}</p>
              </div>
              <div className={`w-2 h-10 rounded-full ${stat.color}`}></div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search campaigns..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/10 outline-none text-sm font-medium"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200">
              <Filter size={16} className="text-slate-400" />
              <select 
                className="bg-transparent text-sm font-bold text-slate-600 outline-none py-1"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="running">Running</option>
                <option value="upcoming">Upcoming</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          <Link
            to="/dashboard/admin/advertise/add"
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
          >
            <Plus size={18} /> Add Campaign
          </Link>
        </div>

        {/* Modern Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Campaign</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Schedule</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Priority</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse"><td colSpan="5" className="px-6 py-6"><div className="h-10 bg-slate-50 rounded-xl"></div></td></tr>
                  ))
                ) : pageData.map((ad) => {
                  const status = getDateStatus(ad.startDate, ad.endDate);
                  return (
                    <tr key={ad._id} className="group hover:bg-indigo-50/30 transition-all">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                             <img 
                               src={ad.image ? `${backend_url}${ad.image}` : "/no_image.png"} 
                               className="w-12 h-12 rounded-xl object-cover shadow-sm ring-2 ring-white" 
                               alt="" 
                             />
                             {ad.priority === 'premium' && (
                               <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white">★</div>
                             )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 uppercase leading-none mb-1">{ad.name}</p>
                            <div className="flex items-center gap-3 text-slate-400">
                              <span className="flex items-center gap-1 text-[11px] font-medium"><Phone size={10}/> {ad.mobile || 'N/A'}</span>
                              {ad.link && <a href={ad.link} target="_blank" className="text-indigo-500 hover:text-indigo-700"><ExternalLink size={12}/></a>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                            <Calendar size={12}/> {ad.startDate ? new Date(ad.startDate).toLocaleDateString() : '∞'}
                          </div>
                          <div className="w-px h-2 bg-slate-200"></div>
                          <div className="text-[11px] font-bold text-slate-400">
                            {ad.endDate ? new Date(ad.endDate).toLocaleDateString() : '∞'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded border ${ad.priority === 'premium' ? 'border-amber-200 text-amber-600 bg-amber-50' : 'border-slate-200 text-slate-400'}`}>
                          {ad.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                         <div className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full text-[10px] font-black uppercase tracking-widest bg-${status.color}-100 text-${status.color}-700`}>
                            {status.icon} {status.label}
                         </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Link to={`/dashboard/admin/advertise/edit/${ad._id}`} className="p-2 text-amber-600 hover:bg-amber-100 rounded-xl transition-colors">
                            <Edit2 size={18} />
                          </Link>
                          <button onClick={() => handleDelete(ad._id)} className="p-2 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(page - 1)}
              className="p-2 bg-white rounded-xl border border-slate-200 disabled:opacity-30 hover:bg-indigo-50 transition-colors"
            >
              <ArrowUpDown size={18} className="rotate-90" />
            </button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${page === i + 1 ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-slate-400 hover:bg-slate-100'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={page === totalPages} 
              onClick={() => setPage(page + 1)}
              className="p-2 bg-white rounded-xl border border-slate-200 disabled:opacity-30 hover:bg-indigo-50 transition-colors"
            >
              <ArrowUpDown size={18} className="-rotate-90" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}