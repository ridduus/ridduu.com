import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { email, password } = body;

    const admin = await Admin.findOne({ email }).lean();

    if (!admin) {
      return NextResponse.json({ message: 'Invalid email' }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid password' }, { status: 400 });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET || 'SECRET_KEY',
      { expiresIn: '1d' }
    );

    return NextResponse.json({
      message: 'Login successful',
      token,
    });
  } catch (err) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
