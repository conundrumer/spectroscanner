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
            return slice;
        },
        getAmp: function (x, y, data) {
            var i = (this.canvas.height - y) * this.canvas.width + x,
            r = data[i],
            g = data[i+1],
            b = data[i+2];
            return Math.max((255-((r + g + b)/3))-threshold, 0);
        }
    };

    return Img2Amp;

});