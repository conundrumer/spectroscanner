define (function () {
	var threshold = 10;
	// function Img2Amp (canvas) {
	//	this.canvas = canvas;
	//	this.context = canvas.getContext('2d');
	// }

	var Img2Amp = {
		filter: function(image, width, height) {
			var data = image.data,
			min = 255,
			max = 0,
			y, x;
			if (!this.oldData) {
				this.oldData = new Uint8ClampedArray(data.length);
			}
			for (var i = 0; i < data.length; i++) {
				this.oldData[i] = data[i];
			}
			// for (y = 0; y < height; y++) {
			// 	for (x = 0; x < width; x++) {
			// 		this.filterGrey(data, x, y, width, height);
			// 	}
			// }
			for (y = 0; y < height; y++) {
				for (x = 0; x < width; x++) {
					var r = this.filterSobel(data, x, y, width, height, 0);
					var g = this.filterSobel(data, x, y, width, height, 1);
					var b = this.filterSobel(data, x, y, width, height, 2);
					var avg = Math.max(r,g,b);
					var index = getIndex(x, y, width);
					data[index] = data[index+1] = data[index+2] = avg;
					if (avg < min) {
						min = avg;
					}
					if (avg > max) {
						max = avg;
					}
				}
			}
			for (var i = 0; i < data.length; i += 4) {
				var normalized = (data[i] - min) * 255 / (max - min);
				normalized *= normalized;
				normalized *= Math.round(Math.sqrt(normalized));
				normalized /= 255*16;
				data[i] = data[i+1] = data[i+2] = normalized;
			}
		},
		filterGrey: function(data, x, y, width, height) {
			var i = getIndex(x, y, width);
			var grey = Math.max(data[i], data[i+1], data[i+2]);
			this.oldData[i] = this.oldData[i+1] = this.oldData[i+2] = grey;
			return grey;
		},
		filterSobel: function (data, x, y, w, height, offset) {
			if (x === 0 || x === w - 1 || y === 0 || y === height - 1) {
				data[i] = data[i+1] = data[i+2] = 0;
			}
			var out = 0;
			var i = getIndex(x,y,w) + offset;
			var dx = this.oldData[i] - this.oldData[getIndex(x-1,y,w) + offset];
			var dy = this.oldData[i] - this.oldData[getIndex(x,y-1,w) + offset];
			var dxy = this.oldData[i] - this.oldData[getIndex(x-1,y-1,w) + offset];
			var dxy_ = this.oldData[i] - this.oldData[getIndex(x-1,y+1,w) + offset];
			var avg = (Math.abs(dx) + Math.abs(dy) + Math.abs(dxy) + Math.abs(dxy_)) / 4;
			return 1.0 * avg;
		}
	};

	function getIndex(x, y, width) {
		return (y * width + x) * 4;
	}

	Img2Amp.prototype = {
		getSlice: function(col, image, width, height) {
			var imageData = this.context.getImageData(0,0, this.canvas.width, this.canvas.height);
			var slice = [];
			for (var y = 0; y < this.canvas.height; y++) {
				slice[y] = this.getAmp(col, y, imageData.data, false);
			}
			slice.reverse();
			return slice;
		},
		getSlicePreview: function(col) {
			var imageData = this.context.getImageData(0,0, this.canvas.width, this.canvas.height);
			var slice = [];
			for (var y = 0; y < this.canvas.height; y++) {
				for (var x = 0; x < this.canvas.width; x++) {
					var amp = this.getAmp(x, y, imageData.data, true);
					if (x === col) {
						slice[y] = amp;
					}
				}
			}
			slice.reverse();
			this.context.putImageData(imageData, 0, 0);
			return slice;
		},
		getAmp: function (x, y, data, prev) {
			var i = this.getIndex(x, y),
			r = data[i],
			g = data[i+1],
			b = data[i+2];
			var a = 255-((r + g + b)/3);
			a = Math.max(a-threshold, 0);
			if (prev) {
				data[i] = data[i+1] = data[i+2] = a;
			}
			return a;
		}
	};

	return Img2Amp;

});