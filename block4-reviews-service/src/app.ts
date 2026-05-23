import express from "express";
import { AppConfig } from "./types/app-config";
import { ReviewModel } from "./models/review.model";
import { Entity1ClientService } from "./services/entity1-client.service";
import { ReviewService } from "./services/review.service";
import { createReviewRouter } from "./routes/review.routes";
import { errorMiddleware } from "./middleware/error.middleware";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeJsString(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n")
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e");
}

export function createApp(config: AppConfig) {
  const app = express();
  const allowedOrigins = new Set([
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:9090",
    "http://127.0.0.1:9090"
  ]);

  const entity1ClientService = new Entity1ClientService(
    config.entity1ServiceUrl,
    config.requestTimeoutMs
  );

  const reviewService = new ReviewService(ReviewModel, entity1ClientService);

  app.use((request, response, next) => {
    const origin = request.headers.origin;

    // The frontend talks to this service from another port, so we allow only
    // the local entry points we actually use during development.
    if (origin && allowedOrigins.has(origin)) {
      response.header("Access-Control-Allow-Origin", origin);
      response.header("Vary", "Origin");
      response.header("Access-Control-Allow-Headers", "Content-Type, X-Admin-Token");
      response.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    }

    if (request.method === "OPTIONS") {
      return response.sendStatus(204);
    }

    next();
  });

  app.use(express.json());

  app.get("/health", (_request, response) => {
    response.json({
      status: "ok",
      service: "block4-reviews-service",
      reviewsPage: "http://localhost:3010/"
    });
  });

  app.get("/", async (request, response, next) => {
    try {
      const language = request.query.lang === "en" ? "en" : "ua";
      const isAdmin = request.query.token === config.adminAccessToken;

      const text = language === "en"
        ? {
            title: "Series reviews service",
            heroTitle: "All series reviews",
            heroText: "This standalone service collects the latest reviews and gives admin access to moderation tools.",
            toHome: "Open frontend",
            json: "Recent reviews JSON",
            health: "Health",
            latest: "Latest reviews",
            latestText: "Open the related series page, edit the review or delete it directly from this service.",
            empty: "No reviews yet.",
            openSeries: "Open series",
            edit: "Edit review",
            delete: "Delete review",
            seriesLabel: "Series",
            dateLabel: "Published",
            accessTitle: "Admin access required",
            accessText: "This page is available only after the admin login in the main frontend.",
            accessAction: "Return to frontend",
            modalTitle: "Edit review",
            reviewerName: "Reviewer name",
            comment: "Comment",
            rating: "Rating",
            cancel: "Cancel",
            save: "Save changes",
            deleting: "Deleting...",
            saving: "Saving...",
            deleteConfirm: "Delete this review?",
            saveSuccess: "Review updated successfully.",
            deleteSuccess: "Review deleted successfully.",
            actionError: "The requested action failed."
          }
        : {
            title: "Сервіс відгуків до серіалів",
            heroTitle: "Усі відгуки до серіалів",
            heroText: "Це окремий сервіс, де зібрані останні відгуки та адмінські інструменти модерації.",
            toHome: "Відкрити frontend",
            json: "JSON останніх відгуків",
            health: "Health",
            latest: "Останні відгуки",
            latestText: "Відкривай сторінку серіалу, редагуй відгук або видаляй його прямо із цього сервісу.",
            empty: "Поки що відгуків немає.",
            openSeries: "Відкрити серіал",
            edit: "Редагувати відгук",
            delete: "Видалити відгук",
            seriesLabel: "Серіал",
            dateLabel: "Опубліковано",
            accessTitle: "Потрібен адміндоступ",
            accessText: "Ця сторінка відкривається лише після входу в адмінку в основному frontend.",
            accessAction: "Повернутися на frontend",
            modalTitle: "Редагування відгуку",
            reviewerName: "Ім'я автора",
            comment: "Коментар",
            rating: "Оцінка",
            cancel: "Скасувати",
            save: "Зберегти зміни",
            deleting: "Видалення...",
            saving: "Збереження...",
            deleteConfirm: "Видалити цей відгук?",
            saveSuccess: "Відгук успішно оновлено.",
            deleteSuccess: "Відгук успішно видалено.",
            actionError: "Не вдалося виконати дію."
          };

      if (!isAdmin) {
        // This page is not meant to be a public moderation URL. The intended
        // path is: sign in as admin in the frontend, then land here.
        response
          .status(403)
          .type("html")
          .send(`<!doctype html>
<html lang="${language === "en" ? "en" : "uk"}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${text.title}</title>
    <style>
      body {
        margin: 0;
        font-family: Arial, sans-serif;
        background: linear-gradient(180deg, #eaf5ff 0%, #f7fbff 100%);
        color: #15304e;
      }
      .wrap {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
      }
      .card {
        max-width: 640px;
        width: 100%;
        background: #fff;
        border: 1px solid #d6e6fb;
        border-radius: 24px;
        box-shadow: 0 18px 40px rgba(38, 95, 168, 0.10);
        padding: 28px;
      }
      h1 { margin-top: 0; }
      p { color: #5f7691; line-height: 1.6; }
      a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        padding: 12px 18px;
        border-radius: 999px;
        background: #2d7ff9;
        color: #fff;
        font-weight: 700;
      }
    </style>
  </head>
  <body>
    <main class="wrap">
      <section class="card">
        <h1>${text.accessTitle}</h1>
        <p>${text.accessText}</p>
        <a href="http://localhost:3000/?lang=${language}">${text.accessAction}</a>
      </section>
    </main>
  </body>
</html>`);
        return;
      }

      const reviews = await reviewService.recent({ size: 50 });
      const seriesIds = [...new Set(reviews.map((review) => review.seriesId))];
      const seriesTitles = new Map<number, string>();

      // Reviews only store the related series id, so we resolve human-readable
      // titles here before rendering the moderation screen.
      await Promise.all(seriesIds.map(async (seriesId) => {
        try {
          const series = await entity1ClientService.getSeries(seriesId);
          seriesTitles.set(seriesId, series.title);
        } catch {
          seriesTitles.set(seriesId, `#${seriesId}`);
        }
      }));

      const rows = reviews.map((review) => {
        const reviewId = review.id || "";
        const reviewer = escapeHtml(review.reviewerName);
        const comment = escapeHtml(review.comment);
        const publishedAt = new Date(review.publishedAt).toLocaleString(language === "en" ? "en-US" : "uk-UA");
        const seriesUrl = `http://localhost:3000/series/${review.seriesId}?lang=${language}`;
        const seriesTitle = escapeHtml(seriesTitles.get(review.seriesId) || `#${review.seriesId}`);
        const safeReviewer = escapeJsString(review.reviewerName);
        const safeComment = escapeJsString(review.comment);
        const safePublishedAt = new Date(review.publishedAt).toISOString();

        return `
          <article class="review-card" id="review-${reviewId}">
            <div class="review-head">
              <div>
                <h2>${reviewer}</h2>
                <p>${text.seriesLabel}: ${seriesTitle}</p>
              </div>
              <div class="rating">${review.rating.toFixed(1)}/10</div>
            </div>
            <p class="comment">${comment}</p>
            <div class="review-footer">
              <p class="date">${text.dateLabel}: ${publishedAt}</p>
              <div class="actions">
                <a class="open-link" href="${seriesUrl}">${text.openSeries}</a>
                <button class="action-button" type="button" onclick="openEditor('${reviewId}', ${review.seriesId}, '${safeReviewer}', '${safeComment}', ${review.rating}, '${safePublishedAt}')">${text.edit}</button>
                <button class="action-button action-danger" type="button" onclick="deleteReview('${reviewId}')">${text.delete}</button>
              </div>
            </div>
          </article>
        `;
      }).join("");

      response
        .status(200)
        .type("html")
        .send(`<!doctype html>
<html lang="${language === "en" ? "en" : "uk"}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${text.title}</title>
    <style>
      :root {
        --panel: #ffffff;
        --ink: #15304e;
        --muted: #5f7691;
        --accent: #2d7ff9;
        --accent-soft: #dfeeff;
        --border: #d6e6fb;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Arial, sans-serif;
        background: linear-gradient(180deg, #eaf5ff 0%, #f7fbff 100%);
        color: var(--ink);
      }
      .wrap {
        max-width: 1080px;
        margin: 0 auto;
        padding: 32px 20px 48px;
      }
      .hero, .panel {
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 24px;
        box-shadow: 0 18px 40px rgba(38, 95, 168, 0.10);
      }
      .hero {
        padding: 28px;
        background: linear-gradient(135deg, #11345a 0%, #1e5fa1 100%);
        color: #fff;
      }
      .hero p {
        margin: 8px 0 0;
        color: rgba(255,255,255,0.86);
      }
      .hero-links {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        margin-top: 18px;
      }
      .hero-links a {
        text-decoration: none;
        padding: 10px 14px;
        border-radius: 999px;
        background: rgba(255,255,255,0.14);
        color: #fff;
        border: 1px solid rgba(255,255,255,0.2);
      }
      .panel {
        margin-top: 24px;
        padding: 24px;
      }
      .panel-head {
        margin-bottom: 18px;
      }
      .panel-head p {
        margin: 6px 0 0;
        color: var(--muted);
      }
      .grid {
        display: grid;
        gap: 16px;
      }
      .review-card {
        background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
        border: 1px solid var(--border);
        border-radius: 18px;
        padding: 18px;
      }
      .review-head {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        align-items: start;
      }
      .review-head h2 {
        margin: 0 0 4px;
        font-size: 1.05rem;
      }
      .review-head p,
      .date {
        margin: 0;
        color: var(--muted);
        font-size: 0.92rem;
      }
      .rating {
        min-width: 88px;
        text-align: center;
        padding: 8px 10px;
        border-radius: 14px;
        background: var(--accent-soft);
        color: var(--accent);
        font-weight: 700;
      }
      .comment {
        margin: 14px 0;
        line-height: 1.5;
      }
      .review-footer {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
      }
      .actions {
        display: flex;
        align-items: center;
        gap: 14px;
        flex-wrap: wrap;
      }
      .open-link {
        text-decoration: none;
        color: var(--accent);
        font-weight: 700;
      }
      .action-button {
        border: 0;
        background: transparent;
        color: var(--accent);
        font: inherit;
        font-weight: 700;
        cursor: pointer;
        padding: 0;
      }
      .action-danger {
        color: #d93025;
      }
      .status {
        display: none;
        margin-top: 16px;
        padding: 12px 14px;
        border-radius: 14px;
        font-weight: 600;
      }
      .status.success {
        display: block;
        background: #e9f7ef;
        color: #17633f;
      }
      .status.error {
        display: block;
        background: #fdeceb;
        color: #b3261e;
      }
      .empty {
        color: var(--muted);
        padding: 16px 0 4px;
      }
      dialog {
        border: 0;
        border-radius: 22px;
        width: min(560px, calc(100vw - 32px));
        padding: 0;
        box-shadow: 0 28px 70px rgba(17, 52, 90, 0.22);
      }
      dialog::backdrop {
        background: rgba(11, 32, 58, 0.42);
      }
      .dialog-card {
        padding: 24px;
      }
      .dialog-card h3 {
        margin-top: 0;
      }
      .field {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 14px;
      }
      .field input,
      .field textarea {
        width: 100%;
        border: 1px solid var(--border);
        border-radius: 14px;
        padding: 12px 14px;
        font: inherit;
      }
      .field textarea {
        min-height: 120px;
        resize: vertical;
      }
      .dialog-actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        flex-wrap: wrap;
      }
      .dialog-actions button {
        border: 0;
        border-radius: 999px;
        padding: 12px 18px;
        font: inherit;
        font-weight: 700;
        cursor: pointer;
      }
      .dialog-secondary {
        background: #eef3fb;
        color: var(--ink);
      }
      .dialog-primary {
        background: var(--accent);
        color: #fff;
      }
    </style>
  </head>
  <body>
    <main class="wrap">
      <section class="hero">
        <h1>${text.heroTitle}</h1>
        <p>${text.heroText}</p>
        <div class="hero-links">
          <a href="http://localhost:3000/?lang=${language}">${text.toHome}</a>
          <a href="/api/entity3/recent?size=10">${text.json}</a>
          <a href="/health">${text.health}</a>
        </div>
      </section>
      <section class="panel">
        <div class="panel-head">
          <h2>${text.latest}</h2>
          <p>${text.latestText}</p>
        </div>
        <div id="status" class="status"></div>
        ${rows ? `<div class="grid">${rows}</div>` : `<p class="empty">${text.empty}</p>`}
      </section>
      <dialog id="editor">
        <form class="dialog-card" id="editor-form">
          <h3>${text.modalTitle}</h3>
          <input type="hidden" id="review-id" />
          <input type="hidden" id="series-id" />
          <input type="hidden" id="published-at" />
          <label class="field">
            <span>${text.reviewerName}</span>
            <input id="reviewer-name" required minlength="2" maxlength="80" />
          </label>
          <label class="field">
            <span>${text.comment}</span>
            <textarea id="review-comment" required minlength="10" maxlength="1000"></textarea>
          </label>
          <label class="field">
            <span>${text.rating}</span>
            <input id="review-rating" type="number" min="1" max="10" step="0.1" required />
          </label>
          <div class="dialog-actions">
            <button type="button" class="dialog-secondary" onclick="closeEditor()">${text.cancel}</button>
            <button type="submit" class="dialog-primary" id="save-button">${text.save}</button>
          </div>
        </form>
      </dialog>
    </main>
    <script>
      const adminToken = '${escapeJsString(config.adminAccessToken)}';
      const actionText = {
        deleteConfirm: '${escapeJsString(text.deleteConfirm)}',
        saveSuccess: '${escapeJsString(text.saveSuccess)}',
        deleteSuccess: '${escapeJsString(text.deleteSuccess)}',
        actionError: '${escapeJsString(text.actionError)}',
        saving: '${escapeJsString(text.saving)}',
        deleting: '${escapeJsString(text.deleting)}',
        saveDefault: '${escapeJsString(text.save)}'
      };
      const statusBox = document.getElementById('status');
      const editor = document.getElementById('editor');
      const editorForm = document.getElementById('editor-form');
      const saveButton = document.getElementById('save-button');

      function setStatus(type, message) {
        statusBox.className = 'status ' + type;
        statusBox.textContent = message;
      }

      function clearStatus() {
        statusBox.className = 'status';
        statusBox.textContent = '';
      }

      function openEditor(id, seriesId, reviewerName, comment, rating, publishedAt) {
        clearStatus();
        document.getElementById('review-id').value = id;
        document.getElementById('series-id').value = String(seriesId);
        document.getElementById('reviewer-name').value = reviewerName;
        document.getElementById('review-comment').value = comment;
        document.getElementById('review-rating').value = String(rating);
        document.getElementById('published-at').value = publishedAt;
        editor.showModal();
      }

      function closeEditor() {
        editor.close();
      }

      async function deleteReview(id) {
        clearStatus();
        if (!window.confirm(actionText.deleteConfirm)) {
          return;
        }

        try {
          setStatus('success', actionText.deleting);
          const response = await fetch('/api/entity3/' + id, {
            method: 'DELETE',
            headers: {
              'X-Admin-Token': adminToken
            }
          });

          if (!response.ok) {
            throw new Error();
          }

          document.getElementById('review-' + id)?.remove();
          setStatus('success', actionText.deleteSuccess);
        } catch {
          setStatus('error', actionText.actionError);
        }
      }

      editorForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        clearStatus();
        saveButton.disabled = true;
        saveButton.textContent = actionText.saving;

        const id = document.getElementById('review-id').value;
        const payload = {
          seriesId: Number(document.getElementById('series-id').value),
          reviewerName: document.getElementById('reviewer-name').value,
          comment: document.getElementById('review-comment').value,
          rating: Number(document.getElementById('review-rating').value),
          publishedAt: document.getElementById('published-at').value
        };

        try {
          const response = await fetch('/api/entity3/' + id, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'X-Admin-Token': adminToken
            },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            throw new Error();
          }

          editor.close();
          setStatus('success', actionText.saveSuccess);
          window.location.reload();
        } catch {
          setStatus('error', actionText.actionError);
        } finally {
          saveButton.disabled = false;
          saveButton.textContent = actionText.saveDefault;
        }
      });
    </script>
  </body>
</html>`);
    } catch (error) {
      next(error);
    }
  });

  app.use(createReviewRouter(reviewService, config.adminAccessToken));
  app.use(errorMiddleware);

  return app;
}
