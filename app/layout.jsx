import { Inter } from "next/font/google";
import { ProfileProvider } from "@/context/profileContext";
import { SettingsProvider } from "@/context/settingContext";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import dbConnect from "@/lib/db";
import Profile from "@/models/Profile";
import Setting from "@/models/Setting";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "ridduu.com",
  description: "Ronak Sharma - Full Stack Developer",
};

export const revalidate = 3600; // ISR: Revalidate every hour fallback

export default async function RootLayout({ children }) {
  let initialProfile = null;
  let initialSettings = {};
  
  try {
    const fetchPromise = (async () => {
      await dbConnect();
      const profile = await Profile.findOne().lean();
      if (profile) {
        initialProfile = JSON.parse(JSON.stringify(profile));
      }

      const settingsDoc = await Setting.findOne().lean();
      if (settingsDoc && settingsDoc.settings) {
        initialSettings = JSON.parse(JSON.stringify(settingsDoc.settings));
      }
    })();

    // 2-second timeout to prevent network latency from blocking HTML rendering
    await Promise.race([
      fetchPromise,
      new Promise((res) => setTimeout(res, 2000)),
    ]);
  } catch (err) {
    console.error("Layout data fetch error:", err);
  }

  return (
    <html lang="en" data-scroll-behavior="smooth" className={`h-full antialiased ${inter.variable}`}>
      <body className="min-h-full flex flex-col font-sans bg-white text-slate-900">
        <ProfileProvider initialProfile={initialProfile}>
          <SettingsProvider initialSettings={initialSettings}>
            {children}
            <Toaster position="bottom-right" />
          </SettingsProvider>
        </ProfileProvider>
      </body>
    </html>
  );
}
