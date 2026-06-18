(function () {
  var navButton = document.querySelector("[data-nav-toggle]");
  var navMenu = document.querySelector("[data-site-menu]");

  if (navButton && navMenu) {
    navButton.addEventListener("click", function () {
      navMenu.classList.toggle("is-open");
    });
  }

  var slider = document.querySelector("[data-hero-slider]");

  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
    var current = 0;

    var showSlide = function (index) {
      current = index;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    };

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide((current + 1) % slides.length);
      }, 5600);
    }
  }

  var filterGrid = document.querySelector("[data-filter-grid]");
  var gridSearch = document.querySelector("[data-grid-search]");
  var gridSort = document.querySelector("[data-grid-sort]");

  if (filterGrid) {
    var filterCards = Array.prototype.slice.call(filterGrid.querySelectorAll(".movie-card"));

    var applyFilter = function () {
      var keyword = gridSearch ? gridSearch.value.trim().toLowerCase() : "";
      filterCards.forEach(function (card) {
        var text = card.textContent.toLowerCase();
        card.classList.toggle("is-hidden-card", keyword && text.indexOf(keyword) === -1);
      });
    };

    var applySort = function () {
      var mode = gridSort ? gridSort.value : "default";
      var sorted = filterCards.slice();

      if (mode !== "default") {
        sorted.sort(function (a, b) {
          var aValue = parseFloat(a.getAttribute("data-" + mode) || "0");
          var bValue = parseFloat(b.getAttribute("data-" + mode) || "0");
          return bValue - aValue;
        });
      }

      sorted.forEach(function (card) {
        filterGrid.appendChild(card);
      });
      applyFilter();
    };

    if (gridSearch) {
      gridSearch.addEventListener("input", applyFilter);
    }

    if (gridSort) {
      gridSort.addEventListener("change", applySort);
    }
  }

  var searchResults = document.querySelector("[data-search-results]");
  var searchInput = document.querySelector("[data-search-input]");
  var searchTitle = document.querySelector("[data-search-title]");
  var searchForm = document.querySelector("[data-search-form]");

  var escapeHtml = function (value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  var renderSearchCards = function (items) {
    if (!searchResults) {
      return;
    }

    searchResults.innerHTML = items.map(function (item) {
      return [
        "<article class=\"movie-card\">",
        "<a class=\"movie-cover\" href=\"" + escapeHtml(item.url) + "\" aria-label=\"观看" + escapeHtml(item.title) + "\">",
        "<img src=\"" + escapeHtml(item.cover) + "\" alt=\"" + escapeHtml(item.title) + "\" loading=\"lazy\">",
        "<span class=\"movie-duration\">" + escapeHtml(item.duration) + "</span>",
        "<span class=\"movie-play\">▶</span>",
        "</a>",
        "<div class=\"movie-info\">",
        "<h3><a href=\"" + escapeHtml(item.url) + "\">" + escapeHtml(item.title) + "</a></h3>",
        "<p>" + escapeHtml(item.description) + "</p>",
        "<div class=\"movie-meta\"><span>★ " + escapeHtml(item.rating) + "</span><span>" + escapeHtml(item.year) + "</span></div>",
        "<div class=\"movie-tags\"><span>" + escapeHtml(item.type) + "</span><span>" + escapeHtml(item.region) + "</span></div>",
        "</div>",
        "</article>"
      ].join("");
    }).join("");
  };

  var applySiteSearch = function () {
    if (!searchResults || !window.SEARCH_MOVIES) {
      return;
    }

    var keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
    var items = window.SEARCH_MOVIES;

    if (keyword) {
      items = items.filter(function (item) {
        return item.searchText.indexOf(keyword) !== -1;
      });
    }

    items = items.slice(0, 96);
    renderSearchCards(items);

    if (searchTitle) {
      searchTitle.textContent = keyword ? "搜索结果" : "推荐影片";
    }
  };

  if (searchResults && searchInput && window.SEARCH_MOVIES) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";
    searchInput.value = query;
    applySiteSearch();

    searchInput.addEventListener("input", applySiteSearch);

    if (searchForm) {
      searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var nextUrl = new URL(window.location.href);
        var value = searchInput.value.trim();
        if (value) {
          nextUrl.searchParams.set("q", value);
        } else {
          nextUrl.searchParams.delete("q");
        }
        window.history.replaceState({}, "", nextUrl.toString());
        applySiteSearch();
      });
    }
  }
})();
