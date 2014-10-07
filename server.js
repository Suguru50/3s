//①ライブラリをrequireで読み込む。
//家ルータIP　125.54.113.158
var Sso_path = require("path");
var Sso_http = require("http");
var Sso_socketio = require("socket.io");
var Sso_fs = require("fs");
var Sso_util = require("util");
var Sso_brush = require("./js/brushInfomation.js");
//-----①----
 
//②createServer～MIMEタイプの処理
//やってきたクライアントにindex.htmlやらを返す
var Sso_server = Sso_http.createServer(function(Sso_req, Sso_res) {
	var Sso_filePath = Sso_req.url;
	  if (Sso_filePath == '/') {
		  Sso_filePath = './index.html';
	  } else {
		  Sso_filePath = '.' + Sso_req.url;
	  } 
	  var Sso_extname = Sso_path.extname(Sso_filePath);
	  var Sso_contentType = 'text/html';
	  switch (Sso_extname) {
		case '.js':
			Sso_contentType = 'application/javascript';
			break;
		case '.css':
			Sso_contentType = 'text/css';
			break;
	  }
	  Sso_path.exists(Sso_filePath, function(Sso_exists) {
		if (Sso_exists) {
			Sso_fs.readFile(Sso_filePath, function(Sso_error, Sso_content) {
				if (Sso_error) {
					Sso_res.writeHead(500);
					Sso_res.end();
				}
				else {
	  				//console.log("testcontentType="+contentType);
					Sso_res.writeHead(200, { 'content-Type': Sso_contentType });
					Sso_res.end(Sso_content, 'utf-8');
				}
			});
		}
		else {
			Sso_res.writeHead(404);
			Sso_res.end();
		}
	 });

//}).listen(process.env.VMC_APP_PORT || 3000);
}).listen(3000);
//-------②-------
//
//③上記の内容のseverで動かし始める？その他変数宣言
//ポートの3000番で待ち受け（listen）を開始
var Sso_color = "black";
var Sso_brushInfomation = new brushInfomation();//requireから
var Sso_io = Sso_socketio.listen(Sso_server);
var Sso_roomName = [];//部屋名が入る。現状保存だけで使ってない
var Sso_roomLog = [];
var Sso_roomLogPriority = [];
//連想配列の形でユーザーidをkeyに、値にbrushInfomationClassオブジェクトを持つ
//-----③-----
//④テキストチャットの受け取り（on）と発信（emit）
//サーバーは
//クライアントからの要求受け取り（on）→対応した処理をして結果を発信（emit）を繰り返す
//socket.on("受け取る際の名前？",受け取る値);
//sockets.emit("渡す名前？",渡す値);
//socketsとSso_socketの違いはよくわからないが、それぞれ変更すると動かないので
//onはSso_socketから、emitはsocketsからで
//in(部屋名)を付けることでその部屋にいる相手にだけ送れる
Sso_io.sockets.on("connection", function (Sso_socket) {
  //クライアント側から送信された部屋名

  function getEnteringRoomName(socket){
  	var myID = getEmitUserID(socket);
	var Sso_inID = Sso_io.sockets.manager.roomClients[myID];
	var Sso_enteringName;
	for(key in Sso_inID){
		Sso_enteringName = key;//最後尾が欲しい = ループの最期
	}
	Sso_enteringName = Sso_enteringName.slice(1);
	return Sso_enteringName;
  }

  function getEmitUserID(socket){
	return socket.id;
  }

  Sso_socket.on("roomInfo", function (Sso_data) {
	joinRoom(Sso_data,getEmitUserID(Sso_socket));
  });

  Sso_socket.on("leave", function(Sso_data) {
	leaveRoom(Sso_data.user);
  });
  // メッセージ送信
  // C_to_S クライアント→サーバー
  // S_to_C サーバー→クライアント
  Sso_socket.on("C_to_S_message", function (Sso_data) {
	emitMessage(Sso_data);
  });
 
  // 切断したときに送信
  Sso_socket.on("disconnect", function () {
	  disconnect();
  });

  function getLogMaximumPreferenceUserID(roomname,io){
	var clients = io.sockets.clients(roomname);
	var clientskey;
	for(key in clients){
		clientskey = key;//最後尾が欲しい = ループの最期
	}
	clientskey = 0;
	console.log("ログ取得リクエストが贈られるIDは"+clients[clientskey].id);
	return clients[clientskey].id;
  }

  function joinRoom(Sso_data,userID){
	var Sso_enteringRoom =  Sso_io.sockets.manager.roomClients[userID];
	switch (isNull(Sso_data.room)){
		case true:
			break;
		case false:
			Sso_data.room = "default";
			break;
		default:
			break;
	}
	switch (isNull(Sso_data.user)){
		case true:
			break;
		case false:
			Sso_data.user = "guest";
			break;
		default:
			break;
	}
		if(!isRoomIn(Sso_enteringRoom)){
			Sso_roomName.push(Sso_data.room);
			Sso_socket.join(Sso_data.room,function (){
				Sso_io.sockets.in(Sso_data.room).emit("enterRoomName", {room:Sso_data.room, user:Sso_data.user});
				if(Sso_io.sockets.clients(Sso_data.room).length>1){
					Sso_io.sockets.socket(getLogMaximumPreferenceUserID(getEnteringRoomName(Sso_socket),Sso_io))
															.emit("logRequest",{userID:getEmitUserID(Sso_socket)});
				}
			});
		}else{
			console.log("入出失敗。Sso_data = "+Sso_data.value);
				Sso_io.sockets.socket(userID).emit("cantEnterRoomName", {value:Sso_data.value});
		}
	

		
}

  function leaveRoom(user){
	var myID = getEmitUserID(Sso_socket); //leaveを呼んだクライアントのIDを取得
	var Sso_enteringRoom = Sso_io.sockets.manager.roomClients[myID]; //myIDの入室している部屋の一覧
	var Sso_leaveRoom;
	if(isRoomIn(Sso_enteringRoom)){
		for(key in Sso_enteringRoom){
			Sso_leaveRoom = key;//最後尾が欲しい = ループの最期
		}
		Sso_leaveRoom = Sso_leaveRoom.slice(1);
		Sso_socket.broadcast.to(Sso_leaveRoom).emit("leaveRoomName",{user:user});
		Sso_socket.leave(Sso_leaveRoom);

	}
  }

  function emitMessage(Sso_data){
    if(getEnteringRoomName(Sso_socket) != ''){
    	Sso_io.sockets.in(getEnteringRoomName(Sso_socket)).emit("S_to_C_message", {msg:Sso_data.msg, user:Sso_data.user});
    }
  }

  function disconnect(){
  	//Sso_io.sockets.emit("S_to_C_message", {value:"user disconnected"});
  }

  function isRoomIn(Sso_data){
	  return Object.keys(Sso_data).length>=2;
  }


function isNull(Sso_data){
	console.log("Sso_data = ");	
	console.dir(Sso_data);	
	if(Sso_data==""){
		Sso_data = "default";
		return false;
	}else if(Sso_data.indexOf("　")!=-1){
		Sso_data = "default";
		return false;
	}else{
		return true;
	}
}


//-------④------

//⑤手書きチャットの描画情報の受け渡し
  // 描画情報がクライアントから渡されたら、接続中の他ユーザーへ
  // broadcastで描画情報を送る。
  // broadcastはemitの方法の種類？オプション？
  // 普通にemitすると「発信者を含めたクライアント」に発信されるが、
  // broadcastは「発信者以外のクライアント」に発信される
  // 自分（発信者）のcanvasには、クライアントサイドで描画済みなので発信する必要がない
  // 		※描画方法はこれでいいのか。
  // broadcast時に、部屋指定でemitする場合、
  // 通常のemitではin(部屋名)なのにたいしてここでto(部屋名)使っている
  // toをinに替えても動くが、公式のAPIでは使い分けているのでそれに倣う
  // 		※なぜ
  Sso_socket.on("draw", function (Sso_data) {
	var r = getEnteringRoomName(Sso_socket);
  	//broadcastToRoom(r,"draw",Sso_brushInfomation);
  	broadcastToRoom(r,"draw",Sso_data);

  });


  /*
  Sso_socket.on("brushInfo", function (info) {
	Sso_brushInfomation = info.info;
  });
  */

  function broadcastToRoom(Sso_room,Sso_param,Sso_data){
	Sso_socket.broadcast.to(Sso_room).emit(Sso_param,Sso_data);
  }
  //ログ？
  Sso_socket.on("png", function (data) {
	Sso_io.sockets.socket(data.userID).emit("log",{log:data.png});
  });

  Sso_socket.on("clearAll", function (Sso_data) {
	Sso_roomLog[getEnteringRoomName(Sso_socket)] = "";
  	broadcastToRoom(getEnteringRoomName(Sso_socket),"clearAll",Sso_data);
  });
//--------⑤---------
  
//⑥RTCシグナリング用？実験中
  Sso_socket.on('message', function(message) {
    broadcastToRoom(getEnteringRoomName(Sso_socket),'message', message);
  });
//--------------⑥-----------
});


