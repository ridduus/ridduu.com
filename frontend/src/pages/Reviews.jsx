import { useState, useEffect } from "react";
import { useSettings } from "../Context/settingContext";
import { Star, Send, User, MessageSquare, Loader2, CheckCircle, AlertCircle } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

// const seedReviews = [
//   {
//     _id: "seed1",
//     name: "Rupesh Gupta",
//     role: "Electrical Engineer",
//     rating: 5,
//     message:
//       "A really good job and looking great — finally your hard work converted into a successful project. Keep shining always. All aspects of the project were followed step by step and with great results.",
//     createdAt: "2024-01-15T00:00:00Z",
//   },
//   {
//     _id: "seed2",
//     name: "Zaid Khan",
//     role: "Visual Designer",
//     rating: 5,
//     message:
//       "This site is really amazing and I am always in agreement for this. All aspects of the project were followed step by step and with good results.",
//     createdAt: "2024-02-10T00:00:00Z",
//   },
//   {
//     _id: "seed3",
//     name: "Virat Tiwari",
//     role: "Embedded Designer",
//     rating: 5,
//     message:
//       "It looks great, I am so impressed by your work and proud of your hard work and learning. I'm so glad that you have achieved your goal early. A really good job and best service with great results.",
//     createdAt: "2024-03-05T00:00:00Z",
//   },
//   {
//     _id: "seed4",
//     name: "Lucky Goutam",
//     role: "Electrical Engineer",
//     rating: 5,
//     message:
//       "A really good job. I'm so glad that you have achieved your goal successfully before the specific time. Keep it up always — all aspects of the project were followed step by step and with good results.",
//     createdAt: "2024-04-01T00:00:00Z",
//   },
//   {
//     _id: "seed5",
//     name: "Jayesh Gupta",
//     role: "Furniture Designer",
//     rating: 5,
//     message:
//       "Congratulations on finishing this challenging project on record time! Given the tight deadline and additional complexities, it's truly amazing to see how you collaborated with different teams. I'm so glad for your hard work.",
//     createdAt: "2024-05-20T00:00:00Z",
//   },
// ];

function StarRating({ value, onChange, readonly = false, size = 20 }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={readonly ? "button" : "button"}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={readonly ? "cursor-default" : "cursor-pointer transition-transform hover:scale-110"}
          disabled={readonly}
          tabIndex={readonly ? -1 : 0}
        >
          <Star
            size={size}
            fill={(hovered || value) >= star ? "#f5a623" : "none"}
            stroke={(hovered || value) >= star ? "#f5a623" : "rgba(71, 67, 67, 0.91)"}
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

  const colors = ["#6c63ff", "#ff6584", "#43b89c", "#f5a623", "#e056fd"];
  const color = colors[review.name.charCodeAt(0) % colors.length];

  return (
    <div
      className="p-6 rounded-2xl flex flex-col gap-4 transition-all duration-300 hover:scale-[1.02]"
      style={{
        background: "linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,101,132,0.1))",
        border: "1px solid rgba(108,99,255,0.3)",
        boxShadow: "0 0 7px rgba(108,99,255,0.4)"
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }}
          >
            {initials}
          </div>
          <div>
            <div className="font-semibold" style={{ color: "var(--color-text)" }}>
              {review.name}
            </div>
            <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              {review.role || "Professional"}
            </div>
          </div>
        </div>
        <StarRating value={review.rating} readonly size={16} />
      </div>
      <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
        "{review.message}"
      </p>
      <div className="text-xs" style={{ color: "var(--color-text-muted)" }}>
        {new Date(review.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long" })}
      </div>
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", role: "", rating: 0, message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState("");

  const { isVisible, loading: settingsLoading } = useSettings();

  useEffect(() => {
    fetchReviews();
  }, []);


  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE}/reviews`);
      const data = await res.json();

      if (data.success) {
        setReviews(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

        // ❌ No UI update here (wait for admin approval)
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

    const visibleReviews = reviews.filter((proj) =>
    isVisible("reviews", proj.key)
  );

  if (visibleReviews.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        No reviews available
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "var(--color-dark)" }} className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          {/* <p className="text-sm uppercase tracking-widest mb-2" style={{ color: "var(--color-primary)" }}>
            What Clients Say
          </p> */}
          <h1 className="text-5xl font-black gradient-text">What Clients Say</h1>
          <p className="mt-4 max-w-xl mx-auto" style={{ color: "var(--color-text-muted)" }}>
            Real feedback from clients and collaborators. Leave your own review below!
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Reviews Column */}
          <div className="lg:col-span-2">
            {loading || settingsLoading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 size={32} className="animate-spin" style={{ color: "var(--color-primary)" }} />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6 ">
                {reviews.map((r) => (
                  <ReviewCard key={r._id} review={r} />
                ))}
              </div>
            )}
          </div>

          {/* Submit Form Column */}
          <div className="lg:col-span-1">
            <div
              className="p-7 rounded-2xl sticky top-24"
              style={{
                background: "linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,101,132,0.1))",
                border: "1px solid rgba(108,99,255,0.3)",
                boxShadow: "0 0 7px rgba(108,99,255,0.4)"
              }}
            >
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare size={20} style={{ color: "var(--color-primary)" }} />
                <h2 className="text-lg font-bold" style={{ color: "var(--color-text)" }}>
                  Leave a Review
                </h2>
              </div>

              {submitStatus === "success" && (
                <div
                  className="flex items-center gap-2 p-3 rounded-xl mb-4 text-sm"
                  style={{ backgroundColor: "rgba(67,184,156,0.15)", color: "#43b89c" }}
                >
                  <CheckCircle size={16} />
                  Your review has been sent to admin. It will appear after approval.
                </div>
              )}

              {submitStatus === "error" && (
                <div
                  className="flex items-center gap-2 p-3 rounded-xl mb-4 text-sm"
                  style={{ backgroundColor: "rgba(255,101,132,0.15)", color: "#ff6584" }}
                >
                  <AlertCircle size={16} />
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--color-text-muted)" }}>
                    Name <span style={{ color: "#ff6584" }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: "linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,101,132,0.1))",
                      border: "1px solid rgba(108,99,255,0.3)",
                      boxShadow: "0 0 7px rgba(108,99,255,0.4)"
                    }}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--color-text-muted)" }}>
                    Email <span style={{ color: "#ff6584" }}>*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                    style={{
                      background: "linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,101,132,0.1))",
                      border: "1px solid rgba(108,99,255,0.3)",
                      boxShadow: "0 0 7px rgba(108,99,255,0.4)"
                    }}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--color-text-muted)" }}>
                    Your Role / Profession
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Web Developer"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{
                      background: "linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,101,132,0.1))",
                      border: "1px solid rgba(108,99,255,0.3)",
                      boxShadow: "0 0 7px rgba(108,99,255,0.4)"
                    }}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--color-text-muted)" }}>
                    Rating <span style={{ color: "#ff6584" }}>*</span>
                  </label>
                  <StarRating value={form.rating} onChange={(r) => setForm({ ...form, rating: r })} size={24} />
                </div>

                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--color-text-muted)" }}>
                    Message <span style={{ color: "#ff6584" }}>*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Share your experience working with Ronak..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                    style={{
                      background: "linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,101,132,0.1))",
                      border: "1px solid rgba(108,99,255,0.3)",
                      boxShadow: "0 0 7px rgba(108,99,255,0.4)"
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, #6c63ff, #ff6584)" }}
                >
                  {submitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
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
