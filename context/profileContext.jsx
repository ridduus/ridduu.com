"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ProfileContext = createContext();

const API_BASE = "/api";

export const ProfileProvider = ({ children, initialProfile }) => {
  const [profile, setProfile] = useState(initialProfile || null);
  const [loading, setLoading] = useState(!initialProfile);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_BASE}/profile`, { cache: "no-store" });
      const data = await res.json();

      if (data.success && data.profile) {
        setProfile(data.profile);
      }
    } catch (err) {
      console.error("Profile Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile);
    }
    fetchProfile();
  }, [initialProfile]);

  return (
    <ProfileContext.Provider value={{ profile, loading, refreshProfile: fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);

