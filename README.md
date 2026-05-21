# Series Analyzer

Проєкт покриває завдання `1-5` курсу FullStack Developer в одному репозиторії.

## Що є в репозиторії

- `Block 1` — консольна Java-логіка для завантаження, пошуку, фільтрації та експорту даних про серіали.
- `Block 2` — Spring Boot REST API для `Series` і `Studios`.
- `Block 3` — окремий frontend на `Next.js + Material UI + react-intl`, побудований на базовій архітектурі `ui-base-app-next`.
- `Block 4` — окремий `Node.js + TypeScript` reviews service на `MongoDB`.
- `Block 5` — окремий Java email microservice на `RabbitMQ + Elasticsearch + Kibana`.

## Основні URL

- Frontend Block 3: `http://localhost:3000/`
- Spring API: `http://localhost:9090/api/v1`
- Reviews health-check: `http://localhost:3010/health`
- Email service health-check: `http://localhost:3020/health`

## Структура

- `src/main/java` — Spring Boot backend
- `src/main/resources/db` — Liquibase changelog-и
- `series-frontend/` — frontend для Block 3
- `block4-reviews-service/` — сервіс відгуків для Block 4
- `block5-email-service/` — email microservice для Block 5
- `data/` — JSON-дані для імпорту
- `postman/` — Postman collection

## Швидкий запуск

Передумови:

- Java 21
- Node.js
- Docker Desktop

Запуск з кореня проєкту:

```powershell
.\start-app.ps1
```

Або подвійним кліком:

- `start-app.bat`

Скрипт:

- піднімає PostgreSQL і MongoDB через Docker
- запускає frontend Block 3 на `3000`
- запускає Spring backend на `9090`
- запускає reviews-service на `3010`

Зупинка:

```powershell
.\stop-app.ps1
```

## Block 3

Frontend винесений в окремий проєкт `series-frontend/` і використовує стек із базового проєкту:

- `Next.js`
- `TypeScript`
- `Material UI`
- `react-intl`

Реалізовано:

- головна сторінка
- список серіалів `/series`
- сторінка деталей `/series/[id]`
- сторінка створення `/series/new`
- сторінка `Top 5` `/top`
- сторінка статистики `/statistics`
- фільтри, пагінація і збереження query params
- CRUD для серіалів
- локалізація `UA / EN`
- інтеграція відгуків із Block 4 на сторінці серіалу

Детальніше:

- [series-frontend/README.md](./series-frontend/README.md)

## Block 4

Сервіс відгуків реалізований у `block4-reviews-service/`.

Основні endpoint-и:

```http
GET  /health
POST /api/entity3
GET  /api/entity3?entity1Id=1&size=5&from=0
POST /api/entity3/_counts
```

## Block 5

Email microservice розташований у `block5-email-service/`.

Стек:

- RabbitMQ
- Elasticsearch
- Kibana
- Mailpit

Швидкий запуск Block 5:

```powershell
docker compose -f .\block5-email-service\docker-compose.yml up --build -d
```

## Перевірка перед здачею

1. Запустити `.\start-app.ps1`
2. Відкрити `http://localhost:3000/`
3. Перевірити список серіалів, фільтри та пагінацію
4. Створити або відредагувати серіал
5. Перемкнути мову `UA / EN`
6. Відкрити `Top 5`
7. Відкрити `Статистику`
8. Відкрити деталі серіалу і додати відгук

