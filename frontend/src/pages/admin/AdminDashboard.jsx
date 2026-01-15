import React, { useEffect, useState } from "react";
import {
  BarChart, Bar,
  PieChart, Pie, Cell,
  LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  ResponsiveContainer,
} from "recharts"; 
import { 
  Users, Home, Map, UsersRound, 
  TrendingUp, Activity, PieChart as PieIcon 
} from "lucide-react";

import api from "../../api/api";
import { Section } from "../../components/Section";

const COLORS = ["#6366f1", "#10b981", "#f43f5e", "#f59e0b", "#8b5cf6"];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    families: 0,
    members: 0,
    villages: 0,
    users: 0,
  });

  const [genderData, setGenderData] = useState([]);
  const [villageData, setVillageData] = useState([]);
  const [maritalAgeData, setMaritalAgeData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [f, v, u] = await Promise.all([
          api.get("/family/count"),
          api.get("/villages/count"),
          api.get("/users/count"),
        ]);

        setStats({
          families: f.data.familyCount || 0,
          members: f.data.memberCount || 0,
          villages: v.data.count || 0,
          users: u.data.count || 0,
        });

        const genderRes = await api.get("/family/stats/gender");
        setGenderData([
          { name: "Male", value: genderRes.data.male || 0 },
          { name: "Female", value: genderRes.data.female || 0 },
          { name: "Other", value: genderRes.data.other || 0 },
        ]);

        const villageRes = await api.get("/family/stats/village");
        setVillageData(villageRes.data || []);

        const maritalRes = await api.get("/family/stats/marital-age");
        setMaritalAgeData(maritalRes.data || []);
        
        setLoading(false);
      } catch (err) {
        console.error("Dashboard load error:", err);
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Section title1="Community" tittle2="Insights" />
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
      {/* OVERVIEW HERO SECTION */}
      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          label="Total Families" 
          value={stats.families} 
          icon={<Home size={24} />} 
          // trend="+12% from last month"
          color="bg-indigo-500" 
        />
        <StatCard 
          label="Community Members" 
          value={stats.members} 
          icon={<UsersRound size={24} />} 
          // trend="+5% new growth"
          color="bg-emerald-500" 
        />
        <StatCard 
          label="Covered Villages" 
          value={stats.villages} 
          icon={<Map size={24} />} 
          // trend="Wide reach"
          color="bg-amber-500" 
        />
        <StatCard 
          label="System Users" 
          value={stats.users} 
          icon={<Users size={24} />} 
          // trend="Active sessions"
          color="bg-rose-500" 
        />
      </div>

      {/* TOP CHARTS: GENDER & MARITAL */}
      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ChartCard title="Gender Distribution" icon={<PieIcon size={18}/>}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Marital Status by Age Group" icon={<Activity size={18}/>}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={maritalAgeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="group" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip 
                 contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Legend iconType="circle" />
              <Line type="monotone" dataKey="married" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="unmarried" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* BOTTOM CHART: VILLAGE WISE */}
      <ChartCard title="Village Wise User Engagement" icon={<TrendingUp size={18}/>}>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={villageData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="village" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip 
               cursor={{fill: '#f8fafc'}}
               contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="users" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      </div>
    </div>
  );
};

/* MODERNIZED COMPONENTS */

const StatCard = ({ label, value, icon, color, trend }) => (
  <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</p>
        <h3 className="mt-1 text-3xl font-black text-slate-800">{value.toLocaleString()}</h3>
        <p className="mt-2 text-xs font-medium text-emerald-600 flex items-center gap-1">
           {trend}
        </p>
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color} text-white shadow-lg shadow-indigo-100`}>
        {icon}
      </div>
    </div>
    {/* Decorative background shape */}
    <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full" />
  </div>
);

const ChartCard = ({ title, icon, children }) => (
  <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
    <div className="mb-6 flex items-center gap-2">
      <div className="p-2 bg-slate-50 rounded-lg text-indigo-500">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h3>
    </div>
    {children}
  </div>
);

export default AdminDashboard;