(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input[name="q"]');
      var value = input ? input.value.trim() : '';
      var target = value ? 'search.html?q=' + encodeURIComponent(value) : 'search.html';
      window.location.href = target;
    });
  });

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dots button'));
    var current = 0;

    function showHero(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showHero(index);
      });
    });

    showHero(0);
    window.setInterval(function () {
      showHero(current + 1);
    }, 5200);
  }

  document.querySelectorAll('[data-slider]').forEach(function (slider) {
    var track = slider.querySelector('.slider-track');
    var pages = Array.prototype.slice.call(slider.querySelectorAll('.slider-page'));
    var prev = slider.querySelector('[data-prev]');
    var next = slider.querySelector('[data-next]');
    var dots = Array.prototype.slice.call(slider.querySelectorAll('.slider-dots button'));
    var current = 0;

    function show(index) {
      if (!track || !pages.length) {
        return;
      }
      current = (index + pages.length) % pages.length;
      track.style.transform = 'translateX(-' + current * 100 + '%)';
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
      });
    });

    show(0);
  });

  var searchInput = document.querySelector('[data-search-input]');
  if (searchInput) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-search-card]'));
    var empty = document.querySelector('[data-search-empty]');
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';

    function normalize(text) {
      return String(text || '').toLowerCase().replace(/\s+/g, '');
    }

    function runSearch(value) {
      var query = normalize(value);
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = normalize((card.getAttribute('data-title') || '') + (card.getAttribute('data-meta') || '') + card.textContent);
        var matched = !query || haystack.indexOf(query) !== -1;
        card.classList.toggle('is-hidden', !matched);
        if (matched) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    searchInput.value = initial;
    runSearch(initial);
    searchInput.addEventListener('input', function () {
      runSearch(searchInput.value);
    });
  }
})();
