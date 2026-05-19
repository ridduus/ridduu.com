import { createContext, useContext, useEffect, useState } from "react";

const ProfileContext = createContext();

const API_BASE = "http://localhost:5000/api";

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/profile`);
        const data = await res.json();

        if (data.success) {
          setProfile(data.profile);
        }
      } catch (err) {
        console.error("Profile Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
};

// custom hook (easy use)
export const useProfile = () => useContext(ProfileContext);