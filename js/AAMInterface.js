// JavaScript Document
//以下、全体的にprototype宣言を使ってプロトタイプベース
//といわれる書き方をしてるらしい
/*
---------------------------------
	Geometric classes
---------------------------------
*/
var Rectangle = function(x,y,w,h){
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
}
Rectangle.prototype.x;
Rectangle.prototype.y;
Rectangle.prototype.w;
Rectangle.prototype.h;

Rectangle.prototype.contains = function(x,y)
{
	if(x>=this.x && x<=this.x+this.width && y>=this.y && y<= this.y+this.height){
		return true;
	}
	return false;
}


/*
---------------------------------
	UI classes
---------------------------------
*/
/*
------------------------------------------------------
	 Color Wheel
------------------------------------------------------
*/

var ColorWheel = function(){}//クラス定義。中身を以下prototypeで宣言
ColorWheel.onchange;//内容が変化したときに呼ばれる？
					//これにprototypeがついてない理由がわからん
//以下prototypeオブジェクト
//ColorWheelクラスにメンバ変数を定義してると思っていいっぽい
//ColorWheel.prototype._elementはjavaでいったら
//class ColorWheel{
//		String element;	
//}
//みたいなもの？

ColorWheel.prototype._element;
ColorWheel.prototype._canvas;
ColorWheel.prototype._ctx;
ColorWheel.prototype._canvasctx;
ColorWheel.prototype._tempCanvas;
ColorWheel.prototype._tempCtx;
ColorWheel.prototype._frontCanvas;
ColorWheel.prototype._backCanvas;
ColorWheel.prototype._wheelLineWidth = 16;
ColorWheel.prototype._pickerRect;
ColorWheel.prototype.rgbColor;
ColorWheel.prototype.callback;

//Which are you dragging
ColorWheel.prototype._wheelRad = 0;
ColorWheel.prototype._rectX = 0;
ColorWheel.prototype._rectY = 0;
ColorWheel.prototype._mouseX;
ColorWheel.prototype._mouseY;
ColorWheel.prototype._isMouseDownForWheel = false;
ColorWheel.prototype._isMouseDownForRect = false;
ColorWheel.prototype._current = 0;
ColorWheel.prototype._color1 = 0;
ColorWheel.prototype._color2 = 0;
//Colorpicker用
ColorWheel.prototype._colorarray;
ColorWheel.prototype._cellarray;
ColorWheel.prototype._rowarray;
var colorarrayrgb;

