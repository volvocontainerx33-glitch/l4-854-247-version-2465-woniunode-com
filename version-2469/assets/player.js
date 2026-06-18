(function () {
    function startPlayer(player) {
        var video = player.querySelector("video[data-hls]");
        var button = player.querySelector("[data-play-button]");

        if (!video) {
            return;
        }

        var url = video.getAttribute("data-hls");
        var loaded = false;

        function loadVideo() {
            if (loaded || !url) {
                return;
            }

            loaded = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = url;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });

                hls.loadSource(url);
                hls.attachMedia(video);
                player._hls = hls;
                return;
            }

            video.src = url;
        }

        function play() {
            loadVideo();
            player.classList.add("is-playing");
            var playResult = video.play();

            if (playResult && typeof playResult.catch === "function") {
                playResult.catch(function () {
                    player.classList.remove("is-playing");
                });
            }
        }

        if (button) {
            button.addEventListener("click", function () {
                play();
            });
        }

        video.addEventListener("play", function () {
            player.classList.add("is-playing");
        });

        video.addEventListener("pause", function () {
            if (!video.ended) {
                player.classList.remove("is-playing");
            }
        });
    }

    function init() {
        Array.prototype.slice.call(document.querySelectorAll("[data-player]")).forEach(startPlayer);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
