import { Provider } from "../../types/provider-types";
import { Email } from "../../types/email-types";

export class ProviderA implements Provider {
  public name = "ProviderA";

  public async send(email: Email): Promise<void> {
    if (Math.random() > 0.5) throw new Error("Provider A failed to send email");
    console.log(`Provider A sent email to ${email.to}`);
  }
}
