import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import Profile from '@/models/Profile';

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
    await dbConnect();
    const body = await req.json();
    let profile = await Profile.findOne().lean();
    
    const data = {
      name: body.name,
      designation: body.designation,
      phone: body.phone,
      email: body.email,
      location: body.location,
      desc1: body.desc1,
      desc2: body.desc2,
      stats: body.stats || [],
      profileImg: body.profileImg || "",
      cv: body.cv || "",
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
