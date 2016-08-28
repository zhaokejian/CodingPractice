//===============Vector==============
var Vector = {
    createNew: function(mMagnitude, mDirection){
        var vector = {};

        // resolve negative magnitude by reversing direction
        if (mMagnitude < 0) {
    			mMagnitude = -mMagnitude;
    			mDirection = (180.0 + mDirection) % 360;
    	}

    	// resolve negative direction
    	if (mDirection < 0) mDirection = (360.0 + mDirection);

        vector.magnitude = mMagnitude;
        vector.direction = mDirection;

        vector.setVector = function(nMagnitude, nDirection){
            vector.magnitude = nMagnitude;
            vector.direction = nDirection;
        }
        //
        // vector.ToPoint = function(size, width, height){
        //     // break into x-y components
    	// 	var aX = vector.magnitude * Math.cos((Math.PI / 180.0) * vector.direction);
    	// 	var aY = - vector.magnitude * Math.sin((Math.PI / 180.0) * vector.direction);
        //
        //     if(aX < size) aX = size;
        //     if(aY < size) aY = size;
        //     if(aX > width - size) aX = width - size;
        //     if(aY > width - size) aY = height - size;
    	// 	return Point.createNew(parseInt(aX), parseInt(aY));
        // }

        vector.plusVector = function(vector2){
            var aX = vector.magnitude * Math.cos((Math.PI / 180.0) * vector.direction);
            var aY = - vector.magnitude * Math.sin((Math.PI / 180.0) * vector.direction);

            var bX = vector2.magnitude * Math.cos((Math.PI / 180.0) * vector2.direction);
            var bY = - vector2.magnitude * Math.sin((Math.PI / 180.0) * vector2.direction);

            // add x-y components
            aX += bX;
            aY += bY;

            // pythagorus' theorem to get resultant magnitude
            var magnitude = Math.sqrt(Math.pow(aX, 2) + Math.pow(aY, 2));

            // calculate direction using inverse tangent
            var direction;
            if (magnitude == 0)
                direction = 0;
            else{
                var diffX = aX;
                var diffY = aY;

                if(diffX == 0){
                    if(diffY < 0)  direction = 90;
                    else if (diffY > 0)  direction = 270;
                }
                else if (diffY == 0) {
                    if (diffX >= 0)  direction = 0;
                    else if (diffX < 0)  direction = 180;
                }
                else if (diffX > 0 && diffY < 0) {
                     direction = Math.atan(- diffY / diffX) * (180.0 / Math.PI);
                }
                else if (diffX < 0 && diffY < 0) {
                     direction = Math.atan(- diffY / diffX) * (180.0 / Math.PI) + 180;
                }
                else if (diffX < 0 && diffY > 0) {
                     direction = Math.atan(- diffY / diffX) * (180.0 / Math.PI) + 180;
                }
                else if (diffX > 0 && diffY > 0) {
                     direction = Math.atan(- diffY / diffX) * (180.0 / Math.PI) + 360;
                }

            }
            //update
            vector.setVector(magnitude, direction);
            return vector;
        }

        vector.multiVector = function(multiplier){
            vector.setVector(vector.magnitude * multiplier, vector.direction);
            return vector;
        }
　　　　 return vector;
    }
};

//================Point==================
var Point = {
    createNew:function(x, y){
        var point = {};
        point.x = x;
        point.y = y;

        point.plus = function(diffX, diffY){
            point.x += diffX;
            point.y += diffY;
        }
        point.plusVector = function(vector){
            var bX = vector.magnitude * Math.cos((Math.PI / 180.0) * vector.direction);
    		var bY = - vector.magnitude * Math.sin((Math.PI / 180.0) * vector.direction);
            point.x += bX;
            point.y += bY;
            return point;
        }
        point.adjust = function(size, width, height){
            var aX = point.x;
            var aY = point.y;

            if(aX < size) aX = size;
            if(aY < size) aY = size;
            if(aX > width - size) aX = width - size;
            if(aY > width - size) aY = height - size;
            point.x = parseInt(aX);
            point.y = parseInt(aY);
            return point;
        }
        return point;
    }
};

