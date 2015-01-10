//描画用マウスカーソルの有無
// 0:なし 1:サークル 2:選択範囲
mousePointerFlag = 1;



function mousePointer(pointer){
	switch(pointer){
		case 1:
			//AUTO
			brushcatcher.style.cursor = "auto";
			break;
		case 2:
			//DEFAULT
			//brushcatcher.style.cursor = "default";
			brushcatcher.style.cursor = "crosshair";
			mousePointerFlag = 1;
			break;
		case 3:
			//CROSSHAIR
			brushcatcher.style.cursor = "crosshair";
			mousePointerFlag = 0;
			break;
		case 4:
			//MOVE
			brushcatcher.style.cursor = "move";
			mousePointerFlag = 0;
			break;
		case 5:
			//SELECT
			brushcatcher.style.cursor = "none";
			mousePointerFlag = 2;
			break;
		case 6:
			//TEXT STAMP
			brushcatcher.style.cursor = "none";
			mousePointerFlag = 3;
			break;
	}
}

function pointerCreate(x,y){
	C_tc_c.canvas.width=C_tc_c.canvas.width;
	if(!Cca_drawing){
		switch(mousePointerFlag){
			case 0:
				break;
			case 1:
				//circle
				C_tc_c.beginPath();
				C_tc_c.arc(x,y,Cto_c.lineWidth/2,0,2*Math.PI,false);
				C_tc_c.stroke();
				break;
			case 2:
				//select
			//	var selectSize = 100;
				C_tc_c.beginPath();
				//C_tc_c.strokeRect(x-selectSize,y-selectSize,selectSize*2,selectSize*2);
				C_tc_c.strokeRect(x-ANIMATE_X/2,y-ANIMATE_Y/2,ANIMATE_X,ANIMATE_Y);
				C_tc_c.strokeStyle="#000";
				C_tc_c.globalAlpha = 1;
				C_tc_c.stroke();
				break;
				
			case 3:
				//textStamp
				C_tc_c.font = t_size+"px "+t_font;
				//塗りつぶし
				C_tc_c.fillStyle = Cto_c.strokeStyle;
				
				switch(t_line){
				case 1 :
					C_tc_c.fillText(t_stamp,x,y);
					break;
				case 2 :
					lineChange(C_tc_c,t_stamp,x,y);
					break;
				}
				C_tc_c.globalAlpha = t_alpha;
				break;
		}
	}
}

