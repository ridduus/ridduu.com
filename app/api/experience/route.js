import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Experience from '@/models/Experience';
import { requireAuth, unauthorizedResponse } from '@/lib/auth';
import { sanitizeObject } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {

  try {
    await dbConnect();
    const data = await Experience.find().lean().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, count: data.length, data });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Server Error', error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = await requireAuth(req);
    if (!auth) return unauthorizedResponse();

    await dbConnect();
    const rawBody = await req.json();
    const cleanBody = sanitizeObject(rawBody);
    const data = await Experience.create(cleanBody);
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
