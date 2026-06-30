import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Experience from '@/models/Experience';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const data = await Experience.findById(id);
    if (!data) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Invalid ID' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    const data = await Experience.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!data) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const data = await Experience.findByIdAndDelete(id);
    if (!data) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
  }
}
