var SIZE = 140, PADDING = 10;
var WIDTH = 1280, HEIGHT = 800;
var N = 4;
var SPECIES = "species";
var attrArray = new Array();

function scatterPlot(dataArray, parentId){
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
    console.log(speciesData);
    console.log(dataArray);

//=====================draw================
    addGroup("svg", "main", 359.5, 69.5);
    //----------------legend------------------------
    var nowSpecies = "", tempSpecies = "", k = 0;

    for(var i = 0; i < speciesData[SPECIES].length; i ++){
        tempSpecies = speciesData[SPECIES][i];
        if(tempSpecies != nowSpecies){
            nowSpecies = tempSpecies;
            var legendGroup = addGroup("main", "legend" + k, -179, k * 20 + 594);
            legendGroup.setAttribute("class", "legend");

            var circle = document.createElementNS("http://www.w3.org/2000/svg","circle");
                circle.setAttribute("class", nowSpecies);
                circle.setAttribute("r", 3);
            $('#' + "legend" + k).append(circle);

            var text = document.createElementNS("http://www.w3.org/2000/svg","text");
                text.setAttribute("x", 12);
                text.setAttribute("dy", ".31em");
                text.setAttribute("id", "text-legend" + k);
            $('#' + "legend" + k).append(text);
            document.getElementById("text-legend" + k).innerHTML = "Iris " + nowSpecies;

            k ++;
        }
    }

    //----------------axis & scale------------------
    var scales = {};
    var axises = {};

    for(var s in dataArray[0]){
        if(s != SPECIES){
            scales[s] = Scale.createNew(findMin(speciesData[s]), findMax(speciesData[s]),
                                        PADDING / 2, SIZE - PADDING / 2);
            axises[s] = Axis.createNew(scales[s], 20);
        }
    }
    console.log(scales);
    console.log(axises);

    //x axis
    var x = 0;
    var n = 0;
    for(var s in axises){
        var axisGroup = addGroup("main", n + "-X-axis", x, 0);
        axisGroup.setAttribute("class", "x axis");
        for(var i = 0; i < axises[s].ticks.length; i ++){
            var tempGroup = addGroup(n + "-X-axis", n + "-X-axis-tick" + i,
                    axises[s].scale.linearMap(axises[s].ticks[i]), 0);
            tempGroup.setAttribute("style", "opacity: 1");

            //line
            var line = document.createElementNS("http://www.w3.org/2000/svg","line");
                line.setAttribute("class", "tick");
                line.setAttribute("x2", 0);
                line.setAttribute("y2", SIZE * N);

            $('#' + n + "-X-axis-tick" + i).append(line);

            //text
            var text = document.createElementNS("http://www.w3.org/2000/svg","text");
                text.setAttribute("id", n + "X-text" + i);
                text.setAttribute("x", 0);
                text.setAttribute("y", SIZE * N + 3);
                text.setAttribute("dy", ".71em");
                text.setAttribute("text-anchor", "middle");

            $('#' + n + "-X-axis-tick" + i).append(text);
            document.getElementById(n + "X-text" + i).innerHTML = axises[s].ticks[i];

        }
        x += SIZE;
        n ++;
    }

    //y axis
    var y = 0;
    var n = 0;
    for(var s in axises){
        var axisGroup = addGroup("main", n + "-Y-axis", 0, y);
        axisGroup.setAttribute("class", "y axis");
        for(var i = (axises[s].ticks.length - 1); i >= 0; i --){
            var tempGroup = addGroup(n + "-Y-axis", n + "-Y-axis-tick" + i,
                    0, SIZE - axises[s].scale.linearMap(axises[s].ticks[i]));
            tempGroup.setAttribute("style", "opacity: 1");

            //line
            var line = document.createElementNS("http://www.w3.org/2000/svg","line");
                line.setAttribute("class", "tick");
                line.setAttribute("x2", SIZE * N);
                line.setAttribute("y2", 0);

            $('#' + n + "-Y-axis-tick" + i).append(line);

            //text
            var text = document.createElementNS("http://www.w3.org/2000/svg","text");
                text.setAttribute("id", n + "Y-text" + i);
                text.setAttribute("x", SIZE * N + 3);
                text.setAttribute("y", 0);
                text.setAttribute("dy", ".32em");
                text.setAttribute("text-anchor", "start");

            $('#' + n + "-Y-axis-tick" + i).append(text);
            document.getElementById(n + "Y-text" + i).innerHTML = axises[s].ticks[i];

        }
        y += SIZE;
        n ++;
    }

    //------------------cell-----------------------
    var x = 0, y = 0, k = 0;
    for(var sX in dataArray[0]){
        if(sX != SPECIES){
            attrArray.push(sX);
            y = 0;
            for(var sY in dataArray[0]){
                if(sY != SPECIES){//a cell
                    var cellGroup = addGroup("main", "cell" + k, x, y);
                    cellGroup.setAttribute("class", "cell");

                    //rect
                    var rect = document.createElementNS("http://www.w3.org/2000/svg","rect");
                        rect.setAttribute("class", "frame");
                        rect.setAttribute("x", PADDING / 2);
                        rect.setAttribute("y", PADDING / 2);
                        rect.setAttribute("width", SIZE - PADDING);
                        rect.setAttribute("height", SIZE - PADDING);
                    $('#cell' + k).append(rect);

                    //circle
                    for(var i = 0; i < dataArray.length; i ++){
                        var circle = document.createElementNS("http://www.w3.org/2000/svg","circle");
                            circle.setAttribute("class", dataArray[i][SPECIES] + " circle" + i);
                            circle.setAttribute("cx", scales[sX].linearMap(dataArray[i][sX]));
                            circle.setAttribute("cy", SIZE - scales[sY].linearMap(dataArray[i][sY]));
                            circle.setAttribute("r", 3);
                        $('#cell' + k).append(circle);
                    }

                    //interaction
                    var background = document.createElementNS("http://www.w3.org/2000/svg","rect");
                        background.setAttribute("class", "background");
                        background.setAttribute("x", PADDING / 2);
                        background.setAttribute("y", PADDING / 2);
                        background.setAttribute("width", 130);
                        background.setAttribute("height", 130);
                        background.setAttribute("style", "visibility: hidden; pointer-events: all; cursor: crosshair;");
                    $('#cell' + k).append(background);

                    var extent = document.createElementNS("http://www.w3.org/2000/svg","rect");
                        extent.setAttribute("class", "extent");
                        extent.setAttribute("x", 0);
                        extent.setAttribute("y", 0);
                        extent.setAttribute("width", 0);
                        extent.setAttribute("height", 0);
                        extent.setAttribute("style", "cursor: move;");
                    $('#cell' + k).append(extent);

                    //resize
                    var resize_n = document.createElementNS("http://www.w3.org/2000/svg","rect");
                        resize_n.setAttribute("class", "n resize");
                        resize_n.setAttribute("width", 0);
                        resize_n.setAttribute("height", 6);
                        resize_n.setAttribute("x", -3);
                        resize_n.setAttribute("y", -3);
                        resize_n.setAttribute("style", "visibility: hidden; pointer-events: all; cursor: ns-resize;");
                    $('#cell' + k).append(resize_n);

                    var resize_e = document.createElementNS("http://www.w3.org/2000/svg","rect");
                        resize_e.setAttribute("class", "resize e");
                        resize_e.setAttribute("width", 6);
                        resize_e.setAttribute("height", 0);
                        resize_e.setAttribute("x", -3);
                        resize_e.setAttribute("y", -3);
                        resize_e.setAttribute("style", "visibility: hidden; pointer-events: all; cursor: ew-resize;");
                    $('#cell' + k).append(resize_e);

                    var resize_s = document.createElementNS("http://www.w3.org/2000/svg","rect");
                        resize_s.setAttribute("class", "resize s");
                        resize_s.setAttribute("width", 0);
                        resize_s.setAttribute("height", 6);
                        resize_s.setAttribute("x", 3);
                        resize_s.setAttribute("y", -3);
                        resize_s.setAttribute("style", "visibility: hidden; pointer-events: all; cursor: ns-resize;");
                    $('#cell' + k).append(resize_s);

                    var resize_w = document.createElementNS("http://www.w3.org/2000/svg","rect");
                        resize_w.setAttribute("class", "resize w");
                        resize_w.setAttribute("width", 6);
                        resize_w.setAttribute("height", 0);
                        resize_w.setAttribute("x", -3);
                        resize_w.setAttribute("y", 3);
                        resize_w.setAttribute("style", "visibility: hidden; pointer-events: all; cursor: ew-resize;");
                    $('#cell' + k).append(resize_w);

                    var resize_nw = document.createElementNS("http://www.w3.org/2000/svg","rect");
                        resize_nw.setAttribute("class", "resize nw");
                        resize_nw.setAttribute("width", 6);
                        resize_nw.setAttribute("height", 6);
                        resize_nw.setAttribute("x", -3);
                        resize_nw.setAttribute("y", -3);
                        resize_nw.setAttribute("style", "visibility: hidden; pointer-events: all; cursor: nwse-resize;");
                    $('#cell' + k).append(resize_nw);

                    var resize_ne = document.createElementNS("http://www.w3.org/2000/svg","rect");
                        resize_ne.setAttribute("class", "resize ne");
                        resize_ne.setAttribute("width", 6);
                        resize_ne.setAttribute("height", 6);
                        resize_ne.setAttribute("x", -3);
                        resize_ne.setAttribute("y", -3);
                        resize_ne.setAttribute("style", "visibility: hidden; pointer-events: all; cursor: nesw-resize;");
                    $('#cell' + k).append(resize_ne);

                    var resize_se = document.createElementNS("http://www.w3.org/2000/svg","rect");
                        resize_se.setAttribute("class", "resize se");
                        resize_se.setAttribute("width", 6);
                        resize_se.setAttribute("height", 6);
                        resize_se.setAttribute("x", -3);
                        resize_se.setAttribute("y", -3);
                        resize_se.setAttribute("style", "visibility: hidden; pointer-events: all; cursor: nwse-resize;");
                    $('#cell' + k).append(resize_se);

                    var resize_sw = document.createElementNS("http://www.w3.org/2000/svg","rect");
                        resize_sw.setAttribute("class", "resize sw");
                        resize_sw.setAttribute("width", 6);
                        resize_sw.setAttribute("height", 6);
                        resize_sw.setAttribute("x", -3);
                        resize_sw.setAttribute("y", -3);
                        resize_sw.setAttribute("style", "visibility: hidden; pointer-events: all; cursor: nesw-resize;");
                    $('#cell' + k).append(resize_sw);

                    //text
                    if(sX == sY){
                        var text = document.createElementNS("http://www.w3.org/2000/svg","text");
                            text.setAttribute("id", "text-cell" + k);
                            text.setAttribute("x", 10);
                            text.setAttribute("y", 10);
                            text.setAttribute("dy", ".71em");
                        $('#cell' + k).append(text);
                        document.getElementById("text-cell" + k).innerHTML = sX;
                    }

                    k ++;
                    y += SIZE;
                }
            }
            x += SIZE;
        }
    }

    interaction(dataArray);
}

