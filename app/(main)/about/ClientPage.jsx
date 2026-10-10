"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Download,
  Briefcase,
  GraduationCap,
  Mail,
} from "lucide-react";

const API_BASE = "/api";

export default function About({ initialEducation, initialExperience, initialProfile }) {
  const [education, setEducation] = useState(initialEducation || []);
  const [experience, setExperience] = useState(initialExperience || []);
  const [profile, setProfile] = useState(initialProfile || null);
  const [loading, setLoading] = useState(false);

  const getProfileImgSrc = (img) => {
    if (!img) return "/ridduu.png";
    if (img.startsWith("data:image") || img.startsWith("http") || img.startsWith("/")) {
      return img;
    }
    return `data:image/jpeg;base64,${img}`;
  };

  useEffect(() => {
    if (initialEducation && initialEducation.length > 0) setEducation(initialEducation);
    if (initialExperience && initialExperience.length > 0) setExperience(initialExperience);
    if (initialProfile) setProfile(initialProfile);

    const fetchData = async () => {
      try {
        const [eduRes, expRes, profileRes] = await Promise.all([
          fetch(`${API_BASE}/education`, { cache: "no-store" }),
          fetch(`${API_BASE}/experience`, { cache: "no-store" }),
          fetch(`${API_BASE}/profile`, { cache: "no-store" }),
        ]);

        const eduData = await eduRes.json();
        const expData = await expRes.json();
        const profileData = await profileRes.json();

        if (eduData.success && eduData.data) setEducation(eduData.data);
        if (expData.success && expData.data) setExperience(expData.data);
        if (profileData.success && profileData.profile) setProfile(profileData.profile);

      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [initialEducation, initialExperience, initialProfile]);

  return (
    <div className="pb-20 bg-white text-slate-800">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 space-y-2">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            About Me
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900">
            Turning Ideas Into <span className="text-blue-600">Real Products</span>
          </h1>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-12 gap-10 items-center mb-16">
          {/* Avatar & Buttons */}
          <div className="md:col-span-5 flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-60 h-72 rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                <Image
                  width={300}
                  height={360}
                  src={getProfileImgSrc(profile?.profileImg)}
                  alt="profile"
                  className="w-full h-full object-contain rounded-xl"
                  unoptimized
                />
              </div>
            </div>

            <div className="flex gap-3 flex-wrap justify-center">
              <a
                href={profile?.cv || "/assets/Ronak_Sharma_CV.pdf"}
                download="Ronak_Sharma_CV.pdf"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-xs text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm"
              >
                <Download size={15} /> Download CV
              </a>

              <Link
                href="/contact"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-xs border border-slate-300 hover:bg-slate-50 text-slate-700 transition-all"
              >
                <Mail size={15} className="text-slate-500" /> Contact Me
              </Link>
            </div>
          </div>

          {/* Info & Stats */}
          <div className="md:col-span-7 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-center">
              {profile?.stats && profile.stats.length > 0 ? (
                profile.stats.map((s, idx) => (
                  <div key={s._id || idx}>
                    <div className="text-2xl font-extrabold text-blue-600">{s.value}</div>
                    <div className="text-xs font-medium text-slate-600 mt-0.5">{s.label}</div>
                  </div>
                ))
              ) : (
                <>
                  <div>
                    <div className="text-2xl font-extrabold text-blue-600">4+</div>
                    <div className="text-xs font-medium text-slate-600 mt-0.5">Years Experience</div>
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-blue-600">5+</div>
                    <div className="text-xs font-medium text-slate-600 mt-0.5">Production Projects</div>
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-blue-600">2</div>
                    <div className="text-xs font-medium text-slate-600 mt-0.5">Mobile Apps Published</div>
                  </div>
                </>
              )}
            </div>

            <p className="text-xs md:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {profile?.desc1 || "I'm a Full Stack Software Engineer with 4+ years of experience building scalable web, mobile and desktop applications. I work with modern technologies like React.js, TypeScript, Node.js, Express.js, Flutter, Python and PostgreSQL."}
            </p>

            <p className="text-xs md:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {profile?.desc2 || "I have led software development teams, deployed production applications on Linux/VPS with Nginx, and published Android applications on Google Play Store. Based in Rajasthan, India, I take pride in building robust, performant software solutions from ground up."}
            </p>
          </div>
        </div>

        {/* Education + Experience Network Circle Timeline */}
        <div className="pt-12 border-t border-slate-200/80">
          <div className="text-center mb-12 space-y-2">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200/60 px-3.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              Connected Timeline
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Experience & <span className="text-blue-600">Education Network</span>
            </h2>
            <p className="text-xs text-slate-500">
              Interactive node graph showcasing professional experience and academic background.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Experience Branch */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
                  <Briefcase size={18} />
                </div>
                <h3 className="text-base font-bold text-slate-900">Experience</h3>
              </div>

              <div className="relative pl-10 space-y-7 before:absolute before:left-[21px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-blue-600 before:via-emerald-500 before:to-teal-500">
                {experience.length > 0 ? (
                  experience.map((item, i) => {
                    const is3H = (item.company || "").toLowerCase().includes("3handshake") || (item.role || "").toLowerCase().includes("3handshake");
                    return (
                      <div key={item._id || i} className="relative group">
                        {/* Animated Glowing Network Circle Node */}
                        <div className="absolute -left-[40px] top-3 z-10">
                          <div className="relative flex items-center justify-center">
                            <span className={`animate-ping absolute inline-flex h-9 w-9 rounded-full opacity-75 ${is3H ? "bg-blue-400/40" : "bg-emerald-400/40"}`} />
                            <div className={`w-10 h-10 rounded-full bg-white border-2 ${is3H ? "border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)]" : "border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]"} flex items-center justify-center overflow-hidden p-1 group-hover:scale-110 transition-transform duration-300`}>
                              {getProfileImgSrc(item.logo) && item.logo ? (
                                <img src={getProfileImgSrc(item.logo)} alt={item.company} className="w-full h-full object-contain rounded-full" />
                              ) : (
                                <span className={`font-bold text-xs ${is3H ? "text-blue-600" : "text-emerald-600"}`}>{item.company?.substring(0, 2).toUpperCase() || "EX"}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Content Card */}
                        <div className={`p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-300 space-y-2 ${is3H ? "hover:border-blue-300" : "hover:border-emerald-300"}`}>
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <h4 className={`text-sm font-bold text-slate-900 transition-colors ${is3H ? "group-hover:text-blue-600" : "group-hover:text-emerald-600"}`}>
                              {item.role || item.company}
                            </h4>
                            <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${is3H ? "text-blue-600 bg-blue-50 border border-blue-100" : "text-emerald-600 bg-emerald-50 border border-emerald-100"}`}>
                              {item.period}
                            </span>
                          </div>
                          <p className={`text-xs font-semibold ${is3H ? "text-indigo-600" : "text-emerald-600"}`}>{item.company}</p>
                          {item.desc && (
                            <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100 whitespace-pre-line">
                              {item.desc}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="relative group">
                    <div className="absolute -left-[40px] top-3 z-10">
                      <div className="relative flex items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-blue-400/40 opacity-75" />
                        <div className="w-10 h-10 rounded-full bg-white border-2 border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)] flex items-center justify-center overflow-hidden p-1">
                          <span className="text-blue-600 font-bold text-xs">3H</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h4 className="text-sm font-bold text-slate-900">Software Engineer (Team Lead)</h4>
                        <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
                          Jan 2024 – Present
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-indigo-600">3Handshake Techsoft Pvt. Ltd.</p>
                      <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                        Lead development of production web and mobile apps.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Education Branch */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold">
                  <GraduationCap size={18} />
                </div>
                <h3 className="text-base font-bold text-slate-900">Education</h3>
              </div>

              <div className="relative pl-10 space-y-7 before:absolute before:left-[21px] before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-teal-500 before:to-cyan-500">
                {education.length > 0 ? (
                  education.map((item, i) => (
                    <div key={item._id || i} className="relative group">
                      {/* Animated Glowing Network Circle Node */}
                      <div className="absolute -left-[40px] top-3 z-10">
                        <div className="relative flex items-center justify-center">
                          <span className="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-emerald-400/40 opacity-75" />
                          <div className="w-10 h-10 rounded-full bg-white border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center overflow-hidden p-1 group-hover:scale-110 transition-transform duration-300">
                            {getProfileImgSrc(item.logo) && item.logo ? (
                              <img src={getProfileImgSrc(item.logo)} alt={item.university} className="w-full h-full object-contain rounded-full" />
                            ) : (
                              <GraduationCap size={18} className="text-emerald-600" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Content Card */}
                      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all duration-300 space-y-2">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                            {item.degree || item.university}
                          </h4>
                          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                            {item.period}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-emerald-600">{item.university}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="relative group">
                    <div className="absolute -left-[40px] top-3 z-10">
                      <div className="relative flex items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-emerald-400/40 opacity-75" />
                        <div className="w-10 h-10 rounded-full bg-white border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center overflow-hidden p-1">
                          <GraduationCap size={18} className="text-emerald-600" />
                        </div>
                      </div>
                    </div>
                    <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h4 className="text-sm font-bold text-slate-900">Bachelor of Vocational (IT & Networking)</h4>
                        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                          2021 – 2024
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-emerald-600">University</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

