import nodemailer from "nodemailer";
import dotenv from "dotenv/config";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true para puerto 465, false para otros puertos
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

transporter.verify().then(() => {
  console.log("Listo para enviar correos");
});