function interaction(dataArray){
    var cellId = -1, cellX = -1, cellY = -1, x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    //----------------------mousedown------------------------
    //select Area
    var selectState = "up";
    $('.background').mousedown(function(e){
        noHighlight(dataArray);
        x1 = e.pageX - 359.5;
        y1 = e.pageY - 69.5;

        cellX = Math.floor(x1 / SIZE);
        cellY = Math.floor(y1 / SIZE);
        cellId = cellX * N + cellY;

        selectState = "down";
    });

    //resize
    var resizeN = "up", resizeE = "up", resizeS = "up", resizeW = "up",
        resizeNW = "up", resizeNE = "up", resizeSE = "up", resizeSW = "up";
    $('.n').mousedown(function(e){
        x1 = e.pageX - 359.5;
        y1 = e.pageY - 69.5;

        cellX = Math.floor(x1 / SIZE);
        cellY = Math.floor(y1 / SIZE);
        cellId = cellX * N + cellY;
        resizeN = "down";
    });
    $('.s').mousedown(function(e){
        x1 = e.pageX - 359.5;
        y1 = e.pageY - 69.5;

        cellX = Math.floor(x1 / SIZE);
        cellY = Math.floor(y1 / SIZE);
        cellId = cellX * N + cellY;
        resizeS = "down";
    });
    $('.w').mousedown(function(e){
        x1 = e.pageX - 359.5;
        y1 = e.pageY - 69.5;

        cellX = Math.floor(x1 / SIZE);
        cellY = Math.floor(y1 / SIZE);
        cellId = cellX * N + cellY;
        resizeW = "down";
    });
    $('.e').mousedown(function(e){
        x1 = e.pageX - 359.5;
        y1 = e.pageY - 69.5;

        cellX = Math.floor(x1 / SIZE);
        cellY = Math.floor(y1 / SIZE);
        cellId = cellX * N + cellY;
        resizeE = "down";
    });
    $('.nw').mousedown(function(e){
        x1 = e.pageX - 359.5;
        y1 = e.pageY - 69.5;

        cellX = Math.floor(x1 / SIZE);
        cellY = Math.floor(y1 / SIZE);
        cellId = cellX * N + cellY;
        resizeNW = "down";
    });
    $('.ne').mousedown(function(e){
        x1 = e.pageX - 359.5;
        y1 = e.pageY - 69.5;

        cellX = Math.floor(x1 / SIZE);
        cellY = Math.floor(y1 / SIZE);
        cellId = cellX * N + cellY;
        resizeNE = "down";
    });
    $('.se').mousedown(function(e){
        x1 = e.pageX - 359.5;
        y1 = e.pageY - 69.5;

        cellX = Math.floor(x1 / SIZE);
        cellY = Math.floor(y1 / SIZE);
        cellId = cellX * N + cellY;
        resizeSE = "down";
    });
    $('.sw').mousedown(function(e){
        x1 = e.pageX - 359.5;
        y1 = e.pageY - 69.5;

        cellX = Math.floor(x1 / SIZE);
        cellY = Math.floor(y1 / SIZE);
        cellId = cellX * N + cellY;
        resizeSW = "down";
    });
    //move area
    var moveState = "up";
    var x0, y0, width0, height0;
    $('.extent').mousedown(function(e){
        x0 = parseFloat($(this).attr("x"));
        y0 = parseFloat($(this).attr("y"));
        width0 = parseFloat($(this).attr("width"));
        height0 = parseFloat($(this).attr("height"));

        x1 = e.pageX - 359.5;
        y1 = e.pageY - 69.5;

        cellX = Math.floor(x1 / SIZE);
        cellY = Math.floor(y1 / SIZE);
        cellId = cellX * N + cellY;
        moveState = "down";

        console.log("cellX: " + cellX + ", cellY: " + cellY);
    });


    //---------------------mousemove---------------------
    $(document).mousemove(function(e){
        //select area
        if(selectState == "down"){
            x2 = e.pageX - 359.5;
            y2 = e.pageY - 69.5;

            if(x2 < (cellX * SIZE + PADDING / 2)) x2 = cellX * SIZE + PADDING / 2;
            if(x2 > ((cellX + 1) * SIZE - PADDING / 2)) x2 = ((cellX + 1) * SIZE - PADDING / 2);

            if(y2 < (cellY * SIZE + PADDING / 2)) y2 = cellY * SIZE + PADDING / 2;
            if(y2 > ((cellY + 1) * SIZE - PADDING / 2)) y2 = (cellY + 1) * SIZE - PADDING / 2;


            selectArea(dataArray, cellId, x1, y1, x2, y2);
        }

        //resize
        else if(resizeN == "down"){
            var translateX = Math.floor(cellId / N) * SIZE,
                translateY = cellId % N * SIZE;

            var x = parseFloat($('#cell' + cellId).find('.extent').attr('x')) + translateX,
                y = parseFloat($('#cell' + cellId).find('.extent').attr('y')) + translateY,
                width = parseFloat($('#cell' + cellId).find('.extent').attr('width')),
                height = parseFloat($('#cell' + cellId).find('.extent').attr('height'));

            y2 = e.pageY - 69.5;

            if(y2 > (y + height)){
                resizeN = "up";
                resizeS = "down";
            }
            else{
                if(y2 < (cellY * SIZE + PADDING / 2)) y2 = cellY * SIZE + PADDING / 2;
                selectArea(dataArray, cellId, x + width, y + height, x, y2);
                changeResize(cellId);
            }
        }
        else if (resizeS == "down") {
            var translateX = Math.floor(cellId / N) * SIZE,
                translateY = cellId % N * SIZE;

            var x = parseFloat($('#cell' + cellId).find('.extent').attr('x')) + translateX,
                y = parseFloat($('#cell' + cellId).find('.extent').attr('y')) + translateY,
                width = parseFloat($('#cell' + cellId).find('.extent').attr('width')),
                height = parseFloat($('#cell' + cellId).find('.extent').attr('height'));

            y2 = e.pageY - 69.5;

            if(y2 < y){
                resizeS = "up";
                resizeN = "down";
            }
            else{
                if(y2 > ((cellY + 1) * SIZE - PADDING / 2)) y2 = (cellY + 1) * SIZE - PADDING / 2;
                selectArea(dataArray, cellId, x, y, x + width, y2);
                changeResize(cellId);
            }
        }
        else if (resizeE == "down") {
            var translateX = Math.floor(cellId / N) * SIZE,
                translateY = cellId % N * SIZE;

            var x = parseFloat($('#cell' + cellId).find('.extent').attr('x')) + translateX,
                y = parseFloat($('#cell' + cellId).find('.extent').attr('y')) + translateY,
                width = parseFloat($('#cell' + cellId).find('.extent').attr('width')),
                height = parseFloat($('#cell' + cellId).find('.extent').attr('height'));

            x2 = e.pageX - 359.5;

            if(x2 < x){
                resizeE = "up";
                resizeW = "down";
            }
            else{
                if(x2 > ((cellX + 1) * SIZE - PADDING / 2)) x2 = (cellX + 1) * SIZE - PADDING / 2;
                selectArea(dataArray, cellId, x, y, x2, y + height);
                changeResize(cellId);
            }
        }
        else if (resizeW == "down") {
            var translateX = Math.floor(cellId / N) * SIZE,
                translateY = cellId % N * SIZE;

            var x = parseFloat($('#cell' + cellId).find('.extent').attr('x')) + translateX,
                y = parseFloat($('#cell' + cellId).find('.extent').attr('y')) + translateY,
                width = parseFloat($('#cell' + cellId).find('.extent').attr('width')),
                height = parseFloat($('#cell' + cellId).find('.extent').attr('height'));

            x2 = e.pageX - 359.5;

            if(x2 > (x + width)){
                resizeW = "up";
                resizeE = "down";
            }
            else{
                if(x2 < (cellX * SIZE + PADDING / 2)) x2 = cellX * SIZE + PADDING / 2;
                selectArea(dataArray, cellId, x2, y, x + width, y + height);
                changeResize(cellId);
            }
        }
        else if (resizeNW == "down") {
            var translateX = Math.floor(cellId / N) * SIZE,
                translateY = cellId % N * SIZE;

            var x = parseFloat($('#cell' + cellId).find('.extent').attr('x')) + translateX,
                y = parseFloat($('#cell' + cellId).find('.extent').attr('y')) + translateY,
                width = parseFloat($('#cell' + cellId).find('.extent').attr('width')),
                height = parseFloat($('#cell' + cellId).find('.extent').attr('height'));

            x2 = e.pageX - 359.5;
            y2 = e.pageY - 69.5;

            if(x2 > (x + width) && y2 > (y + height)){
                resizeNW = "up";
                resizeSE = "down";
            }
            else{
                if(x2 < (cellX * SIZE + PADDING / 2)){
                    x2 = cellX * SIZE + PADDING / 2;
                    console.log("flag");
                }
                if(y2 < (cellY * SIZE + PADDING / 2)) y2 = cellY * SIZE + PADDING / 2;
                selectArea(dataArray, cellId, x2, y2, x + width, y + height);
                changeResize(cellId);
            }
        }
        else if (resizeSE == "down") {
            var translateX = Math.floor(cellId / N) * SIZE,
                translateY = cellId % N * SIZE;

            var x = parseFloat($('#cell' + cellId).find('.extent').attr('x')) + translateX,
                y = parseFloat($('#cell' + cellId).find('.extent').attr('y')) + translateY,
                width = parseFloat($('#cell' + cellId).find('.extent').attr('width')),
                height = parseFloat($('#cell' + cellId).find('.extent').attr('height'));
            x2 = e.pageX - 359.5;
            y2 = e.pageY - 69.5;

            if(x2 < x && y2 < y){
                resizeSE = "up";
                resizeNW = "down";
            }
            else{
                if(x2 > ((cellX + 1) * SIZE - PADDING / 2)) x2 = (cellX + 1) * SIZE - PADDING / 2;
                if(y2 > ((cellY + 1) * SIZE - PADDING / 2)) y2 = (cellY + 1) * SIZE - PADDING / 2;
                selectArea(dataArray, cellId, x, y, x2, y2);
                changeResize(cellId);
            }
        }
        else if (resizeSW == "down") {
            var translateX = Math.floor(cellId / N) * SIZE,
                translateY = cellId % N * SIZE;

            var x = parseFloat($('#cell' + cellId).find('.extent').attr('x')) + translateX,
                y = parseFloat($('#cell' + cellId).find('.extent').attr('y')) + translateY,
                width = parseFloat($('#cell' + cellId).find('.extent').attr('width')),
                height = parseFloat($('#cell' + cellId).find('.extent').attr('height'));

            x2 = e.pageX - 359.5;
            y2 = e.pageY - 69.5;

            if(x2 > (x + width) && y2 < y){
                resizeSW = "up";
                resizeNE = "down";
            }
            else{
                if(x2 < (cellX * SIZE + PADDING / 2)) x2 = cellX * SIZE + PADDING / 2;
                if(y2 > ((cellY + 1) * SIZE - PADDING / 2)) y2 = (cellY + 1) * SIZE - PADDING / 2;
                selectArea(dataArray, cellId, x2, y, x + width, y2);
                changeResize(cellId);
            }
        }
        else if (resizeNE == "down") {
            var translateX = Math.floor(cellId / N) * SIZE,
                translateY = cellId % N * SIZE;

            var x = parseFloat($('#cell' + cellId).find('.extent').attr('x')) + translateX,
                y = parseFloat($('#cell' + cellId).find('.extent').attr('y')) + translateY,
                width = parseFloat($('#cell' + cellId).find('.extent').attr('width')),
                height = parseFloat($('#cell' + cellId).find('.extent').attr('height'));

            x2 = e.pageX - 359.5;
            y2 = e.pageY - 69.5;

            if(x2 < x && y2 > (y + height)){
                resizeNE = "up";
                resizeSW = "down";
            }
            else{
                if(y2 < (cellY * SIZE + PADDING / 2)) y2 = cellY * SIZE + PADDING / 2;
                if(x2 > ((cellX + 1) * SIZE - PADDING / 2)) x2 = (cellX + 1) * SIZE - PADDING / 2;
                selectArea(dataArray, cellId, x, y2, x2, y + height);
                changeResize(cellId);
            }
        }

        //move area
        else if (moveState == "down") {
            x2 = e.pageX - 359.5;
            y2 = e.pageY - 69.5;

            if((x0 - x1 + x2) < (PADDING / 2))
                x2 = PADDING / 2 - x0 + x1;
            if((x0 + width0 - x1 + x2) > (SIZE - PADDING / 2))
                x2 = SIZE - PADDING / 2 - x0 + x1 - width0;

            if((y0 - y1 + y2) < (PADDING / 2))
                y2 = PADDING / 2 - y0 + y1;
            if((y0 + height0 - y1 + y2) > (SIZE - PADDING / 2))
                y2 = SIZE - PADDING / 2 - y0 + y1 - height0;

            moveArea(dataArray, cellId, x0, y0, x1, y1, x2, y2);
        }
    });


    //-------------------------mouseup----------------------------
    $(document).mouseup(function(e){
        x2 = e.pageX - 359.5;
        y2 = e.pageY - 69.5;

        //select area
        if(selectState == "down"){
            changeResize(cellId);
            selectState = "up";
            if(Math.abs(x1 - x2) < 1 && Math.abs(y1 - y2) < 1){
                console.log("no move");
                selectArea(dataArray, cellId, 0, 0, 0, 0);
                changeResize(cellId);
                highlightAll(dataArray);
            }
        }

        //resize
        if(resizeN == "down"){ resizeN = "up"; }
        if(resizeE == "down"){ resizeE = "up"; }
        if(resizeS == "down"){ resizeS = "up"; }
        if(resizeW == "down"){ resizeW = "up"; }
        if(resizeNW == "down"){ resizeNW = "up"; }
        if(resizeNE == "down"){ resizeNE = "up"; }
        if(resizeSE == "down"){ resizeSE = "up"; }
        if(resizeSW == "down"){ resizeSW = "up"; }

        //move area
        if(moveState == "down"){ moveState = "up"; }

    });
}

