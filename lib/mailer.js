import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

let cached = global.transporter;

if (!cached) {
  cached = global.transporter = null;
}

export const getTransporter = () => {
  if (cached) return cached;
  
  cached = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465, 
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  global.transporter = cached;
  return cached;
};
