import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import Profile from '@/models/Profile';
import { requireAuth, unauthorizedResponse } from '@/lib/auth';
import { sanitizeObject } from '@/lib/sanitize';

export async function GET() {
  try {
    await dbConnect();
    const profile = await Profile.findOne().lean();
    if (!profile) {
      return NextResponse.json({ success: false, message: 'No profile found. Please add data first.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, profile });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = await requireAuth(req);
    if (!auth) return unauthorizedResponse();

    await dbConnect();
    const rawBody = await req.json();
    const cleanBody = sanitizeObject(rawBody);

    let profile = await Profile.findOne().lean();

    const data = {
      name: cleanBody.name,
      designation: cleanBody.designation,
      phone: cleanBody.phone,
      email: cleanBody.email,
      location: cleanBody.location,
      desc1: cleanBody.desc1,
      desc2: cleanBody.desc2,
      stats: cleanBody.stats || [],
      profileImg: cleanBody.profileImg || "",
      cv: cleanBody.cv || "",
    };

    if (profile) {
      profile = await Profile.findByIdAndUpdate(profile._id, data, { new: true });
    } else {
      profile = await Profile.create(data);
    }

    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, message: 'Profile saved successfully', profile });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
