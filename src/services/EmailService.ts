import { Provider } from "../types/provider-types";
import { Email } from "../types/email-types";
import { Logger } from "../utils/logger";
import { Queue } from "../utils/queue";

export class EmailService {
  private providers: Provider[];
  private queue: Queue;
  private logger: Logger;
  private maxRetries: number;
  private circuitBreakerThreshold: number;
  private circuitBreakerState: Map<string, { failures: number; open: boolean }>;

  constructor(
    providers: Provider[],
    maxRetries = 3,
    circuitBreakerThreshold = 3
  ) {
    this.providers = providers;
    this.queue = new Queue();
    this.logger = new Logger();
    this.maxRetries = maxRetries;
    this.circuitBreakerThreshold = circuitBreakerThreshold;
    this.circuitBreakerState = new Map();
  }

  public async sendEmail(email: Email): Promise<void> {
    if (!email.id) {
      this.logger.error("Email ID is missing, cannot add to queue.");
      throw new Error("Email ID is required.");
    }

    if (!this.queue.add(email.id)) {
      this.logger.log(
        `Email with ID ${email.id} is already in the queue, skipping...`
      );
      return;
    }

    let attempt = 0;
    let lastError: Error | null = null;

    while (attempt < this.maxRetries) {
      const provider = this.providers[attempt % this.providers.length];

      if (this.isCircuitOpen(provider.name)) {
        this.logger.log(
          `Circuit breaker is open for ${provider.name}, skipping...`
        );
        attempt++;
        continue;
      }

      try {
        await provider.send(email);
        this.logger.log(`Email sent successfully with ${provider.name}`);
        this.resetCircuitBreaker(provider.name);
        this.queue.remove(email.id);
        return;
      } catch (error: unknown) {
        if (error instanceof Error) {
          this.logger.error(`Failed: ${error.message}`);
          lastError = error;
          this.incrementCircuitBreakerFailures(provider.name);
        } else {
          this.logger.error(`Unknown error with ${provider.name}`);
          lastError = new Error("Unknown error");
          this.incrementCircuitBreakerFailures(provider.name);
        }
        await this.backoff(attempt);
      }
      attempt++;
    }

    this.logger.error(
      `All providers failed. Last error: ${lastError?.message}`
    );

    this.queue.remove(email.id);
    throw lastError;
  }

  private async backoff(attempt: number) {
    const delay = Math.pow(2, attempt) * 100;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  private incrementCircuitBreakerFailures(providerName: string) {
    const state = this.circuitBreakerState.get(providerName) || {
      failures: 0,
      open: false,
    };
    state.failures++;
    if (state.failures >= this.circuitBreakerThreshold) {
      state.open = true;
      this.logger.error(`Circuit breaker opened for ${providerName}`);
    }
    this.circuitBreakerState.set(providerName, state);
  }

  private resetCircuitBreaker(providerName: string) {
    this.circuitBreakerState.set(providerName, { failures: 0, open: false });
  }

  private isCircuitOpen(providerName: string): boolean {
    const state = this.circuitBreakerState.get(providerName);
    return state ? state.open : false;
  }
}
