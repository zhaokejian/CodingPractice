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
                newObj[items[0][j]] = items[i][j];
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
    createNew: function(scale, tickMinSize){
        var axis = {};
        axis.scale = scale;
        axis.ticks = new Array();
        axis.interval = 0.5;

        if(scale.linearMap(0.5) < tickMinSize){
            axis.interval = 1;
        }

        var domainMin = axis.scale.domainMin;
        var domainMax = axis.scale.domainMax;

        //min tick
        var Min = Math.ceil(domainMin);
        if(axis.interval == 0.5){
            if(domainMin < (Min - 0.5)){
                axis.ticks.push((Min - 0.5).toFixed(1));
                axis.ticks.push(Min.toFixed(1));
            }
            else{
                axis.ticks.push(Min.toFixed(1));
            }
        }
        else{
            if(domainMin < (Min - 1)){
                axis.ticks.push((Min - 1).toFixed(0));
                axis.ticks.push(Min.toFixed(0));
            }
            else{
                axis.ticks.push(Min.toFixed(0));
            }
        }

        //interval
        var tickNow = Min;
        while(true){
            if(axis.interval == 0.5){
                tickNow += 0.5;
                if(tickNow <= domainMax){
                    axis.ticks.push(tickNow.toFixed(1));
                }
                else break;
            }
            else{
                tickNow += 1;
                if(tickNow <= domainMax){
                    axis.ticks.push(tickNow.toFixed(0));
                }
                else break;
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
