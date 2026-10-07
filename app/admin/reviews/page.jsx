"use client";
import { useEffect, useState } from "react";
import { Star, Pencil, Trash2, Loader2, MessageSquare, Search } from "lucide-react";
import toast from "react-hot-toast";

const API_BASE = "/api";

function StarRating({ value }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          fill={value >= star ? "#f5a623" : "none"}
          stroke={value >= star ? "#f5a623" : "#555"}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [form, setForm] = useState({ name: "", role: "", rating: 5, message: "" });
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/admin";
        return;
      }

      const res = await fetch(`${API_BASE}/reviews`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/admin";
        return;
      }

      const data = await res.json();
      if (data.success) {
        setReviews(data.data || []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this live review?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/reviews/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Review deleted successfully");
        setReviews((prev) => prev.filter((r) => r._id !== id));
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Error deleting review");
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review._id);
    setForm({
      name: review.name || "",
      role: review.role || "",
      rating: review.rating || 5,
      message: review.message || "",
    });
  };

  const handleUpdate = async (id) => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/reviews/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Review updated successfully!");
        setReviews((prev) =>
          prev.map((r) => (r._id === id ? { ...r, ...form } : r))
        );
        setEditingReview(null);
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Error updating review");
    } finally {
      setSaving(false);
    }
  };

  const filteredReviews = reviews.filter(
    (r) =>
      r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-indigo-500/20 shadow-xl backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <MessageSquare className="text-indigo-400" size={28} />
            Live Approved Reviews ({reviews.length})
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage testimonials published publicly on your portfolio website
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-48 md:w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-indigo-500" size={40} />
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
          <MessageSquare className="mx-auto text-slate-600 mb-3" size={48} />
          <h3 className="text-lg font-semibold text-slate-300">No Approved Reviews</h3>
          <p className="text-slate-500 text-sm mt-1">Approve pending review requests to publish them here.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredReviews.map((r) => {
            const initials = r.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2) || "U";

            return (
              <div
                key={r._id}
                className="p-6 rounded-2xl flex flex-col justify-between gap-4 bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 shadow-xl"
              >
                {editingReview === r._id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Name"
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                    />

                    <input
                      type="text"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      placeholder="Role / Title"
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                    />

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Rating (1-5)</label>
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={form.rating}
                        onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                      />
                    </div>

                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Review message"
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm"
                    />

                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        onClick={() => setEditingReview(null)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdate(r._id)}
                        disabled={saving}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1"
                      >
                        {saving ? <Loader2 className="animate-spin" size={14} /> : "Save Changes"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-indigo-500 to-pink-500 shadow-md">
                            {initials}
                          </div>

                          <div>
                            <h3 className="font-bold text-slate-100 text-sm">{r.name}</h3>
                            <p className="text-xs text-indigo-400">{r.role || "Professional"}</p>
                          </div>
                        </div>

                        <StarRating value={r.rating} />
                      </div>

                      <p className="mt-4 text-sm text-slate-300 italic leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                        "{r.message}"
                      </p>
                    </div>

                    <div className="flex gap-4 mt-2 pt-3 border-t border-slate-800">
                      <button
                        onClick={() => handleEdit(r)}
                        className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold"
                      >
                        <Pencil size={15} /> Edit
                      </button>

                      <button
                        onClick={() => handleDelete(r._id)}
                        className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold"
                      >
                        <Trash2 size={15} /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}