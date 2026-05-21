# Block 3 Frontend — Series Analyzer

Це окремий frontend для `Block 3`, побудований на базовій архітектурі `ui-base-app-next`.

## Стек

- Next.js
- TypeScript
- Material UI
- react-intl

## Що реалізовано

- головна сторінка `/`
- список серіалів `/series`
- сторінка деталей `/series/[id]`
- сторінка створення `/series/new`
- сторінка `Top 5` `/top`
- сторінка статистики `/statistics`
- фільтри через backend endpoint `POST /api/v1/series/_list`
- пагінація з query params
- повернення на список із збереженням фільтрів
- `UA / EN` локалізація
- Material UI компоненти для таблиць, форм, діалогів, кнопок і навігації
- відгуки з Block 4 на сторінці деталей серіалу

## Запуск окремо

1. Запусти Spring backend на `http://localhost:9090`
2. Запусти reviews-service на `http://localhost:3010`
3. У цій папці виконай:

```powershell
npm install
npm run dev
```

4. Відкрий:

```text
http://localhost:3000/
```

## Конфігурація

Скопіюй `.env.example` у `.env.local`, якщо хочеш змінити адреси сервісів:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:9090/api/v1
NEXT_PUBLIC_REVIEWS_API_BASE_URL=http://localhost:3010
NEXT_PUBLIC_DEFAULT_LANGUAGE=ua
```

## Основні папки

- `src/app` — маршрути Next.js App Router
- `src/components` — React-компоненти сторінок і форм
- `src/constants` — константи маршрутів і мов
- `src/hooks` — робота з query params і навігацією
- `src/intl` — переклади
- `src/lib` — API client
- `src/pageProviders` — Material UI і i18n провайдери
- `src/types` — TypeScript типи
