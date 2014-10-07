var frameCount = 1;
var targetFrame = 1;
function addFrame(){
	frameCount++;
	var listElement = document.createElement("li");
	var ulElement = document.getElementById("frame_list");
	listElement.innerHTML = "<div class='framewrapper'><div id='addimg"+frameCount+"' class='frameadd'>Add</div><div id='remove"+frameCount+"' class='frameremove'>×</div><canvas id='"+frameCount+"_img' class='animeframe'></canvas><div class='framenumber'>"+frameCount+"</div></div>";
	ulElement.insertBefore(listElement,ulElement.lastChild);
	console.log(ulElement.firstChild);
	console.log(ulElement.lastChild);

}
//-------
var animationMode = false;
var ANIMATE_X=200,ANIMATE_Y=200;
var toolcanvas;
function animationSetup() {
	toolcanvas = document.getElementById("canvas_toolcanvas");
	toolcanvasctx = toolcanvas.getContext("2d");
	toolcanvasctx.lineWidth = 5;
	toolcanvasctx.strokeStyle = "black";
	toolcanvas.width = 2000;
	toolcanvas.height = 2000;
toolcanvasctx.beginPath();
toolcanvasctx.moveTo(0,0);
toolcanvasctx.lineTo(100,300);
	toolcanvasctx.stroke();
toolcanvasctx.closePath();
	/*`
	encoder = new GIFEncoder();
	encoder.setRepeat(0);
	encoder.setDelay(100);
	encoder.setSize(ANIMATE_X,ANIMATE_Y);
	*/
};
function switchAnimationMode(){
	if(animationMode) animationMode = false; 
	else 			  animationMode = true;
}
var X;
var Y;
function toolMoveCursor(e){
	X = (e.clientX - ($(Cto_canvas).position().left-200+
				  parseInt($(canvas_canvas).css('margin-left'),10)))/tool.getPageSize()-ANIMATE_X/2;
	Y = (e.clientY - $(Cto_canvas).position().top)/tool.getPageSize()-ANIMATE_Y/2;
	toolcanvasctx.canvas.width = toolcanvasctx.canvas.width;
	toolcanvasctx.rect(X,Y,ANIMATE_X,ANIMATE_Y);
	toolcanvasctx.stroke();

}

//function setFrame(e,frameNum){
function setFrame(e){
	//var fc = document.getElementById(frameNum+"_img");
	var fc = document.getElementById(targetFrame+"_img");
	var fctx = fc.getContext("2d");
	fc.width = 200;
	fc.height = 200;
	fctx.canvas.width = fctx.canvas.width;
	fctx.strokeStyle="white";
	var img1;
	var img2;
	console.log(X);
	console.log(Y);
	fctx.fillRect(0,0,ANIMATE_X,ANIMATE_Y);
	img1 = Cto_lc1.getImageData(X,Y,ANIMATE_X,ANIMATE_Y);
	img2 = Cto_lc2.getImageData(X,Y,ANIMATE_X,ANIMATE_Y);
	/*
	tempImage = new Image();
tempImage.src = tempCanvas.toDataURL();
	var dataURL1 = 
	いったん２００×２００のテンプキャンバスに書いて
	データurlにして
	imageにしてdrawimage
	*/

	fctx.putImageData(img1,0,0);
	fctx.putImageData(img2,0,0);
}

function draw() {
	toolcanvas.addEventListener("mousedown",function(e){
	},false);
	/*
	canvas2.addEventListener("mouseup",function(e){
		},false);
		*/
}
function addAnimation(frame){
	/*
		var frameImage = ctx3.getImageData(0,0,ANIMATE_X,ANIMATE_Y);
		var frameCanvas = document.getElementById(frame+"_img");
		var frameContext = frameCanvas.getContext("2d");
		frameContext.putImageData(frameImage,0,0);
		*/
}

function createAnimation(){
	/*
	encoder.start();
	for(count=1;count<=frameCount;count++){
		var frameCanvas = document.getElementById(count+"_img");
		var frameContext = frameCanvas.getContext('2d');
		encoder.addFrame(frameContext);
		console.log(count);
	}
	encoder.finish();
	document.getElementById("anim").src = 'data:image/gif;base64,'+encode64(encoder.stream().getData());
	*/
}

