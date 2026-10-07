"use client";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Calendar, Briefcase, Search, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const API_BASE = "/api";

export default function Experience() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    company: "",
    role: "",
    location: "",
    period: "",
    logo: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/experience`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/admin";
        return;
      }

      const d = await res.json();
      if (d.success) setData(d.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load experience entries");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setForm((prev) => ({ ...prev, logo: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company || !form.role) {
      toast.error("Company and Role are required");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const url = editId ? `${API_BASE}/experience/${editId}` : `${API_BASE}/experience`;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const d = await res.json();

      if (d.success) {
        toast.success(editId ? "Experience updated!" : "Experience added!");
        fetchData();
        setOpen(false);
        setEditId(null);
        setForm({ company: "", role: "", location: "", period: "", logo: "" });
      } else {
        toast.error(d.message || "Failed to save");
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Error saving experience entry");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this experience entry?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/experience/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const d = await res.json();
      if (d.success) {
        toast.success("Experience entry deleted!");
        setData((prev) => prev.filter((item) => item._id !== id));
      } else {
        toast.error(d.message || "Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Error deleting entry");
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setForm({
      company: item.company || "",
      role: item.role || "",
      location: item.location || "",
      period: item.period || "",
      logo: item.logo || "",
    });
    setOpen(true);
  };

  const filteredData = data.filter(
    (item) =>
      item.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-indigo-500/20 shadow-xl backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Briefcase className="text-indigo-400" size={28} />
            Work Experience History ({data.length})
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage professional employment history, companies, and roles displayed on your About page
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search experience..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-48 md:w-64"
            />
          </div>

          <button
            onClick={() => {
              setEditId(null);
              setForm({ company: "", role: "", location: "", period: "", logo: "" });
              setOpen(true);
            }}
            className="bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-semibold px-4 py-2 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 text-sm transition-all"
          >
            <Plus size={18} /> Add Experience
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-indigo-500" size={40} />
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
          <Briefcase className="mx-auto text-slate-600 mb-3" size={48} />
          <h3 className="text-lg font-semibold text-slate-300">No Experience Entries Found</h3>
          <p className="text-slate-500 text-sm mt-1">Add work experience entries using the button above.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredData.map((item) => (
            <div
              key={item._id}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 flex justify-between gap-4 shadow-xl group"
            >
              <div className="flex items-start gap-4">
                {item.logo && (
                  <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center p-1 flex-shrink-0">
                    <img src={item.logo} alt={item.company} className="w-full h-full object-contain" />
                  </div>
                )}

                <div>
                  <h3 className="text-base font-bold text-slate-100">{item.company}</h3>
                  <p className="text-xs font-semibold text-indigo-400 mt-0.5">{item.role}</p>
                  {item.location && <p className="text-xs text-slate-400 mt-0.5">{item.location}</p>}
                  {item.period && (
                    <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                      <Calendar size={12} /> {item.period}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition"
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-white">
              {editId ? "Edit Experience" : "Add Experience"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  name="company"
                  required
                  value={form.company}
                  onChange={handleChange}
                  placeholder="e.g. Acme Tech Solutions"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Role / Position Title
                </label>
                <input
                  type="text"
                  name="role"
                  required
                  value={form.role}
                  onChange={handleChange}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Jaipur, India"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                    Period / Duration
                  </label>
                  <input
                    type="text"
                    name="period"
                    value={form.period}
                    onChange={handleChange}
                    placeholder="e.g. Jan 2022 - Present"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Upload Company Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/20 file:text-indigo-300 cursor-pointer"
                />
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
                  {saving ? <Loader2 className="animate-spin" size={16} /> : editId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}