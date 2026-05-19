// import express from "express";
// import Review from "../models/Review.js";
// import { verifyToken } from "../middleware/auth.js";

// const router = express.Router();

// // ✅ GET approved reviews (public + admin)
// router.get("/", async (req, res) => {
//   try {
//     const reviews = await Review.find({ approved: true })
//       .sort({ createdAt: -1 })
//       .select("-email");

//     res.json({ success: true, count: reviews.length, data: reviews });
//   } catch (err) {
//     res.status(500).json({ success: false });
//   }
// });

// // 🆕 GET pending reviews (admin)
// router.get("/pending", verifyToken, async (req, res) => {
//   try {
//     const reviews = await Review.find({ approved: false }).sort({ createdAt: -1 });
//     res.json({ success: true, data: reviews });
//   } catch {
//     res.status(500).json({ success: false });
//   }
// });

// // ✅ POST review (NO TOKEN)
// router.post("/", async (req, res) => {
//   try {
//     const { name, email, role, rating, message } = req.body;

//     if (!name || !email || !rating || !message) {
//       return res.status(400).json({ success: false, message: "All fields required" });
//     }

//     const review = await Review.create({
//       name,
//       email,
//       role,
//       rating,
//       message,
//       approved: false, // 🔥 important
//     });

//     res.status(201).json({
//       success: true,
//       message: "Review submitted, waiting for approval",
//     });
//   } catch (err) {
//     res.status(500).json({ success: false });
//   }
// });

// // 🆕 APPROVE review
// router.patch("/approve/:id", verifyToken, async (req, res) => {
//   try {
//     await Review.findByIdAndUpdate(req.params.id, { approved: true });
//     res.json({ success: true, message: "Approved" });
//   } catch {
//     res.status(500).json({ success: false });
//   }
// });

// // DELETE
// router.delete("/:id", verifyToken, async (req, res) => {
//   try {
//     await Review.findByIdAndDelete(req.params.id);
//     res.json({ success: true });
//   } catch {
//     res.status(500).json({ success: false });
//   }
// });

// export default router;

import express from "express";
import Review from "../models/Review.js";
import Settings from "../models/Setting.js"; // 👈 ADD
import { verifyToken } from "../middleware/auth.js";
import { transporter } from "../utils/mailer.js";

const router = express.Router();

// ==========================
// 🔔 CHECK NOTIFICATION
// ==========================
const canSend = async (key) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) return true;

    const found = settings.notifications?.find((i) => i.key === key);
    return found ? found.value : true;
  } catch {
    return true;
  }
};

// ==========================
// ESCAPE
// ==========================
const escapeHTML = (str = "") =>
  str.replace(/[&<>"']/g, (tag) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[tag]));

// ==========================
// TEMPLATE
// ==========================
const emailTemplate = (title, content) => `
<div style="background:#f4f6f9;padding:30px;font-family:Arial;">
  <table style="max-width:600px;margin:auto;background:#fff;border-radius:10px;">
    <tr>
      <td style="background:#6c63ff;color:#fff;padding:20px;text-align:center;">
        <h2>${title}</h2>
      </td>
    </tr>
    <tr>
      <td style="padding:20px;">${content}</td>
    </tr>
  </table>
</div>
`;

// ==========================
// ✅ GET approved reviews
// ==========================
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true })
      .sort({ createdAt: -1 })
      .select("-email");

    res.json({ success: true, count: reviews.length, data: reviews });
  } catch {
    res.status(500).json({ success: false });
  }
});

// ==========================
// 🆕 GET pending reviews
// ==========================
router.get("/pending", verifyToken, async (req, res) => {
  try {
    const reviews = await Review.find({ approved: false }).sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch {
    res.status(500).json({ success: false });
  }
});

// ==========================
// POST REVIEW
// ==========================
router.post("/", async (req, res) => {
  try {
    const { name, email, rating, message } = req.body;

    if (!name || !email || !rating || !message) {
      return res.status(400).json({ success: false });
    }

    const review = await Review.create({
      name,
      email,
      rating,
      message,
      approved: false,
    });

    // 📩 ADMIN
    if (await canSend("reviewrequestMail")) {
      await transporter.sendMail({
        from: '"ridduu.com" <ronaksharma2350@gmail.com>',
        to: "ronaksharma2350@gmail.com",
        subject: "New Review",
        html: emailTemplate(
          "New Review",
          `${escapeHTML(name)} - ${escapeHTML(message)}`
        ),
      });
      console.log("✅ Admin review mail");
    }
    console.log("✅ Mail Disabled");

    // 📩 USER PENDING
    if (await canSend("reviewrequestMail")) {
      await transporter.sendMail({
        from: '"ridduu.com" <ronaksharma2350@gmail.com>',
        to: email,
        subject: "Review Received",
        html: emailTemplate(
          "Review Received",
          `Hi ${escapeHTML(name)}, your review is under approval`
        ),
      });
      console.log("✅ User pending mail");
    }

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// ==========================
// APPROVE
// ==========================
router.patch("/approve/:id", verifyToken, async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );

    if (!review) return res.status(404).json({ success: false });

    // 📩 APPROVAL MAIL
    if (await canSend("reviewrequestMail")) {
      await transporter.sendMail({
        to: review.email,
        subject: "Approved",
        html: emailTemplate(
          "Approved 🎉",
          `Hi ${escapeHTML(review.name)}, your review is live!`
        ),
      });

      console.log("✅ Approval mail");
    }

    res.json({ success: true });

  } catch {
    res.status(500).json({ success: false });
  }
});

export default router;