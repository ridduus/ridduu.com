import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Contact from '@/models/Contact';
import { requireAuth, unauthorizedResponse } from '@/lib/auth';

export async function DELETE(req, { params }) {
  try {
    const auth = await requireAuth(req);
    if (!auth) {
      return unauthorizedResponse();
    }

    await dbConnect();
    const { id } = await params;

    const deletedContact = await Contact.findByIdAndDelete(id);
    if (!deletedContact) {
      return NextResponse.json({ success: false, message: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Contact message deleted successfully',
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Server error', error: err.message },
      { status: 500 }
    );
  }
}
