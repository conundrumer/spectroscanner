/**
 * PeriodOsc: Periodic Wave Oscillator
 * Abstraction of custom OscillatorNode combined with gain and fading
 */
define(function() {
	function PeriodOsc(ctx, funFreq) {
		this.FADE_TIME = 0.01; // seconds
		var osc = ctx.createOscillator(),
		gainNode = ctx.createGain();
		osc.frequency.value = funFreq;
		osc.connect(gainNode);
		gainNode.connect(ctx.destination);
		this.ctx = ctx;
		this.osc = osc;
		this.gainNode = gainNode;
	}

	PeriodOsc.prototype = {
		start: function() {
			this.osc.start(this.ctx.currentTime);
		},
		stop: function() {
			this.osc.stop(this.ctx.currentTime);
		},
		fadeIn: function() {
			this.setGain(1);
		},
		fadeOut: function() {
			this.setGain(0);
		},
		setWave: function (wave) {
			this.osc.setPeriodicWave(wave);
		},
		setGain: function(g) {
			this.gainNode.gain.linearRampToValueAtTime(1-g, this.ctx.currentTime);
			this.gainNode.gain.linearRampToValueAtTime(g, this.ctx.currentTime + this.FADE_TIME);
		}
	};

	return PeriodOsc;
});