//追加したやつ
//ColorWheel.prototype._current = 0;//１が手前(index)
//ColorWheelクラスのコンストラクタ定義
ColorWheel.prototype.wheelInit = function(element, w, h,canvasContext){
	this._element = element;
	//htmlのほうを見るとわかるがそっちにcanvasはない。
	//だからこっから作る。なぜそういう作りなのかは不明。
	//個人的にはcanvasそのものをhtml側に置いて色々できたほうが
	//全体のつくりとして統一感があっていい気がするからその辺要相談
	this._tempCanvas = document.createElement("canvas");
	this._tempCanvas.width = w;		
	this._tempCanvas.height = h;
	this._tempCtx = this._tempCanvas.getContext("2d");
	//this._tempCanvas.style.zIndex = '1';

	
	this._canvas = document.createElement("canvas");
	this._canvas.width = w;
	this._canvas.height = h;
	this._ctx = this._canvas.getContext("2d");
	
	this._canvasctx = canvasContext;
	
	//this._canvas.style.position = 'absolute';
	//this._canvas.style.zIndex = '1';
	element.appendChild(this._canvas);
	this._canvas.oncontextmenu= function(){ return false}
	/* this._canvas.addEventListener( "mousedown" , function (e) {
  alert("イベント３の追加")
} , false ); */

//ためし
	this._frontcanvas = document.createElement("canvas");
	this._frontcanvas.width = 28;
	this._frontcanvas.height = 28;
	this._frontcanvas.style.top = '200px';
	this._frontcanvas.style.left = '15px';
	this._frontctx = this._frontcanvas.getContext("2d");
	this._frontcanvas.style.position = 'absolute';
	this._frontcanvas.style.zIndex = '2';
	element.appendChild(this._frontcanvas);
	this._frontcanvas.addEventListener( "click" ,function(){
		console.log("aaa1"); 
		this._current=1;
		console.log("frontclick時thiscolor1"+this.color1);
		this.callback(this._color1,this._canvasctx)}.bind(this), false );
//ためし

	this._backcanvas = document.createElement("canvas");
	this._backcanvas.width = 28;
	this._backcanvas.height = 28;
	this._backctx = this._backcanvas.getContext("2d");
	//this._backcanvas.style.top = '83px';
	//this._backcanvas.style.left = '83px';
	this._backcanvas.style.marginTop = '13px';
	this._backcanvas.style.marginLeft = '16px';
	this._backcanvas.style.display = 'inline';
	//this._backcanvas.style.position = 'absolute';
	this._backcanvas.style.zIndex = '1';
	element.appendChild(this._backcanvas);
	this._backcanvas.addEventListener( "click" ,function(){
		console.log("aaa2");
		this._current=2 ;
		
		this.callback(this._color2,this._canvasctx)}.bind(this), false );	
	
	var wh = w*0.5;
	var hh = h*0.5;
	var ctx = this._tempCtx;
	var data = ctx.createImageData(w,h);//以下tempCanvasに色相環描画
	for(var yy=0; yy<h; yy++)
	{
		for(var xx=0; xx<w; xx++)
		{
			var index = (yy*w + xx)*4;
			var rad = Math.atan2(yy-wh,xx-hh);
			var col = ColorUtil.hsb2rgb(rad*180/Math.PI+150, 100,100);
			data.data[index] = col.r;
			data.data[index+1] = col.g;
			data.data[index+2] = col.b;
			data.data[index+3] = 255;
		}
	}
	ctx.putImageData(data,0,0);
	ctx.lineWidth = 3;
	ctx.beginPath();
	var startAngle = 0;
	var endAngle = Math.PI * 2;
	ctx.arc(wh, hh, 100, startAngle, endAngle, false);
	ctx.stroke();
	
	//Init Inner Rect Info
	w = Math.floor((this._canvas.width-32) / 1.41421356);
	h = w;
	var xoffset = this._canvas.width * 0.5 - w*0.5;
	var yoffset = this._canvas.height*0.5 - h*0.5;
	
	this._pickerRect = new Rectangle(xoffset, yoffset, w, h);
	this._rectY = this._pickerRect.height;
	this.rgbColor = new RGBColor(0,0,0);
	
	var ref = this;
	this._canvas.onmousedown = function(e){ ref._downHandler(e) }//
	//mousedown時に↓のほうで定義されてるハンドラーを呼ぶように
	this._updateView();//下で定義されてる_update～系関数を全部呼んで全体描画
}

ColorWheel.prototype.setRGB = function(r, g, b)
{
	var hsb = ColorUtil.rgb2hsb(r,g,b);
	//
	this._wheelRad = this._hue2rad(hsb.h);
	this._rectX = this._sat2x(hsb.s);
	this._rectY = this._bri2y(hsb.b);
	
	this._updateColor();
}

ColorWheel.prototype._downHandler = function(e)
{
	var ref = this;
	window.onmouseup = function(e){ ref._upHandler(e) }
	window.onmousemove = function(e){ ref._moveHandler(e) }
	
	var rect = e.target.getBoundingClientRect();
	this._mouseX = (e.clientX - rect.left)
	this._mouseY = (e.clientY - rect.top)
	var w = this._canvas.width;
	var h = this._canvas.height;
	var mx = this._mouseX;
	var my = this._mouseY;
	
	var dx = mx - w *0.5;
	var dy = my - h *0.5;
	var dist = Math.sqrt(dx*dx+dy*dy);
	
	if(dist<w*0.5  && dist >w*0.5-this._wheelLineWidth ){
		//Dragging Wheel
		this._isMouseDownForWheel = true;
		this._calcWheel();
	}else if(this._pickerRect.contains(mx,my)){
		//console.log("rect");
		this._isMouseDownForRect = true;
		this._calcRect();
	}else{
		//Nowhere
	}
}
ColorWheel.prototype._upHandler = function(e)
{
	this._isMouseDownForWheel = false;
	this._isMouseDownForRect = false;
	window.onmouseup = undefined;
	window.onmousemove = undefined;
}
ColorWheel.prototype._moveHandler = function(e)
{
	var rect = this._canvas.getBoundingClientRect();//要素の絶対座標を取得。
												//その要素が今画面のどこにいるのかを取得
	this._mouseX = (e.clientX - rect.left);
	this._mouseY = (e.clientY - rect.top);
	
	if(this._isMouseDownForWheel){
		this._calcWheel();
	}else if(this._isMouseDownForRect){
		this._calcRect();
	}
}

