// const skillCategories = [
//   {
//     title: "Frontend Developer",
//     icon: "🎨",
//     color: "#6c63ff",
//     skills: [
//       { name: "HTML", level: "Advanced", pct: 90 },
//       { name: "CSS", level: "Advanced", pct: 88 },
//       { name: "JavaScript", level: "Intermediate", pct: 70 },
//       { name: "Bootstrap", level: "Advanced", pct: 85 },
//       { name: "React.js", level: "Intermediate", pct: 72 },
//       { name: "Next.js", level: "Intermediate", pct: 68 },
//       { name: "Vite React", level: "Intermediate", pct: 65 },
//       { name: "Flutter", level: "Intermediate", pct: 68 },
//       { name: "Dart", level: "Basic", pct: 40 },
//       { name: "Github", level: "Intermediate", pct: 65 },
//     ],
//   },
//   {
//     title: "Backend Developer",
//     icon: "⚙️",
//     color: "#ff6584",
//     skills: [
//       { name: "Node.js", level: "Intermediate", pct: 68 },
//       { name: "Express.js", level: "Intermediate", pct: 65 },
//       { name: "Python", level: "Intermediate", pct: 75 },
//       { name: "Django", level: "Intermediate", pct: 80 },
//       { name: "Flask", level: "Intermediate", pct: 85 },
//       { name: "Sqlite", level: "Intermediate", pct: 85 },
//       { name: "MySql", level: "Intermediate", pct: 65 },
//       { name: "PostgreSql", level: "Intermediate", pct: 68 },
//       { name: "MongoDB", level: "Intermediate", pct: 72 },
//       { name: "Firebase", level: "Intermediate", pct: 80 },
//       { name: "Postman", level: "Intermediate", pct: 95 },
//     ],
//   },
//   {
//     title: "Network Engineer",
//     icon: "🌐",
//     color: "#43b89c",
//     skills: [
//       { name: "Router Configuration", level: "Intermediate", pct: 70 },
//       { name: "Firewalls Configuration", level: "Advanced", pct: 85 },
//       { name: "Switch Configuration", level: "Intermediate", pct: 70 },
//       { name: "Access Point Config", level: "Intermediate", pct: 68 },
//       { name: "Point 2 Point Config", level: "Intermediate", pct: 65 },
//       { name: "Putty", level: "Intermediate", pct: 70 },
//       { name: "Rack Configuration", level: "Intermediate", pct: 68 },
//       { name: "Optical Fiber Splicing", level: "Intermediate", pct: 65 },
//       { name: "CCTV Configuration", level: "Intermediate", pct: 67 },
//     ],
//   },
//   {
//     title: "Hardware & Software",
//     icon: "🔧",
//     color: "#f5a623",
//     skills: [
//       { name: "Computer Assembling", level: "Intermediate", pct: 72 },
//       { name: "RAM Installation", level: "Intermediate", pct: 78 },
//       { name: "SSD/HDD Installation", level: "Intermediate", pct: 78 },
//       { name: "Battery Installation", level: "Intermediate", pct: 75 },
//       { name: "Printer Installation", level: "Intermediate", pct: 72 },
//       { name: "Projector Installation", level: "Intermediate", pct: 70 },
//       { name: "Rack Installation", level: "Intermediate", pct: 68 },
//       { name: "OS Installation", level: "Intermediate", pct: 80 },
//       { name: "AWS Cloud Computing", level: "Intermediate", pct: 60 },
//     ],
//   },
// ];

// const levelColor = {
//   Advanced: "#43b89c",
//   Intermediate: "#6c63ff",
//   Basic: "#f5a623",
// };

