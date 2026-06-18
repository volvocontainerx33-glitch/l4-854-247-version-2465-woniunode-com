(function () {
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      const opened = mobileNav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(opened));
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('.hero-slide'));
    const dots = Array.from(hero.querySelectorAll('.hero-dot'));
    const prev = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let index = 0;
    let timer = null;

    const showSlide = function (nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    };

    const startTimer = function () {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    };

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.dataset.slide || 0));
        startTimer();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(index - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(index + 1);
        startTimer();
      });
    }

    startTimer();
  }

  document.querySelectorAll('.rail-section').forEach(function (section) {
    const rail = section.querySelector('[data-rail]');
    const prev = section.querySelector('[data-rail-prev]');
    const next = section.querySelector('[data-rail-next]');

    if (!rail) {
      return;
    }

    const move = function (direction) {
      rail.scrollBy({
        left: direction * Math.max(280, rail.clientWidth * 0.78),
        behavior: 'smooth'
      });
    };

    if (prev) {
      prev.addEventListener('click', function () {
        move(-1);
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        move(1);
      });
    }
  });

  document.querySelectorAll('[data-filter-root]').forEach(function (root) {
    const input = root.querySelector('.filter-input');
    const selects = Array.from(root.querySelectorAll('.filter-select'));
    const cards = Array.from(root.querySelectorAll('.movie-card'));
    const empty = root.querySelector('.empty-state');

    const applyFilters = function () {
      const query = input ? input.value.trim().toLowerCase() : '';
      let visible = 0;

      cards.forEach(function (card) {
        const text = [
          card.dataset.title,
          card.dataset.region,
          card.dataset.year,
          card.dataset.genre,
          card.dataset.type
        ].join(' ').toLowerCase();

        const matchesText = !query || text.includes(query);
        const matchesSelects = selects.every(function (select) {
          const value = select.value;
          const key = select.dataset.filter;
          return !value || card.dataset[key] === value;
        });
        const shouldShow = matchesText && matchesSelects;

        card.hidden = !shouldShow;
        if (shouldShow) {
          visible += 1;
        }
      });

      if (empty) {
        empty.hidden = visible !== 0;
      }
    };

    if (input) {
      input.addEventListener('input', applyFilters);
    }

    selects.forEach(function (select) {
      select.addEventListener('change', applyFilters);
    });
  });
})();
