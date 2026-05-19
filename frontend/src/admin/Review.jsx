import { useEffect, useState } from "react";
import { Star, Pencil, Trash2, Loader2, CheckCircle, AlertCircle } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "https://ridduu-com.onrender.com/api";

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
  const [form, setForm] = useState({ name: "", role: "", rating: 0, message: "" });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location = "/admin"; // redirect to login
        return;
      }

      const res = await fetch(`${API_BASE}/reviews`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location = "/admin";
        return;
      }

      const data = await res.json();

      if (data.success) {
        setReviews(data.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🗑 DELETE
  const handleDelete = async (id) => {
    if (!confirm("Delete this review?")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/reviews/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location = "/admin";
        return;
      }

      const data = await res.json();

      if (data.success) {
        setReviews((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ✏️ EDIT CLICK
  const handleEdit = (review) => {
    setEditingReview(review._id);
    setForm({
      name: review.name,
      role: review.role,
      rating: review.rating,
      message: review.message,
    });
  };

  // 💾 UPDATE
  const handleUpdate = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/reviews/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location = "/admin";
        return;
      }

      const data = await res.json();

      if (data.success) {
        setStatus("success");

        setReviews((prev) =>
          prev.map((r) => (r._id === id ? { ...r, ...form } : r))
        );

        setEditingReview(null);
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Live Reviews</h1>

      {status === "success" && (
        <div className="mb-4 text-green-400 flex items-center gap-2">
          <CheckCircle size={16} /> Updated successfully
        </div>
      )}

      {status === "error" && (
        <div className="mb-4 text-red-400 flex items-center gap-2">
          <AlertCircle size={16} /> Something went wrong
        </div>
      )}

      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {reviews.map((r) => {
            const initials = r.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            return (
              <div
                key={r._id}
                className="p-6 rounded-2xl flex flex-col gap-4 transition-all duration-300 hover:scale-[1.02] bg-gray-900 border border-gray-800"
              >
                {editingReview === r._id ? (
                  <>
                    {/* EDIT MODE */}
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-indigo-500 to-pink-500">
                        {initials}
                      </div>

                      <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="flex-1 p-2 bg-gray-800 rounded"
                      />
                    </div>

                    <input
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="w-full p-2 bg-gray-800 rounded"
                    />

                    <input
                      type="number"
                      value={form.rating}
                      onChange={(e) =>
                        setForm({ ...form, rating: Number(e.target.value) })
                      }
                      className="w-full p-2 bg-gray-800 rounded"
                    />

                    <textarea
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      className="w-full p-2 bg-gray-800 rounded"
                    />

                    <div className="flex justify-center gap-3 mt-2">
                      <button
                        onClick={() => handleUpdate(r._id)}
                        className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => setEditingReview(null)}
                        className="bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* VIEW MODE */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-indigo-500 to-pink-500">
                          {initials}
                        </div>

                        <div>
                          <h2 className="font-semibold">{r.name}</h2>
                          <p className="text-xs text-gray-400">
                            {r.role || "Professional"}
                          </p>
                        </div>
                      </div>

                      {/* Rating */}
                      <StarRating value={r.rating} />
                    </div>

                    {/* Message */}
                    <p className="text-sm text-gray-300 leading-relaxed">
                      "{r.message}"
                    </p>

                    {/* Actions */}
                    <div className="flex gap-4 mt-2">
                      <button
                        onClick={() => handleEdit(r)}
                        className="flex items-center gap-1 text-yellow-400 hover:scale-105 transition"
                      >
                        <Pencil size={16} /> Edit
                      </button>

                      <button
                        onClick={() => handleDelete(r._id)}
                        className="flex items-center gap-1 text-red-400 hover:scale-105 transition"
                      >
                        <Trash2 size={16} /> Delete
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