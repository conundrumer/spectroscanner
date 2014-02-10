define( ['transosc'],
function (TransOsc) {

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

	App.prototype.init = function() {
		// this.canvas = $('#canvas');
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		console.log("width: " + this.width + ", height: " + this.height);
		var ctx = new AudioContext(),
		delay = 300,
		numPartials = 32,
		funFreq = 40,
		partials = makeTestPartials(numPartials),
		osc = new TransOsc(ctx, numPartials, funFreq);

		osc.setPartials(partials);
		osc.start();
		interval = setInterval(testTransOsc, delay, osc, partials);
	};

	return App;
});