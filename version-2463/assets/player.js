(function () {
  function initMoviePlayer(sourceUrl) {
    const shell = document.querySelector('[data-player]');

    if (!shell) {
      return;
    }

    const video = shell.querySelector('video');
    const overlay = shell.querySelector('.player-overlay');
    let loaded = false;
    let hls = null;

    const playVideo = function () {
      const attempt = video.play();

      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {});
      }
    };

    const attachSource = function () {
      if (loaded) {
        playVideo();
        return;
      }

      loaded = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = sourceUrl;
        video.addEventListener('loadedmetadata', playVideo, { once: true });
        video.load();
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(sourceUrl);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            hls.destroy();
            video.src = sourceUrl;
            video.load();
          }
        });
        return;
      }

      video.src = sourceUrl;
      video.load();
      playVideo();
    };

    const start = function () {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }

      attachSource();
    };

    if (overlay) {
      overlay.addEventListener('click', start);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });

    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    });
  }

  window.initMoviePlayer = initMoviePlayer;
})();
