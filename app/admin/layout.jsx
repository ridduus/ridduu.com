"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Star,
  MessageSquare,
  Phone,
  GraduationCap,
  BriefcaseBusinessIcon,
  MessageCircle,
  User,
  Settings,
  Code2,
  Menu,
  ChevronLeft,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const isPublicAdminPage =
    pathname === "/admin" ||
    pathname === "/admin/forgot-password" ||
    pathname === "/admin/reset-password";

  // Check auth & token refresh setup
  const checkAuthAndRefreshToken = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthenticated(false);
      setLoadingAuth(false);
      if (!isPublicAdminPage) {
        router.push("/admin");
      }
      return;
    }

    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success && data.token) {
        localStorage.setItem("token", data.token);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        if (!isPublicAdminPage) {
          toast.error("Session expired. Please log in again.");
          router.push("/admin");
        }
      }
    } catch (err) {
      console.error("Auth verification error:", err);
      if (!isPublicAdminPage) {
        setIsAuthenticated(false);
      }
    } finally {
      setLoadingAuth(false);
    }
  }, [isPublicAdminPage, router]);

  useEffect(() => {
    checkAuthAndRefreshToken();

    // Refresh token every 4.5 minutes (270,000 ms) automatically while logged in
    const refreshInterval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token && !isPublicAdminPage) {
        checkAuthAndRefreshToken();
      }
    }, 4.5 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [checkAuthAndRefreshToken, isPublicAdminPage]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
    router.push("/admin");
  };

  const sections = [
    {
      title: "Overview",
      items: [
        { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "Portfolio Management",
      items: [
        { name: "Projects", path: "/admin/projects", icon: FolderKanban },
        { name: "Skills & Tech", path: "/admin/skills", icon: Star },
        { name: "Education", path: "/admin/education", icon: GraduationCap },
        { name: "Experience", path: "/admin/experience", icon: BriefcaseBusinessIcon },
      ],
    },
    {
      title: "Community & Reviews",
      items: [
        { name: "Review Requests", path: "/admin/review-requests", icon: MessageCircle },
        { name: "Live Reviews", path: "/admin/reviews", icon: MessageSquare },
      ],
    },
    {
      title: "Settings & Profile",
      items: [
        { name: "Contact Messages", path: "/admin/contacts", icon: Phone },
        { name: "About & Profile", path: "/admin/profile", icon: User },
        { name: "Admin Settings", path: "/admin/settings", icon: Settings },
      ],
    },
  ];

  // If on public admin pages OR logged out: HIDE SIDEBAR COMPLETELY
  if (isPublicAdminPage || !isAuthenticated) {
    return <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: isOpen ? 260 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-slate-900/90 backdrop-blur-xl border-r border-indigo-500/20 flex flex-col z-30 shadow-2xl relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-indigo-500/10">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-3"
              >
                <div className="bg-gradient-to-tr from-indigo-600 to-pink-500 p-2 rounded-xl shadow-lg shadow-indigo-500/30">
                  <Code2 size={22} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                    Ridduu<span className="text-indigo-400">.com</span>
                  </h2>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                    <ShieldCheck size={12} /> Protected Admin
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6 custom-scrollbar">
          {sections.map((section, sIndex) => (
            <div key={sIndex}>
              {isOpen && (
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 px-3">
                  {section.title}
                </p>
              )}

              <div className="space-y-1">
                {section.items.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;

                  return (
                    <div key={index} className="relative group">
                      <Link
                        href={item.path}
                        className={`flex items-center ${
                          isOpen ? "gap-3 px-3 justify-start" : "justify-center"
                        } py-2.5 rounded-xl transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 font-medium"
                            : "hover:bg-slate-800/80 text-slate-300 hover:text-white"
                        }`}
                      >
                        <Icon size={19} className={isActive ? "text-white" : "text-indigo-400 group-hover:text-indigo-300"} />
                        {isOpen && <span className="text-sm tracking-wide">{item.name}</span>}
                      </Link>

                      {!isOpen && (
                        <span className="absolute left-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-slate-900 border border-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none shadow-xl">
                          {item.name}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Logout Button */}
        <div className="p-3 border-t border-indigo-500/10">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${
              isOpen ? "gap-3 px-3 justify-start" : "justify-center"
            } py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all text-sm font-medium`}
          >
            <LogOut size={19} />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-950 p-6 md:p-8 relative">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto space-y-6"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}