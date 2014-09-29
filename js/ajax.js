var Cto_canvas;
var Cto_c;
var tool;
var textChat;
$(function() {
	enterAjax();
	$("#shadow").css({
		opacity: '0.7',
		display: 'none',
		position: 'absolute',
		top: '0',
		width: '100%',
		height: '100%',
		background: '#000',
		zIndex: '100000'
	});
});

function enterAjax() {
	$("#shadow").css('display', 'block');
	$.ajax({
		type: 'POST',
		url: 'enter.html',
		dataType: 'html',
		success: function(data) {
			$('article').html(data);
			enterRoomSetUp();
		},error:function() {
			alert('error');
		}
	});
}

function leaveButtonSetUp(){
	$('#text_leavebutton').click(function() {
		//$("#shadow").css('display', 'block');
		$("header").css("display","none");
		$.ajax({
			type: 'POST',
			url: 'enter.html',
			dataType: 'html',
			success: function(data) {
				$('article').html(data);
				leaveRoom();
				enterRoomSetUp();
			},error:function() {
				alert('error');
			}
		});
	});
}

function enterRoomSetUp(){
	var roomtext = document.getElementById("text_room");
	roomtext.setAttribute("onkeypress","roomEnter()");

	$('#text_enterbutton').click(function(){
		ajaxEnter();	
	});
}

function roomEnter(){
	if( event.keyCode == 13){
		ajaxEnter();
	}
}

function ajaxEnter(){
	$("#shadow").css('display', 'block');
	$("header").css("display","block");
	$.ajax({
		type: 'POST',
		url: 'canvas.html',
		dataType: 'html',
		success: function(data) {
			var Cso_msg = $("#text_room").val();
			var Cso_user;
			$("#text_room").val("");

			if($("#text_userArea").val()==""){
				Cso_user = "guest";
			}else if($("#text_userArea").val().indexOf("?@")!=-1){
				Cso_user = "guest";
			}else{
				Cso_user = $("#text_userArea").val();
			}

			$("#text_userArea").val("");
			$('article').html(data);
			Cto_canvas = document.getElementById("canvas_myCanvas1");
			Cto_c = Cto_canvas.getContext("2d");
			Cto_cv = document.getElementById('canvas_view');
			Cto_cvc = Cto_cv.getContext('2d');
			//toolSetUp();
			tool = new Tool();
			tool.toolSetUp(Cto_canvas,Cto_c);
			textChat = new TextChat();
			textChat.textChatSetUp();

			canvasSetUp();

			//textChatSetUp();
			leaveButtonSetUp();
			enterRoom(Cso_msg,Cso_user);
		},error:function() {
			alert('error');
		}
	});
}

