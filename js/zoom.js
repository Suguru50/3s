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
				Cto_layercanvas1.style["-webkit-transform"]=
				"scale("+tool.getPageSize()+","+tool.getPageSize()+") translate("+400+"px,"+250+"px)";
				Cto_layercanvas2.style["-webkit-transform"]=
				"scale("+tool.getPageSize()+","+tool.getPageSize()+") translate("+400+"px,"+250+"px)";
				C_tc.style["-webkit-transform"]=
				"scale("+tool.getPageSize()+","+tool.getPageSize()+") translate("+400+"px,"+250+"px)";
				
				
				if( tool.getPageSize() < 1 ){
					Cto_layercanvas1.style["-webkit-transform-origin"]=50+"% "+50+"%";
					Cto_layercanvas2.style["-webkit-transform-origin"]=50+"% "+50+"%";
					C_tc.style["-webkit-transform-origin"]=50+"% "+50+"%";
				}else{
					var hw = (tool.getPageSize()*2500);
					$(document.getElementById("canvas_margin")).height(hw);
					$(document.getElementById("canvas_margin")).width(hw);
				}
			}

		} else {
			// マウスホイールを上にスクロールしたときの処理を記載
			if(tool.getPageSize()<4){
				tool.setPageSize(tool.getPageSize() + 0.1);
				Cto_layercanvas1.style["-webkit-transform"]=
				"scale("+tool.getPageSize()+","+tool.getPageSize()+") translate("+400+"px,"+250+"px)";
				Cto_layercanvas2.style["-webkit-transform"]=
				"scale("+tool.getPageSize()+","+tool.getPageSize()+") translate("+400+"px,"+250+"px)";
				C_tc.style["-webkit-transform"]=
				"scale("+tool.getPageSize()+","+tool.getPageSize()+") translate("+400+"px,"+250+"px)";

				
				if( tool.getPageSize() >= 1 ){
					var hw = (tool.getPageSize()*2500);
					$(document.getElementById("canvas_margin")).height(hw);
					$(document.getElementById("canvas_margin")).width(hw);
					Cto_layercanvas1.style["-webkit-transform-origin"]=0+"% "+0+"%";
					Cto_layercanvas2.style["-webkit-transform-origin"]=0+"% "+0+"%";
					C_tc.style["-webkit-transform-origin"]=0+"% "+0+"%";
				}
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




function plus(){
			if(tool.getPageSize()<4){
				tool.setPageSize(tool.getPageSize() + 0.1);
				Cto_layercanvas1.style["-webkit-transform"]=
				"scale("+tool.getPageSize()+","+tool.getPageSize()+") translate("+400+"px,"+250+"px)";
				Cto_layercanvas2.style["-webkit-transform"]=
				"scale("+tool.getPageSize()+","+tool.getPageSize()+") translate("+400+"px,"+250+"px)";
				
				C_tc.style["-webkit-transform"]=
				"scale("+tool.getPageSize()+","+tool.getPageSize()+") translate("+400+"px,"+250+"px)";

				
				if( tool.getPageSize() >= 1 ){
					var hw = (tool.getPageSize()*2500);
					$(document.getElementById("canvas_margin")).height(hw);
					$(document.getElementById("canvas_margin")).width(hw);
					Cto_layercanvas1.style["-webkit-transform-origin"]=0+"% "+0+"%";
					Cto_layercanvas2.style["-webkit-transform-origin"]=0+"% "+0+"%";
					C_tc.style["-webkit-transform-origin"]=0+"% "+0+"%";
				}
			}
		
		//ズーム倍率の表示
		document.getElementById("zoomInfo").innerHTML = "<p>"+parseInt(tool.getPageSize()*100)+"%</p>";
		$("#zoomInfo").fadeIn(function(){
    	$(this).find("p").stop();
		},function(){
		    $(this).fadeOut(1000);	
		});
}
function minus(){
			if(tool.getPageSize()>0.2){
				tool.setPageSize(tool.getPageSize() - 0.1);
				Cto_layercanvas1.style["-webkit-transform"]=
				"scale("+tool.getPageSize()+","+tool.getPageSize()+") translate("+400+"px,"+250+"px)";
				Cto_layercanvas2.style["-webkit-transform"]=
				"scale("+tool.getPageSize()+","+tool.getPageSize()+") translate("+400+"px,"+250+"px)";
				
				C_tc.style["-webkit-transform"]=
				"scale("+tool.getPageSize()+","+tool.getPageSize()+") translate("+400+"px,"+250+"px)";

				
				if( tool.getPageSize() < 1 ){
					Cto_layercanvas1.style["-webkit-transform-origin"]=50+"% "+50+"%";
					Cto_layercanvas2.style["-webkit-transform-origin"]=50+"% "+50+"%";
					C_tc.style["-webkit-transform-origin"]=50+"% "+50+"%";
				}else{
					var hw = (tool.getPageSize()*2500);
					$(document.getElementById("canvas_margin")).height(hw);
					$(document.getElementById("canvas_margin")).width(hw);
				}
			}
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
	Cto_canvas.style["-webkit-transform"]=
		"scale("+tool.getPageSize()+","+tool.getPageSize()+") translate("+400+"px,"+250+"px)";
	
	//ズーム倍率の表示
	document.getElementById("zoomInfo").innerHTML = "<p>"+parseInt(tool.getPageSize()*100)+"%</p>";
	$("#zoomInfo").fadeIn(function(){
    $(this).find("p").stop();
	},function(){
	    $(this).fadeOut(1000);	
	});
	
	//キャンバス中心の表示
	document.getElementById("canvas_canvas").scrollTop = 1000;
	document.getElementById("canvas_canvas").scrollLeft = 900;

}
