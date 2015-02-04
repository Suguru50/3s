$("#videoscaleup").click(function (e){
	$(".slideLOuter").addClass("scaleup");
	$(".slideLOuter").animate({
		height:"390px"
	},400,"easeOutQuint");
	$(".webvideo").animate({
		height:"150px"
		,width:"200px"
	},400,"easeOutQuint");
});

$("#videoscaledown").click(function (e){
	$(".slideLOuter").removeClass("scaleup");
	$(".slideLOuter").animate({
		height:"160px"
	},400,"easeOutQuint");
	$(".webvideo").animate({
		height:"75px"
		,width:"100px"
	},400,"easeOutQuint");
});
