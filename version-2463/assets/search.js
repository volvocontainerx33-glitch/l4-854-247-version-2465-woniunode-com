(function () {
  const params = new URLSearchParams(window.location.search);
  const query = (params.get('q') || '').trim();
  const input = document.querySelector('.large-search input[name="q"]');
  const title = document.getElementById('searchTitle');
  const resultBox = document.getElementById('searchResults');
  const empty = document.getElementById('searchEmpty');
  const movies = Array.isArray(window.SEARCH_MOVIES) ? window.SEARCH_MOVIES : [];

  if (input) {
    input.value = query;
  }

  const normalize = function (value) {
    return String(value || '').toLowerCase();
  };

  const buildCard = function (movie) {
    const tags = Array.isArray(movie.tags) ? movie.tags.join(' ') : '';
    const safeTitle = escapeHtml(movie.title);
    const safeLine = escapeHtml(movie.oneLine || '');

    return [
      '<article class="movie-card">',
      '  <a class="movie-card-link" href="' + escapeAttribute(movie.url) + '" aria-label="观看 ' + safeTitle + '">',
      '    <span class="poster-frame">',
      '      <img src="' + escapeAttribute(movie.cover) + '" alt="' + safeTitle + '" loading="lazy">',
      '      <span class="poster-shade"></span>',
      '      <span class="play-badge">▶</span>',
      '      <span class="year-badge">' + escapeHtml(movie.year) + '</span>',
      '    </span>',
      '    <span class="movie-card-body">',
      '      <span class="meta-row"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></span>',
      '      <strong>' + safeTitle + '</strong>',
      '      <span class="movie-desc">' + safeLine + '</span>',
      '      <span class="genre-line">' + escapeHtml(movie.genre || tags) + '</span>',
      '    </span>',
      '  </a>',
      '</article>'
    ].join('');
  };

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, '&#96;');
  }

  const results = query
    ? movies.filter(function (movie) {
        const searchText = [
          movie.title,
          movie.region,
          movie.type,
          movie.year,
          movie.genre,
          movie.oneLine,
          Array.isArray(movie.tags) ? movie.tags.join(' ') : ''
        ].map(normalize).join(' ');

        return searchText.includes(normalize(query));
      })
    : movies.slice(0, 48);

  if (title) {
    title.textContent = query ? '“' + query + '”的搜索结果' : '精选影片';
  }

  if (resultBox) {
    resultBox.innerHTML = results.map(buildCard).join('');
  }

  if (empty) {
    empty.hidden = results.length !== 0;
  }
})();
