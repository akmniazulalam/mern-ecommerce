const nodemailer = require("nodemailer");
import { Resend } from "resend";
async function emailVerification(email, otp) {
  // const transporter = nodemailer.createTransport({
  //   host: "smtp.gmail.com",
  //   port: 587,
  //   secure: false, // Use true for port 465, false for port 587
  //   family: 4,
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASS,
  //   },
  // });

  //   const info = await transporter.sendMail({
  //     from: `"Otp" <${process.env.EMAIL_USER}>`,
  //     to: email,
  //     subject: "Otp",
  //     text: "Otp Verification", // Plain-text version of the message
  //     html: `<h1>Your Otp is: ${otp}</h1>`, // HTML version of the message
  //   });

  const resend = new Resend(process.env.RESEND_API_KEY);

  resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Otp",
    html: `<h1>Your Otp is: ${otp}</h1>`,
  });
}

module.exports = emailVerification;
