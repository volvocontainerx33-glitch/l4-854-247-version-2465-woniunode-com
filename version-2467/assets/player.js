function initMoviePlayer(source) {
  var video = document.getElementById("movieVideo");
  var overlay = document.getElementById("playerOverlay");
  var hlsInstance = null;
  var hasLoaded = false;

  if (!video || !source) {
    return;
  }

  var load = function () {
    if (!hasLoaded) {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls();
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else {
        video.src = source;
      }
      hasLoaded = true;
    }

    if (overlay) {
      overlay.classList.add("is-hidden");
    }

    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {});
    }
  };

  if (overlay) {
    overlay.addEventListener("click", load);
  }

  video.addEventListener("click", function () {
    if (video.paused) {
      load();
    }
  });

  window.addEventListener("pagehide", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
}
