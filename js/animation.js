var frameCount = 1;
var targetFrame = 1;
var encoder;
function addFrame(){
	frameCount++;
	var listElement = document.createElement("li");
	var ulElement = document.getElementById("frame_list");
	listElement.innerHTML = "<div class='framewrapper'><div id='addimg"+frameCount+"' class='frameadd' onclick='switchAnimationMode("+frameCount+")'>OK</div><div id='selectframe"+frameCount+"' class='frameselect'onclick='switchAnimationMode("+frameCount+")'>SELECT</div><div id='remove"+frameCount+"' class='frameremove' onclick='removeFrame("+frameCount+")'>×</div><canvas id='"+frameCount+"_img' class='animeframe'></canvas><div class='framenumber'>"+frameCount+"</div></div>";
	//ulElement.insertBefore(listElement,ulElement.lastChild);
	$('#frame_list').append(listElement);
}
function removeFrame(target){
	if(frameCount>1){
		$('#frame_list li').eq(target).remove();
		frameCount--;
	}
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

	encoder = new GIFEncoder();
	encoder.setRepeat(0);
	encoder.setDelay(100);
	encoder.setSize(ANIMATE_X,ANIMATE_Y);
};

function switchAnimationMode(target){
	if(animationMode){
		mousePointer(2);
		animationMode = false; 
		$("#selectframe"+target).css("display","block");
		$("#addimg"+target).css("display","none");
	}else{
		mousePointer(5);
		animationMode = true;
		targetFrame = target;
		$("#selectframe"+target).css("display","none");
		$("#addimg"+target).css("display","block");
	}
}
var X = 200;
var Y = 200;
/*
function toolMoveCursor(e){
	X = (e.clientX - ($(Cto_canvas).position().left-200+
				  parseInt($(canvas_canvas).css('margin-left'),10)))/tool.getPageSize()-ANIMATE_X/2;
	Y = (e.clientY - $(Cto_canvas).position().top)/tool.getPageSize()-ANIMATE_Y/2;
	toolcanvasctx.canvas.width = toolcanvasctx.canvas.width;
	toolcanvasctx.rect(X,Y,ANIMATE_X,ANIMATE_Y);
	toolcanvasctx.stroke();
}
*/

//function setFrame(e,frameNum){
var trimmingAreaX;
var trimmingAreaY;
function setFrame(x,y){
	var tempCanvas1 = document.createElement("canvas");
	tempCanvas1.width = 200;
	tempCanvas1.height = 200;
	var tempContext1 = tempCanvas1.getContext("2d");
	var tempCanvas2 = document.createElement("canvas");
	tempCanvas2.width = 200;
	tempCanvas2.height = 200;
	var tempContext2 = tempCanvas2.getContext("2d");
	var fc = document.getElementById(targetFrame+"_img");
	var fctx = fc.getContext("2d");
	fc.width = 200;
	fc.height = 200;
	fctx.canvas.width = fctx.canvas.width;
	fctx.strokeStyle="white";
	fctx.fillRect(0,0,ANIMATE_X,ANIMATE_Y);
	var img1;
	var img2;
	trimmingAreaX = x-(ANIMATE_X/2);
	trimmingAreaY = y-(ANIMATE_Y/2);
	img1 = Cto_lc1.getImageData(trimmingAreaX,trimmingAreaY,ANIMATE_X,ANIMATE_Y);
	img2 = Cto_lc2.getImageData(trimmingAreaX,trimmingAreaY,ANIMATE_X,ANIMATE_Y);
	tempContext1.putImageData(img1,0,0);
	tempContext2.putImageData(img2,0,0);

	var tempImage1 = new Image();
	var tempImage2 = new Image();
	tempImage1.src = tempCanvas1.toDataURL();
	tempImage2.src = tempCanvas2.toDataURL();
		/*
	いったん２００×２００のテンプキャンバスに書いて
	データurlにして
	imageにしてdrawimage
	*/
	fctx.fillStyle = "#FFFFFF";
	fctx.fillRect(0,0,ANIMATE_X,ANIMATE_Y);
	var mapImage = mapTransform(fctx);
	fctx.drawImage(tempImage1,0,0);
	fctx.drawImage(tempImage2,0,0);
}

function mapTransform(ctx){
	var e = new jQuery.Event("click");
	e.offsetX = 100;
	e.offsetY = 100;
	$('#canvas_eventCanvas').trigger(e);
}

function draw() {
	toolcanvas.addEventListener("mousedown",function(e){
	},false);
}

function addAnimation(frame){
}

function createAnimation(){
	$("#animeshadow").css('display', 'none').animate({
	opacity:'1'},400,function(){
		encoder = new GIFEncoder();
		encoder.setRepeat(0);
		encoder.setDelay(100);
		encoder.setSize(ANIMATE_X,ANIMATE_Y);
		encoder.start();
		for(count=1;count<=frameCount;count++){
			var frameCanvas = document.getElementById(count+"_img");
			var frameContext = frameCanvas.getContext('2d');
			encoder.addFrame(frameContext);
		}
		encoder.finish();
		document.getElementById("anim").src = 'data:image/gif;base64,'+encode64(encoder.stream().getData());
		$("#animeshadow").css('display', 'none').animate({
		opacity:'0'},200,function(){
			$('#content6').animate({ scrollTop: $("#content6")[0].scrollHeight },400,'swing');
		});
	});
}

