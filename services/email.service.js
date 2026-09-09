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

const sendAccountCredentialsEmail = async ({
  to,
  firstName,
  temporaryPassword,
}) => {
  return sendEmail({
    to,
    subject: "Your VIS Boilerplate Account",
    text: `Hello ${firstName},

Your account has been created successfully.

Login Email: ${to}
Temporary Password: ${temporaryPassword}

Please log in and change your password after your first login.

Regards,
VIS Team`,
  });
};

const sendForgotPasswordOtpEmail = async ({ to, firstName, otp }) => {
  return sendEmail({
    to,
    subject: "Your Password Reset OTP",
    text: `Hello ${firstName},

Your password reset OTP is:

${otp}

This OTP will expire in 10 minutes.

If you did not request a password reset, please ignore this email.

Regards,
VIS Team`,
  });
};

const sendPasswordChangedEmail = async ({ to, firstName }) => {
  return sendEmail({
    to,
    subject: "Your Password Was Changed",
    text: `Hello ${firstName},

Your password has been changed successfully.

If you did not make this change, please contact support immediately.

Regards,
VIS Team`,
  });
};

module.exports = {
  sendEmail,
  sendAccountCredentialsEmail,
  sendForgotPasswordOtpEmail,
  sendPasswordChangedEmail,
};
