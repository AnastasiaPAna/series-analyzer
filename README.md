# Series Analyzer

Проєкт закриває завдання `1-4` курсу FullStack Developer в одному репозиторії:

- `Block 1` — консольна Java-логіка для роботи з даними серіалів
- `Block 2` — Spring Boot REST API для `Series` і `Studios`
- `Block 3` — окремий SPA frontend для каталогу, статистики, пошуку, CRUD і роботи з відгуками
- `Block 4` — окремий Node.js + TypeScript reviews service на MongoDB

Основна сторінка для демонстрації:
- `http://localhost:9090/`

Технічна перевірка reviews service:
- `http://localhost:3010/health`

## Технології

- Java 21
- Spring Boot 3.2.5
- Spring Web, Validation, Data JPA
- PostgreSQL
- Liquibase
- Node.js
- TypeScript
- Express
- MongoDB + Mongoose
- Vanilla SPA frontend
- Bootstrap 5
- JUnit 5
- Vitest / Supertest
- Docker Compose

## Структура проєкту

- `src/main/java` — backend на Spring Boot
- `src/main/resources/db` — Liquibase міграції та seed
- `src/main/resources/static/spa` — зібраний frontend, який віддає Spring
- `block3-spa/` — окремий SPA frontend для блоку 3
- `block4-reviews-service/` — окремий reviews service для блоку 4
- `data/` — приклади даних для імпорту
- `postman/Series API.postman_collection.json` — Postman collection
- `start-app.ps1`, `start-app.bat` — швидкий запуск
- `stop-app.ps1` — зупинка сервісів і локальних БД

## Найпростіший запуск

### Передумови

Потрібно мати:

- Java 21
- Node.js
- Docker Desktop

### Варіант 1. Один клік

У корені проєкту:

- запусти [start-app.bat](/d:/task_block1-main/task_block1-main/start-app.bat)

Або в PowerShell:

```powershell
.\start-app.ps1
```

Скрипт автоматично:

- запустить Docker Desktop, якщо він вимкнений
- підніме PostgreSQL і MongoDB
- збере `block3-spa`, якщо були зміни
- збере Spring Boot застосунок, якщо були зміни
- збере reviews service, якщо були зміни
- підніме обидва сервіси
- відкриє `http://localhost:9090/`

Зупинка:

```powershell
.\stop-app.ps1
```

### Варіант 2. Ручний запуск

Підняти локальні БД:

```powershell
docker compose up -d
```

Потім у корені:

```powershell
mvn -DskipTests package
java -jar target\series-analyzer-1.0.0.jar
```

В окремому терміналі:

```powershell
cd block4-reviews-service
npm install
npm run build
npm start
```

Якщо окремо треба оновити frontend блоку 3:

```powershell
cd block3-spa
npm run build
```

## Доступні URL

- Frontend: `http://localhost:9090/`
- Series API: `http://localhost:9090/api/v1/series`
- Studios API: `http://localhost:9090/api/v1/studios`
- Statistics API: `http://localhost:9090/api/v1/statistics/{attribute}`
- Reviews health-check: `http://localhost:3010/health`
- Reviews API: `http://localhost:3010/api/entity3`

## Що реалізовано по блоках

### Block 1

- завантаження та обробка даних серіалів
- фільтрація, пошук, статистика
- експорт
- консольний сценарій роботи

### Block 2

- CRUD для `Studios`
- CRUD для `Series`
- пошук серіалів
- top endpoint
- пакетні endpoint-и `_list` і `_report`
- імпорт JSON
- endpoint статистики
- валідація
- інтеграційні та unit тести

### Block 3

- окремий SPA frontend у папці `block3-spa`
- пошук серіалів
- фільтри по студії, жанру, року, рейтингу, статусу
- статус-фільтри `Finished / In progress / Planned`
- створення, редагування й видалення серіалів
- створення, редагування й видалення студій
- перегляд статистики
- імпорт JSON
- генерація звітів
- перемикач мов `UA / EN`
- developer mode для керування службовими інструментами

### Block 4

- окремий Node.js reviews service у папці `block4-reviews-service`
- `POST /api/entity3` — створення review
- `GET /api/entity3` — список review для одного серіалу
- `POST /api/entity3/_counts` — кількість review для списку серіалів
- перевірка існування `Series` через Spring API
- валідація через Zod
- інтеграція reviews прямо у frontend блоку 3

## REST API

### Studios

```http
GET    /api/v1/studios
POST   /api/v1/studios
PUT    /api/v1/studios/{id}
DELETE /api/v1/studios/{id}
```

Приклад `POST /api/v1/studios`:

```json
{
  "name": "HBO",
  "country": "USA"
}
```

### Series

```http
GET    /api/v1/series
GET    /api/v1/series/{id}
GET    /api/v1/series/top?limit=5
GET    /api/v1/series/search?query=game
POST   /api/v1/series
PUT    /api/v1/series/{id}
DELETE /api/v1/series/{id}
POST   /api/v1/series/_list
POST   /api/v1/series/_report
GET    /api/v1/series/_report/{jobId}
POST   /api/v1/series/upload
```

Приклад `POST /api/v1/series`:

```json
{
  "title": "Wednesday",
  "genre": "Mystery, Drama",
  "seasons": 2,
  "rating": 8.1,
  "year": 2022,
  "finished": false,
  "studioId": 2
}
```

### Statistics

```http
GET /api/v1/statistics/{attribute}
```

Підтримувані атрибути:

- `title`
- `studio`
- `genre`
- `seasons`
- `rating`
- `year`
- `finished`

### Reviews service

```http
GET  /health
POST /api/entity3
GET  /api/entity3?entity1Id=1&size=5&from=0
POST /api/entity3/_counts
```

Приклад `POST /api/entity3`:

```json
{
  "seriesId": 1,
  "reviewerName": "Nastya",
  "comment": "Strong atmosphere and good pacing.",
  "rating": 9
}
```

## База даних

Через `docker-compose.yml` піднімаються:

- PostgreSQL на `localhost:5433`
- MongoDB на `localhost:27017`

Liquibase використовує:

- `src/main/resources/db/changelog/db.changelog-master.yaml`

Основні таблиці:

- `studios`
- `series`

## Конфігурація

Spring читає `.env` з кореня проєкту.

Ключові змінні:

```env
APP_PORT=9090
DB_HOST=localhost
DB_PORT=5433
DB_NAME=series_db
DB_USER=postgres
DB_PASSWORD=
DB_SEED=seed
```

Для `block4-reviews-service` локальний `.env` уже підготовлений під стандартний запуск.

## Тести

### Spring

```powershell
mvn test
```

### Reviews service

```powershell
cd block4-reviews-service
npm test
```

## Швидка перевірка перед здачею

1. Запусти `start-app.bat`
2. Відкрий `http://localhost:9090/`
3. Перевір пошук
4. Створи новий серіал
5. Обери від 1 до 3 жанрів
6. Відкрий статистику
7. Відкрий reviews для будь-якого серіалу
8. Додай review
9. За потреби відкрий `http://localhost:3010/health`

## Для захисту

Найзручніше показувати проєкт так:

1. `Block 1` — коротко сказати, що є консольна логіка та обробка даних
2. `Block 2` — показати REST API на `9090`
3. `Block 3` — показати SPA frontend на `9090`
4. `Block 4` — показати reviews у UI та health-check на `3010`

## Додатково

- Reviews service README: [block4-reviews-service/README.md](/d:/task_block1-main/task_block1-main/block4-reviews-service/README.md:1)
- SPA frontend README: [block3-spa/README.md](/d:/task_block1-main/task_block1-main/block3-spa/README.md:1)
