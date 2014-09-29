var btn_DefW;
var R_panel_DefW;
var L_panel_DefW;
var B_panel_DefW;
var rw,lw,bw;
$(document).ready(function(){
	btn_DefW = 15;
	if($(".R_slide_panel")[0]){
		R_panel_DefW = $(".R_slide_panel").width();
	}
	if($(".L_slide_panel")[0]){
		L_panel_DefW = $(".L_slide_panel").width();
	}
	if($(".B_slide_panel")[0]){
		B_panel_DefW = $(".B_slide_panel").width();
	}
});
	//メニュの表示幅（クリックできる範囲）
//	$('#slide_panel').width(btn_DefW);
$('.menu_off').click(function(e) {
	//$('#panel').toggle('slow');
	//ボタンの横幅よりもパネル全体の横幅が広い時＝開いてる時
	if($(this).parent().width() > btn_DefW){
		//横幅=ボタンの横幅
		console.log("clickLW="+lw);
		if($(this).hasClass("left")){
			//L_panel_DefW = $(".L_slide_panel").width();
			if(lw==btn_DefW){
				lw = $(".L_slide_panel").width();
				console.log("bluewidth="+lw);
			}else{
				lw = btn_DefW;
			}
		}else{
			rw = btn_DefW;
		}
	}else{
		//横幅=初期値 へアニメーション
		if($(this).hasClass("right")){
				rw = R_panel_DefW;
				console.log("redwidth="+rw);
		}else if($(this).hasClass("left")){
				//w = L_panel_DefW;
				console.log("bluewidth="+lw);
		}else if($(this).hasClass("bottom")){
				bw = B_panel_DefW;
				console.log("greenwidth="+bw);
		}else{
				bw = 0;
				lw = 0;
				rw = 0;
				console.log("nonewidth="+rw);
		}
	}
	if($(this).hasClass("active")){
		$(this).siblings().toggleClass('displayNone');
	}

	if($(this).hasClass("right")){
		animateSideMargin(this,"r");
	}else if($(this).hasClass("left")){
		animateSideMargin(this,"l");
	}else if($(this).hasClass("bottom")){
	}
	if($(this).hasClass("right")){
		animateCenterMargin($("#canvas_canvas").css("margin-top"),rw,
				$("#canvas_canvas").css("margin-bottom"),$("#canvas_canvas").css("margin-left"));
	}else if($(this).hasClass("left")){
		animateCenterMargin($("#canvas_canvas").css("margin-top"),$("#canvas_canvas").css("margin-right"),
				$("#canvas_canvas").css("margin-bottom"),lw);
	}else if($(this).hasClass("bottom")){
		animateCenterMargin($("#canvas_canvas").css("margin-top"),$("#canvas_canvas").css("margin-right"),
				bw,$("#canvas_canvas").css("margin-left"));
	}
});

function animateCenterMargin(t,r,b,l){
		$("#canvas_canvas").animate({
					marginTop:t,
					marginRight:r,
					marginBottom:b,
					marginLeft:l
		}, "slow",
		function(){});
		$("#chat").animate({
					marginTop:t,
					marginRight:r,
					marginLeft:l
		}, "slow",
		function(){});
}

function animateSideMargin(element,s){
	switch(s){
		case "r":
			$(element).parent().animate({
					width:rw
				}, "slow",
				function(){
					//class変更
					if(!$(element).hasClass("active")){
						$(element).siblings().toggleClass('displayNone');
					}
					$(element).toggleClass('active');
				});
			break;
		case "l":
					console.log("margin="+(-1*L_panel_DefW+15));
			$(element).parent().animate({
					marginLeft:-1*L_panel_DefW+15,
				}, "slow",
				function(){
					//class変更
					if(!$(element).hasClass("active")){
						$(element).siblings().toggleClass('displayNone');
					}
					$(element).toggleClass('active');
			});
			if(L_panel_DefW>15){
				L_panel_DefW = 15;
			}else{
				L_panel_DefW = $(".L_slide_panel").width();
			}
			break;
	}
}


/*$(document).ready(function(){
// ■ページ読込み完了時 我流天性がらくたや
	//パネルの初期設定のwidthを取得しておく
	var R_panel_DefW = $(".slide_panel").width();
	//メニュの表示幅（クリックできる範囲）
	var btn_DefW = 15;
	//パネルの横幅をボタンの横幅だけにしておく
//	$('#slide_panel').width(btn_DefW);

	$('.menu_off').click(function(e) {
		//$('#panel').toggle('slow');
		//ボタンの横幅よりも、パネル全体の横幅が広い時＝開いてる時
		if($(".slide_panel").width() > btn_DefW){
			//横幅=ボタンの横幅 へアニメーション
			w = btn_DefW;
		}else{
			//横幅=初期値 へアニメーション
			w = R_panel_DefW;
		}
		if($('.menu_off').hasClass("active")){
			$('.panel_main').toggleClass('displayNone');
		}
		$(".slide_panel").animate({
			width:w
		}, "slow",
		function(){
			//アニメーションが終わってclass変更
			if(!$('.menu_off').hasClass("active")){
				$('.panel_main').toggleClass('displayNone');
			}
			$('.menu_off').toggleClass('active');
		});
		$("#canvas_canvas,#chat").animate({
				marginRight:w
			}, "slow",
			function(){
		});
	});
});
*/
