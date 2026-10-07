"use client";
import { useState, useEffect } from "react";
import { useSettings } from "@/context/settingContext";
import { Star, Send, MessageSquare, Loader2, CheckCircle, AlertCircle } from "lucide-react";

const API_BASE = "/api";

const defaultReviews = [
  {
    _id: "r1",
    name: "Rupesh Gupta",
    role: "Electrical Engineer",
    rating: 5,
    message: "A really good job and looking great — finally your hard work converted into a successful project. Keep shining always!",
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    _id: "r2",
    name: "Zaid Khan",
    role: "Visual Designer",
    rating: 5,
    message: "This site is really amazing and I am always in agreement. All aspects of the project were followed step by step with good results.",
    createdAt: "2024-02-10T00:00:00Z",
  },
  {
    _id: "r3",
    name: "Virat Tiwari",
    role: "Embedded Designer",
    rating: 5,
    message: "It looks great, I am so impressed by your work and proud of your hard work and learning. Best service with great results!",
    createdAt: "2024-03-05T00:00:00Z",
  },
];

function StarRating({ value, onChange, readonly = false, size = 18 }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={readonly ? "cursor-default" : "cursor-pointer transition-transform hover:scale-110"}
          disabled={readonly}
        >
          <Star
            size={size}
            fill={(hovered || value) >= star ? "#f59e0b" : "none"}
            stroke={(hovered || value) >= star ? "#f59e0b" : "#cbd5e1"}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  const initials = review.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between gap-3">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center border border-blue-100 shrink-0">
              {initials}
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{review.name}</h4>
              <p className="text-xs text-slate-500 font-medium">{review.role || "Professional"}</p>
            </div>
          </div>
          <StarRating value={review.rating} readonly size={14} />
        </div>
        <p className="text-xs text-slate-600 leading-relaxed italic">
          "{review.message}"
        </p>
      </div>

      <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
        {new Date(review.createdAt || Date.now()).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
        })}
      </div>
    </div>
  );
}

export default function Reviews({ initialReviews }) {
  const [reviews, setReviews] = useState(
    initialReviews && initialReviews.length > 0 ? initialReviews : defaultReviews
  );
  const [loading, setLoading] = useState(!initialReviews);
  const [form, setForm] = useState({ name: "", email: "", role: "", rating: 0, message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const { isVisible, loading: settingsLoading } = useSettings();

  useEffect(() => {
    if (initialReviews && initialReviews.length > 0) return;
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_BASE}/reviews`);
        const data = await res.json();

        if (data.success && data.data && data.data.length > 0) {
          setReviews(data.data);
        } else {
          setReviews(defaultReviews);
        }
      } catch (err) {
        console.error(err);
        setReviews(defaultReviews);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [initialReviews]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.email || !form.rating || !form.message) {
      setErrorMsg("Please fill in all required fields and select a rating.");
      setSubmitStatus("error");
      return;
    }

    setSubmitting(true);
    setSubmitStatus(null);
    setErrorMsg("");

    try {
      const res = await fetch(`${API_BASE}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitStatus("success");
        setForm({
          name: "",
          email: "",
          role: "",
          rating: 0,
          message: "",
        });
      } else {
        setErrorMsg(data.message || "Something went wrong.");
        setSubmitStatus("error");
      }
    } catch {
      setErrorMsg("Could not reach the server. Please try again later.");
      setSubmitStatus("error");
    } finally {
      setSubmitting(false);
    }
  }

  const visibleReviews = reviews.filter(
    (rev) => !rev.key || isVisible("reviews", rev.key)
  );

  const displayList = visibleReviews.length > 0 ? visibleReviews : defaultReviews;

  return (
    <div className="bg-white pt-28 pb-20 text-slate-800">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 space-y-2">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Testimonials
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900">
            What Clients <span className="text-blue-600">Say</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 max-w-xl mx-auto">
            Real feedback from clients and collaborators. Feel free to leave your own review below!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Reviews List Column */}
          <div className="lg:col-span-2">
            {loading || settingsLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 size={28} className="animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {displayList.map((r) => (
                  <ReviewCard key={r._id} review={r} />
                ))}
              </div>
            )}
          </div>

          {/* Submit Form Column */}
          <div className="lg:col-span-1">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm sticky top-28">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare size={18} className="text-blue-600" />
                <h2 className="text-base font-bold text-slate-900">
                  Leave a Review
                </h2>
              </div>

              {submitStatus === "success" && (
                <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-xs bg-emerald-50 text-emerald-600 font-medium">
                  <CheckCircle size={16} />
                  Your review has been sent to admin. It will appear after approval.
                </div>
              )}

              {submitStatus === "error" && (
                <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-xs bg-rose-50 text-rose-600 font-medium">
                  <AlertCircle size={16} />
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">
                    Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 text-slate-900 border border-slate-200 focus:border-blue-600 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">
                    Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 text-slate-900 border border-slate-200 focus:border-blue-600 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">
                    Your Role / Profession
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Web Developer"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 text-slate-900 border border-slate-200 focus:border-blue-600 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">
                    Rating <span className="text-rose-500">*</span>
                  </label>
                  <StarRating value={form.rating} onChange={(r) => setForm({ ...form, rating: r })} size={20} />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">
                    Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Share your experience working with Ronak..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 text-slate-900 border border-slate-200 focus:border-blue-600 focus:outline-none resize-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full font-semibold text-white text-xs bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 disabled:opacity-60"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