// Calculates the distance between two points.
function CalcDistance(pointA, pointB) {
    var xDist = (pointA.x - pointB.x);
    var yDist = (pointA.y - pointB.y);
    return parseInt(Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2)));
}

// Calculates the bearing angle from one point to another.
function GetBearingAngle(pointA, pointB) {
    var diffX = pointB.x - pointA.x;
    var diffY = pointB.y - pointA.y;
    var angle;

    if(diffX == 0){
        if(diffY < 0) angle = 90;
        else if (diffY > 0) angle = 270;
        else angle = 0;
    }
    else if (diffY == 0) {
        if (diffX >= 0) angle = 0;
        else if (diffX < 0) angle = 180;
    }
    else if (diffX > 0 && diffY < 0) {
        angle = Math.atan(- diffY / diffX) * (180.0 / Math.PI);
    }
    else if (diffX < 0 && diffY < 0) {
        angle = Math.atan(- diffY / diffX) * (180.0 / Math.PI) + 180;
    }
    else if (diffX < 0 && diffY > 0) {
        angle = Math.atan(- diffY / diffX) * (180.0 / Math.PI) + 180;
    }
    else if (diffX > 0 && diffY > 0) {
        angle = Math.atan(- diffY / diffX) * (180.0 / Math.PI) + 360;
    }

    return angle;
}
//================DiagramBounds===================
var DiagramBounds = {
    createNew: function(NodeArray, width, height){
        var diagramBounds = {};
        var minX = width, minY = height;
        var maxX = 0, maxY = 0
        for (var i = 0; i < NodeArray.length; i++) {
            var nodeLocation = NodeArray[i].location;
            if (nodeLocation.x < minX)  minX = nodeLocation.x;
            if (nodeLocation.x > maxX)  maxX = nodeLocation.x;
            if (nodeLocation.y < minY)  minY = nodeLocation.y;
            if (nodeLocation.y > maxY)  maxY = nodeLocation.y;
        }
        diagramBounds.minX = minX;
        diagramBounds.minY = minY;
        diagramBounds.maxX = maxX;
        diagramBounds.maxY = maxY;
        return diagramBounds;
    }
}

//================AttractionForce & RepulsionForce====================
var ATTRACTION_CONSTANT = 0.1;		// spring constant
var REPULSION_CONSTANT = 15000;	// charge constant
var SPRING_LENGTH = 50;

function CalcAttractionForce(nodeX, nodeY) {
    var proximity = Math.max(CalcDistance(nodeX.location, nodeY.location), 1);

    // Hooke's Law: F = -kx
    var force = ATTRACTION_CONSTANT * Math.max(proximity - SPRING_LENGTH, 0);
    var angle = GetBearingAngle(nodeX.location, nodeY.location);//from X to Y

    return Vector.createNew(force, angle);
}

function CalcAttractionForce_edge(currentNode, edge, NodeArray) {
    if(NodeArray[edge.source] != currentNode) {
        var other = NodeArray[edge.source];
    }
    else var other = NodeArray[edge.target];
    var vector = CalcAttractionForce(currentNode, other);
    // vector.multiVector(edge.value / 5.0 +1);
    if(currentNode.group == other.group) vector.multiVector(2);
    return vector;
}

function CalcRepulsionForce(nodeX, nodeY) {
    var proximity = Math.max(CalcDistance(nodeX.location, nodeY.location), 1);

    // Coulomb's Law: F = k(Qq/r^2)
    var force = REPULSION_CONSTANT / Math.pow(proximity, 2);
    var angle = GetBearingAngle(nodeY.location, nodeX.location);//from Y to X

    if(nodeX.group != nodeY.group) force *= 2;
    return Vector.createNew(force, angle);
}
