import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  UserPlus, User, Mail, Phone, 
  FileText, Lock, ArrowRight, Loader2, AlertCircle, CheckCircle2 
} from 'lucide-react';
import api from '../api/api';
import { toast } from 'react-toastify';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    password: '',
    retype_password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();

  const passwordsMatch = formData.password && formData.retype_password 
    ? formData.password === formData.retype_password 
    : null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.retype_password) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const { name, email, phone, description, password } = formData;
      const res = await api.post('/auth/register', { name, email, phone, description, password });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      toast.success('Account created successfully!');
      nav('/community');
      
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-600 text-white shadow-xl shadow-emerald-100 mb-4">
            <UserPlus size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100">
          <form onSubmit={submit} className="space-y-6">
            
            {/* ROW 1: Name & Email */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                  <input name="name" value={formData.name} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-200 transition-all text-sm font-semibold" placeholder="Full Name" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                  <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-200 transition-all text-sm font-semibold" placeholder="Email Address" required />
                </div>
              </div>
            </div>

            {/* ROW 2: Phone & Password (Phone joined with email category, Password starts new row) */}
            <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                  <input name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-200 transition-all text-sm font-semibold" placeholder="Phone" required />
                </div>
              </div>
              <div className="space-y-2">
                {/* Empty space or a secondary field if needed */}
              </div>
            </div>

            {/* ROW 3: Passwords */}
            <div className="grid md:grid-cols-2 gap-6 border-t border-slate-50 pt-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                  <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-200 transition-all text-sm font-semibold" placeholder="••••••••" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                  <input
                    name="retype_password"
                    type="password"
                    value={formData.retype_password}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-10 py-3.5 bg-slate-50 border rounded-2xl outline-none transition-all text-sm font-semibold ${
                      passwordsMatch === false ? 'border-rose-300' : passwordsMatch === true ? 'border-emerald-300' : 'border-slate-100'
                    }`}
                    placeholder="••••••••"
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {passwordsMatch === true && <CheckCircle2 size={16} className="text-emerald-500" />}
                    {passwordsMatch === false && <AlertCircle size={16} className="text-rose-500" />}
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 4: Brief Bio Textarea (Full Width) */}
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Brief Bio</label>
              <div className="relative group">
                <FileText className="absolute left-4 top-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-emerald-500/5 focus:bg-white focus:border-emerald-200 transition-all text-sm font-semibold resize-none"
                  placeholder="Tell us a little about yourself or your family background..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || passwordsMatch === false}
              className="w-full group flex items-center justify-center gap-3 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-100 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <>Create Account <ArrowRight size={16} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}