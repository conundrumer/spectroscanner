/**
 * TransOsc: Transformation Oscillator
 * Continuously takes the inverse of varying short-time Fourier transforms
 * Crossfades between two PeriodOscs to simulate windowing to avoid clicks
 */
define(['periodosc'], function(PeriodOsc) {
	var numPartials = 2000;
	var foo = true;

	function TransOsc(ctx, numBands, low, high) {
		var funFreq = high / numPartials;
		this.numBands = numBands;
		this.low = Math.floor(low/funFreq);
		console.log(funFreq, this.low);
		this.ctx = ctx;
		console.log();
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
				// logarithmic spacing
				var normalized = Math.pow(2, (i)/(this.numBands));
				var n = Math.round(numPartials*(normalized - 1));
				this.real[n] = partials[i];
				gain += partials[i];
				if (foo) {
					console.log(normalized);
				}
			}
			gain /= maxGain*partials.length;
			foo = false;
			var wave = this.ctx.createPeriodicWave(this.real, this.imag);
			this.nextOsc.setWave(wave);
			this.switchOscs(0.3 + 0.7*gain);
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