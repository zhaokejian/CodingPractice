//=============Node for generating a tree====================
var Node = {
    createNew: function(name, index, parent, depth){
        var node = {};
        node.name = name;//XX.XX.XX
        node.id = index;
        node.children = new Array();//for tree
        node.parent = parent;
        node.depth = depth;

        node.addChild = function(child){
            node.children.push(child);
        }

        node.setPosition = function(radius, maxLevel){
                node.r = radius - radius / maxLevel * node.level;
                node.x = Math.sin(node.angle / 180 * Math.PI) * node.r;
                node.y = - Math.cos(node.angle / 180 * Math.PI) * node.r;
        }

        node.getPosition = function(){
            return Position.createNew(node.x, node.y);
        }
        return node;
    }
}

//=============Leaf——node for connections====================
var Leaf = {
    createNew: function(name, text, size, nodeID){
        var leaf = {};
        leaf.name = name;
        leaf.text = text;//XX
        leaf.size = size;
        leaf.nodeID = nodeID;
        leaf.imports = new Array();//for adjacency relations

        leaf.addImport = function(importNodeName){
            leaf.imports.push(importNodeName);
        }
        leaf.setCount = function(count){
            leaf.count = count;
        }
        leaf.getCount = function(){
            return leaf.count;
        }

        return leaf;
    }
}

//====================Position=====================
var Position = {
    createNew: function(x, y){
        var position = {};
        position.x = x;
        position.y = y;

        position.add = function(position2){
            var position3 = Position.createNew(position.x + position2.x,
                                                position.y + position2.y);
            return position3;
        }

        position.sub = function(position2){
            var position3 = Position.createNew(position.x - position2.x,
                                                position.y - position2.y);
            return position3;
        }

        position.multi = function(k){
            var position3 = Position.createNew(position.x * k,
                                                position.y * k);
            return position3;
        }

        return position;
    }
}

//=================item for lookUpTable==================
var Item = {
    createNew: function(nodeId){
        var item = {};
        item.nodeId = nodeId;
        item.source = new Array();
        item.target = new Array();

        item.addSource = function(sourceNodeId, pathId){
            item.source.push({'node': sourceNodeId, 'path': pathId});
        }
        item.addTarget = function(targetNodeId, pathId){
            item.target.push({'node': targetNodeId, 'path': pathId});
        }
        return item;
    }
}
