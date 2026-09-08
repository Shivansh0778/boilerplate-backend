const transporter = require("../config/email");

const sendEmail = async ({ to, subject, text, html }) => {
  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    text,
    html,
  });
};

module.exports = {
  sendEmail,
};