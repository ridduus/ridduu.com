"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Download } from "lucide-react";
import { useProfile } from "@/context/profileContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/skills", label: "Skills" },
  { to: "/reviews", label: "Reviews" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { profile } = useProfile();
  const cvUrl = profile?.cv || "/assets/Ronak_Sharma_CV.pdf";

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md ${scrolled ? "shadow-sm border-b border-slate-200/80 py-2.5" : "border-b border-slate-100 py-3.5"
        }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo matching image: RS badge + Ronak Sharma */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
            RS
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">
            Ronak Sharma
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => {
            const isActive = pathname === l.to;
            return (
              <Link
                key={l.to}
                href={l.to}
                className={`text-sm font-medium transition-colors duration-200 relative py-1 ${isActive ? "text-blue-600 font-semibold" : "text-slate-600 hover:text-blue-600"
                  }`}
              >
                {l.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </Link>
            );
          })}

          {/* Download Resume Button */}
          <a
            href={cvUrl}
            download="Ronak_Sharma_CV.pdf"
            className="px-4 py-2 rounded-full text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 flex items-center gap-1.5 shadow-2xs"
          >
            <Download size={14} className="text-slate-500" />
            Download Resume
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
          onClick={() => setOpen(!open)}
          aria-label="Toggle Navigation Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {open && (
        <div className="md:hidden px-6 pb-6 pt-3 flex flex-col gap-2.5 bg-white border-b border-slate-200 shadow-xl">
          {links.map((l) => {
            const isActive = pathname === l.to;
            return (
              <Link
                key={l.to}
                href={l.to}
                className={`text-sm font-medium py-2 px-3 rounded-lg transition-all ${isActive
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                {l.label}
              </Link>
            );
          })}

          <a
            href={cvUrl}
            download="Ronak_Sharma_CV.pdf"
            className="px-4 py-2.5 rounded-full text-center text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 mt-2"
          >
            <Download size={14} />
            Download Resume
          </a>
        </div>
      )}
    </nav>
  );
}
