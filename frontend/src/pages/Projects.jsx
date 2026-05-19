// Dynamic Projects Code

import { useEffect, useState } from "react";
import { ExternalLink, Calendar } from "lucide-react";
import { useSettings } from "../Context/settingContext";
import AB from "../../public/ab1.png";

const API_BASE = "http://localhost:5000/api"; // change if needed

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isVisible, loading: settingsLoading } = useSettings();

  // Fetch Projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_BASE}/projects`);
        const data = await res.json();

        if (data.success) {
          setProjects(data.data);
        } else {
          setProjects([]);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading || settingsLoading) {
    return (
      <div className="text-center py-20 text-white">
        Loading projects...
      </div>
    );
  }

  // 🔥 FILTER PROJECTS BASED ON SETTINGS
  const visibleProjects = projects.filter((proj) =>
    isVisible("projects", proj.key)
  );

  if (visibleProjects.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        No projects available
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "var(--color-dark)" }} className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-6">
          {/* <p className="text-sm uppercase tracking-widest mb-2" style={{ color: "var(--color-primary)" }}>
            My Projects
          </p> */}
          <h1 className="text-5xl font-black gradient-text">What I have Developed</h1>
          <p className="mt-4 max-w-xl mx-auto" style={{ color: "var(--color-text-muted)" }}>
            A collection of projects I've built — from e-commerce platforms to backup & management tools.
          </p>
        </div>

        {/* Featured Project */}
       {visibleProjects.length > 0 && (
          <>
            {/* ✅ Desktop Featured Layout */}
            <div
              className="hidden md:block mb-10 p-8 md:p-12 rounded-3xl relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,101,132,0.1))",
                border: "1px solid rgba(108,99,255,0.3)",
              }}
            >
              <div className="absolute top-4 right-4 w-80 h-52">
                <img
                  src={visibleProjects[0]?.logo || AB}
                  alt={visibleProjects[0]?.title}
                  className="rounded-xl w-full h-full object-contain"
                />
              </div>

              <div className="relative z-10 max-w-xl">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{
                      backgroundColor: "rgba(108,99,255,0.2)",
                      color: "var(--color-primary)",
                    }}
                  >
                    Featured Project
                  </span>

                  <span
                    className="text-xs flex items-center gap-1"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    <Calendar size={12} /> {visibleProjects[0]?.year}
                  </span>
                </div>

                <h2 className="text-3xl font-black mb-3">
                  {visibleProjects[0]?.title}
                </h2>

                <p className="text-base mb-4 line-clamp-3">
                  {visibleProjects[0]?.desc}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {visibleProjects[0]?.tags?.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <a
                  href={visibleProjects[0]?.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white hover:scale-105 transition"
                  style={{
                    background:
                      "linear-gradient(135deg, #6c63ff, #ff6584)",
                  }}
                >
                  <ExternalLink size={16} /> Book A Demo
                </a>
              </div>
            </div>

            {/* ✅ Mobile View → Normal Card */}
            <div className="md:hidden mb-6">
              <div
                className="p-6 rounded-2xl backdrop-blur bg-white/5 border border-white/10"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,101,132,0.1))",
                  border: "1px solid rgba(108,99,255,0.3)",
                }}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="w-16 h-16 flex items-center justify-center rounded-xl border border-white/10">
                    <img
                      src={visibleProjects[0]?.logo || AB}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>

                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar size={12} /> {visibleProjects[0]?.year}
                  </span>
                </div>

                <h3 className="text-lg font-semibold mb-2">
                  {visibleProjects[0]?.title}
                </h3>

                <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                  {visibleProjects[0]?.desc}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {visibleProjects[0]?.tags?.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href={visibleProjects[0]?.url}
                  target="_blank"
                  className="flex items-center gap-2 text-sm text-indigo-400"
                >
                  <ExternalLink size={14} /> Book A Demo
                </a>
              </div>
            </div>
          </>
        )}

        {/* Project Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleProjects.slice(1).map((proj) => (
            <div
              key={proj._id || proj.title}
              className="p-6 rounded-2xl flex flex-col justify-between h-full transition-all duration-300 hover:scale-[1.02] group"
              style={{
                background:
                  "linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,101,132,0.1))",
                border: "1px solid rgba(108,99,255,0.3)",
              }}
            >
              {/* Top */}
              <div className="flex items-center justify-between mb-4">
                <img
                  src={proj.logo}
                  alt={proj.title}
                  className="object-contain rounded-lg p-1"
                  style={{
                    width: "80px",
                    height: "80px",
                  }}
                />

                <span
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "var(--color-text-muted)" }}
                >
                  <Calendar size={10} /> {proj.year}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2" style={{ color: "var(--color-text)" }}>
                  {proj.title}
                </h3>

                <p className="text-sm leading-relaxed flex-grow mb-4 line-clamp-3" style={{ color: "var(--color-text-muted)" }}>
                  {proj.desc}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {proj.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{ backgroundColor: `${proj.color || "#6c63ff"}15`, color: proj.color || "#6c63ff" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Link */}
              <div className="mt-auto">
                <a
                  href={proj.url !== "#" ? proj.url : undefined}
                  target={proj.url !== "#" ? "_blank" : undefined}
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold transition-all group-hover:gap-3"
                  style={{ color: proj.url !== "#" ? proj.color : "var(--color-text-muted)" }}
                >
                  <ExternalLink size={14} />
                  {proj.url !== "#" ? proj.url.replace("https://", "") : "Coming Soon"}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



// Static Projects Code 

// import { ExternalLink, Calendar } from "lucide-react";
// import AB from "../../public/ablogo.png";
// import Ridduu from "../../public/ridduush.png";
// import BDB from "../../public/bdb.png";
// import Vironi from "../../public/vr.jpeg";
// import Agenda from "../../public/agenda.jpeg";
// import ABA from "../../public/Abl.png";

// const projects = [
//   {
//     title: "Buy Don't Bye",
//     url: "https://www.buydontbye.com",
//     year: "2023",
//     logoWidth: "55px",
//     logoHeight: "55px",
//     Logo: BDB,
//     desc: "A shopping centre platform offering the best prices and items for people. Built with modern web technologies for a seamless shopping experience.",
//     tags: ["E-Commerce", "Web App", "Full Stack"],
//     color: "#6c63ff",
//   },
//   {
//     title: "ridduu.com",
//     url: "https://ridduu-portfolio.vercel.app",
//     year: "2023",
//     logoWidth: "55px",
//     logoHeight: "55px",
//     Logo: Ridduu,
//     desc: "A personal portfolio website showcasing experience, skills, and projects to the world. Designed with modern UI/UX principles.",
//     tags: ["Portfolio", "React", "Frontend"],
//     color: "#ff6584",
//   },
//   {
//     title: "Buy Don't Bye",
//     url: "https://www.buydontbye.com",
//     year: "Available",
//     logoWidth: "100px",
//     logoHeight: "60px",
//     Logo: BDB,
//     desc: "An industry information management system for storing and sharing data between owners and employees securely.",
//     tags: ["Authentication", "Database", "Backend"],
//     color: "#43b89c",
//   },
//   {
//     title: "Vironi Techsoft Website",
//     url: "#",
//     year: "Available",
//     logoWidth: "100px",
//     logoHeight: "55px",
//     Logo: Vironi,
//     desc: "A food delivery platform for a cafe — users can browse delicious items and place delivery orders to their location.",
//     tags: ["Food Delivery", "Web App", "Full Stack"],
//     color: "#f5a623",
//   },
//   {
//     title: "Apna Backup Website",
//     url: "https://www.apnabackup.com",
//     year: "Available",
//     logoWidth: "100px",
//     logoHeight: "55px",
//     Logo: AB,
//     desc: "Official website for Apna Backup software showcasing features, services, and demo booking.",
//     tags: ["Website", "Product", "Cloud"],
//     color: "#4a90e2",
//   },
//   {
//     title: "Apna Agenda App",
//     url: "#",
//     year: "Available",
//     logoWidth: "55px",
//     logoHeight: "55px",
//     Logo: Agenda,
//     desc: "An expense tracking application for organizations to manage and share expense records with team members.",
//     tags: ["Finance", "Dashboard", "Management"],
//     color: "#e056fd",
//   },
//   {
//     title: "Apna Backup App",
//     url: "#",
//     year: "Available",
//     logoWidth: "55px",
//     logoHeight: "55px",
//     Logo: ABA,
//     desc: "A secure backup application for managing and restoring data across multiple storage platforms.",
//     tags: ["Backup", "Security", "Cloud"],
//     color: "#00b894",
//   },
// ];

// export default function Projects() {
//   return (
//     <div style={{ backgroundColor: "var(--color-dark)" }} className="pt-24 pb-20">
//       <div className="max-w-6xl mx-auto px-6">
//         {/* Header */}
//         <div className="text-center mb-16">
//           {/* <p className="text-sm uppercase tracking-widest mb-2" style={{ color: "var(--color-primary)" }}>
//             My Projects
//           </p> */}
//           <h1 className="text-5xl font-black gradient-text">What I have Developed</h1>
//           <p className="mt-4 max-w-xl mx-auto" style={{ color: "var(--color-text-muted)" }}>
//             A collection of projects I've built — from e-commerce platforms to backup & management tools.
//           </p>
//         </div>

//         {/* Featured Project */}
//         <div
//           className="mb-10 p-8 md:p-12 rounded-3xl relative overflow-hidden"
//           style={{
//             background: "linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,101,132,0.1))",
//             border: "1px solid rgba(108,99,255,0.3)",
//             boxShadow: "0 0 7px rgba(108,99,255,0.4)"
//           }}
//         >
//           <div className="absolute top-4 right-4 w-100 h-60">
//             <img src={AB} alt="Apna Backup" className="rounded-xl w-full h-full object-cover" />
//           </div>

//           <div className="relative z-10">
//             <div className="flex items-center gap-3 mb-3">
//               <span
//                 className="px-3 py-1 rounded-full text-xs font-bold"
//                 style={{ backgroundColor: "rgba(108,99,255,0.2)", color: "var(--color-primary)" }}
//               >
//                 Featured Project
//               </span>
//               <span className="text-xs flex items-center gap-1" style={{ color: "var(--color-text-muted)" }}>
//                 <Calendar size={12} /> 2026
//               </span>
//             </div>

//             <h2 className="text-3xl font-black mb-3" style={{ color: "var(--color-text)" }}>
//               Apna Backup Software
//             </h2>

//             <p className="text-base mb-4 max-w-xl" style={{ color: "var(--color-text-muted)" }}>
//               Apna Backup Software is a powerful data backup and recovery solution that ensures secure storage, fast restoration, and seamless management across multiple destinations.
//             </p>

//             <div className="flex flex-wrap gap-2 mb-6">
//               {["Data Protection", "Secure Backup", "AES256", "Cloud Solution", "Auto Backup"].map((t) => (
//                 <span
//                   key={t}
//                   className="px-3 py-1 rounded-full text-xs font-medium"
//                   style={{ backgroundColor: "rgba(108,99,255,0.1)", color: "var(--color-primary)" }}
//                 >
//                   {t}
//                 </span>
//               ))}
//             </div>

//             <a
//               href="https://www.apnabackup.com"
//               target="_blank"
//               rel="noreferrer"
//               className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all hover:scale-105"
//               style={{ background: "linear-gradient(135deg, #6c63ff, #ff6584)" }}
//             >
//               <ExternalLink size={16} /> Book A Demo
//             </a>
//           </div>
//         </div>

//         {/* Project Grid */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {projects.slice(1).map((proj) => (
//             <div
//               key={proj.title}
//               className="p-6 rounded-2xl flex flex-col justify-between h-full transition-all duration-300 hover:scale-[1.02] group"
//               style={{
//                 background: "linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,101,132,0.1))",
//                 border: "1px solid rgba(108,99,255,0.3)",
//                 boxShadow: "0 0 7px rgba(108,99,255,0.4)"
//               }}
//             >
//               {/* Top Section */}
//               <div className="flex items-center justify-between mb-4">
//                 <img
//                   src={proj.Logo}
//                   alt={proj.title}
//                   className="object-contain rounded-lg p-1"
//                   style={{
//                     width: proj.logoWidth || "48px",
//                     height: proj.logoHeight || "48px",
//                     // backgroundColor: proj.title === "Apna Backup App" || proj.title === "ridduu.com" ? "#ffffff" : "transparent",
//                   }}
//                 />

//                 <span
//                   className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
//                   style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "var(--color-text-muted)" }}
//                 >
//                   <Calendar size={10} /> {proj.year}
//                 </span>
//               </div>

//               {/* Content */}
//               <div className="flex flex-col flex-grow">
//                 <h3 className="text-xl font-bold mb-2" style={{ color: "var(--color-text)" }}>
//                   {proj.title}
//                 </h3>

//                 <p className="text-sm leading-relaxed flex-grow mb-4" style={{ color: "var(--color-text-muted)" }}>
//                   {proj.desc}
//                 </p>

//                 {/* Tags */}
//                 <div className="flex flex-wrap gap-2 mb-4">
//                   {proj.tags.map((tag) => (
//                     <span
//                       key={tag}
//                       className="px-2 py-0.5 rounded text-xs font-medium"
//                       style={{ backgroundColor: `${proj.color}15`, color: proj.color }}
//                     >
//                       {tag}
//                     </span>
//                   ))}
//                 </div>
//               </div>

//               {/* Bottom Link */}
//               <div className="mt-auto">
//                 <a
//                   href={proj.url !== "#" ? proj.url : undefined}
//                   target={proj.url !== "#" ? "_blank" : undefined}
//                   rel="noreferrer"
//                   className="flex items-center gap-2 text-sm font-semibold transition-all group-hover:gap-3"
//                   style={{ color: proj.url !== "#" ? proj.color : "var(--color-text-muted)" }}
//                 >
//                   <ExternalLink size={14} />
//                   {proj.url !== "#" ? proj.url.replace("https://", "") : "Coming Soon"}
//                 </a>
//               </div>
//             </div>
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// }