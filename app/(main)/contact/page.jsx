"use client";
import { useState } from "react";
import { Mail, Phone, MessageCircle, Send, Loader2, CheckCircle, AlertCircle, MapPin } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = "/api";

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
    <div className="bg-white pb-20 text-slate-800">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 space-y-2">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Contact
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900">
            Get In <span className="text-blue-600">Touch</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 max-w-xl mx-auto">
            Have a project in mind or want to collaborate? Reach out — I'd love to connect.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Talk to me
              </h2>
              <p className="text-xs text-slate-500">
                I'm always open to discussing new projects, creative ideas, or opportunities.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: "ronaksharma2350@gmail.com",
                  href: "mailto:ronaksharma2350@gmail.com",
                  sub: "Write me",
                },
                {
                  icon: Phone,
                  label: "WhatsApp",
                  value: "+91 895-513-4408",
                  href: "https://api.whatsapp.com/send?phone=918955134408&text=Hello,%20more%20information!",
                  sub: "Message me",
                },
                {
                  icon: MapPin,
                  label: "Location",
                  value: "Ramganjmandi, Kota, Rajasthan, India",
                  href: null,
                  sub: "Available Remote",
                },
              ].map((c) => (
                <div
                  key={c.label}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-sm transition-shadow"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <c.icon size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-semibold text-slate-400">
                      {c.label}
                    </p>
                    <p className="text-xs font-bold text-slate-900">
                      {c.value}
                    </p>
                  </div>
                  {c.href && (
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : "_self"}
                      rel="noreferrer"
                      className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                    >
                      {c.sub}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Write me about your project
            </h2>

            {status === "success" && (
              <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-xs bg-emerald-50 text-emerald-600 font-medium">
                <CheckCircle size={16} />
                Message sent! I'll get back to you soon.
              </div>
            )}

            {status === "error" && (
              <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-xs bg-rose-50 text-rose-600 font-medium">
                <AlertCircle size={16} />
                Please fill in all required fields.
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">
                    Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 text-slate-900 border border-slate-200 focus:border-blue-600 focus:outline-none transition-all"
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
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 text-slate-900 border border-slate-200 focus:border-blue-600 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">
                  Subject / Project
                </label>
                <input
                  type="text"
                  placeholder="What's this about?"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 text-slate-900 border border-slate-200 focus:border-blue-600 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">
                  Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your project or message..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 text-slate-900 border border-slate-200 focus:border-blue-600 focus:outline-none resize-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full font-semibold text-white text-xs bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 disabled:opacity-60"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
