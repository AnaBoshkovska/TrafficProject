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


        var pixels = {};
        var red;
        var green;
        var blue;

        var rp = 0;
        var op = 0;
        var gp = 0;
        var vp = 0;

        for(var key in data){
            red = data[key][0];
            green = data[key][1];
            blue = data[key][2];
            if(pixels[red + "," + green + "," + blue] === undefined)
                pixels[red + "," + green + "," + blue] = 0;
            pixels[red + "," + green + "," + blue]++;
        }
        for(var key in pixels){
            var colors = key.split(',');
            red = parseInt(colors[0]);
            green = parseInt(colors[1]);
            blue = parseInt(colors[2]);

            if(red<234 && red>228 && green<5 && green>-1 && blue<5 && blue<-1)
                rp+= parseInt(pixels[key]);
            if(red<135 && red>128 && green>198 && green<204 && blue>77 && blue<83)
                gp+= parseInt(pixels[key]);
            if(red>235 && red<243 && green>120 && green<127 && blue<5 && blue>-1)
                op+= parseInt(pixels[key]);
            if(red>153 && red<155 && green>15 && green<24 && blue>15 && blue<24)
                vp+= parseInt(pixels[key]);
        }
        console.log(pixels);
        var sum = rp + gp + op + vp;
        quant.pixels = {};
        quant.pixels.red = rp/sum * 100;
        quant.pixels.red = Math.round( quant.pixels.red * 10 ) / 10;
        quant.pixels.green = gp/sum * 100;
        quant.pixels.green = Math.round( quant.pixels.green * 10 ) / 10;
        quant.pixels.orange = op/sum * 100;
        quant.pixels.orange = Math.round( quant.pixels.orange * 10 ) / 10;
        quant.pixels.violet = vp/sum * 100;
        quant.pixels.violet = Math.round( quant.pixels.violet * 10 ) / 10;

    }
    return quant;
}]);