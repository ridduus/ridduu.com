import { Save } from "lucide-react";
import { useEffect, useState } from "react";

/* ================= TOGGLE SWITCH ================= */
function ToggleSwitch({ enabled, onChange }) {
    return (
        <button
            onClick={onChange}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${enabled ? "bg-green-500" : "bg-gray-300"
                }`}
        >
            <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all duration-300 ${enabled ? "translate-x-6" : "translate-x-0"
                    }`}
            />
        </button>
    );
}

/* ================= SECTION CARD ================= */
function SectionCard({ title, data = [], sectionKey, toggleSetting }) {
    return (
        <div className="bg-white rounded-xl shadow p-5">
            <h2 className="text-lg font-bold text-black mb-4">{title}</h2>

            {data.length === 0 && (
                <p className="text-gray-400 text-sm">No data found</p>
            )}

            {data.map((item) => (
                <div
                    key={item.key}
                    className="flex items-center justify-between py-3 border-b last:border-none"
                >
                    <span className="text-gray-700">{item.title}</span>

                    <div className="flex items-center gap-3">
                        <ToggleSwitch
                            enabled={item.value}
                            onChange={() => toggleSetting(sectionKey, item.key)}
                        />
                        <span
                            className={`text-sm ${item.value ? "text-green-600" : "text-gray-400"
                                }`}
                        >
                            {item.value ? "Live" : "Offline"}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ================= MAIN COMPONENT ================= */
export default function AdminSettings() {
    const API_BASE = "http://localhost:5000/api";

    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    /* ================= FETCH ================= */
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/settings`);
            const data = await res.json();

            if (data.success) {
                setSettings(data.settings || {});
            }
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    /* ================= TOGGLE ================= */
    const toggleSetting = (section, key) => {
        setSettings((prev) => ({
            ...prev,
            [section]: (prev[section] || []).map((item) =>
                item.key === key
                    ? { ...item, value: !item.value }
                    : item
            ),
        }));
    };

    /* ================= SAVE ================= */
    const handleSave = async () => {
        try {
            setSaving(true);

            const token = localStorage.getItem("token");

            const res = await fetch(`${API_BASE}/settings`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // ✅ token here also
                },
                body: JSON.stringify({ settings }),
            });

            const data = await res.json();

            if (data.success) {
                alert("Settings saved successfully!");
            }
        } catch (err) {
            console.error(err);
            alert("Error saving settings");
        } finally {
            setSaving(false);
        }
    };

    /* ================= UI ================= */
    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">
                    Admin Settings
                </h1>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-white flex gap-2 text-black px-6 py-2 rounded-lg hover:bg-blue-100 transition"
                >
                    <Save />{saving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            {/* GRID */}
            <div className="grid lg:grid-cols-2 gap-6">

                {/* LEFT */}
                <div className="space-y-6">
                    <SectionCard
                        title="Projects Visibility"
                        data={settings.projects}
                        sectionKey="projects"
                        toggleSetting={toggleSetting}
                    />

                    <SectionCard
                        title="Notifications Setting"
                        data={settings.notifications}
                        sectionKey="notifications"
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