var SIZEMAX = 500;
var STEP = 15;
var circle = 0;

//color Table
var colors = ["#508a88", "#008792", "#00ae9d",
              "#00a6ac", "#78cdd1", "#d3d7d4", "#999d9c"];


//wordle layout----main
function wordle(words, CanvasDraw, CanvasTry){
    for(var i = 0; i < words.length; i++){
        addWord(words[i], CanvasDraw, CanvasTry);
    }
}


//add a word to canvas
function addWord(wordData, CanvasDraw, CanvasTry){
    var size = Math.ceil(SIZEMAX * wordData.weight);
    var word = Word.createNew(wordData.text, size, CanvasTry);
    var pos0 = initialPosition(CanvasDraw, word);
    var pos = Position.createNew(pos0.x, pos0.y);

    circle = 0;// initialize circle to 0
    while(true){
        CanvasTry.clear();
        word.draw(CanvasTry, pos, colors);//try to draw and check collision
        var rect = word.toRect();
        if(checkBounds(rect, CanvasTry)){//within the bounds
            if(!collisionDetect(rect, CanvasDraw, CanvasTry))
                break;
        }
        pos = updatePosition(pos0, pos, STEP);
    }
    copyRegion(word.Rect, CanvasTry, CanvasDraw);
    CanvasTry.clear();
    var context = CanvasDraw.canvas.getContext("2d");
    // context.strokeRect(word.Rect.x, word.Rect.y, word.Rect.width, word.Rect.height);
}

//Collision detecting
function collisionDetect(rectIn, CanvasDraw, CanvasTry){
    var context = CanvasDraw.canvas.getContext("2d");
    var contextTry = CanvasTry.canvas.getContext("2d");

    var dataIn = context.getImageData(rectIn.x, rectIn.y, rectIn.width, rectIn.height).data;
    var dataCon = contextTry.getImageData(rectIn.x, rectIn.y, rectIn.width, rectIn.height).data;

    // console.log(dataIn.length);
    for(var i = 3; i < dataIn.length; i += 4) {
        if(dataIn[i] > 0 && dataCon[i] > 0){
            return true; // 碰撞
        }
    }
    if(i >= dataIn.length) return false;

}

//generate the initial position - random x position in the vertical center
function initialPosition(Canvas, word){
    var x = Math.floor(Canvas.width/3 + Math.random() * (Canvas.width/3));
    // var x = Math.floor(Canvas.height/2);
    if(word.direction == 1){
        var y = Math.floor(Canvas.height/2 - word.width/2);
    }
    else {
        var y = Math.floor(Canvas.height/2);
    }
    return Position.createNew(x, y);
}

function updatePosition(pos0, position, step){
    var r = circle * step;
    var diffX = position.x - pos0.x;
    var diffY = pos0.y - position.y;//reverse y-axis
    var newDiffX;
    var newDiffY;
    if(diffX == 0 && diffY == r){
        //'circle' increasing
        circle ++;
        newDiffX = step;
        newDiffY = circle * step;
    }
    else if (diffX >= 0 && diffX < r && diffY == r) {
        //1st quartile: x increase
        newDiffX = diffX + step;
        newDiffY = diffY;
    }
    else if (diffX == r && diffY <=r && diffY > 0) {
        //1st quartile: y decrease
        newDiffX = diffX;
        newDiffY = diffY - step;
    }
    else if (diffX == r && diffY <=0 && diffY > -r) {
        //2nd quartile: y decrease
        newDiffX = diffX;
        newDiffY = diffY - step;
    }
    else if (diffY == -r && diffX <= r && diffX > 0) {
        //2nd quartile: x decrease
        newDiffX = diffX - step;
        newDiffY = diffY;
    }
    else if (diffY == -r && diffX <= 0 && diffX > -r) {
        //3nd quartile: x decrease
        newDiffX = diffX - step;
        newDiffY = diffY;
    }
    else if (diffX == -r && diffY >= -r && diffY < 0) {
        //3nd quartile: y increase
        newDiffX = diffX;
        newDiffY = diffY + step;
    }
    else if (diffX == -r && diffY >= 0 && diffY < r) {
        //4nd quartile: y increase
        newDiffX = diffX;
        newDiffY = diffY + step;
    }
    else if (diffY == r && diffX >= -r && diffX < 0) {
        //4nd quartile: x increase
        newDiffX = diffX + step;
        newDiffY = diffY;
    }

    position.update(pos0.x + newDiffX, pos0.y - newDiffY);

    return position;
}

//check whether beyond canvas's bounds
function checkBounds(rect, Canvas){
    if((rect.x + rect.width) <= Canvas.width
        && (rect.y + rect.height) <= Canvas.height
        && rect.x >= 0 && rect.y >= 0){
            return true;
        }
    else  return false;
}
