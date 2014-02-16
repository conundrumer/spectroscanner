define (function () {
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
            var i = y * this.canvas.width + x * 4;
            return (data[i] + data[i+1] + data[i+2])*(data[i] + data[i+1] + data[i+2]);
        }
    }

    return Img2Amp;

});