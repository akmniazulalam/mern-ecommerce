const nodemailer = require("nodemailer");
const { Resend } = require("resend");
const { getEnv } = require("../config/env");
const axios = require("axios");

async function emailVerification(email, otp) {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: process.env.EMAIL_NAME,
          email: process.env.EMAIL_FROM,
        },
        to: [
          {
            email,
          },
        ],
        subject: "OTP Verification",
        htmlContent: `
          <h2>OTP Verification</h2>
          <p>Your OTP is:</p>
          <h1>${otp}</h1>
          <p>This OTP will expire in 5 minutes.</p>
        `,
      },
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
      }
    );

    console.log("Email sent:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Brevo Error:",
      error.response?.data || error.message
    );

    throw error;
  }
  // const resend = new Resend(getEnv("RESEND_API_KEY"));

  // await resend.emails.send({
  //   from: "Otp <onboarding@resend.dev>",
  //   to: email,
  //   subject: "Otp",
  //   html: `<h1>Your Otp is: ${otp}</h1>`,
  // });
}

module.exports = emailVerification;
