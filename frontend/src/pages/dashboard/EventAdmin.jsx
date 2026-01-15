import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { Section } from "../../components/Section";
import { 
  Plus, Search, Filter, RotateCcw, 
  Calendar, MapPin, Edit3, Trash2, 
  Image as ImageIcon, Eye, EyeOff,
  ChevronLeft, ChevronRight, ArrowUpDown
} from "lucide-react";
import { toast } from "react-toastify";

export default function EventAdmin() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search & Filters
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Sorting
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/events", {
        params: {
          page,
          limit,
          q: search || undefined,
          publish: filterStatus !== "" ? filterStatus : undefined,
          sortField,
          sortOrder,
        },
      });
      setEvents(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error("Failed to sync event data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [page, sortField, sortOrder]);

  useEffect(() => {
    const delay = setTimeout(() => fetchEvents(), 400);
    return () => clearTimeout(delay);
  }, [search, filterStatus]);

  const deleteEvent = async (id) => {
    if (!window.confirm("Permanent action: Delete this event and all associated records?")) return;
    try {
      await api.delete(`/events/${id}`);
      toast.success("Event permanently deleted");
      fetchEvents();
    } catch {
      toast.error("Deletion failed");
    }
  };

  const togglePublish = async (event) => {
    try {
      await api.put(`/events/${event._id}/publish`, {
        publish: !event.publish,
      });
      toast.info(`Event ${!event.publish ? 'Published' : 'Hidden'}`);
      fetchEvents();
    } catch {
      toast.error("Status update failed");
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Section title1="Event" tittle2="Management" />

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        
        {/* ACTION BAR */}
        <div className="bg-white p-4 rounded-3xl shadow-xl shadow-slate-200/50 border border-white mb-6 space-y-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex flex-1 w-full gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search events by name..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:bg-white transition-all outline-none text-sm font-medium"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="hidden md:block px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Visibility: All</option>
                <option value="true">Published Only</option>
                <option value="false">Hidden Only</option>
              </select>
              <button
                onClick={() => { setSearch(""); setFilterStatus(""); }}
                className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
              >
                <RotateCcw size={20} />
              </button>
            </div>

            <Link
              to="/dashboard/admin/events/add"
              className="w-full lg:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
            >
              <Plus size={18} /> Add New Event
            </Link>
          </div>
        </div>

        {/* TABLE CONTAINER */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th 
                    className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      Event Detail <ArrowUpDown size={12} />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer"
                    onClick={() => handleSort("event_date")}
                  >
                    <div className="flex items-center gap-2">Date & Venue <ArrowUpDown size={12} /></div>
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Media Preview</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Visibility</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="5" className="px-6 py-8"><div className="h-12 bg-slate-50 rounded-2xl"></div></td>
                    </tr>
                  ))
                ) : events.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center text-slate-400 font-bold uppercase tracking-widest">
                      No matching events found in database
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr key={event._id} className="group hover:bg-slate-50/80 transition-all">
                      {/* NAME & CREATED */}
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                            {event.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                            Ref: {event._id.slice(-8)}
                          </p>
                        </div>
                      </td>

                      {/* DATE & VENUE */}
                      <td className="px-6 py-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                            <Calendar size={12} className="text-indigo-500" />
                            {event.event_date ? new Date(event.event_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : "TBA"}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400 italic">
                            <MapPin size={12} /> {event.place || "Virtual/Unassigned"}
                          </div>
                        </div>
                      </td>

                      {/* IMAGE PREVIEW */}
                      <td className="px-6 py-4">
                        {event.coverImage ? (
                          <div className="relative w-20 h-12 rounded-xl overflow-hidden shadow-sm ring-2 ring-white group-hover:ring-indigo-100 transition-all">
                            <img
                              src={`${backend_url}${event.coverImage}`}
                              className="w-full h-full object-cover"
                              alt=""
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300 italic text-[10px]">
                            <ImageIcon size={14} />
                          </div>
                        )}
                      </td>

                      {/* VISIBILITY STATUS */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => togglePublish(event)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                            event.publish 
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" 
                            : "bg-rose-100 text-rose-700 hover:bg-rose-200"
                          }`}
                        >
                          {event.publish ? <Eye size={12} /> : <EyeOff size={12} />}
                          {event.publish ? "Published" : "Hidden"}
                        </button>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end items-center gap-2">
                          <Link
                            to={`/dashboard/admin/events/images/${event._id}`}
                            className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                            title="Manage Gallery"
                          >
                            <ImageIcon size={18} />
                          </Link>
                          <Link
                            to={`/dashboard/admin/events/edit/${event._id}`}
                            className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                            title="Edit Content"
                          >
                            <Edit3 size={18} />
                          </Link>
                          <button
                            onClick={() => deleteEvent(event._id)}
                            className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                            title="Delete Event"
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

        {/* PAGINATION */}
        {events.length > 0 && (
          <div className="mt-8 flex justify-between items-center bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Viewing Page <span className="text-slate-800">{page}</span> of {totalPages}
            </p>
            <div className="flex gap-3">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex items-center gap-2 px-5 py-2 text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 rounded-2xl disabled:opacity-30 transition-all border border-transparent disabled:border-transparent active:scale-95"
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center gap-2 px-5 py-2 text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-2xl disabled:opacity-30 transition-all active:scale-95"
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