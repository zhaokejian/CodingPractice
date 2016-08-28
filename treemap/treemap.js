var WIDTH = 1000;
var HEIGHT = 500;
var c = 0;//index for color
var r = 0;//id for rect

var color = ["#FF7F0E", "#1F77B4", "#AEC7E8", "#98DF8A", "#2CA02C",
             "#9467BD", "#FFBB78", "#8C564B", "#FF9896", "#C5B0D5"];

function treemap(dataset, WIDTH, HEIGHT, svgID){//generate all rects for dataset and draw
    calcSizeSum(dataset);
    calcArea(dataset, WIDTH * HEIGHT);
    console.log(dataset);

    var hierarchy = Hierarchy.createNew(dataset.name);
    hierarchy_div(hierarchy, 0, 0, WIDTH, HEIGHT, dataset.children);
    console.log(hierarchy);

    draw(hierarchy, svgID);
}

function draw(hierarchy, svgID){
    for(var i = 0; i < hierarchy.children.length; i++){
        if(hierarchy.children[i].name == "end"){
            var rect = hierarchy.Rects[i];
            var rectSVG = document.createElementNS("http://www.w3.org/2000/svg","rect");
            rectSVG.setAttribute('x', rect.x);
            rectSVG.setAttribute('y', rect.y);
            rectSVG.setAttribute('width', rect.width);
            rectSVG.setAttribute('height', rect.height);
            rectSVG.setAttribute('style', "fill: " + color[c%10] +"; stroke-width: 1; stroke: rgb(255, 255, 255)");
            $('#' + svgID).append(rectSVG);

            var textSVG = document.createElementNS("http://www.w3.org/2000/svg", "text");
            textSVG.setAttribute('x', rect.x + 3);
            textSVG.setAttribute('y', rect.y + 15);
            textSVG.setAttribute('font-size', 10);
            textSVG.setAttribute('id', 'rect' + r);
            $('#' + svgID).append(textSVG);
            document.getElementById('rect' + r).innerHTML = rect.name;
            r++;
        }
        else{
            draw(hierarchy.children[i], svgID);
        }
    }
    c++;
}

function hierarchy_div(hierarchy, x, y, width, height, children){
    var rects_div = squarify(x, y, width, height, children);
    hierarchy.setRects(rects_div);

    for(var i = 0; i < children.length; i++){
        if(children[i].hasOwnProperty('children')){
            hierarchy.addHier(i, children[i].name);
            hierarchy_div(hierarchy.children[i],
                hierarchy.Rects[i].x, hierarchy.Rects[i].y,
                hierarchy.Rects[i].width, hierarchy.Rects[i].height, children[i].children);
        }
    }
}

function squarify(x, y, width, height, children){//division for a list of children
    var controller = Controller.createNew(x, y, width, height);
    for(var i = 0; i < children.length; i++){
        controller.addNode(children[i].area, children[i].name);
    }
    var rects_div = new Array();//generated rects in this division
    for(var j = 0; j < controller.Rows.length; j++){
        for(var k = 0; k < controller.Rows[j].Rects.length; k++){
            var rect = controller.Rows[j].Rects[k];
            rects_div.push(rect);
            // var rectSVG = document.createElementNS("http://www.w3.org/2000/svg","rect");
            // rectSVG.setAttribute('x', rect.x);
            // rectSVG.setAttribute('y', rect.y);
            // rectSVG.setAttribute('width', rect.width);
            // rectSVG.setAttribute('height', rect.height);
            // rectSVG.setAttribute('style', "fill: rgb(255,255,255); stroke-width: 1; stroke: rgb(0, 0, 0)");
            // $('#svg').append(rectSVG);
        }
    }
    return rects_div;
}

function calcSizeSum(dataset){//processing data
    if(dataset instanceof Array){//array
        var sum = 0;
        for(var i = 0; i < dataset.length; i++){
            sum += calcSizeSum(dataset[i]);
        }
        return sum;
    }

    else{//object
        if(dataset.hasOwnProperty('children')){
            dataset.size = calcSizeSum(dataset.children);
            return dataset.size;
        }
        else return dataset.size;//recursion exit
    }
}

function calcArea(dataset, area){//processing data
    var areaSum = area;
    var sizeSum = dataset.size;
    dataset.area = areaSum;

    if(dataset.hasOwnProperty('children')){
        for(var i = 0; i < dataset.children.length; i++){
            dataset.children[i].area = dataset.children[i].size / sizeSum * areaSum;
        }
        dataset.children.sort(function(a, b){//ascending sort
            return a.area - b.area;
        });

        //from top to bottom
        for(var i = 0; i < dataset.children.length; i++){
            calcArea(dataset.children[i], dataset.children[i].area);
        }
    }
}

function initialSVG(parentId, svgID){
    var svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
        svg.setAttribute("id", svgID);
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("version", "1.1");
        svg.setAttribute("width", WIDTH);
        svg.setAttribute("height", HEIGHT);

        $('#' + parentId).append(svg);

    return svgID;
}
