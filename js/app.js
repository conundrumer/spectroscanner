define( ['transosc', 'webcam', 'img2amp'], function (TransOsc, WebCam, Img2Amp) {

	function App() {
	}

	function rotate(a) {
		a.unshift(a.pop());
	}

	function makeTestPartials(n) {
		var partials = new Array(n);
		for (var i = 0; i < n; i++) {
			partials[i] = 0;
		}
		partials[1] = 1;
		return partials;
	}

	function testTransOsc(osc, partials) {
		rotate(partials);
		osc.setPartials(partials);
	}

	function testImg2Amp(img2amp, col, width, osc) {
		var slice = img2amp.getSlice(col);
		console.log(slice);
		osc.setPartials(slice);
		setTimeout(testImg2Amp, 100, img2amp, col+1, width, osc);
	}

	App.prototype.init = function() {
		var canvas = document.getElementById('cvs'),
		video = document.getElementById('vid'),
		webcam = new WebCam(canvas, video),
		audioContext = new AudioContext(),
		delay = 100,
		numPartials = 4000,
		funFreq = 10,
		partials = makeTestPartials(numPartials),
		osc = new TransOsc(audioContext, numPartials, funFreq);

		webcam.init();
		webcam.start();
		osc.setPartials(partials);
		osc.start();
		// interval = setInterval(testTransOsc, delay, osc, partials);
		var img2amp = new Img2Amp(canvas);
		setTimeout(testImg2Amp, delay, img2amp, 0, canvas.width, osc);
	};

	return App;
});