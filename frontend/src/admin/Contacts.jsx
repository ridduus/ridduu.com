import { useEffect, useState } from "react";
import { LayoutGrid, List, Loader2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "https://ridduu-com.onrender.com/api";

export default function ContactAdmin() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("card"); // card | list

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location = "/admin"; // redirect to login
        return;
      }

      const res = await fetch(`${API_BASE}/contacts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store", // 🔥 avoid 304 cache issue
      });

      // 🔐 handle unauthorized
      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location = "/admin";
        return;
      }

      const data = await res.json();

      if (data.success) {
        setContacts(data.data);
      } else {
        console.error("API Error:", data.message);
      }
    } catch (err) {
      console.error("Contact fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contact Requests</h1>

        {/* Toggle View */}
        <div className="flex gap-2">
          <button
            onClick={() => setView("card")}
            className={`p-2 rounded ${view === "card" ? "bg-indigo-600" : "bg-gray-800"}`}
          >
            <LayoutGrid size={18} />
          </button>

          <button
            onClick={() => setView("list")}
            className={`p-2 rounded ${view === "list" ? "bg-indigo-600" : "bg-gray-800"}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center">
          <Loader2 className="animate-spin" />
        </div>
      ) : (
        <>
          {/* CARD VIEW */}
          {view === "card" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contacts.map((c) => {
                const initials = c.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <div
                    key={c._id}
                    className="p-6 rounded-2xl bg-gray-900 border border-gray-800 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Header */}
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-indigo-500 to-pink-500">
                        {initials}
                      </div>

                      <div>
                        <h2 className="text-base font-semibold">{c.name}</h2>
                        <p className="text-xs text-gray-400">{c.email}</p>
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="mt-4 text-sm">
                      <span className="text-indigo-400 font-medium">Subject:</span>{" "}
                      <span className="text-gray-300">{c.subject}</span>
                    </div>

                    {/* Message */}
                    <div className="mt-3 text-sm text-gray-300 bg-gray-800/60 p-3 rounded-lg line-clamp-3 leading-relaxed overflow-y-auto">
                      {c.message}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
                      <span>
                        {new Date(c.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>

                      <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-md text-[10px]">
                        New Query
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* LIST VIEW */}
          {view === "list" && (
            <div className="overflow-x-auto rounded-2xl border border-gray-800">
              <table className="w-full text-sm">
                {/* Header */}
                <thead className="bg-gray-900 sticky top-0 z-10">
                  <tr className="text-left text-gray-400 uppercase text-xs tracking-wider">
                    <th className="p-4">User</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Message</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>

                {/* Body */}
                <tbody>
                  {contacts.map((c) => {
                    const initials = c.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2);

                    return (
                      <tr
                        key={c._id}
                        className="border-t border-gray-800 hover:bg-gray-900/60 transition"
                      >
                        {/* User */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-indigo-500 to-pink-500">
                              {initials}
                            </div>
                            <span className="font-medium">{c.name}</span>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="p-4 text-gray-300">{c.email}</td>

                        {/* Subject */}
                        <td className="p-4">
                          <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-md text-xs">
                            {c.subject}
                          </span>
                        </td>

                        {/* Message */}
                        <td className="p-4 max-w-xs text-gray-400 truncate">
                          {c.message}
                        </td>

                        {/* Date */}
                        <td className="p-4 text-xs text-gray-500">
                          {new Date(c.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}