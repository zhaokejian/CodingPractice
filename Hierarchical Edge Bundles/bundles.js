var diameter = 960,
    radius = diameter / 2,
    innerRadius = radius - 120;


var nodes = new Array();
var nodeNames = new Array();//name index for nodes
var leafs = new Array();
var lookUpTable = new Array();//lookup table for interaction
var maxLevel = 0;
var count2 = 0;

function bundles(parentId, dataset){
    initialSVG(parentId, "svg");
    var g = document.createElementNS("http://www.w3.org/2000/svg","g");
    g.setAttribute("transform", "translate(" + radius + "," + radius + ")");
    g.setAttribute("id", "total");
    $('#svg').append(g);

    // var circle = document.createElementNS("http://www.w3.org/2000/svg","circle");
    // circle.setAttribute("cx", 0);
    // circle.setAttribute("cy", 0);
    // circle.setAttribute("r", radius);
    // circle.setAttribute("fill", "#ffffff");
    // circle.setAttribute("stroke", "#bbb");
    // $('#total').append(circle);
    //
    // var circle2 = document.createElementNS("http://www.w3.org/2000/svg","circle");
    // circle2.setAttribute("cx", 0);
    // circle2.setAttribute("cy", 0);
    // circle2.setAttribute("r", innerRadius);
    // circle2.setAttribute("fill", "#ffffff");
    // circle2.setAttribute("stroke", "#bbb");
    // $('#total').append(circle2);

    generateTree(dataset);
    calcAngle(nodes, leafs);

    for(var i = 0; i < nodes.length; i++){
        nodes[i].setPosition(innerRadius, maxLevel);
        var dot = document.createElementNS("http://www.w3.org/2000/svg","circle");
        dot.setAttribute("cx", nodes[i].getPosition().x);
        dot.setAttribute("cy", nodes[i].getPosition().y);
        dot.setAttribute("r", 1);
        dot.setAttribute("fill", "#000");
        $('#total').append(dot);
    }

    drawText("total");

    drawPath("total");
    interaction();
}


function generateTree(dataset){
    for(var i = 0; i < dataset.length; i++){
        var tempName = dataset[i].name;
        var nameArray = tempName.split('.');
        var nodeNameLast = '';
        var nodeNameNow = '';

        //create nodes
        for(var j = 0; j < nameArray.length; j++){
            if(j == 0) nodeNameNow = nameArray[0];
            else nodeNameNow = nodeNameLast + '.' + nameArray[j];

            if(nodeNames.indexOf(nodeNameNow) < 0){//create a new node
                var index = nodes.length;
                var node = Node.createNew(nodeNameNow, index, nodeNameLast, j);
                nodes.push(node);
                nodeNames.push(nodeNameNow);

                if(nodeNameLast != ''){//add child for parent
                    nodes[nodeNames.indexOf(nodeNameLast)].addChild(nodeNameNow);
                }
            }
            nodeNameLast = nodeNameNow;
            if(j > maxLevel) maxLevel = j;
        }

        //create leaf
        var leaf = Leaf.createNew(nodeNameNow, nameArray[nameArray.length - 1],
                                    dataset[i].size, nodes.length - 1);
        var importArray = dataset[i].imports;
        for(var k = 0; k < importArray.length; k++){
            leaf.addImport(importArray[k]);
        }
        leafs.push(leaf);
    }

    //set level (leaf——0)
    calcLevel(nodes[0]);
}

function calcAngle(nodes, leafs){
    //counting
    var count = 0;
    var parent = '';
    for(var i = 0; i < leafs.length; i++){
        var node = nodes[leafs[i].nodeID];
        if(i == 0) parent = node.parent;
        else{
            if(node.parent != parent){
                count ++;
                parent = node.parent;
            }
        }
        leafs[i].setCount(count);
        count ++;
    }

    //set angles for leafs
    var angleInterval = 360 / (count + 1);
    for(var i = 0; i < leafs.length; i++){
        var number = leafs[i].getCount();
        nodes[leafs[i].nodeID].angle = number * angleInterval;
    }

    //set angles for nodes recursively
    setNodeAngle(nodes[0]);
}

function setNodeAngle(node){
    if(node.hasOwnProperty('angle')){//exit
        return node.angle;
    }
    else{
        node.angle = calcNodeAngle(node);
        return node.angle;
    }
}

