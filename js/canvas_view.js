// ビュー（仮）

function view() {
	Cto_cv.width = Cto_canvas.width;
	Cto_cv.height = Cto_canvas.height;

	

	drawDispayRect();
	
	Cto_c.save();
	//Cto_c.scale(0.09,0.09);
	Cto_cvc.drawImage(Cto_canvas,0,0);
	Cto_c.restore();
	
	
}

//ビューの赤い四角
function drawDispayRect(){
	var x = document.getElementById("canvas_canvas").scrollLeft;
	var y = document.getElementById("canvas_canvas").scrollTop;

	var width = window.innerWidth;
	var height = window.innerHeight;
	//ウィンドウサイズが変わった際に再取得
	window.onresize = function (e) {
		width = window.innerWidth;
		height = window.innerHeight;
	}

	//位置調整(一度中心を始点に)
	x = (x-3250) + width/2;
	y = (y-3275) + height/2;

	width = width/tool.getPageSize();
	height = height/tool.getPageSize();
	
	x = x-width/2;
	y = y-height/2;
	
	
	x*=0.09;
	y*=0.09;
	width*=0.09;
	height*=0.09;
	//初期化
	Cto_cva.width=Cto_cva.width;
	Cto_cvca.save();
	Cto_cvca.beginPath();
	Cto_cvca.strokeStyle = "rgba(255,0,0,0.5)";
	Cto_cvca.lineWidth = 3;
	Cto_cvca.strokeRect(x,y,width,height);
	//ビューの中心点
	//Cto_cvca.strokeRect(89,89,2,2);

	Cto_cvca.restore();


}
