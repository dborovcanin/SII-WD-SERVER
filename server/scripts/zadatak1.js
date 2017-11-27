var img1 = document.getElementById('img1');
var img2 = document.getElementById('img2');

var height = ((img1.height < img2.height)?img1.height:img2.height);
var width = ((img1.width > img2.width)?img1.width:img2.width);

function setSize() {
    img1.height = height;
    img2.height = height;
    img1.width = width;
    img2.width = width;
}

setSize();

function swapBorders() {
    var tmp = img1.style.getPropertyValue("border-color");
    img1.style.setProperty("border-color", img2.style.getPropertyValue("border-color"));
    img2.style.setProperty("border-color", tmp);
}

function swapImgs() {
    var temp = img1.src;
    img1.src = img2.src;
    img2.src = temp;
    swapBorders();
}