ColorWheel.prototype._calcWheel = function(e)
{
	//クリックされた位置が円のどの角度にあたるかを計算しし、wheelradにいれてる
	//式の意味は分からんちん。
	var mx = this._mouseX;
	var my = this._mouseY;
	var w = this._canvas.width;
	var h = this._canvas.height;
	var rad = Math.atan2(my-h*0.5, mx-w*0.5);
	this._wheelRad = rad;
	
	this._updateColor();
}

ColorWheel.prototype._calcRect = function(e)
{
	//クリックされた位置？
	var x = this._mouseX - this._pickerRect.x
	var y = this._mouseY - this._pickerRect.y
	
	var l = 0
	var t = 0
	var r = this._pickerRect.width;
	var b = this._pickerRect.height;
	
	x = Math.max(l,Math.min(r,x));
	y = Math.max(t,Math.min(b,y));
	
	this._rectX = x
	this._rectY = y
	
	this._updateColor();
}

ColorWheel.prototype._updateColor = function(e)

{
	var hsb = new HSBColor(0,0,0);
	hsb.h = this._rad2hue(this._wheelRad);//色相が360段階なので角度に対応
	hsb.s = this._x2sat(this._rectX);
	hsb.b = this._y2bri(this._rectY);
	
	//console.log(hsb.h, hsb.s, hsb.b);
	var newCol = ColorUtil.hsb2rgb(hsb.h, hsb.s, hsb.b);//ColorUtilにある色変換関数
	
	if(this.rgbColor && this.rgbColor.r==newCol.r && this.rgbColor.g==newCol.g && this.rgbColor.b==newCol.b){
		this._updateView();
		return;
	}
	this.rgbColor = newCol;
	this._updateView();
	
	if(this.onchange)
		this.onchange(this);
}


ColorWheel.prototype._updateView = function()
{
	this._drawColorWheel();
	this._drawColorRect();
	this._drawWheelPoint();
	this._drawPickerPoint();
	
	if(this._current==1){
		 console.log("Hello world1dayio"+this._current);
		this._color1 = this._drawfrontColor(this._frontctx);
	}else if(this._current==2){
		 console.log("Hello world2dayio"+this._current);
		this._color2 = this._drawfrontColor(this._backctx);
	}else if(this._current==0){
		 console.log("Hello world0dayio"+this._current);
		this._color1 = this._drawfrontColor(this._frontctx);
		this._color2 = this._drawfrontColor(this._backctx);
		this._current = 1;
	}
}

ColorWheel.prototype._drawfrontColor = function(context)//左下の描画色
{
	if(!this.rgbColor)	return;
		
	var w = this._canvas.width;
	var h = this._canvas.height;
	var ctx = context;
	//context.save();
	if(this._current==0){
				this._frontctx.lineWidth = "2";
				this._frontctx.strokeStyle = "#87CEEB";
				this._frontctx.strokeRect(1,1,26,26);
				this._backctx.lineWidth = "2";
				this._backctx.strokeStyle = "#000000";
				this._backctx.strokeRect(1,1,26,26);

	}
	//context.fillStyle = "#000000";
	//context.fillRect(1,1,26,26);
	context.fillStyle = "#ffffff";
	context.fillRect(2,2,24,24);
	context.fillStyle = this.rgbColor.cssString();

	if(this._current==1){
		this._color1 = ColorUtil.colorStyle(this.rgbColor.r,this.rgbColor.g,this.rgbColor.b);
		console.dir(this.rgbColor);
		console.log("color1" + this._color1);
		this._canvasctx.strokeStyle = this._color1;
		context.fillRect(3,3,22,22);
		return this._color1;
	}else if(this._current==2){
		this._color2 = ColorUtil.colorStyle(this.rgbColor.r,this.rgbColor.g,this.rgbColor.b);
		console.log("color2" + this._color2);
		this._canvasctx.strokeStyle = this._color2
		context.fillRect(3,3,22,22);
		return this._color2;
	}else if(this._current==0){
		this._canvasctx.strokeStyle = ColorUtil.colorStyle(this.rgbColor.r,this.rgbColor.g,this.rgbColor.b);
		context.fillRect(3,3,22,22);
		return ColorUtil.colorStyle(this.rgbColor.r,this.rgbColor.g,this.rgbColor.b);
	}
	console.log("hontonikanpeki:"+ColorUtil.colorStyle(this.rgbColor.r,this.rgbColor.g,this.rgbColor.b))
	//context.fillRect(3,3,22,22);
	//context.restore();
}

