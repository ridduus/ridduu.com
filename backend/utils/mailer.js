import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "ronaksharma2350@gmail.com",
    pass: "xywsetcgaaqopfqs",
  },
});