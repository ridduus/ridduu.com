"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Code2 } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/skills", label: "Skills" },
  { to: "/projects", label: "Projects" },
  { to: "/reviews", label: "Reviews" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "#ffff" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(108,99,255,0.2)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6c63ff, #ff6584)" }}
          >
            <Code2 size={18} color="white" />
          </div>
          <span className="text-xl font-bold gradient-text">Ronak Sharma</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              href={l.to}
              className={`text-sm font-medium transition-colors duration-200 relative group
              relative w-fit flex items-center gap-2 
              after:content-[''] after:absolute after:left-0 after:-bottom-1 
              after:h-[2px] after:w-0 after:bg-orange-500 
              after:transition-all after:duration-300 
              hover:after:w-full`}
              style={{
                color: pathname === l.to ? "var(--color-primary)" : "var(--color-text-muted)",
              }}
            >
              {l.label}
              <span
                className="absolute -bottom-1 left-0 h-0.5 transition-all duration-200"
                style={{
                  backgroundColor: "#6c63ff",
                  width: pathname === l.to ? "100%" : "0%",
                }}
              />
            </Link>
          ))}
          <Link
            href="/contact"
            className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:scale-105"
            style={{ background: "linear-gradient(135deg, #6c63ff, #ff6584)" }}
          >
            Coffee With Me
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-lg"
          style={{ color: "var(--color-text)" }}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-4"
          style={{ backgroundColor: "#ffff", borderTop: "1px solid rgba(108,99,255,0.2)" }}
        >
          {links.map((l) => (
            <Link
              key={l.to}
              href={l.to}
              className="text-base font-medium py-2 border-b transition-colors"
              style={{
                color: pathname === l.to ? "var(--color-primary)" : "var(--color-text)",
                borderColor: "rgba(255,255,255,0.05)",
              }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="px-5 py-3 rounded-full text-center font-semibold text-white mt-2"
            style={{ background: "linear-gradient(135deg, #6c63ff, #ff6584)" }}
          >
            Coffee With Me
          </Link>
        </div>
      )}
    </nav>
  );
}
