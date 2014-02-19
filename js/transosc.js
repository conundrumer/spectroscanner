/**
 * TransOsc: Transformation Oscillator
 * Continuously takes the inverse of varying short-time Fourier transforms
 * Crossfades between two PeriodOscs to simulate windowing to avoid clicks
 */
define(['periodosc'], function(PeriodOsc) {
	// var foo = true;

	function TransOsc(ctx, height, maxFreq) {
		var funFreq = maxFreq / height;
		var numPartials = height;
		// this.low = Math.floor(low/funFreq);
		// console.log(funFreq, this.low);
		this.ctx = ctx;
		this.real = new Float32Array(numPartials);
		this.imag = new Float32Array(numPartials);
		this.oscs = [new PeriodOsc(ctx, funFreq), new PeriodOsc(ctx, funFreq)];
		this.curOscIndex = 0;
	}

	TransOsc.prototype = {
		get curOsc() {
			return this.oscs[this.curOscIndex];
		},
		get nextOsc() {
			return this.oscs[this.curOscIndex ^ 1];
		},
		switchOscs: function(gain) {
			this.curOsc.fadeOut();
			this.nextOsc.fadeIn(gain);
			this.curOscIndex ^= 1;
		},
		setPartials: function (partials, maxGain) {
			gain = 0;
			for (var i = 0; i < partials.length; i++) {
				// TODO: logarithmic spacing
				// var normalized = Math.pow(2, (i)/(this.numBands));
				// var n = Math.round(numPartials*(normalized - 1));
				this.real[i] = partials[i];
				gain += partials[i];
				// if (foo) {
				//	console.log(normalized);
				// }
			}
			gain /= maxGain*partials.length;
			foo = false;
			var wave = this.ctx.createPeriodicWave(this.real, this.imag);
			this.nextOsc.setWave(wave);
			this.switchOscs(0.5 + 0.5*gain);
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