ColorWheel.prototype._drawColorWheel = function()
{
	var ctx = this._ctx;
	var w = this._canvas.width;
	var h = this._canvas.height;
	var ringLineW = this._wheelLineWidth;
	
	ctx.clearRect(0,0,w,h);
	
	//Draw Color Ring
	ctx.save();
		ctx.beginPath();
		ctx.arc(w*0.5, h*0.5, w*0.5, 0, Math.PI * 2, false);
		ctx.clip()
		ctx.closePath();
		this._ctx.drawImage(this._tempCanvas, 0, 0);
	ctx.restore();
	
	//Draw InnerCircle
	ctx.save();
	ctx.fillStyle = "#ffffff"
	ctx.beginPath();
	ctx.arc(w*0.5, h*0.5, w*0.5-ringLineW, 0, Math.PI * 2, false);
	ctx.fill();
	ctx.restore();
}

ColorWheel.prototype._drawColorRect = function(){
	var w = Math.floor((this._canvas.width-32) / 1.41421356);
	var h = w;
	var xoffset = this._canvas.width * 0.5 - w*0.5;
	var yoffset = this._canvas.height*0.5 - h*0.5;
	
	var ctx = this._ctx;
	var imgData = ctx.createImageData(w,h);
	
	var hsb = new HSBColor(100,100,100);
	hsb.h = this._rad2hue( this._wheelRad );
	for(var yy=0; yy<h; yy++)
	{
		for(var xx=0; xx<w; xx++)
		{
			hsb.s = xx/w*100;
			hsb.b = 100-(yy/h*100);
			//console.log(hsb);
			var rgb = ColorUtil.hsb2rgb(hsb.h, hsb.s, hsb.b);
			var index = (yy * w + xx)*4;
			imgData.data[index] = rgb.r;
			imgData.data[index+1] = rgb.g;
		 	imgData.data[index+2] = rgb.b;
			imgData.data[index+3] = 255
		}
	}
	ctx.putImageData(imgData,xoffset,yoffset);
}

ColorWheel.prototype._drawPickerPoint = function()
{
	this._drawRing(this._rectX + this._pickerRect.x, this._rectY+this._pickerRect.y);
}

ColorWheel.prototype._drawWheelPoint = function()
{
	var r = this._canvas.width*0.5;
	var w = this._wheelLineWidth*0.5;
	var x = Math.cos(this._wheelRad)*(r-w) + r;
	var y = Math.sin(this._wheelRad)*(r-w) + r;
	this._drawRing(x,y);
}

ColorWheel.prototype._drawRing = function(x,y)
{
	var r = this._canvas.width*0.5;
	
	var ctx = this._canvas.getContext("2d");
	ctx.save();
	var w = this._wheelLineWidth*0.5;
	
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.strokeStyle = "#000000";
	ctx.arc(x+1,y+1,w-1, 0,Math.PI*2, false);
	ctx.closePath();
	ctx.stroke();
	ctx.strokeStyle = "#ffffff";
	ctx.beginPath();
	ctx.arc(x,y,w-1, 0,Math.PI*2, false);
	ctx.closePath();
	ctx.stroke();
	ctx.restore();
}


//convert functions

ColorWheel.prototype._rad2hue = function(rad)
{
	return rad * 180 / Math.PI + 150;
}

