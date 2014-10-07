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
    // 色や太さを選択した場合の処理
    // 選択した結果を、this.canvasに設定
	this.colorWheel = new ColorWheel();//インスタンスをつくってる。AAMInterface.jsにあった。40行目くらい
	this.colorWheel.wheelInit(document.getElementById("colorWheelContainer"), 200, 200,context);
	this.colorWheel.pickerInit(document.getElementById("colorWheelContainer"));
	
	$("#tool_eraser").click(function () {
		if(context.globalCompositeOperation === "source-over"){
	  		context.globalCompositeOperation = "destination-out";
		}else if(context.globalCompositeOperation === "destination-out"){
	  		context.globalCompositeOperation = "source-over";
		}
	});

    $("#tool_clear").click(function(){
		if(confirm("消す？")){
			this.clearAll(Cto_canvas,Cto_c);
			Cso_socket.emit("clearAll",{value:""});
			view();
		}
	}.bind(this));

	$("#tool_airbrush").click(function(){
		if(this.airBrush == false){
			this.airBrush = true;
		}else if(this.airBrush == true){
			this.airBrush = false;
		}
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



