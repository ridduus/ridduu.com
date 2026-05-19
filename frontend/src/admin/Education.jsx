import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Calendar } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export default function Education() {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    university: "",
    degree: "",
    location: "",
    period: "",
    logo: "",
  });

  const TOKEN = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await fetch(`${API_BASE}/education`);
    const d = await res.json();
    if (d.success) setData(d.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 300;

        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressed = canvas.toDataURL("image/jpeg", 0.7);

        setForm((prev) => ({
          ...prev,
          logo: compressed,
        }));
      };
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    const res = await fetch(
      editId ? `${API_BASE}/education/${editId}` : `${API_BASE}/education`,
      {
        method: editId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify(form),
      }
    );

    const d = await res.json();

    if (d.success) {
      fetchData();
      resetForm();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete?")) return;

    await fetch(`${API_BASE}/education/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${TOKEN}` },
    });

    fetchData();
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditId(item._id);
    setOpen(true);
  };

  const resetForm = () => {
    setForm({
      university: "",
      degree: "",
      location: "",
      period: "",
      logo: "",
    });
    setEditId(null);
    setOpen(false);
  };

  return (
    <div className="text-white px-6 max-w-6xl mx-auto">

      <div className="my-10 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Education</h1>
        <button onClick={() => setOpen(true)} className="px-4 py-2 bg-indigo-600 rounded flex items-center gap-2">
          <Plus size={16} /> Add
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {data.map((e) => (
          <div key={e._id} className="bg-gray-900 p-5 rounded-xl border border-gray-800 relative flex gap-4">

            <img src={e.logo || "https://via.placeholder.com/50"} className="w-12 h-12 rounded" />

            <div className="flex-1">
              <h2 className="font-semibold">{e.university}</h2>
              <p className="text-sm text-gray-400">{e.degree}</p>

              <div className="flex justify-between text-sm text-gray-400 mt-1">
                <span>{e.location}</span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> {e.period}
                </span>
              </div>
            </div>

            <div className="absolute top-3 right-3 flex gap-2">
              <Pencil onClick={() => handleEdit(e)} className="cursor-pointer text-yellow-400" size={16} />
              <Trash2 onClick={() => handleDelete(e._id)} className="cursor-pointer text-red-400" size={16} />
            </div>

          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
          <div className="bg-white text-black p-6 rounded-xl w-full max-w-md">

            <h2 className="font-bold mb-4">{editId ? "Edit" : "Add"} Education</h2>

            <div className="space-y-3">
              <input name="university" value={form.university} onChange={handleChange} placeholder="University" className="input" />
              <input name="degree" value={form.degree} onChange={handleChange} placeholder="Degree" className="input" />
              <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="input" />
              <input name="period" value={form.period} onChange={handleChange} placeholder="2020 - 2024" className="input" />

              <input type="file" onChange={(e) => handleFile(e.target.files[0])} />
              {form.logo && <img src={form.logo} className="w-16 h-16 mt-2 rounded" />}
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={resetForm}>Cancel</button>
              <button onClick={handleSubmit} className="bg-black text-white px-4 py-2 rounded">
                Save
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}