import { useState } from "react";
import { Mail, Phone, MessageCircle, Send, Loader2, CheckCircle, AlertCircle, MapPin } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || "/api";

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setStatus("error");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }

    } catch (error) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ backgroundColor: "var(--color-dark)" }} className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          {/* <p className="text-sm uppercase tracking-widest mb-2" style={{ color: "var(--color-primary)" }}>
            Get In Touch
          </p> */}
          <h1 className="text-5xl font-black gradient-text">Get In Touch</h1>
          <p className="mt-4 max-w-xl mx-auto" style={{ color: "var(--color-text-muted)" }}>
            Have a project in mind or want to collaborate? Reach out — I'd love to connect.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--color-text)" }}>
              Talk to me
            </h2>
            <p className="mb-8" style={{ color: "var(--color-text-muted)" }}>
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
            </p>

            <div className="flex flex-col gap-5">
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: "ronaksharma2350@gmail.com",
                  href: "mailto:ronaksharma2350@gmail.com",
                  color: "#6c63ff",
                  sub: "Write me",
                },
                {
                  icon: Phone,
                  label: "WhatsApp",
                  value: "+91 895-513-4408",
                  href: "https://api.whatsapp.com/send?phone=918955134408&text=Hello,%20more%20information!",
                  color: "#43b89c",
                  sub: "Write me",
                },
                {
                  icon: MessageCircle,
                  label: "Messenger",
                  value: "ridvesh.sharma",
                  href: "https://m.me/ridvesh.sharma",
                  color: "#ff6584",
                  sub: "Write me",
                },
                {
                  icon: MapPin,
                  label: "Location",
                  value: "Jaipur Rajasthan, India",
                  href: null,
                  color: "#f5a623",
                  sub: "Available Remote",
                },
              ].map((c) => (
                <div
                  key={c.label}
                  className="flex items-center gap-5 p-5 rounded-2xl group transition-all hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,101,132,0.1))",
                    border: "1px solid rgba(108,99,255,0.3)",
                    boxShadow: "0 0 7px rgba(108,99,255,0.4)"
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${c.color}20`, color: c.color }}
                  >
                    <c.icon size={22} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium mb-0.5" style={{ color: "var(--color-text-muted)" }}>
                      {c.label}
                    </p>
                    <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                      {c.value}
                    </p>
                  </div>
                  {c.href && (
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : "_self"}
                      rel="noreferrer"
                      className="text-xs font-semibold px-4 py-1.5 rounded-full transition-all hover:scale-105"
                      style={{ backgroundColor: `${c.color}20`, color: c.color }}
                    >
                      {c.sub}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div
            className="p-8 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,101,132,0.1))",
              border: "1px solid rgba(108,99,255,0.3)",
              boxShadow: "0 0 7px rgba(108,99,255,0.4)"
            }}
          >
            <h2 className="text-xl font-bold mb-6" style={{ color: "var(--color-text)" }}>
              Write me your project
            </h2>

            {status === "success" && (
              <div
                className="flex items-center gap-2 p-3 rounded-xl mb-5 text-sm"
                style={{ backgroundColor: "rgba(67,184,156,0.15)", color: "#43b89c" }}
              >
                <CheckCircle size={16} />
                Message sent! I'll get back to you soon.
              </div>
            )}

            {status === "error" && (
              <div
                className="flex items-center gap-2 p-3 rounded-xl mb-5 text-sm"
                style={{ backgroundColor: "rgba(255,101,132,0.15)", color: "#ff6584" }}
              >
                <AlertCircle size={16} />
                Please fill in all required fields.
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--color-text-muted)" }}>
                    Name <span style={{ color: "#ff6584" }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                    Email <span style={{ color: "#ff6584" }}>*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{
                      background: "linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,101,132,0.1))",
                      border: "1px solid rgba(108,99,255,0.3)",
                      boxShadow: "0 0 7px rgba(108,99,255,0.4)"
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--color-text-muted)" }}>
                  Subject / Project
                </label>
                <input
                  type="text"
                  placeholder="What's this about?"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
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
                  Message <span style={{ color: "#ff6584" }}>*</span>
                </label>
                <textarea
                  rows={5}
                  placeholder="Describe your project or message..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-4.5 rounded-xl text-sm outline-none resize-none"
                  style={{
                    background: "linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,101,132,0.1))",
                    border: "1px solid rgba(108,99,255,0.3)",
                    boxShadow: "0 0 7px rgba(108,99,255,0.4)"
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #6c63ff, #ff6584)" }}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
