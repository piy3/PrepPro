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

    // Get priority info
    const getPriorityInfo = (priority) => {
      const priorityMap = {
        "nice-to-have": { label: "Nice to have", color: "#10b981", icon: "💡" },
        important: { label: "Important", color: "#f59e0b", icon: "⭐" },
        critical: { label: "Critical", color: "#ef4444", icon: "🚀" },
      };
      return (
        priorityMap[priority] || {
          label: "Unknown",
          color: "#6b7280",
          icon: "💭",
        }
      );
    };

    const priorityInfo = getPriorityInfo(priority);

    // Email to admin for feature request
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || "yadavpiy02@gmail.com", // Admin email
      subject: `💡 Feature Request: ${subject} [${
        priority?.toUpperCase() || "UNKNOWN"
      }]`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669; border-bottom: 2px solid #a7f3d0; padding-bottom: 10px;">
            💡 New Feature Request
          </h2>
          
          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${
            priorityInfo.color
          };">
            <h3 style="color: #1f2937; margin-top: 0; display: flex; align-items: center;">
              ${priorityInfo.icon} Priority: ${priorityInfo.label}
            </h3>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Requester Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Category:</strong> ${type || "Not specified"}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="color: #1f2937; margin-top: 0;">Feature Title</h3>
            <p style="font-size: 18px; font-weight: bold; color: #059669;">${subject}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin-top: 15px;">
            <h3 style="color: #1f2937; margin-top: 0;">Feature Description</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #dbeafe; border-radius: 8px; border-left: 4px solid #2563eb;">
            <p style="margin: 0; color: #1e40af;">
              <strong>📝 Note:</strong><br>
              Consider this feature for the product roadmap<br>
              Respond to: ${email}
            </p>
          </div>
        </div>
      `,
    };

    // Auto-reply email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Feature Request Received - PrepPro Product Team",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669; border-bottom: 2px solid #a7f3d0; padding-bottom: 10px;">
            💡 Feature Request Received
          </h2>
          
          <p>Hi ${name},</p>
          
          <p>Thank you for your feature request! We love hearing ideas from our users about how we can make PrepPro even better.</p>
          
          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Your Feature Request</h3>
            <p><strong>Title:</strong> ${subject}</p>
            <p><strong>Category:</strong> ${type || "Not specified"}</p>
            <p><strong>Priority:</strong> ${priorityInfo.label}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
            <h3 style="color: #1e40af; margin-top: 0;">What happens next?</h3>
            <ol style="color: #1e40af; margin: 10px 0;">
              <li>Our product team will review your suggestion</li>
              <li>We'll evaluate the feature against our roadmap</li>
              <li>You might receive follow-up questions for clarification</li>
              <li>We'll keep you updated on the status</li>
            </ol>
          </div>
          
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;">
              <strong>💭 Did you know?</strong><br>
              Many of our best features came from user suggestions just like yours!
            </p>
          </div>
          
          <p>We appreciate you taking the time to help us improve PrepPro. Your feedback is invaluable to us!</p>
          
          <p>Best regards,<br>PrepPro Product Team</p>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #f3f4f6; border-radius: 8px; font-size: 12px; color: #6b7280;">
            <p style="margin: 0;">This is an automated response. You can reply to this email with additional details.</p>
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
      message: "Feature request submitted successfully",
    });
  } catch (error) {
    console.error("Error sending feature request email:", error);
    return NextResponse.json(
      { error: "Failed to submit feature request. Please try again." },
      { status: 500 }
    );
  }
}
