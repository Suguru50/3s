var Tool = function(){}

Tool.prototype.airBrush = false;
Tool.prototype.canvas;
Tool.prototype.c_context;
Tool.prototype.pageSize;
Tool.prototype.colorWheel;

Tool.prototype.clearAll = function(canvas,context){
	context.clearRect(0,0,canvas.width,canvas.height);
}

Tool.prototype.toolSetUp = function(canvas,context) {

	this.pageSize = 1;
	this.canvas = canvas;
	this.c_context = context;
    // 色や太さを選択した場合の処理
    // 選択した結果を、this.canvasに設定
	this.colorWheel = new ColorWheel();//インスタンスをつくってる。AAMInterface.jsにあった。40行目くらい
	this.colorWheel.wheelInit(document.getElementById("colorWheelContainer"), 200, 200,this.c_context);
	this.colorWheel.pickerInit(document.getElementById("colorWheelContainer"));

	
	$("#tool_eraser").click(function () {
		console.log("kesiosi")
		this.canvas = getCurrentCanvas();
		this.c_context = getCurrentContext();
	  	this.c_context.globalCompositeOperation = "destination-out";
	}.bind(this));
	
	$("#tool_eraser2").click(function () {
		console.log("kesiosi2")
		this.canvas = getCurrentCanvas();
		this.c_context = getCurrentContext();
	  	this.c_context.globalCompositeOperation = "source-over";
	}.bind(this));

    $("#tool_clear").click(function(){
		if(confirm("消す？")){
			this.clearAll(Cto_canvas,Cto_c);
			Cso_socket.emit("clearAll",{value:""});
			view();
		}
	}.bind(this));

	$("#tool_airbrush").click(function(){
			this.airBrush = true;
	}.bind(this));
	
	$("#tool_airbrush2").click(function(){
			this.airBrush = false;
	}.bind(this));
	
	var eraser = $("input[name=eraser]");

	eraser.on("change", function(e){
    // 一旦全てのlabel要素からselectedクラスを除去
	if($(e.target).hasClass("selected")){
		$(e.target).removeClass("selected");
		$("#erasericon").attr("src","images/eraser.png");
	}else{
		    // 選択されたラジオボタンの親のlabelにselectedクラスを設定
    	$(e.target).addClass("selected");
		$("#erasericon").attr("src","images/selecteraser.png");

	}});


	// 選択状態を初期化する
	eraser.filter(":checked").trigger("change");
//air
	var air = $("input[name=air]");

	air.on("change", function(e){
    // 一旦全てのlabel要素からselectedクラスを除去
	if($(e.target).hasClass("selected")){
		$(e.target).removeClass("selected");
		$("#brushicon").attr("src","images/brush.png");
	}else{
		    // 選択されたラジオボタンの親のlabelにselectedクラスを設定
    	$(e.target).addClass("selected");
		$("#brushicon").attr("src","images/selectbrush.png");
	}});


	// 選択状態を初期化する
	air.filter(":checked").trigger("change");
}


Tool.prototype.getAirBrushStatus = function(){
	return this.airBrush;
}

Tool.prototype.getPageSize = function(){
	return this.pageSize;
}

Tool.prototype.setPageSize = function(size){
	this.pageSize = size;
}

//----②-------

//テキストスタンプ
var textstampMode = false;
var CS_flg = 1;
var t_line = 1;
var t_stamp
var t_size 
var t_font 
var t_alpha
function onChangeLine(value) {
	t_line = value;
}

var s_form;

function CreateStamp() {
	switch(CS_flg){
	case 1 :
		s_form = document.forms.id_textStampForm;
		t_stamp = s_form.id_textStamp.value;
		t_size = s_form.id_textSize.value;
		t_font = s_form.id_textFont.value;
		t_alpha = s_form.id_textAlpha.value;
		mousePointer(6);
		textstampMode = true;
		CS_flg = 2;
		break;
	case 2:
		mousePointer(2);
		textstampMode = false;
		CS_flg = 1;
		break;
	}

}

function lineChange(context,text,x,y) {
	//渡されたtextを\nで分割
	var textlist = text.split("\n");
	//一文字の幅を取得
	var lineHeight = context.measureText("＿").width;
	//一行をさらに forEach で一文字ずつ取得
	textlist.forEach(function(elm, i) {
		Array.prototype.forEach.call(elm, function(ch, j) {
		//measureTextで取得した文字幅ずつy座標をずらす
		//改行ごとにx座標をずらし描画
			 context.fillText(ch, x-lineHeight*i, y+lineHeight*j);
		});
	});
}

function putTextStamp(x,y,color){ 
	Cto_c.globalAlpha = t_alpha; 
	Cto_c.font = t_size+"px "+t_font; 
	Cto_c.fillStyle = color; 
	switch(t_line){
		case 1 : 
			Cto_c.fillText(t_stamp,x,y);
			break;
		case 2 : 
			lineChange(Cto_c,t_stamp,x,y);
			break;
	} 
	textstampMode = false;
	CS_flg = 1;
}

function getT_alpha(){
	return t_alpha;
}

function getT_font(){
	return t_font;
}

function getT_size(){
	return t_size;
}
function getT_stamp(){
	return t_stamp;
}

function setT_alpha(alpha){
	t_alpha = alpha;
}

function setT_font(font){
	t_font = font;
}
function setT_size(size){
	t_size = size;
}
function setT_stamp(text){
	t_stamp = text;
}

