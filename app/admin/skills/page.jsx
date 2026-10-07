"use client";
import React, { useEffect, useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import * as simpleIcons from "simple-icons";
import { Plus, Pencil, Trash2, Search, Star, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const API_BASE = "/api";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    name: "",
    icon: "",
    color: "#6c63ff",
  });

  const getIcon = (iconName) => {
    if (!iconName) return FaIcons.FaCode;
    return FaIcons[iconName] || SiIcons[iconName] || FaIcons.FaCode;
  };

  const detectFromLibrary = (name) => {
    if (!name) return {};
    const key = name.toLowerCase().replace(/\s+/g, "");
    const icon = Object.values(simpleIcons).find((i) => i.slug === key);

    if (icon) {
      return {
        icon: "Si" + icon.title.replace(/\s+/g, ""),
        color: "#" + icon.hex,
      };
    }
    return {};
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    const detected = detectFromLibrary(value);
    setForm({
      name: value,
      icon: detected.icon || form.icon,
      color: detected.color || form.color,
    });
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/skills`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/admin";
        return;
      }

      const data = await res.json();
      if (data.success) {
        setSkills(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching skills:", err);
      toast.error("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) {
      toast.error("Skill name is required");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const url = editId ? `${API_BASE}/skills/${editId}` : `${API_BASE}/skills`;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(editId ? "Skill updated!" : "Skill created!");
        fetchSkills();
        setOpen(false);
        setForm({ name: "", icon: "", color: "#6c63ff" });
        setEditId(null);
      } else {
        toast.error(data.message || "Operation failed");
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Error saving skill");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/skills/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Skill deleted successfully");
        setSkills((prev) => prev.filter((s) => s._id !== id));
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Error deleting skill");
    }
  };

  const handleEdit = (skill) => {
    setEditId(skill._id);
    setForm({
      name: skill.name,
      icon: skill.icon,
      color: skill.color || "#6c63ff",
    });
    setOpen(true);
  };

  const filteredSkills = skills.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-indigo-500/20 shadow-xl backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Star className="text-indigo-400" size={28} />
            Skills & Technical Stack ({skills.length})
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage technical skills, icon representations, and hex colors displayed across your portfolio
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-48 md:w-64"
            />
          </div>

          <button
            onClick={() => {
              setEditId(null);
              setForm({ name: "", icon: "", color: "#6c63ff" });
              setOpen(true);
            }}
            className="bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-semibold px-4 py-2 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 text-sm transition-all"
          >
            <Plus size={18} /> Add Skill
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-indigo-500" size={40} />
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
          <Star className="mx-auto text-slate-600 mb-3" size={48} />
          <h3 className="text-lg font-semibold text-slate-300">No Skills Found</h3>
          <p className="text-slate-500 text-sm mt-1">Add your technical skills using the button above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredSkills.map((skill) => {
            const IconComponent = getIcon(skill.icon);

            return (
              <div
                key={skill._id}
                className="group p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 flex flex-col items-center text-center justify-between shadow-xl relative"
              >
                <div className="w-full flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="p-1.5 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition"
                    title="Edit"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(skill._id)}
                    className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div
                  className="text-4xl my-2 transition-transform group-hover:scale-110"
                  style={{ color: skill.color || "#6c63ff" }}
                >
                  <IconComponent />
                </div>

                <h3 className="text-sm font-bold text-slate-100 truncate w-full mt-2">
                  {skill.name}
                </h3>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-white">
              {editId ? "Edit Skill" : "Add New Skill"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Skill Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={handleNameChange}
                  placeholder="e.g. React.js, Python, Docker"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Icon Identifier (React-Icons / Simple-Icons)
                </label>
                <input
                  type="text"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  placeholder="e.g. FaReact, SiPython"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Brand Color (Hex Code)
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={form.color || "#6c63ff"}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-12 h-10 rounded-xl border border-slate-700 bg-slate-950 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    placeholder="#6c63ff"
                    className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition flex items-center gap-2 shadow-lg shadow-indigo-600/30"
                >
                  {saving ? <Loader2 className="animate-spin" size={16} /> : editId ? "Update Skill" : "Create Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}