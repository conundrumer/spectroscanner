define( ['transosc', 'webcam'], function (TransOsc, WebCam) {
	var delay = 10;
	function App() {
	}

	function rotate(a) {
		a.unshift(a.pop());
	}

	function testImg2Amp(webcam, col, osc,canvas, scan) {
		var slice = webcam.getSlice(col);
		drawScanline(canvas, col, scan);
		osc.setPartials(slice, 255);
		setTimeout(testImg2Amp, delay, webcam, (col+1)%(canvas.width), osc, canvas, scan);
	}

	function drawScanline(canvas, col, scan) {
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.beginPath();
		ctx.strokeStyle = 'red';
		ctx.moveTo(col, 0);
		ctx.lineTo(col, canvas.height);
		ctx.stroke();
		ctx.closePath();
		scan.putImageData(ctx.getImageData(0,0,canvas.width,canvas.height), 0, 0);
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
		preview = document.getElementById('preview'),
		scanline = document.getElementById('scanline'),
		scan = document.getElementById('bigscan'),
		webcam = new WebCam(canvas, video, preview),
		audioContext = new AudioContext(),
		numBands = canvas.height,
		// low = 32,
		high = 4000,
		osc = new TransOsc(audioContext, numBands, high);

		var bigScan = scan.getContext('2d');
		var scale = Math.min(scanline.width / bigScan.width, scanline.height/ bigScan.height);
		bigScan.scale(scale, scale);

		webcam.init();
		osc.start();
		setTimeout(testImg2Amp, delay, webcam, 1, osc, scanline, bigScan);

		webcam.start();
		// testOsc(canvas);
	};

	return App;
});