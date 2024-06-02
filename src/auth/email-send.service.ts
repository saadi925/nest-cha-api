import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.G_EMAIL,
        pass: process.env.G_PASSWORD,
      },
    });
  }

  async sendVerificationEmail(
    email: string,
    verificationCode: string,
  ): Promise<boolean> {
    const mailOptions = {
      from: process.env.G_KEY,
      to: email,
      subject: "ecommerce Email Verification",
      text: `Your verification code for Sliko Email Verification is: ${verificationCode}`,
    };

    const res = await this.transporter.sendMail(mailOptions);

    return res.accepted.length > 0;
  }
}
