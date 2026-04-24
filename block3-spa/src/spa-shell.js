(function () {
  const app = document.getElementById("app");
  const routes = {
    "/": "home",
    "/series": "series",
    "/top": "top",
    "/statistics": "statistics"
  };
  const paths = {
    home: "/",
    series: "/series",
    top: "/top",
    statistics: "/statistics"
  };

  if (app) {
    app.dataset.initialView = routes[window.location.pathname] || "home";
  }

  function setActiveNav(view) {
    document.querySelectorAll("[data-view-link]").forEach(function (link) {
      link.classList.toggle("active", link.dataset.viewLink === view);
    });
  }

  function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function submitSeriesFilters() {
    const form = document.getElementById("series-filters-form");
    if (form) {
      form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    }
  }

  function applyTopMode() {
    const sortBy = document.getElementById("filter-sort-by");
    const direction = document.getElementById("filter-direction");
    const topMode = document.getElementById("filter-top-mode");

    if (sortBy) {
      sortBy.value = "rating";
    }
    if (direction) {
      direction.value = "desc";
    }
    if (topMode) {
      topMode.checked = true;
    }

    submitSeriesFilters();
  }

  function handleView(view, replaceHistory) {
    setActiveNav(view);

    if (!replaceHistory) {
      window.history.pushState({ view: view }, "", paths[view] || "/");
    }

    if (view === "top") {
      applyTopMode();
      window.setTimeout(function () {
        scrollToSection("catalog-section");
      }, 30);
      return;
    }

    if (view === "statistics") {
      scrollToSection("statistics-section");
      return;
    }

    if (view === "series") {
      scrollToSection("catalog-section");
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.addEventListener("click", function (event) {
    const link = event.target.closest("[data-view-link]");
    if (!link) {
      return;
    }
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    handleView(link.dataset.viewLink || "home", false);
  });

  window.addEventListener("popstate", function () {
    handleView(routes[window.location.pathname] || "home", true);
  });

  setActiveNav(routes[window.location.pathname] || "home");
})();
