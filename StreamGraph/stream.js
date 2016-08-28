var WIDTH = 960
var HEIGHT = 500;

var colors = ["#008792", "#00a6ac", "#78cdd1", "#d3d7d4",
              "#00ae9d", "#508a88", "#70a19f", "#50b7c1"];

function stream(dataset, parentId, n, m){
    var svgID = initialSVG("stream-graph", "svg");
    var sta = Statistic.createNew(dataset, n, m);
    var info = sta.PairInfo;
    var scaleTime = Scale.createNew(0, m, 0, WIDTH);
    var scaleValue = Scale.createNew(sta.g0Min, sta.maxSize+1, 10 , HEIGHT - 10);
    var g0_d = "";
    for(var j = m-1; j >= 0; j--){
        g0_d += " L" + Math.floor(scaleTime.linearMap(j)) +
                 ' ' + Math.floor(scaleValue.linearMap(sta.g0[j]));
    }
    g0_d += ' Z';

    for(var i = n-1; i >= 0; i--){
        var path = document.createElementNS("http://www.w3.org/2000/svg","path");
        path.setAttribute("id", "path"+i);
        path.setAttribute("fill", colors[i%8]);
        var d = "";
        for(var j = 0; j < m; j++){
            //first point
            if(j == 0){
                var scaleX = Math.floor(scaleTime.linearMap(info[i][j].x));
                var scaleY = Math.floor(scaleValue.linearMap(info[i][j].y + sta.g0[j]));
                d += (' M' + scaleX + ' ' + scaleY);
            }
            //last point
            else if (j == m -1) {
                var scaleX = Math.floor(scaleTime.linearMap(info[i][j].x));
                var scaleY = Math.floor(scaleValue.linearMap(info[i][j].y + sta.g0[j]));
                d += (' L' + scaleX + ' ' + scaleY);
                d += g0_d;
                // var circle = document.createElementNS("http://www.w3.org/2000/svg","circle");
                // circle.setAttribute("cx", scaleX);
                // circle.setAttribute("cy", scaleY);
                // circle.setAttribute("r", '1');
                // $('#' + svgID).append(circle);
            }
            else{
                var scaleX = Math.floor(scaleTime.linearMap(info[i][j].x));
                var scaleY = Math.floor(scaleValue.linearMap(info[i][j].y + sta.g0[j]));
                d += (' L' + scaleX + ' ' + scaleY);
                // var circle = document.createElementNS("http://www.w3.org/2000/svg","circle");
                // circle.setAttribute("cx", scaleX);
                // circle.setAttribute("cy", scaleY);
                // circle.setAttribute("r", '1');
                // $('#' + svgID).append(circle);
            }
        }
        path.setAttribute("d", d);
        $('#' + svgID).append(path);
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
