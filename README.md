# Series Analyzer

Full-stack application for managing a series catalog, reviews, subscriber profiles, and asynchronous email notifications.

## Stack

- `Spring Boot` - main backend
- `Next.js + TypeScript + Material UI + react-intl` - frontend
- `Node.js + TypeScript + MongoDB` - reviews service
- `Spring Boot + RabbitMQ + Elasticsearch + SMTP` - email delivery service
- `Docker Compose` - startup of the whole environment

## Run

Prerequisite:

- `Docker Desktop` is installed and running

Start the whole project from the repository root:

```powershell
docker compose up --build -d
```

Alternative startup:

```powershell
.\start-app.ps1
```

Stop the project:

```powershell
.\stop-app.ps1
```

On the first launch the initial studios and series are loaded automatically.

## Main URLs

Use these URLs for review:

- Frontend: `http://localhost:3000/`
- Reviews service health-check: `http://localhost:3010/health`
- Email service health-check: `http://localhost:3021/health`
- Mailpit UI: `http://localhost:8026`

## Implemented functionality

### Main application

- series list and details
- studio data
- search, filters, and pagination
- create, edit, and delete series
- statistics page
- top 5 page
- `UA / EN` localization

### Reviews service

- separate microservice for reviews
- review creation with validation
- automatic `publishedAt` handling
- validation of related series existence through the main backend
- review list for one series with pagination
- review counts for a list of series ids through aggregation
- admin review moderation
- integration tests for create, list, counts, recent, update, and delete scenarios

Main endpoints:

```http
GET  /health
POST /api/entity3
GET  /api/entity3?entity1Id=1&size=5&from=0
POST /api/entity3/_counts
GET  /api/entity3/recent?size=10
PUT  /api/entity3/:id
DELETE /api/entity3/:id
```

### Email delivery service

- separate Java microservice for email delivery
- asynchronous message consumption from `RabbitMQ`
- message storage in `Elasticsearch`
- SMTP delivery through `JavaMailSender`
- statuses `PENDING`, `SENT`, `FAILED`
- storing `errorMessage`, `attemptCount`, `lastAttemptAt`, and `sentAt`
- retry of failed messages every 5 minutes
- integration with the main backend on series creation and on new season release
- integration tests for successful send, failed send, successful retry, failed retry, and admin API access

Main endpoints:

```http
GET /health
GET /api/emails
GET /api/emails?status=FAILED
GET /api/admin/messages
POST /api/admin/messages/retry-failed
POST /api/admin/messages/{id}/retry
GET /api/admin/email-settings
PUT /api/admin/email-settings
```

## Admin access

Admin mode is enabled through the `Admin` button in the frontend header.

Credentials:

- login: `admin`
- password: `admin123`

After login the following actions become available:

- series create, edit, and delete
- review moderation
- email control page
- SMTP settings and notification template management

## Email configuration

Email-related configuration is stored in `.env`.

Main variables:

- `RABBITMQ_HOST`
- `RABBITMQ_PORT`
- `RABBITMQ_USERNAME`
- `RABBITMQ_PASSWORD`
- `NOTIFICATION_ADMIN_EMAIL`
- `EMAIL_NOTIFICATION_QUEUE`
- `EMAIL_NOTIFICATION_EXCHANGE`
- `EMAIL_NOTIFICATION_ROUTING_KEY`
- `EMAIL_SMTP_HOST`
- `EMAIL_SMTP_PORT`
- `EMAIL_SMTP_USERNAME`
- `EMAIL_SMTP_PASSWORD`
- `EMAIL_SMTP_AUTH`
- `EMAIL_SMTP_STARTTLS`
- `EMAIL_SMTP_FROM`
- `EMAIL_RETRY_DELAY_MS`

## Structure

- `src/main/java` - Spring Boot backend
- `series-frontend/` - frontend
- `block4-reviews-service/` - reviews service
- `block5-email-service/` - email delivery service
