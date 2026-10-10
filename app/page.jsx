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
  Briefcase,
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

  const [experienceList, setExperienceList] = useState([]);
  const [educationList, setEducationList] = useState([]);

  const getLogoSrc = (logo) => {
    if (!logo) return null;
    if (logo.startsWith("data:image") || logo.startsWith("http") || logo.startsWith("/")) {
      return logo;
    }
    return `data:image/jpeg;base64,${logo}`;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, expRes, eduRes] = await Promise.all([
          fetch("/api/projects", { cache: "no-store" }),
          fetch("/api/experience", { cache: "no-store" }),
          fetch("/api/education", { cache: "no-store" }),
        ]);

        const [projData, expData, eduData] = await Promise.all([
          projRes.json(),
          expRes.json(),
          eduRes.json(),
        ]);

        if (projData.success && projData.data && projData.data.length > 0) {
          setProjectsList(projData.data);
        }
        if (expData.success && expData.data) {
          setExperienceList(expData.data);
        }
        if (eduData.success && eduData.data) {
          setEducationList(eduData.data);
        }
      } catch (err) {
        console.error("Home page fetch error:", err);
      }
    }
    fetchData();
  }, []);

  const servicesList = [
    {
      key: "softwareService",
      title: "Software Development",
      icon: Code2,
      iconImg: "/soft.png",
      desc: "Custom scalable web, mobile and desktop software tailored to business workflows.",
    },
    {
      key: "webService",
      title: "Website Development",
      icon: Server,
      iconImg: "/Web.png",
      desc: "Modern responsive web applications built using React.js, Next.js, and Node.js.",
    },
    {
      key: "mobileAppService",
      title: "Mobile App Development",
      icon: Smartphone,
      iconImg: "/app.png",
      desc: "Cross-platform Android & iOS applications published on Google Play Store.",
    },
    {
      key: "iotService",
      title: "IOT Development",
      icon: Terminal,
      iconImg: "/iot.png",
      desc: "Embedded device communications, real-time protocols, and smart hardware web portals.",
    },
    {
      key: "webHostingService",
      title: "Web Hosting & VPS",
      icon: Cloud,
      iconImg: "/host.png",
      desc: "Production server configuration on Linux VPS with Nginx, SSL, and custom domain setup.",
    },
    {
      key: "appDeplyService",
      title: "App Deployment",
      icon: CheckCircle2,
      iconImg: "/play.png",
      desc: "Automated deployment, CI/CD setup, production maintenance, and API integrations.",
    },
  ];


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

  return (
    <div className="bg-white min-h-screen text-slate-800">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-16 md:pb-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-8 items-center">

          {/* Left Hero Content */}
          <div className="md:col-span-7 space-y-5">
            <p className="text-blue-600 font-semibold text-sm tracking-wide">
              Hello, I'm
            </p>

            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {profile?.name ? (
                <>
                  {profile.name.split(" ")[0]}{" "}
                  <span className="text-blue-600">{profile.name.split(" ").slice(1).join(" ")}</span>
                </>
              ) : (
                <>
                  Ronak <span className="text-blue-600">Sharma</span>
                </>
              )}
            </h1>

            <p className="text-lg md:text-xl font-semibold text-slate-800">
              {profile?.designation || "Full Stack Software Engineer | Team Lead"}
            </p>

            <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-xl">
              {profile?.desc1 || "I build scalable web, mobile and desktop applications with modern technologies. I love solving real-world problems through clean code, efficient architecture and user-focused design."}
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
                <span>{profile?.phone || "+91-8955134408"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail size={14} className="text-blue-600" />
                <span>{profile?.email || "ronaksharma2350@gmail.com"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-blue-600" />
                <span>{profile?.location || "Ramganjmandi, Kota, Rajasthan"}</span>
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

            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {profile?.desc1 || "I'm a Full Stack Software Engineer with 4+ years of experience building scalable web, mobile and desktop applications. I work with modern technologies like React.js, TypeScript, Node.js, Express.js, Flutter, Python and PostgreSQL."}
            </p>

            {/* Stats Grid matching image */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
              {profile?.stats && profile.stats.length > 0 ? (
                profile.stats.map((s, idx) => (
                  <div key={s._id || idx}>
                    <div className="text-2xl font-extrabold text-blue-600">{s.value}</div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</div>
                  </div>
                ))
              ) : (
                <>
                  <div>
                    <div className="text-2xl font-extrabold text-blue-600">4+</div>
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
                </>
              )}
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
            {projectsList
              .filter((p) => isVisible("projects", p.key || p._id))
              .slice(0, 3)
              .map((p) => (

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

      {/* Services Section */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10 space-y-2">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Services
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              What I <span className="text-blue-600">Offer</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-500 max-w-xl mx-auto">
              High quality software engineering, mobile development, and cloud services.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesList
              .filter((s) => isVisible("services", s.key))
              .map((service) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.key}
                    className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow space-y-3"
                  >
                    <div className="w-11 h-11 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-center shrink-0 p-2 overflow-hidden">
                      {service.iconImg ? (
                        <img src={service.iconImg} alt={service.title} className="w-full h-full object-contain" />
                      ) : (
                        <Icon size={20} className="text-blue-600" />
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{service.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{service.desc}</p>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* Experience & Education Animated Network Section */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        {/* Background Network Graphic accents */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-slate-950 pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 space-y-2">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-950/80 border border-blue-800/50 px-4 py-1.5 rounded-full shadow-lg shadow-blue-500/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Career & Learning Network
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Experience & <span className="bg-gradient-to-r from-blue-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">Education</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
              Interactive timeline of professional roles and academic achievements connected via animated node graph.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Experience Column */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Briefcase size={18} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Experience Network</h3>
                </div>
                <Link
                  href="/about"
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 group"
                >
                  View All
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Connected Circle Nodes */}
              <div className="relative pl-9 space-y-8 before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-emerald-500 before:to-teal-500">
                {experienceList.length > 0 ? (
                  experienceList.map((item, i) => {
                    const is3H = (item.company || "").toLowerCase().includes("3handshake") || (item.role || "").toLowerCase().includes("3handshake");
                    return (
                      <div key={item._id || i} className="relative group">
                        {/* Animated Network Circle Node */}
                        <div className="absolute -left-[37px] top-3.5 z-10">
                          <div className="relative flex items-center justify-center">
                            <span className={`animate-ping absolute inline-flex h-8 w-8 rounded-full opacity-75 ${is3H ? "bg-blue-400/40" : "bg-emerald-400/40"}`} />
                            <div className={`w-9 h-9 rounded-full bg-slate-950 border-2 ${is3H ? "border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.6)]" : "border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.6)]"} flex items-center justify-center overflow-hidden p-1 group-hover:scale-110 transition-transform duration-300`}>
                              {getLogoSrc(item.logo) ? (
                                <img src={getLogoSrc(item.logo)} alt={item.company} className="w-full h-full object-contain rounded-full" />
                              ) : (
                                <span className={`font-bold text-[10px] ${is3H ? "text-blue-400" : "text-emerald-400"}`}>{item.company?.substring(0, 2).toUpperCase() || "EX"}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className={`p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-sm transition-all duration-300 space-y-2 ${is3H ? "group-hover:border-blue-500/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]" : "group-hover:border-emerald-500/50 group-hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]"}`}>
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <h4 className={`text-sm font-bold text-white transition-colors ${is3H ? "group-hover:text-blue-300" : "group-hover:text-emerald-300"}`}>
                              {item.role || item.company}
                            </h4>
                            <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${is3H ? "text-blue-300 bg-blue-950/80 border border-blue-800/60" : "text-emerald-300 bg-emerald-950/80 border border-emerald-800/60"}`}>
                              {item.period}
                            </span>
                          </div>
                          <p className={`text-xs font-medium ${is3H ? "text-indigo-400" : "text-emerald-400"}`}>{item.company}</p>
                          {item.desc && (
                            <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-700/50 whitespace-pre-line">
                              {item.desc}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="relative group">
                    <div className="absolute -left-[37px] top-3.5 z-10">
                      <div className="relative flex items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-400/40 opacity-75" />
                        <div className="w-9 h-9 rounded-full bg-slate-950 border-2 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.6)] flex items-center justify-center overflow-hidden p-1">
                          <span className="text-blue-400 font-bold text-[10px]">3H</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-sm space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h4 className="text-sm font-bold text-white">Software Engineer (Team Lead)</h4>
                        <span className="text-[10px] font-semibold text-blue-300 bg-blue-950/80 border border-blue-800/60 px-2.5 py-0.5 rounded-full">
                          Jan 2024 – Present
                        </span>
                      </div>
                      <p className="text-xs font-medium text-indigo-400">3Handshake Techsoft Pvt. Ltd.</p>
                      <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-700/50">
                        Lead development of production web and mobile apps.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Education Column */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <GraduationCap size={18} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Education Network</h3>
                </div>
              </div>

              {/* Connected Circle Nodes */}
              <div className="relative pl-9 space-y-8 before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-teal-500 before:to-cyan-500">
                {educationList.length > 0 ? (
                  educationList.map((item, i) => (
                    <div key={item._id || i} className="relative group">
                      {/* Animated Network Circle Node */}
                      <div className="absolute -left-[37px] top-3.5 z-10">
                        <div className="relative flex items-center justify-center">
                          <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-emerald-400/40 opacity-75" />
                          <div className="w-9 h-9 rounded-full bg-slate-950 border-2 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.6)] flex items-center justify-center overflow-hidden p-1 group-hover:scale-110 transition-transform duration-300">
                            {getLogoSrc(item.logo) ? (
                              <img src={getLogoSrc(item.logo)} alt={item.university} className="w-full h-full object-contain rounded-full" />
                            ) : (
                              <GraduationCap size={16} className="text-emerald-400" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-sm group-hover:border-emerald-500/50 group-hover:shadow-[0_0_20px_rgba(52,211,153,0.15)] transition-all duration-300 space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                            {item.degree || item.university}
                          </h4>
                          <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                            {item.period}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-emerald-400">{item.university}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="relative group">
                    <div className="absolute -left-[37px] top-3.5 z-10">
                      <div className="relative flex items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-emerald-400/40 opacity-75" />
                        <div className="w-9 h-9 rounded-full bg-slate-950 border-2 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.6)] flex items-center justify-center overflow-hidden p-1">
                          <GraduationCap size={16} className="text-emerald-400" />
                        </div>
                      </div>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 backdrop-blur-sm space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h4 className="text-sm font-bold text-white">Bachelor of Vocational (IT & Networking)</h4>
                        <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                          2021 – 2024
                        </span>
                      </div>
                      <p className="text-xs font-medium text-emerald-400">University</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
