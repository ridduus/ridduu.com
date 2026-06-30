import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import dbConnect from '@/lib/db';
import Setting from '@/models/Setting';

export async function GET() {
  try {
    await dbConnect();
    let settings = await Setting.findOne().lean();
    
    if (!settings) {
      settings = await Setting.create({
        notifications: [
          { key: 'reviewMail', name: 'Review Notification Mail', value: true },
          { key: 'contactrequestMail', name: 'Contact Request Mail', value: true },
        ],
      });
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const body = await req.json();
    let settings = await Setting.findOne().lean();

    if (!settings) {
      settings = await Setting.create(body);
    } else {
      settings = await Setting.findByIdAndUpdate(settings._id, body, {
        new: true,
        runValidators: true,
      });
    }

    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, message: 'Settings Updated', data: settings });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
