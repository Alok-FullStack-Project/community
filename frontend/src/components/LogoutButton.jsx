import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const LogoutButton = ({ className = "" }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className={`
        group flex items-center justify-between w-full px-4 py-3.5 
        bg-white border border-slate-200 shadow-sm
        hover:bg-rose-50 hover:border-rose-100 hover:shadow-rose-100
        rounded-[1.25rem] transition-all duration-300 active:scale-[0.98]
        ${className}
      `}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-100 text-slate-500 group-hover:bg-rose-500 group-hover:text-white rounded-xl transition-all duration-300">
          <LogOut size={16} />
        </div>
        <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 group-hover:text-rose-700 transition-colors">
          End Session
        </span>
      </div>
      
      {/* Subtle arrow indicator that appears on hover */}
      <div className="opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all text-rose-400">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </div>
    </button>
  );
};

export default LogoutButton;