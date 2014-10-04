// LayerSistem
function changeLayer(LNo){
	if(LNo == 1){
		$("#layers button.selected").removeClass("selected");
        $("#layer1").addClass("selected");
		//描画レイヤーの変更
		//selectLayer(1)
	}
	if(LNo == 2){
		$("#layers button.selected").removeClass("selected");
        $("#layer2").addClass("selected");
		//描画レイヤーの変更
		//selectLayer(2)
	}
}


//Layer On Off

var visible1 = true;
var visible2 = true;

function viewLayer(vLNo){
	if(vLNo == 1){
		if(visible1) {
			Cto_canvas.style["display"]="none";
			visible1 = false;
		}else{
			Cto_canvas.style["display"]="block";
			visible1 = true;
		}
	}
	if(vLNo == 2){
		View2=document.getElementById("canvas_myCanvas2");
		if(visible2){
			View2.style["display"]="none";
			visible2 = false;
		}else{
			View2.style["display"]="block";
			visible2 = true;
		}
	}
}