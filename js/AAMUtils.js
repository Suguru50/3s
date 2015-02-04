// JavaScript Document

/*
	EX.
	LocalizeUtil.addText("big", {ja:ookii, en:big});
	var txt = LocalizeUtil.getText(key);
*/

/*
--------------------------------------
	RGB Color Data
--------------------------------------
*/
var RGBColor = function(r,g,b){
	this.r = r;
	this.g = g;
	this.b = b;
};
RGBColor.prototype.r = 0;
RGBColor.prototype.g = 0;
RGBColor.prototype.b = 0;
RGBColor.prototype.cssString = function()
{
	return "rgb(" + Math.round(this.r) + "," + Math.round(this.g) + "," + Math.round(this.b) + ")";
}
RGBColor.prototype.setCssString = function(str)
{
	//check #ffffff
	var reg = new RegExp("#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})", "i");
	if(reg.exec(str))
	{
		this.r = parseInt(RegExp.$1, 16)
		this.g = parseInt(RegExp.$2, 16)
		this.b = parseInt(RegExp.$3, 16)
	}
	return this;
}



/*
--------------------------------------
	HSB Color Data
--------------------------------------
*/
var HSBColor = function(h,s,b){
	this.h = h;
	this.s = s;
	this.b = b;
}
HSBColor.prototype.h = 0;
HSBColor.prototype.s = 0;
HSBColor.prototype.b = 0;



/*
--------------------------------------
	RGB Color Data
--------------------------------------
*/
var ColorUtil = function(){}
ColorUtil.rgb2hsb = function(r, g, b)
{
	r = (r<0)?0:(r>255)?255:Math.round(r);
	g = (g<0)?0:(g>255)?255:Math.round(g);
	b = (b<0)?0:(b>255)?255:Math.round(b);
	var min = Math.min(r,g,b);
	var max = Math.max(r,g,b);
	if(max==0){
		return new HSBColor(0,0,0);
	}else{
		var sat = (max-min)/max*100;
	}
	bri = max/255*100;
	hue = ColorUtil._getHue(r,b,g,max,min);
	return new HSBColor(hue,sat,bri);
}

ColorUtil.colorStyle = function(r,g,b){

	var color;
	var hexR,hexG,hexB;
	
	hexR = r.toString(16);
	hexG = g.toString(16);
	hexB = b.toString(16);
	
	if(0<=r && r<16){
		hexR = "0" + hexR;
	}
	if(0<=g && g<16){
		hexG = "0" + hexG;
	}
	if(0<=b && b<16){
		hexB = "0" + hexB;
	}
	
	color = "#" + hexR + hexG + hexB;
	return color;
}

ColorUtil.hsb2rgb = function(hue, sat, bri)
{
	hue = (hue<0)? hue % 360 + 360 : (hue>=360)? hue%360 : hue;
	sat = (sat<0)? 0 : (sat>100)? 100 : sat;
	bri = (bri<0)? 0 : (bri>100)? 100 : bri;
	
	sat *= 0.01;
	bri *= 0.01;
	var val;
	if(sat==0){
		val = bri*255;
		return new RGBColor(val, val, val);
	}
	
	var max = bri * 255;
	var min = max*(1-sat);
	return ColorUtil._hMinMax2RGB(hue, min, max);
}

ColorUtil._getHue = function(r,g,b,max,min)
{
	var range = max - min;
	if(range==0)
		return 0;
		
	var rr = max - r;
	var gg = max - g;
	var bb = max - b;
	var h;
	switch(max){
		case r:
			h = bb-gg;
			break
		case g:
			h = 2 * range + rr - bb;
			break
		case b:
			h = 4 * range + gg - rr;
			break;
	}
	h*=-60;
	h/=range;
	h=(h<0)? h+360 : h;
	
	return h;
}


ColorUtil._hMinMax2RGB = function(h, min, max)
{
	var r, g, b;
	var area = Math.floor(h/60);
	switch(area){
		case 0:
			r = max;
			g = min+h*(max-min)/60;
			b = min;
		break;
		case 1:
			r = max-(h-60)*(max-min)/60;
			g = max;
			b = min;
			break;	
		case 2:
			r = min;
			g = max;
			b = min+(h-120)*(max-min)/60;
			break;	
		case 3:
			r = min;
			g = max-(h-180)*(max-min)/60;
			b = max;
			break;	
		case 4:
			r = min+(h-240)*(max-min)/60;
			g = min;
			b = max;
			break;	
		case 5:
			r = max;
			g = min;
			b = max-(h-300)*(max-min)/60;
			break;	
		case 6:
			r = max;
			g = min+h*(max-min)/60;
			b = min;
			break;	
	}
	r = Math.min(255, Math.max(0, Math.round(r)));
	g = Math.min(255, Math.max(0, Math.round(g)));
	b = Math.min(255, Math.max(0, Math.round(b)));
	return new RGBColor(r,g,b);
}
