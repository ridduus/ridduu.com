"use client";
import { Save, Settings as SettingsIcon, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

/* ================= TOGGLE SWITCH ================= */
function ToggleSwitch({ enabled, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none cursor-pointer border ${
        enabled
          ? "bg-emerald-500 border-emerald-400 shadow-md shadow-emerald-500/30"
          : "bg-slate-800 border-slate-700"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 shadow-md ${
          enabled ? "translate-x-7" : "translate-x-1"
        }`}
      />
    </button>
  );
}

/* ================= SECTION CARD ================= */
function SectionCard({ title, data = [], sectionKey, toggleSetting }) {
  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 shadow-xl backdrop-blur-xl">
      <h2 className="text-lg font-bold text-slate-100 mb-4 pb-3 border-b border-slate-800 flex items-center justify-between">
        <span>{title}</span>
        <span className="text-xs font-normal text-slate-400">
          {data.length} item{data.length !== 1 ? "s" : ""}
        </span>
      </h2>

      {(!data || data.length === 0) && (
        <p className="text-slate-500 text-sm py-4 text-center">No setting items available</p>
      )}

      <div className="space-y-3">
        {data.map((item) => {
          const itemLabel = item.name || item.title || item.key;

          return (
            <div
              key={item.key}
              className="flex items-center justify-between py-3 px-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/30 transition-all"
            >
              <div className="flex flex-col">
                <span className="text-slate-200 text-sm font-medium">{itemLabel}</span>
                <span className="text-[11px] text-slate-500 font-mono">{item.key}</span>
              </div>

              <div className="flex items-center gap-3">
                <ToggleSwitch
                  enabled={!!item.value}
                  onChange={() => toggleSetting(sectionKey, item.key)}
                />
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 border ${
                    item.value
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
                >
                  {item.value ? (
                    <>
                      <CheckCircle2 size={12} /> Live
                    </>
                  ) : (
                    <>
                      <XCircle size={12} /> Offline
                    </>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================= MAIN COMPONENT ================= */
export default function AdminSettings() {
  const API_BASE = "/api";

  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/settings`, { cache: "no-store" });
      const data = await res.json();

      if (data.success) {
        // Extract settings object reliably regardless of API return structure
        const fetchedSettings = data.settings || (data.data && data.data.settings) || data.data || {};
        setSettings(fetchedSettings);
      } else {
        toast.error("Failed to load settings");
      }
    } catch (err) {
      console.error("Settings fetch error:", err);
      toast.error("Error loading settings");
    } finally {
      setLoading(false);
    }
  };

  const toggleSetting = (section, key) => {
    setSettings((prev) => {
      const sectionItems = prev[section] || [];
      return {
        ...prev,
        [section]: sectionItems.map((item) =>
          item.key === key ? { ...item, value: !item.value } : item
        ),
      };
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/admin";
        return;
      }

      const res = await fetch(`${API_BASE}/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ settings }),
      });

      const data = await res.json();

      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/admin";
        return;
      }

      if (data.success) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error(data.message || "Failed to save settings");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-indigo-500/20 shadow-xl backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <SettingsIcon className="text-indigo-400" size={28} />
            Admin Settings & Visibility Toggles
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Toggle visibility for public portfolio sections and email notifications
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} /> Save Settings
            </>
          )}
        </button>
      </div>

      {/* GRID */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* LEFT */}
        <div className="space-y-6">
          <SectionCard
            title="Notifications Settings"
            data={settings.notifications}
            sectionKey="notifications"
            toggleSetting={toggleSetting}
          />

          <SectionCard
            title="Projects Section Visibility"
            data={settings.projects}
            sectionKey="projects"
            toggleSetting={toggleSetting}
          />
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <SectionCard
            title="Services Visibility"
            data={settings.services}
            sectionKey="services"
            toggleSetting={toggleSetting}
          />

          <SectionCard
            title="Reviews Visibility"
            data={settings.reviews}
            sectionKey="reviews"
            toggleSetting={toggleSetting}
          />
        </div>
      </div>
    </div>
  );
}