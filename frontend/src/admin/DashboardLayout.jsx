import { Link, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
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
} from "lucide-react";

export default function DashboardLayout() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const sections = [
    {
      title: "Overview",
      items: [
        { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "Portfolio",
      items: [
        { name: "Projects", path: "/admin/projects", icon: FolderKanban },
        { name: "Skills & Tech", path: "/admin/skills", icon: Star },
        { name: "Education", path: "/admin/education", icon: GraduationCap },
        { name: "Experience", path: "/admin/experience", icon: BriefcaseBusinessIcon },
      ],
    },
    {
      title: "Community",
      items: [
        { name: "Review Requests", path: "/admin/review-requests", icon: MessageCircle },
        { name: "Live Reviews", path: "/admin/reviews", icon: MessageSquare },
      ],
    },
    {
      title: "Content",
      items: [
        { name: "Contact Messages", path: "/admin/contacts", icon: Phone },
        { name: "About Section", path: "/admin/profile", icon: User },
        { name: "Settings", path: "/admin/settings", icon: Settings },
      ],
    },
  ];

  return (
    <div className="flex h-screen text-white bg-gray-800">

      {/* Sidebar */}
      <motion.aside
        animate={{ width: isOpen ? 225 : 80 }}
        className="bg-black/40 backdrop-blur-xl border-r border-gray-800 flex flex-col transition-all duration-50"
        style={{
          background: "linear-gradient(135deg, rgba(21, 13, 176, 0.84), rgba(255,101,132,0.1))",
          border: "1px solid rgba(108,99,255,0.3)",
          boxShadow: "0 0 0px rgba(108,99,255,0.4)"
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          {isOpen && (
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Code2 size={20} />
              </div>
              <h2 className="text-xl font-bold">ridduu.com</h2>
            </div>
          )}

          {/* Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
          >
            {isOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {sections.map((section, sIndex) => (
            <div key={sIndex}>
              {isOpen && (
                <p className="text-xs uppercase text-gray-400 mb-2 px-2">
                  {section.title}
                </p>
              )}

              <div className="flex flex-col gap-2">
                {section.items.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative group"
                    >
                      <Link
                        to={item.path}
                        className={`flex items-center ${isOpen ? "gap-3 px-4 justify-start" : "justify-center"
                          } py-3 rounded-xl transition-all duration-300 ${isActive
                            ? "bg-indigo-600 text-white shadow-lg"
                            : "hover:bg-gray-800 text-gray-300"
                          }`}
                      >
                        <Icon size={18} />

                        {/* Text */}
                        {isOpen && <span>{item.name}</span>}
                      </Link>

                      {/* Tooltip (only when closed) */}
                      {!isOpen && (
                        <span className="absolute left-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900 text-xs px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition">
                          {item.name}
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </motion.aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}