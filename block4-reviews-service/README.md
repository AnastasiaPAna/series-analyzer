# Block 4 Reviews Service

Окремий Node.js сервіс для Блоку 4.

Сутність 1: `Series`  
Сутність 3: `Review`

`Review` відноситься до одного `Series` як many-to-one і містить поле часу `publishedAt`.

## Технології

- Node.js + TypeScript
- Express
- MongoDB + Mongoose
- Zod для валідації
- Vitest + Supertest + mongodb-memory-server для інтеграційних тестів

## Що вміє сервіс

- `POST /api/entity3` створює review для серіалу
- `GET /api/entity3` повертає reviews одного серіалу, відсортовані від нових до старих
- `POST /api/entity3/_counts` повертає кількість reviews по масиву `seriesId`

## Валідація

- перевіряються обов'язкові поля
- `publishedAt` можна не передавати, тоді час виставляється автоматично
- перед створенням review сервіс перевіряє існування серіалу через Spring API:
  `GET {ENTITY1_SERVICE_URL}/api/v1/series/{id}`

## Запуск

1. Найпростіше: у корені монорепо запусти:

```powershell
.\start-app.ps1
```

2. Якщо вручну, `.env` уже підготовлений для локального запуску
3. У корені монорепо підніми БД:

```bash
docker compose up -d
```

4. Переконайся, що запущені:
   - MongoDB на `MONGODB_URI`
   - Spring API із Блоку 2 на `ENTITY1_SERVICE_URL`
5. Встанови залежності:

```bash
npm install
```

6. Запусти dev-режим:

```bash
npm run dev
```

Сервіс стартує на `http://localhost:3010`.

## Збірка

```bash
npm run build
npm start
```

Для браузерної інтеграції з дашбордом на `http://localhost:9090`
сервіс уже дозволяє CORS для локального фронтенду.

## Тести

```bash
npm test
```

Інтеграційні тести покривають усі required endpoints.
