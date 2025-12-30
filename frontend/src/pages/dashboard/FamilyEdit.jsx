import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL + "/family";

export default function FamilyEdit() {
  const { familyId, memberId } = useParams();
  const navigate = useNavigate();

  // wizard step: 1–4 (no village step here)
  const [step, setStep] = useState(1);
  const [member, setMember] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role || null;
  

  // --------------------------------
  // LOAD MEMBER OR FAMILY HEAD
  // --------------------------------
  useEffect(() => {
    const load = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const res =
          memberId === "head"
            ? await axios.get(`${API_BASE}/${familyId}`, { headers })
            : await axios.get(`${API_BASE}/member/${memberId}`, { headers });

        const m = res.data;

        if (m.birthDate)
          m.birthDate = new Date(m.birthDate).toISOString().split("T")[0];

        setMember(m);

        if (m.image) setImagePreview(m.image);
      } catch (err) {
        console.error(err);
        alert("Failed to load member");
      }
    };
    load();
  }, [familyId, memberId]);

  // --------------------------------
  // UPDATE FORM FIELD
  // --------------------------------
  const setField = (key, value) => {
    setMember((prev) => ({ ...prev, [key]: value }));

    if (key === "image" && value instanceof File) {
      setImagePreview(URL.createObjectURL(value));
    }
  };

  // --------------------------------
  // AGE CALCULATION
  // --------------------------------
  const age = useMemo(() => {
    if (!member?.birthDate) return null;
    const b = new Date(member.birthDate);
    const now = new Date();
    let a = now.getFullYear() - b.getFullYear();
    if (
      now.getMonth() < b.getMonth() ||
      (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())
    )
      a--;
    return a;
  }, [member?.birthDate]);

  // --------------------------------
  // RELATION SUGGESTIONS
  // --------------------------------
  const relationSuggestions = useMemo(() => {
    if (!member?.gender) return [];

    if (member.gender === "Male") {
      return ["Head", "Father", "Son", "Husband", "Brother"];
    }
    if (member.gender === "Female") {
      return ["Wife", "Mother", "Daughter", "Sister"];
    }
    return ["Child", "Sibling", "Parent"];
  }, [member?.gender]);

  // --------------------------------
  // STEP VALIDATION
  // --------------------------------
  const validate = () => {
    if (step === 1) {
      if (!member.name || member.name.trim().length < 2)
        return "Enter a valid name.";
      if (!member.gender) return "Select gender.";
      if (!member.birthDate) return "Enter birth date.";
    }
    if (step === 2) {
      //if (!member.mobile || member.mobile.length < 6)
       // return "Enter valid mobile number.";
      if (member.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email))
        return "Invalid email format.";
    }
   /* if (step === 3) {
      if (!member.education && !member.profession)
        return "Enter education or profession.";
    }*/
    return null;
  };

  // --------------------------------
  // NAVIGATION
  // --------------------------------
  const next = () => {
    const err = validate();
    if (err) return alert(err);
    setStep((s) => Math.min(4, s + 1));
  };

  const prev = () => setStep((s) => Math.max(1, s - 1));
  
  const getFamilyListRoute = () => {
  if (role === "admin") return "/dashboard/admin/family-list";
  if (role === "representative") return "/dashboard/representative/family-list";
  return "/";
};

  // --------------------------------
  // SUBMIT
  // --------------------------------
  const handleSubmit = async () => {
    const err = validate();
    if (err) return alert(err);
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(member).forEach(([k, v]) => {
        //if (v !== undefined && v !== null) fd.append(k, v);
        if (v !== undefined && v !== null)
        {
          if (k === "members") 
          {
             //  fd.append("members", JSON.stringify(v)); // FIX
          } else {
            fd.append(k, v);
          }
        }
      });

      const headers = { Authorization: `Bearer ${token}` };
      if (memberId === "head") {
        await axios.put(`${API_BASE}/${familyId}`, fd, { headers });
          alert("Family updated successfully");
      } else {
        await axios.put(`${API_BASE}/member/${memberId}`, fd, { headers });
         alert("Member updated successfully");
      }
       navigate(getFamilyListRoute());
    } catch (err) {
      console.error(err);
      alert("Failed to update member");
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancel =() => {
	     navigate(getFamilyListRoute());
  }
  
  

  if (!member) return <div className="p-6 text-center">Loading...</div>;

  // --------------------------------
  // PROGRESS %
  // --------------------------------
  const progress = Math.round(((step - 1) / 3) * 100);

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-xl mt-6">
      {/* Title + progress */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">
          Edit {memberId === "head" ? "Family Head" : "Member"}
        </h1>

        {/* progress bar */}
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className="h-2 bg-indigo-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex justify-between mt-2 text-xs text-slate-500">
          <span className={step >= 1 ? "text-indigo-600 font-semibold" : ""}>
            Personal
          </span>
          <span className={step >= 2 ? "text-indigo-600 font-semibold" : ""}>
            Contact
          </span>
          <span className={step >= 3 ? "text-indigo-600 font-semibold" : ""}>
            Work
          </span>
          <span className={step >= 4 ? "text-indigo-600 font-semibold" : ""}>
            Review
          </span>
        </div>
      </div>

      {/* -------------------------------- */}
      {/* STEP 1 — PERSONAL INFO */}
      {/* -------------------------------- */}
      {step === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade">
          {/* Full Name */}
          <div>
            <label className="block mb-1 font-semibold">Full Name</label>
            <input
              value={member.name || ""}
              onChange={(e) => setField("name", e.target.value)}
              className="w-full p-3 border rounded"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block mb-1 font-semibold">Gender</label>
            <select
              value={member.gender || ""}
              onChange={(e) => {
                setField("gender", e.target.value);
                setField("relation", "");
              }}
              className="w-full p-3 border rounded"
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          {/* Relation */}
          <div>
            <label className="block mb-1 font-semibold">Relation</label>
            <input
              value={member.relation || ""}
              disabled={member.relation === "Head"}
              onChange={(e) => setField("relation", e.target.value)}
              className="w-full p-3 border rounded disabled:bg-slate-100"
              placeholder="Relation"
            />

            <div className="mt-2 flex flex-wrap gap-2">
              {relationSuggestions.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setField("relation", r)}
                  className="px-3 py-1 text-xs bg-slate-100 rounded-full border hover:bg-indigo-50"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Birthdate */}
          <div>
            <label className="block mb-1 font-semibold">Birth Date</label>
            <input
              type="date"
              value={member.birthDate || ""}
              onChange={(e) => setField("birthDate", e.target.value)}
              className="w-full p-3 border rounded"
            />
            {age !== null && (
              <p className="text-xs text-slate-500 mt-1">Age: {age} yrs</p>
            )}
          </div>

          {/* Marital */}
          <div>
            <label className="block mb-1 font-semibold">Marital Status</label>
            <select
              value={member.marital_status || ""}
              onChange={(e) => setField("marital_status", e.target.value)}
              className="w-full p-3 border rounded"
            >
              <option value="">Select</option>
              <option>Married</option>
              <option>UnMarried</option>
              <option>Other</option>
            </select>
          </div>

          {/* Blood group */}
          <div>
            <label className="block mb-1 font-semibold">Blood Group</label>
            <input
              value={member.blood_group || ""}
              onChange={(e) => setField("blood_group", e.target.value)}
              className="w-full p-3 border rounded"
            />
          </div>

          {/* Photo */}
          <div className="md:col-span-2">
            <label className="block mb-1 font-semibold">Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setField("image", e.target.files?.[0] || null)
              }
              className="p-2 border rounded w-full"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                className="w-28 h-28 mt-3 rounded-full object-cover border"
              />
            )}
          </div>
        </div>
      )}

      {/* -------------------------------- */}
      {/* STEP 2 — CONTACT */}
      {/* -------------------------------- */}
      {step === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade">
          <div>
            <label className="block font-semibold mb-1">Mobile</label>
            <input
              value={member.mobile || ""}
              onChange={(e) => setField("mobile", e.target.value)}
              className="w-full p-3 border rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              value={member.email || ""}
              onChange={(e) => setField("email", e.target.value)}
              className="w-full p-3 border rounded"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">Residence Address</label>
            <input
              value={member.residence_address || ""}
              onChange={(e) => setField("residence_address", e.target.value)}
              className="w-full p-3 border rounded"
            />
          </div>
        </div>
      )}

      {/* -------------------------------- */}
      {/* STEP 3 — WORK */}
      {/* -------------------------------- */}
      {step === 3 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade">
          <div>
            <label className="block font-semibold mb-1">Education</label>
            <input
              value={member.education || ""}
              onChange={(e) => setField("education", e.target.value)}
              className="w-full p-3 border rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Profession</label>
            <input
              value={member.profession || ""}
              onChange={(e) => setField("profession", e.target.value)}
              className="w-full p-3 border rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Profession Type</label>
            <input
              value={member.profession_type || ""}
              onChange={(e) => setField("profession_type", e.target.value)}
              className="w-full p-3 border rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Profession Address</label>
            <input
              value={member.profession_address || ""}
              onChange={(e) => setField("profession_address", e.target.value)}
              className="w-full p-3 border rounded"
            />
          </div>

          {/* remarks */}
          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">Remarks</label>
            <textarea
              value={member.remarks || ""}
              onChange={(e) => setField("remarks", e.target.value)}
              className="w-full p-3 border rounded"
              rows={3}
            ></textarea>
          </div>

          {/* publish */}
          <div className="md:col-span-2 flex items-center gap-2">
            <label>Publish:</label>
            <input
              type="checkbox"
              checked={member.publish || false}
              onChange={(e) => setField("publish", e.target.checked)}
            />
          </div>
        </div>
      )}

