"use client";
import { useState, useEffect } from "react";
import { ExternalLink, Calendar, Plus, Pencil, Trash2, Search, FolderKanban, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import AB from "@/public/Ab1.png";

const API_BASE = "/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    title: "",
    key: "",
    url: "",
    year: "",
    desc: "",
    tags: "",
    color: "#6c63ff",
    logo: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/admin";
        return;
      }

      const data = await res.json();
      if (data.success) setProjects(data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlelogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setForm((prev) => ({ ...prev, logo: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.desc) {
      toast.error("Title and Description are required");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const projectKey = form.key ? form.key.trim() : form.title.toLowerCase().replace(/[^a-z0-9]/g, "_");
      const formattedTags = Array.isArray(form.tags)
        ? form.tags
        : typeof form.tags === "string"
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

      const payload = {
        ...form,
        key: projectKey,
        tags: formattedTags,
      };

      const url = editId ? `${API_BASE}/projects/${editId}` : `${API_BASE}/projects`;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();


      if (data.success) {
        toast.success(editId ? "Project updated successfully!" : "Project created successfully!");
        fetchProjects();
        setOpen(false);
        setEditId(null);
        setForm({
          title: "",
          key: "",
          url: "",
          year: "",
          desc: "",
          tags: "",
          color: "#6c63ff",
          logo: "",
        });
      } else {
        toast.error(data.message || "Failed to save project");
      }
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Error saving project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Project deleted successfully!");
        setProjects((prev) => prev.filter((p) => p._id !== id));
      } else {
        toast.error(data.message || "Failed to delete project");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Error deleting project");
    }
  };

  const handleEdit = (project) => {
    setEditId(project._id);
    setForm({
      title: project.title || "",
      key: project.key || "",
      url: project.url || "",
      year: project.year || "",
      desc: project.desc || "",
      tags: typeof project.tags === "string" ? project.tags : (project.tags || []).join(", "),
      color: project.color || "#6c63ff",
      logo: project.logo || "",
    });
    setOpen(true);
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.desc?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-indigo-500/20 shadow-xl backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FolderKanban className="text-indigo-400" size={28} />
            Projects Showcase ({projects.length})
          </h1>
          <p className="text-slate-800 text-sm mt-1">
            Create, edit, and manage portfolio project showcases and client work
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-48 md:w-64"
            />
          </div>

          <button
            onClick={() => {
              setEditId(null);
              setForm({ title: "", key: "", url: "", year: "", desc: "", tags: "", color: "#6c63ff", logo: "" });
              setOpen(true);
            }}
            className="bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-semibold px-4 py-2 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 text-sm transition-all"
          >
            <Plus size={18} /> Add Project
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-indigo-500" size={40} />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
          <FolderKanban className="mx-auto text-slate-600 mb-3" size={48} />
          <h3 className="text-lg font-semibold text-slate-300">No Projects Found</h3>
          <p className="text-slate-500 text-sm mt-1">Add your portfolio projects using the button above.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => {
            const tagsArray = typeof p.tags === "string" ? p.tags.split(",").map(t => t.trim()) : (p.tags || []);

            return (
              <div
                key={p._id}
                className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl relative group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-16 w-28 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-2">
                      <img src={p.logo || AB} alt={p.title} className="max-h-full max-w-full object-contain" />
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition"
                        title="Edit Project"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                        title="Delete Project"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                    {p.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mt-2 line-clamp-3">
                    {p.desc}
                  </p>

                  {tagsArray.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {tagsArray.map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-5 pt-3 border-t border-slate-800 text-xs text-slate-500">
                  {p.year && (
                    <span className="flex items-center gap-1">
                      <Calendar size={13} /> {p.year}
                    </span>
                  )}

                  {p.url && (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-400 hover:underline flex items-center gap-1 ml-auto font-medium"
                    >
                      Visit <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white">
              {editId ? "Edit Project" : "Add New Project"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Apna Backup Software"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                    Project Key / ID
                  </label>
                  <input
                    type="text"
                    name="key"
                    value={form.key}
                    onChange={handleChange}
                    placeholder="e.g. apnaBackup"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                    Year / Period
                  </label>
                  <input
                    type="text"
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    placeholder="e.g. 2024"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Live Project URL
                </label>
                <input
                  type="url"
                  name="url"
                  value={form.url}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Description
                </label>
                <textarea
                  name="desc"
                  required
                  rows={3}
                  value={form.desc}
                  onChange={handleChange}
                  placeholder="Comprehensive description of the project features and tech stack..."
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Tech Tags (Comma Separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="React, Next.js, Node.js, MongoDB"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                  Upload Logo / Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlelogoUpload}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/20 file:text-indigo-300 hover:file:bg-indigo-500/30 cursor-pointer"
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
                  {saving ? <Loader2 className="animate-spin" size={16} /> : editId ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}