# Series Analyzer

Проєкт закриває завдання `1-4` курсу FullStack Developer в одному репозиторії.

## Що є в репозиторії

- `Block 1` — консольна Java-логіка для завантаження, пошуку, фільтрації та експорту даних про серіали.
- `Block 2` — Spring Boot REST API для `Series` і `Studios`.
- `Block 3` — окремий frontend на `Next.js + Material UI + react-intl`, побудований на базовій архітектурі `ui-base-app-next`.
- `Block 4` — окремий `Node.js + TypeScript` reviews service на `MongoDB`.

## Основні URL

- Frontend Block 3: `http://localhost:3000/`
- Spring API: `http://localhost:9090/api/v1`
- Reviews health-check: `http://localhost:3010/health`

## Структура

- `src/main/java` — Spring Boot backend
- `src/main/resources/db` — Liquibase changelog-и
- `series-frontend/` — frontend для Block 3
- `block4-reviews-service/` — сервіс відгуків для Block 4
- `data/` — JSON-дані для імпорту
- `postman/` — Postman collection

## Запуск

Передумови:

- Docker Desktop

Актуальна гілка для `Block 3`:

```powershell
git clone https://github.com/AnastasiaPAna/series-analyzer.git
cd series-analyzer
git checkout block3-fix
```

Запуск з кореня проєкту:

```powershell
.\start-app.ps1
```

Або подвійним кліком:

- `start-app.bat`

Цей сценарій піднімає:

- PostgreSQL
- MongoDB
- Spring backend
- reviews-service
- frontend Block 3

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

## Block 4

Сервіс відгуків реалізований у `block4-reviews-service/`.

Основні endpoint-и:

```http
GET  /health
POST /api/entity3
GET  /api/entity3?entity1Id=1&size=5&from=0
POST /api/entity3/_counts
```
