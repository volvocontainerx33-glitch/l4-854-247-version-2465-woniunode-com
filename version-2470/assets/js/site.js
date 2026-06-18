(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var menuToggle = document.querySelector(".menu-toggle");
        var mobilePanel = document.querySelector(".mobile-panel");

        if (menuToggle && mobilePanel) {
            menuToggle.addEventListener("click", function () {
                var isOpen = !mobilePanel.hasAttribute("hidden");
                if (isOpen) {
                    mobilePanel.setAttribute("hidden", "");
                    menuToggle.setAttribute("aria-expanded", "false");
                    menuToggle.textContent = "☰";
                } else {
                    mobilePanel.removeAttribute("hidden");
                    menuToggle.setAttribute("aria-expanded", "true");
                    menuToggle.textContent = "×";
                }
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dots button"));
        var activeIndex = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            activeIndex = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === activeIndex);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === activeIndex);
                dot.setAttribute("aria-current", dotIndex === activeIndex ? "true" : "false");
            });
        }

        if (slides.length) {
            dots.forEach(function (dot, dotIndex) {
                dot.addEventListener("click", function () {
                    showSlide(dotIndex);
                });
            });
            showSlide(0);
            window.setInterval(function () {
                showSlide(activeIndex + 1);
            }, 5000);
        }

        var params = new URLSearchParams(window.location.search);
        var queryParam = params.get("q") || "";
        var globalSearch = document.querySelector("[data-global-search]");
        if (globalSearch && queryParam) {
            globalSearch.value = queryParam;
        }

        var filterRoot = document.querySelector("[data-filter-root]");
        if (filterRoot) {
            var keywordInput = filterRoot.querySelector("[data-filter-keyword]");
            var genreSelect = filterRoot.querySelector("[data-filter-genre]");
            var regionSelect = filterRoot.querySelector("[data-filter-region]");
            var yearSelect = filterRoot.querySelector("[data-filter-year]");
            var clearButton = filterRoot.querySelector("[data-filter-clear]");
            var cards = Array.prototype.slice.call(filterRoot.querySelectorAll(".movie-card"));
            var emptyState = filterRoot.querySelector(".empty-state");

            function normalize(value) {
                return String(value || "").toLowerCase().trim();
            }

            function applyFilters() {
                var keyword = normalize(keywordInput && keywordInput.value);
                var genre = normalize(genreSelect && genreSelect.value);
                var region = normalize(regionSelect && regionSelect.value);
                var year = normalize(yearSelect && yearSelect.value);
                var visible = 0;

                cards.forEach(function (card) {
                    var text = normalize([
                        card.dataset.title,
                        card.dataset.genre,
                        card.dataset.region,
                        card.dataset.year,
                        card.dataset.type,
                        card.textContent
                    ].join(" "));
                    var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
                    var matchGenre = !genre || normalize(card.dataset.genre).indexOf(genre) !== -1;
                    var matchRegion = !region || normalize(card.dataset.region).indexOf(region) !== -1;
                    var matchYear = !year || normalize(card.dataset.year) === year;
                    var show = matchKeyword && matchGenre && matchRegion && matchYear;
                    card.style.display = show ? "" : "none";
                    if (show) {
                        visible += 1;
                    }
                });

                if (emptyState) {
                    emptyState.style.display = visible ? "none" : "block";
                }
            }

            [keywordInput, genreSelect, regionSelect, yearSelect].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", applyFilters);
                    control.addEventListener("change", applyFilters);
                }
            });

            if (clearButton) {
                clearButton.addEventListener("click", function () {
                    if (keywordInput) {
                        keywordInput.value = "";
                    }
                    if (genreSelect) {
                        genreSelect.value = "";
                    }
                    if (regionSelect) {
                        regionSelect.value = "";
                    }
                    if (yearSelect) {
                        yearSelect.value = "";
                    }
                    applyFilters();
                });
            }

            applyFilters();
        }

        var backTop = document.createElement("button");
        backTop.className = "back-top";
        backTop.type = "button";
        backTop.setAttribute("aria-label", "返回顶部");
        backTop.textContent = "↑";
        document.body.appendChild(backTop);
        backTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
        window.addEventListener("scroll", function () {
            backTop.classList.toggle("show", window.scrollY > 360);
        });
    });
})();
