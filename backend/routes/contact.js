// import express from "express";
// import Contact from "../models/Contact.js";
// import { verifyToken } from "../middleware/auth.js";

// const router = express.Router();


// // GET all contacts (admin ke liye)
// router.get("/", async (req, res) => {

//   try {

//     const contacts = await Contact.find().sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       count: contacts.length,
//       data: contacts
//     });

//   } catch (err) {

//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: err.message
//     });

//   }

// });


// // POST contact form data
// router.post("/", async (req, res) => {

//   try {

//     const { name, email, subject, message } = req.body;

//     // validation
//     if (!name || !email || !message) {

//       return res.status(400).json({
//         success: false,
//         message: "Please provide name, email and message"
//       });

//     }

//     const contact = await Contact.create({
//       name,
//       email,
//       subject,
//       message
//     });

//     res.status(201).json({
//       success: true,
//       message: "Contact message saved successfully",
//       data: contact
//     });

//   } catch (err) {

//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: err.message
//     });

//   }

// });

// export default router;

import express from "express";
import Contact from "../models/Contact.js";
import Settings from "../models/Setting.js"; // 👈 ADD THIS
import { transporter } from "../utils/mailer.js";

const router = express.Router();

// ==========================
// 🔔 CHECK NOTIFICATION
// ==========================
const canSend = async (key) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) return true; // fallback

    const found = settings.notifications?.find((i) => i.key === key);
    return found ? found.value : true;
  } catch {
    return true;
  }
};

// GET all contacts
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
});

// POST contact
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and message"
      });
    }

    const contact = await Contact.create({ name, email, subject, message });

    // =========================
    // 📩 ADMIN MAIL
    // =========================
    if (await canSend("contactrequestMail")) {
      await transporter.sendMail({
        from: '"ridduu.com" <ronaksharma2350@gmail.com>',
        to: "ronaksharma2350@gmail.com",
        subject: `New Contact: ${subject || "No Subject"}`,
        // html: `...YOUR EXISTING TEMPLATE...`,
      });

      console.log("✅ Admin mail sent");
    } else {
      console.log("🚫 Admin mail disabled");
    }

    // =========================
    // 📩 USER AUTO REPLY
    // =========================
    if (await canSend("contactrequestMail")) {
      await transporter.sendMail({
        from: '"ridduu.com" <ronaksharma2350@gmail.com>',
        to: email,
        subject: "We received your message",
        // html: `...YOUR EXISTING TEMPLATE...`,
      });

      console.log("✅ User mail sent");
    } else {
      console.log("🚫 User mail disabled");
    }

    res.status(201).json({
      success: true,
      message: "Contact saved",
      data: contact
    });

  } catch (err) {
    console.error("❌ Contact Error:", err);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
});

export default router;