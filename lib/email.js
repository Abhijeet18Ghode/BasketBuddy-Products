import nodemailer from 'nodemailer';

// Configure the transport options for Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use another service like SendGrid, Mailgun, etc.
  auth: {
    user: process.env.EMAIL_USER,  // Your email address
    pass: process.env.EMAIL_PASS,  // Your email password or an app-specific password
  },
});

// Function to send an email
export const sendOrderUpdateEmail = async (recipient, subject, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,   // Your email address
    to: recipient,                  // Recipient's email address
    subject: subject,               // Email subject
    text: message,                  // Email body (text version)
    html: `<p>${message}</p>`,      // Email body (HTML version)
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
