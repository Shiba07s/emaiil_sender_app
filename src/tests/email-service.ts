import { EmailService } from "../services/EmailService";
import { ProviderA } from "../services/providers/providerA";
import { ProviderB } from "../services/providers/providerB";
import { Email } from "../types/email-types";

describe("EmailService", () => {
  let emailService: EmailService;
  let email: Email;

  beforeEach(() => {
    const providers = [new ProviderA(), new ProviderB()];
    emailService = new EmailService(providers);
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
    jest.spyOn(ProviderA.prototype, "send").mockImplementation(() => {
      throw new Error("ProviderA failed");
    });
    jest.spyOn(ProviderB.prototype, "send").mockImplementation(() => {
      return Promise.resolve();
    });

    await expect(emailService.sendEmail(email)).resolves.toBeUndefined();
  });
});
