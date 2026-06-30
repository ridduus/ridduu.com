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
  title: "Ronak Sharma || Software Engineer",
  description: "Ronak Sharma - Full Stack Developer",
};

export const revalidate = 3600; // ISR: Revalidate every hour fallback

export default async function RootLayout({ children }) {
  let initialProfile = null;
  let initialSettings = {};
  
  try {
    await dbConnect();
    const profile = await Profile.findOne().lean();
    if (profile) {
      initialProfile = JSON.parse(JSON.stringify(profile));
    }

    const settingsDoc = await Setting.findOne().lean();
    if (settingsDoc && settingsDoc.settings) {
      initialSettings = JSON.parse(JSON.stringify(settingsDoc.settings));
    }
  } catch (err) {
    console.error("Layout data fetch error:", err);
  }

  return (
    <html lang="en" className={`h-full antialiased ${inter.variable}`}>
      <body className="min-h-full flex flex-col font-sans" style={{ backgroundColor: "var(--color-dark)" }}>
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
