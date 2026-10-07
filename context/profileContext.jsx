"use client";
import { createContext, useContext, useEffect, useState } from "react";

const ProfileContext = createContext();

const API_BASE = "/api";

export const ProfileProvider = ({ children, initialProfile }) => {
  const [profile, setProfile] = useState(initialProfile || null);
  const [loading, setLoading] = useState(!initialProfile);

  useEffect(() => {
    if (initialProfile) return; // Skip fetch if SSR hydrated

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
  }, [initialProfile]);

  return (
    <ProfileContext.Provider value={{ profile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
