import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';
import { requireAuth, unauthorizedResponse } from '@/lib/auth';
import { apiLimiter } from '@/lib/rateLimit';

export async function GET(req) {
  const rateLimitResult = apiLimiter(req);
  if (!rateLimitResult.success) {
    return NextResponse.json({ success: false, message: rateLimitResult.message }, { status: 429 });
  }

  try {
    const auth = await requireAuth(req);
    if (!auth) {
      return unauthorizedResponse();
    }

    await dbConnect();
    const pendingReviews = await Review.find({ approved: false }).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      count: pendingReviews.length,
      data: pendingReviews,
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Server error', error: err.message }, { status: 500 });
  }
}
