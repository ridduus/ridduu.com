import { useState, useEffect } from "react";
import { ExternalLink, Calendar, Plus, Pencil, Trash2 } from "lucide-react";
import AB from "../../public/Ab1.png";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState({});

  const TOKEN = localStorage.getItem("token");

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

  const [preview, setPreview] = useState(AB);

  // ✅ FETCH
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      if (data.success) setProjects(data.data);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to load projects");
    } finally {
      setFetching(false);
    }
  };

  // ✅ INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ COMPRESS IMAGE 🔥 (FIX LARGE PAYLOAD)
  // const compressImage = (file) => {
  //   return new Promise((resolve) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);

  //     reader.onload = (event) => {
  //       const img = new Image();
  //       img.src = event.target.result;

  //       img.onload = () => {
  //         const canvas = document.createElement("canvas");
  //         const MAX_WIDTH = 300;

  //         const scale = MAX_WIDTH / img.width;
  //         canvas.width = MAX_WIDTH;
  //         canvas.height = img.height * scale;

  //         const ctx = canvas.getContext("2d");
  //         ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  //         resolve(canvas.toDataURL("image/jpeg", 0.7)); // 🔥 compression
  //       };
  //     };
  //   });
  // };

  // 🖼 UPLOAD
  const handlelogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Allow all image types
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");

        const MAX_WIDTH = 200; // 🔥 control size
        const scale = Math.min(MAX_WIDTH / img.width, 1);

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");

        // ✅ clear to preserve transparency (for PNG)
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        let output;

        // 🎯 Smart format selection
        if (file.type === "image/png") {
          // ✅ keep PNG transparency
          output = canvas.toDataURL("image/png");
        } else {
          // ✅ compress JPG/WebP
          output = canvas.toDataURL("image/jpeg", 0.7);
        }

        // 🚨 payload protection
        if (output.length > 400000) {
          alert("Image too large, please choose smaller image");
          return;
        }

        setForm((prev) => ({
          ...prev,
          logo: output,
        }));

        setPreview(output);
      };
    };

    reader.readAsDataURL(file);
  };

  // ✅ SUBMIT
  const handleSubmit = async () => {
    let newErrors = {};

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.key.trim()) newErrors.key = "Key is required";
    // if (!form.url.trim()) newErrors.url = "URL is required";
    // else if (!form.url.includes("http")) newErrors.url = "Enter valid URL";

    if (!form.year) newErrors.year = "Year is required";
    if (!form.desc || form.desc.length < 10)
      newErrors.desc = "Minimum 10 characters required";

    if (!form.tags.trim()) newErrors.tags = "Tags required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({}); // clear errors

    try {
      setLoading(true);

      const payload = {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()),
      };

      if (!form.logo) delete payload.logo;

      const res = await fetch(
        editId ? `${API_BASE}/projects/${editId}` : `${API_BASE}/projects`,
        {
          method: editId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (data.success) {
        resetForm();
      } else {
        setErrors({ general: data.message || "Something went wrong" });
      }
    } catch {
      setErrors({ general: "Server error. Try again." });
    } finally {
      setLoading(false);
    }
  };

  // ❌ DELETE
  const handleDelete = async (id) => {
    if (!confirm("Delete this project?")) return;

    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${TOKEN}` },
      });

      if (!res.ok) throw new Error();

      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  // ✏️ EDIT
  const handleEdit = (proj) => {
    setForm({
      ...proj,
      tags: proj.tags?.join(", "),
      logo: "", // 🔥 prevent re-send large base64
    });
    setPreview(proj.logo || AB);
    setEditId(proj._id);
    setOpen(true);
  };

  // 🔄 RESET
  const resetForm = () => {
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
    setPreview(AB);
    setEditId(null);
    setOpen(false);
  };

  return (
    <div className="text-white px-6 max-w-6xl mx-auto">

      {/* HEADER */}
      <div className="my-10 flex items-center justify-between">
        <h2 className="text-4xl font-bold">My Projects</h2>

        <button
          onClick={() => setOpen(true)}
          className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center gap-2 hover:scale-105"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      {/* LIST */}
      {fetching ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj._id}
              className="group relative p-6 rounded-2xl backdrop-blur bg-white/5 border border-white/10 hover:border-white/20 transition hover:scale-[1.02]"
              style={{
                backgroundColor: "#ffff",
                border: `1px solid ${projects.color || "#6c63ff"}25`,
                color: "#111"
              }}
            >
              {/* ACTIONS */}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100">
                <Pencil size={16} onClick={() => handleEdit(proj)} className="text-blue-400 cursor-pointer" />
                <Trash2 size={16} onClick={() => handleDelete(proj._id)} className="text-red-400 cursor-pointer" />
              </div>

              {/* TOP */}
              <div className="flex justify-between items-center mb-4">
                <img
                  src={proj.logo}
                  className="w-28 h-18 object-contain rounded-lg p-0"
                  style={{
                    width: "80px",
                    height: "80px",
                  }}
                />
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar size={12} /> {proj.year}
                </span>
              </div>

              {/* CONTENT */}
              <h3 className="text-lg font-semibold mb-2">{proj.title}</h3>

              <p className="text-sm mb-4 line-clamp-3">
                {proj.desc}
              </p>

              {/* TAGS */}
              <div className="flex flex-wrap gap-2 mb-4">
                {proj.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* LINK */}
              <a
                href={proj.url}
                target="_blank"
                className="flex items-center gap-2 text-sm hover:gap-3 transition"
              >
                <ExternalLink size={14} />
                {proj.url ? proj.url : "Coming Soon"}
              </a>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur flex justify-center items-center z-50">

          <div className="w-full max-w-lg bg-[#0f172a] text-white rounded-2xl p-6 border border-white/10 shadow-xl">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {editId ? "Edit Project" : "Add Project"}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            {/* FORM */}
            <div className="space-y-4">

              {/* IMAGE UPLOAD */}
              <div className="flex items-center gap-4">
                <label className="relative cursor-pointer group">
                  <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden border border-white/20">
                    <img
                      src={preview}
                      className="w-full h-full object-contain"
                      alt="preview"
                    />
                  </div>

                  {/* Hover Camera */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition">
                    <span className="text-sm">📷</span>
                  </div>

                  <input type="file" hidden onChange={handlelogoUpload} />
                </label>

                <div>
                  <p className="text-sm font-medium">Upload Logo</p>
                  <p className="text-xs text-gray-400">
                    PNG / JPG / WEBP (max ~200KB)
                  </p>
                </div>
              </div>

              {/* INPUT FIELD COMPONENT */}
              {[
                { name: "title", placeholder: "Project Title" },
                { name: "key", placeholder: "Project Key" },
                { name: "url", placeholder: "Project URL" },
                { name: "year", placeholder: "Year" },
                { name: "tags", placeholder: "Tags (React, Node...)" },
              ].map((field) => (
                <div key={field.name}>
                  <input
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-indigo-500 outline-none transition"
                  />
                  {errors[field.name] && (
                    <p className="text-xs text-red-400 mt-1">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}

              {/* DESCRIPTION */}
              <div>
                <textarea
                  name="desc"
                  value={form.desc}
                  onChange={handleChange}
                  placeholder="Project Description"
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-indigo-500 outline-none transition"
                />
                {errors.desc && (
                  <p className="text-xs text-red-400 mt-1">{errors.desc}</p>
                )}
              </div>

            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={resetForm}
                className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 hover:scale-105 transition"
              >
                {loading ? "Saving..." : "Save Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}