var WIDTH = 960, HEIGHT = 500;
var SPECIES = "name";
var N = 7;
var attrArray = new Array();
var TICKMINSIZE = 40;

function parallelCoord(dataArray){
    initialSVG("body", "svg");

    var speciesData = {};

    //initialize
    for(var s in dataArray[0]){
        speciesData[s] = new Array();
    }

    for(var i = 0; i < dataArray.length; i ++){
        for(var s in dataArray[i]){
            speciesData[s].push(dataArray[i][s]);
        }
    }

    var scales = {};
    var axises = {};

    for(var s in dataArray[0]){
        if(s != SPECIES){
            attrArray.push(s);
            scales[s] = Scale.createNew(findMin(speciesData[s]), findMax(speciesData[s]),
                                        460, 0);
            axises[s] = Axis.createNew(scales[s], 40);
        }
    }
    console.log(scales);
    console.log(axises);

//=============================draw=============================
    addGroup("svg", "main", 10, 30);

    //--------------------path----------------------
    //background & foreground
    var background = addGroup("main", "background", 0, 0).setAttribute("class", "background");
    var foreground = addGroup("main", "foreground", 0, 0).setAttribute("class", "foreground");
    for(var i = 0; i < dataArray.length; i ++){
        var path1 = document.createElementNS("http://www.w3.org/2000/svg","path");
        var path2 = document.createElementNS("http://www.w3.org/2000/svg","path");
        var d = '';

        for(var k = 0; k < attrArray.length; k ++){
            var attr = attrArray[k];
            var x = (WIDTH - 80) / (N - 1) * k + 40;
            var y = axises[attr].scale.linearMap(dataArray[i][attr]);
            if(k == 0){
                d += ('M' + x + ', ' + y);
            }
            else {
                d += ('L' + x + ', ' + y);
            }
        }
        path1.setAttribute('d', d);
        $('#background').append(path1);

        path2.setAttribute('d', d);
        path2.setAttribute('id', 'path' + i);
        $('#foreground').append(path2);
    }

    //----------------axis & scale------------------
    for(var i = 0; i < attrArray.length; i ++){
        var attr = attrArray[i];
        var dimension = addGroup("main", "dimension" + i, (WIDTH - 80) / (N - 1) * i + 40, 0);
        dimension.setAttribute("class", "dimension");

        //axis
        addGroup("dimension" + i, "axis" + i, 0, 0).setAttribute("class", "axis");
        for(var t = 0; t < axises[attr].ticks.length; t ++){
            var tickNow = addGroup("axis" + i, i + "-tick-" + t,
                                    0, axises[attr].scale.linearMap(axises[attr].ticks[t]));
                tickNow.setAttribute("class", "tick");
                tickNow.setAttribute("style", "opacity: 1;");

            //line
            var line = document.createElementNS("http://www.w3.org/2000/svg","line");
                line.setAttribute("y2", 0);
                line.setAttribute("x2", -6);
            $('#' + i + "-tick-" + t).append(line);

            //text
            var text = document.createElementNS("http://www.w3.org/2000/svg","text");
                text.setAttribute("id", i + "-tick-text-" + t)
                text.setAttribute("x", -9);
                text.setAttribute("y", 0);
                text.setAttribute("style", "text-anchor: end;");
                text.setAttribute("dy", ".32em");
            $('#' + i + "-tick-" + t).append(text);
            document.getElementById(i + "-tick-text-" + t).innerHTML = axises[attr].ticks[t];
        }
        var path = document.createElementNS("http://www.w3.org/2000/svg","path");
            path.setAttribute("class", "domain");
            path.setAttribute("d", "M-6,0H0V460H-6");
        $('#axis' + i).append(path);

        var text = document.createElementNS("http://www.w3.org/2000/svg","text");
            text.setAttribute('id', "axis-text-" + i);
            text.setAttribute('y', -9);
            text.setAttribute("text-anchor", "middle");
        $('#axis' + i).append(text);
        document.getElementById("axis-text-" + i).innerHTML = attr;

        //brush
        var brush = addGroup("dimension" + i, "brush" + i, 0, 0);
            brush.setAttribute("class", "brush");
            brush.setAttribute("style", "pointer-events: all;");

        //---background
        var background = document.createElementNS("http://www.w3.org/2000/svg","rect");
            background.setAttribute('class', 'background');
            background.setAttribute('width', 16);
            background.setAttribute('x', -8);
            background.setAttribute('height', 460);
            background.setAttribute('y', 0);
            background.setAttribute('style', 'visibility: hidden; cursor: crosshair;');
        $('#brush' + i).append(background);

        //---extent
        var extent = document.createElementNS("http://www.w3.org/2000/svg","rect");
            extent.setAttribute('class', 'extent');
            extent.setAttribute('width', 16);
            extent.setAttribute('x', -8);
            extent.setAttribute('height', 0);
            extent.setAttribute('y', 0);
        $('#brush' + i).append(extent);

        //---resize_n
        var resize_n = addGroup("brush" + i, "resize_n" + i, 0, 0);
            resize_n.setAttribute('class', 'resize n');
            resize_n.setAttribute('style', 'cursor: ns-resize; display: none;');
        $('#brush' + i).append(resize_n);

        //---resize_s
        var resize_s = addGroup("brush" + i, "resize_s" + i, 0, 0);
            resize_s.setAttribute('class', 'resize s');
            resize_s.setAttribute('style', 'cursor: ns-resize; display: none;');
        $('#brush' + i).append(resize_s);

        var rect1 = document.createElementNS("http://www.w3.org/2000/svg","rect");
            rect1.setAttribute('x', -8);
            rect1.setAttribute('y', -3);
            rect1.setAttribute('width', 16);
            rect1.setAttribute('height', 6);
        $('#resize_n' + i).append(rect1);

        var rect2 = document.createElementNS("http://www.w3.org/2000/svg","rect");
            rect2.setAttribute('x', -8);
            rect2.setAttribute('y', -3);
            rect2.setAttribute('width', 16);
            rect2.setAttribute('height', 6);
        $('#resize_s' + i).append(rect2);
    }

    interaction(dataArray, scales);
}

