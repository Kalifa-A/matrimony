const sendEmail = async (options) => {
  const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
  
  const emailData = {
    sender: {
      name: "Al Fattah Matrimony",
      email: process.env.BREVO_EMAIL, // Must be a verified sender in Brevo
    },
    to: [
      {
        email: options.email,
      },
    ],
    subject: options.subject,
    htmlContent: options.html,
  };

  console.log(`Attempting to send email to: ${options.email} via Brevo API...`);

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_PASS,
        'content-type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Brevo API Error Response:", data);
      throw new Error(data.message || "Failed to send email via Brevo API");
    }

    console.log("Email sent successfully via API!");
    console.log("Message ID:", data.messageId);
    
  } catch (error) {
    console.error("Brevo API Connection Error:", error.message);
    throw error;
  }
};

module.exports = sendEmail;
