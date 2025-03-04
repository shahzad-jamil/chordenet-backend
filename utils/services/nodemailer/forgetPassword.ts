import nodemailer from "nodemailer";
import { config } from "dotenv";
import { RESET_LINK } from "../../constants/auth.const";
import type { Response } from "express";
import transporter from ".";
import { response } from "../../response";
import { createResetToken, getSignedJwt } from "../jwt";
config();

// Function to send password reset email
export const sendPasswordResetEmail = async (
  email: string,
  id: string,
  res: Response
): Promise<void> => {
  const token = getSignedJwt(id);


  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.VERIFICATION_EMAIL as string,
    to: email,
    subject: "Password Reset Request",
    html: `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 50px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
          <p style="font-size: 16px; color: #555;">Hello,</p>
          <p style="font-size: 16px; color: #555;">We received a request to reset your password. Please click the link below to reset your password:</p>
          <p style="text-align: center; margin-top: 20px;">
            <a href="${RESET_LINK}?token=${token}" style="background-color: #4CAF50; color: white; padding: 15px 25px; text-decoration: none; font-size: 16px; border-radius: 5px; cursor: pointer;">Reset Password</a>
          </p>
          <p style="font-size: 14px; color: #555; text-align: center; margin-top: 20px;">
            If you did not request a password reset, please ignore this email or contact support if you have questions.
          </p>
          <p style="font-size: 14px; color: #888; text-align: center; margin-top: 20px;">
            This link will expire in 10 minutes.
          </p>
        </div>
      </body>
    </html>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully!");
    response(res, 201, "Verification email sent successfully.");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Error sending password reset email");
  }
};

export const sendRestPasswordResetEmail = async (
  email: string,
  token: string,
  res: Response
): Promise<void> => {
  

  const mailOptions: nodemailer.SendMailOptions = {
    from: process.env.VERIFICATION_EMAIL as string,
    to: email,
    subject: "Password Reset Request",
    html: `
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 50px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
          <p style="font-size: 16px; color: #555;">Hello,</p>
          <p style="font-size: 16px; color: #555;">We received a request to reset your password. Please click the link below to reset your password:</p>
          <p style="text-align: center; margin-top: 20px;">
            <a href="${RESET_LINK}?token=${token}" style="background-color: #4CAF50; color: white; padding: 15px 25px; text-decoration: none; font-size: 16px; border-radius: 5px; cursor: pointer;">Reset Password</a>
          </p>
          <p style="font-size: 14px; color: #555; text-align: center; margin-top: 20px;">
            If you did not request a password reset, please ignore this email or contact support if you have questions.
          </p>
          <p style="font-size: 14px; color: #888; text-align: center; margin-top: 20px;">
            This link will expire in 10 minutes.
          </p>
        </div>
      </body>
    </html>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully!");
    response(res, 201, "Verification email sent successfully.");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Error sending password reset email");
  }
};