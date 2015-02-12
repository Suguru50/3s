$(".toggleButton1,.toggleButton2").click(function(){
	var thispp = $(this).parent().parent();
	flatRowButtonListener(function(){

		if(thispp.hasClass("slidehidden")){
			thispp.removeClass("slidehidden");
			var curHeight = thispp.height();
			thispp.height(curHeight);
			if(thispp.attr("id")==$(".slideLOuter").attr("id")){
				if($(".slideLOuter").hasClass("scaleup")){
					thispp.stop().animate({ height: 390 },500,function(){
						thispp.css('height', 390);
						thispp.css('overflow', 'visible');
					}.bind(this));
				}else if($(".slideLOuter").hasClass("scaledoubleup")){
					thispp.stop().animate({ height: 690 },500,function(){
						thispp.css('height', 690);
						thispp.css('overflow', 'visible');
					}.bind(this));
				}else{
					thispp.stop().animate({ height: 160 },500,function(){
						thispp.css('height', 160);
						thispp.css('overflow', 'visible');
					}.bind(this));
				}
			}else if(thispp.attr("id")==$("#flatpanel").attr("id")){
				thispp.stop().animate({ height: 365 },500,function(){
					thispp.css('height', 365);
					thispp.css('overflow', 'visible');
				}.bind(this));
			}
		}else {
			thispp.addClass("slidehidden");
			thispp.animate({height:15},500,
				function(){
					thispp.css('overflow', 'hidden');
			}.bind(this));
		}
	}.bind(this));
});

