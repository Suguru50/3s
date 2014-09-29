function mousePointer(pointer){
	switch(pointer){
		case 1:
			//AUTO
			Cto_canvas.style.cursor = "auto";
			break;
		case 2:
			//DEFAULT
			Cto_canvas.style.cursor = "default";
			break;
		case 3:
			//CROSSHAIR
			Cto_canvas.style.cursor = "crosshair";
			break;
		case 4:
			//MOVE
			Cto_canvas.style.cursor = "move";
			break;

	}
}
