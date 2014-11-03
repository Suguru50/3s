$(".toggleButton").click(function(){
	console.log($(this));
	console.log($(this).parent());
	if($(this).parent().hasClass("slidehidden")){
		$(this).parent().removeClass("slidehidden");
		$(this).parent().animate({height:15},500);
	}else {
		$(this).parent().addClass("slidehidden");
		var curHeight = $(this).parent().height();
		var autoHeight = $(this).parent().css('height', 'auto').height();
		$(this).parent().height(curHeight);
		$(this).parent().stop().animate({ height: autoHeight },500,function(){
			$(this).parent().css('height', 'auto');//functionのなかだからみれない
		}.bind(this));
	}
});
