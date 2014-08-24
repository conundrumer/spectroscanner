/**
 * WebCam: gets video input and puts it on a canvas
 */
define(['img2amp'], function(Img2amp) {
	var FPS = 20;
	function WebCam(canvas, video, preview) {
		this.preview = preview;
		this.video = video;
		this.width = video.width;
		this.height = video.height;
		this.context = canvas.getContext('2d');
		this.context.translate(canvas.width, 0);
		this.context.scale(-1, 1);
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
		window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
		navigator.getUserMedia({video: true},
			function(stream) {
				video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
			},
			function(error) {
				console.log("Failed to get capture:", error);
			});
	}


	WebCam.prototype = {
		init: function () {

		},
		start: function () {
			var prevContext = this.preview.getContext('2d');
			var scale = Math.min(this.width / this.preview.width, this.height/ this.preview.height);
			prevContext.scale(scale, scale);
			var video = this.video;
			video.play();
			var that = this;
			var renderTimer = setInterval(function() {
				that.context.drawImage(video, 0, 0, that.width, that.height);
				var image = that.context.getImageData(0,0,that.width, that.height);
				Img2amp.filter(image, that.width, that.height);
				that.context.putImageData(image, 0, 0);
				prevContext.putImageData(image, 0, 0);
			}, Math.round(1000 / FPS));
		},
		getSlice: function(col) {
			var image = this.context.getImageData(0,0,this.width, this.height);
			var slice = [];
			for (var y = 0; y < this.height; y++) {
				var i = (y * this.width + col) * 4;
				slice[y] = image.data[i];
			}
			slice.reverse();
			return slice;
		}
	};
	return WebCam;
});