// function SkillBar({ name, level, pct, accentColor }) {
//   return (
//     <div className="mb-4">
//       <div className="flex justify-between items-center mb-1.5">
//         <span className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
//           {name}
//         </span>
//         <span
//           className="text-xs px-2 py-0.5 rounded-full font-semibold"
//           style={{
//             backgroundColor: `${levelColor[level]}20`,
//             color: levelColor[level],
//           }}
//         >
//           {level}
//         </span>
//       </div>
//       <div
//         className="h-2 rounded-full overflow-hidden"
//         style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
//       >
//         <div
//           className="h-full rounded-full transition-all duration-700"
//           style={{
//             width: `${pct}%`,
//             background: `linear-gradient(90deg, ${accentColor}, ${accentColor}99)`,
//           }}
//         />
//       </div>
//     </div>
//   );
// }

// export default function Skills() {
//   return (
//     <div style={{ backgroundColor: "var(--color-dark)" }} className="pt-24 pb-20">
//       <div className="max-w-6xl mx-auto px-6">
//         {/* Header */}
//         <div className="text-center mb-16">
//           <p className="text-sm uppercase tracking-widest mb-2" style={{ color: "var(--color-primary)" }}>
//             My Technical Level
//           </p>
//           <h1 className="text-5xl font-black gradient-text">Skills</h1>
//           <p className="mt-4 max-w-xl mx-auto" style={{ color: "var(--color-text-muted)" }}>
//             A comprehensive overview of my technical expertise across development, networking, and hardware.
//           </p>
//         </div>

//         {/* Skill Categories */}
//         <div className="grid md:grid-cols-2 gap-8">
//           {skillCategories.map((cat) => (
//             <div
//               key={cat.title}
//               className="p-8 rounded-2xl"
//               style={{
//                 backgroundColor: "var(--color-dark-3)",
//                 border: `1px solid ${cat.color}30`,
//               }}
//             >
//               <div className="flex items-center gap-3 mb-6">
//                 <span className="text-3xl">{cat.icon}</span>
//                 <h2 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>
//                   {cat.title}
//                 </h2>
//               </div>
//               {cat.skills.map((skill) => (
//                 <SkillBar key={skill.name} {...skill} accentColor={cat.color} />
//               ))}
//             </div>
//           ))}
//         </div>

//         {/* Proficiency Legend */}
//         <div
//           className="mt-12 p-6 rounded-2xl flex flex-wrap justify-center gap-8"
//           style={{ backgroundColor: "var(--color-dark-2)", border: "1px solid rgba(255,255,255,0.05)" }}
//         >
//           {Object.entries(levelColor).map(([level, color]) => (
//             <div key={level} className="flex items-center gap-2">
//               <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
//               <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
//                 {level}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }



// import {
//   FaHtml5,
//   FaCss3Alt,
//   FaJs,
//   FaReact,
//   FaNodeJs,
//   FaGithub,
//   FaDocker,
//   FaPython,
// } from "react-icons/fa";

// import {
//   SiSass,
//   SiFirebase,
//   SiMongodb,
//   SiNextdotjs,
//   SiFlutter,
//   SiDjango,
//   SiFlask,
//   SiPostgresql,
//   SiMysql,
//   SiVite,
//   SiBootstrap,
//   SiPython,
//   SiExpress,
//   SiPostman,
//   SiSqlite,
// } from "react-icons/si";

// const skills = [
//   { name: "HTML", icon: <FaHtml5 />, color: "#e34c26" },
//   { name: "CSS", icon: <FaCss3Alt />, color: "#264de4" },
//   { name: "Bootstrap", icon: <SiBootstrap />, color: "#7966cc" },
//   { name: "JavaScript", icon: <FaJs />, color: "#f7df1e" },
//   { name: "React JS", icon: <FaReact />, color: "#61dafb" },
//   { name: "Next JS", icon: <SiNextdotjs />, color: "#ffffff" },
//   { name: "Vite+React", icon: <SiVite />, color: "#cc6699" },
//   { name: "Flutter", icon: <SiFlutter />, color: "#02569b" },
//   { name: "Node JS", icon: <FaNodeJs />, color: "#68a063" },
//   { name: "Python", icon: <SiPython />, color: "#68a063" },
//   { name: "Express", icon: <SiExpress />, color: "#68a063" },
//   { name: "Django", icon: <SiDjango />, color: "#092e20" },
//   { name: "Flask", icon: <SiFlask />, color: "#ffffff" },
//   { name: "Firebase", icon: <SiFirebase />, color: "#ffca28" },
//   { name: "MongoDB", icon: <SiMongodb />, color: "#4db33d" },
//   { name: "SqLite", icon: <SiSqlite />, color: "#4db33d" },
//   { name: "MySQL", icon: <SiMysql />, color: "#00758f" },
//   { name: "PostgreSQL", icon: <SiPostgresql />, color: "#336791" },
//   { name: "GitHub", icon: <FaGithub />, color: "#ffffff" },
//   { name: "PostMan", icon: <SiPostman />, color: "#0db7ed" },
// ];

