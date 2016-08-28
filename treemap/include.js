//====================Rectangle======================
var Rectangle = {
    createNew: function(x, y, width, height, area, name){
        var rect = {};
        rect.name = name;
        rect.x = x;
        rect.y = y;
        rect.width = width;
        rect.height = height;
        rect.area = area;
        rect.ratio = Math.max(rect.width/rect.height, rect.height/rect.width);

        rect.getRatio = function(){
            return rect.ratio;
        }

        return rect;
    }
}

//=====================Row==============================
var Row = {
    createNew: function(x, y, width, height){
        var row = {};
        row.x = x;
        row.y = y;
        row.width = width;
        row.height = height;
        row.direction = width > height ? 1 : 0; //1 means "horizontally"
                                                //0 means "vertically"
        row.Rects = new Array();
        row.Areas = new Array();//so as to rearrange division for rectangles
        row.areaSum = 0;
        row.worstRatio = 32767;
        row.div = 0;

        row.addNode = function(addArea, name){
            var areaSum = row.areaSum;
            areaSum += addArea;

            var newRects = new Array();//new rects array after adding
            var newRatio = 1;//new worstRatio after adding

            //direction == 1
            var tempWidth = areaSum / row.height;
            var tempY = row.y;

            //direction == 0
            var tempHeight = areaSum / row.width;
            var tempX = row.x;

            if(row.direction == 1){//divide horizontally & add vertically
                for(var i = 0; i < row.Areas.length; i++){
                    newRects[i] = Rectangle.createNew(row.x, tempY,
                                        tempWidth, row.Areas[i] / tempWidth,
                                        row.Areas[i], row.Rects[i].name);
                    tempY += newRects[i].height;

                    var tempRatio = newRects[i].getRatio();
                    if(tempRatio > newRatio) newRatio = tempRatio;
                }
                newRects[i] = Rectangle.createNew(row.x, tempY,
                                    tempWidth, addArea / tempWidth,
                                    addArea, name);

                var tempRatio = newRects[i].getRatio();
                if(tempRatio > newRatio) newRatio = tempRatio;
            }
            else{//divide vertically & add horizontally
                for(var i = 0; i < row.Areas.length; i++){
                     newRects[i] = Rectangle.createNew(tempX, row.y,
                                        row.Areas[i] / tempHeight, tempHeight,
                                        row.Areas[i], row.Rects[i].name);
                    tempX += newRects[i].width;

                    var tempRatio = newRects[i].getRatio();
                    if(tempRatio > newRatio) newRatio = tempRatio;
                }
                newRects[i] = Rectangle.createNew(tempX, row.y,
                                    addArea / tempHeight, tempHeight,
                                    addArea, name);

                var tempRatio = newRects[i].getRatio();
                if(tempRatio > newRatio) newRatio = tempRatio;
            }

            //whether confirm add to current row or not according to newRatio
            if(newRatio > row.worstRatio){//No, and return a new row
                if(row.direction == 1) {
                    return Row.createNew(row.x + row.div, row.y,
                                        row.width - row.div, row.height);
                }
                else{
                    return Row.createNew(row.x, row.y + row.div,
                                        row.width, row.height - row.div);
                }
            }
            else{//Yse, and update row.Rects, row.Areas, row.worstRatio, row.areaSum and row.div
                row.Rects = newRects;
                row.Areas.push(addArea);
                row.areaSum = areaSum;
                row.worstRatio = newRatio;

                if(row.direction == 1) row.div = tempWidth;
                else row.div = tempHeight;

                return "true";
            }
        }

        row.getArea = function(){
            return row.areaSum;
        }

        return row;
    }
}

//=============division controller for a children list===============
var Controller = {
    createNew: function(x, y, WIDTH, HEIGHT, area){
        var controller = {};
        controller.Rows = new Array();//contains the rectangles that is currently being laid out.
        controller.x = x;
        controller.y = y;
        controller.width = WIDTH;
        controller.height = HEIGHT;
        controller.area = area;

        controller.currentRow = Row.createNew(x, y, WIDTH, HEIGHT);
        controller.Rows.push(controller.currentRow);

        controller.addNode = function(addArea, name){
            var rtn = controller.currentRow.addNode(addArea, name);
            if(typeof(rtn) == "object"){
                controller.currentRow = rtn;
                controller.Rows.push(rtn);
                controller.currentRow.addNode(addArea, name);
            }
        }

        return controller;
    }
}

//==============hierarchical structure=================
var Hierarchy = {
    createNew: function(name){
        var hierarchy = {};
        hierarchy.name = name;

        hierarchy.setRects = function(Rects){
            hierarchy.Rects = Rects;
            hierarchy.children = new Array();
            for(var i = 0; i < Rects.length; i++){
                hierarchy.children[i] = Hierarchy.createNew("end");//flag the leaf node
            }
        }

        hierarchy.addHier = function(i, name){
            hierarchy.children[i].name = name;
        }

        return hierarchy;
    }
}
