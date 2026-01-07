import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'your-ethereal-user@ethereal.email',
    pass: process.env.SMTP_PASS || 'your-ethereal-password',
  },
  tls: {
    rejectUnauthorized: false,
  },
  debug: process.env.NODE_ENV === 'development', // Enable debug in development
  logger: process.env.NODE_ENV === 'development',
});

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
      html,
    });
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
