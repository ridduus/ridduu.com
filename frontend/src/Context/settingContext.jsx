import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext();

const API_BASE = "/backend";

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

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
