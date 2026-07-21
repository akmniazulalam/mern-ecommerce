const nodemailer = require("nodemailer");
const { Resend } = require("resend");
const { getEnv } = require("../config/env");

async function emailVerification(email, otp) {
  const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  logger: true,
  debug: true,
});
await transporter.verify();
console.log("SMTP Connected Successfully");
  const info = await transporter.sendMail({
    from: `"${process.env.EMAIL_NAME}" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Otp",
    text: "Otp Verification", // Plain-text version of the message
    html: `<h1>Your Otp is: ${otp}</h1>`, // HTML version of the message
  });
console.log(info);
console.log({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
  hasPass: !!process.env.SMTP_PASS,
});
  // const resend = new Resend(getEnv("RESEND_API_KEY"));

  // await resend.emails.send({
  //   from: "Otp <onboarding@resend.dev>",
  //   to: email,
  //   subject: "Otp",
  //   html: `<h1>Your Otp is: ${otp}</h1>`,
  // });
}

module.exports = emailVerification;
