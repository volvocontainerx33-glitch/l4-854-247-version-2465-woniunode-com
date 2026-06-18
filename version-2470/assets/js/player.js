(function () {
    window.initMoviePlayer = function (videoId, buttonId, sourceUrl) {
        var video = document.getElementById(videoId);
        var button = document.getElementById(buttonId);
        var hlsInstance = null;
        var loaded = false;

        if (!video || !button || !sourceUrl) {
            return;
        }

        function reveal() {
            button.classList.add("is-hidden");
            video.setAttribute("controls", "controls");
        }

        function playVideo() {
            reveal();
            var promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function () {});
            }
        }

        function attachSource() {
            if (loaded) {
                playVideo();
                return;
            }

            loaded = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = sourceUrl;
                video.addEventListener("loadedmetadata", playVideo, { once: true });
                video.load();
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                hlsInstance.loadSource(sourceUrl);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
                return;
            }

            video.src = sourceUrl;
            video.addEventListener("loadedmetadata", playVideo, { once: true });
            video.load();
        }

        button.addEventListener("click", attachSource);
        video.addEventListener("click", function () {
            if (!loaded || video.paused) {
                attachSource();
            } else {
                video.pause();
            }
        });
        window.addEventListener("pagehide", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
                hlsInstance = null;
            }
        });
    };
})();
