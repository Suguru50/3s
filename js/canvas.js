function canvasSetUp() {
	//キャッチャーの位置調整
	var	canvaswindow     = document.getElementById("canvas_canvas");
	brushcatcher     = document.getElementById("brushcatcher");
	canvaswindow.onscroll = function(){
		$("#brushcatcher").css("-webkit-transform","translate("+canvaswindow.scrollLeft+"px,"+
													canvaswindow.scrollTop+"px");
	};
	
    // Canvas描画に必要な変数を定義する
    //var Cca_w = 2000;
    //var Cca_h = 2000;
    Cca_drawing = false;
    var Cca_oldPos;
	var Cca_brushInfomation = new brushInfomation();
	
	var MouseDownFlg = false;

    // Canvasを初期化する
    //Cto_canvas.width = Cca_w;
    //Cto_canvas.height = Cca_h;
    Cto_c.strokeStyle = "#000000";
    Cto_c.lineWidth = 5;
    Cto_c.lineJoin = "round";
    Cto_c.lineCap = "round";
	mousePointer(2);

    // Canvas上の座標を計算する為の関数たち
    function scrollX(){
	  var div = document.getElementById("canvas_canvas");
      return div.scrollLeft;
    }
    function scrollY(){
	  var div = document.getElementById("canvas_canvas");
      return div.scrollTop;
    }
    function getPos (Cca_event) {
/*
      var Cca_mouseY = (Cca_event.clientY - $(Cto_canvas).position().top)/tool.getPageSize();
      var Cca_mouseX = (Cca_event.clientX - ($(Cto_canvas).position().left-200+
				  parseInt($(canvas_canvas).css('margin-left'),10)))/tool.getPageSize();
*/
		var Cca_mouseY = (Cca_event.clientY + scrollY()-$("#zoomArea").position().top-50)/tool.getPageSize();
		var Cca_mouseX = (Cca_event.clientX + scrollX()-$("#zoomArea").position().left)/tool.getPageSize();
	  //幅が大きくなった場合にposition().leftが大きくならないのが原因
	  //200は左のメニューの開閉クリック領域を含む幅
	  return {x:Cca_mouseX, y:Cca_mouseY};
    }
                                 
    // ここからは、Canvasに描画する為の処理                             
	brushcatcher.addEventListener("mousedown", function (Cca_event) {
      Cca_oldPos = getPos(Cca_event);
	  MouseDownFlg = true;
	    //左クリックの処理
		if(Cca_event.button==0&&!animationMode&&!textstampMode){
			Cca_drawing = true;
			Cca_brushInfomation.brushWidth = Cto_c.lineWidth;
			Cca_brushInfomation.brushColor = Cto_c.strokeStyle;
			Cca_brushInfomation.brushGlobalAlpha = Cto_c.globalAlpha;
			Cca_brushInfomation.brushShadowColor = Cto_c.shadowColor;
			Cca_brushInfomation.brushShadowBlur = Cto_c.shadowBlur;
			Cca_brushInfomation.globalCompositeOperation = Cto_c.globalCompositeOperation;
			//ブラシ用
			Cca_brushInfomation.grad = getGrad();
			Cca_brushInfomation.isBlur = tool.getAirBrushStatus();
			Cca_brushInfomation.layerNum = currentLayer;
		}else if(animationMode){
			setFrame(Cca_oldPos.x,Cca_oldPos.y);
		}else if(textstampMode){
			putTextStamp(Cca_oldPos.x,Cca_oldPos.y,Cto_c.strokeStyle); 
        	Cso_socket.emit("drawTextStamp", {
				x:Cca_oldPos.x
				,y:Cca_oldPos.y
				,text:getT_stamp()
				,alpha:getT_alpha()
				,size:getT_size()
				,font:getT_font()
				,line:getLineValue()
				,fillStyle:Cto_c.strokeStyle});
			Cto_c.globalAlpha = Cca_brushInfomation.brushGlobalAlpha;
		}
		//右クリックの処理
	    if(Cca_event.button==2){
		  mousePointer(3);
	    }
    }, false);
    brushcatcher.addEventListener("mouseup", function (Cca_event) {
	  //canvasのpng保存
      Cca_drawing = false;
	  view(scrollX(),scrollY());
	  MouseDownFlg = false;
	  //右クリックの処理
		if(Cca_event.button==2){
			tool.colorWheel.toolSpuit(Cca_oldPos.x, Cca_oldPos.y);
		}
    }, false);
    brushcatcher.addEventListener("mousemove", function (Cca_event) {
      var Cca_pos = getPos(Cca_event);
      if (Cca_drawing&&!animationMode) {
		  //エアブラシ
		  if(tool.getAirBrushStatus()){
			tool_airbrush(Cca_oldPos.x,Cca_oldPos.y);
		  }
		  //通常
		  else{
        	Cto_c.beginPath();
        	Cto_c.moveTo(Cca_oldPos.x, Cca_oldPos.y);
			Cto_c.lineTo(Cca_pos.x, Cca_pos.y);
			Cto_c.stroke();
			Cto_c.closePath();
		  }
        // socket.IOサーバーに、
        // どの点からどの点までを描画するかをの情報を送付する
		console.log("brushinfo");
		console.dir(Cca_brushInfomation);
        Cso_socket.emit("draw", {start:Cca_oldPos, end:Cca_pos, info:Cca_brushInfomation});
        Cca_oldPos = Cca_pos;
      }
	  //左クリックの処理
	  if(Cca_event.button==2){
          Cca_oldPos = Cca_pos;
		  tool.colorWheel.toolSpuit(Cca_oldPos.x, Cca_oldPos.y);
		  mousePointer(3);
	  }
	  
	  //マウスカーソル変更（重いんだよなぁ）
	  pointerCreate(Cca_pos.x,Cca_pos.y);
	  
    }, false);
    brushcatcher.addEventListener("mouseout", function () {
	  Cca_drawing = false;
    }, false);
	
	brushcatcher.addEventListener("contextmenu" , function(e){
		if(e.preventDefault){
			// デフォルトの動作を無効化する
			e.preventDefault();
		}else{
			// デフォルトの動作を無効化する（アタッチイベント利用時や、InternetExplorer 8 以前の場合）
			return false;
		}
	}, false);
	
	// 描画中にキャンバス外にドラックした際、文字列を選択しない
	$(document).mousemove(function (event) {
		if(MouseDownFlg){
			return false;//文字列選択無効化	
		}
	});
	$(document).mouseup(function (event) {
		if(MouseDownFlg){
			MouseDownFlg = false;	
		}
	});
	
	
	//----①-------


	     
    // socket.IOサーバーから描画情報を受け取った場合の処理
	// 入出時ログ貼り付け
	var img = new Image();
    Cso_socket.on("enterRoomLog", function (Cto_data) {
		if(Object.keys(Cto_data).length){
			//console.debug("入室時ログ再生のてすとです→"+Cto_data);
			//console.debug("2行目→"+Cto_data.image.data);
			img.onload = function(){
				Cto_c.drawImage(img,0,0,2000,2000);
				view(scrollX(),scrollY());
			};
			img.src = Cto_data.image.data;
		}
    });


      // 受け取った情報を元に、Canvasに描画を行う
      Cso_socket.on("draw", function (Cto_brushInfomation) {
		drawLine(Cto_brushInfomation);
      });
      Cso_socket.on("drawTextStamp", function (Cto_textStamp) {
		//var oldColor = Cto_c.strokeStyle;
		setT_alpha(Cto_textStamp.alpha);
		setT_size(Cto_textStamp.size);
		setT_font(Cto_textStamp.font);
		setT_stamp(Cto_textStamp.text);
		onChangeLine(Cto_textStamp.line);
		putTextStamp(Cto_textStamp.x,Cto_textStamp.y,Cto_textStamp.fillStyle); 
		Cto_c.globalAlpha = Cca_brushInfomation.brushGlobalAlpha;
		console.dir(Cto_textStamp);
      });

	  Cso_socket.on("logRequest",function (request){
		console.log("ログのリクエスト要求が着ました");
	  	Cso_socket.emit("png",{png:Cto_canvas.toDataURL(),userID:request.userID});
	  });

	  Cso_socket.on("log",function (log){
		var img = new Image();
		console.log(log.log);
		img.src = log.log;
		img.onload = function(){
			Cto_c.drawImage(img,0,0,2000,2000);
			view(scrollX(),scrollY());
		};
	  });

	  function drawLine(Cto_brushInfomation){
		var oncontext = eval("Cto_lc"+Cto_brushInfomation.info.layerNum+";");
		oncontext.save();
		if(Cto_brushInfomation.info.isBlur){
			var cutR = parseInt((Cto_brushInfomation.info.brushColor).substring(1,3),16);
			var cutG = parseInt((Cto_brushInfomation.info.brushColor).substring(3,5),16);	
			var cutB = parseInt((Cto_brushInfomation.info.brushColor).substring(5,7),16);	
			Cto_brushInfomation.info.grad = 
				oncontext.createRadialGradient(Cto_brushInfomation.end.x,Cto_brushInfomation.end.y,
				0,Cto_brushInfomation.end.x,Cto_brushInfomation.end.y,Cto_brushInfomation.info.brushWidth/2);
			Cto_brushInfomation.info.grad.addColorStop(0, "rgba("+cutR+","+cutG+","+cutB+","+"0.5)");
        	Cto_brushInfomation.info.grad.addColorStop(1, "rgba("+cutR+","+cutG+","+cutB+","+"0)");
			oncontext.globalCompositeOperation = Cto_brushInfomation.info.globalCompositeOperation;//変更点１
			oncontext.beginPath();
			oncontext.fillStyle = Cto_brushInfomation.info.grad;
			oncontext.arc(Cto_brushInfomation.end.x,Cto_brushInfomation.end.y,Cto_brushInfomation.info.brushWidth/2,0,Math.PI*2,false);
			oncontext.fill();
			oncontext.closePath();
		}else{
			oncontext.strokeStyle = Cto_brushInfomation.info.brushColor;
			oncontext.lineWidth = Cto_brushInfomation.info.brushWidth;
			oncontext.globalCompositeOperation = Cto_brushInfomation.info.globalCompositeOperation;
			oncontext.globalAlpha = Cto_brushInfomation.info.brushGlobalAlpha;
			oncontext.shadowBlur = Cto_brushInfomation.info.brushShadowBlur;
			oncontext.shadowColor = Cto_brushInfomation.info.brushShadowColor;
			oncontext.beginPath();
			oncontext.moveTo(Cto_brushInfomation.start.x, Cto_brushInfomation.start.y);
			oncontext.lineTo(Cto_brushInfomation.end.x, Cto_brushInfomation.end.y);
			oncontext.stroke();
			oncontext.closePath();
		}
		oncontext.restore();
	  }
	  function changeLineWidth(Cto_data){
        Cto_c.lineWidth = Cto_data;
	  }
	  function changeColor(Cto_data){
        Cto_c.strokeStyle = Cto_data;
	  }
                        
	//----①-------
	
	
	//キャンバスのスクロール初期値
	//中心あたりを表示
	var MAX_scrollX = canvaswindow.scrollWidth - document.getElementById("canvas_canvas").getBoundingClientRect().width;
	var MAX_scrollY = canvaswindow.scrollHeight - document.getElementById("canvas_canvas").getBoundingClientRect().height;
	canvaswindow.scrollTop = MAX_scrollY/2;
	canvaswindow.scrollLeft = MAX_scrollX/2;
}