ColorWheel.prototype._hue2rad = function(hue)
{
	var rad = (hue-150)*Math.PI / 180;
	if(rad<0)
		rad += Math.PI*2
	return rad;
}

ColorWheel.prototype._x2sat = function(x)
{
	x = Math.max(0, Math.min(this._pickerRect.width, x));
	
	return x / this._pickerRect.width * 100;
}

ColorWheel.prototype._sat2x = function(sat)
{
	if(!this._pickerRect)
		return 0;
	
	sat = Math.max(0, Math.min(100, sat));
	var x = sat / 100 * this._pickerRect.width;
	return x;
}

ColorWheel.prototype._y2bri = function(y)
{
	y = Math.max(0, Math.min(this._pickerRect.height, y));
	return  100 - y / this._pickerRect.height * 100;
}

ColorWheel.prototype._bri2y = function(bri)
{
	if(!this._pickerRect)
		return 0;
		
	bri = Math.max(0, Math.min(100,bri));
	var y= (100-bri) / 100 * this._pickerRect.height;
	return y;
}
ColorWheel.prototype.callback = function(color,ctx){
			console.log("コールバック");
			ctx.strokeStyle = color;
			console.log(color);
			
			if(this._current==1){
			 	console.log("1change"+this._current);	
				this._backctx.strokeStyle = "#000000";
				this._backctx.strokeRect(1,1,26,26);
				this._frontctx.lineWidth = "2";
				this._frontctx.strokeStyle = "#87CEEB";
				this._frontctx.strokeRect(1,1,26,26);
			}else if(this._current==2){
		 		console.log("2change"+this._current);
				this._frontctx.strokeStyle = "#000000";
				this._frontctx.strokeRect(1,1,26,26);	
				this._backctx.lineWidth = "2";
				this._backctx.strokeStyle = "#87CEEB";
				this._backctx.strokeRect(1,1,26,26);
			}
}

//こっからカラーピッカー

ColorWheel.prototype.pickerInit = function(element){
	//this._element = element;
	this._Table = document.createElement("TABLE");
	this._Table.style.display = "inline-table";

	this._colorarray = new Array(16) ;
		this._colorarray[0] = "#000000" ;
		this._colorarray[1] = "#FF0000" ;
		this._colorarray[2] = "#FF9900" ;
		this._colorarray[3] = "#FFFF00" ;
		this._colorarray[4] = "#00FF00" ;
		this._colorarray[5] = "#0000FF" ;
		this._colorarray[6] = "#9900FF" ;
		this._colorarray[7] = "#FF00FF" ;
		
		this._colorarray[8] = "#999999" ;
		this._colorarray[9] = "#FF8888";
		this._colorarray[10] = "#FFCC88" ;
		this._colorarray[11] = "#FFFF88" ;
		this._colorarray[12] = "#88FF88" ;
		this._colorarray[13] = "#8888FF" ;
		this._colorarray[14] = "#CC88FF" ;
		this._colorarray[15] = "#FF88FF" ;
	//var row = document.createElement("tr"); //3
	this._cellarray = new Array(10);
	this._rowarray = new Array(2)

	for(var i=0; i<2; i++){
		this._rowarray[i] = document.createElement("tr");
		//this._rowarray[i].style.display = "inline";
		for(var j=0+(8*i); j<8*(i+1); j++){
			this._cellarray[j] = document.createElement("td");
			this._cellarray[j].style.backgroundColor = this._colorarray[j];
			this._cellarray[j].setAttribute("class","itsumono");
			this._cellarray[j].style.table
			Layout = "fixed";
			this._cellarray[j].setAttribute("width","15");
			this._cellarray[j].setAttribute("text-align","center");
			//this._cellarray[j].addEventListener( "click" ,function(){getCellColor(this)}, false );
			this._cellarray[j].setAttribute("onclick","tool.colorWheel.colorclick(this)");
			/*this._cellarray[j].addEventListener( "click" ,function(){
				
				var colortestrgb = this.style.backgroundColor;
				colorarrayrgb = colortestrgb.split(",");
				colorarrayrgb[0] = colorarrayrgb[0].replace("rgb(","");
				colorarrayrgb[2] = colorarrayrgb[2].replace(")","");
				alert("色："+colorarrayrgb[0] + colorarrayrgb[1] + colorarrayrgb[2]);
				var testes = ColorUtil.colorStyle(colorarrayrgb[0],colorarrayrgb[1],colorarrayrgb[2]);
				console.log("testesの値" + colorarrayrgb[0] + colorarrayrgb[1] + colorarrayrgb[2]);
				this._canvasctx.strokeStyle = ColorUtil.colorStyle(colorarrayrgb[0],colorarrayrgb[1],colorarrayrgb[2]);
				//console.log("hontonikanpekiver2:"+ColorUtil.colorStyle(this.rgbColor.data[0],this.rgbColor.data[1],this.rgbColor.data[2]))
				//context.fillRect(3,3,22,22);
				//return ColorUtil.colorStyle(this.rgbColor.data[0],this.rgbColor.data[1],this.rgbColor.data[2]);
				
				}.bind(this), false );*/
			console.log("i="+i);
			console.log("j="+j);
			this._rowarray[i].appendChild(this._cellarray[j]);
			console.log("width="+this._cellarray[i].getAttribute("width")+"color="+this._cellarray[j].style.backgroundColor);
		}
		
		this._rowarray[i].setAttribute("height","15");
		this._rowarray[i].setAttribute("width","15");
		//this._rowarray[i].style.tableLayout = "fixed";
		this._Table.appendChild(this._rowarray[i]); //8
		
	}

	element.appendChild(this._Table);
	
}

