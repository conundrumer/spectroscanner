/**
 * WebCam: gets video input and puts it on a canvas
 */
define(function() {
	function WebCam(canvas, video) {
		navigator.getUserMedia({video: true});
	}

	return WebCam;
});