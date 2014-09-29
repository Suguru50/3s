function mousePointer(pointer){
	switch(pointer){
		case 1:
			//AUTO
			document.getElementById("canvas_myCanvas").style.cursor = "auto";
			break;
		case 2:
			//DEFAULT
			document.getElementById("canvas_myCanvas").style.cursor = "default";
			break;
		case 3:
			//CROSSHAIR
			document.getElementById("canvas_myCanvas").style.cursor = "crosshair";
			break;
		case 4:
			//MOVE
			document.getElementById("canvas_myCanvas").style.cursor = "move";
			break;

	}
}