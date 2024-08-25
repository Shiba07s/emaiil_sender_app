"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const EmailService_1 = require("../services/EmailService");
const providerA_1 = require("../services/providers/providerA");
const providerB_1 = require("../services/providers/providerB");
const providers = [new providerA_1.ProviderA(), new providerB_1.ProviderB()];
const emailService = new EmailService_1.EmailService(providers);
const sendMail = async (req, res) => {
    const email = req.body;
    try {
        await emailService.sendEmail(email);
        res.status(200).json({ message: "Email sent successfully" });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                message: "Failed to send email",
                error: error.message,
            });
        }
        else {
            res.status(500).json({
                message: "Failed to send email",
                error: "An unknown error occurred.",
            });
        }
    }
};
exports.sendMail = sendMail;
//# sourceMappingURL=mail.js.map