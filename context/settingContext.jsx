"use client";
import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext();

const API_BASE = "/api";

export const SettingsProvider = ({ children, initialSettings }) => {
  const [settings, setSettings] = useState(initialSettings || {});
  const [loading, setLoading] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_BASE}/settings`, { cache: "no-store" });
      const data = await res.json();

      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error("Settings Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialSettings && Object.keys(initialSettings).length > 0) {
      setSettings(initialSettings);
    }
    fetchSettings();
  }, [initialSettings]);

  // 🔥 reusable helper
  const isVisible = (section, key) => {
    if (!settings || !settings[section]) return true;
    const item = settings[section].find((i) => i.key === key);
    return item ? item.value !== false : true;
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, isVisible, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

