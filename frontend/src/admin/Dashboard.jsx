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
  CheckCircle,
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

export default function Dashboard() {
  const [reviewCount, setReviewCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [skillCount, setSkillCount] = useState(0);

  const [pendingReviews, setPendingReviews] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

  const [openProfile, setOpenProfile] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || "/api";

    const user = {
    name: "Ronak Sharma",
    email: "admin@email.com",
    avatar: null,
  };

  const getInitials = (name) => {
    const parts = name.split(" ");
    return parts[0][0] + (parts[1] ? parts[1][0] : "");
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  /* 🔥 FETCH ALL */
  async function fetchAllData() {
    try {
      const token = localStorage.getItem("token");

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
        setProjectCount(projectData.count || projectData.data.length);
      }

      if (skillData.success) {
        setSkillCount(skillData.count || skillData.data.length);
      }

      if (reviewData.success) {
        setReviewCount(reviewData.count || reviewData.data.length);
      }

      if (contactData.success) {
        setContactCount(contactData.count || contactData.data.length);
      }

      if (pendingData.success) {
        setPendingReviews(pendingData.data || []);
        setPendingCount(pendingData.data.length);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  }

  /* ✅ APPROVE */
  async function handleApprove(id) {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${API_BASE}/reviews/approve/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      setPendingReviews((prev) => prev.filter((r) => r._id !== id));
      setPendingCount((prev) => prev - 1);
      setReviewCount((prev) => prev + 1); // optional
    } catch (err) {
      console.error("Approve error:", err);
    }
  }

  /* ❌ DELETE */
  async function handleDelete(id) {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${API_BASE}/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setPendingReviews((prev) => prev.filter((r) => r._id !== id));
      setPendingCount((prev) => prev - 1);
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    window.location = "/admin";
  }

  const chartData = [
    { name: "Projects", value: projectCount },
    { name: "Skills", value: skillCount },
    { name: "Reviews", value: reviewCount },
    { name: "Contacts", value: contactCount },
  ];

  const colors = ["#6366f1", "#ec4899", "#22c55e", "#eab308"];

  return (
    <div className="h-screen text-white overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur border-b border-gray-800 p-1 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard</h2>

        <div className="flex items-center gap-4 relative">
          <Bell className="cursor-pointer" />

          {/* PROFILE */}
          <div onClick={() => setOpenProfile(!openProfile)} className="cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center font-semibold uppercase">
              {user.avatar ? (
                <img src={user.avatar} className="w-full h-full rounded-full object-cover" />
              ) : (
                getInitials(user.name)
              )}
            </div>
          </div>

          {openProfile && (
            <div className="absolute right-0 top-12 bg-gray-900 border border-gray-700 rounded-xl p-4 w-56 shadow-xl">
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>

              <div className="mt-3 space-y-2">
                <button
                  onClick={() => (window.location = "/contact")}
                  className="w-full text-left text-sm hover:text-blue-400"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-sm text-red-400"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>


      <div className="p-2 space-y-5">
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Projects" value={projectCount} icon={FolderKanban} color="from-indigo-500 to-indigo-700" />
          <StatCard title="Skills" value={skillCount} icon={Star} color="from-pink-500 to-pink-700" />
          <StatCard title="Reviews" value={reviewCount} icon={MessageSquare} color="from-green-500 to-green-700" />
          <StatCard title="Contacts" value={contactCount} icon={Phone} color="from-yellow-500 to-yellow-700" />
        </div>

        {/* Widgets */}
        <div className="grid md:grid-cols-2 gap-3">
          {/* Graph */}
          <div className="bg-gray-900 p-6 rounded-2xl">
            <h2 className="text-lg font-semibold mb-4">Portfolio Overview</h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={colors[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pending Reviews */}
          <div className="bg-gray-900 p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                Pending Reviews ({pendingCount})
              </h2>
              <button
                onClick={() => (window.location = "/admin/review-requests")}
                className="text-sm text-blue-400">
                View More →
              </button>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {pendingReviews.slice(0, 4).map((r) => (
                <div key={r._id} className="bg-gray-800 p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{r.name || "User"}</p>
                      <p className="text-xs text-yellow-400">ridduu.com</p>
                    </div>
                    <div>
                      <p className="text-xs text-yellow-400">⭐ {r.rating || 1}/5</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(r._id)}
                        className="bg-green-600 flex items-center px-2 py-1 rounded hover:bg-red-700 transition"
                      >
                        <Check size={14} /> Approve
                      </button>

                      <button
                        onClick={() => handleDelete(r._id)}
                        className="bg-red-600 p-2 rounded hover:bg-red-700 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          {/* <div className="bg-gray-900 p-6 rounded-2xl">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

            <div className="space-y-4 max-h-64 overflow-y-auto">

              {pendingReviews.slice(0, 5).map((r, index) => (
                <div key={index} className="flex items-start gap-3">

                  <div className="mt-1 w-2 h-2 rounded-full bg-green-500"></div>

                  <div>
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold">{r.name}</span> submitted a review
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(r.createdAt).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {pendingReviews.length === 0 && (
                <p className="text-sm text-gray-500 text-center">
                  No recent activity
                </p>
              )}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} className={`p-6 rounded-2xl bg-gradient-to-br ${color}`}>
      <div className="flex justify-between">
        <div>
          <p>{title}</p>
          <h2 className="text-3xl font-bold">{value}</h2>
        </div>
        <Icon />
      </div>
    </motion.div>
  );
}