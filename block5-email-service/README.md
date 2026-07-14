# Block 5 Email Service

Java microservice for asynchronous email delivery.

## Purpose

The service receives email events through a message broker, stores them in `Elasticsearch`, tries to send them through `SMTP`, and retries failed deliveries automatically.

## Implemented features

- asynchronous consumption from `RabbitMQ`
- storage of email messages in `Elasticsearch`
- delivery through `JavaMailSender`
- statuses `PENDING`, `SENT`, `FAILED`
- storing `errorMessage`, `attemptCount`, `lastAttemptAt`, and `sentAt`
- retry of failed messages every 5 minutes
- admin APIs for settings and manual retry
- API-only architecture without embedded HTML pages

## API endpoints

```http
GET  /health
GET  /api/emails
GET  /api/emails?status=FAILED
GET  /api/admin/messages
POST /api/admin/messages/retry-failed
POST /api/admin/messages/{id}/retry
GET  /api/admin/email-settings
PUT  /api/admin/email-settings
```

## Standalone run

The main project Docker Compose exposes the email service on 3021 and Mailpit on 8026.
This standalone compose file keeps the service-local ports 3020 and 8025 for isolated email-service checks.

From the repository root:

```powershell
docker compose -f .\block5-email-service\docker-compose.yml up --build -d
```

Minimal verification URLs:

- Health: `http://localhost:3020/health`
- Messages API: `http://localhost:3020/api/emails`
- Mailpit UI: `http://localhost:8025`

Stop standalone mode:

```powershell
docker compose -f .\block5-email-service\docker-compose.yml down
```

## Environment variables

The service uses values from the root `.env` file.

Main variables:

- `RABBITMQ_HOST`
- `RABBITMQ_PORT`
- `RABBITMQ_USERNAME`
- `RABBITMQ_PASSWORD`
- `EMAIL_SMTP_HOST`
- `EMAIL_SMTP_PORT`
- `EMAIL_SMTP_USERNAME`
- `EMAIL_SMTP_PASSWORD`
- `EMAIL_SMTP_AUTH`
- `EMAIL_SMTP_STARTTLS`
- `EMAIL_SMTP_FROM`
- `EMAIL_NOTIFICATION_QUEUE`
- `EMAIL_NOTIFICATION_EXCHANGE`
- `EMAIL_NOTIFICATION_ROUTING_KEY`
- `EMAIL_RETRY_DELAY_MS`

## Verification

To verify the service flow:

1. Start the stack
2. Create a new series or increase the season count of an existing one
3. Open `GET /api/emails`
4. Open `Mailpit`

Expected result:

- a message is stored in the email service
- a delivered email appears in `Mailpit`
- failed messages can be retried through the admin API or the frontend email control page
