// src/pages/dashboard/AddFamilyWizard.jsx
import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

/*
  Features:
  - 5-step wizard
  - animated progress bar
  - step validation (won't advance if invalid)
  - save draft to localStorage / load draft on mount
  - auto age calculation from birthDate
  - relation suggestions based on gender (click to apply)
  - when adding a member, shows selected family name (auto-fill/friendly)
*/

const DRAFT_KEY = "addFamilyWizardDraft_v1";

export default function AddFamilyWizard() {
  const navigate = useNavigate();

  // wizard step
  const [step, setStep] = useState(1);

  // global data
  const [villages, setVillages] = useState([]);
  const [families, setFamilies] = useState([]);

  // mode & selection
  const [mode, setMode] = useState("new"); // 'new' | 'member'
  const [selectedVillage, setSelectedVillage] = useState("");
  const [selectedFamilyId, setSelectedFamilyId] = useState("");

  // form fields
  const [form, setForm] = useState({
    name: "",
    gender: "Male",
    relation: "Head",
    birthDate: "",
    marital_status: "",
    blood_group: "",
    mobile: "",
    email: "",
    residence_address: "",
    education: "",
    profession: "",
    profession_type: "",
    profession_address: "",
    remarks: "",
    publish: true,
    image: null, // File
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role || null;

  // load villages on mount and load draft
  useEffect(() => {
    loadVillages();
  }, []);

  // when selectedVillage changes and mode is member -> load families
  useEffect(() => {
    if (mode === "member" && selectedVillage) {
      api.get(`/family?village=${encodeURIComponent(selectedVillage)}`)
        .then((res) => setFamilies(res.data.data || []))
        .catch((err) => {
          console.error("fetch families failed", err);
          setFamilies([]);
        });
    } else {
      setFamilies([]);
      setSelectedFamilyId("");
    }
  }, [mode, selectedVillage]);

  // when user picks a family, optionally auto-set a visible "familyName" for display
  const selectedFamily = useMemo(
    () => families.find((f) => f._id === selectedFamilyId) || null,
    [families, selectedFamilyId]
  );

  // compute age from birthDate
  const age = useMemo(() => {
    if (!form.birthDate) return null;
    const b = new Date(form.birthDate);
    const now = new Date();
    let diff = now.getFullYear() - b.getFullYear();
    const m = now.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < b.getDate())) diff--;
    return diff;
  }, [form.birthDate]);

  // relation suggestions based on gender
  const relationSuggestions = useMemo(() => {
    if (form.gender === "Male") {
      return ["Head", "Son", "Father", "Husband", "Brother", "Other"];
    } else if (form.gender === "Female") {
      return ["Wife", "Daughter", "Mother", "Sister", "Other"];
    } else {
      return ["Child", "Parent", "Sibling", "Other"];
    }
  }, [form.gender]);

  // -------------------------
  // API helpers
  // -------------------------
  async function loadVillages() {
    try {
      const res = await api.get("/villages");
      setVillages(res.data.data || res.data || []);
    } catch (err) {
      console.error("loadVillages error", err);
      setVillages([]);
    }
  }


  // -------------------------
  // UI helpers & events
  // -------------------------
  const setField = (name, value) => {
    setForm((s) => ({ ...s, [name]: value }));
    if (name === "image" && value) {
      // preview
      try {
        setImagePreview(URL.createObjectURL(value));
      } catch (e) {
        setImagePreview(null);
      }
    }
  };

  // validation rules for each step
  const validateStep = (s = step) => {
    // return { ok: boolean, message: string|null }
    if (s === 1) {
      if (!selectedVillage) return { ok: false, message: "Please select a village." };
      if (mode === "member" && !selectedFamilyId)
        return { ok: false, message: "Please select a family to add member to." };
      return { ok: true };
    }
    if (s === 2) {
      if (!form.name || form.name.trim().length < 2)
        return { ok: false, message: "Please enter full name." };
      if (!form.gender) return { ok: false, message: "Select gender." };
      if (!form.birthDate) return { ok: false, message: "Enter birth date." };
      return { ok: true };
    }
    if (s === 3) {
      // contact
     // if (!form.mobile || form.mobile.trim().length < 6)
       // return { ok: false, message: "Please enter a valid mobile number." };
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        return { ok: false, message: "Please enter a valid email address." };
      return { ok: true };
    }
    if (s === 4) {
      // profession/education can be optional but keep at least one
     // if (!form.education && !form.profession) {
      //  return { ok: false, message: "Please enter education or profession." };
      //}
      return { ok: true };
    }
    if (s === 5) {
      // final review - nothing extra
      return { ok: true };
    }
    return { ok: true };
  };

  // go to next step with validation
  const goNext = () => {
    const v = validateStep(step);
    if (!v.ok) {
      alert(v.message);
      return;
    }
    setStep((s) => Math.min(5, s + 1));
  };

  const goPrev = () => setStep((s) => Math.max(1, s - 1));

  // submit handler (creates family head or member)
  const handleSubmit = async () => {
    const v = validateStep(5);
    if (!v.ok) {
      alert(v.message);
      return;
    }
    setLoading(true);
    try {
      // assemble FormData
      const fd = new FormData();
      Object.keys(form).forEach((k) => {
        if (form[k] !== null && form[k] !== undefined) {
          // file already in form.image
          fd.append(k, form[k]);
        }
      });
      fd.append("village", selectedVillage);

      if (mode === "member") {
        // add member to existing family
        await api.post(`/family/${selectedFamilyId}/members`, fd);
        // clear draft
        localStorage.removeItem(DRAFT_KEY);
        alert("Member added successfully");
      } else {
        // create new family (head)
        await api.post("/family", fd);
        localStorage.removeItem(DRAFT_KEY);
        alert("Family head added successfully");
      }
     if(role === 'admin')
        navigate("/dashboard/admin/family-list");
      else if(role === 'representative')
        navigate("/dashboard/representative/family-list");
    } catch (err) {
      console.error("submit error", err);
      alert(err?.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  // auto-fill: when mode === member and selectedFamily changes, show family name (we don't override member name)
  useEffect(() => {
    if (mode === "member" && selectedFamily) {
      // optional: if form.name is empty, prefill a suggested name placeholder
      if (!form.name) {
        setForm((s) => ({ ...s, name: "" })); // keep empty; we show family name in UI
      }
    }
  }, [selectedFamilyId]); // eslint-disable-line

  // relation suggestion click
  const applyRelationSuggestion = (r) => setField("relation", r);

  // small helper: progress percent
  const progressPercent = Math.round(((step - 1) / 4) * 100);

  // -------------------------
  // JSX for steps
  // -------------------------
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      {/* Header + progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Add Family (Wizard)</h1>
            <p className="text-sm text-slate-500">Guided step-by-step flow </p>
          </div>

          <div className="text-right">
            <div className="text-sm text-slate-600">Mode: <span className="font-semibold">{mode === "new" ? "New Family" : "Add Member"}</span></div>
            <div className="text-xs text-slate-500 mt-1">Village: <span className="font-medium">{selectedVillage || "—"}</span></div>
          </div>
        </div>

        {/* animated progress bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="h-2 bg-indigo-600 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between mt-2 text-xs text-slate-500">
          <div className={step >= 1 ? "text-indigo-600 font-semibold" : ""}>1. Village</div>
          <div className={step >= 2 ? "text-indigo-600 font-semibold" : ""}>2. Personal</div>
          <div className={step >= 3 ? "text-indigo-600 font-semibold" : ""}>3. Contact</div>
          <div className={step >= 4 ? "text-indigo-600 font-semibold" : ""}>4. Work</div>
          <div className={step >= 5 ? "text-indigo-600 font-semibold" : ""}>5. Review</div>
        </div>
      </div>

      {/* Step content */}
      <div className="space-y-6">
        {/* ---------- STEP 1: village & mode ---------- */}
        {step === 1 && (
          <div>
            <label className="block mb-2 font-semibold">Select Village</label>
            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
            >
              <option value="">-- choose village --</option>
              {villages.map((v) => (
                <option key={v._id} value={v.name}>
                  {v.name}
                </option>
              ))}
            </select>

            <div className="flex gap-6 items-center mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  checked={mode === "new"}
                  onChange={() => { setMode("new"); setSelectedFamilyId(""); }}
                />
                <span className="font-medium">Add Family Head</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  checked={mode === "member"}
                  onChange={() => setMode("member")}
                />
                <span className="font-medium">Add Member</span>
              </label>
            </div>

            {mode === "member" && (
              <div>
                <label className="block mb-2 font-semibold">Choose Family</label>
                <select
                  value={selectedFamilyId}
                  onChange={(e) => setSelectedFamilyId(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">-- select family --</option>
                  {families.map((f) => (
                    <option key={f._id} value={f._id}>
                      {f.name} • {f.village}
                    </option>
                  ))}
                </select>

                {selectedFamily && (
                  <div className="mt-3 text-sm text-slate-600 bg-slate-50 p-3 rounded">
                    <div className="font-semibold">Adding to family:</div>
                    <div>{selectedFamily.name}</div>
                    <div className="text-xs text-slate-500">{selectedFamily.village}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ---------- STEP 2: personal ---------- */}
        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold">Full Name</label>
              <input
                value={form.name}
                onChange={(e) => setFieldValue("name", e.target.value)}
                className="w-full p-3 border rounded"
                placeholder="Full name"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => { setFieldValue("gender", e.target.value); /* reset relation if mismatch */ setFieldValue("relation", ""); }}
                className="w-full p-3 border rounded"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-semibold">Relation</label>
              <div className="flex items-center gap-2">
                <input
                  value={form.relation}
                  onChange={(e) => setFieldValue("relation", e.target.value)}
                  className="w-full p-3 border rounded"
                  placeholder="Relation (e.g. Head, Son)"
                />
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                {relationSuggestions.slice(0, 6).map((r) => (
                  <button
                    type="button"
                    onClick={() => applyRelationSuggestion(r)}
                    key={r}
                    className="text-xs px-3 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 border text-slate-700"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-1 font-semibold">Birth Date</label>
              <input
                type="date"
                value={form.birthDate}
                onChange={(e) => setFieldValue("birthDate", e.target.value)}
                className="w-full p-3 border rounded"
              />
              <div className="text-sm text-slate-500 mt-1">
                {age !== null ? `Age: ${age} yrs` : "Age will show after selecting birth date"}
              </div>
            </div>

            <div>
              <label className="block mb-1 font-semibold">Marital Status</label>
              <select
                value={form.marital_status}
                onChange={(e) => setFieldValue("marital_status", e.target.value)}
                className="w-full p-3 border rounded"
              >
                <option value="">Select</option>
                <option>Married</option>
                <option>UnMarried</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-semibold">Blood Group</label>
              <input
                value={form.blood_group}
                onChange={(e) => setFieldValue("blood_group", e.target.value)}
                className="w-full p-3 border rounded"
                placeholder="e.g. A+, O-"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 font-semibold">Upload Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  setFieldValue("image", f || null);
                }}
                className="w-full p-2 border rounded"
              />
              {imagePreview && <img src={imagePreview} alt="preview" className="w-28 h-28 mt-3 rounded-full object-cover border" />}
            </div>
          </div>
        )}

        {/* ---------- STEP 3: contact ---------- */}
        {step === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold">Mobile</label>
              <input
                value={form.mobile}
                onChange={(e) => setFieldValue("mobile", e.target.value)}
                className="w-full p-3 border rounded"
                placeholder="+91 98xxxxxxx"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Email</label>
              <input
                value={form.email}
                onChange={(e) => setFieldValue("email", e.target.value)}
                className="w-full p-3 border rounded"
                placeholder="email@example.com"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 font-semibold">Residence Address</label>
              <input
                value={form.residence_address}
                onChange={(e) => setFieldValue("residence_address", e.target.value)}
                className="w-full p-3 border rounded"
                placeholder="Full residential address"
              />
            </div>
          </div>
        )}

        {/* ---------- STEP 4: profession ---------- */}
        {step === 4 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold">Education</label>
              <input value={form.education} onChange={(e) => setFieldValue("education", e.target.value)} className="w-full p-3 border rounded" />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Profession</label>
              <input value={form.profession} onChange={(e) => setFieldValue("profession", e.target.value)} className="w-full p-3 border rounded" />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Profession Type</label>
              <input value={form.profession_type} onChange={(e) => setFieldValue("profession_type", e.target.value)} className="w-full p-3 border rounded" />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Profession Address</label>
              <input value={form.profession_address} onChange={(e) => setFieldValue("profession_address", e.target.value)} className="w-full p-3 border rounded" />
            </div>

            <div className="md:col-span-2">
              <label className="block mb-1 font-semibold">Remarks</label>
              <textarea value={form.remarks} onChange={(e) => setFieldValue("remarks", e.target.value)} className="w-full p-3 border rounded" rows={3} />
            </div>
          </div>
        )}

        {/* ---------- STEP 5: Review ---------- */}
{step === 5 && (
  <div>
    <h3 className="text-lg font-semibold mb-3">Review & Submit</h3>

    <div className="bg-slate-50 p-4 rounded-lg">

      {/* GRID: Two Columns on Larger Screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* ------ Personal Details ------ */}
        <div>
          <h4 className="font-semibold mb-2 border-b pb-1">Personal Details</h4>
          <div><strong>Name:</strong> {form.name}</div>
          <div><strong>Gender:</strong> {form.gender}</div>
          <div><strong>Relation:</strong> {form.relation}</div>
          <div><strong>Birth Date:</strong> {form.birthDate}</div>
          <div><strong>Age:</strong> {age ?? "—"}</div>
          <div><strong>Marital Status:</strong> {form.marital_status}</div>
          <div><strong>Blood Group:</strong> {form.blood_group}</div>
        </div>

        {/* ------ Contact Details ------ */}
        <div>
          <h4 className="font-semibold mb-2 border-b pb-1">Contact Details</h4>
          <div><strong>Mobile:</strong> {form.mobile}</div>
          <div><strong>Email:</strong> {form.email}</div>
        </div>

        {/* ------ Address Details ------ */}
        <div>
          <h4 className="font-semibold mb-2 border-b pb-1">Address</h4>
          <div><strong>Village:</strong> {selectedVillage}</div>
          <div><strong>Profession Address:</strong> {form.profession_address}</div>
          <div><strong>Residence Address:</strong> {form.residence_address}</div>
        </div>

        {/* ------ Education & Profession ------ */}
        <div>
          <h4 className="font-semibold mb-2 border-b pb-1">Education & Profession</h4>
          <div><strong>Education:</strong> {form.education}</div>
          <div><strong>Profession:</strong> {form.profession}</div>
          <div><strong>Profession Type:</strong> {form.profession_type}</div>
        </div>

        {/* ------ Image Preview ------ */}
        <div>
          <h4 className="font-semibold mb-2 border-b pb-1">Uploaded Photo</h4>
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="preview"
              className="w-28 h-28 rounded-full object-cover border shadow"
            />
          ) : (
            <span className="text-slate-500">No image uploaded</span>
          )}
        </div>

        {/* ------ Family Details (Only for member mode) ------ */}
        {mode === "member" && selectedFamily && (
          <div>
            <h4 className="font-semibold mb-2 border-b pb-1">Family Details</h4>
            <div>
              <strong>Family:</strong> {selectedFamily.name} ({selectedFamily.village})
            </div>
          </div>
        )}

        {/* ------ Remarks ------ */}
        <div className="md:col-span-2">
          <h4 className="font-semibold mb-2 border-b pb-1">Remarks</h4>
          <div>{form.remarks || "—"}</div>
        </div>

      </div>

    </div>
  </div>
)}
      </div>

      {/* Footer actions */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex gap-2 items-center">
          {/* <button
            type="button"
            onClick={() => { saveDraft(); }}
            disabled={savingDraft}
            className="px-4 py-2 bg-amber-100 text-amber-800 rounded hover:bg-amber-200"
          >
            {savingDraft ? "Saving..." : "Save Draft"}
          </button>

          <button
            type="button"
            onClick={() => { clearDraft(); }}
            className="px-3 py-2 border rounded hover:bg-gray-50 text-sm"
          >
            Clear Draft
          </button> */}
        </div>

        <div className="flex items-center gap-3">
          {step > 1 && (
            <button onClick={goPrev} className="px-4 py-2 border rounded hover:bg-gray-50">
              ← Back
            </button>
          )}

          {step < 5 ? (
            <button onClick={goNext} className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
              Next →
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              {loading ? "Saving..." : mode === "new" ? "Create Family" : "Add Member"}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // helpers inside component
  function setFieldValue(name, value) {
    setForm((s) => ({ ...s, [name]: value }));
    if (name === "image" && value) {
      try {
        setImagePreview(URL.createObjectURL(value));
      } catch (e) {
        setImagePreview(null);
      }
    }
  }

 
}
