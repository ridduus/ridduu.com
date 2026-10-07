"use client";
import { useEffect, useState } from "react";
import { LayoutGrid, List, Loader2, Trash2, Search, Mail, Calendar, MessageSquare, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

const API_BASE = "/api";

export default function ContactAdmin() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("card"); // card | list
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/admin";
        return;
      }

      const res = await fetch(`${API_BASE}/contacts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/admin";
        return;
      }

      const data = await res.json();

      if (data.success) {
        setContacts(data.data || []);
      } else {
        toast.error(data.message || "Failed to load contacts");
      }
    } catch (err) {
      console.error("Contact fetch error:", err);
      toast.error("Error fetching contact requests");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      setDeletingId(id);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/contacts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/admin";
        return;
      }

      const data = await res.json();

      if (data.success) {
        toast.success("Contact request deleted successfully!");
        setContacts((prev) => prev.filter((c) => c._id !== id));
      } else {
        toast.error(data.message || "Failed to delete contact request");
      }
    } catch (err) {
      console.error("Delete contact error:", err);
      toast.error("Error deleting contact request");
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const filteredContacts = contacts.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-indigo-500/20 shadow-xl backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Mail className="text-indigo-400" size={28} />
            Contact Messages ({contacts.length})
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage inquiry requests and messages sent from your portfolio
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-48 md:w-64"
            />
          </div>

          {/* Toggle View */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setView("card")}
              className={`p-2 rounded-lg transition ${
                view === "card" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
              title="Card View"
            >
              <LayoutGrid size={18} />
            </button>

            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-lg transition ${
                view === "list" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
              title="List View"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-indigo-500" size={40} />
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
          <MessageSquare className="mx-auto text-slate-600 mb-3" size={48} />
          <h3 className="text-lg font-semibold text-slate-300">No Contact Messages Found</h3>
          <p className="text-slate-500 text-sm mt-1">
            {searchTerm ? "No messages match your search term." : "Messages sent via your portfolio contact form will appear here."}
          </p>
        </div>
      ) : (
        <>
          {/* CARD VIEW */}
          {view === "card" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContacts.map((c) => {
                const initials = c.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "U";

                return (
                  <div
                    key={c._id}
                    className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl relative group"
                  >
                    <div>
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-indigo-500 to-pink-500 shadow-md">
                            {initials}
                          </div>

                          <div className="overflow-hidden">
                            <h3 className="text-base font-bold text-slate-100 truncate">{c.name}</h3>
                            <a href={`mailto:${c.email}`} className="text-xs text-indigo-400 hover:underline block truncate">
                              {c.email}
                            </a>
                          </div>
                        </div>

                        {/* DELETE BUTTON */}
                        <button
                          onClick={() => setConfirmDeleteId(c._id)}
                          disabled={deletingId === c._id}
                          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                          title="Delete Contact"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* Subject */}
                      <div className="mt-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Subject: <span className="text-indigo-300 capitalize">{c.subject || "No Subject"}</span>
                      </div>

                      {/* Message */}
                      <div className="mt-3 text-sm text-slate-300 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 max-h-36 overflow-y-auto leading-relaxed">
                        {c.message}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center mt-5 pt-3 border-t border-slate-800/80 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-400" />
                        {new Date(c.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>

                      <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg font-medium border border-indigo-500/20 text-[10px]">
                        Inquiry
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* LIST VIEW */}
          {view === "list" && (
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
              <table className="w-full text-sm text-left text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-xs tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Sender</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Message</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/60">
                  {filteredContacts.map((c) => {
                    const initials = c.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2) || "U";

                    return (
                      <tr key={c._id} className="hover:bg-slate-800/40 transition">
                        <td className="p-4 font-medium text-slate-100 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-indigo-500 to-pink-500">
                              {initials}
                            </div>
                            <span>{c.name}</span>
                          </div>
                        </td>

                        <td className="p-4 text-indigo-400">{c.email}</td>

                        <td className="p-4 font-medium text-slate-200 max-w-xs truncate">
                          {c.subject || "No Subject"}
                        </td>

                        <td className="p-4 max-w-xs text-slate-400 truncate">
                          {c.message}
                        </td>

                        <td className="p-4 text-xs text-slate-500 whitespace-nowrap">
                          {new Date(c.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        <td className="p-4 text-right">
                          <button
                            onClick={() => setConfirmDeleteId(c._id)}
                            className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                            title="Delete Contact"
                          >
                            <Trash2 size={17} />
                          </button>
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

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>

            <h3 className="text-xl font-bold text-white">Delete Contact Message?</h3>
            <p className="text-sm text-slate-400">
              Are you sure you want to delete this contact request? This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition"
              >
                Cancel
              </button>

              <button
                onClick={() => handleDeleteContact(confirmDeleteId)}
                disabled={deletingId === confirmDeleteId}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium transition flex items-center gap-2"
              >
                {deletingId === confirmDeleteId ? (
                  <>
                    <Loader2 className="animate-spin" size={16} /> Deleting...
                  </>
                ) : (
                  "Confirm Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}