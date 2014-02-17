define( ['transosc', 'webcam', 'img2amp'], function (TransOsc, WebCam, Img2Amp) {
	var delay = 10;
	function App() {
	}

	function rotate(a) {
		a.unshift(a.pop());
	}

	function testImg2Amp(img2amp, col, osc,canvas) {
		var slice = img2amp.getSlice(col);
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.beginPath();
		ctx.strokeStyle = 'red';
		ctx.moveTo(col, 0);
		ctx.lineTo(col, canvas.height);
		ctx.stroke();
		osc.setPartials(slice);
		ctx.closePath();
		setTimeout(testImg2Amp, delay, img2amp, (col+1)%canvas.width, osc, canvas);
	}

	App.prototype.init = function() {
		var canvas = document.getElementById('cvs'),
		video = document.getElementById('vid'),
		webcam = new WebCam(canvas, video),
		audioContext = new AudioContext(),
		numBands = canvas.height,
		low = 32,
		high = 4096,
		osc = new TransOsc(audioContext, numBands, low, high);

		webcam.init();
		osc.start();
		var img2amp = new Img2Amp(canvas);
		var scanline = document.getElementById('scanline');
		setTimeout(testImg2Amp, delay, img2amp, 0, osc, scanline);

		// webcam.start();
		context = canvas.getContext('2d');
		context.fillStyle = 'white';
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.beginPath();
		context.moveTo(0, 0);
		context.lineTo(canvas.width, canvas.height);
		context.stroke();
		context.closePath();
	};

	return App;
});