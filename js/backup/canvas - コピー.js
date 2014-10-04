window.addEventListener("load", function () {
  //------
    // Canvas描画に必要な変数を定義する
    var Cca_w = 2000;
    var Cca_h = 2000;
    Cca_drawing = false;
    var Cca_oldPos;
	var Cca_brushInfomation = new brushInfomation();

    // Canvasを初期化する
    Cto_canvas.width = Cca_w;
    Cto_canvas.height = Cca_h;
    Cto_c.strokeStyle = "#000000";
    Cto_c.lineWidth = 5;
    Cto_c.lineJoin = "round";
    Cto_c.lineCap = "round";

    // Canvas上の座標を計算する為の関数たち
    function scrollX(){
      return document.documentElement.scrollLeft || document.body.scrollLeft;
    }
    function scrollY(){
      return document.documentElement.scrollTop || document.body.scrollTop;
    }
    function getPos (Cca_event) {
      var Cca_mouseX = Cca_event.clientX - $(Cto_canvas).position().left + scrollX();
      var Cca_mouseY = Cca_event.clientY - $(Cto_canvas).position().top + scrollY();
      return {x:Cca_mouseX, y:Cca_mouseY};
    }
    function getPosT (Cca_event) {
      var Cca_mouseX = Cca_event.touches[0].clientX - $(Cto_canvas).position().left + scrollX();
      var Cca_mouseY = Cca_event.touches[0].clientY - $(Cto_canvas).position().top + scrollY();
      return {x:Cca_mouseX, y:Cca_mouseY};
    }
                                 
    // ここからは、Canvasに描画する為の処理                             
    Cto_canvas.addEventListener("mousedown", function (Cca_event) {
      Cca_drawing = true;
      Cca_oldPos = getPos(Cca_event);
    }, false);
    Cto_canvas.addEventListener("mouseup", function () {
	  //canvasのpng保存
	  var Cca_png = Cto_canvas.toDataURL();
	  Cso_socket.emit("png",{data:Cca_png});
      Cca_drawing = false;
    }, false);
    Cto_canvas.addEventListener("mousemove", function (Cca_event) {
      var Cca_pos = getPos(Cca_event);
      if (Cca_drawing) {
        Cto_c.beginPath();
        Cto_c.moveTo(Cca_oldPos.x, Cca_oldPos.y);
        Cto_c.lineTo(Cca_pos.x, Cca_pos.y);
        Cto_c.stroke();
        Cto_c.closePath();
        // socket.IOサーバーに、
        // どの点からどの点までを描画するかをの情報を送付する
		Cca_brushInfomation.brushWidth = Cto_c.lineWidth;
		Cca_brushInfomation.brushColor = Cto_c.strokeStyle;
		Cca_brushInfomation.globalCompositeOperation = Cto_c.globalCompositeOperation;
        Cso_socket.emit("brushInfo", {info:Cca_brushInfomation});
        Cso_socket.emit("draw", {start:Cca_oldPos, end:Cca_pos});
        Cca_oldPos = Cca_pos;
      }
    }, false);
    Cto_canvas.addEventListener("mouseout", function () {
	  Cca_drawing = false;
    }, false);
	//----①-------


	     
    // socket.IOサーバーから描画情報を受け取った場合の処理
	// 入出時ログ貼り付け
    Cso_socket.on("enterRoomLog", function (Cto_data) {
		console.debug("数字→"+Object.keys(Cto_data).length);
		if(Object.keys(Cto_data).length){
			console.debug("入室時ログ再生のてすとです→"+Cto_data);
			console.debug("2行目→"+Cto_data.image.data);
			var img = new Image();
			img.onload = function(){
				Cto_c.drawImage(img,0,0,2000,2000);
			};
			img.src = Cto_data.image.data;
		}
    });

      // 受け取った情報を元に、Canvasに描画を行う
      Cso_socket.on("draw", function (Cto_brushInfomation) {
		drawLine(Cto_brushInfomation);
      });

	  function drawLine(Cto_brushInfomation){
		var color = Cto_c.strokeStyle;
		var width = Cto_c.lineWidth;
		var globalCompositeOperation = Cto_c.globalCompositeOperation;
		Cto_c.strokeStyle = Cto_brushInfomation.brushColor;
		Cto_c.lineWidth = Cto_brushInfomation.brushWidth;
		Cto_c.globalCompositeOperation = Cto_brushInfomation.globalCompositeOperation;
        Cto_c.beginPath();
        Cto_c.moveTo(Cto_brushInfomation.brushPointData.start.x, Cto_brushInfomation.brushPointData.start.y);
        Cto_c.lineTo(Cto_brushInfomation.brushPointData.end.x, Cto_brushInfomation.brushPointData.end.y);
        Cto_c.stroke();
        Cto_c.closePath();
		Cto_c.strokeStyle = color;
		Cto_c.lineWidth = width;
		Cto_c.globalCompositeOperation = globalCompositeOperation;
	  }
	  function changeLineWidth(Cto_data){
        Cto_c.lineWidth = Cto_data;
	  }
	  function changeColor(Cto_data){
        Cto_c.strokeStyle = Cto_data;
	  }
                        
	//----①-------

}, false);         


