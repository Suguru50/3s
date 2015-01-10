//①ライブラリをrequireで読み込む。
//家ルータIP　125.54.113.158
var Sso_path = require("path");
//var Sso_http = require("http");
var Sso_http = require("https");
var Sso_socketio = require("socket.io");
var Sso_fs = require("fs");
var Sso_util = require("util");
var Sso_brush = require("./js/brushInfomation.js");
//-----①----
var options = {
    key: Sso_fs.readFileSync('server.key'),
    cert: Sso_fs.readFileSync('server.crt'),
};
//②createServer～MIMEタイプの処理
//やってきたクライアントにindex.htmlやらを返す
var Sso_server = Sso_http.createServer(options,function(Sso_req, Sso_res) {
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
		case '.png':
			Sso_contentType = 'image/png';
			break;
		case '.gif':
			Sso_contentType = 'image/gif';
			break;
		case '.otf':
			Sso_contentType = 'font/opentype';
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

/*  function getEnteringRoomName(socket){
  	var myID = getEmitUserID(socket);
	var Sso_inID = Sso_io.sockets.manager.roomClients[myID];
	var Sso_enteringName;
	for(key in Sso_inID){
		Sso_enteringName = key;//最後尾が欲しい = ループの最期
	}
	Sso_enteringName = Sso_enteringName.slice(1);
	return Sso_enteringName;
  }
  */

  function getEmitUserID(socket){
	return socket.id;
  }

  Sso_socket.on("roomInfo", function (Sso_data) {
	Sso_data.room;
	joinRoom(Sso_data,getEmitUserID(Sso_socket),"client");
  });
  Sso_socket.on("contentRoomInfo", function (Sso_data) {
	Sso_data.room;
	joinRoom(Sso_data,getEmitUserID(Sso_socket),"content");
  });

  Sso_socket.on("leave", function(Sso_data) {
	leaveRoom(Sso_data.user);
  });
  // メッセージ送信
  // C_to_S クライアント→サーバー
  // S_to_C サーバー→クライアント
  Sso_socket.on("C_to_S_message", function (Sso_data) {
	emitToClients(Sso_data);
  });
 
  // 切断したときに送信
  Sso_socket.on("disconnect", function () {
	  disconnect();
  });
//------
function findClientsSocketByRoomId(roomId,io) {
var res = []
, room = io.sockets.adapter.rooms[roomId[0]];
if (room) {
    for (var id in room) {
    res.push(io.sockets.adapter.nsp.connected[id]);
    }
}
return res;
}
//-----
  function getLogMaximumPreferenceUserID(roomname,io){
	//var clients = io.sockets.clients(roomname);
	
	var clients = findClientsSocketByRoomId(roomname,io);
	var clientskey;
	for(key in clients){
		clientskey = key;//最後尾が欲しい = ループの最期
	}
	clientskey = 0;
	return clients[clientskey].id;
  }

  function joinRoom(Sso_data,userID,type){
	//var Sso_enteringRoom =  Sso_io.sockets.manager.roomClients[userID];
	var Sso_enteringRoom =  Sso_io.sockets.rooms;
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
				if(type==="client"){
					Sso_io.sockets.in(Sso_data.room)
						.emit("enterRoomName",{room:Sso_data.room, user:Sso_data.user});
					Sso_io.to(getLogMaximumPreferenceUserID(Sso_socket.rooms,Sso_io))
						.emit("logRequest",{userID:getEmitUserID(Sso_socket)});
				}else if(type==="content"){
					Sso_io.sockets.in(Sso_data.room)
						.emit("contentMessage",{msg:"これはサーバーからコンテントスクリプトに対してのメッセージです。このメッセージはコンテントスクリプトが入室している部屋にいるユーザー全員に送信され、それらのユーザーのコンテントスクリプトが受けとり処理します。"});
				}
			});
		}else{
			console.log("入出失敗。Sso_data = "+Sso_data.value);
				Sso_io.sockets.socket(userID).emit("cantEnterRoomName", {value:Sso_data.value});
		}
}

  function leaveRoom(user){
	var myID = getEmitUserID(Sso_socket); //leaveを呼んだクライアントのIDを取得
	var Sso_enteringRoom =  Sso_io.sockets.rooms;
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

  function emitToClients(Sso_data){
    if(Sso_socket.rooms[1] != ''){
    	Sso_io.sockets.in(Sso_socket.rooms[1]).emit("S_to_C_message", {msg:Sso_data.msg, user:Sso_data.user});
    }
  }

  function disconnect(){
  	//Sso_io.sockets.emit("S_to_C_message", {value:"user disconnected"});
  }

  function isRoomIn(Sso_data){
	  //return Object.keys(Sso_data).length>=2;
	  //return Sso_data.length>=2;
	  return Sso_data=="";
  }


function isNull(Sso_data){
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
	//var r = getEnteringRoomName(Sso_socket);
	var r = Sso_socket.rooms;
  	//broadcastToRoom(r,"draw",Sso_brushInfomation);
  	broadcastToRoom(r,"draw",Sso_data);
  });

  function broadcastToRoom(Sso_room,Sso_param,Sso_data){
	Sso_socket.broadcast.to(Sso_room[1]).emit(Sso_param,Sso_data);
  }
  //ログ？
  Sso_socket.on("png", function (data) {
	//Sso_io.sockets.socket(data.userID).emit("log",{log:data.png});
	Sso_io.to(data.userID).emit("log",{log:data.png});
  });

  Sso_socket.on("clearAll", function (Sso_data) {
	//Sso_roomLog[getEnteringRoomName(Sso_socket)] = "";
	Sso_roomLog[Sso_socket.rooms] = "";
  	broadcastToRoom(Sso_socket.rooms,"clearAll",Sso_data);
  });
//--------⑤---------
  
//⑥RTCシグナリング用？実験中
/*
  Sso_socket.on('enter', function(roomname) {
    Sso_socket.set('roomname', roomname);
    Sso_socket.join(roomname);
  });
*/
 
  Sso_socket.on('message', function(message) {
    // 送信元のidをメッセージに追加（相手が分かるように）
    message.from = Sso_socket.id;

    // 送信先が指定されているか？
    var target = message.sendto;
    if (target) {
    // 送信先が指定されていた場合は、その相手のみに送信
      //Sso_socketio.sockets.socket(target).emit('message', message);
      //Sso_io.sockets.socket(target).emit('message', message);
      Sso_io.to(target).emit('message', message);
      return;
    }
 
    // 特に指定がなければ、ブロードキャスト
	broadcastToRoom(Sso_socket.rooms,'message',message);
  });
 
  Sso_socket.on('disconnect', function() {
    emitToClients('user disconnected');
  });
 
  // 会議室名が指定されていたら、室内だけに通知
  /*function emitToClients(type, message) {
	//broadcastToRoom(getEnteringRoomName(Sso_socket),type,message);
	broadcastToRoom(Sso_socket.rooms,type,message);

  }
*/
//--------------⑥-----------
	Sso_socket.on("mapData",function(llData){
		  //broadcastToRoom(getEnteringRoomName(Sso_socket),
		  broadcastToRoom(Sso_socket.rooms,
			  'mapViewData',llData);
	});
});

