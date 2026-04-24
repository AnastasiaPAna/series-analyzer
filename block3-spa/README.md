# Block 3 SPA Frontend

Окремий frontend-проєкт для блоку 3.

Саме ця папка формально відповідає вимозі окремого SPA frontend, а результат збірки копіюється в Spring static resources і віддається через:

- `http://localhost:9090/`
- `http://localhost:9090/series`
- `http://localhost:9090/top`
- `http://localhost:9090/statistics`

## Що вміє frontend

- пошук серіалів
- фільтрація по студії, жанру, року, рейтингу та статусу
- статус-фільтри `Finished / In progress / Planned`
- перегляд карток серіалів
- CRUD для серіалів
- CRUD для студій
- перегляд статистики
- імпорт JSON
- генерація звітів
- перегляд і створення reviews
- перемикач мов `UA / EN`

## Збірка

У корені проєкту:

```powershell
cd block3-spa
npm run build
```

Після цього frontend копіюється в:

- `src/main/resources/static/spa`

## Важливо

- при звичайному запуску через `start-app.ps1` або `start-app.bat` frontend збирається автоматично
- окремо запускати dev-server не потрібно
