import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';
import { requireAuth } from '@/lib/auth';
import { submissionLimiter, apiLimiter } from '@/lib/rateLimit';
import { sanitizeObject } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET: Public returns ONLY approved reviews; Admin gets all reviews if authenticated
export async function GET(req) {
  const rateLimitResult = apiLimiter(req);
  if (!rateLimitResult.success) {
    return NextResponse.json({ success: false, message: rateLimitResult.message }, { status: 429 });
  }

  try {
    await dbConnect();
    const auth = await requireAuth(req);

    // If admin is authenticated, return all reviews. Otherwise return ONLY approved reviews.
    const query = auth ? {} : { approved: true };
    const data = await Review.find(query).lean().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, count: data.length, data });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Server Error', error: err.message }, { status: 500 });
  }
}

// POST: Submit a new review
export async function POST(req) {
  const rateLimitResult = submissionLimiter(req);
  if (!rateLimitResult.success) {
    return NextResponse.json({ success: false, message: rateLimitResult.message }, { status: 429 });
  }

  try {
    await dbConnect();
    const auth = await requireAuth(req);
    const rawBody = await req.json();
    const cleanBody = sanitizeObject(rawBody);

    const { name, email, rating, message, role } = cleanBody;

    if (!name || !email || !rating || !message) {
      return NextResponse.json(
        { success: false, message: 'Name, email, rating, and message are required' },
        { status: 400 }
      );
    }

    const review = await Review.create({
      name,
      email,
      role: role || 'Professional',
      rating: Number(rating),
      message,
      approved: auth ? (cleanBody.approved !== undefined ? cleanBody.approved : true) : false,
    });

    return NextResponse.json(
      {
        success: true,
        message: auth ? 'Review created successfully' : 'Review submitted successfully! It will be published after admin approval.',
        data: review,
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

