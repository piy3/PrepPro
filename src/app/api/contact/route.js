import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail", // You can change this to your email provider
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your app password
    },
  });
};

export async function POST(request) {
  try {
    const { name, email, subject, type, priority, message } =
      await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const transporter = createTransporter();

    // Email to admin
    const adminMailOptions = {
      from: email,
      to: process.env.ADMIN_EMAIL || "yadavpiy02@gmail.com", // Admin email
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Type:</strong> ${type || "Not specified"}</p>
            <p><strong>Priority:</strong> ${priority || "Not specified"}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="color: #1f2937; margin-top: 0;">Message</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #dbeafe; border-radius: 8px; border-left: 4px solid #2563eb;">
            <p style="margin: 0; color: #1e40af;">
              <strong>Reply to:</strong> ${email}<br>
              <strong>Submitted:</strong> ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `,
    };

    // Auto-reply email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank you for contacting PrepPro Support",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            Thank you for reaching out!
          </h2>
          
          <p>Hi ${name},</p>
          
          <p>We've received your message and will get back to you as soon as possible. Here's a summary of what you submitted:</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Type:</strong> ${type || "General Inquiry"}</p>
            <p><strong>Priority:</strong> ${priority || "Medium"}</p>
          </div>
          
          <p>Our typical response times:</p>
          <ul>
            <li><strong>Low/Medium Priority:</strong> Within 24 hours</li>
            <li><strong>High Priority:</strong> Within 12 hours</li>
            <li><strong>Urgent:</strong> Within 2 hours</li>
          </ul>
          
          <p>If you have any urgent issues, please call us at +91-9696683107.</p>
          
          <p>Best regards,<br>PrepPro Support Team</p>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #f3f4f6; border-radius: 8px; font-size: 12px; color: #6b7280;">
            <p style="margin: 0;">This is an automated response. Please do not reply to this email.</p>
          </div>
        </div>
      `,
    };

    // Send emails
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
