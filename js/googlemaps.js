var place;
var latitude;
var longitude;
function successCallback(position) {
	setMap(position.coords.latitude,position.coords.longitude);
	emitMapData(place);
	console.log("map log");
	console.log(position.coords.longitude);
	latitude = position.coords.latitude;
	longitude = position.coords.longitude;
}

function getLatitude(){
	return latitude;
}
function getLongitude(){
	return longitude;
}

function errorCallback(error) {
  var err_msg = "";
  switch(error.code)
  {
    case 1:
      err_msg = "位置情報の利用が許可されていません";
      break;
    case 2:
      err_msg = "デバイスの位置が判定できません";
      break;
    case 3:
      err_msg = "タイムアウトしました";
      break;
  }
}
function setMap(lat,lng) {
	place = new google.maps.LatLng(lat,lng);
  /*"緯度：position.coords.latitude
    "経度：position.coords.longitude
    "高度：position.coords.altitude;
    "緯度・経度の誤差：position.coords.accuracy
    "高度の誤差：position.coords.altitudeAccuracy
    "方角：position.coords.heading
    "速度：position.coords.speed*/
	/**/
	panorama = new google.maps.StreetViewPanorama(document.getElementById('canvas_eventCanvas'));
	var sv = new google.maps.StreetViewService();//ストリートビューの状況やデータをあつかう
	//place = new google.maps.LatLng(42.345573,-71.098326);//緯度経度のポイントを設定する
	var mapOptions = {//googlemapの状態。center：マップの中央のlatlng、zoom表示倍率、
					//mapTypeId：ここはROADMAPの場合国道何号とか
					//何々通りとか名前が表示されるようになる。
					//他にも色々設定できるらしい
	center: place,
	zoom: 14,
	mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	var map = new google.maps.Map(document.getElementById("canvas_eventCanvas"),mapOptions);
			//指定されたmapOptionの通りのマップをDOMに表示する
			//div限定?
	//var panoramaOptions = {position:inputPlace2,pov: {heading:34,pitch:10,zoom:1}};
	//	var panorama = new google.maps.StreetViewPanorama(document.getElementById("canvas_eventCanvas"),panoramaOptions);
	
	google.maps.event.addListener(map,'click',function(event){
		console.log("staticlatLng:");
		console.log(event.latLng);
		//var google_tile =  "http://maps.google.com/maps/api/staticmap?sensor=false&center=" + event.latLng + "," +
			//getLongitude() + "&zoom=14&size=2000x2000&markers=color:blue|label:U|" +
			//getLatitude() + ',' + getLongitude();

	});
	sv.getPanoramaByLocation(place,PANORAMA_SERCH_RANGE,viewCallBack);
	//第二引数はクリックされた位置からの半径
	//コールバックの引数はpanoramadataと
	//streetviewstatusで固定されている
	//それぞれ第一引数のlatlngの位置が元になってる
	//つまり第一引数のlatlngの位置(+半径)の範囲を
	//ストリートビューで表示する場合の状態を拾う？
}

function viewCallBack(svPanoramaData,svStatus){//processSVDataにあたる(実装は全然違う)
	if(svStatus==google.maps.StreetViewStatus.OK)	{
		panorama.setPano(svPanoramaData.location.pano);		
		panorama.setPov({
			heading:270,pitch:0
		});
		panorama.setVisible(true);
	}else{
	//	alert("半径"+PANORAMA_SERCH_RANGE+"ｍ以内にストリートビューのデータが存在しませんでした。"+
	//			"周辺の地図を表示します。");
		addInfoMessage("半径"+PANORAMA_SERCH_RANGE+"ｍ以内にストリートビューのデータが存在しませんでした。"+
				"周辺の地図を表示します。","red");

		var mapOptions = {
		center: place,
		zoom: 14,
		mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var map = new google.maps.Map(document.getElementById("canvas_eventCanvas"),mapOptions);//指定されたmapOptionの通りのマップをDOMに表示する
		var marker = new google.maps.Marker({
			position:place,
			map: map
		});
		mapButtonSetUp(map);
	}
}

var panoramaPlace;
var panorama;
var PANORAMA_SERCH_RANGE = 50;
//var inputPlace = new google.maps.LatLng(35.6270374,139.342189);Locati
//var place = new google.maps.LatLng(35.6270374,139.342189);
function mapButtonSetUp(map){
	document.getElementById("mapplus").addEventListener("click",mapZoomIn(map));
	document.getElementById("mapminus").addEventListener("click",mapZoomOut(map));
	document.getElementById("mapup").addEventListener("click",mapMoveUp(map));
	document.getElementById("mapdown").addEventListener("click",mapMoveDown(map));
	document.getElementById("mapright").addEventListener("click",mapMoveRight(map));
	document.getElementById("mapleft").addEventListener("click",mapMoveLeft(map));
}

function viewMap() {
	navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}

function emitMapData(inputLatLng){
	console.log("okuri");
	console.dir(inputLatLng);
	Cso_socket.emit("mapData",{latLng:inputLatLng});
}


Cso_socket.on("mapViewData",function(mapData){
	setMap(mapData.latLng.k,mapData.latLng.B);
});

function mapZoomIn(map){
	return function(e){
		map.setZoom(map.getZoom()+1);
	}
}
function mapZoomOut(map){
	return function(e){
		map.setZoom(map.getZoom()-1);
	}
}
function mapMoveUp(map){
	return function(e){
		map.panBy(0,-50);
	}
}
function mapMoveDown(map){
	return function(e){
		map.panBy(0,50);
	}
}
function mapMoveRight(map){
	return function(e){
		map.panBy(50,0);
	}
}
function mapMoveLeft(map){
	return function(e){
		map.panBy(-50,0);
	}
}
