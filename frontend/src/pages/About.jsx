import React, { useEffect, useState } from "react";
import api from "../api/api";
import { format } from "date-fns";
import { Users, Target, Shield, Award, Linkedin, Mail, ArrowRight, MapPin } from "lucide-react";

const About = () => {
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const backend_url = import.meta.env.VITE_URL;

  // Static Team Data (You can also fetch this from an API)
  const team = [
  { 
    name: "XYZ Patel", 
    role: "President", 
    village: "Sathamba", 
    image: "/no_image.png" 
  },
  { 
    name: "XYZ Patel", 
    role: "Secretary", 
    village: "Sathamba", 
    image: "/no_image.png" 
  },
  { 
    name: "XYZ Patel", 
    role: "Treasurer", 
    village: "Sathamba", 
    image: "/no_image.png" 
  },
  { 
    name: "XYZ Patel", 
    role: "Community Lead", 
    village: "Sathamba", 
    image: "/no_image.png" 
  },
];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/events");
        setEvents(res.data.data || []);
      } catch (err) { console.error(err); } 
      finally { setLoadingEvents(false); }
    };
    fetchEvents();
  }, []);

  return (
    <div className="bg-white">
      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-32 pb-20 bg-slate-900 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[70%] bg-indigo-600 rounded-full blur-[120px]" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-4xl font-black text-white mb-6 leading-tight">
              Building a Stronger <span className="text-indigo-400">Community</span> Together.
            </h1>
           
          </div>
        </div>
      </section>

    

      {/* ================= TEAM SECTION ================= */}
      <section className="py-24 bg-slate-50 mt-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1 w-10 bg-indigo-600 rounded-full" />
                <span className="text-indigo-600 font-bold uppercase tracking-widest text-xs">The Leadership</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900">Meet Our Team</h2>
            </div>
            <p className="max-w-md text-slate-500 text-lg">
              The dedicated individuals working tirelessly to manage community affairs and events.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="group relative">
                <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-3 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2 border border-slate-100">
                  
                  {/* Image Container */}
                  <div className="relative h-72 w-full overflow-hidden rounded-[2rem] bg-slate-100">
                    <img 
                      src={member.image === "/no_image.png" ? "https://ui-avatars.com/api/?name=" + member.name + "&background=6366f1&color=fff" : member.image} 
                      alt={member.name}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110" 
                    />
                    
                    {/* Village Badge - Overlayed on image */}
                    <div className="absolute bottom-4 left-4">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-white/50">
                        <span className="text-indigo-600"><MapPin size={12} fill="currentColor" fillOpacity={0.2} /></span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">{member.village}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Text Content */}
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{member.name}</h3>
                    <p className="text-slate-500 font-medium text-sm mt-1 mb-3">{member.role}</p>
                    
                   
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      {/* <section className="py-20 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <Stat num="5000+" label="Members" />
            <Stat num="120+" label="Events Hosted" />
            <Stat num="50+" label="Businesses" />
            <Stat num="15+" label="Locations" />
        </div>
      </section> */}
    </div>
  );
};

/* Helper Components */
const ValueCard = ({ icon, title, desc }) => (
  <div className="p-10 rounded-[3rem] bg-white border border-slate-100 hover:border-indigo-100 transition-all duration-500 group">
    <div className="mb-6 p-4 bg-slate-50 w-fit rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-2xl font-bold text-slate-900 mb-4">{title}</h3>
    <p className="text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

const Stat = ({ num, label }) => (
  <div className="text-white">
    <div className="text-4xl md:text-5xl font-black mb-2">{num}</div>
    <div className="text-indigo-100 font-medium opacity-80 uppercase tracking-widest text-xs">{label}</div>
  </div>
);

export default About;