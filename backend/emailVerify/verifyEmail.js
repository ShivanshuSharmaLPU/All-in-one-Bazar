import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const verifyEmail = async (token, email) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const verificationLink = `${frontendUrl}/verify/${token}`;

  await transporter.sendMail({
    from: `"AllinOneBazar" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "AllinOneBazar Email Verification",
    html: `
      <h2>Welcome to AllinOneBazar!</h2>
      <p>Thank you for registering. Please verify your email:</p>
      <a href="${verificationLink}" 
         style="background:#f97316;color:white;padding:10px 20px;
         border-radius:5px;text-decoration:none;">
         Verify Email
      </a>
      <p>This link expires in 10 minutes.</p>
      <p>Best regards, Team AllinoneBazar</p>
    `,
  });
};

export default verifyEmail;