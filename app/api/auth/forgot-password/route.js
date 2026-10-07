import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import { getTransporter } from '@/lib/mailer';
import { authLimiter } from '@/lib/rateLimit';
import { sanitizeObject } from '@/lib/sanitize';

export async function POST(req) {
  const rateLimitResult = authLimiter(req);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { success: false, message: rateLimitResult.message },
      { status: 429 }
    );
  }

  try {
    await dbConnect();
    const rawBody = await req.json();
    const body = sanitizeObject(rawBody);
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'No admin account found with this email address.' },
        { status: 404 }
      );
    }

    // Generate 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP and 10-minute expiration
    admin.resetOtp = otp;
    admin.resetOtpExpire = new Date(Date.now() + 10 * 60 * 1000);
    await admin.save();

    const mailOptions = {
      from: `"Ridduu Security" <${process.env.MAIL_FROM || process.env.SMTP_USER}>`,
      to: admin.email,
      subject: `[${otp}] Your Password Reset OTP Code - Ridduu Dashboard`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0f172a; color: #f8fafc; padding: 32px; border-radius: 16px; border: 1px solid #334155;">
          <h2 style="color: #6366f1; text-align: center; margin-bottom: 8px;">Verification Code</h2>
          <p style="text-align: center; color: #94a3b8; font-size: 14px; margin-top: 0;">Ridduu Admin Password Reset</p>
          <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
          <p style="font-size: 15px; color: #cbd5e1;">Use the following 6-digit OTP code to verify your identity and reset your password:</p>
          <div style="background: #1e293b; padding: 20px; text-align: center; border-radius: 12px; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #38bdf8; margin: 24px 0; border: 1px solid #475569;">
            ${otp}
          </div>
          <p style="font-size: 13px; color: #94a3b8; text-align: center;">This OTP is valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>
          <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
          <p style="font-size: 11px; color: #64748b; text-align: center;">If you did not request a password reset, please ignore this email.</p>
        </div>
      `,
    };

    try {
      const transporter = getTransporter();
      await transporter.sendMail(mailOptions);
    } catch (mailErr) {
      console.error('Failed to send OTP email:', mailErr);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to send OTP email. Please check SMTP settings.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'A 6-digit OTP code has been sent to your email address.',
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return NextResponse.json(
      { success: false, message: 'Server error processing request.' },
      { status: 500 }
    );
  }
}