function calcNodeAngle(node){
    var minChildAngle = 360;
    var maxChildAngle = 0;

    for(var j = 0; j < node.children.length; j++){
        var index = nodeNames.indexOf(node.children[j]);
        var child = nodes[index];
        if(setNodeAngle(child) < minChildAngle)
            minChildAngle = setNodeAngle(child);
        if(setNodeAngle(child) > maxChildAngle)
            maxChildAngle = setNodeAngle(child);
    }

    return (minChildAngle + maxChildAngle) / 2;
}

function calcLevel(node){
    if(node.children.length == 0){//leaf
        node.level = 0;
        return node.level;
    }
    else{//non-leaf
        var maxChildLevel = 0;
        for(var j = 0; j < node.children.length; j++){
            var index = nodeNames.indexOf(node.children[j]);
            var child = nodes[index];
            child.level = calcLevel(child);
            if(child.level > maxChildLevel) maxChildLevel = child.level;
        }
        node.level = maxChildLevel + 1;
        return node.level;
    }
}


function drawText(parentId){
    for(var i = 0; i < leafs.length; i++){
        var index = nodeNames.indexOf(leafs[i].name);
        var node = nodes[index];
        var text = document.createElementNS("http://www.w3.org/2000/svg","text");
        text.setAttribute("id", "node" + index);
        text.setAttribute("class", "node");
        text.setAttribute("dy", ".31em");
        text.setAttribute("transform", "rotate(" + (node.angle - 90) + ")translate(" + (368) + ",0)" + (node.angle < 180 ? "" : "rotate(180)"));
        if(node.angle < 180) text.setAttribute("style", "text-anchor: start");
        else text.setAttribute("style", "text-anchor: end");
        $('#' + parentId).append(text);
        document.getElementById('node' + index).innerHTML = leafs[i].text;
    }
}

function drawPath(parentId){
    initialTable();
    var link_No = 0;
    for(var i = 0; i < leafs.length; i++){
        for(var j = 0; j < leafs[i].imports.length; j++){
            var pointArrayStart = new Array();
            var pointArrayEnd = new Array();
            var startID = leafs[i].nodeID;
            var startNode = nodes[startID];
            var endID = nodeNames.indexOf(leafs[i].imports[j]);
            var endNode = nodes[endID];
            pointArrayStart.push(startNode.getPosition());
            pointArrayEnd.push(endNode.getPosition());
            var LCAnode = LCA(startNode, endNode);

            //generate pointArrayStart
            while(startNode.parent != LCAnode.name){
                var startParent = nodes[nodeNames.indexOf(startNode.parent)];
                pointArrayStart.push(startParent.getPosition());
                startNode = startParent;
            }

            //generate pointArrayEnd
            while(endNode.parent != LCAnode.name){
                var endParent = nodes[nodeNames.indexOf(endNode.parent)];
                pointArrayEnd.push(endParent.getPosition());
                endNode = endParent;
            }

            //connect two arrays
            pointArrayStart.push(LCAnode.getPosition());
            var pointArray = pointArrayStart.concat(pointArrayEnd.reverse());
            beta_Point(pointArray, 0.85);
            // console.log(pointArray);

            $('#' + parentId).append(b_splinePath(pointArray, link_No, 0.008));

            //set lookUpTable
            lookUpTable[startID].addTarget(endID, link_No);
            lookUpTable[endID].addSource(startID, link_No);

            link_No++;
        }
    }
}

function beta_Point(pointArray, beta){
    for(var i = 0; i < pointArray.length; i++){
        var temp = pointArray[pointArray.length-1].sub(pointArray[0])
                    .multi(i / (pointArray.length - 1))
                    .add(pointArray[0])
                    .multi(1 - beta);
        var rst = pointArray[i].multi(beta).add(temp);
        pointArray[i] = rst;
    }
}

