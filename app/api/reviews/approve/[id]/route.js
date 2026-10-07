import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';
import { requireAuth, unauthorizedResponse } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function PATCH(req, { params }) {
  try {
    const auth = await requireAuth(req);
    if (!auth) {
      return unauthorizedResponse();
    }

    await dbConnect();
    const { id } = await params;

    const review = await Review.findByIdAndUpdate(
      id,
      { approved: true },
      { new: true }
    );

    if (!review) {
      return NextResponse.json({ success: false, message: 'Review not found' }, { status: 404 });
    }

    revalidatePath('/reviews');

    return NextResponse.json({
      success: true,
      message: 'Review approved successfully',
      data: review,
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Server error', error: err.message }, { status: 500 });
  }
}
