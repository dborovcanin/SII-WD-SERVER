var btn = document.getElementById("btn");
var div = document.getElementById("root");
btn.innerHTML = "SWAP WITH TEXT";
var img = true;

var node = document.createElement("p");
function initText(){
    var nodeStyle = node.style;
    nodeStyle.fontSize = "150%";
    nodeStyle.textAlign = "center";
    nodeStyle.borderRadius = "25%";
    nodeStyle.display = "table-cell";
    nodeStyle.verticalAlign = "middle";
    nodeStyle.height = "127";
    nodeStyle.width = "127";
    nodeStyle.backgroundColor = "red";
    nodeStyle.color = "white";
    nodeStyle.textShadow = "3px 10px 5px black";
        
    var the = document.createElement('span');
    the.style.setProperty("font-weight", 800);
    the.style.setProperty("font-width", "110%");
    the.appendChild(document.createTextNode("THE"))
    node.appendChild(the);

    var test = document.createElement("div");
    test.appendChild(document.createTextNode("TEST"));
    test.style.fontSize = "200%";
    test.style.setProperty("font-size", "200%")
    test.style.fontWeight = "800";
    test.style.setProperty("margin-bottom", "5%");
    test.style.setProperty("margin-top", "-10%");
    node.appendChild(test);    
}
initText();

var image = document.createElement("img");
function initImage() {
    image.src = "../resources/img3.jpg";    
}
initImage();

var replace = function () {
    div.removeChild(div.lastElementChild);
    if (img) {
        div.appendChild(node);
        btn.innerHTML = "SWAP  WITH IMG";
    }
    else {
        div.appendChild(image);
        btn.innerHTML = "SWAP  WITH TEXT";
    }
    img = !img;
}