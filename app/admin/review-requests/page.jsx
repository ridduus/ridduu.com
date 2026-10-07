"use client";
import { useEffect, useState } from "react";
import { CheckCircle, Trash2, Loader2, Star, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

const API_BASE = "/api";

export default function ReviewRequests() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    fetchPending();
  }, []);

  async function fetchPending() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/admin";
        return;
      }

      const res = await fetch(`${API_BASE}/reviews/pending`, {
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
        setReviews(data.data || []);
      } else {
        toast.error(data.message || "Failed to fetch pending reviews");
      }
    } catch (err) {
      console.error("Fetch pending reviews error:", err);
      toast.error("Error loading pending review requests");
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async (id) => {
    try {
      setActionId(id);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/reviews/approve/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/admin";
        return;
      }

      const data = await res.json();

      if (data.success) {
        toast.success("Review approved and published to public site!");
        setReviews((prev) => prev.filter((r) => r._id !== id));
      } else {
        toast.error(data.message || "Approval failed");
      }
    } catch (err) {
      console.error("Approve error:", err);
      toast.error("Error approving review");
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to reject and delete this review request?")) return;

    try {
      setActionId(id);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/admin";
        return;
      }

      const data = await res.json();

      if (data.success) {
        toast.success("Review request deleted.");
        setReviews((prev) => prev.filter((r) => r._id !== id));
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Error deleting review");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-indigo-500/20 shadow-xl backdrop-blur-xl flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <MessageCircle className="text-indigo-400" size={28} />
            Pending Review Requests ({reviews.length})
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Review and approve user-submitted testimonials before they appear publicly
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-indigo-500" size={40} />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
          <MessageCircle className="mx-auto text-slate-600 mb-3" size={48} />
          <h3 className="text-lg font-semibold text-slate-300">No Pending Reviews</h3>
          <p className="text-slate-500 text-sm mt-1">
            All submitted reviews have been processed or no pending requests exist.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {reviews.map((r) => {
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
                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-indigo-500 to-pink-500 shadow-md">
                        {initials}
                      </div>

                      <div>
                        <div className="font-bold text-slate-100">{r.name}</div>
                        <div className="text-xs text-indigo-400 font-medium">
                          {r.role || "Client / Professional"}
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full text-amber-400 text-xs font-semibold">
                      <Star size={14} fill="#f5a623" />
                      {r.rating || 5}/5
                    </div>
                  </div>

                  {/* Message */}
                  <p className="mt-4 text-sm text-slate-300 leading-relaxed italic bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                    "{r.message}"
                  </p>
                  
                  {r.email && (
                    <div className="mt-2 text-xs text-slate-500">
                      Submitted by: <span className="text-slate-400">{r.email}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-2 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => handleApprove(r._id)}
                    disabled={actionId === r._id}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-600/20 text-sm disabled:opacity-50"
                  >
                    {actionId === r._id ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <>
                        <CheckCircle size={17} /> Approve & Publish
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(r._id)}
                    disabled={actionId === r._id}
                    className="bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white font-medium px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-sm border border-rose-500/30"
                    title="Reject & Delete"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}