import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
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
    const { email, otp, newPassword } = body;

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Email, OTP code, and new password are required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'New password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Admin account not found.' },
        { status: 404 }
      );
    }

    if (!admin.resetOtp || admin.resetOtp !== String(otp).trim()) {
      return NextResponse.json(
        { success: false, message: 'Invalid OTP code. Please check and try again.' },
        { status: 400 }
      );
    }

    if (!admin.resetOtpExpire || new Date() > new Date(admin.resetOtpExpire)) {
      return NextResponse.json(
        { success: false, message: 'OTP code has expired. Please request a new OTP.' },
        { status: 400 }
      );
    }

    // Hash new password and clear OTP fields
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    admin.resetOtp = null;
    admin.resetOtpExpire = null;
    admin.resetPasswordToken = null;
    admin.resetPasswordExpire = null;
    await admin.save();

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.',
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return NextResponse.json(
      { success: false, message: 'Server error resetting password.' },
      { status: 500 }
    );
  }
}
