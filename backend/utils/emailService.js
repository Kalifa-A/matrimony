const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.BREVO_EMAIL,
      pass: process.env.BREVO_PASS,
    },
    debug: true
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
