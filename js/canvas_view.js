// ビュー（仮）

function view(x,y) {
	Cto_cv.width = Cto_canvas.width;
	Cto_cv.height = Cto_canvas.height;

	var scrollX = (x-250)*0.09;
	var scrollY = (y-250)*0.09;

	var w = window.innerWidth;
	var h = window.innerHeight;
	//ウィンドウサイズが変わった際に再取得
	window.onresize = function (e) {
		w = window.innerWidth;
		h = window.innerHeight;
	}
	//ヘッダーやスクロールバー部分を減算
	h = (h - 65)*0.09;
	w = (w - 15)*0.09;

	drawDispayRect(Cto_cvca,scrollX,scrollY,w,h);

	Cto_c.save();
	Cto_c.scale(0.09,0.09);
	Cto_cvc.drawImage(Cto_canvas,0,0);
	Cto_c.restore();
	
	
}

//ビューの赤い四角
function drawDispayRect(ctx,x,y,width,height){
	//初期化
	ctx.canvas.width=ctx.canvas.width;

	ctx.save();
	ctx.beginPath();
	ctx.strokeStyle = "rgb(255,0,0)";
	ctx.lineWidth = 3;
	ctx.strokeRect(x,y,width,height);
	ctx.restore();
}


