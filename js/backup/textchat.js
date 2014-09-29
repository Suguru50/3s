var TextChat = function(){};
TextChat.prototype.enterButton;
TextChat.prototype.sendButton;
TextChat.prototype.textMessage;

TextChat.prototype.message;


TextChat.prototype.enterSetUp = function(){
	this.enterButton = document.getElementById("text_enterbutton");
	this.enterButton.onclick = (function(button) {
		return function() {
			//enterRoom();
		};
	})(this.enterButton);
}


TextChat.prototype.textChatSetUp = function (){
	this.sendButton = document.getElementById("text_sendbutton");
	this.textMessage = document.getElementById("text_message");
	this.sendButton.onclick = (function(button) {
		return function() {
			this.sendMessage(this.textMessage);
		}.bind(this);
	}.bind(this))(this.sendButton);	
}

TextChat.prototype.sendMessage = function(text){
    this.message = text.value; //取得
    text.value = " "; //空白にする
    Cso_socket.emit("C_to_S_message", {msg:this.message, user:Cso_userName}); //サーバへ送信
}
//----②-------


