import React, { useEffect, useState } from "react";
import {
  BarChart, Bar,
  PieChart, Pie,
  LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  ResponsiveContainer,
} from "recharts";

import api from "../../api/api";
import { Link } from "react-router-dom";
import { Section } from "../../components/Section";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    families: 0,
    villages: 0,
    // events: 0,
    // ads: 0,
    users: 0,
  });

  const [genderData, setGenderData] = useState([]);
  const [villageData, setVillageData] = useState([]);
  const [maritalAgeData, setMaritalAgeData] = useState([]);

  const [logs, setLogs] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [newMembers, setNewMembers] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // ---------- 1️⃣ Statistics ----------
        const [f, v, u] = await Promise.all([
          api.get("/family/count"),
          api.get("/villages/count"),
          api.get("/users/count"),
        ]);

        setStats({
          families: f.data.familyCount || 0,
          memebers: f.data.memberCount || 0,
          villages: v.data.count || 0,
          users: u.data.count || 0,
        });

        // ---------- 2️⃣ Gender Stats ----------
        const genderRes = await api.get("/family/stats/gender");
        setGenderData([
          { name: "Male", value: genderRes.data.male || 0 },
          { name: "Female", value: genderRes.data.female || 0 },
          { name: "Other", value: genderRes.data.other || 0 },
        ]);

        // ---------- 3️⃣ Village-wise ----------
        const villageRes = await api.get("/family/stats/village");
        // Expected: [ { village: "A", users: 10 }, ... ]
        setVillageData(villageRes.data || []);

        // ---------- 4️⃣ Marital + Age ----------
        const maritalRes = await api.get("/family/stats/marital-age");
        // Expected: [ { group: "0-18", married: 0, unmarried: 20 }, ... ]
        setMaritalAgeData(maritalRes.data || []);

        

      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <>
     <Section title1="Admin" tittle2="Dashboard"/>
      {/* HEADER 
      <h1 className="text-3xl font-bold text-slate-800 mb-2">
        Admin Dashboard 111
      </h1>
      <p className="text-slate-500 mb-8">
        Analytics & insights for your community portal
      </p>*/}
  <p className="text-slate-500 mb-8"></p>
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        <StatCard label="Families" value={stats.families} icon="👨‍👩‍👧" />
         <StatCard label="Members" value={stats.memebers} icon="👨‍👩‍👧" />
        <StatCard label="Villages" value={stats.villages} icon="🏡" />
        <StatCard label="Users" value={stats.users} icon="👥" />
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">

        {/* Gender Pie Chart */}
        <ChartCard title="Gender Distribution">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={genderData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                fill="#6366f1"
                label
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

       

        {/* Marital Status & Age Groups */}
        <ChartCard title="Marital Status & Age Groups">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={maritalAgeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="group" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="married" stroke="#6366f1" strokeWidth={2} />
              <Line type="monotone" dataKey="unmarried" stroke="#f43f5e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>
      <div className="grid grid-cols-1 xl:grid-cols-1 gap-8 mb-10">
      {/* Village-wise Users Bar Chart */}
        <ChartCard title="Village Wise Users">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={villageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="village" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      {/* WIDGETS */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <Widget title="Recent Activity / Logs">
          <ul className="space-y-3">
            {logs.map((log, i) => (
              <li key={i} className="text-sm border-b pb-2">
                <span className="font-semibold">{log.action}</span>
                <br />
                <span className="text-slate-500 text-xs">{log.timestamp}</span>
              </li>
            ))}
          </ul>
        </Widget>

        <Widget title="Latest Event Submissions">
          {recentEvents.map((e) => (
            <Link
              key={e._id}
              to={`/events/${e._id}`}
              className="block p-2 border-b hover:bg-slate-50 text-sm"
            >
              {e.name}
            </Link>
          ))}
        </Widget>

        <Widget title="New Members">
          {newMembers.map((m) => (
            <div key={m._id} className="p-2 border-b text-sm">
              {m.name} — {m.village}
            </div>
          ))}
        </Widget>

      </div> */}
    </>
  );
};

/* COMPONENTS -------------------------------------------------- */

const StatCard = ({ label, value, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4 hover:shadow-md transition">
    <div className="h-14 w-14 bg-indigo-500 text-white rounded-lg flex items-center justify-center text-2xl shadow">
      {icon}
    </div>
    <div>
      <p className="text-slate-500 text-sm">{label}</p>
      <h3 className="text-2xl font-bold">{value}</h3>
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow p-6">
    <h3 className="text-lg font-semibold mb-3">{title}</h3>
    {children}
  </div>
);

const Widget = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

export default AdminDashboard;
