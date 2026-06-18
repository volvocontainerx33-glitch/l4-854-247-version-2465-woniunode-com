(function () {
  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function initNavigation() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-site-nav]");
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    if (slides.length <= 1) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function start() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        start();
      });
    });

    show(0);
    start();
  }

  function initLibraryFilter() {
    var root = document.querySelector("[data-library-filter]");
    if (!root) {
      return;
    }
    var list = document.querySelector("[data-filter-list]");
    if (!list) {
      return;
    }
    var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
    var keyword = root.querySelector("[data-filter-keyword]");
    var type = root.querySelector("[data-filter-type]");
    var region = root.querySelector("[data-filter-region]");
    var year = root.querySelector("[data-filter-year]");
    var count = root.querySelector("[data-filter-count]");

    function value(node) {
      return node ? node.value.trim().toLowerCase() : "";
    }

    function applyFilter() {
      var key = value(keyword);
      var typeValue = value(type);
      var regionValue = value(region);
      var yearValue = value(year);
      var visible = 0;

      cards.forEach(function (card) {
        var text = [
          card.getAttribute("data-title"),
          card.getAttribute("data-tags"),
          card.textContent
        ].join(" ").toLowerCase();
        var matched = true;
        if (key && text.indexOf(key) === -1) {
          matched = false;
        }
        if (typeValue && String(card.getAttribute("data-type") || "").toLowerCase() !== typeValue) {
          matched = false;
        }
        if (regionValue && String(card.getAttribute("data-region") || "").toLowerCase() !== regionValue) {
          matched = false;
        }
        if (yearValue && String(card.getAttribute("data-year") || "").toLowerCase().indexOf(yearValue) === -1) {
          matched = false;
        }
        card.classList.toggle("is-hidden", !matched);
        if (matched) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = "当前显示 " + visible + " 部";
      }
    }

    [keyword, type, region, year].forEach(function (node) {
      if (node) {
        node.addEventListener("input", applyFilter);
        node.addEventListener("change", applyFilter);
      }
    });
  }

  function movieCard(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return "<span>" + escapeHtml(tag) + "</span>";
    }).join("");

    return [
      "<article class=\"movie-card\">",
      "<a class=\"movie-poster\" href=\"" + escapeHtml(movie.url) + "\">",
      "<img src=\"" + escapeHtml(movie.cover) + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\">",
      "<span class=\"poster-shade\"></span>",
      "<span class=\"duration-badge\">" + escapeHtml(movie.duration) + "</span>",
      "<span class=\"play-badge\">播放</span>",
      "</a>",
      "<div class=\"movie-info\">",
      "<h3><a href=\"" + escapeHtml(movie.url) + "\">" + escapeHtml(movie.title) + "</a></h3>",
      "<p class=\"movie-desc\">" + escapeHtml(movie.oneLine) + "</p>",
      "<div class=\"movie-meta\"><span>" + escapeHtml(movie.type) + "</span><span>" + escapeHtml(movie.region) + "</span><span>" + escapeHtml(movie.year) + "</span></div>",
      "<div class=\"movie-tags\">" + tags + "</div>",
      "<div class=\"movie-stats\"><span>★ " + escapeHtml(movie.rating) + "</span><span>" + escapeHtml(movie.viewsText) + " 热度</span></div>",
      "</div>",
      "</article>"
    ].join("");
  }

  function initSearchPage() {
    var page = document.getElementById("search-page");
    if (!page || !window.MOVIES) {
      return;
    }
    var input = document.getElementById("search-input");
    var button = document.getElementById("search-button");
    var type = document.getElementById("search-type");
    var region = document.getElementById("search-region");
    var genre = document.getElementById("search-genre");
    var year = document.getElementById("search-year");
    var results = document.getElementById("search-results");
    var count = document.getElementById("search-count");
    var params = new URLSearchParams(window.location.search);

    if (params.get("q") && input) {
      input.value = params.get("q");
    }

    function normalized(node) {
      return node ? node.value.trim().toLowerCase() : "";
    }

    function runSearch() {
      var query = normalized(input);
      var typeValue = normalized(type);
      var regionValue = normalized(region);
      var genreValue = normalized(genre);
      var yearValue = normalized(year);

      var matched = window.MOVIES.filter(function (movie) {
        var haystack = [
          movie.title,
          movie.oneLine,
          movie.type,
          movie.region,
          movie.year,
          movie.genre,
          (movie.tags || []).join(" ")
        ].join(" ").toLowerCase();

        if (query && haystack.indexOf(query) === -1) {
          return false;
        }
        if (typeValue && String(movie.type).toLowerCase() !== typeValue) {
          return false;
        }
        if (regionValue && String(movie.region).toLowerCase() !== regionValue) {
          return false;
        }
        if (genreValue && String(movie.genre).toLowerCase().indexOf(genreValue) === -1) {
          return false;
        }
        if (yearValue && String(movie.year).toLowerCase().indexOf(yearValue) === -1) {
          return false;
        }
        return true;
      });

      if (count) {
        count.textContent = "找到 " + matched.length + " 部影片";
      }
      if (results) {
        results.innerHTML = matched.slice(0, 96).map(movieCard).join("");
      }
    }

    [input, type, region, genre, year].forEach(function (node) {
      if (node) {
        node.addEventListener("input", runSearch);
        node.addEventListener("change", runSearch);
      }
    });
    if (button) {
      button.addEventListener("click", runSearch);
    }
    runSearch();
  }

  function initScrollToPlayer() {
    var button = document.querySelector("[data-scroll-player]");
    var player = document.querySelector("[data-player]");
    if (!button || !player) {
      return;
    }
    button.addEventListener("click", function (event) {
      event.preventDefault();
      player.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNavigation();
    initHero();
    initLibraryFilter();
    initSearchPage();
    initScrollToPlayer();
  });
})();
