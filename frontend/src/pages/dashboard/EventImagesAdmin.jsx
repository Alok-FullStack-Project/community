import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { Section } from "../../components/Section";
import { 
  ArrowLeft, Upload, Trash2, Edit3, 
  Check, X, Image as ImageIcon, Layout,  
  Monitor, Save 
} from "lucide-react";
import { toast } from "react-toastify";

export default function EventImagesAdmin() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add State
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [showInSlider, setShowInSlider] = useState(false);
  const [showInGallery, setShowInGallery] = useState(true);

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editCaption, setEditCaption] = useState("");
  const [editSlider, setEditSlider] = useState(false);
  const [editGallery, setEditGallery] = useState(true);
  const [editFile, setEditFile] = useState(null);
  
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const fetchEvent = async () => {
    try {
      const res = await api.get(`/events/${eventId}`);
      setEvent(res.data);
    } catch (err) {
      toast.error("Failed to fetch event details");
    }
  };

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/events/${eventId}/images`);
      setImages(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
    fetchImages();
  }, [eventId]);

  const handleAdd = async () => {
    if (!file) return toast.warning("Please select an image first");

    try {
      const formData = new FormData();
      formData.append("url", file);
      formData.append("caption", caption);
      formData.append("showInSlider", showInSlider);
      formData.append("showInGallery", showInGallery);

      await api.post(`/events/${eventId}/image`, formData);
      toast.success("Image uploaded successfully");
      setFile(null);
      setCaption("");
      fetchImages();
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this image permanently?")) return;
    try {
      await api.delete(`/events/image/${id}`);
      toast.success("Image removed");
      fetchImages();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const startEdit = (img) => {
    setEditingId(img._id);
    setEditCaption(img.caption || "");
    setEditSlider(!!img.showInSlider);
    setEditGallery(!!img.showInGallery);
  };

  const saveEdit = async (id) => {
    try {
      const formData = new FormData();
      formData.append("caption", editCaption);
      formData.append("showInSlider", editSlider);
      formData.append("showInGallery", editGallery);
      if (editFile) formData.append("url", editFile);

      await api.put(`/events/image/${id}`, formData);
      toast.success("Changes saved");
      setEditingId(null);
      fetchImages();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Section title1="Gallery" tittle2="Management" />

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        {/* TOP NAV */}
        <div className="flex items-center justify-between mb-8 bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-white shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard/admin/events")}
              className="p-2 hover:bg-slate-100 rounded-2xl transition-colors text-slate-600"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                {event ? event.name : "Loading..."}
              </h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Media Manager</p>
            </div>
          </div>
          <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-tighter">
            {images.length} Assets Total
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* UPLOAD PANEL */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-6">
              <h3 className="text-sm font-black text-slate-800 uppercase mb-4 flex items-center gap-2">
                <Upload size={16} className="text-indigo-500" /> New Upload
              </h3>
              
              <div className="space-y-4">
                <div className="relative group cursor-pointer">
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${file ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 group-hover:border-indigo-400 bg-slate-50'}`}>
                    <ImageIcon className={`mx-auto mb-2 ${file ? 'text-emerald-500' : 'text-slate-400'}`} size={32} />
                    <p className="text-[10px] font-black uppercase text-slate-500">
                      {file ? file.name : "Click to select"}
                    </p>
                  </div>
                </div>

                <textarea
                  placeholder="Caption for this image..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full border border-slate-200 rounded-2xl p-3 text-sm focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all min-h-[100px]"
                />

                <div className="space-y-3 px-1">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600">Home Slider</span>
                    <input type="checkbox" checked={showInSlider} onChange={(e) => setShowInSlider(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600">Public Gallery</span>
                    <input type="checkbox" checked={showInGallery} onChange={(e) => setShowInGallery(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  </label>
                </div>

                <button
                  onClick={handleAdd}
                  className="w-full bg-indigo-600 text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
                >
                  Upload Asset
                </button>
              </div>
            </div>
          </div>

          {/* GALLERY GRID */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => <div key={i} className="aspect-square bg-white rounded-3xl animate-pulse border border-slate-100" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {images.map((img) => (
                  <div key={img._id} className="group relative bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img
                        src={`${backend_url}${img.url}`}
                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${editingId === img._id ? 'blur-sm grayscale' : ''}`}
                        alt={img.caption}
                      />
                      
                      {/* OVERLAY BADGES */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        {img.showInSlider && <div className="p-1.5 bg-white/90 backdrop-blur rounded-lg shadow-sm text-amber-500" title="In Slider"><Monitor size={14}/></div>}
                        {img.showInGallery && <div className="p-1.5 bg-white/90 backdrop-blur rounded-lg shadow-sm text-indigo-500" title="In Gallery"><Layout size={14}/></div>}
                      </div>

                      {/* EDIT MODE OVERLAY */}
                      {editingId === img._id && (
                        <div className="absolute inset-0 bg-indigo-900/40 backdrop-blur-[2px] p-4 flex flex-col justify-center gap-3">
                           <input type="file" onChange={(e) => setEditFile(e.target.files[0])} className="text-[10px] text-white font-bold" />
                           <textarea
                            value={editCaption}
                            onChange={(e) => setEditCaption(e.target.value)}
                            className="bg-white/20 border border-white/30 rounded-xl p-2 text-xs text-white placeholder-white/70 outline-none"
                            placeholder="Update caption..."
                          />
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      {editingId === img._id ? (
                        <div className="space-y-4">
                          <div className="flex gap-4">
                            <label className="flex-1 flex items-center justify-center gap-2 py-1.5 bg-slate-50 rounded-lg cursor-pointer">
                              <input type="checkbox" checked={editSlider} onChange={(e) => setEditSlider(e.target.checked)} />
                              <span className="text-[10px] font-black uppercase">Slider</span>
                            </label>
                            <label className="flex-1 flex items-center justify-center gap-2 py-1.5 bg-slate-50 rounded-lg cursor-pointer">
                              <input type="checkbox" checked={editGallery} onChange={(e) => setEditGallery(e.target.checked)} />
                              <span className="text-[10px] font-black uppercase">Gallery</span>
                            </label>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => saveEdit(img._id)} className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase transition-hover hover:bg-emerald-600"><Save size={14}/> Save</button>
                            <button onClick={() => setEditingId(null)} className="flex-1 py-2 bg-slate-100 text-slate-400 rounded-xl text-[10px] font-black uppercase hover:bg-slate-200">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <p className="text-xs font-bold text-slate-600 line-clamp-1 italic">
                            {img.caption || "Untilted Asset"}
                          </p>
                          <div className="flex gap-2 pt-2 border-t border-slate-50">
                            <button
                              onClick={() => startEdit(img)}
                              className="flex-1 flex items-center justify-center gap-2 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-100 transition-colors"
                            >
                              <Edit3 size={14} /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(img._id)}
                              className="flex-1 flex items-center justify-center gap-2 py-2 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase hover:bg-rose-100 transition-colors"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}