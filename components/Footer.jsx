"use client";
import Link from "next/link";
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/80 py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
            RS
          </div>
          <span className="text-sm font-bold text-slate-900">
            Ronak Sharma
          </span>
        </Link>

        {/* Center Credit */}
        <div className="text-xs text-slate-500 font-medium">
          Built with <span className="text-rose-500">❤️</span> by Ronak Sharma
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-4 text-slate-500">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-blue-600 transition-colors"
            aria-label="GitHub"
          >
            <FaGithub size={18} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-blue-600 transition-colors"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={18} />
          </a>
          <a
            href="mailto:ronaksharma2350@gmail.com"
            className="hover:text-blue-600 transition-colors"
            aria-label="Email"
          >
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}