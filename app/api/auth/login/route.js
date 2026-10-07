import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth';
import { authLimiter } from '@/lib/rateLimit';
import { sanitizeObject } from '@/lib/sanitize';

export async function POST(req) {
  // DDoS & Brute Force Rate Limiting
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
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide email and password' },
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' }, { status: 400 });
    }

    // Generate token valid for 5 minutes
    const token = generateToken({ id: admin._id, email: admin.email });

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      expiresIn: 300, // 5 minutes in seconds
    });

    // Also set HTTP-only style cookie for extra security
    response.cookies.set('token', token, {
      httpOnly: false, // accessible to client for headers
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 300, // 5 minutes
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
