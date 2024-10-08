# Resilient Email Sending Service

This project is a TypeScript-based resilient email sending service. It is designed to ensure reliable email delivery using multiple providers, retry mechanisms, circuit breakers, idempotency, and a simple queue system.

## Features

- **Multiple Email Providers**: Supports fallback between different email providers in case of failure.
- **Retry Mechanism**: Automatically retries sending emails with exponential backoff.
- **Idempotency**: Ensures that each email is only processed once.
- **Circuit Breaker Pattern**: Prevents repeated attempts to use failing providers.
- **Simple Queue System**: Manages email processing and prevents duplicate processing.
- **Logging**: Tracks email sending attempts, failures, and circuit breaker events.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ddevilz/resilient-email-sending-service.git
   cd resilient-email-sending-service
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Run the project**:
   ```bash
   npm start
   ```

## Usage

### Example Postman Request Configuration

- **Method**: `POST`
- **URL**: `http://localhost:3000/api/v1/send-email`
- **Headers**:
  - `Content-Type: application/json`
- **Body**:
  ```json
  {
    "id": "1",
    "to": "recipient@gmail.com",
    "subject": "Test Email",
    "body": "This is a test email sent using the Resilient Email Sending Service."
  }
  ```
[resm.webm](https://github.com/user-attachments/assets/10d58e5d-adac-4bdb-a078-e3803f1f0487)

## Project Structure

- **`src/services/EmailService.ts`**: Contains the `EmailService` class, which handles the core email sending logic, retry mechanism, circuit breaker, and queue management.
- **`src/providers/providerA.ts` and `src/providers/providerB.ts`**: Mock implementations of email providers. These can be replaced with real providers in production.
- **`src/utils/logger.ts`**: A simple logging utility used to log events and errors.
- **`src/utils/queue.ts`**: A basic queue system to manage email processing and ensure idempotency.

## Configuration

- **`maxRetries`**: The maximum number of retry attempts before failing.
- **`circuitBreakerThreshold`**: The number of consecutive failures required to open the circuit breaker for a provider.

These settings can be adjusted when creating an instance of the `EmailService`.

