const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP connection failed:", error.message);
  } else {
    console.log("SMTP server is ready to send emails");
  }
});

module.exports = transporter;
