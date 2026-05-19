import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";
import Setting from "./models/Setting.js";

dotenv.config();

const start = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ronak_portfolio"
    );

    console.log("✅ DB Connected");

    /* ================= ADMIN ================= */
    const existingAdmin = await Admin.findOne({ email: "admin@ridduu.com" });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("123456", 10);

      await Admin.create({
        email: "admin@ridduu.com",
        password: hashedPassword,
      });

      console.log("✅ Admin created");
    } else {
      console.log("⚠️ Admin already exists");
    }

    /* ================= SETTINGS ================= */
    const existingSettings = await Setting.findOne();

    if (!existingSettings) {
      await Setting.create({
        projects: [
          {
            key: "apnabackupsoftware",
            title: "Apna Backup Software",
            value: true,
          },
          {
            key: "jaindharohar",
            title: "Jain Dharohar",
            value: true,
          },
          {
            key: "apnabackupapp",
            title: "Apna Backup App",
            value: true,
          },
          {
            key: "apnaagendaapp",
            title: "Apna Agenda App",
            value: true,
          },
          {
            key: "apnabackupwebsite",
            title: "Apna Backup Website",
            value: true,
          },
          {
            key: "vironitechsoft",
            title: "Vironi TechSoft Website",
            value: true,
          },
          {
            key: "buydontbye",
            title: "Buy Don't Bye",
            value: true,
          },
          {
            key: "personalportfolio",
            title: "ridduu.com",
            value: true,
          },
        ],
        services: [
          {
            key: "softwareService",
            title: "Software Developement",
            value: true,
          },
          {
            key: "webService",
            title: "Website Developement",
            value: true,
          },
          {
            key: "mobileAppService",
            title: "Mobile Application Developement",
            value: true,
          },
          {
            key: "iotService",
            title: "IOT Developement",
            value: true,
          },
          {
            key: "webHostingService",
            title: "Web Hosting",
            value: true,
          },
          {
            key: "appDeplyService",
            title: "App Deployment",
            value: true,
          },
          {
            key: "wordpressService",
            title: "WordPress Developement",
            value: false,
          },
        ],
        notifications: [
          {
            key: "reviewrequestMail",
            title: "Review Request Notification",
            value: true,
          },
          {
            key: "contactrequestMail",
            title: "New Contact Query Notification",
            value: true,
          },
          // {
          //   key: "downloadCV",
          //   title: "CV Download Notification",
          //   value: false,
          // },
        ],
        reviews: [
          {
            key: "rahul",
            title: "Rahul Sharma",
            value: true,
          },
          {
            key: "jayesh",
            title: "Jayesh Gupta",
            value: true,
          },
          {
            key: "virat",
            title: "Virat Tiwari",
            value: false,
          },
          {
            key: "rupesh",
            title: "Rupesh Gupta",
            value: false,
          },
        ],
      });

      console.log("✅ Settings seeded");
    } else {
      console.log("⚠️ Settings already exist");
    }

    process.exit();
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

start();