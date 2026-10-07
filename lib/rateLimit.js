/**
 * Sliding Window In-Memory Rate Limiter for DDoS & Brute-Force Prevention
 */

const rateLimitMap = new Map();

// Clean up expired entries every 5 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitMap.entries()) {
    if (now > data.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function rateLimit({ key = 'global', limit = 30, windowMs = 60 * 1000 }) {
  return function check(req) {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0] ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    const identifier = `${key}:${ip}`;
    const now = Date.now();

    if (!rateLimitMap.has(identifier)) {
      rateLimitMap.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });
      return { success: true, remaining: limit - 1, resetTime: now + windowMs };
    }

    const current = rateLimitMap.get(identifier);

    if (now > current.resetTime) {
      current.count = 1;
      current.resetTime = now + windowMs;
      return { success: true, remaining: limit - 1, resetTime: current.resetTime };
    }

    current.count += 1;

    if (current.count > limit) {
      return {
        success: false,
        remaining: 0,
        resetTime: current.resetTime,
        message: 'Too many requests. Please try again later.',
      };
    }

    return {
      success: true,
      remaining: limit - current.count,
      resetTime: current.resetTime,
    };
  };
}

export const authLimiter = rateLimit({ key: 'auth', limit: 5, windowMs: 60 * 1000 }); // 5 attempts per minute
export const submissionLimiter = rateLimit({ key: 'submission', limit: 10, windowMs: 60 * 1000 }); // 10 submissions per minute
export const apiLimiter = rateLimit({ key: 'api', limit: 60, windowMs: 60 * 1000 }); // 60 requests per minute
