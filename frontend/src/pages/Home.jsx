// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { ArrowDown, Download, Mail, Github, Linkedin, Code2, Network, Cpu } from "lucide-react";
// import { useProfile } from "../context/ProfileContext";
// import { useSettings } from "../Context/settingContext";
// import Resume from "../../public/assets/Ronak_Sharma_CV.pdf";
// import Software from "../../public/soft.png";
// import Website from "../../public/web.png";
// import Application from "../../public/app.png";
// import IOT from "../../public/iot.png";
// import Hosting from "../../public/host.png";
// import Play from "../../public/play.png";

// // const roles = ["Software Engineer 💻", "Network Engineer 🌐", "Full Stack Developer 🚀"];

// export default function Home() {
//   const [services, setServices] = useState([]);
//   const { profile } = useProfile();
//   const { isVisible, loading: settingsLoading } = useSettings();

//   const visibleServices = services.filter((proj) =>
//     isVisible("services", proj.key)
//   );

//   // if (visibleServices.length === 0) {
//   //   return (
//   //     <div className="text-center py-20 text-gray-400">
//   //       No Services available
//   //     </div>
//   //   );
//   // }

//   return (
//     <div style={{ backgroundColor: "var(--color-dark)" }}>
//       {/* Hero Section */}
//       <section className="min-h-screen relative flex items-center justify-center overflow-hidden pt-20">
//         {/* Background grid */}
//         <div
//           className="absolute inset-0 opacity-5"
//           style={{
//             backgroundImage:
//               "linear-gradient(rgba(108,99,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.5) 1px, transparent 1px)",
//             backgroundSize: "60px 60px",
//           }}
//         />

//         {/* Glow orbs */}
//         <div
//           className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
//           style={{ background: "radial-gradient(circle, #6c63ff, transparent)" }}
//         />
//         <div
//           className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl"
//           style={{ background: "radial-gradient(circle, #ff6584, transparent)" }}
//         />

//         <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center z-10">
//           {/* Text */}
//           <div className="animate-fade-in-up">
//             <div
//               className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
//               style={{ backgroundColor: "rgba(108,99,255,0.15)", color: "var(--color-primary)" }}
//             >
//               <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--color-accent)" }} />
//               Available for work
//             </div>

//             <h1 className="text-5xl md:text-7xl font-black leading-tight mb-4">
//               Hi, I'm <br />
//               <span className="gradient-text">{profile?.name || "Ronak Sharma"}</span>
//             </h1>

//             <div className="h-12 mb-6">
//               <p className="text-xl md:text-2xl font-semibold" style={{ color: "var(--color-text-muted)" }}>
//                 {profile?.designation || "Software Engineer || Full Stack Developer"}
//               </p>
//             </div>

//             <p className="text-base leading-relaxed mb-8 max-w-lg" style={{ color: "var(--color-text-muted)" }}>
//               Full Stack Developer crafting modern web and mobile applications. I combine creativity with technical expertise to create seamless UI/UX and deliver scalable, high-performance solutions from development to deployment.
//             </p>

//             <div className="flex flex-wrap gap-4 mb-[10px]">
//               <Link
//                 to="/contact"
//                 className="flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 animate-pulse-glow"
//                 style={{ background: "linear-gradient(135deg, #6c63ff, #ff6584)" }}
//               >
//                 <Mail size={18} /> Say Hello
//               </Link>
//               <a
//                 href={Resume}
//                 download="Ronak Sharm CV.pdf"
//                 className="flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold transition-all duration-300 hover:scale-105 border"
//                 style={{
//                   borderColor: "var(--color-primary)",
//                   color: "var(--color-primary)",
//                   backgroundColor: "rgba(108,99,255,0.05)",
//                 }}
//               >
//                 <Download size={18} /> Download CV
//               </a>
//             </div>

//             {/* <div className="flex items-center gap-6 mt-8 ">
//               {[Github, Linkedin, Mail].map((Icon, i) => (
//                 <a
//                   key={i}
//                   href={i === 2 ? "mailto:ronaksharma2350@gmail.com" : "#"}
//                   className="p-3 rounded-xl transition-all duration-200 hover:scale-110"
//                   style={{ backgroundColor: "rgba(108,99,255,0.1)", color: "var(--color-primary)" }}
//                 >
//                   <Icon size={20} />
//                 </a>
//               ))}
//             </div> */}
//           </div>

//           {/* Avatar / Illustration */}
//           <div className="flex justify-center">
//             <div className="relative">
//               {/* Main circle */}
//               <div


//               >
//                 <div
//                   className="w-65 h-65 md:w-72 md:h-72 rounded-full flex items-center justify-center text-8xl font-black"


//                 >
//                   <img className="max-w-95" src="../ridduu.png" alt="ridduu" />
//                 </div>

