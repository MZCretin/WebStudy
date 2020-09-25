document.addEventListener('load', function() {
    function audioAutoPlay() {
        var audio = document.getElementById('myaudio');
        audio.play();
        document.addEventListener("WeixinJSBridgeReady", function() {
            audio.play();
        }, false);
    }
    audioAutoPlay();

    if (/i(Phone|P(o|a)d)/.test(navigator.userAgent)) {
        $(document).one('touchstart',
            function(e) {
                $('#audiojs').get(0).touchstart = true;
                $('#audiojs').get(0).play();
                return false;
            });
    }
});