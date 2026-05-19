import { useState, useEffect } from "react";
import axios from "axios";
import { Upload, GalleryHorizontalIcon, Save } from "lucide-react";
import imageCompression from "browser-image-compression";

export default function AboutEditable() {
  const [profileImg, setProfileImg] = useState("");
  const [cv, setCv] = useState(null);
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");

  const [stats, setStats] = useState([
  ]);

  const [desc1, setDesc1] = useState(
    ""
  );

  const [desc2, setDesc2] = useState(
    ""
  );

  // 🔥 Image Change
  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        const options = {
          maxSizeMB: 0.2, // 👈 max size (200kb)
          maxWidthOrHeight: 800, // 👈 resize bhi karega
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);

        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImg(reader.result); // ✅ compressed base64
        };

        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    }
  };

  // 🔥 CV Upload
  // const handleCVUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();

  //     reader.onloadend = () => {
  //       setCv({
  //         name: file.name,
  //         type: file.type,
  //         data: reader.result, // ✅ base64
  //       });
  //     };

  //     reader.readAsDataURL(file);
  //   }
  // };

  // 🔥 Stats Edit
  const updateStat = (i, field, value) => {
    const updated = [...stats];
    updated[i][field] = value;
    setStats(updated);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/profile");

      const data = res.data.profile;

      setName(data.name || "");
      setDesignation(data.designation || "");
      setPhone(data.phone || "");
      setEmail(data.email || "");
      setLocation(data.location || "");
      setProfileImg(data.profileImg || "");
      setStats(data.stats || []);
      setDesc1(data.desc1 || "");
      setDesc2(data.desc2 || "");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token"); // get token

      const payload = {
        name,
        designation,
        phone,
        email,
        location,
        desc1,
        desc2,
        stats,
        profileImg,
        cv,
      };

      await axios.post(
        "http://localhost:5000/api/profile",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ attach token
          },
        }
      );

      alert("Saved Successfully ✅");
    } catch (err) {
      console.log(err);
      alert("Error saving ❌");
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
      <div className="flex justify-center">
        <div className="flex flex-col items-center gap-6 mb-15">
          <div className="flex flex-content items-center gap-3 mb-5">
            <div className="relative">
              <div
                className="w-56 h-85 rounded-2xl overflow-hidden flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(108,99,255,0.2), rgba(255,101,132,0.2))",
                  border: "2px solid rgba(108,99,255,0.3)",
                }}
              >
                <img
                  src={profileImg}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Profile Info */}
            <div
              className="w-full p-5 rounded-2xl space-y-4 backdrop-blur-lg"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(108,99,255,0.2)",
              }}
            >
              {/* Name */}
              <div>
                <p className="text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>
                  Full Name
                </p>
                <h2
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => setName(e.target.innerText)}
                  className="outline-none font-semibold text-lg"
                  style={{ color: "var(--color-text)" }}
                >
                  {name}
                </h2>
              </div>

              {/* Designation */}
              <div>
                <p className="text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>
                  Designation
                </p>
                <h3
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => setDesignation(e.target.innerText)}
                  className="outline-none text-sm"
                  style={{ color: "var(--color-primary)" }}
                >
                  {designation}
                </h3>
              </div>

              {/* Phone */}
              <div>
                <p className="text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>
                  Phone
                </p>
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => setPhone(e.target.innerText)}
                  className="outline-none text-sm"
                  style={{ color: "var(--color-text)" }}
                >
                  {phone}
                </p>
              </div>

              {/* Email */}
              <div>
                <p className="text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>
                  Email
                </p>
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => setEmail(e.target.innerText)}
                  className="outline-none text-sm"
                  style={{ color: "var(--color-text)" }}
                >
                  {email}
                </p>
              </div>

              <div>
                <p className="text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>
                  Location
                </p>
                <p
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => setLocation(e.target.innerText)}
                  className="outline-none text-sm"
                  style={{ color: "var(--color-text)" }}
                >
                  {location}
                </p>
              </div>
            </div>

            {/* Hidden Inputs */}
            <input
              type="file"
              id="profileUpload"
              hidden
              onChange={handleImageChange}
            />

            {/* <input
              type="file"
              id="cvUpload"
              hidden
              onChange={handleCVUpload}
            /> */}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            {/* <label
              htmlFor="cvUpload"
              className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white cursor-pointer transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #6c63ff, #ff6584)",
                fontSize: "10px",
                width: "25vh"
              }}
            >
              <Upload size={18} /> Upload CV
            </label> */}

            {/* Change Profile */}
            <label
              htmlFor="profileUpload"
              className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all hover:scale-105 border cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #6c63ff, #ff6584)",
                // fontSize: "10px",
                // width: "25vh"
              }}
            >
              <GalleryHorizontalIcon size={18} /> Change Profile
            </label>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 rounded-full font-semibold transition-all hover:scale-105 border cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #6c63ff, #ff6584)",
                // fontSize: "10px",
                // width: "25vh"
              }}
            >
              <Save size={18} /> Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map((s, i) => (
            <div
              key={i}
              className="p-4 rounded-xl text-center"
              style={{
                backgroundColor: "var(--color-dark-3)",
                border: "1px solid rgba(108,99,255,0.2)",
              }}
            >
              <input
                value={s.value}
                onChange={(e) => updateStat(i, "value", e.target.value)}
                className="text-2xl font-black bg-transparent text-center w-full outline-none gradient-text"
              />

              <input
                value={s.label}
                onChange={(e) => updateStat(i, "label", e.target.value)}
                className="text-xs mt-1 bg-transparent text-center w-full outline-none"
              />

              <input
                value={s.sub}
                onChange={(e) => updateStat(i, "sub", e.target.value)}
                className="text-xs bg-transparent text-center w-full outline-none"
              />
            </div>
          ))}
        </div>

        {/* Description Editable */}
        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => setDesc1(e.target.innerText)}
          className="text-base leading-relaxed mb-6 outline-none"
          style={{ color: "var(--color-text-muted)" }}
        >
          {desc1}
        </p>

        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => setDesc2(e.target.innerText)}
          className="text-base leading-relaxed mb-8 outline-none"
          style={{ color: "var(--color-text-muted)" }}
        >
          {desc2}
        </p>

      </div>
    </div>
  );
}