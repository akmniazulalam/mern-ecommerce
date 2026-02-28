const nodemailer = require("nodemailer");

async function emailVerification(email, otp){
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: "niazulalam097@gmail.com",
    pass: "bktukefpdjtjazuv",
  },
});


  const info = await transporter.sendMail({
    from: '"Otp" <niazulalam097@gmail.com>',
    to: email,
    subject: "Otp",
    text: "Otp Verification", // Plain-text version of the message
    html: `<h1>Your Otp is: ${otp}</h1>`, // HTML version of the message
  });
}

module.exports = emailVerification