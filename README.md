# Series Analyzer

`Series Analyzer` — це pet-проєкт для роботи з каталогом серіалів, студіями, статистикою та відгуками в одному репозиторії.

У проєкті поєднані:

- Java backend для предметної області серіалів і студій
- сучасний frontend на `Next.js + TypeScript + Material UI + react-intl`
- окремий `Node.js + TypeScript` reviews service на `MongoDB`
- єдиний запуск через `Docker`

## Швидкий запуск

Передумова:

- встановлений і запущений `Docker Desktop`

Клонування і перехід на актуальну гілку:

```powershell
git clone https://github.com/AnastasiaPAna/series-analyzer.git
cd series-analyzer
git checkout block4-fix
```

Запуск із кореня проєкту:

```powershell
.\start-app.ps1
```

Зупинка:

```powershell
.\stop-app.ps1
```

Після запуску доступні:

- Frontend: `http://localhost:3000/`
- Spring API: `http://localhost:9090/api/v1/studios`
- Reviews health-check: `http://localhost:3010/health`
- Reviews service page: `http://localhost:3010/`

## Що реалізовано

У проєкті є:

- каталог серіалів
- каталог студій
- пошук і фільтрація
- пагінація
- сторінка деталей серіалу
- створення, редагування і видалення серіалів
- статистика
- список найкращих серіалів
- локалізація `UA / EN`
- окремий reviews service
- інтеграція відгуків у frontend
- кількість відгуків у списку серіалів
- сторінка всіх відгуків
- admin mode для дій керування

## Admin access

Адмін-доступ вмикається через кнопку `Admin` у шапці frontend.

Дані для входу:

- login: `admin`
- password: `admin123`

Після входу в admin mode:

- стають доступними створення, редагування і видалення серіалів
- у шапці з’являється `All reviews`
- `All reviews` відкриває окремий reviews service на `http://localhost:3010/`
- у reviews service доступні:
  - перегляд усіх останніх відгуків
  - перехід на сторінку серіалу
  - редагування відгуку
  - видалення відгуку

Прямий вхід на `http://localhost:3010/` без admin-доступу закритий.

## Reviews service

Сервіс відгуків реалізований у `block4-reviews-service/`.

Предметна область:

- `Series` — основна сутність
- `Review` — окрема сутність відгуку
- один серіал може мати багато відгуків
- кожен відгук містить дату/час публікації `publishedAt`

Використані технології:

- `Node.js`
- `TypeScript`
- `Express`
- `MongoDB`
- `Mongoose`

Основні endpoint-и:

```http
GET  /health
POST /api/entity3
GET  /api/entity3?entity1Id=1&size=5&from=0
POST /api/entity3/_counts
```

Що робить reviews service:

- створює новий відгук
- валідує обов’язкові поля
- автоматично проставляє `publishedAt`, якщо дата не передана
- перевіряє існування серіалу через сервіс із Java backend
- повертає список відгуків по одному серіалу
- сортує відгуки від нових до старих
- підтримує пагінацію через `size` і `from`
- повертає кількість відгуків по масиву `entity1Ids`
- використовує aggregation query для `_counts`
- містить інтеграційні тести для endpoint-ів

## Що додано після останнього оновлення

Останні доробки:

- єдиний запуск усього проєкту через `Docker`
- прибрано окремі паралельні сценарії старту
- frontend і reviews service піднімаються разом з БД та backend
- додано `Admin` login у шапці frontend
- `All reviews` тепер відкриває окремий reviews service
- reviews service закритий від прямого доступу без admin-входу
- додано admin moderation для reviews:
  - edit review
  - delete review
- редагування і видалення серіалів прив’язані до admin mode
- відображення назв серіалів і жанрів працює для `UA / EN`
- сторінка reviews service оформлена як окремий інтерфейс для роботи з усіма відгуками

## Структура проєкту

- `src/main/java` — Spring Boot backend
- `src/main/resources/db` — Liquibase changelog-и
- `series-frontend/` — frontend
- `block4-reviews-service/` — сервіс відгуків
- `data/` — JSON-дані для імпорту
- `postman/` — Postman collection
