define( ['transosc', 'webcam'], function (TransOsc, WebCam) {
	var delay = 10;
	function App() {
	}

	function rotate(a) {
		a.unshift(a.pop());
	}

	function testImg2Amp(webcam, col, osc,canvas) {
		var slice = webcam.getSlice(col);
		drawScanline(canvas, col);
		osc.setPartials(slice, 255);
		setTimeout(testImg2Amp, delay, webcam, (col+1)%(canvas.width), osc, canvas);
	}

	function drawScanline(canvas, col) {
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.beginPath();
		ctx.strokeStyle = 'red';
		ctx.moveTo(col, 0);
		ctx.lineTo(col, canvas.height);
		ctx.stroke();
		ctx.closePath();
	}

	function testOsc(canvas) {
		context = canvas.getContext('2d');
		context.fillStyle = 'white';
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.beginPath();
		context.moveTo(0, 0);
		context.lineTo(canvas.width, canvas.height);
		context.stroke();
		context.closePath();
	}

	App.prototype.init = function() {
		var canvas = document.getElementById('cvs'),
		video = document.getElementById('vid'),
		webcam = new WebCam(canvas, video),
		audioContext = new AudioContext(),
		numBands = canvas.height,
		// low = 32,
		high = 8000,
		osc = new TransOsc(audioContext, numBands, high);

		webcam.init();
		osc.start();
		var scanline = document.getElementById('scanline');
		setTimeout(testImg2Amp, delay, webcam, 1, osc, scanline);

		webcam.start();
		// testOsc(canvas);
	};

	return App;
});