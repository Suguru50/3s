var currentLayer = 1;
// LayerSistem
function changeLayer(LNo){
	$("#layers button.selected").removeClass("selected");
	$("#layer"+LNo).addClass("selected");
	switchLayerInfo(eval("Cto_layercanvas"+LNo),eval("Cto_lc"+LNo),Cto_canvas,Cto_c);
	Cto_canvas = eval("Cto_layercanvas"+LNo+";");
	Cto_c = eval("Cto_lc"+LNo+";");
	tool.colorWheel.switchColorContext(Cto_c);	
	currentLayer = LNo;
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

function switchLayerInfo(tocanvas,toctx,fromcanvas,fromctx){
	//メモ
	//saveメソッドでセーブできる奴ら
	//切り抜き情報とかは無い
	 toctx.strokeStyle = fromctx.strokeStyle;
	 toctx.fillStyle	= fromctx.fillStyle;
	 toctx.globalAlpha = fromctx.globalAlpha;
	 toctx.lineWidth = fromctx.lineWidth;
	 toctx.lineCap = fromctx.lineCap;
	 toctx.lineJoin = fromctx.lineJoin;
	 toctx.miterLimit = fromctx.miterLimit;
	 toctx.shadowOffsetX = fromctx.shadowOffsetX;
	 toctx.shadowOffsetY = fromctx.shadowOffsetY;
	 toctx.shadowBlur = fromctx.shadowBlur;
	 toctx.shadowColor = fromctx.shadowColor;
	 toctx.globalCompositeOperation = fromctx.globalCompositeOperation;
	 toctx.font = fromctx.font;
	 toctx.textAlign = fromctx.textAlign;
	 toctx.textBaseline = fromctx.textBaseline
}
