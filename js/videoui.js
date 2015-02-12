$("#videoscaleup").click(function (e){
	var elm = $(".slideLOuter");
	if(elm.hasClass("scaleup")){
		elm.addClass("scaledoubleup");
		elm.removeClass("scaleup");
		$("#videoBlock").css("overflow-y","scroll");
		elm.animate({
			height:"690px"
		},400,"easeOutQuint");
		$(".webvideo").animate({
			height:"300px"
			,width:"400px"
		},400,"easeOutQuint");
	}else if(elm.hasClass("scaledoubleup")){

	}else{
		elm.addClass("scaleup");
		elm.animate({
			height:"390px"
		},400,"easeOutQuint");
		$(".webvideo").animate({
			height:"150px"
			,width:"200px"
		},400,"easeOutQuint");
	}
});

$("#videoscaledown").click(function (e){
	var elm = $(".slideLOuter");
	if(elm.hasClass("scaleup")){
		$(".slideLOuter").removeClass("scaleup");
		$(".slideLOuter").animate({
			height:"160px"
		},400,"easeOutQuint");
		$(".webvideo").animate({
			height:"75px"
			,width:"100px"
		},400,"easeOutQuint");
	}else if(elm.hasClass("scaledoubleup")){
		$("#videoBlock").css("overflow-y","");
		elm.removeClass("scaledoubleup");
		elm.addClass("scaleup");
		elm.animate({
			height:"390px"
		},400,"easeOutQuint");
		$(".webvideo").animate({
			height:"150px"
			,width:"200px"
		},400,"easeOutQuint");
	}else{
	}
});
