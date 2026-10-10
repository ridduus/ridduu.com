import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';
import dbConnect from '@/lib/db';
import Profile from '@/models/Profile';
import { requireAuth, unauthorizedResponse } from '@/lib/auth';
import { sanitizeObject } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

    let cvUrl = cleanBody.cv || profile?.cv || "";

    // If base64 file uploaded, overwrite public/assets/Ronak_Sharma_CV.pdf on disk
    if (cleanBody.cv && typeof cleanBody.cv === 'string' && cleanBody.cv.startsWith("data:") && cleanBody.cv.includes(";base64,")) {
      try {
        const parts = cleanBody.cv.split(";base64,");
        const base64Data = parts[1];
        if (base64Data) {
          const buffer = Buffer.from(base64Data, 'base64');
          const assetsDir = path.join(process.cwd(), 'public', 'assets');
          await fs.mkdir(assetsDir, { recursive: true });
          const targetFilePath = path.join(assetsDir, 'Ronak_Sharma_CV.pdf');
          await fs.writeFile(targetFilePath, buffer);
          cvUrl = `/assets/Ronak_Sharma_CV.pdf?v=${Date.now()}`;
        }
      } catch (fileErr) {
        console.error("Failed to save CV PDF to public/assets:", fileErr);
      }
    }

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
      cv: cvUrl,
    };

    if (profile) {
      profile = await Profile.findByIdAndUpdate(profile._id, data, { new: true });
    } else {
      profile = await Profile.create(data);
    }

    revalidatePath('/', 'layout');
    revalidatePath('/about');
    revalidatePath('/');

    return NextResponse.json({ success: true, message: 'Profile saved successfully', profile });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

