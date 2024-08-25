import { Email } from "./email-types";

export interface Provider {
  name: string;
  send(email: Email): Promise<void>;
}