function selectArea(dataArray, cellId, x1, y1, x2, y2){
    var translateX = Math.floor(cellId / N) * SIZE,
        translateY = cellId % N * SIZE;

    var x = Math.min(x1, x2) - translateX,
        y = Math.min(y1, y2) - translateY,
        width = Math.abs(x1 - x2),
        height = Math.abs(y1 - y2);

    //extent
    $('#cell' + cellId).find('.extent').attr(
        {
            "x": x,
            "y": y,
            "width":  width,
            "height": height
        }
    );

    highlight(dataArray, cellId);
}

function changeResize(cellId){
    var x = parseFloat($('#cell' + cellId).find('.extent').attr('x')),
        y = parseFloat($('#cell' + cellId).find('.extent').attr('y')),
        width = parseFloat($('#cell' + cellId).find('.extent').attr('width')),
        height = parseFloat($('#cell' + cellId).find('.extent').attr('height'));

        //resize
        $('#cell' + cellId).find('.n').attr({
            "x": x - 3,
            "y": y - 3,
            "width": width
        });
        $('#cell' + cellId).find('.e').attr({
            "x": x + width - 3,
            "y": y - 3,
            "height": height
        });
        $('#cell' + cellId).find('.s').attr({
            "x": x + 3,
            "y": y + height - 3,
            "width": width
        });
        $('#cell' + cellId).find('.w').attr({
            "x": x - 3,
            "y": y + 3,
            "height": height
        });
        $('#cell' + cellId).find('.nw').attr({
            "x": x - 3,
            "y": y - 3,
        });
        $('#cell' + cellId).find('.ne').attr({
            "x": x + width - 3,
            "y": y - 3,
        });
        $('#cell' + cellId).find('.se').attr({
            "x": x + width - 3,
            "y": y + height - 3,
        });
        $('#cell' + cellId).find('.sw').attr({
            "x": x - 3,
            "y": y + height - 3,
        });

}

