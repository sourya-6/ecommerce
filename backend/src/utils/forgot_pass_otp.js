import nodemailer from "nodemailer";
//import dotenv from "dotenv";

//dotenv.config();
console.log(process.env.EMAIL_USER)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail ID
    pass: process.env.EMAIL_PASS, // Your Gmail App Password
  },
});

export const  ResetOTPgenerated = async (userEmail, userName,otp) => {
  console.log('hey',userEmail)
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "🎉 Reset Mail Option",
      html: `
        
<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f7f7f7;">

  <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; background-color: #4CAF50; padding: 15px; color: #fff; border-radius: 8px;">
      <h1 style="margin: 0; font-size: 24px;">Password Reset Request</h1>
    </div>

    <div style="padding: 20px;">
      <p>Dear ${userName},</p>
      <p>We have received a request to reset your password for your SnapBuy account. To proceed with the reset process, please use the following One-Time Password (OTP):</p>
      
      <p style="font-size: 22px; font-weight: bold; color: #333; padding: 10px; border: 2px solid #4CAF50; border-radius: 5px; background-color: #e8f7e7; display: inline-block; user-select: text;">
        ${otp}
      </p>

      <p>This OTP will expire in 5 minutes. If you did not request a password reset, please ignore this message.</p>

      <p>If you have any issues or need further assistance, please contact our support team.</p>
    </div>

    <div style="text-align: center; font-size: 14px; color: #666; margin-top: 20px;">
      <p>Best regards, <br> The SnapBuy Team</p>
      <p><a href="mailto:${process.env.EMAIL_USER}" style="color: #4CAF50; text-decoration: none;">Contact Support</a></p>
    </div>
  </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("📩 Welcome email sent successfully!");
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
  }
};

//sendWelcomeEmail(userEmail,userName);

