(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  ready(function () {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".main-nav");

    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    var slider = document.querySelector("[data-hero-slider]");

    if (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
      var current = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }

        current = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === current);
        });

        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === current);
        });
      }

      function start() {
        window.clearInterval(timer);
        timer = window.setInterval(function () {
          show(current + 1);
        }, 5200);
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          show(Number(dot.getAttribute("data-hero-index") || 0));
          start();
        });
      });

      show(0);
      start();
    }

    document.querySelectorAll("[data-filter-panel]").forEach(function (panel) {
      var search = panel.querySelector(".filter-search");
      var region = panel.querySelector(".filter-region");
      var type = panel.querySelector(".filter-type");
      var year = panel.querySelector(".filter-year");
      var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card]"));
      var empty = panel.querySelector(".filter-empty");
      var params = new URLSearchParams(window.location.search);
      var initial = params.get("q");

      if (initial && search) {
        search.value = initial;
      }

      function apply() {
        var q = normalize(search && search.value);
        var selectedRegion = normalize(region && region.value);
        var selectedType = normalize(type && type.value);
        var selectedYear = normalize(year && year.value);
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-type"),
            card.getAttribute("data-year"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-keywords")
          ].join(" "));
          var matches = true;

          if (q && haystack.indexOf(q) === -1) {
            matches = false;
          }

          if (selectedRegion && normalize(card.getAttribute("data-region")) !== selectedRegion) {
            matches = false;
          }

          if (selectedType && normalize(card.getAttribute("data-type")) !== selectedType) {
            matches = false;
          }

          if (selectedYear && normalize(card.getAttribute("data-year")) !== selectedYear) {
            matches = false;
          }

          card.classList.toggle("is-hidden", !matches);

          if (matches) {
            visible += 1;
          }
        });

        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      [search, region, type, year].forEach(function (control) {
        if (control) {
          control.addEventListener("input", apply);
          control.addEventListener("change", apply);
        }
      });

      apply();
    });

    document.querySelectorAll("[data-player]").forEach(function (player) {
      var video = player.querySelector("video");
      var overlay = player.querySelector(".player-overlay");
      var source = video && video.getAttribute("data-video-url");
      var initialized = false;
      var hls = null;

      function playVideo() {
        if (!video || !source) {
          return;
        }

        if (!initialized) {
          initialized = true;

          if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
          } else if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
              enableWorker: true,
              lowLatencyMode: true
            });
            hls.loadSource(source);
            hls.attachMedia(video);
          } else {
            video.src = source;
          }
        }

        if (overlay) {
          overlay.classList.add("is-hidden");
        }

        var promise = video.play();

        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {});
        }
      }

      if (overlay) {
        overlay.addEventListener("click", playVideo);
      }

      if (video) {
        video.addEventListener("click", function () {
          if (!initialized) {
            playVideo();
          }
        });
      }

      window.addEventListener("pagehide", function () {
        if (hls && typeof hls.destroy === "function") {
          hls.destroy();
        }
      });
    });
  });
})();
