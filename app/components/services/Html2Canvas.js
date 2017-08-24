/**
 * Created by Ljubica on 22.8.2017.
 */
angular.module('trafficApp').service('html2CanvasService', ['rgbQuantService', '$q', function (rgbQuantService, $q) {
    var converted = {};
    var deffered = $q.defer();
    this.html2canvas = function (selector) {
        var scrollPos = document.body.scrollTop;
        html2canvas(document.getElementById(selector), {
            useCORS: true,
            onrendered: function (canvas) {
                Canvas2Image.convertToPNG(canvas, canvas.width, canvas.height);
                var context = canvas.getContext("2d");
                var imageObj = new Image();
                imageObj.src = canvas;
                imageObj.onload = function () {
                    context.drawImage(imageObj, 0, 0);
                };
                converted.canvas = canvas;
                document.getElementById("map").appendChild(canvas);
                rgbQuantService.quantize(canvas);
                rgbQuantService.countTrafficPixels();
                deffered.resolve(rgbQuantService.pixels);
            }
        });
        return deffered.promise;
    };

}]);