//===================Statistic==================
var Statistic = {
    createNew: function(dataset, n, m){
        var sta = {};
        sta.maxSize = 0;//so as to linear map
        sta.g0Min = 32767;
        sta.layers = new Array();
        sta.totalWeight = 0;
        for(var i = 0; i < n; i++){
            sta.layers.push(Layer.createNew(i, dataset[i], m));
            sta.totalWeight += sta.layers[i].weight;
        }

//------------------sorting------------------
        // sort by onset-time
        sta.layers.sort(function(a, b){
            if(a.minOnset == b.minOnset)
                return a.i - b.i;
            return a.minOnset - b.minOnset;
        });

        //add current layer to final layers according to weight
        var layersFinal = new Array();
        for(var i = 0; i < n; i ++){
            //accumulate halfListWeight
            var halfListWeight = 0;
            for(var j = 0; j < layersFinal.length/2; j++){
                halfListWeight += layersFinal[j].weight;
            }

            //add layer
            if(halfListWeight > sta.totalWeight/2){
                layersFinal.push(sta.layers[i]);
            }
            else layersFinal.unshift(sta.layers[i]);
        }


        sta.layers = layersFinal;


//------------------accumulation & calculate g0----------------------
        //two-dimensional array--pairInfo after accumulation
        sta.PairInfo = new Array(dataset.length);
        //temp array to record accumulation info
        sta.accTemp = new Array();
        //g0
        sta.g0 = new Array();

        for(var j = 0; j < m; j++){
            sta.accTemp[j] = 0;//initialize accTemp
            sta.g0[j] = 0;//initialize g0
        }

        //accumulation
        for(var i = 0; i < n; i++){
            //PairInfo for a item
            var itemPairInfo = new Array(m);

            for(var j = 0; j < m; j++){
                sta.accTemp[j] += (sta.layers[i]).data[j].y;
                itemPairInfo[j] = Pair.createNew((sta.layers[i]).data[j].x,
                                                sta.accTemp[j]);
            }
            sta.PairInfo[i] = itemPairInfo;
        }

        //calculate g0----(n-i+1)fi
        for(var i = 0; i < n; i++){
            for(var j = 0; j < m; j++){
                sta.g0[j] += (n - i) * (sta.layers[i]).data[j].y;
            }
        }

        //calculate g0-------- -(1/(n+1))*()
        //assign values to sumSize & g0Min
        var maxSum = 0;
        for(var j = 0; j < m; j++){
            sta.g0[j] = -(1/(n+1))* sta.g0[j];
            if(sta.g0[j] < sta.g0Min) sta.g0Min = sta.g0[j];

            var final = sta.accTemp[j] + sta.g0[j];//the thickness finally
            if(final > maxSum) maxSum = final;
        }
        sta.maxSize = maxSum - sta.g0Min;

        return sta;
    }
}


//==================Layer======================
var Layer = {
    createNew: function(i, data, m){
        var layer = {};
        layer.i = i;
        layer.data = data;
        layer.minOnset = 0;
        layer.weight = 0;

        //initialize minOnset
        for(var j = 0; j < m; j++){
            if(data[j].y > 0){
                layer.minOnset = j;
                break;
            }
        }

        //initialize weight-------sum of its values
        for(var j = 0; j < m; j++){
            layer.weight += data[j].y;
        }

        return layer;
    }
}

//==================Pair=======================
var Pair = {
    createNew: function(x, y){
        var pair = {};
        pair.x = x;
        pair.y = y;

        pair.update = function(x, y){
            pair.x = x;
            pair.y = y;
            return pair;
        }
        return pair;
    }
}


//==================Scale======================
var Scale = {
    createNew: function(valueMin, valueSize, scale_start, scale_size){
        var scale = {};
        scale.start = scale_start;
        scale.size = scale_size;
        scale.valueMin = valueMin;
        scale.valueSize = valueSize;
        scale.scaling = scale.size / scale.valueSize;

        //return linear mapping value
        scale.linearMap = function(value){
            var rtn = scale.scaling * (value - scale.valueMin) + scale.start;
            return rtn;
        }
        return scale;
    }
}

/* Inspired by Lee Byron's test data generator. */
function bumpLayer(n, layers) {

  function bump(a) {
    var x = 1 / (.1 + Math.random()),
        y = 2 * Math.random() - .5,
        z = 10 / (.1 + Math.random());
    for (var i = 0; i < n; i++) {
      var w = (i / n - y) * z;
      a[i] += x * Math.exp(-w * w);
    }
  }

  var a = [], i;
  for (i = 0; i < n; ++i) a[i] = 0;
  for (i = 0; i < 5; ++i) bump(a);
  layers.push(a.map(function(d, i) { return {x: i, y: Math.max(0, d)}; }));
  return a.map(function(d, i) { return {x: i, y: Math.max(0, d)}; });
}
