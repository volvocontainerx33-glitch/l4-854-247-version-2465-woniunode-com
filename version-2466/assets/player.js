import { H as Hls } from "./hls-vendor.js";

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("[data-player]").forEach(function (player) {
    var video = player.querySelector("video");
    var button = player.querySelector("[data-play-button]");
    var source = player.getAttribute("data-src") || (button && button.getAttribute("data-src"));
    var hlsInstance = null;

    if (!video || !button || !source) {
      return;
    }

    function bindSource() {
      if (video.getAttribute("data-source-bound") === "true") {
        return;
      }

      if (Hls && Hls.isSupported()) {
        hlsInstance = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        hlsInstance.on(Hls.Events.ERROR, function (eventName, data) {
          if (!data || !data.fatal) {
            return;
          }
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            hlsInstance.startLoad();
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            hlsInstance.recoverMediaError();
          } else {
            hlsInstance.destroy();
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else {
        player.classList.add("player-error");
      }

      video.setAttribute("data-source-bound", "true");
    }

    function playVideo() {
      bindSource();
      player.classList.add("is-loading");
      var promise = video.play();
      if (promise && typeof promise.then === "function") {
        promise.catch(function () {
          player.classList.remove("is-loading");
        });
      }
    }

    button.addEventListener("click", playVideo);
    video.addEventListener("play", function () {
      player.classList.add("is-playing");
      player.classList.remove("is-loading");
    });
    video.addEventListener("pause", function () {
      player.classList.remove("is-playing");
    });
    window.addEventListener("beforeunload", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
});
