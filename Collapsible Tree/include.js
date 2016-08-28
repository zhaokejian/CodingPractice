//====================Node for tree=========================
var Node = {
    createNew: function(name){
        var node = {};
        node.name = name;
        node.children = new Array();
        node.state = "close";
        node.x = 0;
        node.y = 0;

        node.addChild = function(child){
            node.children.push(child);
        }

        node.addParent = function(parent){
            node.parent = parent;
        }

        node.setID = function(ID){
            node.id = ID;
        }

        node.setLevel = function(level){
            node.level = level;
        }

        node.changeState = function(state){
            node.state = state;
        }

        node.setPosition = function(disX){
            node.x = disX * (node.level + 1);
        }

        node.shift = function(shiftY){
            node.y += shiftY;
        }

        return node;
    }
}


//====================SubTree for drawing======================
var SubTree = {
    createNew: function(rootNode, Nodes){
        var subTree = {};
        subTree.root = rootNode;

        function getDepth(node){
            if(node.children.length == 0 || node.state == "close") return 0;
            else{
                var maxSubDepth = 0;
                for(var i = 0; i < node.children.length; i++){
                    if(getDepth(Nodes[(node.children)[i]]) > maxSubDepth)
                        maxSubDepth = getDepth(Nodes[(node.children)[i]]);
                }
                return maxSubDepth + 1;
            }
        }
        subTree.depth = getDepth(subTree.root);

        function collectNodes(){
            var collectNodes = new Array();
            var levelArray = new Array();

            collectNodes.push(subTree.root);
            levelArray.push(subTree.root);
            while(levelArray.length > 0){
                var levelArrayNext = new Array();
                for(var i = 0; i < levelArray.length; i ++){//traverse a level
                    if(levelArray[i].children.length != 0 && levelArray[i].state == "open"){
                        for(var j = 0; j < levelArray[i].children.length; j ++){
                            levelArrayNext.push(Nodes[(levelArray[i].children)[j]]);
                            collectNodes.push(Nodes[(levelArray[i].children)[j]]);
                        }
                    }
                }
                levelArray = levelArrayNext;//update current level
            }
            return collectNodes;
        }
        subTree.nodes = collectNodes();

        function getTopContour(){
            var TopContour = new Array();
            var levelArray = new Array();

            levelArray.push(subTree.root);
            while(levelArray.length > 0){
                var levelArrayNext = new Array();
                for(var i = 0; i < levelArray.length; i ++){//traverse a level
                    //push the first node in a level
                    if(i == 0) TopContour.push(levelArray[i]);

                    //prepare the next levelArray
                    if(levelArray[i].children.length != 0 && levelArray[i].state == "open"){
                        for(var j = 0; j < levelArray[i].children.length; j ++){
                            levelArrayNext.push(Nodes[(levelArray[i].children)[j]]);
                        }
                    }
                }
                levelArray = levelArrayNext;//update current level
            }
            return TopContour;
        }
        subTree.TopContour = getTopContour();

        function getBottomContour(){
            var BottomContour = new Array();
            var levelArray = new Array();

            levelArray.push(subTree.root);
            while(levelArray.length > 0){
                var levelArrayNext = new Array();
                for(var i = 0; i < levelArray.length; i ++){//traverse a level
                    //push the last node in a level
                    if(i == (levelArray.length - 1)) BottomContour.push(levelArray[i]);

                    //prepare the next levelArray
                    if(levelArray[i].children.length != 0 && levelArray[i].state == "open"){
                        for(var j = 0; j < levelArray[i].children.length; j ++){
                            levelArrayNext.push(Nodes[(levelArray[i].children)[j]]);
                        }
                    }
                }
                levelArray = levelArrayNext;//update current level
            }
            return BottomContour;
        }
        subTree.BottomContour = getBottomContour();

        subTree.shift = function(shiftY){
            for(var i = 0; i < subTree.nodes.length; i ++){
                subTree.nodes[i].shift(shiftY);
            }
        }

        return subTree;
    }
}

//===================Contour for combination===========================
var Contour = {
    createNew: function(subTree){
        var contour = {};
        contour.nodes = subTree.BottomContour;
        contour.length = subTree.BottomContour.length;

        contour.update = function(subTree2){
            var length2 = subTree2.BottomContour.length;
            var contour2 = subTree2.BottomContour;
            var i;
            for(i = 0; i < Math.min(contour.length, length2); i++){
                if(contour2[i].y > contour.nodes[i].y)
                    contour.nodes[i] = contour2[i];
            }
            if(contour.length < length2){
                for(; i < length2; i++){
                    contour.nodes[i] = contour2[i];
                }
            }

            contour.length = Math.max(contour.length, length2);
            return contour;
        }

        return contour;
    }
}
