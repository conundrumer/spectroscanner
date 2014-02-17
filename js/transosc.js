/**
 * TransOsc: Transformation Oscillator
 * Continuously takes the inverse of varying short-time Fourier transforms
 * Crossfades between two PeriodOscs to simulate windowing to avoid clicks
 */
define(['periodosc'], function(PeriodOsc) {

	function TransOsc(ctx, numBands, low, high) {
		var spacing = (high - low) / numBands;
		var numPartials = Math.floor(high/spacing);
		this.low = Math.floor(low/spacing);
		this.ctx = ctx;
		console.log();
		this.real = new Float32Array(numPartials);
		this.imag = new Float32Array(numPartials);
		this.oscs = [new PeriodOsc(ctx, spacing), new PeriodOsc(ctx, spacing)];
		this.curOscIndex = 0;
	}

	TransOsc.prototype = {
		get curOsc() {
			return this.oscs[this.curOscIndex];
		},
		get nextOsc() {
			return this.oscs[this.curOscIndex ^ 1];
		},
		switchOscs: function() {
			this.curOsc.fadeOut();
			this.nextOsc.fadeIn();
			this.curOscIndex ^= 1;
		},
		setPartials: function (partials) {
			for (var i = 0; i < partials.length; i++) {
				this.real[i+this.low] = partials[i];
			}
			var wave = this.ctx.createPeriodicWave(this.real, this.imag);
			this.nextOsc.setWave(wave);
			this.switchOscs();
		},
		start: function () {
			this.curOsc.start();
			this.nextOsc.start();
		},
		stop: function () {
			this.curOsc.stop();
			this.nextOsc.stop();
		}
	};

	return TransOsc;
});