"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Upload, Save, User as UserIcon, Loader2, MapPin, Mail, Phone, Briefcase, Plus, Trash2 } from "lucide-react";

import imageCompression from "browser-image-compression";
import toast from "react-hot-toast";

const API_BASE = "/api";

export default function AboutEditable() {
  const [profileImg, setProfileImg] = useState("");
  const [cv, setCv] = useState("");
  const [cvFileName, setCvFileName] = useState("");
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");

  const [stats, setStats] = useState([]);
  const [desc1, setDesc1] = useState("");
  const [desc2, setDesc2] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/profile`);
      if (res.data.success && res.data.profile) {
        const p = res.data.profile;
        setName(p.name || "");
        setDesignation(p.designation || "");
        setPhone(p.phone || "");
        setEmail(p.email || "");
        setLocation(p.location || "");
        setDesc1(p.desc1 || "");
        setDesc2(p.desc2 || "");
        setProfileImg(p.profileImg || "");
        setCv(p.cv || "");
        setStats(p.stats || []);
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 0.2,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImg(reader.result);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error compressing image:", error);
        toast.error("Error compressing image");
      }
    }
  };

  const handleCvChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 12 * 1024 * 1024) {
        toast.error("Resume file size should be less than 12MB");
        return;
      }
      setCvFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCv(reader.result);
        toast.success(`Selected resume: ${file.name}`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_BASE}/profile`,
        {
          name,
          designation,
          phone,
          email,
          location,
          desc1,
          desc2,
          profileImg,
          cv,
          stats,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        toast.success("Profile saved successfully!");
      } else {
        toast.error(res.data.message || "Failed to save profile");
      }
    } catch (err) {
      console.error("Save profile error:", err);
      const msg = err.response?.data?.message || "Error saving profile";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };


  const handleStatChange = (index, field, value) => {
    const newStats = [...stats];
    newStats[index][field] = value;
    setStats(newStats);
  };

  const addStat = () => {
    setStats([...stats, { value: "", label: "", sub: "" }]);
  };

  const removeStat = (index) => {
    setStats(stats.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-indigo-500/20 shadow-xl backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <UserIcon className="text-indigo-400" size={28} />
            About Section & Profile Management
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Update personal bio, designations, contact metadata, avatar image, and home page statistics
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save Profile
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Main Info */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-slate-100 pb-3 border-b border-slate-800">
            Personal & Professional Details
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ronak Sharma"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Designation / Role Title
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="Software Engineer || Full Stack Developer"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@ridduu.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Rajasthan, India"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bios */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-slate-100 pb-3 border-b border-slate-800">
            About Bio Paragraphs
          </h3>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Primary Bio (Paragraph 1)
            </label>
            <textarea
              rows={3}
              value={desc1}
              onChange={(e) => setDesc1(e.target.value)}
              placeholder="I am a Full Stack Developer specializing in..."
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
              Secondary Bio (Paragraph 2)
            </label>
            <textarea
              rows={3}
              value={desc2}
              onChange={(e) => setDesc2(e.target.value)}
              placeholder="Based in Rajasthan, India..."
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Key Statistics Highlights */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Key Statistics Highlights
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">
                Manage experience counters (e.g., 4+ Years Experience, 5+ Production Projects)
              </p>
            </div>
            <button
              type="button"
              onClick={addStat}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold hover:bg-indigo-600/30 transition flex items-center gap-1.5"
            >
              <Plus size={14} /> Add Stat
            </button>
          </div>

          <div className="space-y-3">
            {stats && stats.length > 0 ? (
              stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3.5 bg-slate-950 border border-slate-800 rounded-xl"
                >
                  <div className="sm:w-1/3">
                    <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                      Stat Value (e.g. 4+)
                    </label>
                    <input
                      type="text"
                      value={stat.value || ""}
                      onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                      placeholder="4+"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                      Stat Label (e.g. Years Experience)
                    </label>
                    <input
                      type="text"
                      value={stat.label || ""}
                      onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                      placeholder="Years Experience"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="sm:pt-5 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeStat(idx)}
                      className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition"
                      title="Remove Stat"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-xs italic py-2">
                No custom stats added yet. Click "Add Stat" to create one.
              </p>
            )}
          </div>
        </div>

        {/* Profile Image */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-slate-100 pb-3 border-b border-slate-800">
            Profile Avatar Image
          </h3>

          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center p-1">
              {profileImg ? (
                <img src={profileImg} alt="Profile Avatar" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <span className="text-slate-500 text-xs">No image</span>
              )}
            </div>

            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/20 file:text-indigo-300 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 mt-2">
                Images are automatically compressed below 200KB for instant loading.
              </p>
            </div>
          </div>
        </div>

        {/* Resume / CV Upload Document */}
        <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-slate-100">
              Resume / CV Document Upload
            </h3>
            {cv && (
              <a
                href={cv}
                download={cvFileName || "Ronak_Sharma_CV.pdf"}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline flex items-center gap-1"
                target="_blank"
                rel="noreferrer"
              >
                Preview Uploaded CV
              </a>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 font-bold text-xs">
              PDF
            </div>

            <div className="flex-1 w-full space-y-2">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleCvChange}
                className="w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">
                Upload your latest resume file (PDF/DOC). When saved, visitors will download this file from Navbar & About page.
              </p>
              {cvFileName && (
                <p className="text-xs text-emerald-400 font-medium">Selected file: {cvFileName}</p>
              )}
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}