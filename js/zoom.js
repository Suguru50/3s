// Zoom
$(function(){
	var mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
	$(document.getElementById("canvas_canvas")).on(mousewheelevent,function(e){
		e.preventDefault();
		var delta = e.originalEvent.deltaY ? -(e.originalEvent.deltaY) : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -(e.originalEvent.detail);

		if (delta < 0){
			// マウスホイールを下にスクロールしたときの処理を記載
			if(tool.getPageSize()>0.2){
				tool.setPageSize(tool.getPageSize() - 0.1);
				var transX = (tool.getPageSize() * 10 -10)*60+400;
				var transY = (tool.getPageSize() * 10 -10)*60+250;
				document.getElementById("canvas_myCanvas").style["-webkit-transform"]="translate("+transX+"px,"+transY+"px)";
				var hw = tool.getPageSize()*500+2000;
				$(document.getElementById("canvas_margin")).height(hw);
				$(document.getElementById("canvas_margin")).width(hw);
				document.getElementById("canvas_margin").style["-webkit-transform"]="scale("+tool.getPageSize()+","+tool.getPageSize()+")";
			}

		} else {
			// マウスホイールを上にスクロールしたときの処理を記載
			if(tool.getPageSize()<3.9){
			tool.setPageSize(tool.getPageSize() + 0.1);
			var transX = (tool.getPageSize() * 10 -10)*60+400;
			var transY = (tool.getPageSize() * 10 -10)*60+250;
			document.getElementById("canvas_myCanvas").style["-webkit-transform"]="translate("+transX+"px,"+transY+"px)";
			var hw = tool.getPageSize()*500+2000;
			$(document.getElementById("canvas_margin")).height(hw);
			$(document.getElementById("canvas_margin")).width(hw);
			document.getElementById("canvas_margin").style["-webkit-transform"]="scale("+tool.getPageSize()+","+tool.getPageSize()+")";
			}
		}
		
		//ズーム倍率の表示
		document.getElementById("zoomInfo").innerHTML = "<p>"+parseInt(tool.getPageSize()*100)+"%</p>";
		$("#zoomInfo").fadeIn(function(){
    	$(this).find("p").stop();
		},function(){
		    $(this).fadeOut(1000);	
		});
	});
		
});
