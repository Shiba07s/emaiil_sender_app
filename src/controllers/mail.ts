import { EmailService } from "../services/EmailService";
import { ProviderA } from "../services/providers/providerA";
import { ProviderB } from "../services/providers/providerB";
import { Email } from "../types/email-types";
import { Request, Response } from "express";

const providers = [new ProviderA(), new ProviderB()];
const emailService = new EmailService(providers);

export const sendMail = async (req: Request, res: Response): Promise<void> => {
  const email: Email = req.body;

  try {
    await emailService.sendEmail(email);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({
        message: "Failed to send email",
        error: error.message,
      });
    } else {
      res.status(500).json({
        message: "Failed to send email",
        error: "An unknown error occurred.",
      });
    }
  }
};
