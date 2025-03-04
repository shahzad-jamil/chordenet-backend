import nodemailer from "nodemailer";
import { VERIFY_EMAIL } from "../../constants/auth.const";
import transporter from ".";
import { Response } from "express";
import { response } from "../../response";
import { createResetToken } from "../jwt";

export const sendRegistrationEmail = async (
  username: string,
  email: string,
  res: Response
): Promise<void> => {
  const token = createResetToken({ email }, "10m");

  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.VERIFICATION_EMAIL as string,
    to: email,
    subject: "Welcome to Pacoon",
    html: `<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 8px;
        }
        .header {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            color: #5e9b6d;
        }
        .content {
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #5e9b6d;
            color: #ffffff;
            text-decoration: none;
            border-radius: 4px;
            font-size: 16px;
            text-align: center;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 14px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            Welcome to Pacoon!
        </div>
        <div class="content">
            <p>Hi ${username},</p>
            <p>Thank you for registering with Pacoon! We're excited to have you onboard.</p>
            <p>To complete your registration, please click the button below to verify your email address:</p>
            <p style="text-align: center;">
                <a href="${VERIFY_EMAIL}?token=${token}" class="button">Verify Your Email</a>
            </p>
            <p>If you did not register with Pacoon, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>Best regards,</p>
            <p>Pacoon Team</p>
        </div>
    </div>
</body>
</html>
`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Registration email sent successfully!");

    response(
      res,
      201,
      "Register email sent successfully. Please check your registration email"
    );
  } catch (error) {
    console.error("Error sending registration email:", error);
    res.status(500).json({
      message: "An error occurred while sending the registration email.",
    });
  }
};
