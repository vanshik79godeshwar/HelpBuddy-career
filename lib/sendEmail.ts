// lib/sendEmail.ts
import nodemailer from 'nodemailer';

// Configure the transporter with your SMTP settings
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Assuming you are using Gmail; change if using another provider
  port: 587,
  secure: false, // Set to true if using a secure connection (e.g., port 465)
  auth: {
    user: process.env.EMAIL_USER, // Use the EMAIL_USER environment variable
    pass: process.env.EMAIL_PASS, // Use the EMAIL_PASS environment variable
  },
});

export default async function sendEmail({ to, subject, text }: { to: string; subject: string; text: string }) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // Use the same email address as the sender
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}