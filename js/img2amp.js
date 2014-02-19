define (function () {
    var threshold = 100;
    function Img2Amp (canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
    }

    Img2Amp.prototype = {
        getSlice: function(col) {
            var imageData = this.context.getImageData(0,0, this.canvas.width, this.canvas.height);
            var slice = [];
            for (var y = 0; y < this.canvas.height; y++) {
                slice[y] = this.getAmp(col, y, imageData.data);
            }
            slice.reverse();
            // this.context.putImageData(imageData, 0, 0);
            return slice;
        },
        getAmp: function (x, y, data) {
            var i = this.getIndex(x, y),
            r = data[i],
            g = data[i+1],
            b = data[i+2];
            var a = 255-((r + g + b)/3);
            // data[i] = data[i+1] = data[i+2] = a;
            return Math.max(a-threshold, 0);
        },
        getIndex: function(x, y) {
            return (y * this.canvas.width + x) * 4;
        }
    };

    return Img2Amp;

});