function moveArea(dataArray, cellId, x0, y0, x1, y1, x2, y2){
    var moveX = x2 - x1,
        moveY = y2 - y1;

    $('#cell' + cellId).find('.extent').attr({
        "x": x0 + moveX,
        "y": y0 + moveY
    });

    highlight(dataArray, cellId);
}

function highlight(dataArray, cellId){
    var sX = attrArray[Math.floor(cellId / N)];
    var sY = attrArray[cellId % N];

    var x = parseFloat($('#cell' + cellId).find('.extent').attr('x')),
        y = parseFloat($('#cell' + cellId).find('.extent').attr('y')),
        width = parseFloat($('#cell' + cellId).find('.extent').attr('width')),
        height = parseFloat($('#cell' + cellId).find('.extent').attr('height'));

    var i = 0;

    for(var i = 0; i < dataArray.length; i ++){
        var cx = parseFloat($('#cell' + cellId).find('.circle' + i).attr('cx')),
            cy = parseFloat($('#cell' + cellId).find('.circle' + i).attr('cy'));

        if(x <= cx && cx <= (x + width) && y <= cy && cy <= (y + height)){
            $('.circle' + i).attr("class", dataArray[i][SPECIES] + " circle" + i);
        }

        else{
            $('.circle' + i).attr("class", "circle" + i);
        }
    }
}

function noHighlight(dataArray){
    $('.extent').attr({
        "width": 0,
        "height": 0
    });
    for(var i = 0; i < dataArray.length; i ++){
        $('.circle' + i).attr("class", "circle" + i);
    }
}

function highlightAll(dataArray){
    for(var i = 0; i < dataArray.length; i ++){
        $('.circle' + i).attr("class", dataArray[i][SPECIES] + " circle" + i);
    }
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
