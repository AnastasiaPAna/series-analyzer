(function () {
  const app = document.getElementById("app");

  if (!app) {
    return;
  }

  const translations = {
    uk: {
      "nav.dashboard": "Головна",
      "nav.series": "Серіали",
      "nav.top": "Топ 5",
      "nav.statistics": "Статистика",
      "hero.eyebrow": "Блоки 3 + 4",
      "hero.title": "Єдина панель для серіалів, студій, звітів, імпорту та відгуків.",
      "hero.text": "Обирай серіал, керуй каталогом і залишай відгуки в одному місці.",
      "hero.catalog": "Відкрити каталог",
      "hero.tools": "Відкрити інструменти",
      "hero.addSeries": "Створити серіал",
      "metrics.series": "Серіали",
      "metrics.studios": "Студії",
      "metrics.rating": "Середній рейтинг",
      "metrics.finished": "Завершені",
      "search.label": "Пошук",
      "search.placeholder": "Пошук за назвою, студією або жанром",
      "search.cta": "Знайти серіал",
      "catalog.kicker": "Каталог",
      "catalog.title": "Керуйте серіалами та активністю відгуків",
      "catalog.refresh": "Оновити",
      "catalog.addSeries": "Додати серіал",
      "catalog.filterSearch": "Назва або студія",
      "catalog.filterStudio": "Студія",
      "catalog.allStudios": "Усі студії",
      "catalog.filterGenre": "Жанр",
      "catalog.genrePlaceholder": "Наприклад, Drama",
      "catalog.filterYear": "Рік",
      "catalog.yearPlaceholder": "2024",
      "catalog.filterMinRating": "Мін. рейтинг",
      "catalog.ratingPlaceholder": "8.0",
      "catalog.sortBy": "Сортувати за",
      "catalog.direction": "Напрям",
      "catalog.desc": "Спадання",
      "catalog.asc": "Зростання",
      "catalog.pageSize": "Карток на сторінці",
      "catalog.topMode": "Режим топ 5",
      "catalog.apply": "Застосувати",
      "catalog.reset": "Скинути",
      "catalog.apiSearch": "Точний пошук",
      "catalog.genreStrip": "Швидкі жанри",
      "catalog.clearGenre": "Очистити жанр",
      "catalog.previous": "Назад",
      "catalog.next": "Далі",
      "studios.kicker": "Студії",
      "studios.title": "Керуйте довідником студій",
      "studios.add": "Додати студію",
      "studios.addModal": "Додати студію",
      "studios.editModal": "Редагувати студію",
      "studios.name": "Назва",
      "studios.country": "Країна",
      "statistics.kicker": "Статистика",
      "statistics.title": "Огляд за вибраним атрибутом",
      "statistics.attribute": "Атрибут",
      "statistics.load": "Завантажити статистику",
      "tools.kicker": "Інструменти",
      "tools.title": "Звіти та імпорт JSON",
      "tools.reportTitle": "Згенерувати звіт",
      "tools.reportText": "Формуй звіт за поточними фільтрами каталогу.",
      "tools.format": "Формат",
      "tools.async": "Асинхронний режим",
      "tools.generate": "Згенерувати",
      "tools.importTitle": "Імпорт JSON файлу",
      "tools.importText": "Імпортуй JSON-список серіалів прямо в каталог.",
      "tools.chooseFile": "Виберіть файл",
      "tools.upload": "Завантажити",
      "reviews.kicker": "Відгуки до серіалу",
      "reviews.title": "Відгуки до вибраного серіалу",
      "reviews.composerTitle": "Відгуки тут на сторінці",
      "reviews.composerText": "Додайте оцінку та короткий коментар без переходу на іншу сторінку.",
      "reviews.noSelection": "Оберіть серіал у каталозі",
      "reviews.noSelectionHelp": "Тоді відгуки саме до цього серіалу з'являться тут нижче.",
      "reviews.selectionMeta": "{studio} · {genre} · {year}",
      "reviews.showMore": "Показати ще",
      "reviews.add": "Додати відгук",
      "reviews.addModal": "Додати відгук",
      "reviews.editModal": "Відгук",
      "reviews.modalBannerTitle": "Корисні відгуки перемагають",
      "reviews.modalBannerText": "Напишіть, що спрацювало, що ні, і поставте чесну оцінку від 1 до 10.",
      "reviews.reviewer": "Ім'я автора",
      "reviews.reviewerPlaceholder": "Ваше ім'я",
      "reviews.rating": "Оцінка",
      "reviews.comment": "Коментар",
      "reviews.commentPlaceholder": "Що вам сподобалось або не сподобалось у серіалі?",
      "reviews.save": "Зберегти відгук",
      "series.addModal": "Додати серіал",
      "series.editModal": "Редагувати серіал",
      "series.bannerTitle": "Створіть новий тайтл",
      "series.bannerText": "Додайте жанр, студію, рейтинг та рік виходу в одному місці.",
      "series.title": "Назва",
      "series.genre": "Жанр",
      "series.seasons": "Сезони",
      "series.rating": "Рейтинг",
      "series.year": "Рік",
      "series.studio": "Студія",
      "series.finished": "Завершений",
      "common.cancel": "Скасувати",
      "common.save": "Зберегти",
      "summary.count": "{count} серіалів знайдено",
      "summary.empty": "Немає серіалів за поточними фільтрами.",
      "summary.page": "Сторінка {page} з {total}",
      "message.filtersReset": "Фільтри скинуто.",
      "message.refreshing": "Оновлюю дані...",
      "message.refreshed": "Дані оновлено.",
      "message.loadingStats": "Завантажую статистику...",
      "message.statsUpdated": "Статистику оновлено.",
      "message.searchPrompt": "Введи назву для пошуку.",
      "message.searching": "Шукаю точний збіг...",
      "message.searchFound": "Знайдено точний збіг: \"{title}\".",
      "message.seriesSaved": "Серіал збережено: \"{title}\".",
      "message.studioSaved": "Студію збережено: \"{name}\".",
      "message.reviewSaved": "Відгук успішно створено.",
      "message.seriesDeleted": "Серіал \"{title}\" видалено.",
      "message.studioDeleted": "Студію \"{name}\" видалено.",
      "message.generateReport": "Генерую звіт...",
      "message.reportDownloaded": "Звіт завантажено.",
      "message.asyncReport": "Асинхронний звіт готовий: <a href=\"{url}\">завантажити</a>",
      "message.chooseFile": "Спочатку вибери JSON файл.",
      "message.importDone": "Імпорт завершено.",
      "message.importSummary": "<strong>Підсумок імпорту</strong><p class=\"mb-2\">Успішно: {success} · Помилок: {failed}</p><pre class=\"mb-0 small\">{errors}</pre>",
      "message.reviewsLoaded": "Завантажено {count} відгуків.",
      "message.reviewsOffline": "Сервіс відгуків зараз недоступний.",
      "message.offline": "Сервіс недоступний або браузер заблокував з'єднання.",
      "message.unexpected": "Неочікувана помилка.",
      "series.empty": "Нічого не знайдено. Спробуй послабити фільтри або додати новий серіал.",
      "series.addFirst": "Поки що серіалів немає. Додай перший запис.",
      "studios.empty": "Студій ще немає. Натисни \"Додати студію\".",
      "studios.seriesCount": "{count} серіалів",
      "reviews.empty": "Поки що відгуків немає. Можна залишити перший.",
      "statistics.empty": "Для цього параметра поки немає статистики.",
      "statistics.failed": "Не вдалося завантажити статистику.",
      "reviews.panelTitle": "Відгуки до \"{title}\"",
      "reviews.addForTitle": "Додати відгук до \"{title}\"",
      "reviews.count": "{count} відгуків",
      "reviews.loading": "Завантаження відгуків...",
      "reviews.offlineChip": "Відгуки недоступні",
      "reviews.loadingChip": "Завантаження відгуків...",
      "reviews.showCount": "{count} відгуків",
      "series.ratingChip": "Рейтинг {rating}",
      "series.seasonsChip": "{count} сезонів",
      "series.finishedChip": "Завершений",
      "series.activeChip": "Триває",
      "series.idChip": "ID {id}",
      "series.reviewsButton": "Відгуки",
      "common.edit": "Редагувати",
      "common.delete": "Видалити",
      "common.download": "Завантажити",
      "common.loading": "Завантаження...",
      "dialog.deleteSeries": "Видалити \"{title}\"?",
      "dialog.deleteStudio": "Видалити студію \"{name}\"?"
    },
    en: {
      "nav.dashboard": "Dashboard",
      "nav.series": "Series",
      "nav.top": "Top 5",
      "nav.statistics": "Statistics",
      "hero.eyebrow": "Blocks 3 + 4",
      "hero.title": "One dashboard for series, studios, reports, imports and reviews.",
      "hero.text": "Choose a series, manage the catalog and leave reviews in one place.",
      "hero.catalog": "Open catalog",
      "hero.tools": "Open tools",
      "hero.addSeries": "Create new series",
      "metrics.series": "Series",
      "metrics.studios": "Studios",
      "metrics.rating": "Average rating",
      "metrics.finished": "Finished series",
      "search.label": "Search",
      "search.placeholder": "Search by title, studio or genre",
      "search.cta": "Find series",
      "catalog.kicker": "Catalog",
      "catalog.title": "Manage series and review activity",
      "catalog.refresh": "Refresh",
      "catalog.addSeries": "Add series",
      "catalog.filterSearch": "Title or studio",
      "catalog.filterStudio": "Studio",
      "catalog.allStudios": "All studios",
      "catalog.filterGenre": "Genre",
      "catalog.genrePlaceholder": "For example, Drama",
      "catalog.filterYear": "Year",
      "catalog.yearPlaceholder": "2024",
      "catalog.filterMinRating": "Min rating",
      "catalog.ratingPlaceholder": "8.0",
      "catalog.sortBy": "Sort by",
      "catalog.direction": "Direction",
      "catalog.desc": "Desc",
      "catalog.asc": "Asc",
      "catalog.pageSize": "Cards per page",
      "catalog.topMode": "Top 5 mode",
      "catalog.apply": "Apply filters",
      "catalog.reset": "Reset",
      "catalog.apiSearch": "Quick match",
      "catalog.genreStrip": "Quick genres",
      "catalog.clearGenre": "Clear genre",
      "catalog.previous": "Previous",
      "catalog.next": "Next",
      "studios.kicker": "Studios",
      "studios.title": "Manage reference data",
      "studios.add": "Add studio",
      "studios.addModal": "Add studio",
      "studios.editModal": "Edit studio",
      "studios.name": "Name",
      "studios.country": "Country",
      "statistics.kicker": "Statistics",
      "statistics.title": "Overview by selected attribute",
      "statistics.attribute": "Attribute",
      "statistics.load": "Load statistics",
      "tools.kicker": "Toolbox",
      "tools.title": "Reports and JSON import",
      "tools.reportTitle": "Generate report",
      "tools.reportText": "Generate a report using the current catalog filters.",
      "tools.format": "Format",
      "tools.async": "Async mode",
      "tools.generate": "Generate",
      "tools.importTitle": "Import JSON file",
      "tools.importText": "Import a JSON list of series right into the catalog.",
      "tools.chooseFile": "Choose file",
      "tools.upload": "Upload",
      "reviews.kicker": "Reviews for series",
      "reviews.title": "Reviews for the selected series",
      "reviews.composerTitle": "Reviews right on the page",
      "reviews.composerText": "Add a score and a short comment without leaving the page.",
      "reviews.noSelection": "Choose a series in the catalog",
      "reviews.noSelectionHelp": "Then reviews for that series will appear right here below.",
      "reviews.selectionMeta": "{studio} · {genre} · {year}",
      "reviews.showMore": "Show more",
      "reviews.add": "Add review",
      "reviews.addModal": "Add review",
      "reviews.editModal": "Review",
      "reviews.modalBannerTitle": "Helpful reviews win",
      "reviews.modalBannerText": "Write what worked, what did not, and give a fair score from 1 to 10.",
      "reviews.reviewer": "Reviewer name",
      "reviews.reviewerPlaceholder": "Your name",
      "reviews.rating": "Rating",
      "reviews.comment": "Comment",
      "reviews.commentPlaceholder": "What did you like or dislike about the series?",
      "reviews.save": "Save review",
      "series.addModal": "Add series",
      "series.editModal": "Edit series",
      "series.bannerTitle": "Create a new title",
      "series.bannerText": "Add genre, studio, rating and release year in one place.",
      "series.title": "Title",
      "series.genre": "Genre",
      "series.seasons": "Seasons",
      "series.rating": "Rating",
      "series.year": "Year",
      "series.studio": "Studio",
      "series.finished": "Finished",
      "common.cancel": "Cancel",
      "common.save": "Save",
      "summary.count": "{count} series found",
      "summary.empty": "No series match the current filters.",
      "summary.page": "Page {page} of {total}",
      "message.filtersReset": "Filters reset.",
      "message.refreshing": "Refreshing data...",
      "message.refreshed": "Data refreshed.",
      "message.loadingStats": "Loading statistics...",
      "message.statsUpdated": "Statistics updated.",
      "message.searchPrompt": "Enter a title to search.",
      "message.searching": "Searching for an exact match...",
      "message.searchFound": "Exact match found: \"{title}\".",
      "message.seriesSaved": "Series saved: \"{title}\".",
      "message.studioSaved": "Studio saved: \"{name}\".",
      "message.reviewSaved": "Review created successfully.",
      "message.seriesDeleted": "Deleted \"{title}\".",
      "message.studioDeleted": "Deleted studio \"{name}\".",
      "message.generateReport": "Generating report...",
      "message.reportDownloaded": "Report downloaded.",
      "message.asyncReport": "Async report ready: <a href=\"{url}\">download</a>",
      "message.chooseFile": "Choose a JSON file first.",
      "message.importDone": "Import completed.",
      "message.importSummary": "<strong>Import summary</strong><p class=\"mb-2\">Success: {success} · Failed: {failed}</p><pre class=\"mb-0 small\">{errors}</pre>",
      "message.reviewsLoaded": "{count} reviews loaded.",
      "message.reviewsOffline": "Reviews service is unavailable right now.",
      "message.offline": "Service is unavailable or blocked by the browser connection.",
      "message.unexpected": "Unexpected error.",
      "series.empty": "No series to show. Try lighter filters or add a new series.",
      "series.addFirst": "No series yet. Add the first item.",
      "studios.empty": "No studios yet. Use \"Add studio\" to create one.",
      "studios.seriesCount": "{count} series",
      "reviews.empty": "No reviews yet. You can leave the first one.",
      "statistics.empty": "No statistics are available for this view yet.",
      "statistics.failed": "Statistics could not be loaded.",
      "reviews.panelTitle": "Reviews for \"{title}\"",
      "reviews.addForTitle": "Add review for \"{title}\"",
      "reviews.count": "{count} reviews",
      "reviews.loading": "Loading reviews...",
      "reviews.offlineChip": "Reviews offline",
      "reviews.loadingChip": "Loading reviews...",
      "reviews.showCount": "{count} reviews",
      "series.ratingChip": "Rating {rating}",
      "series.seasonsChip": "{count} seasons",
      "series.finishedChip": "Finished",
      "series.activeChip": "In progress",
      "series.idChip": "ID {id}",
      "series.reviewsButton": "Reviews",
      "common.edit": "Edit",
      "common.delete": "Delete",
      "common.download": "Download",
      "common.loading": "Loading...",
      "dialog.deleteSeries": "Delete \"{title}\"?",
      "dialog.deleteStudio": "Delete studio \"{name}\"?"
    }
  };

  const initialLanguage = localStorage.getItem("seriesDashboardLanguage")
    || ((navigator.language || "").toLowerCase().startsWith("uk") ? "uk" : "en");
  const initialDeveloperMode = localStorage.getItem("seriesDashboardDeveloperMode") === "true";
  const CURRENT_YEAR = new Date().getFullYear();
  const MAX_PLANNED_YEAR = CURRENT_YEAR + 3;

  const state = {
    language: initialLanguage,
    developerMode: initialDeveloperMode,
    series: [],
    studios: [],
    selectedSeriesGenres: [],
    createdSeriesIds: loadStoredIds("seriesDashboardCreatedSeriesIds"),
    createdStudioIds: loadStoredIds("seriesDashboardCreatedStudioIds"),
    filters: {
      search: "",
      studioId: "",
      genre: "",
      year: "",
      minRating: "",
      sortBy: app.dataset.initialView === "top" ? "rating" : "title",
      direction: "desc",
      pageSize: 6,
      page: 1,
      topMode: app.dataset.initialView === "top"
    },
    reviewCounts: {},
    reviewsOnline: true,
    reviewPanel: {
      seriesId: null,
      from: 0,
      size: 5,
      totalLoaded: 0,
      items: []
    }
  };

  const reviewsApiBase = (app.dataset.reviewsApiBase || "http://localhost:3010").replace(/\/$/, "");
  const initialView = app.dataset.initialView || "home";

  const elements = {
    heroSearchForm: document.getElementById("hero-search-form"),
    heroSearch: document.getElementById("hero-search"),
    heroAddSeriesBtn: document.getElementById("hero-add-series-btn"),
    metricSeriesCount: document.getElementById("metric-series-count"),
    metricStudiosCount: document.getElementById("metric-studios-count"),
    metricRatingAverage: document.getElementById("metric-rating-average"),
    metricFinishedCount: document.getElementById("metric-finished-count"),
    seriesFiltersForm: document.getElementById("series-filters-form"),
    filterSearch: document.getElementById("filter-search"),
    filterStudio: document.getElementById("filter-studio"),
    filterGenre: document.getElementById("filter-genre"),
    filterYear: document.getElementById("filter-year"),
    filterMinRating: document.getElementById("filter-min-rating"),
    filterSortBy: document.getElementById("filter-sort-by"),
    filterDirection: document.getElementById("filter-direction"),
    filterPageSize: document.getElementById("filter-page-size"),
    filterTopMode: document.getElementById("filter-top-mode"),
    resetFiltersBtn: document.getElementById("reset-filters-btn"),
    quickSearchBtn: document.getElementById("quick-search-btn"),
    refreshSeriesBtn: document.getElementById("refresh-series-btn"),
    clearGenreBtn: document.getElementById("clear-genre-btn"),
    genreChips: document.getElementById("genre-chips"),
    genreList: document.getElementById("genre-list"),
    catalogSummary: document.getElementById("catalog-summary"),
    catalogFeedback: document.getElementById("catalog-feedback"),
    seriesGrid: document.getElementById("series-grid"),
    prevPageBtn: document.getElementById("prev-page-btn"),
    nextPageBtn: document.getElementById("next-page-btn"),
    paginationSummary: document.getElementById("pagination-summary"),
    studiosGrid: document.getElementById("studios-grid"),
    studiosFeedback: document.getElementById("studios-feedback"),
    statisticsForm: document.getElementById("statistics-form"),
    statisticsAttribute: document.getElementById("statistics-attribute"),
    statisticsFeedback: document.getElementById("statistics-feedback"),
    statisticsBars: document.getElementById("statistics-bars"),
    reportForm: document.getElementById("report-form"),
    reportFormat: document.getElementById("report-format"),
    reportAsync: document.getElementById("report-async"),
    reportFeedback: document.getElementById("report-feedback"),
    uploadForm: document.getElementById("upload-form"),
    uploadFile: document.getElementById("upload-file"),
    uploadFeedback: document.getElementById("upload-feedback"),
    uploadResult: document.getElementById("upload-result"),
    reviewsFeedback: document.getElementById("reviews-feedback"),
    reviewsList: document.getElementById("reviews-list"),
    showMoreReviewsBtn: document.getElementById("show-more-reviews-btn"),
    addReviewBtn: document.getElementById("add-review-btn"),
    reviewsOffcanvasLabel: document.getElementById("reviewsOffcanvasLabel"),
    reviewsContextTitle: document.getElementById("reviews-context-title"),
    reviewsContextMeta: document.getElementById("reviews-context-meta"),
    toolboxSection: document.getElementById("toolbox-section"),
    developerModeToggle: document.getElementById("developer-mode-toggle"),
    seriesModalTitle: document.getElementById("series-modal-title"),
    seriesForm: document.getElementById("series-form"),
    seriesFormFeedback: document.getElementById("series-form-feedback"),
    seriesId: document.getElementById("series-id"),
    seriesTitle: document.getElementById("series-title"),
    seriesGenre: document.getElementById("series-genre"),
    seriesGenrePicker: document.getElementById("series-genre-picker"),
    seriesGenreAddBtn: document.getElementById("series-genre-add-btn"),
    seriesSelectedGenres: document.getElementById("series-selected-genres"),
    seriesSeasons: document.getElementById("series-seasons"),
    seriesRating: document.getElementById("series-rating"),
    seriesYear: document.getElementById("series-year"),
    seriesYearHint: document.getElementById("series-year-hint"),
    seriesStudio: document.getElementById("series-studio"),
    seriesFinished: document.getElementById("series-finished"),
    studioModalTitle: document.getElementById("studio-modal-title"),
    studioForm: document.getElementById("studio-form"),
    studioFormFeedback: document.getElementById("studio-form-feedback"),
    studioId: document.getElementById("studio-id"),
    studioName: document.getElementById("studio-name"),
    studioCountry: document.getElementById("studio-country"),
    reviewModalTitle: document.getElementById("review-modal-title"),
    reviewForm: document.getElementById("review-form"),
    reviewFormFeedback: document.getElementById("review-form-feedback"),
    reviewSeriesId: document.getElementById("review-series-id"),
    reviewerName: document.getElementById("reviewer-name"),
    reviewRating: document.getElementById("review-rating"),
    reviewComment: document.getElementById("review-comment"),
    newSeriesBtn: document.getElementById("new-series-btn"),
    newStudioBtn: document.getElementById("new-studio-btn"),
    langUk: document.getElementById("lang-uk"),
    langEn: document.getElementById("lang-en")
  };

  const ui = {
    seriesModal: new bootstrap.Modal(document.getElementById("seriesModal")),
    studioModal: new bootstrap.Modal(document.getElementById("studioModal")),
    reviewModal: new bootstrap.Modal(document.getElementById("reviewModal"))
  };

  init();

  async function init() {
    bindEvents();
    applyTranslations();
    applyDeveloperMode();
    renderSeriesSkeletons();
    renderStudiosSkeletons();
    renderReviewsContext();
    syncFiltersToUi();

    try {
      await Promise.all([loadStudios(), loadSeries()]);
      renderStudioSelects();
      renderGenreOptions();
      updateMetrics();
      renderStudios();
      renderSeries();
      await loadStatistics();
      focusInitialSection();
    } catch (error) {
      showFeedback(elements.catalogFeedback, formatError(error), "error");
    }
  }

  function bindEvents() {
    elements.heroSearchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      applySearch(elements.heroSearch.value.trim());
    });

    elements.heroAddSeriesBtn.addEventListener("click", function () {
      openSeriesModal();
    });

    elements.seriesFiltersForm.addEventListener("submit", function (event) {
      event.preventDefault();
      state.filters.search = elements.filterSearch.value.trim();
      state.filters.studioId = elements.filterStudio.value;
      state.filters.genre = elements.filterGenre.value.trim();
      state.filters.year = elements.filterYear.value.trim();
      state.filters.minRating = elements.filterMinRating.value.trim();
      state.filters.sortBy = elements.filterSortBy.value;
      state.filters.direction = elements.filterDirection.value;
      state.filters.pageSize = Number(elements.filterPageSize.value);
      state.filters.topMode = elements.filterTopMode.checked;
      state.filters.page = 1;
      syncSearchInputs();
      renderSeries();
    });

    elements.filterSearch.addEventListener("input", function () {
      state.filters.search = elements.filterSearch.value.trim();
      state.filters.page = 1;
      syncSearchInputs();
      renderSeries();
    });

    elements.filterGenre.addEventListener("input", function () {
      state.filters.genre = elements.filterGenre.value.trim();
      state.filters.page = 1;
      renderSeries();
      renderGenreOptions();
    });

    elements.resetFiltersBtn.addEventListener("click", function () {
      state.filters = {
        search: "",
        studioId: "",
        genre: "",
        year: "",
        minRating: "",
        sortBy: initialView === "top" ? "rating" : "title",
        direction: "desc",
        pageSize: 6,
        page: 1,
        topMode: initialView === "top"
      };
      syncFiltersToUi();
      renderGenreOptions();
      renderSeries();
      showFeedback(elements.catalogFeedback, t("message.filtersReset"), "info");
    });

    elements.quickSearchBtn.addEventListener("click", handleQuickSearch);
    elements.refreshSeriesBtn.addEventListener("click", refreshAllData);
    elements.clearGenreBtn.addEventListener("click", function () {
      state.filters.genre = "";
      elements.filterGenre.value = "";
      renderGenreOptions();
      renderSeries();
    });

    elements.prevPageBtn.addEventListener("click", function () {
      state.filters.page = Math.max(1, state.filters.page - 1);
      renderSeries();
    });

    elements.nextPageBtn.addEventListener("click", function () {
      const totalPages = getTotalPages();
      state.filters.page = Math.min(totalPages, state.filters.page + 1);
      renderSeries();
    });

    elements.statisticsForm.addEventListener("submit", function (event) {
      event.preventDefault();
      loadStatistics();
    });

    elements.reportForm.addEventListener("submit", handleReportSubmit);
    elements.uploadForm.addEventListener("submit", handleUploadSubmit);

    elements.newSeriesBtn.addEventListener("click", function () {
      openSeriesModal();
    });
    elements.newStudioBtn.addEventListener("click", function () {
      openStudioModal();
    });
    elements.addReviewBtn.addEventListener("click", function () {
      if (state.reviewPanel.seriesId) {
        openReviewModal(state.reviewPanel.seriesId);
      }
    });
    elements.showMoreReviewsBtn.addEventListener("click", function () {
      if (state.reviewPanel.seriesId) {
        loadReviews(state.reviewPanel.seriesId, true);
      }
    });

    elements.seriesGrid.addEventListener("click", handleSeriesGridClick);
    elements.studiosGrid.addEventListener("click", handleStudiosGridClick);
    elements.genreChips.addEventListener("click", handleGenreChipClick);

    elements.seriesForm.addEventListener("submit", handleSeriesFormSubmit);
    elements.studioForm.addEventListener("submit", handleStudioFormSubmit);
    elements.reviewForm.addEventListener("submit", handleReviewFormSubmit);
    elements.seriesGenreAddBtn.addEventListener("click", function () {
      addSelectedGenre(elements.seriesGenrePicker.value);
    });
    elements.seriesGenrePicker.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        addSelectedGenre(elements.seriesGenrePicker.value);
      }
    });
    elements.seriesSelectedGenres.addEventListener("click", function (event) {
      const target = event.target.closest("[data-remove-genre]");
      if (!target) {
        return;
      }
      removeSelectedGenre(target.dataset.removeGenre);
    });

    elements.langUk.addEventListener("click", function () {
      setLanguage("uk");
    });
    elements.langEn.addEventListener("click", function () {
      setLanguage("en");
    });
    elements.developerModeToggle.addEventListener("change", function () {
      setDeveloperMode(elements.developerModeToggle.checked);
    });
    elements.seriesYear.addEventListener("input", updateSeriesYearHint);
    elements.seriesFinished.addEventListener("change", updateSeriesYearHint);
  }

  function setLanguage(language) {
    state.language = language;
    localStorage.setItem("seriesDashboardLanguage", language);
    applyTranslations();
    syncFiltersToUi();
    renderGenreOptions();
    renderStudios();
    renderSeries();
    renderReviewsList();
    loadStatistics();
  }

  function applyTranslations() {
    document.documentElement.lang = state.language;

    document.querySelectorAll("[data-i18n]").forEach(function (element) {
      element.textContent = t(element.dataset.i18n);
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function (element) {
      element.innerHTML = t(element.dataset.i18nHtml);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (element) {
      element.setAttribute("placeholder", t(element.dataset.i18nPlaceholder));
    });

    elements.langUk.classList.toggle("active", state.language === "uk");
    elements.langEn.classList.toggle("active", state.language === "en");

    if (!state.reviewPanel.seriesId) {
      elements.reviewsOffcanvasLabel.textContent = t("reviews.title");
    }

    renderReviewsContext();
    updateSeriesYearHint();
  }

  function setDeveloperMode(enabled) {
    state.developerMode = enabled;
    localStorage.setItem("seriesDashboardDeveloperMode", String(enabled));
    applyDeveloperMode();
    renderSeries();
    renderStudios();
  }

  function applyDeveloperMode() {
    document.body.classList.toggle("page-toolbox-hidden", !state.developerMode);
    elements.toolboxSection.hidden = !state.developerMode;
    elements.developerModeToggle.checked = state.developerMode;
  }

  async function refreshAllData() {
    showFeedback(elements.catalogFeedback, t("message.refreshing"), "info");
    try {
      await Promise.all([loadStudios(), loadSeries()]);
      renderStudioSelects();
      renderGenreOptions();
      updateMetrics();
      renderStudios();
      renderSeries();
      await loadStatistics();
      showFeedback(elements.catalogFeedback, t("message.refreshed"), "success");
    } catch (error) {
      showFeedback(elements.catalogFeedback, formatError(error), "error");
    }
  }

  async function loadStudios() {
    state.studios = await apiJson("/api/v1/studios");
  }

  async function loadSeries() {
    state.series = await apiJson("/api/v1/series");
  }

  function updateMetrics() {
    const totalSeries = state.series.length;
    const averageRating = totalSeries
      ? state.series.reduce(function (sum, item) {
          return sum + Number(item.rating || 0);
        }, 0) / totalSeries
      : 0;
    const finishedCount = state.series.filter(function (item) {
      return item.finished;
    }).length;

    elements.metricSeriesCount.textContent = String(totalSeries);
    elements.metricStudiosCount.textContent = String(state.studios.length);
    elements.metricRatingAverage.textContent = averageRating.toFixed(1);
    elements.metricFinishedCount.textContent = String(finishedCount);
  }

  function renderStudioSelects() {
    const studioOptions = ['<option value="">' + escapeHtml(t("catalog.allStudios")) + "</option>"]
      .concat(
        state.studios
          .slice()
          .sort(function (left, right) {
            return left.name.localeCompare(right.name);
          })
          .map(function (studio) {
            return '<option value="' + studio.id + '">' + escapeHtml(studio.name) + "</option>";
          })
      )
      .join("");

    elements.filterStudio.innerHTML = studioOptions;
    elements.seriesStudio.innerHTML = state.studios
      .slice()
      .sort(function (left, right) {
        return left.name.localeCompare(right.name);
      })
      .map(function (studio) {
        return '<option value="' + studio.id + '">' + escapeHtml(studio.name) + "</option>";
      })
      .join("");

    syncFiltersToUi();
  }

  function renderGenreOptions() {
    const genres = getAvailableGenres();

    elements.genreList.innerHTML = genres
      .map(function (genre) {
        return '<option value="' + escapeHtml(genre) + '"></option>';
      })
      .join("");

    elements.genreChips.innerHTML = genres.length
      ? genres
          .slice(0, 10)
          .map(function (genre) {
            const active = genre.toLowerCase() === state.filters.genre.toLowerCase();
            return '<button type="button" class="genre-chip ' + (active ? "active" : "") + '" data-genre="' + escapeHtml(genre) + '">' + escapeHtml(genre) + "</button>";
          })
          .join("")
      : '<div class="text-muted small">' + escapeHtml(t("series.addFirst")) + "</div>";
  }

  function renderSeriesSkeletons() {
    elements.seriesGrid.innerHTML = new Array(6)
      .fill("")
      .map(function () {
        return '<div class="series-card skeleton"></div>';
      })
      .join("");
  }

  function renderStudiosSkeletons() {
    elements.studiosGrid.innerHTML = new Array(3)
      .fill("")
      .map(function () {
        return '<div class="studio-card skeleton"></div>';
      })
      .join("");
  }

  function getAvailableGenres() {
    return Array.from(
      new Set(
        state.series
          .flatMap(function (item) {
            return splitGenres(item.genre);
          })
          .filter(Boolean)
      )
    ).sort();
  }

  function splitGenres(value) {
    return String(value || "")
      .split(",")
      .map(function (part) {
        return part.trim();
      })
      .filter(Boolean);
  }

  function getFilteredSeries() {
    const search = state.filters.search.toLowerCase();
    const genre = state.filters.genre.toLowerCase();
    const year = state.filters.year.trim();
    const studioId = state.filters.studioId;
    const minRating = Number(state.filters.minRating || 0);
    const direction = state.filters.direction === "asc" ? 1 : -1;

    let items = state.series.filter(function (item) {
      const haystack = [item.title, item.genre, item.studio && item.studio.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = !search || haystack.includes(search);
      const matchesStudio = !studioId || String(item.studio.id) === String(studioId);
      const matchesGenre = !genre || item.genre.toLowerCase().includes(genre);
      const matchesYear = !year || String(item.year) === year;
      const matchesRating = !state.filters.minRating || Number(item.rating) >= minRating;
      return matchesSearch && matchesStudio && matchesGenre && matchesYear && matchesRating;
    });

    items.sort(function (left, right) {
      const leftValue = normalizeSortValue(left, state.filters.sortBy);
      const rightValue = normalizeSortValue(right, state.filters.sortBy);
      if (leftValue < rightValue) {
        return -1 * direction;
      }
      if (leftValue > rightValue) {
        return 1 * direction;
      }
      return 0;
    });

    if (state.filters.topMode) {
      items = items.slice(0, 5);
    }

    return items;
  }

  function renderSeries() {
    const filtered = getFilteredSeries();
    const totalPages = getTotalPages(filtered.length);
    state.filters.page = Math.min(state.filters.page, totalPages);
    const pageSize = Number(state.filters.pageSize);
    const startIndex = (state.filters.page - 1) * pageSize;
    const visibleItems = filtered.slice(startIndex, startIndex + pageSize);

    elements.catalogSummary.textContent = filtered.length
      ? t("summary.count", { count: filtered.length })
      : t("summary.empty");
    elements.paginationSummary.textContent = t("summary.page", {
      page: state.filters.page,
      total: totalPages
    });
    elements.prevPageBtn.disabled = state.filters.page <= 1;
    elements.nextPageBtn.disabled = state.filters.page >= totalPages;

    if (!visibleItems.length) {
      elements.seriesGrid.innerHTML = '<div class="empty-state">' + escapeHtml(t("series.empty")) + "</div>";
      return;
    }

    elements.seriesGrid.innerHTML = visibleItems
      .map(function (item) {
        const countLabel = renderReviewCount(item.id);
        const canManage = state.developerMode || state.createdSeriesIds.has(item.id);
        const manageActions = canManage
          ? (
            '<div class="manage-actions">' +
              '<button class="btn btn-card-secondary btn-sm" data-action="edit-series" data-id="' + item.id + '">' + escapeHtml(t("common.edit")) + "</button>" +
              '<button class="btn btn-card-danger btn-sm" data-action="delete-series" data-id="' + item.id + '">' + escapeHtml(t("common.delete")) + "</button>" +
            "</div>"
          )
          : "";
        return (
          '<article class="series-card' + (canManage ? ' can-manage' : '') + '">' +
            '<div class="d-flex justify-content-between gap-3">' +
              "<div>" +
                "<h3>" + escapeHtml(item.title) + "</h3>" +
                '<p class="text-muted mb-2">' + escapeHtml(item.studio.name) + " · " + escapeHtml(item.genre) + "</p>" +
              "</div>" +
              '<span class="chip accent">' + escapeHtml(t("series.idChip", { id: item.id })) + "</span>" +
            "</div>" +
            '<div class="series-meta">' +
              '<span class="chip accent">' + escapeHtml(t("series.ratingChip", { rating: Number(item.rating).toFixed(1) })) + "</span>" +
              '<span class="chip primary">' + escapeHtml(item.year) + "</span>" +
              '<span class="chip">' + escapeHtml(t("series.seasonsChip", { count: item.seasons })) + "</span>" +
              '<span class="chip ' + (item.finished ? "success" : "") + '">' + escapeHtml(item.finished ? t("series.finishedChip") : t("series.activeChip")) + "</span>" +
              '<span class="chip" id="review-count-' + item.id + '">' + escapeHtml(countLabel) + "</span>" +
            "</div>" +
            '<div class="series-actions">' +
              '<button class="btn btn-card-primary btn-sm" data-action="reviews" data-id="' + item.id + '">' + escapeHtml(t("series.reviewsButton")) + "</button>" +
            "</div>" +
            manageActions +
          "</article>"
        );
      })
      .join("");

    refreshReviewCounts(visibleItems);
  }

  function renderReviewCount(seriesId) {
    if (!state.reviewsOnline) {
      return t("reviews.offlineChip");
    }
    if (typeof state.reviewCounts[seriesId] === "number") {
      return t("reviews.count", { count: state.reviewCounts[seriesId] });
    }
    return t("reviews.loadingChip");
  }

  async function refreshReviewCounts(visibleItems) {
    if (!visibleItems.length) {
      return;
    }

    const ids = visibleItems.map(function (item) {
      return item.id;
    });

    try {
      const counts = await reviewsJson("/api/entity3/_counts", {
        method: "POST",
        body: JSON.stringify({ entity1Ids: ids })
      });
      state.reviewsOnline = true;
      Object.assign(state.reviewCounts, counts);
      ids.forEach(function (seriesId) {
        const badge = document.getElementById("review-count-" + seriesId);
        if (badge && typeof state.reviewCounts[seriesId] === "number") {
          badge.textContent = t("reviews.count", { count: state.reviewCounts[seriesId] });
        }
      });
    } catch (_error) {
      state.reviewsOnline = false;
      ids.forEach(function (seriesId) {
        const badge = document.getElementById("review-count-" + seriesId);
        if (badge) {
          badge.textContent = t("reviews.offlineChip");
        }
      });
    }
  }

  function renderStudios() {
    if (!state.studios.length) {
      elements.studiosGrid.innerHTML = '<div class="empty-state">' + escapeHtml(t("studios.empty")) + "</div>";
      return;
    }

    elements.studiosGrid.innerHTML = state.studios
      .slice()
      .sort(function (left, right) {
        return left.name.localeCompare(right.name);
      })
      .map(function (studio) {
        const seriesCount = state.series.filter(function (item) {
          return item.studio.id === studio.id;
        }).length;
        const canManage = state.developerMode || state.createdStudioIds.has(studio.id);
        const manageActions = canManage
          ? (
            '<div class="manage-actions">' +
              '<button class="btn btn-card-secondary btn-sm" data-action="edit-studio" data-id="' + studio.id + '">' + escapeHtml(t("common.edit")) + "</button>" +
              '<button class="btn btn-card-danger btn-sm" data-action="delete-studio" data-id="' + studio.id + '">' + escapeHtml(t("common.delete")) + "</button>" +
            "</div>"
          )
          : "";
        return (
          '<article class="studio-card' + (canManage ? ' can-manage' : '') + '">' +
            "<h3>" + escapeHtml(studio.name) + "</h3>" +
            '<p class="text-muted mb-3">' + escapeHtml(studio.country) + "</p>" +
            '<div class="series-meta">' +
              '<span class="chip">' + escapeHtml(t("studios.seriesCount", { count: seriesCount })) + "</span>" +
              '<span class="chip accent">' + escapeHtml(t("series.idChip", { id: studio.id })) + "</span>" +
            "</div>" +
            '<div class="studio-actions"></div>' +
            manageActions +
          "</article>"
        );
      })
      .join("");
  }

  async function loadStatistics() {
    showFeedback(elements.statisticsFeedback, t("message.loadingStats"), "info");

    try {
      const stats = await apiJson("/api/v1/statistics/" + encodeURIComponent(elements.statisticsAttribute.value));
      renderStatisticsBars(stats);
      showFeedback(elements.statisticsFeedback, t("message.statsUpdated"), "success");
    } catch (error) {
      elements.statisticsBars.innerHTML = '<div class="empty-state">' + escapeHtml(t("statistics.failed")) + "</div>";
      showFeedback(elements.statisticsFeedback, formatError(error), "error");
    }
  }

  function renderStatisticsBars(stats) {
    const entries = Object.entries(stats || {});
    const currentAttribute = elements.statisticsAttribute.value;
    if (!entries.length) {
      elements.statisticsBars.innerHTML = '<div class="empty-state">' + escapeHtml(t("statistics.empty")) + "</div>";
      return;
    }

    const maxValue = Math.max.apply(null, entries.map(function (entry) {
      return Number(entry[1]);
    }));

    elements.statisticsBars.innerHTML = entries
      .sort(function (left, right) {
        return Number(right[1]) - Number(left[1]);
      })
      .map(function (entry) {
        const width = maxValue ? Math.max(6, (Number(entry[1]) / maxValue) * 100) : 0;
        const label = formatStatisticsLabel(currentAttribute, entry[0]);
        return (
          '<div class="stat-row">' +
            '<div class="stat-row-header">' +
              "<strong>" + escapeHtml(label) + "</strong>" +
              "<span>" + escapeHtml(entry[1]) + "</span>" +
            "</div>" +
            '<div class="stat-bar-track">' +
              '<div class="stat-bar-fill" style="width:' + width + '%"></div>' +
            "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  function formatStatisticsLabel(attribute, rawValue) {
    if (attribute === "finished") {
      if (String(rawValue).toLowerCase() === "true") {
        return state.language === "uk" ? "Завершений" : "Finished";
      }
      if (String(rawValue).toLowerCase() === "false") {
        return state.language === "uk" ? "Триває" : "In progress";
      }
    }

    return rawValue;
  }

  function applySearch(query) {
    state.filters.search = query;
    state.filters.page = 1;
    syncSearchInputs();
    renderSeries();
    document.getElementById("catalog-section").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleQuickSearch() {
    const query = elements.filterSearch.value.trim();
    if (!query) {
      showFeedback(elements.catalogFeedback, t("message.searchPrompt"), "error");
      return;
    }

    showFeedback(elements.catalogFeedback, t("message.searching"), "info");

    try {
      const result = await apiJson("/api/v1/series/search?query=" + encodeURIComponent(query));
      applySearch(result.title);
      showFeedback(elements.catalogFeedback, t("message.searchFound", { title: result.title }), "success");
    } catch (error) {
      showFeedback(elements.catalogFeedback, formatError(error), "error");
    }
  }

  function handleSeriesGridClick(event) {
    const target = event.target.closest("[data-action]");
    if (!target) {
      return;
    }

    const id = Number(target.dataset.id);
    const action = target.dataset.action;
    const series = state.series.find(function (item) {
      return item.id === id;
    });

    if (!series) {
      return;
    }

    if (action === "reviews") {
      openReviewsPanel(series);
      return;
    }

    if (action === "edit-series") {
      openSeriesModal(series);
      return;
    }

    if (action === "delete-series") {
      deleteSeries(series);
    }
  }

  function handleStudiosGridClick(event) {
    const target = event.target.closest("[data-action]");
    if (!target) {
      return;
    }

    const id = Number(target.dataset.id);
    const action = target.dataset.action;
    const studio = state.studios.find(function (item) {
      return item.id === id;
    });

    if (!studio) {
      return;
    }

    if (action === "edit-studio") {
      openStudioModal(studio);
      return;
    }

    if (action === "delete-studio") {
      deleteStudio(studio);
    }
  }

  function handleGenreChipClick(event) {
    const target = event.target.closest("[data-genre]");
    if (!target) {
      return;
    }

    const genre = target.dataset.genre || "";
    state.filters.genre = genre;
    state.filters.page = 1;
    elements.filterGenre.value = genre;
    renderGenreOptions();
    renderSeries();
  }

  function openSeriesModal(series) {
    elements.seriesForm.reset();
    clearFeedback(elements.seriesFormFeedback);

    if (series) {
      elements.seriesModalTitle.textContent = t("series.editModal");
      elements.seriesId.value = String(series.id);
      elements.seriesTitle.value = series.title;
      state.selectedSeriesGenres = splitGenres(series.genre);
      elements.seriesSeasons.value = String(series.seasons);
      elements.seriesRating.value = String(series.rating);
      elements.seriesYear.value = String(series.year);
      elements.seriesStudio.value = String(series.studio.id);
      elements.seriesFinished.checked = !!series.finished;
    } else {
      elements.seriesModalTitle.textContent = t("series.addModal");
      elements.seriesId.value = "";
      elements.seriesFinished.checked = false;
      state.selectedSeriesGenres = [];
      if (state.studios.length) {
        elements.seriesStudio.value = String(state.studios[0].id);
      }
      if (state.filters.genre) {
        state.selectedSeriesGenres = splitGenres(state.filters.genre).slice(0, 3);
      }
    }

    renderSelectedGenres();
    updateSeriesYearHint();
    ui.seriesModal.show();
  }

  function openStudioModal(studio) {
    elements.studioForm.reset();
    clearFeedback(elements.studioFormFeedback);

    if (studio) {
      elements.studioModalTitle.textContent = t("studios.editModal");
      elements.studioId.value = String(studio.id);
      elements.studioName.value = studio.name;
      elements.studioCountry.value = studio.country;
    } else {
      elements.studioModalTitle.textContent = t("studios.addModal");
      elements.studioId.value = "";
    }

    ui.studioModal.show();
  }

  function openReviewModal(seriesId) {
    const series = state.series.find(function (item) {
      return item.id === seriesId;
    });
    elements.reviewForm.reset();
    clearFeedback(elements.reviewFormFeedback);
    elements.reviewSeriesId.value = String(seriesId);
    elements.reviewModalTitle.textContent = series
      ? t("reviews.addForTitle", { title: series.title })
      : t("reviews.addModal");
    ui.reviewModal.show();
  }

  function renderSelectedGenres() {
    elements.seriesGenre.value = state.selectedSeriesGenres.join(", ");
    elements.seriesSelectedGenres.innerHTML = state.selectedSeriesGenres.length
      ? state.selectedSeriesGenres.map(function (genre) {
          return (
            '<span class="selected-genre-chip">' +
              '<span>' + escapeHtml(genre) + '</span>' +
              '<button type="button" data-remove-genre="' + escapeHtml(genre) + '" aria-label="Remove genre">&times;</button>' +
            '</span>'
          );
        }).join("")
      : '<span class="text-muted small">Оберіть від 1 до 3 жанрів.</span>';
    elements.seriesGenrePicker.value = "";
  }

  function addSelectedGenre(rawValue) {
    const normalized = normalizeGenre(rawValue);
    if (!normalized) {
      return;
    }

    if (state.selectedSeriesGenres.some(function (genre) {
      return genre.toLowerCase() === normalized.toLowerCase();
    })) {
      elements.seriesGenrePicker.value = "";
      return;
    }

    if (state.selectedSeriesGenres.length >= 3) {
      showFeedback(elements.seriesFormFeedback, state.language === "uk"
        ? "Можна обрати максимум 3 жанри."
        : "You can select up to 3 genres.", "error");
      return;
    }

    state.selectedSeriesGenres.push(normalized);
    clearFeedback(elements.seriesFormFeedback);
    renderSelectedGenres();
  }

  function removeSelectedGenre(rawValue) {
    state.selectedSeriesGenres = state.selectedSeriesGenres.filter(function (genre) {
      return genre !== rawValue;
    });
    renderSelectedGenres();
  }

  function normalizeGenre(value) {
    const cleaned = String(value || "")
      .trim()
      .replace(/\s+/g, " ");

    if (!cleaned) {
      return "";
    }

    return cleaned
      .split(" ")
      .map(function (part) {
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
      })
      .join(" ");
  }

  async function handleSeriesFormSubmit(event) {
    event.preventDefault();
    clearFeedback(elements.seriesFormFeedback);

    const payload = {
      title: elements.seriesTitle.value.trim(),
      genre: elements.seriesGenre.value.trim(),
      seasons: Number(elements.seriesSeasons.value),
      rating: Number(elements.seriesRating.value),
      year: Number(elements.seriesYear.value),
      finished: elements.seriesFinished.checked,
      studioId: Number(elements.seriesStudio.value)
    };

    const id = elements.seriesId.value.trim();
    const validationError = validateSeriesPayload(payload);

    if (validationError) {
      showFeedback(elements.seriesFormFeedback, validationError, "error");
      return;
    }

    try {
      const response = await apiJson(id ? "/api/v1/series/" + id : "/api/v1/series", {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(payload)
      });
      if (!id && response && response.id) {
        rememberCreatedId(state.createdSeriesIds, "seriesDashboardCreatedSeriesIds", response.id);
      }
      ui.seriesModal.hide();
      await loadSeries();
      renderGenreOptions();
      updateMetrics();
      renderStudios();
      renderSeries();
      showFeedback(elements.catalogFeedback, t("message.seriesSaved", { title: response.title }), "success");
    } catch (error) {
      showFeedback(elements.seriesFormFeedback, formatError(error), "error");
    }
  }

  async function handleStudioFormSubmit(event) {
    event.preventDefault();
    clearFeedback(elements.studioFormFeedback);

    const payload = {
      name: elements.studioName.value.trim(),
      country: elements.studioCountry.value.trim()
    };

    const id = elements.studioId.value.trim();

    try {
      const response = await apiJson(id ? "/api/v1/studios/" + id : "/api/v1/studios", {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(payload)
      });
      if (!id && response && response.id) {
        rememberCreatedId(state.createdStudioIds, "seriesDashboardCreatedStudioIds", response.id);
      }
      ui.studioModal.hide();
      await loadStudios();
      renderStudioSelects();
      updateMetrics();
      renderStudios();
      showFeedback(elements.studiosFeedback, t("message.studioSaved", { name: response.name }), "success");
    } catch (error) {
      showFeedback(elements.studioFormFeedback, formatError(error), "error");
    }
  }

  async function handleReviewFormSubmit(event) {
    event.preventDefault();
    clearFeedback(elements.reviewFormFeedback);

    const seriesId = Number(elements.reviewSeriesId.value);
    const payload = {
      seriesId: seriesId,
      reviewerName: elements.reviewerName.value.trim(),
      rating: Number(elements.reviewRating.value),
      comment: elements.reviewComment.value.trim()
    };

    try {
      await reviewsJson("/api/entity3", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      state.reviewCounts[seriesId] = (state.reviewCounts[seriesId] || 0) + 1;
      ui.reviewModal.hide();
      renderSeries();
      await loadReviews(seriesId, false);
      showFeedback(elements.reviewsFeedback, t("message.reviewSaved"), "success");
    } catch (error) {
      showFeedback(elements.reviewFormFeedback, formatError(error), "error");
    }
  }

  async function deleteSeries(series) {
    if (!window.confirm(t("dialog.deleteSeries", { title: series.title }))) {
      return;
    }

    try {
      await apiVoid("/api/v1/series/" + series.id, { method: "DELETE" });
      if (state.reviewPanel.seriesId === series.id) {
        state.reviewPanel.seriesId = null;
        state.reviewPanel.from = 0;
        state.reviewPanel.totalLoaded = 0;
        state.reviewPanel.items = [];
        renderReviewsContext();
        renderReviewsList();
      }
      await loadSeries();
      renderGenreOptions();
      updateMetrics();
      renderStudios();
      renderSeries();
      showFeedback(elements.catalogFeedback, t("message.seriesDeleted", { title: series.title }), "success");
    } catch (error) {
      showFeedback(elements.catalogFeedback, formatError(error), "error");
    }
  }

  async function deleteStudio(studio) {
    if (!window.confirm(t("dialog.deleteStudio", { name: studio.name }))) {
      return;
    }

    try {
      await apiVoid("/api/v1/studios/" + studio.id, { method: "DELETE" });
      await loadStudios();
      renderStudioSelects();
      updateMetrics();
      renderStudios();
      showFeedback(elements.studiosFeedback, t("message.studioDeleted", { name: studio.name }), "success");
    } catch (error) {
      showFeedback(elements.studiosFeedback, formatError(error), "error");
    }
  }

  async function openReviewsPanel(series) {
    state.reviewPanel.seriesId = series.id;
    state.reviewPanel.from = 0;
    state.reviewPanel.totalLoaded = 0;
    state.reviewPanel.items = [];
    elements.reviewsOffcanvasLabel.textContent = t("reviews.panelTitle", { title: series.title });
    renderReviewsContext();
    document.getElementById("reviews-section").scrollIntoView({ behavior: "smooth", block: "start" });
    await loadReviews(series.id, false);
  }

  function getSelectedSeries() {
    return state.series.find(function (item) {
      return item.id === state.reviewPanel.seriesId;
    }) || null;
  }

  function renderReviewsContext() {
    const selectedSeries = getSelectedSeries();

    if (!selectedSeries) {
      elements.reviewsOffcanvasLabel.textContent = t("reviews.title");
      elements.reviewsContextTitle.textContent = t("reviews.noSelection");
      elements.reviewsContextMeta.textContent = t("reviews.noSelectionHelp");
      elements.addReviewBtn.disabled = true;
      elements.showMoreReviewsBtn.disabled = true;
      return;
    }

    elements.reviewsOffcanvasLabel.textContent = t("reviews.panelTitle", { title: selectedSeries.title });
    elements.reviewsContextTitle.textContent = selectedSeries.title;
    elements.reviewsContextMeta.textContent = t("reviews.selectionMeta", {
      studio: selectedSeries.studio.name,
      genre: selectedSeries.genre,
      year: selectedSeries.year
    });
    elements.addReviewBtn.disabled = false;
    elements.showMoreReviewsBtn.disabled = !state.reviewsOnline || state.reviewPanel.items.length < state.reviewPanel.size;
  }

  async function loadReviews(seriesId, append) {
    if (!append) {
      state.reviewPanel.from = 0;
      state.reviewPanel.items = [];
      elements.reviewsList.innerHTML = '<div class="review-card">' + escapeHtml(t("reviews.loading")) + "</div>";
    }

    clearFeedback(elements.reviewsFeedback);

    try {
      const reviews = await reviewsJson(
        "/api/entity3?entity1Id=" + encodeURIComponent(seriesId)
          + "&size=" + encodeURIComponent(state.reviewPanel.size)
          + "&from=" + encodeURIComponent(state.reviewPanel.from)
      );

      state.reviewsOnline = true;
      state.reviewPanel.items = append ? state.reviewPanel.items.concat(reviews) : reviews;
      state.reviewPanel.totalLoaded = state.reviewPanel.items.length;
      state.reviewPanel.from = state.reviewPanel.totalLoaded;
      renderReviewsContext();
      renderReviewsList();
      elements.showMoreReviewsBtn.disabled = reviews.length < state.reviewPanel.size;
      showFeedback(elements.reviewsFeedback, t("message.reviewsLoaded", { count: state.reviewPanel.totalLoaded }), "info");
    } catch (error) {
      state.reviewsOnline = false;
      renderReviewsContext();
      elements.reviewsList.innerHTML = '<div class="empty-state">' + escapeHtml(t("message.reviewsOffline")) + "</div>";
      elements.showMoreReviewsBtn.disabled = true;
      showFeedback(elements.reviewsFeedback, formatError(error), "error");
    }
  }

  function renderReviewsList() {
    if (!elements.reviewsList) {
      return;
    }

    if (!state.reviewPanel.seriesId) {
      elements.reviewsList.innerHTML = '<div class="empty-state">' + escapeHtml(t("reviews.noSelectionHelp")) + "</div>";
      return;
    }

    if (!state.reviewPanel.items.length) {
      elements.reviewsList.innerHTML = '<div class="empty-state">' + escapeHtml(t("reviews.empty")) + "</div>";
      return;
    }

    elements.reviewsList.innerHTML = state.reviewPanel.items
      .map(function (review) {
        return (
          '<article class="review-card">' +
            '<div class="review-head">' +
              "<strong>" + escapeHtml(review.reviewerName) + "</strong>" +
              '<span class="chip accent">' + escapeHtml(Number(review.rating).toFixed(1) + "/10") + "</span>" +
            "</div>" +
            '<p class="text-muted small">' + escapeHtml(formatDate(review.publishedAt)) + "</p>" +
            "<p>" + escapeHtml(review.comment) + "</p>" +
          "</article>"
        );
      })
      .join("");
  }

  async function handleReportSubmit(event) {
    event.preventDefault();
    showFeedback(elements.reportFeedback, t("message.generateReport"), "info");

    const payload = {
      studioId: state.filters.studioId ? Number(state.filters.studioId) : null,
      minRating: state.filters.minRating ? Number(state.filters.minRating) : null,
      year: state.filters.year ? Number(state.filters.year) : null,
      genre: state.filters.genre || null,
      format: elements.reportFormat.value,
      async: elements.reportAsync.checked
    };

    try {
      if (elements.reportAsync.checked) {
        const response = await apiJson("/api/v1/series/_report", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        showFeedback(elements.reportFeedback, t("message.asyncReport", { url: response.downloadUrl }), "success", true);
        return;
      }

      const response = await apiBlob("/api/v1/series/_report", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      downloadBlob(response.blob, response.filename || "series-report." + elements.reportFormat.value);
      showFeedback(elements.reportFeedback, t("message.reportDownloaded"), "success");
    } catch (error) {
      showFeedback(elements.reportFeedback, formatError(error), "error");
    }
  }

  async function handleUploadSubmit(event) {
    event.preventDefault();
    clearFeedback(elements.uploadFeedback);
    elements.uploadResult.innerHTML = "";

    const file = elements.uploadFile.files[0];
    if (!file) {
      showFeedback(elements.uploadFeedback, t("message.chooseFile"), "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await apiJson("/api/v1/series/upload", {
        method: "POST",
        body: formData,
        isFormData: true
      });

      await loadSeries();
      renderGenreOptions();
      updateMetrics();
      renderStudios();
      renderSeries();

      elements.uploadResult.innerHTML = t("message.importSummary", {
        success: result.success,
        failed: result.failed,
        errors: escapeHtml(JSON.stringify(result.errors, null, 2))
      });
      showFeedback(elements.uploadFeedback, t("message.importDone"), "success");
    } catch (error) {
      showFeedback(elements.uploadFeedback, formatError(error), "error");
    }
  }

  function syncFiltersToUi() {
    elements.filterSearch.value = state.filters.search;
    elements.heroSearch.value = state.filters.search;
    elements.filterStudio.value = state.filters.studioId;
    elements.filterGenre.value = state.filters.genre;
    elements.filterYear.value = state.filters.year;
    elements.filterMinRating.value = state.filters.minRating;
    elements.filterSortBy.value = state.filters.sortBy;
    elements.filterDirection.value = state.filters.direction;
    elements.filterPageSize.value = String(state.filters.pageSize);
    elements.filterTopMode.checked = state.filters.topMode;
  }

  function syncSearchInputs() {
    elements.filterSearch.value = state.filters.search;
    elements.heroSearch.value = state.filters.search;
  }

  function focusInitialSection() {
    if (initialView === "series" || initialView === "top") {
      document.getElementById("catalog-section").scrollIntoView({ behavior: "smooth", block: "start" });
      if (initialView === "top") {
        state.filters.sortBy = "rating";
        state.filters.direction = "desc";
        state.filters.topMode = true;
        syncFiltersToUi();
        renderSeries();
      }
      return;
    }

    if (initialView === "statistics") {
      document.getElementById("statistics-section").scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function getTotalPages(totalItems) {
    const count = typeof totalItems === "number" ? totalItems : getFilteredSeries().length;
    return Math.max(1, Math.ceil(count / Number(state.filters.pageSize)));
  }

  function normalizeSortValue(item, sortBy) {
    if (sortBy === "title" || sortBy === "genre") {
      return String(item[sortBy]).toLowerCase();
    }
    return item[sortBy];
  }

  async function apiJson(path, options) {
    const response = await fetch(path, buildFetchOptions(options));
    if (!response.ok) {
      throw await extractApiError(response);
    }
    return response.json();
  }

  async function apiVoid(path, options) {
    const response = await fetch(path, buildFetchOptions(options));
    if (!response.ok) {
      throw await extractApiError(response);
    }
  }

  async function apiBlob(path, options) {
    const response = await fetch(path, buildFetchOptions(options));
    if (!response.ok) {
      throw await extractApiError(response);
    }
    return {
      blob: await response.blob(),
      filename: extractFilename(response.headers.get("content-disposition"))
    };
  }

  async function reviewsJson(path, options) {
    const response = await fetch(reviewsApiBase + path, buildFetchOptions(options));
    if (!response.ok) {
      throw await extractApiError(response);
    }
    return response.json();
  }

  function buildFetchOptions(options) {
    const opts = options || {};
    const headers = opts.isFormData ? {} : { "Content-Type": "application/json" };
    return {
      method: opts.method || "GET",
      headers: Object.assign(headers, opts.headers || {}),
      body: opts.body
    };
  }

  async function extractApiError(response) {
    let payload = null;
    try {
      payload = await response.json();
    } catch (_error) {
      payload = { message: response.statusText };
    }
    return {
      status: response.status,
      payload: payload
    };
  }

  function formatError(error) {
    if (error && error.payload) {
      if (error.payload.fields) {
        return Object.entries(error.payload.fields)
          .map(function (entry) {
            return entry[0] + ": " + entry[1];
          })
          .join(" | ");
      }
      if (Array.isArray(error.payload.errors)) {
        return error.payload.errors
          .map(function (entry) {
            return (entry.path ? entry.path + ": " : "") + entry.message;
          })
          .join(" | ");
      }
      return error.payload.message || error.payload.error || t("message.unexpected");
    }
    if (error instanceof TypeError) {
      return t("message.offline");
    }
    return t("message.unexpected");
  }

  function showFeedback(element, message, type, asHtml) {
    if (!element) {
      return;
    }
    element.className = "small feedback-" + type;
    if (asHtml) {
      element.innerHTML = message;
    } else {
      element.textContent = message;
    }
  }

  function clearFeedback(element) {
    if (!element) {
      return;
    }
    element.textContent = "";
    element.className = "small";
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return new Intl.DateTimeFormat(state.language === "uk" ? "uk-UA" : "en-US", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(date);
  }

  function extractFilename(contentDisposition) {
    if (!contentDisposition) {
      return null;
    }
    const match = /filename=\"?([^"]+)\"?/i.exec(contentDisposition);
    return match ? match[1] : null;
  }

  function downloadBlob(blob, filename) {
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function t(key, vars) {
    const messages = translations[state.language] || translations.en;
    let value = messages[key] || translations.en[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (name) {
        value = value.replaceAll("{" + name + "}", String(vars[name]));
      });
    }
    return value;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function validateSeriesPayload(payload) {
    const messages = [];
    const title = (payload.title || "").trim();
    const genres = splitGenres(payload.genre);
    const titlePattern = /^[\p{L}0-9 .:'’-]+$/u;
    const genrePattern = /^[\p{L}0-9 .:'’-]+$/u;

    if (title.length < 2 || title.length > 120) {
      messages.push(state.language === "uk"
        ? "Назва серіалу має містити від 2 до 120 символів."
        : "Series title must be between 2 and 120 characters.");
    }

    if (title && !titlePattern.test(title)) {
      messages.push(state.language === "uk"
        ? "У назві дозволені лише літери, цифри, пробіли та прості розділові знаки."
        : "The title may only contain letters, numbers, spaces and simple punctuation.");
    }

    if (genres.length < 1 || genres.length > 3) {
      messages.push(state.language === "uk"
        ? "Потрібно обрати від 1 до 3 жанрів."
        : "Select from 1 to 3 genres.");
    }

    if (new Set(genres.map(function (genre) { return genre.toLowerCase(); })).size !== genres.length) {
      messages.push(state.language === "uk"
        ? "Жанри не повинні повторюватися."
        : "Genres must be unique.");
    }

    if (genres.some(function (genre) {
      return genre.length < 2 || genre.length > 30;
    })) {
      messages.push(state.language === "uk"
        ? "Кожен жанр має містити від 2 до 30 символів."
        : "Each genre must be between 2 and 30 characters.");
    }

    if (genres.some(function (genre) {
      return !genrePattern.test(genre);
    })) {
      messages.push(state.language === "uk"
        ? "Один або кілька жанрів містять недозволені символи."
        : "One or more genres contain unsupported characters.");
    }

    if (!Number.isInteger(payload.seasons) || payload.seasons < 1 || payload.seasons > 60) {
      messages.push(state.language === "uk"
        ? "Кількість сезонів має бути від 1 до 60."
        : "Seasons must be between 1 and 60.");
    }

    if (!Number.isFinite(payload.rating) || payload.rating < 0 || payload.rating > 10) {
      messages.push(state.language === "uk"
        ? "Рейтинг має бути в межах від 0 до 10."
        : "Rating must be between 0 and 10.");
    } else if (!/^\d{1,2}(\.\d)?$/.test(String(payload.rating))) {
      messages.push(state.language === "uk"
        ? "У рейтингу дозволений максимум один знак після коми."
        : "Rating can use at most one decimal place.");
    }

    if (!Number.isInteger(payload.year)) {
      messages.push(state.language === "uk"
        ? "Рік має бути цілим числом."
        : "Year must be a whole number.");
    } else if (payload.year < 1950) {
      messages.push(state.language === "uk"
        ? "Для цього каталогу рік має бути не раніше 1950."
        : "For this catalog the year must be 1950 or later.");
    } else if (payload.year > MAX_PLANNED_YEAR) {
      messages.push(state.language === "uk"
        ? "Занадто далекий реліз. Використай рік не пізніше " + MAX_PLANNED_YEAR + "."
        : "That release is too far away. Use a year no later than " + MAX_PLANNED_YEAR + ".");
    } else if (payload.finished && payload.year > CURRENT_YEAR) {
      messages.push(state.language === "uk"
        ? "Якщо рік більший за " + CURRENT_YEAR + ", це анонсований реліз, тому серіал не може бути завершеним."
        : "If the year is after " + CURRENT_YEAR + ", this is treated as a planned release, so it cannot be marked finished.");
    }

    if (!payload.studioId || payload.studioId < 1) {
      messages.push(state.language === "uk"
        ? "Оберіть студію зі списку."
        : "Choose a studio from the list.");
    }

    return messages.length ? messages.join(" ") : null;
  }

  function updateSeriesYearHint() {
    if (!elements.seriesYearHint) {
      return;
    }

    const year = Number(elements.seriesYear.value);
    const isFuture = Number.isFinite(year) && year > CURRENT_YEAR;
    const isTooEarly = Number.isFinite(year) && year < 1950;
    const isTooFar = Number.isFinite(year) && year > MAX_PLANNED_YEAR;
    const finished = elements.seriesFinished.checked;

    if (isTooFar) {
      elements.seriesYearHint.textContent = state.language === "uk"
        ? "Занадто далекий реліз. Краще використовувати роки до " + MAX_PLANNED_YEAR + "."
        : "That release is too far away. Prefer years up to " + MAX_PLANNED_YEAR + ".";
      return;
    }

    if (isTooEarly) {
      elements.seriesYearHint.textContent = state.language === "uk"
        ? "Надто ранній рік для цього каталогу. Використай 1950 або новіше."
        : "This year is too early for the catalog. Use 1950 or later.";
      return;
    }

    if (isFuture && finished) {
      elements.seriesYearHint.textContent = state.language === "uk"
        ? "Майбутній рік означає анонсований реліз, тому прапорець \"Завершений\" треба вимкнути."
        : "A future year means a planned release, so the finished flag should stay off.";
      return;
    }

    if (isFuture) {
      elements.seriesYearHint.textContent = state.language === "uk"
        ? "Якщо рік більший за " + CURRENT_YEAR + ", це вважається анонсованим релізом."
        : "If the year is after " + CURRENT_YEAR + ", this is treated as a planned release.";
      return;
    }

    elements.seriesYearHint.textContent = state.language === "uk"
      ? "Для цього каталогу використовуй роки від 1950. Майбутні роки сприймаються як анонсовані релізи."
      : "Use years from 1950 onward in this catalog. Future years are treated as planned releases.";
  }

  function loadStoredIds(key) {
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : [];
      return new Set(
        Array.isArray(parsed)
          ? parsed.map(function (value) {
              return Number(value);
            }).filter(function (value) {
              return Number.isFinite(value);
            })
          : []
      );
    } catch (_error) {
      return new Set();
    }
  }

  function rememberCreatedId(collection, storageKey, id) {
    const numericId = Number(id);
    if (!Number.isFinite(numericId)) {
      return;
    }
    collection.add(numericId);
    localStorage.setItem(storageKey, JSON.stringify(Array.from(collection)));
  }
})();
