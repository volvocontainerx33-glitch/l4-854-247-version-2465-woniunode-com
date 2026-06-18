function initMoviePlayer(source, poster) {
  var video = document.querySelector('.movie-video');
  var cover = document.querySelector('.player-cover');
  var playButton = document.querySelector('.player-play');
  var attached = false;
  var hlsInstance = null;

  if (!video || !source) {
    return;
  }

  if (poster) {
    video.setAttribute('poster', poster);
  }

  function attachSource() {
    if (attached) {
      return;
    }

    attached = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      return;
    }

    video.src = source;
  }

  function startPlayback() {
    attachSource();
    if (cover) {
      cover.classList.add('is-hidden');
    }
    var action = video.play();
    if (action && action.catch) {
      action.catch(function () {});
    }
  }

  if (cover) {
    cover.addEventListener('click', startPlayback);
  }

  if (playButton) {
    playButton.addEventListener('click', startPlayback);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      startPlayback();
    } else {
      video.pause();
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
