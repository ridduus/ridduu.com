import { Link } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";
import {
  Github,
  Linkedin,
  Mail,
  Heart,
  Phone,
  Code2,
  User,
  Folder,
  Star,
  MessageSquare,
} from "lucide-react";

export default function Footer() {
  const { profile } = useProfile();
  const navItems = [
    { path: "/about", label: "about", icon: <User size={14} /> },
    { path: "/projects", label: "projects", icon: <Folder size={14} /> },
    { path: "/reviews", label: "reviews", icon: <Star size={14} /> },
    { path: "/contact", label: "contact", icon: <MessageSquare size={14} /> },
  ];

  return (
    <footer
      className="border-t py-10"
      style={{
        borderColor: "rgba(108,99,255,0.2)",
        backgroundColor: "var(--color-dark-2)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 group">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #6c63ff, #ff6584)",
                }}
              >
                <Code2 size={18} color="white" />
              </div>
              <span className="text-xl font-bold gradient-text">
                ridduu.com
              </span>
            </Link>

            <p
              className="text-sm mt-2"
              style={{ color: "var(--color-text-muted)" }}
            >
              Full Stack Developer crafting modern web and mobile applications. I combine creativity with technical expertise to create seamless UI/UX and deliver scalable, high-performance solutions from development to deployment.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="font-semibold mb-3"
              style={{ color: "var(--color-text)" }}
            >
              Quick Links
            </h4>

            <div
              className="grid gap-2 text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative w-fit flex items-center gap-2 capitalize 
                    after:content-[''] after:absolute after:left-0 after:-bottom-1 
                    after:h-[2px] after:w-0 after:bg-blue-500 
                    after:transition-all after:duration-300 
                    hover:after:w-full"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="font-semibold mb-3"
              style={{ color: "var(--color-text)" }}
            >
              Get In Touch
            </h4>

            <div
              className="flex flex-col gap-2 text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              <a
                href="mailto:ronaksharma2350@gmail.com"
                className="relative w-fit flex items-center gap-2 
                  after:content-[''] after:absolute after:left-0 after:-bottom-1 
                  after:h-[2px] after:w-0 after:bg-blue-500 
                  after:transition-all after:duration-300 
                  hover:after:w-full"
              >
                <Mail size={14} /> {profile?.email}
              </a>

              <a
                href="https://wa.me/918955134408"
                className="relative w-fit flex items-center gap-2 
                  after:content-[''] after:absolute after:left-0 after:-bottom-1 
                  after:h-[2px] after:w-0 after:bg-blue-500 
                  after:transition-all after:duration-300 
                  hover:after:w-full"
              >
                <Phone size={14} /> {profile?.phone}
              </a>
            </div>

            <div className="flex gap-4 mt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg transition-all hover:scale-110"
                style={{
                  backgroundColor: "rgba(108,99,255,0.15)",
                  color: "var(--color-primary)",
                }}
              >
                <Github size={18} />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg transition-all hover:scale-110"
                style={{
                  backgroundColor: "rgba(108,99,255,0.15)",
                  color: "var(--color-primary)",
                }}
              >
                <Linkedin size={18} />
              </a>

              <a
                href="mailto:ronaksharma2350@gmail.com"
                className="p-2 rounded-lg transition-all hover:scale-110"
                style={{
                  backgroundColor: "rgba(50, 20, 84, 0.15)",
                  color: "var(--color-primary)",
                }}
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="pt-6 text-center text-sm flex items-center justify-center gap-1 flex-wrap"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.05)",
            color: "var(--color-text-muted)",
          }}
        >
          © 2024 ridduu.com · Made with{" "}
          <Heart size={14} className="text-red-400" /> by Ronak Sharma ·
          All rights reserved
        </div>
      </div>
    </footer>
  );
}