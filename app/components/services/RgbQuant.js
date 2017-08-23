/**
 * Created by Ljubica on 22.8.2017.
 */
angular.module('trafficApp').factory('rgbQuantService', ['$q',function ($q) {
    var quant = {};
    quant.quantize = function (canvas) {
        var opts = {
            colors: 256,             // desired palette size
            method: 2,               // histogram method, 2: min-population threshold within subregions; 1: global top-population
            boxSize: [64, 64],        // subregion dims (if method = 2)
            boxPxls: 2,              // min-population threshold (if method = 2)
            initColors: 4096,        // # of top-occurring colors  to start with (if method = 1)
            minHueCols: 0,           // # of colors per hue group to evaluate regardless of counts, to retain low-count hues
            dithKern: null,          // dithering kernel name, see available kernels in docs below
            dithDelta: 0,            // dithering threshhold (0-1) e.g: 0.05 will not dither colors with <= 5% difference
            dithSerp: false,         // enable serpentine pattern dithering
            palette: [],             // a predefined palette to start with in r,g,b tuple format: [[r,g,b],[r,g,b]...]
            reIndex: false,          // affects predefined palettes only. if true, allows compacting of sparsed palette once target palette size is reached. also enables palette sorting.
            useCache: true,          // enables caching for perf usually, but can reduce perf in some cases, like pre-def palettes
            cacheFreq: 10,           // min color occurance count needed to qualify for caching
            colorDist: "euclidean"  // method used to determine color distance, can also be "manhattan"
        };

        var q = new RgbQuant(opts);

// analyze histograms
        q.sample(canvas);

// reduce images
        var out = q.reduce(canvas);
        quant.data = out;

    };
    quant.countTrafficPixels = function(){
        var data = quant.data;

        var crvena = 0;
        var zelena = 0;
        var por = 0;
        var violet = 0;

        var pixels = {};
        var red;
        var green;
        var blue;
        for(var i = 0; i<data.length; i+=3){
            red = data[i];
            green = data[i+1];
            blue = data[i+2];
            if(pixels[red + "," + green + "," + blue] === undefined)
                pixels[red + "," + green + "," + blue] = 0;
            pixels[red + "," + green + "," + blue]++;
            if(red > 220 && red < 256 && green > -1 && green < 15 && blue > -1 && blue < 15){
                crvena++;
            }
            if(red > 220 && red < 256  && green > 100 && green < 150 && blue > 0 && blue <50){
                por++;
            }
            if(red > 0 && red < 150  && green > 220 && green < 256 && blue > 0 && blue <100){
                zelena++;
            }
        }

        for(var key in data){
            var parsed = key.split(',');
            var red = parsed[0];
            var green = parsed[1];
            var blue = parsed[2];

            if(red > 220 && red < 240 && green > -1 && green < 40 && blue > -1 && blue < 40){
                crvena+=data[key];
            }
            if(red > 230 && red < 250  && green > 110 && green < 130 && blue > -1 && blue <20){
                por+=data[key];
            }

            if(red > 120 && red < 140  && green > 190 && green < 210 && blue > 70 && blue <90){
                zelena+=data[key];
            }
            if(red > 150 && red < 170  && green > 10 && green < 30 && blue > 10 && blue <30){
                violet+=data[key];
            }
        }
        var sum = crvena + zelena + por + violet;
        quant.pixels = {};
        quant.pixels.red = crvena/sum * 100;
        quant.pixels.red = Math.round( quant.pixels.red * 10 ) / 10;
        quant.pixels.green = zelena/sum * 100;
        quant.pixels.green = Math.round( quant.pixels.green * 10 ) / 10;
        quant.pixels.orange = por/sum * 100;
        quant.pixels.orange = Math.round( quant.pixels.orange * 10 ) / 10;
        quant.pixels.violet = violet/sum * 100;
        quant.pixels.violet = Math.round( quant.pixels.violet * 10 ) / 10;

    }
    return quant;
}]);