function interaction(dataArray, scales){
    var selectState = "up";
    var y1 = 0, y2 = 0, attrID = 0;

    var moveState = "up";
    var y0 = 0;

//------------------------mousedown-------------------------
    $('rect.background').mousedown(function(e){
        selectState = "down";

        y1 = e.pageY;
        attrID = parseInt($(this).parent().attr('id').substring(5));

        console.log(attrID);
    });

    $('.extent').mousedown(function(e){
        moveState = "down";

        y1 = e.pageY;
        attrID = parseInt($(this).parent().attr('id').substring(5));

        y0 = parseFloat($(this).attr('y'));
    });

//------------------------mousemove------------------------
    $(document).mousemove(function(e){
        if(selectState == "down"){
            y2 = e.pageY;

            if(y2 > 460) y2 = 460;
            if(y2 < 0) y2 = 0;

            selectArea(dataArray, scales, attrID, y1, y2);
        }
        if(moveState == "down"){
            y2 = e.pageY;

            var height = parseFloat($('#brush' + attrID).find('.extent').attr('height'));

            if((y0 - y1 + y2) < 0)  y2 = y1 - y0;
            if((y0 + height - y1 + y2) > 460) y2 = 460 - y0 - height + y1;

            selectArea(dataArray, scales, attrID, y0 - y1 + y2, y0 - y1 + y2 + height);
        }
    });

//------------------------mouseup---------------------------
    $(document).mouseup(function(e){
        if(selectState == "down"){
            selectState = "up";
            if(Math.abs(y1 - y2) < 1){
                console.log("no move");
                selectArea(dataArray, scales, attrID, 0, 0);
            }
        }
        else if(moveState == "down"){
            moveState = "up";
        }
        //refresh
        else{
            refresh(dataArray);
        }
    });
}

function selectArea(dataArray, scales, attrID, y1, y2){
    var y = Math.min(y1, y2),
        height = Math.abs(y1 - y2);

    $('#brush' + attrID).find('.extent').attr({
        'y': y,
        'height': height
    });

    changeResize(attrID);
    highlight(dataArray,scales);
}

function changeResize(attrID){
    var y = parseFloat($('#brush' + attrID).find('.extent').attr('y')),
        height = parseFloat($('#brush' + attrID).find('.extent').attr('height'));

    var y2 = y + height;

    $('#brush' + attrID).find('.n').attr('transform', 'translate(0, ' + y + ')');
    $('#brush' + attrID).find('.s').attr('transform', 'translate(0, ' + y2 + ')');
}

function highlight(dataArray, scales){
    highlightAll(dataArray);
    for(var i = 0; i < N; i ++){
        var attr = attrArray[i];
        var extent = $('#brush' + i).find('.extent');
        var y1 = parseFloat(extent.attr('y'));
        var y2 = y1 + parseFloat(extent.attr('height'));

        if((y2 - y1) > 0){
            for(var d = 0; d < dataArray.length; d ++){
                var y = scales[attr].linearMap(dataArray[d][attr]);
                if(y1 > y || y > y2){
                    $('#path' + d).attr('style', 'display: none;');
                }
            }
        }
    }
}

function highlightAll(dataArray){
    for(var d = 0; d < dataArray.length; d ++){
        $('#path' + d).attr('style', '');
    }
}

function refresh(dataArray){
    $('.extent').attr({
        'y': 0,
        'height': 0
    });
    highlightAll(dataArray);
}

function initialSVG(parentName, svgID){
    var svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
        svg.setAttribute("id", svgID);
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("version", "1.1");
        svg.setAttribute("width", WIDTH);
        svg.setAttribute("height", HEIGHT);

        $(parentName).append(svg);

    return svgID;
}

function addGroup(parentId, groupID, translateX, translateY){
    var g = document.createElementNS("http://www.w3.org/2000/svg","g");
        g.setAttribute("id", groupID);
        g.setAttribute("transform", "translate(" + translateX + "," + translateY + ")");

        $('#' + parentId).append(g);

    return g;
}
