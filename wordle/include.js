//=====================Word=====================
var Word = {
    No : 1,
    createNew: function(text, size, CanvasTry){
        //'canvasTry' is used to get width & height information
        var word = {};
        word.text = text;
        word.PosX = -1;//text position
        word.PosY = -1;
        word.diffY = 0; //Rect.y - text.y
        word.width = -1; //rect's width
        word.height = -1; //rect's height
        word.size = (size > 10) ? size : 10;// the minimal size is 10
        word.Rect = {};
        word.direction = 0;//horizontal

        //initialize word.diffY, word.width, word.height, word.direction
        initialize(word, CanvasTry);

        //draw a word to given canvas & position------horizontal
        word.draw = function(Canvas, pos_text, colors){
            var context = Canvas.canvas.getContext("2d");
            context.font = "bold " + word.size + "px Georgia";
            var c = Math.floor(Math.random() * colors.length);
            context.fillStyle = colors[c];
            word.PosX = pos_text.x;
            word.PosY = pos_text.y;

            if(word.direction == 1){//vertical
                //translate to text's position
                context.translate(pos_text.x, pos_text.y);
                //rotate canvas 90 degree
                context.rotate(Math.PI/2);
                context.translate(-pos_text.x, -pos_text.y);
                //add text
                context.fillText(word.text, pos_text.x, pos_text.y);
                //recover coordinate system
                context.translate(pos_text.x, pos_text.y);
                context.rotate(-Math.PI/2);
                context.translate(-pos_text.x, -pos_text.y);
            }
            else{//horizontal
                context.fillText(word.text, pos_text.x, pos_text.y);
            }
        }

        //transform Word to Rect
        word.toRect = function(){
            if(word.direction == 1){//vertical
                var rect = Rect.createNew(word.PosX - (word.height + word.diffY),
                                        word.PosY, word.height, word.width);
                word.Rect = rect;
                return rect;
            }
            else{//horizontal
                var rect = Rect.createNew(word.PosX, word.PosY + word.diffY, word.width, word.height);
                word.Rect = rect;
                return rect;
            }
        }

        return word;
    }

}
//initialize word
function initialize(word, CanvasTry){
    // word.direction = 1;
    if(Word.No % 3 == 0){
        word.direction = 1;
    }
    var context = CanvasTry.canvas.getContext("2d");
    context.font = "bold " + word.size + "px Georgia";
    context.fillText(word.text, 0, word.size * 2);//so as to get width & height
    word.width = Math.ceil(context.measureText(word.text).width);
    word.height = getHeight(word, CanvasTry);
    CanvasTry.clear();

    Word.No ++;
}

//getHeight of Word's text
function getHeight(word, CanvasTry){
    var context = CanvasTry.canvas.getContext("2d");
    var minY = CanvasTry.height;
    var maxY = 0;
    var data = context.getImageData(0, 0, word.width, CanvasTry.height).data;

    //find minY, maxY, minX, maxX
    for(var point = 0; point*4 < data.length; point++){
        var i = point*4 + 3;

        var y = Math.floor(point / word.width); //current row
        if(data[i] > 0){ //non-null
            if(y < minY) minY = y;
            if(y > maxY) maxY = y;
        }
    }
    var height = maxY - minY + 1;
    word.diffY = minY - word.size*2;
    return height;
}

//====================Rect=========================
var Rect = {
    createNew: function(x, y, width, height){
        var rect = {};
        rect.x = x;
        rect.y = y;
        rect.width = width;
        rect.height = height;
        return rect;
    }
}

//====================Position======================
var Position = {
    createNew : function(posX, posY){
        var position = {};
        position.x = posX;
        position.y = posY;

        position.update = function(posX, posY){
            position.x = posX;
            position.y = posY;
            return position;
        }
        return position;
    }
}

//===================Canvas=======================
var Canvas = {
    createNew: function(canvas, width, height){
        var canvasObj = {};
        canvasObj.canvas = canvas;
        canvasObj.width = width;
        canvasObj.height = height;

        canvasObj.clear = function(){
            var context = canvasObj.canvas.getContext("2d");
            context.clearRect(0, 0, canvasObj.width, canvasObj.height);
        }
        return canvasObj;
    }
}

//copy given region from CanvasTry to CanvasTry
function copyRegion(rect, CanvasTry, CanvasDraw){
    var contextTry = CanvasTry.canvas.getContext("2d");
    var contextDraw = CanvasDraw.canvas.getContext("2d");

    var copyData = contextTry.getImageData(rect.x, rect.y, rect.width, rect.height);
    var origData = contextDraw.getImageData(rect.x, rect.y, rect.width, rect.height);
    var imgData = contextDraw.createImageData(copyData);

    for(var i = 0; i< imgData.data.length; i += 4){
        if(copyData.data[i+3] > 0){
            imgData.data[i] = copyData.data[i];
            imgData.data[i+1] = copyData.data[i+1];
            imgData.data[i+2] = copyData.data[i+2];
            imgData.data[i+3] = copyData.data[i+3];
        }
        else{
            imgData.data[i] = origData.data[i];
            imgData.data[i+1] = origData.data[i+1];
            imgData.data[i+2] = origData.data[i+2];
            imgData.data[i+3] = origData.data[i+3];
        }
    }
    contextDraw.putImageData(imgData,rect.x, rect.y);
}
