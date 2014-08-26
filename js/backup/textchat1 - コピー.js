window.addEventListener("load", function () {
	//---
	  var Cte_enterButton = document.getElementById("text_enterbutton");
	  Cte_enterButton.onclick = (function(button) {
        return function() {
			//enterRoom();
        };
      })(Cte_enterButton);

	  var Cte_sendButton = document.getElementById("text_sendbutton");
	  Cte_sendButton.onclick = (function(button) {
        return function() {
			sendMessage();
        };
      })(Cte_sendButton);	


	 var Cte_leaveButton = document.getElementById("text_leavebutton");
	 Cte_leaveButton.onclick = (function(button) {
				return function() {
					leaveRoom();
				};	 
	 })(Cte_leaveButton); 



  //------
}, false);         
//----②-------


