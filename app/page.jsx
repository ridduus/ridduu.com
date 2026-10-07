"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Code2,
  Server,
  Terminal,
  Smartphone,
  Database,
  Cloud,
  CheckCircle2,
  GraduationCap,
  Tag,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";

import { useProfile } from "@/context/profileContext";
import { useSettings } from "@/context/settingContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Resume = "/assets/Ronak_Sharma_CV.pdf";

export default function Home() {
  const { profile } = useProfile();
  const { isVisible } = useSettings();

  const [projectsList, setProjectsList] = useState([
    {
      _id: "p1",
      title: "IT Asset Management System",
      desc: "Built enterprise asset management software with Assets, Vendors, Clients, Users, AMC/FMS and Audit Logs. Implemented JWT authentication, RBAC, reporting, document management and production deployment.",
      tags: ["React.js", "TypeScript", "Node.js", "Express.js", "PostgreSQL", "Prisma ORM"],
      logo: "/Ab1.png",
      url: "#",
    },
    {
      _id: "p2",
      title: "Jain Dharohar Mobile App",
      desc: "Published production application on Google Play Store with backend API integration.",
      tags: ["Flutter", "Python"],
      logo: "/Ab1.png",
      url: "#",
      isMobile: true,
    },
    {
      _id: "p3",
      title: "Apna Backup",
      desc: "Developed secure web portal and desktop backup solution supporting incremental and differential backups.",
      tags: ["React.js", "Python", "Desktop Backup Software"],
      logo: "/Ab1.png",
      url: "#",
    },
  ]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setProjectsList(data.data);
        }
      } catch (err) {
        console.error("Projects fetch error:", err);
      }
    }
    fetchProjects();
  }, []);

  const coreSkills = [
    {
      category: "Frontend",
      icon: Code2,
      skills: "React.js, Next.js, HTML5, CSS3, Bootstrap",
    },
    {
      category: "Backend",
      icon: Server,
      skills: "Node.js, Express.js, Flask, Django, REST APIs",
    },
    {
      category: "Languages",
      icon: Terminal,
      skills: "JavaScript, TypeScript, Python, Dart, SQL",
    },
    {
      category: "Mobile",
      icon: Smartphone,
      skills: "Flutter, Firebase",
    },
    {
      category: "Databases",
      icon: Database,
      skills: "PostgreSQL, MS SQL Server, SQLite, MongoDB, Firebase",
    },
    {
      category: "DevOps",
      icon: Cloud,
      skills: "Linux, VPS, Nginx, Git, GitHub, Postman",
    },
    {
      category: "Testing",
      icon: CheckCircle2,
      skills: "Manual Testing, API Testing, QA",
    },
  ];

  const keywords = [
    "React.js",
    "TypeScript",
    "Node.js",
    "Express.js",
    "Flutter",
    "Python",
    "PostgreSQL",
    "WordPress",
    "REST APIs",
    "JWT",
    "Linux",
    "Nginx",
    "Github",
    "MSsql",
    "SQLite",
    "Production Deployment",
  ];

  return (
    <div className="bg-white min-h-screen text-slate-800">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-8 items-center">

          {/* Left Hero Content */}
          <div className="md:col-span-7 space-y-5">
            <p className="text-blue-600 font-semibold text-sm tracking-wide">
              Hello, I'm
            </p>

            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Ronak <span className="text-blue-600">Sharma</span>
            </h1>

            <p className="text-lg md:text-xl font-semibold text-slate-800">
              {profile?.designation || "Full Stack Software Engineer | Team Lead"}
            </p>

            <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-xl">
              I build scalable web, mobile and desktop applications with modern technologies.
              I love solving real-world problems through clean code, efficient architecture
              and user-focused design.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/projects"
                className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 group"
              >
                View My Projects
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/contact"
                className="px-6 py-3 rounded-full border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all flex items-center gap-2"
              >
                <Mail size={16} className="text-slate-500" />
                Get In Touch
              </Link>
            </div>

            {/* Quick Contact Bar */}
            <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-slate-500 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <Phone size={14} className="text-blue-600" />
                <span>+91-8955134408</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail size={14} className="text-blue-600" />
                <span>ronaksharma2350@gmail.com</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-blue-600" />
                <span>Ramganjmandi, Kota, Rajasthan</span>
              </div>
            </div>
          </div>

          {/* Right Hero Avatar */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative">
              <div className="w-64 h-72 md:w-80 md:h-92 rounded-3xl bg-blue-50/60 border border-blue-100 shadow-sm relative overflow-hidden flex items-center justify-center">
                <Image
                  width={340}
                  height={380}
                  src="/ridduu.png"
                  alt="Ronak Sharma"
                  className="rounded-2xl object-contain max-h-full"
                  priority
                />

                {/* Floating Handwritten Style Badge */}
                {/* <div className="absolute right-3 bottom-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm text-[10px] font-mono text-slate-700 leading-tight">
                  <div className="text-blue-600 font-bold">&lt;/&gt;</div>
                  <div>Code</div>
                  <div>Build</div>
                  <div>Deploy</div>
                  <div>Repeat</div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Me & Core Skills Section */}
      <section className="py-16 bg-slate-50/60 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-start">

          {/* Left Column: About Me & Stats */}
          <div className="md:col-span-5 space-y-6">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md mb-2">
                About Me
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-snug">
                Turning Ideas Into <span className="text-blue-600">Real Products</span>
              </h2>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">
              I'm a Full Stack Software Engineer with 3+ years of experience building scalable web, mobile and desktop applications.
              I work with modern technologies like React.js, TypeScript, Node.js, Express.js, Flutter, Python and PostgreSQL.
              I've led development teams, deployed production applications on Linux/VPS with Nginx, and published Android apps on Google Play Store.
            </p>

            {/* Stats Grid matching image */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
              <div>
                <div className="text-2xl font-extrabold text-blue-600">3+</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Years Experience</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-blue-600">5+</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Production Projects</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-blue-600">2</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Mobile Apps Published</div>
              </div>
            </div>
          </div>

          {/* Right Column: Core Skills */}
          <div className="md:col-span-7">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-slate-900">Core Skills</h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {coreSkills.map((skill, idx) => {
                const Icon = skill.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-sm transition-shadow flex items-start gap-3.5"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{skill.category}</h4>
                      <p className="text-xs text-slate-500 leading-normal mt-1">{skill.skills}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Featured Work
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                My Projects
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-md">
                Here are some of the key projects I've worked on, showcasing my skills and experience in building real-world applications.
              </p>
            </div>

            <Link
              href="/projects"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
            >
              View All Projects
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Project Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {projectsList.slice(0, 3).map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Mock Screenshot Banner */}
                  <div className="bg-slate-100 p-4 border-b border-slate-100 flex items-center justify-center h-44">
                    <Image
                      width={280}
                      height={160}
                      src={p.logo || "/Ab1.png"}
                      alt={p.title}
                      className="max-h-full max-w-full object-contain rounded-lg shadow-2xs"
                    />
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-bold text-slate-900">{p.title}</h3>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags?.map((t, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-50 text-blue-600 text-[11px] font-medium px-2.5 py-0.5 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {p.desc}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2">
                  <Link
                    href={p.url || "/projects"}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    View Project <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Experience Section */}
      <section className="py-16 bg-slate-50/60 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs">
                💼
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Professional Experience
              </h2>
            </div>

            <Link
              href="/about"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
            >
              View Full Experience
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-4">
            {/* Experience 1 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs grid md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-950 text-white font-bold text-sm flex items-center justify-center shrink-0">
                  3H
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Software Engineer (Team Lead)</h3>
                  <p className="text-xs text-slate-500">3Handshake Techsoft Pvt. Ltd.</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-1">Jan 2024 – Present</p>
                </div>
              </div>
              <div className="md:col-span-8">
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>Lead development of 5+ production-grade web and mobile applications.</li>
                  <li>Develop enterprise software using React.js, Flutter, Node.js, Python and PostgreSQL.</li>
                  <li>Design secure REST APIs with JWT authentication and Prisma ORM.</li>
                  <li>Deploy and maintain applications on Linux VPS using Nginx.</li>
                  <li>Mentor developers and coordinate end-to-end project delivery.</li>
                </ul>
              </div>
            </div>

            {/* Experience 2 */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs grid md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                  ▲
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Full Stack Developer Intern</h3>
                  <p className="text-xs text-slate-500">Triops Infotech</p>
                  <p className="text-[11px] text-slate-400 font-medium mt-1">Feb 2023 – Jun 2023</p>
                </div>
              </div>
              <div className="md:col-span-8">
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>Developed responsive React.js applications and WordPress websites.</li>
                  <li>Built backend modules using Python (Flask/Django).</li>
                  <li>Participated in testing, debugging and deployment.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education & Key Keywords Section */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-8 items-start">

          {/* Left: Education */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap size={20} className="text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">Education</h3>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <GraduationCap size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Bachelor of Vocational (IT & Networking)</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">2021 – 2024</p>
              </div>
            </div>
          </div>

          {/* Right: Key Keywords */}
          <div className="md:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <Tag size={18} className="text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">Key Keywords</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {keywords.map((kw, i) => (
                <span
                  key={i}
                  className="bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-100/60"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
