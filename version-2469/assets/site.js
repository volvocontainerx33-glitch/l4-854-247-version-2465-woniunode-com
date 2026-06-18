(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var toggle = document.querySelector("[data-menu-toggle]");
        var nav = document.querySelector("[data-main-nav]");

        if (toggle && nav) {
            toggle.addEventListener("click", function () {
                nav.classList.toggle("is-open");
            });
        }

        var hero = document.querySelector("[data-hero]");

        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
            var current = 0;

            function show(index) {
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === current);
                });
                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === current);
                });
            }

            dots.forEach(function (dot, dotIndex) {
                dot.addEventListener("click", function () {
                    show(dotIndex);
                });
            });

            if (slides.length > 1) {
                window.setInterval(function () {
                    show(current + 1);
                }, 5200);
            }
        }

        var panel = document.querySelector("[data-filter-panel]");
        var list = document.querySelector("[data-filter-list]");

        if (panel && list) {
            var textInput = panel.querySelector("[data-filter-text]");
            var categoryInput = panel.querySelector("[data-filter-category]");
            var regionInput = panel.querySelector("[data-filter-region]");
            var typeInput = panel.querySelector("[data-filter-type]");
            var yearInput = panel.querySelector("[data-filter-year]");
            var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
            var params = new URLSearchParams(window.location.search);
            var initialQuery = params.get("q") || "";

            if (textInput && initialQuery) {
                textInput.value = initialQuery;
            }

            function valueOf(input) {
                return input ? input.value.trim().toLowerCase() : "";
            }

            function applyFilters() {
                var query = valueOf(textInput);
                var category = valueOf(categoryInput);
                var region = valueOf(regionInput);
                var type = valueOf(typeInput);
                var year = valueOf(yearInput);

                cards.forEach(function (card) {
                    var haystack = [
                        card.getAttribute("data-title") || "",
                        card.getAttribute("data-genre") || "",
                        card.getAttribute("data-region") || "",
                        card.getAttribute("data-type") || "",
                        card.getAttribute("data-year") || "",
                        card.textContent || ""
                    ].join(" ").toLowerCase();

                    var matched = true;
                    matched = matched && (!query || haystack.indexOf(query) !== -1);
                    matched = matched && (!category || haystack.indexOf(category) !== -1);
                    matched = matched && (!region || haystack.indexOf(region) !== -1);
                    matched = matched && (!type || haystack.indexOf(type) !== -1);
                    matched = matched && (!year || haystack.indexOf(year) !== -1);
                    card.style.display = matched ? "" : "none";
                });
            }

            [textInput, categoryInput, regionInput, typeInput, yearInput].forEach(function (input) {
                if (input) {
                    input.addEventListener("input", applyFilters);
                    input.addEventListener("change", applyFilters);
                }
            });

            applyFilters();
        }
    });
})();
