$(".toggleButton").click(function(){
	flatRowButtonListener(function(){
		if($(this).parent().parent().hasClass("slidehidden")){
			$(this).parent().parent().removeClass("slidehidden");
			var curHeight = $(this).parent().parent().height();
			var autoHeight = $(this).parent().parent().css('height', 'auto').height();
			$(this).parent().parent().height(curHeight);
			$(this).parent().parent().stop().animate({ height: autoHeight },500,function(){
				$(this).parent().parent().css('height', 'auto');//functionのなかだからみれない
				$(this).parent().parent().css('overflow', 'visible');
			}.bind(this));
		}else {
			$(this).parent().parent().addClass("slidehidden");
			$(this).parent().parent().animate({height:15},500,
				function(){
					$(this).parent().parent().css('overflow', 'hidden');
			}.bind(this));
		}
	}.bind(this));
});
