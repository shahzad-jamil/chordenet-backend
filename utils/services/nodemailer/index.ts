import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config();  


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === "465", 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD, 
  },
});

export default transporter;
