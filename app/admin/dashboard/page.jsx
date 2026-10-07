"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FolderKanban,
  Star,
  MessageSquare,
  Trash2,
  Check,
  Phone,
  Bell,
  User,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Loader2,
  MessageCircle,
  Mail,
  ChevronRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [reviewCount, setReviewCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [skillCount, setSkillCount] = useState(0);

  const [pendingReviews, setPendingReviews] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openProfile, setOpenProfile] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);

  const API_BASE = "/api";

  const adminUser = {
    name: "Ronak Sharma",
    email: "admin@ridduu.com",
    avatar: null,
  };

  const getInitials = (name) => {
    const parts = name.split(" ");
    return parts[0][0] + (parts[1] ? parts[1][0] : "");
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/admin";
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [
        projectRes,
        skillRes,
        reviewRes,
        contactRes,
        pendingRes,
      ] = await Promise.all([
        fetch(`${API_BASE}/projects`, { headers }),
        fetch(`${API_BASE}/skills`, { headers }),
        fetch(`${API_BASE}/reviews`, { headers }),
        fetch(`${API_BASE}/contacts`, { headers }),
        fetch(`${API_BASE}/reviews/pending`, { headers }),
      ]);

      const [
        projectData,
        skillData,
        reviewData,
        contactData,
        pendingData,
      ] = await Promise.all([
        projectRes.json(),
        skillRes.json(),
        reviewRes.json(),
        contactRes.json(),
        pendingRes.json(),
      ]);

      if (projectData.success) {
        setProjectCount(projectData.count || (projectData.data ? projectData.data.length : 0));
      }

      if (skillData.success) {
        setSkillCount(skillData.count || (skillData.data ? skillData.data.length : 0));
      }

      if (reviewData.success) {
        setReviewCount(reviewData.count || (reviewData.data ? reviewData.data.length : 0));
      }

      if (contactData.success) {
        setContacts(contactData.data || []);
        setContactCount(contactData.count || (contactData.data ? contactData.data.length : 0));
      }

      if (pendingData.success) {
        setPendingReviews(pendingData.data || []);
        setPendingCount(pendingData.data ? pendingData.data.length : 0);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(id) {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/reviews/approve/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Review approved!");
        setPendingReviews((prev) => prev.filter((r) => r._id !== id));
        setPendingCount((prev) => Math.max(0, prev - 1));
        setReviewCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Approve error:", err);
      toast.error("Failed to approve review");
    }
  }

  async function handleDelete(id) {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Review deleted");
        setPendingReviews((prev) => prev.filter((r) => r._id !== id));
        setPendingCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete review");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    window.location.href = "/admin";
  }

  const chartData = [
    { name: "Projects", value: projectCount },
    { name: "Skills", value: skillCount },
    { name: "Reviews", value: reviewCount },
    { name: "Contacts", value: contactCount },
  ];

  const colors = ["#6366f1", "#ec4899", "#22c55e", "#eab308"];
  const totalNotifications = pendingCount + (contacts.length > 0 ? contacts.length : 0);

  return (
    <div className="space-y-6">
      {/* Header Bar with z-50 for profile dropdown */}
      <div className="bg-slate-900/60 p-6 rounded-2xl border border-indigo-500/20 shadow-xl backdrop-blur-xl flex justify-between items-center relative z-50">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Welcome back, {adminUser.name}!
          </h2>
          <p className="text-slate-400 text-xs mt-1 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" />
            256-Bit Encrypted Session • Real-Time Stats Overview
          </p>
        </div>

        <div className="flex items-center gap-4 relative">
          {/* NOTIFICATION FEATURE */}
          <div className="relative">
            <button
              onClick={() => {
                setOpenNotifications(!openNotifications);
                setOpenProfile(false);
              }}
              className="relative p-2.5 text-slate-400 hover:text-white bg-slate-950/60 rounded-xl border border-slate-800 transition"
              title="Notifications"
            >
              <Bell size={18} />
              {totalNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {totalNotifications}
                </span>
              )}
            </button>

            {openNotifications && (
              <div className="absolute right-0 top-14 bg-slate-900 border border-slate-700/80 rounded-2xl p-4 w-80 shadow-2xl z-50 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Bell size={16} className="text-indigo-400" /> System Notifications
                  </h3>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-semibold">
                    {totalNotifications} new
                  </span>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {pendingCount > 0 && (
                    <button
                      onClick={() => (window.location.href = "/admin/review-requests")}
                      className="w-full text-left p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition flex items-start gap-3"
                    >
                      <MessageCircle size={18} className="text-amber-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-200">
                          {pendingCount} Pending Review Request{pendingCount > 1 ? "s" : ""}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Click to approve or reject requests</p>
                      </div>
                      <ChevronRight size={14} className="text-slate-500" />
                    </button>
                  )}

                  {contacts.length > 0 && (
                    <button
                      onClick={() => (window.location.href = "/admin/contacts")}
                      className="w-full text-left p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition flex items-start gap-3"
                    >
                      <Mail size={18} className="text-indigo-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-200">
                          {contacts.length} Contact Message{contacts.length > 1 ? "s" : ""}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Latest from: {contacts[0]?.name || "User"}</p>
                      </div>
                      <ChevronRight size={14} className="text-slate-500" />
                    </button>
                  )}

                  {totalNotifications === 0 && (
                    <p className="text-xs text-slate-500 text-center py-4">No unread notifications</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* USER PROFILE DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => {
                setOpenProfile(!openProfile);
                setOpenNotifications(false);
              }}
              className="flex items-center gap-3 p-1.5 pr-3 bg-slate-950/60 hover:bg-slate-800 rounded-xl border border-slate-800 transition"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center font-bold text-white text-xs uppercase shadow-md">
                {getInitials(adminUser.name)}
              </div>
              <span className="text-sm font-medium text-slate-200 hidden sm:inline">{adminUser.name}</span>
            </button>

            {openProfile && (
              <div className="absolute right-0 top-14 bg-slate-900 border border-slate-700/80 rounded-2xl p-4 w-60 shadow-2xl z-50 space-y-3">
                <div className="pb-3 border-b border-slate-800">
                  <p className="font-bold text-white text-sm">{adminUser.name}</p>
                  <p className="text-xs text-slate-400">{adminUser.email}</p>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => (window.location.href = "/admin/profile")}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-indigo-400 rounded-xl transition"
                  >
                    <User size={16} /> Edit Profile
                  </button>
                  <button
                    onClick={() => window.open("/", "_blank")}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-indigo-400 rounded-xl transition"
                  >
                    <ExternalLink size={16} /> View Live Portfolio
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-xl transition font-medium"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-indigo-500" size={40} />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Projects" value={projectCount} icon={FolderKanban} color="from-indigo-600 to-indigo-800" path="/admin/projects" />
            <StatCard title="Skills" value={skillCount} icon={Star} color="from-pink-600 to-pink-800" path="/admin/skills" />
            <StatCard title="Approved Reviews" value={reviewCount} icon={MessageSquare} color="from-emerald-600 to-emerald-800" path="/admin/reviews" />
            <StatCard title="Contact Queries" value={contactCount} icon={Phone} color="from-amber-600 to-amber-800" path="/admin/contacts" />
          </div>

          {/* Grid Widgets */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Graph */}
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl">
              <h2 className="text-lg font-bold text-slate-100 mb-4">Portfolio Analytics Overview</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#f8fafc" }} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={index} fill={colors[index]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pending Reviews Widget */}
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-xl flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
                  <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    Pending Reviews
                    <span className="px-2.5 py-0.5 rounded-full text-xs bg-rose-500/20 text-rose-400 font-semibold border border-rose-500/30">
                      {pendingCount}
                    </span>
                  </h2>
                  <button
                    onClick={() => (window.location.href = "/admin/review-requests")}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-3 max-h-56 overflow-y-auto">
                  {pendingReviews.slice(0, 4).map((r) => (
                    <div key={r._id} className="bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-xl flex items-center justify-between gap-3">
                      <div className="overflow-hidden">
                        <p className="font-semibold text-slate-200 text-sm truncate">{r.name || "Anonymous User"}</p>
                        <p className="text-xs text-amber-400">⭐ {r.rating || 5}/5 Stars</p>
                      </div>

                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleApprove(r._id)}
                          className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border border-emerald-500/30"
                        >
                          <Check size={14} /> Approve
                        </button>

                        <button
                          onClick={() => handleDelete(r._id)}
                          className="bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white p-1.5 rounded-lg text-xs transition-colors border border-rose-500/30"
                          title="Reject"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {pendingReviews.length === 0 && (
                    <p className="text-slate-500 text-sm text-center py-8">
                      No pending review requests requiring approval!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, path }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      onClick={() => (window.location.href = path)}
      className={`p-6 rounded-2xl bg-gradient-to-br ${color} cursor-pointer shadow-xl relative overflow-hidden border border-white/10`}
    >
      <div className="flex justify-between items-start z-10 relative">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/80">{title}</p>
          <h2 className="text-4xl font-black text-white mt-1">{value}</h2>
        </div>
        <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl">
          <Icon className="text-white" size={24} />
        </div>
      </div>
    </motion.div>
  );
}