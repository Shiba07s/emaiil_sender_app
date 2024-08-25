import { Provider } from "../../types/provider-types";
import { Email } from "../../types/email-types";

export class ProviderB implements Provider {
  public name = "ProviderB";

  public async send(email: Email): Promise<void> {
    if (Math.random() > 0.5) throw new Error("Provider B failed to send email");
    console.log(`Provider B sent email to ${email.to}`);
  }
}
