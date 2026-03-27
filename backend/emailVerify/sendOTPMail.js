import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendResetOTPEmail = async (otp, email) => {
  await transporter.sendMail({
    from: `"AllinOneBazar" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "AllinOneBazar Reset Password OTP",
    html: `
      <h2>Password Reset OTP</h2>
      <p>Dear User,</p>
      <p>Your OTP for password reset is:</p>
      <h1 style="color:#f97316;letter-spacing:5px;">${otp}</h1>
      <p>This OTP expires in 10 minutes.</p>
      <p>Best regards, Team AllinoneBazar</p>
    `,
  });
};

export default sendResetOTPEmail;