const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  
  // Define email options
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'ShifoOnline Hospital <noreply@shifoonline.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🏥 ShifoOnline Hospital</h1>
        </div>
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #333;">${options.subject}</h2>
          <div style="background-color: white; padding: 20px; border-radius: 5px; margin-top: 15px;">
            ${options.message.replace(/\n/g, '<br>')}
          </div>
          <p style="color: #666; margin-top: 20px;">
            This is an automated message from ShifoOnline Hospital System.
            Please do not reply to this email.
          </p>
        </div>
        <div style="background-color: #f1f1f1; padding: 15px; text-align: center; color: #666; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} ShifoOnline Hospital. All rights reserved.</p>
          <p>Contact: support@shifoonline.com | Phone: +252 61 123 4567</p>
        </div>
      </div>
    `
  };
  
  // Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;