//①テキストチャットの受け取りと発信
//  var Cso_socket = io.connect(); //リモート環境？
  //var Cso_socket = io.connect('https://localhost:3000'); //ローカル
  //var Cso_socket = io.connect('https://172.16.73.57:3000'); //学校用
  var Cso_socket = io.connect('https://http://210.152.156.188:3000'); 
  var Cso_userName;

  //サーバから受け取るイベント
  //Cso_socket.on("connect", function () {});  // 接続時
  Cso_socket.on("connect",onOpened);  // 接続時
  Cso_socket.on("disconnect", function (Cso_client) {});  // 切断時
  Cso_socket.on("S_to_C_message", function (Cso_data) {
    addMessage(Cso_data.user + "：" + Cso_data.msg);
  });
  Cso_socket.on('message', onMessage);

  Cso_socket.on("enterRoomName", function (Cso_data) {
	console.log(document.getElementById("startCapture"));
	document.getElementById("tool_roomName").innerHTML = Cso_data.room;
    addMessage(Cso_data.room + "に" + Cso_data.user + "が入室しました。");
	$("#shadow").animate({
		opacity:'0'
	},200,function(){
		$("#shadow").css(
			"display","none"
		);
	});
  });

  Cso_socket.on("cantEnterRoomName", function (Cso_data) {
	addMessage("既に部屋に入室しています");
  });

  Cso_socket.on("leaveRoomName", function (Cso_data) {
	$("#shadow").css('display', 'none');
    addMessage(Cso_data.user +"が退室しました");
  });

  Cso_socket.on("clearAll", function (Cso_data) {
	  tool.clearAll(Cto_canvas,Cto_c);
  });

  //クライアントからイベント送信（イベント名は自由に設定できます）

  function enterRoom(msg,user) {
    Cso_socket.emit("roomInfo", {room:msg, user:user}); //サーバへ送信
    Cso_userName = user;
  }

/*
  //jqueryでメッセージを追加
  function addMessage (Cso_value,Cso_color,Cso_size) {l
    var Cso_msg = value.replace( /[!@$%<>'"&|]/g, '' ); //タグ記号とかいくつか削除
    $("#text_msg_list").prepend("<div class='text_msg'>" + Cso_msg + "</div>");
  }    
  */
  //jqueryでメッセージを追加
  var msgcnt = 0;
function addMessage (Cso_value,Cso_color,Cso_size) {
	var Cso_msg = Cso_value.replace( /[!@$%<>'"&|]/g, '' ); //タグ記号とかいくつか削除
	$("#text_msg_list").prepend("<div id='msg"+msgcnt+"' class='text_msg' style='opacity:0;'>" + Cso_msg + "</div>");
	$("#msg"+msgcnt).animate({
		opacity:"1"
	},400);
	msgcnt++;
} 

function addInfoMessage (Cso_value,Cso_color,Cso_size) {
	var Cso_msg = Cso_value.replace( /[!@$%<>'"&|]/g, '' ); //タグ記号とかいくつか削除
	$("#text_msg_list").prepend("<div id='msg"+msgcnt+"' class='text_msg' style='opacity:0;color:"+Cso_color+"'>" + Cso_msg + "</div>");
	$("#msg"+msgcnt).animate({
		opacity:"1"
	},400);
	msgcnt++;
}
	
function leaveRoom() {
console.log("退室ボタン");
Cso_socket.emit("leave", {user:Cso_userName}); 
}

//----②-------


