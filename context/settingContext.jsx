"use client";
import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext();

const API_BASE = "/api";

export const SettingsProvider = ({ children, initialSettings }) => {
  const [settings, setSettings] = useState(initialSettings || {});
  const [loading, setLoading] = useState(Object.keys(initialSettings || {}).length === 0);

  useEffect(() => {
    if (initialSettings && Object.keys(initialSettings).length > 0) return; // Skip if SSR hydrated

    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE}/settings`);
        const data = await res.json();

        if (data.success) {
          setSettings(data.settings || {});
        }
      } catch (err) {
        console.error("Settings Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [initialSettings]);

  // 🔥 reusable helper
  const isVisible = (section, key) => {
    return settings?.[section]?.find((i) => i.key === key)?.value !== false;
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, isVisible }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
