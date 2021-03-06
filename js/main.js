require( ['app'],
function ( App ) {
	window.AudioContext = (
		window.AudioContext ||
		window.webkitAudioContext ||
		null
	);

	if (!AudioContext) {
		throw new Error("AudioContext not supported!");
	}

	var app = new App();
	$(document).ready(app.init);

	$(window).bind("resize", function(){
		var w = $(window).width();
		var h = $(window).height();
		$("#preview").css("width", w + "px");
		$("#preview").css("height", h + "px");
	});

});