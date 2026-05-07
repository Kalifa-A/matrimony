const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.BREVO_EMAIL,
      pass: process.env.BREVO_PASS,
    },
    // Add connection timeout settings
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });
  console.log(process.env.BREVO_EMAIL);
  console.log(process.env.BREVO_PASS);
  const mailOptions = {
    from: `"Al Fattah Matrimony" <${process.env.BREVO_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  console.log(`Attempting to send email to: ${options.email} using Brevo...`);
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("Response:", info.response);
  } catch (error) {
    console.error("Nodemailer Error Details:", error);
    throw error; // Re-throw to be caught by the route handler
  }
};

module.exports = sendEmail;
