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
    const { name, email, subject, priority, type, message } =
      await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const transporter = createTransporter();

    // Get severity label
    const getSeverityInfo = (severity) => {
      const severityMap = {
        low: {
          label: "Low - Minor inconvenience",
          color: "#10b981",
          priority: "🟢",
        },
        medium: {
          label: "Medium - Affects functionality",
          color: "#f59e0b",
          priority: "🟡",
        },
        high: {
          label: "High - Major feature broken",
          color: "#ef4444",
          priority: "🟠",
        },
        critical: {
          label: "Critical - App unusable",
          color: "#dc2626",
          priority: "🔴",
        },
      };
      return (
        severityMap[severity] || {
          label: "Unknown",
          color: "#6b7280",
          priority: "⚪",
        }
      );
    };

    const severityInfo = getSeverityInfo(priority);

    // Email to admin for bug report
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || "yadavpiy02@gmail.com", // Admin email
      subject: `🐛 Bug Report: ${subject} [${
        priority?.toUpperCase() || "UNKNOWN"
      }]`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626; border-bottom: 2px solid #fecaca; padding-bottom: 10px;">
            🐛 New Bug Report
          </h2>
          
          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${
            severityInfo.color
          };">
            <h3 style="color: #1f2937; margin-top: 0; display: flex; align-items: center;">
              ${severityInfo.priority} Severity: ${severityInfo.label}
            </h3>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Reporter Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Browser:</strong> ${type || "Not specified"}</p>
            <p><strong>Reported:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="color: #1f2937; margin-top: 0;">Bug Title</h3>
            <p style="font-size: 18px; font-weight: bold; color: #dc2626;">${subject}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin-top: 15px;">
            <h3 style="color: #1f2937; margin-top: 0;">Bug Description</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e;">
              <strong>⚠️ Action Required:</strong><br>
              Please investigate and respond to: ${email}<br>
              Priority Level: ${severityInfo.label}
            </p>
          </div>
        </div>
      `,
    };

    // Auto-reply email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Bug Report Received - PrepPro Support",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626; border-bottom: 2px solid #fecaca; padding-bottom: 10px;">
            🐛 Bug Report Received
          </h2>
          
          <p>Hi ${name},</p>
          
          <p>Thank you for reporting this bug! We take all bug reports seriously and will investigate this issue promptly.</p>
          
          <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Bug Report Summary</h3>
            <p><strong>Title:</strong> ${subject}</p>
            <p><strong>Severity:</strong> ${severityInfo.label}</p>
            <p><strong>Browser:</strong> ${type || "Not specified"}</p>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
            <h3 style="color: #1e40af; margin-top: 0;">What happens next?</h3>
            <ol style="color: #1e40af; margin: 10px 0;">
              <li>Our development team will review your report</li>
              <li>We'll investigate and reproduce the issue</li>
              <li>You'll receive updates on our progress</li>
              <li>We'll notify you when the fix is deployed</li>
            </ol>
          </div>
          
          <p><strong>Expected Response Time:</strong></p>
          <ul>
            <li><strong>Critical:</strong> Within 2 hours</li>
            <li><strong>High:</strong> Within 6 hours</li>
            <li><strong>Medium:</strong> Within 24 hours</li>
            <li><strong>Low:</strong> Within 72 hours</li>
          </ul>
          
          <p>If you discover additional information about this bug, please reply to this email.</p>
          
          <p>Thank you for helping us improve PrepPro!</p>
          
          <p>Best regards,<br>PrepPro Development Team</p>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #f3f4f6; border-radius: 8px; font-size: 12px; color: #6b7280;">
            <p style="margin: 0;">This is an automated response. You can reply to this email with additional information.</p>
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
      message: "Bug report submitted successfully",
    });
  } catch (error) {
    console.error("Error sending bug report email:", error);
    return NextResponse.json(
      { error: "Failed to submit bug report. Please try again." },
      { status: 500 }
    );
  }
}
