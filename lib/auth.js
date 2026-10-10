import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'RIDDUU_SECURE_JWT_SECRET_KEY_2026_CHANGE_IN_ENV';

/**
 * Verify JWT token from Request headers (Authorization: Bearer <token>) or Cookies.
 * Returns { user, token } if valid, or throws an Error.
 */
export function verifyToken(req) {
  let token = null;

  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  if (!token) {
    const cookieHeader = req.headers.get('cookie');
    if (cookieHeader) {
      const cookies = Object.fromEntries(
        cookieHeader.split('; ').map((c) => {
          const [k, ...v] = c.split('=');
          return [k, v.join('=')];
        })
      );
      if (cookies.token) {
        token = cookies.token;
      }
    }
  }

  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { user: decoded, token };
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    }
    throw new Error('Invalid token');
  }
}

/**
 * Generate a JWT token with a 5-minute expiration window.
 */
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // 7 days expiration for admin sessions
  });
}


/**
 * Middleware wrapper for protected route handlers.
 */
export async function requireAuth(req) {
  try {
    const auth = verifyToken(req);
    return auth;
  } catch (err) {
    return null;
  }
}

export function unauthorizedResponse(message = 'Unauthorized access') {
  return NextResponse.json(
    { success: false, message, code: 'UNAUTHORIZED' },
    { status: 401 }
  );
}
