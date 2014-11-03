var TextChat = function(){};
TextChat.prototype.enterButton;
TextChat.prototype.sendButton;
TextChat.prototype.textMessage;

TextChat.prototype.message;
TextChat.prototype.textChatSetUp = function (){
	this.sendButton = document.getElementById("text_sendbutton");
	this.textMessage = document.getElementById("text_message");
	this.textMessage.setAttribute("onkeyup", "textChat.changeDisable()");
	this.textMessage.setAttribute("onkeypress", "textChat.enter()");
	this.sendButton.onclick = (function(button) {
		return function() {
			this.sendMessage(this.textMessage);
		}.bind(this);
	}.bind(this))(this.sendButton);	
}

TextChat.prototype.changeDisable = function(){
	console.log(this.sendButton.getAttribute("disabled"));
	console.log(this.textMessage.value.length);
	if( this.sendButton.getAttribute("disabled") == null){
		if(!this.textMessage.value.length>0){
			this.sendButton.setAttribute("disabled", true);
		}
	}else{

		if(this.textMessage.value.length>0){
			this.sendButton.removeAttribute("disabled");
		}
	}
}

TextChat.prototype.enter = function(){
	if( event.keyCode == 13 && this.textMessage.value.length>0 ){
		this.sendMessage(this.textMessage);
	}
}


TextChat.prototype.sendMessage = function(text){
    this.message = text.value; //取得
    text.value = ""; 
    this.changeDisable();
//空白にする
    Cso_socket.emit("C_to_S_message", {msg:this.message, user:Cso_userName}); //サーバへ送信
}
//----②-------



