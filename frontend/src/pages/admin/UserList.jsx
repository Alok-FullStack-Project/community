import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { Section } from "../../components/Section";
import { 
  Search, Plus, Edit2, Trash2, Mail, 
  Phone, User as UserIcon, Calendar, 
  ChevronLeft, ChevronRight, RotateCcw,
  ShieldCheck, UserCheck, Users
} from "lucide-react";
import { toast } from "react-toastify";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async (query = q, pageNumber = 1) => {
    try {
      setLoading(true);
      const params = { page: pageNumber, limit };
      if (query) params.q = query;

      const res = await api.get("/users", { params });
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];

      setUsers(data);
      if (res.data.total && res.data.limit) {
        setTotalPages(Math.ceil(res.data.total / res.data.limit));
      } else {
        setTotalPages(1);
      }
    } catch (err) {
      setError("Failed to load users");
      toast.error("Network error: Could not sync user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user? This action cannot be undone.")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      toast.success("User removed from database");
    } catch (err) {
      toast.error("Deletion failed");
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchUsers(q, 1);
  };

  const clearSearch = () => {
    setQ("");
    setPage(1);
    fetchUsers("", 1);
  };

  const changePage = (move) => {
    const newPage = page + move;
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    fetchUsers(q, newPage);
  };

  const roleBadge = (role) => {
    const config = {
      admin: { color: "bg-rose-100 text-rose-700", icon: <ShieldCheck size={12}/> },
      representative: { color: "bg-indigo-100 text-indigo-700", icon: <UserCheck size={12}/> },
      user: { color: "bg-emerald-100 text-emerald-700", icon: <Users size={12}/> },
    };
    const style = config[role] || { color: "bg-slate-100 text-slate-600", icon: <UserIcon size={12}/> };
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${style.color}`}>
        {style.icon} {role}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Section title1="User" tittle2="Directory" />

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        
        {/* SEARCH & ACTION BAR */}
        <div className="bg-white p-4 rounded-3xl shadow-xl shadow-slate-200/50 border border-white flex flex-col lg:flex-row gap-4 justify-between items-center mb-6">
          <div className="flex flex-1 w-full gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search by name, email, or role..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-500 transition-all outline-none text-sm font-medium"
              />
            </div>
            <button 
              onClick={handleSearch}
              className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95"
            >
              Filter
            </button>
            <button 
              onClick={clearSearch}
              className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
            >
              <RotateCcw size={20} />
            </button>
          </div>

          <Link
            to="/dashboard/admin/add-user"
            className="w-full lg:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
          >
            <Plus size={18} /> New Account
          </Link>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Profile</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Contact Details</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Permissions</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Account Age</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="5" className="px-6 py-6"><div className="h-12 bg-slate-50 rounded-2xl"></div></td>
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-20 text-center text-slate-400 font-bold uppercase tracking-widest">No users found in directory</td></tr>
                ) : (
                  users.map((user, i) => (
                    <tr key={user._id} className="group hover:bg-indigo-50/30 transition-all">
                      {/* PROFILE */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img
                              src={user.avatar || "/no_image.png"}
                              className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm object-cover"
                              alt=""
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{user.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter truncate max-w-[150px]">ID: {user._id.slice(-8)}</p>
                          </div>
                        </div>
                      </td>

                      {/* CONTACT */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                            <Mail size={12} className="text-indigo-500" /> {user.email}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                            <Phone size={10} /> {user.phone || "No phone linked"}
                          </div>
                        </div>
                      </td>

                      {/* ROLE */}
                      <td className="px-6 py-4">
                        {roleBadge(user.role)}
                      </td>

                      {/* DATE */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                          <Calendar size={12} />
                          {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/dashboard/admin/edit-user/${user._id}`}
                            className="p-2.5 bg-white border border-slate-100 text-amber-500 rounded-xl shadow-sm hover:bg-amber-500 hover:text-white transition-all"
                          >
                            <Edit2 size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="p-2.5 bg-white border border-slate-100 text-rose-500 rounded-xl shadow-sm hover:bg-rose-500 hover:text-white transition-all"
                          >
                            <Trash2 size={16} />
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

        {/* PAGINATION */}
        {users.length > 0 && (
          <div className="mt-8 flex justify-between items-center bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Page {page} <span className="text-slate-200 mx-2">/</span> {totalPages}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => changePage(-1)}
                disabled={page <= 1}
                className="flex items-center gap-2 px-5 py-2 text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 rounded-2xl disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <button
                onClick={() => changePage(1)}
                disabled={page >= totalPages}
                className="flex items-center gap-2 px-5 py-2 text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-2xl disabled:opacity-30 transition-all"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}