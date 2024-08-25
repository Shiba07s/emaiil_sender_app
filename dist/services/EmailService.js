"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const logger_1 = require("../utils/logger");
const queue_1 = require("../utils/queue");
class EmailService {
    providers;
    queue;
    logger;
    maxRetries;
    circuitBreakerThreshold;
    circuitBreakerState;
    constructor(providers, maxRetries = 3, circuitBreakerThreshold = 3) {
        this.providers = providers;
        this.queue = new queue_1.Queue();
        this.logger = new logger_1.Logger();
        this.maxRetries = maxRetries;
        this.circuitBreakerThreshold = circuitBreakerThreshold;
        this.circuitBreakerState = new Map();
    }
    async sendEmail(email) {
        if (!email.id) {
            this.logger.error("Email ID is missing, cannot add to queue.");
            throw new Error("Email ID is required.");
        }
        if (!this.queue.add(email.id)) {
            this.logger.log(`Email with ID ${email.id} is already in the queue, skipping...`);
            return;
        }
        let attempt = 0;
        let lastError = null;
        while (attempt < this.maxRetries) {
            const provider = this.providers[attempt % this.providers.length];
            if (this.isCircuitOpen(provider.name)) {
                this.logger.log(`Circuit breaker is open for ${provider.name}, skipping...`);
                attempt++;
                continue;
            }
            try {
                await provider.send(email);
                this.logger.log(`Email sent successfully with ${provider.name}`);
                this.resetCircuitBreaker(provider.name);
                this.queue.remove(email.id);
                return;
            }
            catch (error) {
                if (error instanceof Error) {
                    this.logger.error(`Failed: ${error.message}`);
                    lastError = error;
                    this.incrementCircuitBreakerFailures(provider.name);
                }
                else {
                    this.logger.error(`Unknown error with ${provider.name}`);
                    lastError = new Error("Unknown error");
                    this.incrementCircuitBreakerFailures(provider.name);
                }
                await this.backoff(attempt);
            }
            attempt++;
        }
        this.logger.error(`All providers failed. Last error: ${lastError?.message}`);
        this.queue.remove(email.id);
        throw lastError;
    }
    async backoff(attempt) {
        const delay = Math.pow(2, attempt) * 100;
        return new Promise((resolve) => setTimeout(resolve, delay));
    }
    incrementCircuitBreakerFailures(providerName) {
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
    resetCircuitBreaker(providerName) {
        this.circuitBreakerState.set(providerName, { failures: 0, open: false });
    }
    isCircuitOpen(providerName) {
        const state = this.circuitBreakerState.get(providerName);
        return state ? state.open : false;
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=EmailService.js.map