// export default function Skills() {
//   return (
//     <div style={{ backgroundColor: "var(--color-dark)" }} className="pt-24 pb-20">
//       <div className="max-w-6xl mx-auto px-6">

//         {/* Header */}
//         <div className="text-center mb-16">
//           <p
//             className="text-sm uppercase tracking-widest mb-2"
//             style={{ color: "#facc15" }}
//           >
//             What I do
//           </p>

//           <h1 className="text-5xl font-black text-yellow-400 mb-4">
//             Skills
//           </h1>

//           <p className="max-w-2xl mx-auto text-sm text-gray-400">
//             I am a Full Stack Developer specializing in modern web & mobile
//             technologies, backend systems, and deployment.
//           </p>
//         </div>

//         {/* Skills Grid */}
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">

//           {skills.map((skill, i) => (
//             <div
//               key={i}
//               className="group p-6 rounded-xl text-center transition-all duration-300"
//               style={{
//                 backgroundColor: "#111",
//                 border: "1px solid rgba(255,255,255,0.05)",
//               }}
//             >
//               <div
//                 className="text-4xl justify-items-center mb-4 transition-all duration-300 group-hover:scale-110"
//                 style={{ color: skill.color }}
//               >
//                 {skill.icon}
//               </div>

//               <h3 className="text-sm font-semibold text-gray-300 group-hover:text-white">
//                 {skill.name}
//               </h3>
//             </div>
//           ))}

//         </div>
//       </div>
//     </div>
//   );
// }



import { useEffect, useState } from "react";

// import ALL icons
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";

const API_BASE = "http://localhost:5000/api";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Dynamic Icon Resolver (NO mapping needed)
  const getIcon = (iconName) => {
    if (!iconName) return FaIcons.FaReact;

    // try both libraries
    return (
      FaIcons[iconName] ||
      SiIcons[iconName] ||
      FaIcons.FaReact // fallback
    );
  };

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch(`${API_BASE}/skills`);
        const data = await res.json();

        if (data.success) {
          setSkills(data.data);
        } else {
          setSkills([]);
        }
      } catch (err) {
        console.error("Error fetching skills:", err);
        setSkills([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-white">
        Loading skills...
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "var(--color-dark)" }} className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          {/* <p
            className="text-sm uppercase tracking-widest mb-2"
            style={{ color: "#facc15" }}
          >
            What I do
          </p> */}

          <h1 className="text-5xl font-black gradient-text">
            What I do
          </h1>

          <p className="mt-4 max-w-xl mx-auto">
            I am a Full Stack Developer specializing in modern web & mobile
            technologies, backend systems, and deployment.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">

          {skills.map((skill, i) => {
            const IconComponent = getIcon(skill.icon);

            return (
              <div
                key={skill._id || i}
                className="group p-6 rounded-xl text-center transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,101,132,0.1))",
                  border: "1px solid rgba(108,99,255,0.3)",
                  boxShadow: "0 0 7px rgba(108,99,255,0.4)"
                }}
              >
                <div
                  className="text-4xl flex justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ color: skill.color }}
                >
                  <IconComponent />
                </div>

                <h3 className="text-sm font-semibold text-black-300 group-hover:text-black">
                  {skill.name}
                </h3>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}