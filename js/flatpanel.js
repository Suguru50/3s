
function flatpanelSetup(){
	$("#flat1,#flat2,#flat3,#flat4,#flat5,#flat6,#flat7,#flat8,#flat9,#flat10").click(function(e){
		var button = $(this);
		var gparent = button.parent().parent();
		var openright = 70 * button.attr("value");
		var opentop = -70 * gparent.attr("value");
		if(!button.hasClass("flatopen")){
			switch(button.attr("id")){
			case "flat6":
				buttonOpen($(this),openright*2,opentop,300,300);
				break;
			case "flat5":
				buttonOpen($(this),openright*3,opentop,300,300);
				break;
			case "flat1":
				buttonOpen($(this),openright*3,opentop,300,400);
				break;
			case "flat8":
			case "flat10":
				buttonOpen($(this),openright*2,opentop,300,400);
				break;
			case "flat9":
				buttonOpen($(this),openright*3,opentop,300,150);
				break;
			case "flat9":
				buttonOpen($(this),openright*3,opentop,300,400);
				break;
			default:
				buttonOpen($(this),openright,opentop,100,200);
				break;
			}
		}else{
			buttonClose($(this),0,0);
		}
		e.stopPropagation();
	});

//content内の消しゴムオンオフで#flat1の画像変更
	$("#e_onbutton").click(function(e){
			$("#tool_eraser").addClass("selected");
			$("#flateraser").animate({
				top:"0px"
			},400,"easeOutQuint");
			document.getElementById("flat2").style.backgroundImage = "url(../images/flateraser.png)";
			$("#e_onbutton").addClass("oneraser");
	});
	$("#e_offbutton").click(function(e){
			$("#tool_eraser").removeClass("selected");
			$("#flateraser").animate({
				top:"70px"
			},400,"easeOutQuint");
			document.getElementById("flat2").style.backgroundImage = "url(../images/flateraseroff.png)";
			$("#e_offbutton").addClass("offeraser");
	});
			
//ここまで
//↑のブラシバージョン
	$("#air_onbutton").click(function(e){
			$("#tool_airbrush").addClass("selected");
			$("#flatairbrush").animate({
				top:"0px"
			},400,"easeOutQuint");
			document.getElementById("flat7").style.backgroundImage = "url(../images/flatbrush.png)";
			$("#air_onbutton").addClass("onairbrush");
			console.log("ブラシ選択");
		
	});
	$("#air_offbutton").click(function(e){
			$("#tool_airbrush").removeClass("selected");
			$("#flatairbrush").animate({
				top:"70px"
			},400,"easeOutQuint");
			document.getElementById("flat7").style.backgroundImage = "url(../images/flatbrushoff.png)";
			$("#air_offbutton").addClass("offairbrush");
			console.log("ブラシ解除");
	});
//ここまで
	$("#content1,#content2,#content3,#content4,#content5,#content6,#content7,#content8,#content9,#content10").click(function(e){
		e.stopPropagation();
	});
	$("#flatrow1,#flatrow2,#flatrow3,#flatrow4,#flatrow5").click(flatRowButtonListener);

	
}

var flatRowButtonListener = function(e){
	var callback = e || function(){};
	console.dir($(".flatopen").length);
	if($(".flatopen").length>0){
		console.log("tigau");
		buttonClose($(".flatopen"),0,0,callback);
	}else{
		console.log("kore");
		callback();
	}
}
var buttonOpen = function(button,right,top,width,height){
	buttonClose($(".flatopen"),0,0);
	button.parent().animate({
		right: right,
		top: top
	},400,"easeOutQuint");
	button.prev().animate({
		width:width+"%",
		height:height+"%",
		top:"70px"
	},200,"easeOutQuint");
	button.addClass("flatopen");
}
var buttonClose = function(button,right,top,c){
	var callback = c || function(){};
	button.parent().animate({
		right:right,
		top:top
	},400,"easeOutQuint");
	button.prev().animate({
		width:"100%",
		height:"100%",
		top:"0px"
	},200,"easeOutQuint",callback);
	button.removeClass("flatopen");
}
