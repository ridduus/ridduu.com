import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import Setting from '@/models/Setting';
import { requireAuth, unauthorizedResponse } from '@/lib/auth';
import { sanitizeObject } from '@/lib/sanitize';

export async function GET() {
  try {
    await dbConnect();
    let settingsDoc = await Setting.findOne().lean();
    
    if (!settingsDoc) {
      settingsDoc = await Setting.create({
        notifications: [
          { key: 'reviewMail', name: 'Review Notification Mail', value: true },
          { key: 'contactrequestMail', name: 'Contact Request Mail', value: true },
        ],
        projects: [
          { key: 'showClientProjects', name: 'Show Client Projects', value: true },
        ],
        services: [
          { key: 'softwareService', name: 'Software Development', value: true },
          { key: 'webService', name: 'Website Development', value: true },
          { key: 'mobileAppService', name: 'Mobile App Development', value: true },
          { key: 'iotService', name: 'IOT Development', value: true },
          { key: 'webHostingService', name: 'Web Hosting', value: true },
          { key: 'appDeplyService', name: 'App Deployment', value: true },
        ],
        reviews: [
          { key: 'showReviews', name: 'Show Public Reviews', value: true },
        ]
      });
    }

    // Standardized payload containing both settings property and data property for robust access
    const settingsData = settingsDoc.settings || settingsDoc;

    return NextResponse.json({
      success: true,
      settings: settingsData,
      data: settingsDoc,
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Server error', error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const auth = await requireAuth(req);
    if (!auth) {
      return unauthorizedResponse();
    }

    await dbConnect();
    const rawBody = await req.json();
    const cleanBody = sanitizeObject(rawBody);

    let settingsDoc = await Setting.findOne();

    if (!settingsDoc) {
      settingsDoc = await Setting.create(cleanBody);
    } else {
      settingsDoc = await Setting.findByIdAndUpdate(settingsDoc._id, cleanBody, {
        new: true,
        runValidators: true,
      });
    }

    revalidatePath('/', 'layout');

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings: settingsDoc.settings || settingsDoc,
      data: settingsDoc,
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Server error', error: err.message }, { status: 500 });
  }
}
