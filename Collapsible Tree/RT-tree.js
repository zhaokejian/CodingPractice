var DISX = 180;
var DISY = 50;
var Nodes = new Array();
var nodeNames = new Array();

function RT_tree(dataset, parentId, WIDTH, HEIGHT, right, top){
    initialSVG(parentId, "svg", WIDTH, HEIGHT);
    generateTree(dataset);
    console.log(Nodes);

    Nodes[0].changeState("open");
    // Nodes[1].changeState("open");
    // Nodes[2].changeState("open");
    // Nodes[4].changeState("open");
    // Nodes[3].changeState("open");
    // Nodes[6].changeState("open");
    // Nodes[13].changeState("open");
    // Nodes[26].changeState("open");

    var tree = getSubTree(Nodes[0]);
    adjustEvenly(tree);
    adjustZoom(tree, HEIGHT);
    console.log(tree);
    draw(tree, "svg");
}

//------------------------------------------------------------------------
//----------------generate Tree structure in memory-----------------------
function generateTree(dataset){
    getNode(dataset);

    //setLevel, setID, and add to nodes Array
    var levelArray = new Array();

    var data = dataset;
    var level = 0;
    levelArray.push(data);
    while(levelArray.length > 0){
        var levelArrayNext = new Array();
        for(var i = 0; i < levelArray.length; i ++){//traverse a level
            levelArray[i].node.setLevel(level);
            levelArray[i].node.setPosition(DISX);//initial node's position: node.y = 0
            levelArray[i].node.setID(Nodes.length);
            Nodes.push(levelArray[i].node);
            nodeNames.push(levelArray[i].node.name);

            if(levelArray[i].hasOwnProperty('children')){
                for(var j = 0; j < levelArray[i].children.length; j ++){
                    levelArrayNext.push(levelArray[i].children[j]);
                }
            }
        }
        level ++;
        levelArray = levelArrayNext;//update current level
    }

    //convert children of node in 'nodes' to childID
    for(var i = 0; i < Nodes.length; i++){
        for(var j = 0; j < Nodes[i].children.length; j++){
            Nodes[i].children[j] = nodeNames.indexOf(Nodes[i].children[j].name);
        }
    }
}

function getNode(data){
    if(data.hasOwnProperty('children')){
        data.node = Node.createNew(data.name);
        for(var i = 0; i < data.children.length; i ++){
            data.node.addChild(getNode(data.children[i]));
            getNode(data.children[i]).addParent(data.node);
        }
        return data.node;
    }
    else{//exit
        data.node = Node.createNew(data.name);
        return data.node;
    }
}


//-----------------------------------------------------------------------------
//------------generate tree for drawing by combining subTrees------------------
function getSubTree(node){
    if(node.children.length != 0 && node.state == "open"){
        //combine children one by one
        var bottomContour = Contour.createNew(getSubTree(Nodes[(node.children)[0]]));
        for(var i = 0; i < (node.children.length - 1); i++){
            combineSubTree(bottomContour, getSubTree(Nodes[(node.children)[i+1]]));
            bottomContour = bottomContour.update(getSubTree(Nodes[(node.children)[i+1]]));
        }
        //calculate parent's position
        node.y = (Nodes[(node.children)[0]].y + Nodes[(node.children)[i]].y) / 2;
        return SubTree.createNew(node, Nodes);
    }
    else{//exit
        return SubTree.createNew(node, Nodes);
    }
}

//subTree is under bottomContour
//shiftY for subTree
function combineSubTree(bottomContour, subTree){
    var subTree_Contour = subTree.TopContour;

    var Contour_length = bottomContour.length;
    var subTree_length = subTree_Contour.length;

    //as close as possible at root node
    var tempY = bottomContour.nodes[0].y + DISY;
    var shiftY = tempY - subTree_Contour[0].y;

    //adjust according to contour
    for(var i = 1; i < Math.min(Contour_length, subTree_length); i++){
        tempY = bottomContour.nodes[i].y + 2 * DISY;
        if((subTree_Contour[i].y + shiftY) < tempY){
            shiftY = tempY - subTree_Contour[i].y;
        }
    }
    subTree.shift(shiftY);
}

function adjustEvenly(subTree){
    var levelArray = new Array();

    levelArray.push(subTree.root);
    while(levelArray.length > 0){
        var levelArrayNext = new Array();
        var start = -1, end = -1, count = 0;

        for(var i = 0; i < levelArray.length; i++){//traverse a level
            //adjust y-coordinate
            if(levelArray[i].children.length != 0 && levelArray[i].state == "open" && start == -1){
                start = i;
            }

            else if((levelArray[i].children.length == 0 || levelArray[i].state == "close") && start != -1 ){
                count ++;
            }

            else if(levelArray[i].children.length != 0 && levelArray[i].state == "open" && start != -1){
                count++;
                end = i;
                var dis = levelArray[end].y - levelArray[start].y;
                for(var k = (start + 1); k < end; k++){
                    levelArray[k].y = dis / count * (k - start) + levelArray[start].y;
                }
                start = i;
                count = 0;
            }

            //prepare the next levelArray
            if(levelArray[i].children.length != 0 && levelArray[i].state == "open"){
                for(var j = 0; j < levelArray[i].children.length; j ++){
                    levelArrayNext.push(Nodes[(levelArray[i].children)[j]]);
                }
            }
        }
        levelArray = levelArrayNext;//update current level
    }
}

