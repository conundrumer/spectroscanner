/**
 * PeriodOsc: Periodic Wave Oscillator
 * Abstraction of custom OscillatorNode combined with gain and fading
 */
define(function() {
	function PeriodOsc(ctx, funFreq) {
		this.gain = 1;
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
		fadeIn: function(g) {
			this.gain = g;
			this.gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime);
			this.gainNode.gain.linearRampToValueAtTime(g, this.ctx.currentTime + this.FADE_TIME);
		},
		fadeOut: function() {
			this.gainNode.gain.linearRampToValueAtTime(this.gain, this.ctx.currentTime);
			this.gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + this.FADE_TIME);
		},
		setWave: function (wave) {
			this.osc.setPeriodicWave(wave);
		}
	};

	return PeriodOsc;
});