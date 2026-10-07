"use client";
import { useEffect, useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";

const API_BASE = "/api";

export default function Skills({ initialSkills }) {
  const [skills, setSkills] = useState(initialSkills || []);
  const [loading, setLoading] = useState(!initialSkills);

  const getIcon = (iconName) => {
    if (!iconName) return FaIcons.FaReact;
    return (
      FaIcons[iconName] ||
      SiIcons[iconName] ||
      FaIcons.FaReact
    );
  };

  useEffect(() => {
    if (initialSkills) return;
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
  }, [initialSkills]);

  if (loading) {
    return (
      <div className="text-center py-32 text-slate-500 font-medium">
        Loading skills...
      </div>
    );
  }

  return (
    <div className="bg-white pt-28 pb-20 text-slate-800">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12 space-y-2">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Technical Expertise
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900">
            Skills & <span className="text-blue-600">Technologies</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-500 max-w-xl mx-auto">
            I specialize in modern web & mobile technologies, backend systems, cloud deployment, and database management.
          </p>
        </div>

        {/* Skills Grid matching white light theme */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {skills.map((skill, i) => {
            const IconComponent = getIcon(skill.icon);

            return (
              <div
                key={skill._id || i}
                className="group p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all text-center flex flex-col items-center justify-center gap-3"
              >
                <div
                  className="text-3xl flex justify-center transition-transform group-hover:scale-110"
                  style={{ color: skill.color || "#2563eb" }}
                >
                  <IconComponent />
                </div>

                <h3 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
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