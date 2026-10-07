import { NextResponse } from 'next/server';
import { verifyToken, generateToken, unauthorizedResponse } from '@/lib/auth';
import { apiLimiter } from '@/lib/rateLimit';

export async function POST(req) {
  const rateLimitResult = apiLimiter(req);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { success: false, message: rateLimitResult.message },
      { status: 429 }
    );
  }

  try {
    const auth = verifyToken(req);
    if (!auth || !auth.user) {
      return unauthorizedResponse('Invalid token for refresh');
    }

    // Issue a fresh 5-minute JWT token
    const newToken = generateToken({
      id: auth.user.id,
      email: auth.user.email,
    });

    const response = NextResponse.json({
      success: true,
      token: newToken,
      expiresIn: 300,
    });

    response.cookies.set('token', newToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 300,
      path: '/',
    });

    return response;
  } catch (err) {
    return unauthorizedResponse('Session expired, please login again');
  }
}
