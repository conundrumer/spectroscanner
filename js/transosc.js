define(function() {

	function TransOsc(ctx, numPartials, funFreq) {
		this.ctx = ctx;
		this.numPartials = numPartials;
		this.funFreq = funFreq;
		this.osc = ctx.createOscillator();
		this.osc.frequency.value = funFreq;
		this.real = new Float32Array(numPartials);
		this.imag = new Float32Array(numPartials);
		this.osc.connect(ctx.destination);
	}

	TransOsc.prototype = {
		setPartials: function (partials) {
			for (var i = 0; i < partials.length; i++) {
				this.real[i] = partials[i];
			}
			var table = this.ctx.createPeriodicWave(this.real, this.imag);
			this.osc.setPeriodicWave(table);
		},
		start: function () {
			this.osc.start(0);
		}
	};

	return TransOsc;
});