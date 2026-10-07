import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';
import { requireAuth, unauthorizedResponse } from '@/lib/auth';
import { sanitizeObject } from '@/lib/sanitize';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const data = await Review.findById(id);
    if (!data) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Invalid ID' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const auth = await requireAuth(req);
    if (!auth) return unauthorizedResponse();

    await dbConnect();
    const { id } = await params;
    const rawBody = await req.json();
    const cleanBody = sanitizeObject(rawBody);

    const data = await Review.findByIdAndUpdate(id, cleanBody, { new: true, runValidators: true });
    if (!data) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const auth = await requireAuth(req);
    if (!auth) return unauthorizedResponse();

    await dbConnect();
    const { id } = await params;
    const data = await Review.findByIdAndDelete(id);
    if (!data) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
