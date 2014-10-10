var currentLayer = 1;
// LayerSistem
function changeLayer(LNo){
	$(".layerbutton.selected").removeClass("selected");
	$("#layer"+LNo).addClass("selected");
	switchLayerInfo(eval("Cto_layercanvas"+LNo),eval("Cto_lc"+LNo),Cto_canvas,Cto_c);
	Cto_canvas = eval("Cto_layercanvas"+LNo+";");
	Cto_c = eval("Cto_lc"+LNo+";");
	tool.colorWheel.switchColorContext(Cto_c);	
	currentLayer = LNo;
}


//Layer On Off
var visible = [true,true];

function viewLayer(vLNo){
	Cto_vL = eval("Cto_layercanvas"+vLNo+";");
	visibleLayer = eval("visible["+(vLNo-1)+"];");
	if(visibleLayer) {
		Cto_vL.style["display"]="none";
		visible[vLNo-1] = false;
	}else{
		Cto_vL.style["display"]="block";
		visible[vLNo-1] = true;
	}
	$("#viewLayer"+vLNo).toggleClass("visible");
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
