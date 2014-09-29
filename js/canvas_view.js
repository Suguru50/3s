// ビュー（仮）

function view() {
	Cto_cv.width = Cto_canvas.width;
	Cto_cv.height = Cto_canvas.height;

	Cto_c.save();
	Cto_c.scale(0.09,0.09);
	Cto_cvc.drawImage(Cto_canvas,0,0);
	Cto_c.restore();
	
}

function drawDispayRect(ctx,x,y,width,height){
	ctx.save();
	ctx.beginPath();
	ctx.strokeStyle = "rgb(255,0,0)";
	ctx.strokeRect(x,y,width,height);
	ctx.restore();
}

