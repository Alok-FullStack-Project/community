import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import { Section } from "../../components/Section";
import { 
  Search, Plus, Edit2, Trash2, CheckCircle, XCircle, 
  ChevronLeft, ChevronRight, Filter, MoreVertical, X, Calendar  
} from "lucide-react";

export default function VillageAdmin() {
  const [villages, setVillages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [publish, setPublish] = useState(true);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchVillages = async () => {
    try {
      setLoading(true);
      const res = await api.get("/villages", {
        params: { q: search, page, limit: rowsPerPage },
      });
      setVillages(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      toast.error("Failed to load villages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVillages();
  }, [page, rowsPerPage, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Village name is required");

    try {
      if (editId) {
        await api.put(`/villages/${editId}`, { name, publish });
        toast.success("Village updated successfully");
      } else {
        await api.post("/villages", { name, publish });
        toast.success("Village added successfully");
      }
      resetForm();
      fetchVillages();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Operation failed");
    }
  };

  const resetForm = () => {
    setEditId(null);
    setName("");
    setPublish(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this village?")) return;
    try {
      await api.delete(`/villages/${id}`);
      toast.success("Village deleted");
      fetchVillages();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (v) => {
    setEditId(v._id);
    setName(v.name);
    setPublish(v.publish);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Section title1="Village" tittle2="Management" />

      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
        {/* Modern Add/Edit Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-2 rounded-lg ${editId ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
              {editId ? <Edit2 size={20} /> : <Plus size={20} />}
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              {editId ? "Edit Village Information" : "Register New Village"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
            <div className="md:col-span-7">
              <label className="block text-sm font-semibold text-slate-600 mb-2">Village Name</label>
              <input
                type="text"
                placeholder="Enter village name..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="md:col-span-2 pb-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={publish}
                    onChange={(e) => setPublish(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </div>
                <span className="text-sm font-medium text-slate-600 group-hover:text-indigo-600 transition-colors">Published</span>
              </label>
            </div>

            <div className="md:col-span-3 flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
              >
                {editId ? "Update Village" : "Add Village"}
              </button>
              {editId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="p-3 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              placeholder="Search by village name..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500/10 outline-none"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Filter size={18} className="text-slate-400" />
            <select
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/10"
              value={rowsPerPage}
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
            >
              <option value={5}>5 Rows</option>
              <option value={10}>10 Rows</option>
              <option value={20}>20 Rows</option>
            </select>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Village Details</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Visibility Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Registration Date</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="4" className="px-6 py-8"><div className="h-4 bg-slate-100 rounded w-full"></div></td>
                    </tr>
                  ))
                ) : villages.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-medium">No records found matching your criteria.</td>
                  </tr>
                ) : (
                  villages.map((v) => (
                    <tr key={v._id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="text-slate-800 font-bold text-base uppercase">{v.name}</span>
                      </td>
                      <td className="px-6 py-4">
                        {v.publish ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-tighter">
                            <CheckCircle size={12} /> Live
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-black uppercase tracking-tighter">
                            <XCircle size={12} /> Hidden
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-slate-500 text-sm font-medium">
                          <Calendar size={14} className="text-slate-300" />
                          {new Date(v.createdDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(v)}
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(v._id)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modern Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-indigo-50 transition-colors text-slate-600"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex gap-1 px-4">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                    page === i + 1
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                      : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-indigo-50 transition-colors text-slate-600"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}