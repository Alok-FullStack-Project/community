import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { Section } from "../../components/Section";
import { 
  Save, X, Upload, Calendar, MapPin, 
  Type, AlignLeft, Globe, ArrowLeft 
} from "lucide-react";
import { toast } from "react-toastify";  

const emptyEvent = {
  name: "",
  event_date: "",
  place: "",
  description: "",
  publish: true,
  coverImage: "",
  file: null,
};

export default function EventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(emptyEvent);
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(id);
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (id) fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${id}`);
      setEvent({ ...res.data, file: null });
    } catch (err) {
      toast.error("Failed to fetch event");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setEvent((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("name", event.name);
      fd.append("event_date", event.event_date);
      fd.append("place", event.place);
      fd.append("description", event.description);
      fd.append("publish", event.publish);

      if (event.file) fd.append("coverImage", event.file);

      if (isEdit) {
        await api.put(`/events/${id}`, fd);
        toast.success("Event updated successfully!");
      } else {
        await api.post(`/events`, fd);
        toast.success("Event created successfully!");
      }

      navigate("/dashboard/admin/events");
    } catch (err) {
      toast.error("Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Section title1={isEdit ? "Edit" : "New"} tittle2="Event" />

      <div className="max-w-3xl mx-auto px-4 -mt-10 relative z-10">
        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          
          {/* FORM HEADER */}
          <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => navigate("/dashboard/admin/events")}
                className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-indigo-600 shadow-sm"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                {isEdit ? "Update Details" : "Event Creation"}
              </h2>
            </div>
            <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${event.publish ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
              {event.publish ? "Live on Site" : "Internal Draft"}
            </div>
          </div>

          <div className="p-8 space-y-8">
            
            {/* COVER IMAGE UPLOAD */}
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Cover Artwork</label>
              <div className="relative group">
                <div className="aspect-[21/9] w-full rounded-3xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-200 group-hover:border-indigo-300 transition-all">
                  {event.file || event.coverImage ? (
                    <img
                      src={event.file ? URL.createObjectURL(event.file) : `${backend_url}${event.coverImage}`}
                      className="w-full h-full object-cover"
                      alt="Preview"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <Upload size={40} strokeWidth={1.5} className="mb-2" />
                      <p className="text-xs font-bold uppercase tracking-tighter">Click to upload cover</p>
                    </div>
                  )}
                  <input
                    type="file"
                    name="file"
                    onChange={handleChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* NAME */}
              <div className="md:col-span-2 space-y-2">
                <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  <Type size={14} className="text-indigo-500" /> Event Title
                </label>
                <input
                  type="text"
                  name="name"
                  value={event.name}
                  onChange={handleChange}
                  placeholder="e.g. Annual Tech Symposium 2026"
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
                  required
                />
              </div>

              {/* DATE */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  <Calendar size={14} className="text-indigo-500" /> Date
                </label>
                <input
                  type="date"
                  name="event_date"
                  value={event.event_date ? new Date(event.event_date).toISOString().split("T")[0] : ""}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
                  required
                />
              </div>

              {/* PLACE */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  <MapPin size={14} className="text-indigo-500" /> Venue / Location
                </label>
                <input
                  type="text"
                  name="place"
                  value={event.place}
                  onChange={handleChange}
                  placeholder="e.g. Grand Ballroom, City Hotel"
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
                  required
                />
              </div>

              {/* DESCRIPTION */}
              <div className="md:col-span-2 space-y-2">
                <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  <AlignLeft size={14} className="text-indigo-500" /> Description
                </label>
                <textarea
                  name="description"
                  value={event.description}
                  onChange={handleChange}
                  placeholder="What is this event about?"
                  className="w-full bg-slate-50 border-none rounded-3xl px-5 py-4 text-sm font-medium text-slate-600 placeholder:text-slate-300 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none min-h-[120px] resize-none"
                />
              </div>
            </div>

            {/* TOGGLE */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${event.publish ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-400'}`}>
                  <Globe size={18} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-tight text-slate-700">Public Visibility</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Should this be visible to users?</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="publish" 
                  checked={event.publish} 
                  onChange={handleChange} 
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>

          {/* FOOTER ACTIONS */}
          <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard/admin/events")}
              className="flex-1 px-6 py-4 bg-white text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? "Processing..." : <><Save size={16} /> {isEdit ? "Update Event" : "Create Event"}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}