ColorWheel.prototype.getCellColor = function (Cell) {

}
ColorWheel.prototype.colorclick = function (cell) {
			
				var colortestrgb = cell.style.backgroundColor;
				colorarrayrgb = colortestrgb.split(",");
				colorarrayrgb[0] = colorarrayrgb[0].replace("rgb(","");
				colorarrayrgb[2] = colorarrayrgb[2].replace(")","");
				//alert("色："+colorarrayrgb[0] + colorarrayrgb[1] + colorarrayrgb[2]);
				colorarrayrgb[0] = parseInt(colorarrayrgb[0]).toString(16);
				colorarrayrgb[1] = parseInt(colorarrayrgb[1]).toString(16);
				colorarrayrgb[2] = parseInt(colorarrayrgb[2]).toString(16);
				//var testes = ColorUtil.colorStyle(colorarrayrgb[0],colorarrayrgb[1],colorarrayrgb[2]);
				
			if((this._current == 1)||(this._current ==0)){
				this._color1 = ColorUtil.colorStyle(colorarrayrgb[0],colorarrayrgb[1],colorarrayrgb[2]);
				this._canvasctx.strokeStyle = this._color1;
				this._frontctx.fillStyle = this._color1;
				this._frontctx.fillRect(3,3,22,22);
				console.log("セル栗九時this.color1"+this._color1)
			}else if(this._current == 2){
				this._color2= ColorUtil.colorStyle(colorarrayrgb[0],colorarrayrgb[1],colorarrayrgb[2]);
				this._canvasctx.strokeStyle = this._color2;
				this._backctx.fillStyle = this._color2;
				this._backctx.fillRect(3,3,22,22);
				console.log(this._current)
			}

}
ColorWheel.prototype.toolSpuit = function(x,y){
	spuitImage = Cto_c.getImageData(x,y, 1, 1);
	r = spuitImage.data[0];
	g = spuitImage.data[1];
	b = spuitImage.data[2];
	a = spuitImage.data[3];
	if(a==0){
		r = 255;
		g = 255;
		b = 255;
	}
	console.log(r,g,b);

	if(this._current == 1){
		this._color1 = ColorUtil.colorStyle(r,g,b);
		this._canvasctx.strokeStyle = this._color1;
		this._frontctx.fillStyle = this._color1;
		this._frontctx.fillRect(3,3,22,22);
	}else if(this._current == 2){
		this._color2= ColorUtil.colorStyle(r,g,b);
		this._canvasctx.strokeStyle = this._color2;
		this._backctx.fillStyle = this._color2;
		this._backctx.fillRect(3,3,22,22);

	}
}