{/* -------------------------------- */}
{/* STEP 4 — REVIEW (SHOW ALL FIELDS) */}
{/* -------------------------------- */}
{step === 4 && (
  <div className="p-4 bg-slate-50 rounded animate-fade space-y-3">
    <h3 className="text-lg font-semibold mb-3">Review All Details</h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

      <div><strong>Name:</strong> {member.name || "—"}</div>
      <div><strong>Gender:</strong> {member.gender || "—"}</div>

      <div><strong>Relation:</strong> {member.relation || "—"}</div>
      <div><strong>Age:</strong> {age ?? "—"}</div>

      <div><strong>Birth Date:</strong> {member.birthDate || "—"}</div>
      <div><strong>Marital Status:</strong> {member.marital_status || "—"}</div>

      <div><strong>Blood Group:</strong> {member.blood_group || "—"}</div>

      {/* CONTACT */}
      <div><strong>Mobile:</strong> {member.mobile || "—"}</div>
      <div><strong>Email:</strong> {member.email || "—"}</div>

      <div className="md:col-span-2">
        <strong>Residence Address:</strong> {member.residence_address || "—"}
      </div>

      {/* WORK */}
      <div><strong>Education:</strong> {member.education || "—"}</div>
      <div><strong>Profession:</strong> {member.profession || "—"}</div>

      <div><strong>Profession Type:</strong> {member.profession_type || "—"}</div>

      <div><strong>Profession Address:</strong> {member.profession_address || "—"}</div>

      {/* OTHER */}
      <div className="md:col-span-2">
        <strong>Remarks:</strong> {member.remarks || "—"}
      </div>

      <div>
        <strong>Publish:</strong>{" "}
        {member.publish ? "Yes" : "No"}
      </div>

      <div className="md:col-span-2">
        <strong>Photo:</strong><br />
        {imagePreview ? (
          <img
            src={imagePreview}
            className="w-28 h-28 mt-2 rounded-full object-cover border"
          />
        ) : (
          "No Image"
        )}
      </div>

    </div>
  </div>
)}

      {/* -------------------------------- */}
      {/* BUTTONS */}
      {/* -------------------------------- */}
      <div className="flex justify-end mt-6">
	   <div className="flex gap-3">
		<button
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick= {handleCancel}
          >
           Cancel
        </button>
  
        {step > 1 ? (
          <button
            className="px-4 py-2 border rounded hover:bg-slate-50"
            onClick={prev}
          >
            ← Back
          </button>
        ) : (
          <span></span>
        )}
		
        {step < 4 ? (
          <button
            className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            onClick={next}
          >
            Next →
          </button>
        ) : (
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        )
		}
		 </div>
      </div>
    </div>
  );
}

// Fade animation
// Add this to your global CSS:
// .animate-fade { animation: fadeIn .3s ease; }
// @keyframes fadeIn { from { opacity:0; transform:translateY(5px);} to {opacity:1; transform:translateY(0);} }
