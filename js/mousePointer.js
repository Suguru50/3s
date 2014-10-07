function mousePointer(pointer){
	switch(pointer){
		case 1:
			//AUTO
			if(!animationMode){
				brushcatcher.style.cursor = "auto";
			}
			break;
		case 2:
			//DEFAULT
			if(!animationMode){
				brushcatcher.style.cursor = "default";
			}
			break;
		case 3:
			//CROSSHAIR
			if(!animationMode){
				brushcatcher.style.cursor = "crosshair";
			}
			break;
		case 4:
			//MOVE
			if(!animationMode){
				brushcatcher.style.cursor = "move";
			}
			break;

	}
}
