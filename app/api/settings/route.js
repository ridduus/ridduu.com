import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import Setting from '@/models/Setting';
import Project from '@/models/Project';
import Review from '@/models/Review';
import { requireAuth, unauthorizedResponse } from '@/lib/auth';
import { sanitizeObject } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
        projects: [],
        services: [
          { key: 'softwareService', name: 'Software Development', value: true },
          { key: 'webService', name: 'Website Development', value: true },
          { key: 'mobileAppService', name: 'Mobile App Development', value: true },
          { key: 'iotService', name: 'IOT Development', value: true },
          { key: 'webHostingService', name: 'Web Hosting', value: true },
          { key: 'appDeplyService', name: 'App Deployment', value: true },
        ],
        reviews: []
      });
    }

    const allProjects = await Project.find().lean();
    const existingProjectsMap = new Map((settingsDoc.projects || []).map(p => [p.key, p]));

    const mergedProjects = allProjects.map(proj => {
      const projKey = proj.key || proj._id.toString();
      if (existingProjectsMap.has(projKey)) {
        return {
          ...existingProjectsMap.get(projKey),
          name: proj.title || existingProjectsMap.get(projKey).name,
        };
      }
      return {
        key: projKey,
        name: proj.title,
        value: true,
      };
    });

    (settingsDoc.projects || []).forEach(p => {
      if (!mergedProjects.some(m => m.key === p.key)) {
        mergedProjects.push(p);
      }
    });

    const allReviews = await Review.find().lean();
    const existingReviewsMap = new Map((settingsDoc.reviews || []).map(r => [r.key, r]));

    const mergedReviews = allReviews.map(rev => {
      const revKey = rev.key || rev._id.toString();
      if (existingReviewsMap.has(revKey)) {
        return {
          ...existingReviewsMap.get(revKey),
          name: rev.name ? `${rev.name} (${rev.role || 'Review'})` : existingReviewsMap.get(revKey).name,
        };
      }
      return {
        key: revKey,
        name: rev.name ? `${rev.name} (${rev.role || 'Review'})` : 'Review',
        value: rev.approved !== false,
      };
    });

    (settingsDoc.reviews || []).forEach(r => {
      if (!mergedReviews.some(m => m.key === r.key)) {
        mergedReviews.push(r);
      }
    });

    const settingsData = {
      notifications: settingsDoc.notifications || [],
      projects: mergedProjects,
      services: settingsDoc.services || [],
      reviews: mergedReviews,
    };

    return NextResponse.json({
      success: true,
      settings: settingsData,
      data: settingsDoc,
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Server error', error: err.message }, { status: 500 });
  }
}



async function updateSettingsHandler(req) {
  try {
    const auth = await requireAuth(req);
    if (!auth) {
      return unauthorizedResponse();
    }

    await dbConnect();
    const rawBody = await req.json();
    const cleanBody = sanitizeObject(rawBody);

    const updatePayload = cleanBody.settings || cleanBody;

    let settingsDoc = await Setting.findOne();

    if (!settingsDoc) {
      settingsDoc = await Setting.create(updatePayload);
    } else {
      settingsDoc = await Setting.findByIdAndUpdate(settingsDoc._id, updatePayload, {
        new: true,
        runValidators: true,
      });
    }

    revalidatePath('/', 'layout');
    revalidatePath('/projects');
    revalidatePath('/about');
    revalidatePath('/reviews');
    revalidatePath('/skills');

    const settingsData = {
      notifications: settingsDoc.notifications || [],
      projects: settingsDoc.projects || [],
      services: settingsDoc.services || [],
      reviews: settingsDoc.reviews || [],
    };

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings: settingsData,
      data: settingsDoc,
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Server error', error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  return updateSettingsHandler(req);
}

export async function POST(req) {
  return updateSettingsHandler(req);
}

