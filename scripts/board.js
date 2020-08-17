var height = 15;
var width = 15;

window.onload = function() {
    omocBoardSet();
}

var omocBoardSet = (() => {

    var w = 50, h = 50;

    document.getElementById('board').style.width = w*width+"px";
    document.getElementById('board').style.height = h*height+"px";

    for(var y = 0; y < height; y++) {
        for(var x = 0; x < width; x++) {
            document.getElementById('board').innerHTML += "<div style=\"width: "+w+"px; height: "+h+"px; top: "+((y*h)/(h*height) * 100)+"%; left: "+(x/width * 100)+"%;\" id='item_"+y+"_"+x+"' onclick='boardClick("+x+","+y+")'></div>"
        }
    }
});

var omocBoardClear = (() => {
    for(var y = 0; y < height; y++) {
        for(var x = 0; x < width; x++) {
            document.getElementById("item_"+y+"_"+x).innerText = "";
        }
    }
})