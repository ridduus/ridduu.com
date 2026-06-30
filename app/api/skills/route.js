import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Skill from '@/models/Skill';

export async function GET() {
  try {
    await dbConnect();
    const data = await Skill.find().lean().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, count: data.length, data });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Server Error', error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const data = await Skill.create(body);
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