function adjustZoom(subTree, HEIGHT){
    if(subTree.depth > 0){
        var minY = HEIGHT;
        var maxY = 0;
        for(var i = 0; i < subTree.TopContour.length; i++){
            if(subTree.TopContour[i].y < minY) minY = subTree.TopContour[i].y;
        }
        for(var i = 0; i < subTree.BottomContour.length; i++){
            if(subTree.BottomContour[i].y > maxY) maxY = subTree.BottomContour[i].y;
        }

        var heightNow = maxY - minY;
        var levelArray = new Array();
        var margin = 8;
        var heightNew = HEIGHT - margin * 2;

        levelArray.push(subTree.root);
        while(levelArray.length > 0){
            var levelArrayNext = new Array();
            for(var i = 0; i < levelArray.length; i++){//traverse a level
                //adjust y-coordinate
                levelArray[i].y = margin + (levelArray[i].y - minY) / heightNow * heightNew;

                //prepare the next levelArray
                if(levelArray[i].children.length != 0 && levelArray[i].state == "open"){
                    for(var j = 0; j < levelArray[i].children.length; j ++){
                        levelArrayNext.push(Nodes[(levelArray[i].children)[j]]);
                    }
                }
            }
            levelArray = levelArrayNext;//update current level
        }

    }
    else{
        subTree.nodes[0].y = HEIGHT / 2;
    }
}

//-----------------------------------------------------------------------------
//--------------------------draw a tree----------------------------------------
function draw(tree, svgID){
    //draw edges
    var levelArray = new Array();

    levelArray.push(tree.root);
    while(levelArray.length > 0){
        var levelArrayNext = new Array();
        for(var i = 0; i < levelArray.length; i ++){//traverse a level
            if(levelArray[i].children.length != 0 && levelArray[i].state == "open"){

                //draw edge between levelArray[i] & levelArray[i].children
                for(var j = 0; j < levelArray[i].children.length; j ++){
                    //path
                    var edge = document.createElementNS("http://www.w3.org/2000/svg","path");
                    edge.setAttribute("class", "link");

                    var controlPointX = (levelArray[i].x + Nodes[(levelArray[i].children)[j]].x) / 2;
                    edge.setAttribute("d", "M" + levelArray[i].x + ', ' + levelArray[i].y
                                         + "C" + controlPointX + ', ' + levelArray[i].y
                                         + " " + controlPointX + ', ' + Nodes[(levelArray[i].children)[j]].y
                  + " " + Nodes[(levelArray[i].children)[j]].x + ', ' + Nodes[(levelArray[i].children)[j]].y);
                    $('#' + svgID).append(edge);

                    levelArrayNext.push(Nodes[(levelArray[i].children)[j]]);
                }
            }
        }
        levelArray = levelArrayNext;//update current level
    }


    //draw nodes
    for(var i = 0; i < tree.nodes.length; i++){
        var g = document.createElementNS("http://www.w3.org/2000/svg","g");
        g.setAttribute("class", "node");
        g.setAttribute("id", "node" + tree.nodes[i].id);
        g.setAttribute("transform", "translate(" + tree.nodes[i].x + ", "
                                                 + tree.nodes[i].y + ")");
        $('#' + svgID).append(g);

        //circle
        var circle = document.createElementNS("http://www.w3.org/2000/svg","circle");
        circle.setAttribute("r", "4.5");
        if(tree.nodes[i].state == "close" && tree.nodes[i].children.length > 0){
            circle.setAttribute("class", "circle-close");
        }
        else{
            circle.setAttribute("class", "circle-open");
        }
        $('#node' + tree.nodes[i].id).append(circle);

        //text
        var text = document.createElementNS("http://www.w3.org/2000/svg","text");
        text.setAttribute("id", 'text' + tree.nodes[i].id)
        if(tree.nodes[i].children.length > 0){
            text.setAttribute("text-anchor", "end");
            text.setAttribute("dy", ".35em");
            text.setAttribute("x", "-10");
        }
        else{
            text.setAttribute("text-anchor", "start");
            text.setAttribute("dy", ".35em");
            text.setAttribute("x", "10");
        }
        $('#node' + tree.nodes[i].id).append(text);
        document.getElementById('text' + tree.nodes[i].id).innerHTML = tree.nodes[i].name;
    }
}

function initialSVG(parentId, svgID, WIDTH, HEIGHT){
    var svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("id", svgID);
        svg.setAttribute("version", "1.1");
        svg.setAttribute("width", WIDTH);
        svg.setAttribute("height", HEIGHT);

        $('#' + parentId).append(svg);

    return svgID;
}

//----------------------------------------------------------------------------
//------------------------interaction & redraw--------------------------------
function interaction(svgID, HEIGHT){
    $('.node').click(function(){
        var nodeID = $(this).attr("id");
        nodeID = nodeID.substring(4);
        // console.log(nodeID);
        if(Nodes[parseInt(nodeID)].state == "close"){
            Nodes[parseInt(nodeID)].changeState("open");
        }
        else{
            Nodes[parseInt(nodeID)].changeState("close");
        }

        $('#' + svgID).empty();
        console.log(nodeID);

        var treeNew = getSubTree(Nodes[0]);
        console.log(treeNew);
        adjustEvenly(treeNew);
        adjustZoom(treeNew, HEIGHT);
        draw(treeNew, svgID);
    });
}
