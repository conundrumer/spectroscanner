define( [],
function () {

	function App() {
	}

	App.prototype.init = function() {
		// this.canvas = $('#canvas');
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		console.log("width: " + this.width + ", height: " + this.height);
		var ctx = new AudioContext(),
    osc = ctx.createOscillator(),
		real = new Float32Array(10),
		imag = new Float32Array(10);
		for (var i = 0; i < 30; i++) {
			real[i] = 1 - 2*(i%2);
		}
		var table = ctx.createPeriodicWave(real, imag);
  
		osc.setPeriodicWave(table);
		osc.connect(ctx.destination);
		osc.start(0);
		console.log(osc);
		console.log(table);
	};

	return App;
});