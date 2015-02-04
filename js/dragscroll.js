var createKeyInputObject = function(){
	var keyState = [];//キーの状態を持つ配列
	for(var i=0;i<128;i++){
		keyState.push(false);
}
var updateKeyState = function(keyCode,isHit){
	keyState[keyCode] = isHit;
	}
	return {
		init:function(){//初期化
		//キーを押したときのイベントの設定
		document.getElementById("canvas_canvas").onkeydown = function(ev){
			//イベントパラメータ取得。
			//IE では window.event,
			//それ以外では引数から受け取る。
			var eve = ev ? ev : window.event;
			updateKeyState(eve.keyCode,true);

			//ブラウザデフォルトのキーイベントを殺す。
			switch(eve.keyCode){
			case 32: //スペースキー
				return false;
			default:
				return true;
			}
		}
		//キーを離したときのイベントの設定
		document.getElementById("canvas_canvas").onkeyup = function(ev){
			var eve = ev ? ev : window.event;
			updateKeyState(eve.keyCode,false);
			switch(eve.keyCode){
			case 32:
				return false;
			default:
				return true;
			}
			}
		},
		getState:function(){//キー状態取得
			return keyState;
		}
	};
}

//keyInput オブジェクト生成
var input = createKeyInputObject();
input.init();//初期化。
//現在のキーの状態を取得
var keyState = input.getState();



(function() {
	$.fn.dragScroll = function() {
	var target = this;
    $(this).mousedown(function (event) {
		if(keyState[32]){
			mousePointer(4);
			$(this)
				.data('down', true)
				.data('x', event.clientX)
				.data('y', event.clientY)
				.data('scrollLeft', this.scrollLeft)
				.data('scrollTop', this.scrollTop);
				Cca_drawing = false;
				return false;
		}
    });
    // ウィンドウから外れてもイベント実行
	$(document).mousemove(function (event) {
		if ($(target).data('down') == true) {
        // スクロール
		target.scrollLeft($(target).data('scrollLeft') + $(target).data('x') - event.clientX);
		target.scrollTop($(target).data('scrollTop') + $(target).data('y') - event.clientY);
		return false; // 文字列選択を抑止
		}
	}).mouseup(function (event) {
		$(target).data('down', false);
	});
	$(this).mouseup(function (event) {
  		  //描画面のマウスカーソルの変更
		if(mousePointerFlag==2){
			mousePointer(5);
		}else{
			mousePointer(2);
		}
	});	
    return this;
  }
}
)(jQuery);

$(document).ready(function () {
	$('#canvas_canvas').dragScroll(); // ドラッグスクロール設定
});


