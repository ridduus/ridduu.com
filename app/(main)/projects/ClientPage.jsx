"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ExternalLink, ArrowRight } from "lucide-react";
import { useSettings } from "@/context/settingContext";
import AB from "@/public/Ab1.png";

const API_BASE = "/api";

const defaultProjects = [
  {
    _id: "def1",
    title: "IT Asset Management System",
    desc: "Built enterprise asset management software with Assets, Vendors, Clients, Users, AMC/FMS and Audit Logs. Implemented JWT authentication, RBAC, reporting, document management and production deployment.",
    tags: ["React.js", "TypeScript", "Node.js", "Express.js", "PostgreSQL", "Prisma ORM"],
    logo: AB,
    url: "#",
  },
  {
    _id: "def2",
    title: "Jain Dharohar Mobile App",
    desc: "Published production application on Google Play Store with backend API integration.",
    tags: ["Flutter", "Python"],
    logo: AB,
    url: "#",
  },
  {
    _id: "def3",
    title: "Apna Backup Software",
    desc: "Comprehensive automated backup and recovery software solution ensuring data safety, cloud synchronization, and seamless user management.",
    tags: ["React.js", "Python", "Desktop Backup Software"],
    logo: AB,
    url: "#",
  },
];

export default function Projects({ initialProjects }) {
  const [projects, setProjects] = useState(initialProjects && initialProjects.length > 0 ? initialProjects : defaultProjects);
  const [loading, setLoading] = useState(!initialProjects);

  const { isVisible, loading: settingsLoading } = useSettings();

  useEffect(() => {
    if (initialProjects && initialProjects.length > 0) return;
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_BASE}/projects`);
        const data = await res.json();

        if (data.success && data.data && data.data.length > 0) {
          setProjects(data.data);
        } else {
          setProjects(defaultProjects);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setProjects(defaultProjects);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [initialProjects]);

  if (loading || settingsLoading) {
    return (
      <div className="text-center py-32 text-slate-500 font-medium">
        Loading projects...
      </div>
    );
  }

  const visibleProjects = projects.filter((proj) =>
    isVisible("projects", proj.key || proj._id || proj.title)
  );

  const displayList = visibleProjects;


  return (
    <div className="bg-white pb-20 text-slate-800">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header matching reference image */}
        <div className="text-center mb-12 space-y-2">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Featured Work
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900">
            My <span className="text-blue-600">Projects</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 max-w-xl mx-auto">
            Here are some of the key projects I've worked on, showcasing my skills and experience in building real-world web and mobile applications.
          </p>
        </div>

        {/* Featured Top Card */}
        {displayList.length > 0 && (
          <div className="mb-10 p-6 md:p-8 rounded-2xl bg-slate-50/70 border border-slate-200/80 shadow-2xs">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <h2 className="text-2xl font-extrabold text-slate-900">
                  {displayList[0]?.title}
                </h2>

                {displayList[0]?.tags && (
                  <div className="flex flex-wrap gap-1.5">
                    {displayList[0].tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-50 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  {displayList[0]?.desc}
                </p>

                {displayList[0]?.url && (
                  <a
                    href={displayList[0]?.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-xs text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm"
                  >
                    View Project <ExternalLink size={14} />
                  </a>
                )}
              </div>

              <div className="flex justify-center bg-white p-4 rounded-xl border border-slate-200/60 shadow-2xs">
                <Image
                  width={380}
                  height={240}
                  src={displayList[0]?.logo || AB}
                  alt={displayList[0]?.title || "Project"}
                  className="rounded-lg max-h-56 object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {/* Grid for other projects */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayList.slice(1).map((p) => (
            <div
              key={p._id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="h-40 w-full mb-3 bg-slate-50 rounded-xl p-3 flex items-center justify-center border border-slate-100">
                  <Image
                    width={280}
                    height={160}
                    src={p.logo || AB}
                    alt={p.title || "Project"}
                    className="max-h-full max-w-full object-contain rounded-lg"
                  />
                </div>

                <h3 className="text-base font-bold text-slate-900">{p.title}</h3>

                {p.tags && (
                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-50 text-blue-600 text-[11px] font-medium px-2 py-0.5 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{p.desc}</p>
              </div>

              <div className="pt-4">
                {p.url && (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    View Project <ArrowRight size={12} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}