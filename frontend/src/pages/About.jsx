import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Download,
  Briefcase,
  GraduationCap,
  Phone,
} from "lucide-react";

const API_BASE = "https://ridduu-com.onrender.com/api"; // change if needed

export default function About() {
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eduRes, expRes, profileRes] = await Promise.all([
          fetch(`${API_BASE}/education`),
          fetch(`${API_BASE}/experience`),
          fetch(`${API_BASE}/profile`), // ✅ new API
        ]);

        const eduData = await eduRes.json();
        const expData = await expRes.json();
        const profileData = await profileRes.json();

        if (eduData.success) setEducation(eduData.data);
        if (expData.success) setExperience(expData.data);
        if (profileData.success) setProfile(profileData.profile); // ✅ set profile

      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="pt-24 pb-20" style={{ background: "var(--color-dark)" }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          {/* <p className="text-sm uppercase tracking-widest mb-2" style={{ color: "var(--color-primary)" }}>
            My Introduction
          </p> */}
          <h1 className="text-5xl font-black gradient-text">Who I Am</h1>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-6">

              {/* Image Card */}
              <div className="relative">
                <div
                  className="w-56 h-80 rounded-2xl overflow-hidden flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(108,99,255,0.2), rgba(255,101,132,0.2))",
                    border: "2px solid rgba(108,99,255,0.3)",
                  }}
                >
                  <img
                    src={
                      profile?.profileImg?.startsWith("data:image")
                        ? profile.profileImg
                        : `data:image/jpeg;base64,${profile?.profileImg}`
                    }
                    alt="profile"
                    className="w-full h-full object-cover"
                  />

                  {/* Bottom Gradient Line */}
                  {/* <div
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{
                      background: "linear-gradient(90deg, #6c63ff, #ff6584)",
                    }}
                  /> */}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 flex-wrap justify-center">
                <a
                  href="/assets/Ronak_Sharma_CV.pdf"
                  download
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white transition-all hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #6c63ff, #ff6584)",
                  }}
                >
                  <Download size={18} /> Download CV
                </a>

                <Link
                  to="/contact"
                  className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all hover:scale-105 border"
                  style={{
                    background: "linear-gradient(135deg, #6c63ff, #ff6584)",
                    color: "#ffff",
                  }}

                >
                  <Phone size={18} /> Contact Me
                </Link>
              </div>

            </div>
          </div>

          {/* Info */}
          <div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {profile?.stats?.map((s) => (
                <div
                  key={s._id}
                  className="p-4 rounded-xl text-center"
                  style={{
                    backgroundColor: "var(--color-dark-3)",
                    border: "1px solid rgba(108,99,255,0.2)",
                  }}
                >
                  <div className="text-2xl font-black gradient-text">
                    {s.value}
                  </div>

                  <div
                    className="text-xs mt-1"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {s.label}
                  </div>

                  <div
                    className="text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-base leading-relaxed mb-6">
              {profile?.desc1?.split("Full Stack Developer").map((part, i, arr) => (
                <>
                  {part}
                  {i !== arr.length - 1 && (
                    <strong style={{ color: "var(--color-text)" }}>
                      Full Stack Developer
                    </strong>
                  )}
                </>
              ))}
            </p>
            {/* style={{ color: "var(--color-text)" }} */}

            <p className="text-base leading-relaxed mb-6">
              {profile?.desc2?.split("Rajasthan, India").map((part, i, arr) => (
                <>
                  {part}
                  {i !== arr.length - 1 && (
                    <strong style={{ color: "var(--color-text)" }}>
                      Rajasthan, India
                    </strong>
                  )}
                </>
              ))}
            </p>
          </div>
        </div>

        {/* Education + Experience */}
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 gradient-text">
              <Briefcase /> Experience
            </h3>

            <div className="space-y-6">
              {experience.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-5 rounded-xl backdrop-blur-lg hover:scale-[1.03] transition-all"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(108,99,255,0.2)",
                  }}
                >
                  {/* Logo */}
                  <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
                    <img
                      src={item.logo}
                      alt={item.title}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <h4
                      className="font-semibold"
                      style={{ color: "var(--color-text)" }}
                    >
                      {item.company}
                    </h4>
                    <p
                      className="text-sm"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {item.role}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {item.location}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {item.period}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 gradient-text">
              <GraduationCap /> Education
            </h3>

            <div className="space-y-6">
              {education.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-5 rounded-xl backdrop-blur-lg hover:scale-[1.03] transition-all"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(108,99,255,0.2)",
                  }}
                >
                  {/* Logo */}
                  <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
                    <img
                      src={item.logo}
                      alt={item.title}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <h4
                      className="font-semibold"
                      style={{ color: "var(--color-text)" }}
                    >
                      {item.university}
                    </h4>
                    <p
                      className="text-sm"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {item.degree}
                    </p>
                    <p
                      className="text-sm"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {item.location}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {item.period}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




