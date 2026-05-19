import React, { useEffect, useState, useRef } from "react";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import * as simpleIcons from "simple-icons";
import { Plus, Pencil, Trash2 } from "lucide-react";

const API_BASE = "http://localhost:5000/api";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    icon: "",
    color: "",
  });

  const token = localStorage.getItem("token");
  const fetched = useRef(false);

  // 🔥 icon mapper
  const getIcon = (iconName) => {
    return FaIcons[iconName] || SiIcons[iconName] || null;
  };

  // 🔥 Detect icon + color
  const detectFromLibrary = (name) => {
    if (!name) return {};

    const key = name.toLowerCase().replace(/\s+/g, "");

    const icon = Object.values(simpleIcons).find(
      (i) => i.slug === key
    );

    if (icon) {
      return {
        icon: "Si" + icon.title.replace(/\s+/g, ""),
        color: "#" + icon.hex,
      };
    }

    return {};
  };

  // ✅ Input handlers
  const handleNameChange = (e) => {
    const value = e.target.value;

    const detected = detectFromLibrary(value);

    setForm({
      name: value,
      icon: detected.icon || form.icon,
      color: detected.color || form.color,
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 Fetch skills
  const fetchSkills = async () => {
    try {
      const res = await fetch(`${API_BASE}/skills`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setSkills(data.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Add / Update Skill
  const handleAddSkill = async () => {
    if (!form.name) return alert("Skill name required");

    try {
      const url = editId
        ? `${API_BASE}/skills/${editId}`
        : `${API_BASE}/skills`;

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
        setOpen(false);
        setEditId(null);
        setForm({ name: "", icon: "", color: "" });
        fetchSkills();
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // 🔥 Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this skill?")) return;

    try {
      const res = await fetch(`${API_BASE}/skills/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        fetchSkills();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // 🔥 Edit
  const handleEdit = (skill) => {
    setForm({
      name: skill.name,
      icon: skill.icon,
      color: skill.color,
    });

    setEditId(skill._id);
    setOpen(true);
  };

  // ✅ Call once
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;

    fetchSkills();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-400">Loading...</p>;
  }

  return (
    <div className="pt-2 pb-0">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-left mb-16 relative">
          <h1 className="text-5xl font-black text-white-200 mb-4">
            Skills
          </h1>

          <button
            onClick={() => {
              setOpen(true);
              setEditId(null);
              setForm({ name: "", icon: "", color: "" });
            }}
            className="absolute right-0 top-0 flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300 transition"
          >
            <Plus size={16} /> Add Skill
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {skills.map((skill) => {
            const Icon = getIcon(skill.icon);

            return (
              <div
                key={skill._id}
                className="group p-6 rounded-xl text-center relative"
                style={{
                  backgroundColor: "#111",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {/* Actions */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => handleEdit(skill)}>
                    <Pencil size={16} className="text-yellow-400" />
                  </button>

                  <button onClick={() => handleDelete(skill._id)}>
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>

                <div
                  className="text-4xl mb-4 flex justify-center"
                  style={{ color: skill.color }}
                >
                  {Icon && <Icon />}
                </div>

                <h3 className="text-sm text-gray-300">
                  {skill.name}
                </h3>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#6c63ff82] p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-white">
              {editId ? "Edit Skill" : "Add Skill"}
            </h2>

            <input
              name="name"
              placeholder="Skill Name"
              value={form.name}
              onChange={handleNameChange}
              className="w-full mb-3 p-2 bg-black text-white border border-gray-700"
            />

            <input
              name="icon"
              placeholder="Icon"
              value={form.icon}
              onChange={handleChange}
              className="w-full mb-3 p-2 bg-black text-white border border-gray-700"
            />

            <input
              name="color"
              placeholder="Color"
              value={form.color}
              onChange={handleChange}
              className="w-full mb-4 p-2 bg-black text-white border border-gray-700"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAddSkill}
                className="px-4 py-2 bg-yellow-400 text-black rounded"
              >
                {editId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}