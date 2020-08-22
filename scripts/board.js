var height = 15;
var width = 15;

window.onload = function() {
    omocBoardSet();
}

var omocBoardSet = (() => {

    for(var y = 0; y < height; y++) {
        for(var x = 0; x < width; x++) {
            document.getElementById('board').innerHTML += "<div style=\"width: "+100/width+"%; height: "+100/height+"%; top: "+(y/height * 100)+"%; left: "+(x/width * 100)+"%;\" id='item_"+y+"_"+x+"' onclick='boardClick("+x+","+y+")'></div>"
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