//                 {/* Floating badges */}
//                 {/* <div
//                   className="absolute -top-4 -right-4 p-3 rounded-xl shadow-lg"
//                   style={{ backgroundColor: "var(--color-dark-3)", border: "1px solid rgba(108,99,255,0.3)" }}
//                 >
//                   <Code2 size={24} style={{ color: "var(--color-primary)" }} />
//                 </div> */}
//                 {/* <div
//                   className="absolute -bottom-4 -left-4 p-3 rounded-xl shadow-lg"
//                   style={{ backgroundColor: "var(--color-dark-3)", border: "1px solid rgba(255,101,132,0.3)" }}
//                 >
//                   <Network size={24} style={{ color: "var(--color-secondary)" }} />
//                 </div>
//                 <div
//                   className="absolute top-1/2 -right-8 p-3 rounded-xl shadow-lg"
//                   style={{ backgroundColor: "var(--color-dark-3)", border: "1px solid rgba(67,184,156,0.3)" }}
//                 >
//                   <Cpu size={24} style={{ color: "var(--color-accent)" }} />
//                 </div> */}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Scroll indicator */}
//         <a
//           href="#stats"
//           className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce"
//           style={{ color: "var(--color-text-muted)" }}
//         >
//           <span className="text-xs tracking-widest uppercase">Scroll Down</span>
//           <ArrowDown size={16} />
//         </a>
//       </section>

//       {/* Stats Section */}
//       <section id="stats" className="py-20" style={{ backgroundColor: "var(--color-dark-2)" }}>
//         <div className="max-w-6xl mx-auto px-6">
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//             {/* Dynamic Stats from API */}
//             {profile?.stats?.map((stat, index) => {
//               const colors = ["#6c63ff", "#ff6584", "#43b89c"]; // match your design

//               return (
//                 <div key={stat._id} className="text-center group">
//                   <div
//                     className="text-4xl md:text-5xl font-black mb-2 transition-transform group-hover:scale-110"
//                     style={{ color: colors[index % colors.length] }}
//                   >
//                     {stat.value}
//                   </div>

//                   <div
//                     className="text-sm font-medium"
//                     style={{ color: "var(--color-text-muted)" }}
//                   >
//                     {stat.label}
//                   </div>
//                 </div>
//               );
//             })}

//             {/* Static Item (unchanged) */}
//             <div className="text-center group">
//               <div
//                 className="text-4xl md:text-5xl font-black mb-2 transition-transform group-hover:scale-110"
//                 style={{ color: "#f5a623" }}
//               >
//                 100%
//               </div>

//               <div
//                 className="text-sm font-medium"
//                 style={{ color: "var(--color-text-muted)" }}
//               >
//                 Client Satisfaction
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Services Preview */}
//       <section className="py-20" style={{ backgroundColor: "var(--color-dark)" }}>
//         <div className="max-w-6xl mx-auto px-6">
//           <div className="text-center mb-14">
//             <p className="text-sm uppercase tracking-widest mb-2" style={{ color: "var(--color-primary)" }}>
//               What I Offer
//             </p>
//             <h2 className="text-4xl font-black gradient-text">Services</h2>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               {
//                 icon: Software,
//                 title: "Software Developement",
//                 desc: "Creating scalable and high-performance software solutions with a focus on functionality, efficiency, and seamless user experience.",
//                 color: "#6c63ff",
//               },
//               {
//                 icon: Website,
//                 title: "Website Developement",
//                 desc: "Designing and developing modern, responsive websites that deliver excellent performance, user engagement, and strong online presence.",
//                 color: "#ff6584",
//               },
//               {
//                 icon: Application,
//                 title: "Mobile App Developement",
//                 desc: "Building intuitive and high-performance mobile applications that provide seamless user experiences across Android and iOS platforms.",
//                 color: "#43b89c",
//               },
//               {
//                 icon: IOT,
//                 title: "IOT Developement",
//                 desc: "Developing smart IoT solutions that connect devices, automate processes, and enable real-time monitoring for smarter businesses.",
//                 color: "#43b89c",
//               },
//               {
//                 icon: Hosting,
//                 title: "Web Hosting",
//                 desc: "Reliable and secure web hosting solutions that ensure fast performance, high uptime, and scalable infrastructure to keep your website running smoothly.",
//                 color: "#43b89c",
//               },
//               {
//                 icon: Play,
//                 title: "App Deployment",
//                 desc: "Professional app deployment services for publishing Android applications on the Google Play Store, ensuring proper configuration, compliance, and smooth launch.",
//                 color: "#43b89c",
//               },
//             ].map((s) => (
//               <div
//                 key={s.title}
//                 className="p-8 rounded-2xl transition-all duration-300 hover:scale-105 group cursor-pointer"
//                 style={{
//                   background: "linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,101,132,0.1))",
//                   border: "1px solid rgba(108,99,255,0.3)",
//                   boxShadow: "0 0 7px rgba(108,99,255,0.4)"
//                 }}
//               >
//                 {/* <div className="text-4xl mb-4">{s.icon}</div> */}
//                 <div className="mb-4">
//                   <img
//                     src={s.icon}
//                     alt={s.title}
//                     className="w-12 h-12 object-contain"
//                   />
//                 </div>
//                 <h3 className="text-xl font-bold mb-3" style={{ color: "var(--color-text)" }}>
//                   {s.title}
//                 </h3>
//                 <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
//                   {s.desc}
//                 </p>
//                 <Link
//                   to="/projects"
//                   className="inline-flex items-center gap-1 mt-4 text-sm font-semibold transition-colors"
//                   style={{ color: s.color }}
//                 >
//                   View More →
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section
//         className="py-20 text-center"
//         style={{
//           background: "linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,101,132,0.1))",
//           border: "1px solid rgba(108,99,255,0.3)",
//           boxShadow: "0 0 7px rgba(108,99,255,0.4)"
//         }}
//       >
//         <div className="max-w-2xl mx-auto px-6">
//           <h2 className="text-3xl md:text-4xl font-black mb-4">
//             Let's Build Something <span className="gradient-text">Amazing</span> Together
//           </h2>
//           <p className="mb-8" style={{ color: "var(--color-text-muted)" }}>
//             Have a project in mind? I'd love to hear about it. Let's discuss how we can bring your vision to life.
//           </p>
//           <Link
//             to="/contact"
//             className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-white text-lg transition-all hover:scale-105"
//             style={{ background: "linear-gradient(135deg, #6c63ff, #ff6584)" }}
//           >
//             Get In Touch
//           </Link>
//         </div>
//       </section>
//     </div>
//   );
// }

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  Download,
  Mail,
} from "lucide-react";

