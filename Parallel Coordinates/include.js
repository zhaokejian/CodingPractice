//=====================data processing=======================
//transform csv to js object
function toArray(string, divide){
    var items = string.split(divide);
    var objectArray = new Array();
    var column = 0;
    for(var i = 0; i < items.length; i ++){
        if(i == 0){
            items[i] = items[i].split(',');
            column = items[i].length;
        }
        else{
            items[i] = items[i].split(',');
            var newObj = {};
            for(var j = 0; j < column; j ++){
                if(items[i][j] == '') items[i][j] = '0';
                newObj[items[0][j]] = parseFloat(items[i][j]);
            }
            objectArray.push(newObj);
            }
    }
    return objectArray;
}

//=================Scale & axis=========================
var Scale = {
    createNew: function(domainMin, domainMax, rangeMin, rangeMax){
        var scale = {};
        scale.domainMin = domainMin;
        scale.domainMax = domainMax;
        scale.rangeMin = rangeMin;
        scale.rangeMax = rangeMax;

        scale.scaling = (scale.rangeMax - scale.rangeMin) /
                        (scale.domainMax - scale.domainMin);

        //return linear mapping value
        scale.linearMap = function(value){
            var rtn = scale.scaling * (value - scale.domainMin) + scale.rangeMin;
            return rtn;
        }
        return scale;
    }
}

var Axis = {
    intervalTable : [0.1, 0.5, 1, 2, 5, 10, 20, 50, 100, 500, 1000],
    createNew: function(scale, tickMinSize){
        var axis = {};
        axis.scale = scale;
        axis.ticks = new Array();
        axis.interval = 0;

        for(var i = 0; i < Axis.intervalTable.length; i ++){
            if(Math.abs(axis.scale.linearMap(Axis.intervalTable[i])
                                - axis.scale.linearMap(0)) >= tickMinSize){
                axis.interval = Axis.intervalTable[i];
                break;
            }
            else{
                axis.interval = 1000;
            }
        }

        var domainMin = axis.scale.domainMin;
        var domainMax = axis.scale.domainMax;

        //min tick
        var min = domainMin;
        while(Math.floor(min / axis.interval) != min / axis.interval){
            if(axis.interval == 0.1 || axis.interval == 0.5) min += 0.1;
            else min += 1;
        }

        //interval
        var tickNow = min;
        while(true){
            if(axis.interval == 0.1 || axis.interval == 0.5){
                if(tickNow <= domainMax){
                    axis.ticks.push(tickNow.toFixed(1));
                }
                else break;
                tickNow += axis.interval;
            }
            else{
                if(tickNow <= domainMax){
                    axis.ticks.push(tickNow.toFixed(0));
                }
                else break;
                tickNow += axis.interval;
            }
        }

        return axis;
    }
}

function findMax(array){
    var max = -99999;
    for(var i = 0; i < array.length; i ++){
        if(array[i] > max) max = array[i];
    }
    return max;
}

function findMin(array){
    var min = 99999;
    for(var i = 0; i < array.length; i ++){
        if(array[i] < min) min = array[i];
    }
    return min;
}
