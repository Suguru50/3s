function tool_bs() {
    var $elementReference = document.getElementById("tool_rangeinput");
    var $value = $elementReference.value;
	document.getElementById("tool_rangevalue").innerHTML = $value;
	Cto_c.lineWidth = $value;
}
function tool_alpha() {
    var $elementReference = document.getElementById("tool_range_alpha");
    var $value = $elementReference.value;
	document.getElementById("tool_alpha_value").innerHTML = $value;
	Cto_c.globalAlpha = $value;
}

//var grad = Cto_c.createRadialGradient(0, 0, 0, 0, 0, 0);
var grad;

function tool_airbrush(x,y) {	
	//rgb抜出し
	var cutR = parseInt((Cto_c.strokeStyle).substring(1,3),16);
	var cutG = parseInt((Cto_c.strokeStyle).substring(3,5),16);	
	var cutB = parseInt((Cto_c.strokeStyle).substring(5,7),16);	
		
        Cto_c.beginPath();

        grad = Cto_c.createRadialGradient(x, y, 0, x, y, Cto_c.lineWidth/2);
        grad.addColorStop(0, "rgba("+cutR+","+cutG+","+cutB+","+"0.5)");
        grad.addColorStop(1, "rgba("+cutR+","+cutG+","+cutB+","+"0)");
        Cto_c.fillStyle = grad;
		Cto_c.arc(x, y, Cto_c.lineWidth/2, 0, Math.PI*2, false);
        Cto_c.fill();
		Cto_c.closePath();
}

function getGrad(){
	return grad;
}