import { useProfile } from "../context/ProfileContext";
import { useSettings } from "../Context/settingContext";

import Resume from "../../public/assets/Ronak_Sharma_CV.pdf";

import Software from "../../public/soft.png";
import Website from "../../public/web.png";
import Application from "../../public/app.png";
import IOT from "../../public/iot.png";
import Hosting from "../../public/host.png";
import Play from "../../public/play.png";

export default function Home() {
  const [services] = useState([
    {
      key: "softwareService",
      icon: Software,
      title: "Software Developement",
      desc: "Creating scalable and high-performance software solutions with a focus on functionality, efficiency, and seamless user experience.",
      color: "#6c63ff",
    },
    {
      key: "webService",
      icon: Website,
      title: "Website Developement",
      desc: "Designing and developing modern, responsive websites that deliver excellent performance, user engagement, and strong online presence.",
      color: "#ff6584",
    },
    {
      key: "mobileAppService",
      icon: Application,
      title: "Mobile App Developement",
      desc: "Building intuitive and high-performance mobile applications that provide seamless user experiences across Android and iOS platforms.",
      color: "#43b89c",
    },
    {
      key: "iotService",
      icon: IOT,
      title: "IOT Developement",
      desc: "Developing smart IoT solutions that connect devices, automate processes, and enable real-time monitoring for smarter businesses.",
      color: "#43b89c",
    },
    {
      key: "webHostingService",
      icon: Hosting,
      title: "Web Hosting",
      desc: "Reliable and secure web hosting solutions that ensure fast performance, high uptime, and scalable infrastructure to keep your website running smoothly.",
      color: "#43b89c",
    },
    {
      key: "appDeplyService",
      icon: Play,
      title: "App Deployment",
      desc: "Professional app deployment services for publishing Android applications on the Google Play Store, ensuring proper configuration, compliance, and smooth launch.",
      color: "#43b89c",
    },
  ]);

  const { profile } = useProfile();
  const { isVisible } = useSettings();

  // Filter services according to settings visibility
  const visibleServices = services.filter((service) =>
    isVisible("services", service.key)
  );

  return (
    <div style={{ backgroundColor: "var(--color-dark)" }}>
      {/* Hero Section */}
      <section className="min-h-screen relative flex items-center justify-center overflow-hidden pt-20">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(108,99,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Glow orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{
            background: "radial-gradient(circle, #6c63ff, transparent)",
          }}
        />

        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{
            background: "radial-gradient(circle, #ff6584, transparent)",
          }}
        />

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center z-10">
          {/* Text */}
          <div className="animate-fade-in-up">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{
                backgroundColor: "rgba(108,99,255,0.15)",
                color: "var(--color-primary)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: "var(--color-accent)" }}
              />
              Available for work
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-4">
              Hi, I'm <br />
              <span className="gradient-text">
                {profile?.name || "Ronak Sharma"}
              </span>
            </h1>

            <div className="h-12 mb-6">
              <p
                className="text-xl md:text-2xl font-semibold"
                style={{ color: "var(--color-text-muted)" }}
              >
                {profile?.designation ||
                  "Software Engineer || Full Stack Developer"}
              </p>
            </div>

            <p
              className="text-base leading-relaxed mb-8 max-w-lg"
              style={{ color: "var(--color-text-muted)" }}
            >
              Full Stack Developer crafting modern web and mobile applications.
              I combine creativity with technical expertise to create seamless
              UI/UX and deliver scalable, high-performance solutions from
              development to deployment.
            </p>

            <div className="flex flex-wrap gap-4 mb-[10px]">
              <Link
                to="/contact"
                className="flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 animate-pulse-glow"
                style={{
                  background:
                    "linear-gradient(135deg, #6c63ff, #ff6584)",
                }}
              >
                <Mail size={18} />
                Say Hello
              </Link>

              <a
                href={Resume}
                download="Ronak Sharma CV.pdf"
                className="flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold transition-all duration-300 hover:scale-105 border"
                style={{
                  borderColor: "var(--color-primary)",
                  color: "var(--color-primary)",
                  backgroundColor: "rgba(108,99,255,0.05)",
                }}
              >
                <Download size={18} />
                Download CV
              </a>
            </div>
          </div>

          {/* Avatar */}
          <div className="flex justify-center">
            <div className="relative">
              <div>
                <div className="w-65 h-65 md:w-72 md:h-72 rounded-full flex items-center justify-center text-8xl font-black">
                  <img
                    className="max-w-95"
                    src="../ridduu.png"
                    alt="ridduu"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <a
          href="#stats"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce"
          style={{ color: "var(--color-text-muted)" }}
        >
          <span className="text-xs tracking-widest uppercase">
            Scroll Down
          </span>
          <ArrowDown size={16} />
        </a>
      </section>

      {/* Stats Section */}
      <section
        id="stats"
        className="py-20"
        style={{ backgroundColor: "var(--color-dark-2)" }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {profile?.stats?.map((stat, index) => {
              const colors = ["#6c63ff", "#ff6584", "#43b89c"];

              return (
                <div key={stat._id} className="text-center group">
                  <div
                    className="text-4xl md:text-5xl font-black mb-2 transition-transform group-hover:scale-110"
                    style={{ color: colors[index % colors.length] }}
                  >
                    {stat.value}
                  </div>

                  <div
                    className="text-sm font-medium"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {stat.label}
                  </div>
                </div>
              );
            })}

            {/* Static */}
            <div className="text-center group">
              <div
                className="text-4xl md:text-5xl font-black mb-2 transition-transform group-hover:scale-110"
                style={{ color: "#f5a623" }}
              >
                100%
              </div>

              <div
                className="text-sm font-medium"
                style={{ color: "var(--color-text-muted)" }}
              >
                Client Satisfaction
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        className="py-20"
        style={{ backgroundColor: "var(--color-dark)" }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p
              className="text-sm uppercase tracking-widest mb-2"
              style={{ color: "var(--color-primary)" }}
            >
              What I Offer
            </p>

            <h2 className="text-4xl font-black gradient-text">
              Services
            </h2>
          </div>

          {/* No services */}
          {visibleServices.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              No Services Available
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {visibleServices.map((s) => (
                <div
                  key={s.key}
                  className="p-8 rounded-2xl transition-all duration-300 hover:scale-105 group cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,101,132,0.1))",
                    border: "1px solid rgba(108,99,255,0.3)",
                    boxShadow: "0 0 7px rgba(108,99,255,0.4)",
                  }}
                >
                  <div className="mb-4">
                    <img
                      src={s.icon}
                      alt={s.title}
                      className="w-12 h-12 object-contain"
                    />
                  </div>

                  <h3
                    className="text-xl font-bold mb-3"
                    style={{ color: "var(--color-text)" }}
                  >
                    {s.title}
                  </h3>

                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {s.desc}
                  </p>

                  <Link
                    to="/projects"
                    className="inline-flex items-center gap-1 mt-4 text-sm font-semibold transition-colors"
                    style={{ color: s.color }}
                  >
                    View More →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 text-center"
        style={{
          background:
            "linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,101,132,0.1))",
          border: "1px solid rgba(108,99,255,0.3)",
          boxShadow: "0 0 7px rgba(108,99,255,0.4)",
        }}
      >
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Let's Build Something{" "}
            <span className="gradient-text">Amazing</span> Together
          </h2>

          <p
            className="mb-8"
            style={{ color: "var(--color-text-muted)" }}
          >
            Have a project in mind? I'd love to hear about it.
            Let's discuss how we can bring your vision to life.
          </p>

          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-white text-lg transition-all hover:scale-105"
            style={{
              background:
                "linear-gradient(135deg, #6c63ff, #ff6584)",
            }}
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
