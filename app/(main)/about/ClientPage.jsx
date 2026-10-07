"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Download,
  Briefcase,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
} from "lucide-react";

const API_BASE = "/api";

export default function About({ initialEducation, initialExperience, initialProfile }) {
  const [education, setEducation] = useState(initialEducation || []);
  const [experience, setExperience] = useState(initialExperience || []);
  const [profile, setProfile] = useState(initialProfile || null);
  const [loading, setLoading] = useState(!initialEducation);

  useEffect(() => {
    if (initialEducation) return;
    const fetchData = async () => {
      try {
        const [eduRes, expRes, profileRes] = await Promise.all([
          fetch(`${API_BASE}/education`),
          fetch(`${API_BASE}/experience`),
          fetch(`${API_BASE}/profile`),
        ]);

        const eduData = await eduRes.json();
        const expData = await expRes.json();
        const profileData = await profileRes.json();

        if (eduData.success) setEducation(eduData.data);
        if (expData.success) setExperience(expData.data);
        if (profileData.success) setProfile(profileData.profile);

      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [initialEducation]);

  return (
    <div className="pt-28 pb-20 bg-white text-slate-800">
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
                  src={
                    profile?.profileImg?.startsWith("data:image")
                      ? profile.profileImg
                      : profile?.profileImg
                        ? `data:image/jpeg;base64,${profile.profileImg}`
                        : "/ridduu.png"
                  }
                  alt="profile"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
            </div>

            <div className="flex gap-3 flex-wrap justify-center">
              <a
                href="/assets/Ronak_Sharma_CV.pdf"
                download
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
              {profile?.stats ? (
                profile.stats.map((s, idx) => (
                  <div key={s._id || idx}>
                    <div className="text-2xl font-extrabold text-blue-600">{s.value}</div>
                    <div className="text-xs font-medium text-slate-600 mt-0.5">{s.label}</div>
                  </div>
                ))
              ) : (
                <>
                  <div>
                    <div className="text-2xl font-extrabold text-blue-600">3+</div>
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

            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              I'm a Full Stack Software Engineer with 3+ years of experience building scalable web, mobile and desktop applications.
              I work with modern technologies like React.js, TypeScript, Node.js, Express.js, Flutter, Python and PostgreSQL.
            </p>

            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              I have led software development teams, deployed production applications on Linux/VPS with Nginx, and published Android applications on Google Play Store.
              Based in Rajasthan, India, I take pride in building robust, performant software solutions from ground up.
            </p>
          </div>
        </div>

        {/* Education + Experience */}
        <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
          {/* Experience */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Briefcase size={20} className="text-blue-600" /> Experience
            </h3>

            <div className="space-y-3">
              {experience.length > 0 ? (
                experience.map((item, i) => (
                  <div
                    key={item._id || i}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-sm transition-shadow"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xs border border-blue-100">
                      {item.company?.substring(0, 2).toUpperCase() || "EX"}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.role || item.company}</h4>
                      <p className="text-xs text-blue-600 font-medium">{item.company}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.period}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-600">
                  <h4 className="font-bold text-slate-900 text-sm">Software Engineer (Team Lead)</h4>
                  <p className="text-xs text-blue-600 font-medium">3Handshake Techsoft Pvt. Ltd.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Jan 2024 – Present</p>
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap size={20} className="text-blue-600" /> Education
            </h3>

            <div className="space-y-3">
              {education.length > 0 ? (
                education.map((item, i) => (
                  <div
                    key={item._id || i}
                    className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-sm transition-shadow"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xs border border-blue-100">
                      <GraduationCap size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.degree || item.university}</h4>
                      <p className="text-xs text-blue-600 font-medium">{item.university}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.period}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-600">
                  <h4 className="font-bold text-slate-900 text-sm">Bachelor of Vocational (IT & Networking)</h4>
                  <p className="text-xs text-blue-600 font-medium">University</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">2021 – 2024</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
