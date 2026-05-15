// utils/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // or use SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendApprovalEmail = async ({ to, name, courseCreationLink }) => {
  const mailOptions = {
    from: '"Pak eduToll Admin" <admin@pakedutoll.com>',
    to: to,
    subject: '🎉 Congratulations! Your Instructor Account is Approved',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c5f2d;">Welcome to Pak eduToll, ${name}!</h2>
        <p>We are excited to inform you that your instructor request has been <strong style="color: green;">approved</strong>.</p>
        <p>You can now start creating and publishing courses on our platform.</p>
        <a href="${courseCreationLink}" style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Create Your First Course →
        </a>
        <p>Best regards,<br>Pak eduToll Team</p>
      </div>
    `
  };
  
  await transporter.sendMail(mailOptions);
};