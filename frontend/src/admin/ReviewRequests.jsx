import { useEffect, useState } from "react";
import { CheckCircle, Trash2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export default function ReviewRequests() {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetchPending();
    }, []);

    async function fetchPending() {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_BASE}/reviews/pending`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (data.success) setReviews(data.data);
    }

    const handleApprove = async (id) => {
        const token = localStorage.getItem("token");

        await fetch(`${API_BASE}/reviews/approve/${id}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` },
        });

        setReviews((prev) => prev.filter((r) => r._id !== id));
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");

        await fetch(`${API_BASE}/reviews/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        setReviews((prev) => prev.filter((r) => r._id !== id));
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Review Requests</h1>

            <div className="grid sm:grid-cols-2 gap-6">
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
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {/* Avatar */}
                                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-indigo-500 to-pink-500">
                                        {initials}
                                    </div>

                                    <div>
                                        <div className="font-semibold">{r.name}</div>
                                        <div className="text-xs text-gray-400">
                                            {r.role || "Professional"}
                                        </div>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="text-yellow-400 text-sm">
                                    ⭐ {r.rating || 1}/5
                                </div>
                            </div>

                            {/* Message */}
                            <p className="text-sm text-gray-300 leading-relaxed">
                                "{r.message}"
                            </p>

                            {/* Actions */}
                            <div className="flex gap-3 mt-2">
                                <button
                                    onClick={() => handleApprove(r._id)}
                                    className="bg-green-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
                                >
                                    <CheckCircle size={16} />
                                    Approve
                                </button>

                                <button
                                    onClick={() => handleDelete(r._id)}
                                    className="bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition"
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}