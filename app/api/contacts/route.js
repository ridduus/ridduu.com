import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Contact from '@/models/Contact';
import Settings from '@/models/Setting';
import { getTransporter } from '@/lib/mailer';
import { requireAuth, unauthorizedResponse } from '@/lib/auth';
import { submissionLimiter, apiLimiter } from '@/lib/rateLimit';
import { sanitizeObject } from '@/lib/sanitize';

const canSend = async (key) => {
  try {
    const settings = await Settings.findOne().lean();
    if (!settings) return true;

    const found = settings.notifications?.find((i) => i.key === key);
    return found ? found.value : true;
  } catch {
    return true;
  }
};

// Protected: Only Admin can fetch contact requests
export async function GET(req) {
  const rateLimitResult = apiLimiter(req);
  if (!rateLimitResult.success) {
    return NextResponse.json({ success: false, message: rateLimitResult.message }, { status: 429 });
  }

  try {
    const auth = await requireAuth(req);
    if (!auth) {
      return unauthorizedResponse();
    }

    await dbConnect();
    const contacts = await Contact.find().lean().sort({ createdAt: -1 });
    return NextResponse.json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Server error', error: err.message },
      { status: 500 }
    );
  }
}

// Public: Rate-limited and sanitized contact submission
export async function POST(req) {
  const rateLimitResult = submissionLimiter(req);
  if (!rateLimitResult.success) {
    return NextResponse.json({ success: false, message: rateLimitResult.message }, { status: 429 });
  }

  try {
    await dbConnect();
    const rawBody = await req.json();
    const cleanBody = sanitizeObject(rawBody);
    const { name, email, subject, message } = cleanBody;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Please provide name, email and message' },
        { status: 400 }
      );
    }

    const contact = await Contact.create({ name, email, subject, message });

    try {
      const transporter = getTransporter();

      // Admin Mail
      if (await canSend('contactrequestMail')) {
        const adminHtml = `
        <div style="background-color: #121212; padding: 40px; font-family: 'Inter', Helvetica, sans-serif; color: #ffffff;">
          <div style="max-width: 600px; margin: 0 auto; background: #1e1e2f; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <div style="background: linear-gradient(135deg, #6c63ff, #ff6584); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">New Contact Request</h1>
            </div>
            <div style="padding: 30px;">
              <p style="margin: 0 0 15px 0; color: #a0a0b0; font-size: 15px;">You have received a new message from your portfolio.</p>
              
              <div style="background: #2a2a3c; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                <p style="margin: 0 0 10px 0; font-size: 15px;"><strong>Name:</strong> <span style="color: #ffffff;">${name}</span></p>
                <p style="margin: 0 0 10px 0; font-size: 15px;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #6c63ff; text-decoration: none;">${email}</a></p>
                <p style="margin: 0; font-size: 15px;"><strong>Subject:</strong> <span style="color: #ffffff;">${subject || 'No Subject'}</span></p>
              </div>

              <h3 style="color: #ff6584; margin: 0 0 10px 0; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Message:</h3>
              <div style="background: #2a2a3c; padding: 20px; border-radius: 8px; color: #e0e0e0; line-height: 1.6; white-space: pre-wrap;">${message}</div>
            </div>
            <div style="padding: 20px; text-align: center; background: #1a1a2e; color: #666677; font-size: 12px;">
              &copy; ${new Date().getFullYear()} ridduu.com. All rights reserved.
            </div>
          </div>
        </div>
        `;

        await transporter.sendMail({
          from: `"ridduu.com" <${process.env.MAIL_FROM}>`,
          to: process.env.MAIL_TO,
          subject: `New Contact: ${subject || 'No Subject'}`,
          text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
          html: adminHtml,
        });
      }

      // User Auto Reply
      if (await canSend('contactrequestMail')) {
        const userHtml = `
        <div style="background-color: #121212; padding: 40px; font-family: 'Inter', Helvetica, sans-serif; color: #ffffff;">
          <div style="max-width: 600px; margin: 0 auto; background: #1e1e2f; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <div style="background: linear-gradient(135deg, #6c63ff, #ff6584); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">Thank you for reaching out!</h1>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #ffffff; margin: 0 0 20px 0; font-size: 20px;">Hi ${name},</h2>
              <p style="color: #e0e0e0; line-height: 1.6; margin: 0 0 20px 0; font-size: 15px;">
                We have received your message and appreciate you taking the time to contact us. 
                I will review your inquiry and get back to you as soon as possible.
              </p>
              
              <div style="background: #2a2a3c; padding: 20px; border-radius: 8px; border-left: 4px solid #6c63ff; margin-bottom: 30px;">
                <h3 style="color: #a0a0b0; margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Your Message</h3>
                <p style="color: #ffffff; margin: 0; line-height: 1.5; white-space: pre-wrap;">${message}</p>
              </div>
              
              <div style="text-align: center;">
                <a href="https://ridduu.com" style="display: inline-block; background: #6c63ff; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 30px; font-weight: 600; font-size: 14px;">Visit Portfolio</a>
              </div>
            </div>
            <div style="padding: 20px; text-align: center; background: #1a1a2e; color: #666677; font-size: 12px;">
              &copy; ${new Date().getFullYear()} ridduu.com. Please do not reply to this automated email.
            </div>
          </div>
        </div>
        `;

        await transporter.sendMail({
          from: `"ridduu.com" <${process.env.MAIL_FROM}>`,
          to: email,
          subject: 'We received your message',
          text: `Hi ${name},\n\nWe received your message and will get back to you shortly.\n\nMessage:\n${message}`,
          html: userHtml,
        });
      }
    } catch (mailErr) {
      console.warn('Mail sending warning:', mailErr.message);
    }

    return NextResponse.json(
      { success: true, message: 'Contact message saved successfully', data: contact },
      { status: 201 }
    );
  } catch (err) {
    console.error('❌ Contact Error:', err);
    return NextResponse.json(
      { success: false, message: 'Server error', error: err.message },
      { status: 500 }
    );
  }
}
