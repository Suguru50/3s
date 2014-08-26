var Cto_canvas;
var Cto_c;
function clearAll(canvas,context){
	context.clearRect(0,0,canvas.width,canvas.height);
}
window.addEventListener("load", function () {
	Cto_canvas = document.getElementById("canvas_myCanvas");
    Cto_c = Cto_canvas.getContext("2d");
    // 色や太さを選択した場合の処理
    // 選択した結果を、Cto_canvasに設定
    $("#tool_black").click(function () {Cto_c.strokeStyle = "black";});
    $("#tool_blue").click(function () {Cto_c.strokeStyle = "blue";});
    $("#tool_red").click(function () {Cto_c.strokeStyle = "red";});
    $("#tool_green").click(function () {Cto_c.strokeStyle = "green";});
    $("#tool_small").click(function () {Cto_c.lineWidth = 5;});
    $("#tool_middle").click(function () {Cto_c.lineWidth = 10;});
    $("#tool_large").click(function () {Cto_c.lineWidth = 20;});
	$("#tool_eraser").click(function () {
		if(Cto_c.globalCompositeOperation === "source-over"){
	  		Cto_c.globalCompositeOperation = "destination-out";
		}else if(Cto_c.globalCompositeOperation === "destination-out"){
	  		Cto_c.globalCompositeOperation = "source-over";
		}
	});
    $("#tool_clear").click(function(){
		clearAll(Cto_canvas,Cto_c);
		//Cso_socket.emit("clearAll",{canvas:Cto_canvas,context:Cto_c});
		Cso_socket.emit("clearAll",{value:""});
	});
       
}, false);         
//----②-------


