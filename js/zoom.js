// Zoom

$(function(){
	var mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
	$(document.getElementById("canvas_canvas")).on(mousewheelevent,function(e){
		e.preventDefault();
		var delta = e.originalEvent.deltaY ? -(e.originalEvent.deltaY) : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -(e.originalEvent.detail);

	
		var width = window.innerWidth;
		var height = window.innerHeight;
		//ウィンドウサイズが変わった際に再取得
		window.onresize = function (e) {
			width = window.innerWidth;
			height = window.innerHeight;
		}
		var scaleY = (document.getElementById("canvas_canvas").scrollTop-3275+height/2)/20;
		var scaleX = (document.getElementById("canvas_canvas").scrollLeft-3250+width/2)/20;

		if (delta < 0){			
			// マウスホイールを下にスクロールしたときの処理を記載
			if(tool.getPageSize()>=0.2){
				tool.setPageSize(tool.getPageSize() - 0.1);
				document.getElementById("zoomArea").style["-webkit-transform-origin"]=scaleX+"% "+scaleY+"%";
				document.getElementById("zoomArea").style["-webkit-transform"]=
				"scale("+tool.getPageSize()+","+tool.getPageSize()+")";
		
			}

		} else {
			// マウスホイールを上にスクロールしたときの処理を記載
			if(tool.getPageSize()<4){
				tool.setPageSize(tool.getPageSize() + 0.1);
				document.getElementById("zoomArea").style["-webkit-transform-origin"]=scaleX+"% "+scaleY+"%";
				document.getElementById("zoomArea").style["-webkit-transform"]=
				"scale("+tool.getPageSize()+","+tool.getPageSize()+")";
				
			}
		}
		
		view();
		//ズーム倍率の表示
		document.getElementById("zoomInfo").innerHTML = "<p>"+parseInt(tool.getPageSize()*100)+"%</p>";
		$("#zoomInfo").fadeIn(function(){
    	$(this).find("p").stop();
		},function(){
		    $(this).fadeOut(1000);	
		});
	});
		
});




function plus(){
		var width = window.innerWidth;
		var height = window.innerHeight;
		//ウィンドウサイズが変わった際に再取得
		window.onresize = function (e) {
			width = window.innerWidth;
			height = window.innerHeight;
		}
		var scaleY = (document.getElementById("canvas_canvas").scrollTop-3275+height/2)/20;
		var scaleX = (document.getElementById("canvas_canvas").scrollLeft-3250+width/2)/20;

			if(tool.getPageSize()<4){
				tool.setPageSize(tool.getPageSize() + 0.1);

				document.getElementById("zoomArea").style["-webkit-transform-origin"]=scaleX+"% "+scaleY+"%";
				document.getElementById("zoomArea").style["-webkit-transform"]=
					"scale("+tool.getPageSize()+","+tool.getPageSize()+")";
			}
		view();
		//ズーム倍率の表示
		document.getElementById("zoomInfo").innerHTML = "<p>"+parseInt(tool.getPageSize()*100)+"%</p>";
		$("#zoomInfo").fadeIn(function(){
    	$(this).find("p").stop();
		},function(){
		    $(this).fadeOut(1000);	
		});
}
function minus(){
		var width = window.innerWidth;
		var height = window.innerHeight;
		//ウィンドウサイズが変わった際に再取得
		window.onresize = function (e) {
			width = window.innerWidth;
			height = window.innerHeight;
		}
		var scaleY = (document.getElementById("canvas_canvas").scrollTop-3275+height/2)/20;
		var scaleX = (document.getElementById("canvas_canvas").scrollLeft-3250+width/2)/20;

			if(tool.getPageSize()>=0.2){
				tool.setPageSize(tool.getPageSize() - 0.1);

				document.getElementById("zoomArea").style["-webkit-transform-origin"]=scaleX+"% "+scaleY+"%";
				document.getElementById("zoomArea").style["-webkit-transform"]=
					"scale("+tool.getPageSize()+","+tool.getPageSize()+")";
			}
		view();
		//ズーム倍率の表示
		document.getElementById("zoomInfo").innerHTML = "<p>"+parseInt(tool.getPageSize()*100)+"%</p>";
		$("#zoomInfo").fadeIn(function(){
    	$(this).find("p").stop();
		},function(){
		    $(this).fadeOut(1000);	
		});
}
function zoomReset() {
	//倍率初期化
	tool.setPageSize(1);
		var width = window.innerWidth;
		var height = window.innerHeight;
		//ウィンドウサイズが変わった際に再取得
		window.onresize = function (e) {
			width = window.innerWidth;
			height = window.innerHeight;
		}
		var scaleY = (document.getElementById("canvas_canvas").scrollTop-3275+height/2)/20;
		var scaleX = (document.getElementById("canvas_canvas").scrollLeft-3250+width/2)/20;

	document.getElementById("zoomArea").style["-webkit-transform-origin"]=scaleX+"% "+scaleY+"%";
	document.getElementById("zoomArea").style["-webkit-transform"]=
		"scale("+tool.getPageSize()+","+tool.getPageSize()+")";

	//ズーム倍率の表示
	document.getElementById("zoomInfo").innerHTML = "<p>"+parseInt(tool.getPageSize()*100)+"%</p>";
	$("#zoomInfo").fadeIn(function(){
    $(this).find("p").stop();
	},function(){
	    $(this).fadeOut(1000);	
	});
	
	//キャンバス中心の表示

	var MAX_scrollX = document.getElementById("canvas_canvas").scrollWidth - document.getElementById("canvas_canvas").getBoundingClientRect().width;
	var MAX_scrollY = document.getElementById("canvas_canvas").scrollHeight - document.getElementById("canvas_canvas").getBoundingClientRect().height;
	document.getElementById("canvas_canvas").scrollTop = MAX_scrollY/2;
	document.getElementById("canvas_canvas").scrollLeft = MAX_scrollX/2;
	view();

}
