import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import { Section } from "../../components/Section"; 
import { 
  Image as ImageIcon, 
  Plus, 
  Save, 
  X, 
  Calendar,  
  Link as LinkIcon, 
  Phone, 
  Layers 
} from "lucide-react";
import { toast } from "react-toastify";

const emptyAd = {
  name: "",
  description: "",
  order: "",
  image: "",
  startDate: "",
  endDate: "",
  publish: true,
  priority: "standard",
  mobile: "",
  link: "",
  file: null,
};

export default function AdvertiseForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [advertise, setAdvertise] = useState(emptyAd);
  const [loading, setLoading] = useState(false);
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (id) fetchAd();
  }, [id]);

  const fetchAd = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/advertise/${id}`);
      setAdvertise({
        ...advertise,
        ...res.data,
        startDate: res.data.startDate?.split("T")[0] || "",
        endDate: res.data.endDate?.split("T")[0] || "",
      });
    } catch (err) {
      toast.error("Failed to fetch advertisement details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setAdvertise((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!advertise.name.trim()) return toast.warning("Advertisement name is required");

    const formData = new FormData();
    Object.keys(advertise).forEach((key) => {
      if (key === "file" && advertise.file) {
        formData.append("image", advertise.file);
      } else if (key !== "file" && key !== "image") {
        formData.append(key, advertise[key]);
      }
    });

    try {
      setLoading(true);
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      
      if (id) {
        await api.put(`/advertise/${id}`, formData, config);
        toast.success("Advertisement Updated Successfully 🎉");
      } else {
        await api.post(`/advertise`, formData, config);
        toast.success("Advertisement Created Successfully 🎉");
      }
      navigate("/dashboard/admin/advertise");
    } catch (err) {
      toast.error("Operation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Section title1="Advertise" tittle2="Management" />

      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          
          {/* Header */}
          <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${id ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                {id ? <Save size={24} /> : <Plus size={24} />}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                  {id ? "Edit Advertisement" : "Create New Ad"}
                </h2>
                <p className="text-sm text-slate-500 font-medium">Configure display settings and campaign duration</p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => navigate("/dashboard/admin/advertise")}
              className="group flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-rose-500 transition-colors"
            >
              <X size={20} className="group-hover:rotate-90 transition-transform" />
              <span className="font-bold text-sm">Discard</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              
              {/* Left Column: Details */}
              <div className="lg:col-span-7 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Ad Campaign Name</label>
                    <input
                      type="text"
                      name="name"
                      value={advertise.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Summer Electronics Fest"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Brief Description</label>
                    <textarea
                      name="description"
                      value={advertise.description}
                      onChange={handleChange}
                      placeholder="Details about the promotion..."
                      rows="3"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                    ></textarea>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">
                      <Calendar size={14} /> Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={advertise.startDate}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus:ring-4 focus:ring-indigo-500/10 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">
                      <Calendar size={14} /> End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={advertise.endDate}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus:ring-4 focus:ring-indigo-500/10 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">
                      <Phone size={14} /> Contact Mobile
                    </label>
                    <input
                      type="text"
                      name="mobile"
                      value={advertise.mobile}
                      onChange={handleChange}
                      placeholder="Enter mobile..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus:ring-4 focus:ring-indigo-500/10 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">
                      <LinkIcon size={14} /> Destination URL
                    </label>
                    <input
                      type="text"
                      name="link"
                      value={advertise.link}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 focus:ring-4 focus:ring-indigo-500/10 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Visuals & Settings */}
              <div className="lg:col-span-5 space-y-8">
                {/* Image Upload Area */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Creative Asset</label>
                  <div className="relative group">
                    <div className="w-full h-64 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl overflow-hidden flex flex-col items-center justify-center transition-colors group-hover:border-indigo-300">
                      {advertise.file || advertise.image ? (
                        <img
                          src={advertise.file ? URL.createObjectURL(advertise.file) : `${backend_url}${advertise.image}`}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-6">
                          <ImageIcon className="mx-auto mb-3 text-slate-300" size={48} />
                          <p className="text-sm font-bold text-slate-400 uppercase">Click to upload image</p>
                          <p className="text-xs text-slate-400 mt-1">Recommended size: 1200x600px</p>
                        </div>
                      )}
                      <input
                        type="file"
                        name="file"
                        accept="image/*"
                        onChange={handleChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Configuration Grid */}
                <div className="bg-slate-50/50 rounded-3xl p-6 space-y-6 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Layers className="text-indigo-500" size={18} />
                      <span className="text-sm font-bold text-slate-700">Display Order</span>
                    </div>
                    <input
                      type="number"
                      name="order"
                      value={advertise.order}
                      onChange={handleChange}
                      className="w-20 bg-white border border-slate-200 rounded-xl px-3 py-2 text-center font-bold"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">Campaign Priority</span>
                    <select
                      name="priority"
                      value={advertise.priority}
                      onChange={handleChange}
                      className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-indigo-600 outline-none cursor-pointer"
                    >
                      <option value="standard">Standard</option>
                      <option value="premium">Premium ★</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">Visibility Status</span>
                    <label className="relative inline-flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        name="publish"
                        checked={advertise.publish}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-sm"></div>
                      <span className={`ml-3 text-xs font-black uppercase tracking-widest ${advertise.publish ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {advertise.publish ? 'Active' : 'Draft'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {loading ? "Processing..." : id ? "Apply Changes" : "Launch Campaign"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}