function b_splinePath(pointArray, link_No, dx){
    var path = document.createElementNS("http://www.w3.org/2000/svg","path");
    path.setAttribute("id", "link" + link_No);
    path.setAttribute("class", "link");
    var d = 'M' + pointArray[0].x + ', ' + pointArray[0].y;

    if(pointArray.length == 3){//quadratic Bézier---Q
        d += ('Q' + pointArray[1].x + ', ' + pointArray[1].y
                + ' ' + pointArray[2].x + ', ' + pointArray[2].y);
    }
    else if (pointArray.length == 4) {//cubic Bézier----C
        d += ('C' + pointArray[1].x + ', ' + pointArray[1].y
                + ' ' + pointArray[2].x + ', ' + pointArray[2].y
                + ' ' + pointArray[3].x + ', ' + pointArray[3].y);
    }

    else{//piecewise cubic B-spline interpolation——k = 4
        //generate knot vectors U
        var U = new Array();
        var n = pointArray.length - 1;
        var k = 4;

        var i;
        for(i = 0; i < k; i++){
            U.push(0);
        }
        for(; i <= (n + 1); i++){
            U.push(U[i-1] + 1);
        }
        for(; i <= (n + k); i++){
            U.push(U[n + 1]);
        }
        console.log(U);

        //generate Sn,U according to control pointArray
        var path_d = new Array();
        for(var x = U[k-1]; x <= U[n+1]; x += dx){
            var pointX = 0;
            var pointY = 0;
            for(i = 0; i <=n ; i++){
                // console.log(B(i, k, U, x));
                pointX += B(i, k, U, x) * pointArray[i].x;
                // console.log(pointX);
                pointY += B(i, k, U, x) * pointArray[i].y;
                // console.log(pointY);
            }
            path_d.push(Position.createNew(pointX, pointY));
        }
        // console.log(path_d);

        for(var j = 1; j < path_d.length; j++){
            d += 'L' + path_d[j].x + ', ' + path_d[j].y;
        }
        d += 'L' + pointArray[n].x + ', ' + pointArray[n].y;

    }
    path.setAttribute("d", d);

    return path;
}

function B(i, k, U, x){//a basis function Bi,k in B-spline
    if(k == 1){
        if(U[i] <= x && x <= U[i + 1]) return 1;
        else return 0;
    }
    else{
        var item1 = ((x - U[i]) / (U[i+k-1] - U[i])) * B(i, k-1, U, x);
        if((U[i+k-1] - U[i]) == 0) item1 = 0;
        var item2 = ((U[i+k] - x) / (U[i+k] - U[i+1])) * B(i+1, k-1, U, x);
        if((U[i+k] - U[i+1]) == 0) item2 = 0;
        return item1 + item2;
    }
}

function LCA(startNode, endNode){
    if(startNode.depth == endNode.depth){
        if (startNode.parent != endNode.parent) {
            var startParent = nodes[nodeNames.indexOf(startNode.parent)];
            var endParent = nodes[nodeNames.indexOf(endNode.parent)];
            return LCA(startParent, endParent);
        }
        else{
            var LCAnode = nodes[nodeNames.indexOf(startNode.parent)];
            return LCAnode;
        }
    }
    else if (startNode.depth > endNode.depth) {
        var startParent = nodes[nodeNames.indexOf(startNode.parent)];
        return LCA(startParent, endNode);
    }
    else{
        var endParent = nodes[nodeNames.indexOf(endNode.parent)];
        return LCA(startNode, endParent);
    }
}

function initialTable(){
    for(var i = 0; i < leafs.length; i++){
        lookUpTable[leafs[i].nodeID] = (Item.createNew(leafs[i].nodeID));
    }
}

function interaction(){
    //mouseover
    $('.node').mouseover(function(){
        var thisID = $(this).attr('id').substring(4);
        var target = lookUpTable[parseInt(thisID)].target;
        for(var i = 0; i < target.length; i++){
            $("#node" + target[i].node).attr("class", "node nodetarget");
            $("#link" + target[i].path).attr("class", "link linktarget");
        }

        var source = lookUpTable[parseInt(thisID)].source;
        for(var i = 0; i < source.length; i++){
            $('#node' + source[i].node).attr("class", "node nodesource");
            $('#link' + source[i].path).attr("class", "link linksource");
        }
    });
    //mouseout
    $('.node').mouseout(function(){
        var thisID = $(this).attr('id').substring(4);

        var target = lookUpTable[parseInt(thisID)].target;
        for(var i = 0; i < target.length; i++){
            $('#node' + target[i].node).attr("class", "node");
            $('#link' + target[i].path).attr("class", "link");
        }

        var source = lookUpTable[parseInt(thisID)].source;
        for(var i = 0; i < source.length; i++){
            $('#node' + source[i].node).attr("class", "node");
            $('#link' + source[i].path).attr("class", "link");
        }
    });
}
