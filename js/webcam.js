/**
 * WebCam: gets video input and puts it on a canvas
 */
define(function() {
    var FPS = 20;
	function WebCam(canvas, video) {
        this.canvas = canvas;
        this.video = video;
        this.context = canvas.getContext('2d');
        this.context.translate(canvas.width, 0);
        this.context.scale(-1, 1);
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
		navigator.getUserMedia({video: true},
            function(stream) {
                video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
            });
	}


    WebCam.prototype = {
        init: function () {

        },
        start: function () {
            this.video.play();
            var that = this;
            var renderTimer = setInterval(function() {
                that.context.drawImage(that.video, 0, 0, that.video.width, that.video.height);
            }, Math.round(1000 / FPS));
        }
    };

    return WebCam;
});