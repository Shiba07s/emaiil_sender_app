"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EmailService_1 = require("../services/EmailService");
const providerA_1 = require("../services/providers/providerA");
const providerB_1 = require("../services/providers/providerB");
describe("EmailService", () => {
    let emailService;
    let email;
    beforeEach(() => {
        const providers = [new providerA_1.ProviderA(), new providerB_1.ProviderB()];
        emailService = new EmailService_1.EmailService(providers);
        email = {
            id: "1",
            to: "test@example.com",
            subject: "Test",
            body: "This is a test",
        };
    });
    it("should send email using a provider", async () => {
        await expect(emailService.sendEmail(email)).resolves.toBeUndefined();
    });
    it("should retry on failure", async () => {
        jest.spyOn(providerA_1.ProviderA.prototype, "send").mockImplementation(() => {
            throw new Error("ProviderA failed");
        });
        jest.spyOn(providerB_1.ProviderB.prototype, "send").mockImplementation(() => {
            return Promise.resolve();
        });
        await expect(emailService.sendEmail(email)).resolves.toBeUndefined();
    });
});
//# sourceMappingURL=email-service.js.map