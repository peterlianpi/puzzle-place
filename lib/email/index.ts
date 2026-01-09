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
  if (!process.env.SMTP_FROM) {
    const errorMsg = 'SMTP_FROM environment variable is not set. Please set it to a valid email address.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  console.log(`Attempting to send email to: ${to}, subject: ${subject}`);
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
      html,
    });
    console.log(`Email sent successfully to: ${to}, messageId: ${info.messageId}`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw error;
  }
}
