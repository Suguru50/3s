var removeVideoId;
  var localStream = null;
window.addEventListener("message", function(msg) {
        //console.log("Content script received: ");
        //console.log(msg.data.response);
		navigator.webkitGetUserMedia({
      		audio: false,
     		video: { mandatory: { chromeMediaSource: "desktop",
					chromeMediaSourceId: msg.data.response } }
				}, gotStream, getUserMediaError);
    }, false);  
function gotStream(stream) {
  //console.log("Received local stream");
  var video = document.getElementById("local-video");
  video.src = URL.createObjectURL(stream);
  localStream = stream;
  stream.onended = function() { console.log("Ended"); };
}
function getUserMediaError() {
  //console.log("getUserMedia() failed.");
}
//-----------------
var localVideo = document.getElementById('local-video');
  //var remoteVideo = document.getElementById('remote-video');
  var mediaConstraints = {'mandatory': {'OfferToReceiveAudio':false, 'OfferToReceiveVideo':true }};
 
  // ---- multi people video & audio ----
  var videoElementsInUse = {};
  var videoElementsStandBy = {};
  pushVideoStandBy(getVideoForRemote(0));
  pushVideoStandBy(getVideoForRemote(1));
  pushVideoStandBy(getVideoForRemote(2));
 
 
  function getVideoForRemote(index) {
    var elementID = 'webrtc-remote-video-' + index;
    var element = document.getElementById(elementID);
    return element;
  }
 
  // ---- video element management ---
  function pushVideoStandBy(element) {
    videoElementsStandBy[element.id] = element;
  }
 
  function popVideoStandBy() {
    var element = null;
    for (var id in videoElementsStandBy) {
      element = videoElementsStandBy[id];
	  removeVideoId = videoElementsStandBy[id];
      delete videoElementsStandBy[id];
      return element;
    }
    return null;
  }
 
  function pushVideoInUse(id, element) {
    videoElementsInUse[id] = element;
  }
 
  function popVideoInUse(id) {
    element = videoElementsInUse[id];
    delete videoElementsInUse[id];
    return element;
  }
 
  function attachVideo(id, stream) {
    //console.log('try to attach video. id=' + id);
    var videoElement = popVideoStandBy();
	console.dir(videoElement);
    if (videoElement) {
      //videoElement.src = window.URL.createObjectURL(stream);
	  /*複数人だと怪しい*/
		console.log("判断0"+document.getElementById("webrtc-remote-video-0").readyState);
		console.log("判断1"+document.getElementById("webrtc-remote-video-1").readyState);
		console.log("判断2"+document.getElementById("webrtc-remote-video-2").readyState);
		for(i=0;i<3;i++){
			if(!document.getElementById("webrtc-remote-video-"+i).readyState){
				document.getElementById("webrtc-remote-video-"+i).src 
						= window.URL.createObjectURL(stream);
				break;
			}
		}
		/**/
		pushVideoInUse(id, videoElement);
      //videoElement.style.display = 'block';
    }
    else {
      //console.error('--- no video element stand by.');
    }
  }
 
  function detachVideo(id) {
    //console.log('try to detach video. id=' + id);
    var videoElement = popVideoInUse(id);
    if (videoElement) {
      videoElement.pause();
      videoElement.src = "";
      //console.log("videoElement.src=" + videoElement.src);
      pushVideoStandBy(videoElement);
    }
    else {
      //console.warn('warning --- no video element using with id=' + id);
    }
  }
 
  function detachAllVideo() {
    var element = null;
    for (var id in videoElementsInUse) {
      detachVideo(id);
    }
  }
 
  function getFirstVideoInUse() {
    var element = null;
    for (var id in videoElementsInUse) {
      element = videoElementsInUse[id];
      return element;
    }
    return null;
  }
 
  function getVideoCountInUse() {
    var count = 0;
    for (var id in videoElementsInUse) {
      count++;
    }
    return count;
  }
  
  
  function isLocalStreamStarted() {
	  //console.log(localStream);
    if (localStream) {
      return true;
    }
    else {
      return false;
    }
  }
 
  // -------------- multi connections --------------------
  var MAX_CONNECTION_COUNT = 3;
  var connections = {}; // Connection hash
  function Connection() { // Connection Class
    var self = this;
    var id = "";  // socket.id of partner
    var peerconnection = null; // RTCPeerConnection instance
    var established = false; // is Already Established
    var iceReady = false;
  }
 
  function getConnection(id) {
    var con = null;
    con = connections[id];
    return con;
  }
 
  function addConnection(id, connection) {
    connections[id] = connection;
  }
 
  function getConnectionCount() {
    var count = 0;
    for (var id in connections) {
      count++;
    }
    //console.log('getConnectionCount=' + count);
    return count;
  }
 
  function isConnectPossible() {
    if (getConnectionCount() < MAX_CONNECTION_COUNT)
      return true;
    else
      return false;
  }
 
  function getConnectionIndex(id_to_lookup) {
    var index = 0;
    for (var id in connections) {
      if (id == id_to_lookup) {
        return index;
      }
 
      index++;
    }
 
    // not found
    return -1;
  }
 
  function deleteConnection(id) {
    delete connections[id];
  }
 
  function stopAllConnections() {
    for (var id in connections) {
      var conn = connections[id];
      conn.peerconnection.close();
      conn.peerconnection = null;
      delete connections[id];
    }
  }
 
  function stopConnection(id) {
    var conn = connections[id];
    if(conn) {
      //console.log('stop and delete connection with id=' + id);
      conn.peerconnection.close();
      conn.peerconnection = null;
      delete connections[id];
    }
    else {
      //console.log('try to stop connection, but not found id=' + id);
    }
  }
 
  function isPeerStarted() {
    if (getConnectionCount() > 0) {
      return true;
    }
    else {
      return false;
    }
  }
 
  
  // ---- socket ------
  // create socket
  var socketReady = false;
  //var port = 3000;
  //var socket = io.connect('http://localhost:' + port + '/');
  
  // socket: channel connected
  //Cso_socket.on('connect', onOpened)
   //     .on('message', onMessage);
  //Cso_socket.on('connect', onOpened)
  //Cso_socket.on('message', onMessage);
 
  function onOpened(evt) {
    socketReady = true;
  }
 
  // socket: accept connection request
  function onMessage(evt) {
    var id = evt.from;
    var target = evt.sendto;
    var conn = getConnection(id);
 
    if (evt.type === 'call') {
      if (! isLocalStreamStarted()) {
        return;
      }

      if (conn) {
		detachVideo(id); // force detach video
		stopConnection(id);
        Cso_socket.json.send({type: "user dissconnected", sendto: id });
		conn=false;
    	videoElementsInUse = [];
    	videoElementsStandBy = [];
  pushVideoStandBy(getVideoForRemote(0));
  pushVideoStandBy(getVideoForRemote(1));
  pushVideoStandBy(getVideoForRemote(2));
		/*
		switch(removeVideoId.id){
			case "webrtc-remote-video-0":
				console.log("aaaaa");
    			console.dir(videoElementsInUse);
  				popVideoInUse(getVideoForRemote(0));
    			//console.dir(videoElementsStandBy);
    			console.dir(videoElementsInUse);
				break;
			case "webrtc-remote-video-1":
				console.log("bbbb");
    			console.dir(videoElementsInUse);
  				popVideoInUse(getVideoForRemote(1));
    			//console.dir(videoElementsStandBy);
    			console.dir(videoElementsInUse);
				break;
			case "webrtc-remote-video-2":
				console.log("ccccc");
    			console.dir(videoElementsInUse);
  				popVideoInUse(getVideoForRemote(2));
    			//console.dir(videoElementsStandBy);
    			console.dir(videoElementsInUse);
				break;
		}
		*/
        return;  // already connected
      }
 
      if (isConnectPossible()) {
        Cso_socket.json.send({type: "response", sendto: id });
      }
      else {
        console.warn('max connections. so ignore call'); 
      }
      return;
    }
    else if (evt.type === 'response') {
      sendOffer(id);
      return;
    } else if (evt.type === 'offer') {
      //console.log("Received offer, set offer, sending answer....")
      onOffer(evt);      
    } else if (evt.type === 'answer' && isPeerStarted()) {  // **
      //console.log('Received answer, settinng answer SDP');
      onAnswer(evt);
    } else if (evt.type === 'candidate' && isPeerStarted()) { // **
      //console.log('Received ICE candidate...');
      onCandidate(evt);
    } else if (evt.type === 'user dissconnected' && isPeerStarted()) { // **
      //console.log("disconnected");
      //stop();
      detachVideo(id); // force detach video
      stopConnection(id);
    	videoElementsInUse = [];
    	videoElementsStandBy = [];
  pushVideoStandBy(getVideoForRemote(0));
  pushVideoStandBy(getVideoForRemote(1));
  pushVideoStandBy(getVideoForRemote(2));
    }
  }
 
  function getRoomName() { // たとえば、 URLに  ?roomname  とする
    var url = document.location.href;
    var args = url.split('?');
    if (args.length > 1) {
      var room = args[1];
      if (room != "") {
        return room;
      }
    }
    return "_defaultroom";
  }
  
  // ----------------- handshake --------------
  //var textForSendSDP = document.getElementById('text-for-send-sdp');
  //var textForSendICE = document.getElementById('text-for-send-ice');
  //var textToReceiveSDP = document.getElementById('text-for-receive-sdp');
  //var textToReceiveICE = document.getElementById('text-for-receive-ice');
  //var iceSeparator = '------ ICE Candidate -------';
  //var CR = String.fromCharCode(13);
  
  /*--
  function onSDP() {
    var text = textToReceiveSDP.value;
    var evt = JSON.parse(text);
    if (peerConnection) {
      onAnswer(evt);
    }
    else {
      onOffer(evt);
    }
    
    //textToReceiveSDP.value ="";
  }
  --*/
  
  //--- multi ICE candidate ---
  /*--
  function onICE() {
    var text = textToReceiveICE.value;
    var arr = text.split(iceSeparator);
    for (var i = 1, len = arr.length; i < len; i++) {
      var evt = JSON.parse(arr[i]);
      onCandidate(evt);
    }
 
    textToReceiveICE.value ="";
  }
  ---*/
  
  
  function onOffer(evt) {
    //console.log("Received offer...")
    //console.log(evt);
    setOffer(evt);
    sendAnswer(evt);
    //peerStarted = true; --
  }
  
  function onAnswer(evt) {
    //console.log("Received Answer...")
    //console.log(evt);
    setAnswer(evt);
  }
  
  function onCandidate(evt) {
    var id = evt.from;
    var conn = getConnection(id);
    if (! conn) {
      console.error('peerConnection not exist!');
      return;
    }
    
    // --- check if ice ready ---
    if (! conn.iceReady) {
      console.warn("PeerConn is not ICE ready, so ignore");
      return;
    }
      
    var candidate = new RTCIceCandidate({sdpMLineIndex:evt.sdpMLineIndex, sdpMid:evt.sdpMid, candidate:evt.candidate});
    //console.log("Received Candidate...")
    //console.log(candidate);
    conn.peerconnection.addIceCandidate(candidate);
  }
 
  function sendSDP(sdp) {
    var text = JSON.stringify(sdp);
    //console.log("---sending sdp text ---");
    //console.log(text);
    //textForSendSDP.value = text;
    
    // send via socket
    Cso_socket.json.send(sdp);
  }
  
  function sendCandidate(candidate) {
    var text = JSON.stringify(candidate);
    //console.log("---sending candidate text ---");
    //console.log(text);
    //textForSendICE.value = (textForSendICE.value + CR + iceSeparator + CR + text + CR);
    //textForSendICE.scrollTop = textForSendICE.scrollHeight;
    
    // send via socket
    Cso_socket.json.send(candidate);
  }
  
  // ---------------------- video handling -----------------------
  // start local video
  function startVideo() {
	  console.log("startVideo?");
	  console.dir(localVideo);
	  console.dir(navigator);
    //navigator.webkitGetUserMedia({video: true, audio: true},
    navigator.webkitGetUserMedia({video: true},
     function (stream) { // success
      localStream = stream;
	  console.log("startVideo");
      localVideo.src = window.webkitURL.createObjectURL(stream);
      localVideo.play();
      localVideo.volume = 0;
     },
     function (error) { // error
      console.error('An error occurred:');
      //console.error(error);
      return;
     }
    );
  }
 
  // stop local video
  function stopVideo() {
    localVideo.src = "";
    localStream.stop();
  }
 
  // ---------------------- connection handling -----------------------
  function prepareNewConnection(id) {
    var pc_config = {"iceServers":[]};
    var peer = null;
    try {
      peer = new webkitRTCPeerConnection(pc_config);
    } catch (e) {
      console.log("Failed to create PeerConnection, exception: " + e.message);
    }
    var conn = new Connection();
    conn.id = id;
    conn.peerconnection = peer;
    peer.id = id;
    addConnection(id, conn);
 
    // send any ice candidates to the other peer
    peer.onicecandidate = function (evt) {
      if (evt.candidate) {
        //console.log(evt.candidate);
        sendCandidate({type: "candidate", 
                          sendto: conn.id,
                          sdpMLineIndex: evt.candidate.sdpMLineIndex,
                          sdpMid: evt.candidate.sdpMid,
                          candidate: evt.candidate.candidate});
      } else {
        //console.log("End of candidates. ------------------- phase=" + evt.eventPhase);
        conn.established = true;
      }
    };
 
    console.log('Adding local stream...');
    peer.addStream(localStream);
 
    peer.addEventListener("addstream", onRemoteStreamAdded, false);
    peer.addEventListener("removestream", onRemoteStreamRemoved, false)
 
    // when remote adds a stream, hand it on to the local video element
    function onRemoteStreamAdded(event) {
      console.log("Added remote stream");
      attachVideo(this.id, event.stream);
      //remoteVideo.src = window.webkitURL.createObjectURL(event.stream);
    }
 
    // when remote removes a stream, remove it from the local video element
    function onRemoteStreamRemoved(event) {
      console.log("Remove remote stream");
      detachVideo(this.id);
      //remoteVideo.pause();
      //remoteVideo.src = "";
    }
 
    return conn;
  }
 
  function sendOffer(id) {
    var conn = getConnection(id);
    if (!conn) {
      conn = prepareNewConnection(id);
    }
 
    conn.peerconnection.createOffer(function (sessionDescription) { // in case of success
      conn.iceReady = true;
      conn.peerconnection.setLocalDescription(sessionDescription);
      sessionDescription.sendto = id;
      sendSDP(sessionDescription);
    }, function () { // in case of error
      console.log("Create Offer failed");
    }, mediaConstraints);
    conn.iceReady = true;
  }
 
  function setOffer(evt) {
    var id = evt.from;
    var conn = getConnection(id);
    if (! conn) {
      conn = prepareNewConnection(id);
      conn.peerconnection.setRemoteDescription(new RTCSessionDescription(evt));
    }
    else {
      console.error('peerConnection alreay exist!');
    }
  }
  
  function sendAnswer(evt) {
    console.log('sending Answer. Creating remote session description...' );
    var id = evt.from;
    var conn = getConnection(id);
    if (! conn) {
      console.error('peerConnection not exist!');
      return
    }
 
    conn.peerconnection.createAnswer(function (sessionDescription) { 
      // in case of success
      conn.iceReady = true;
      conn.peerconnection.setLocalDescription(sessionDescription);
      sessionDescription.sendto = id;
      sendSDP(sessionDescription);
    }, function () { // in case of error
      console.log("Create Answer failed");
    }, mediaConstraints);
    conn.iceReady = true;
  }
 
  function setAnswer(evt) {
    var id = evt.from;
    var conn = getConnection(id);
    if (! conn) {
      console.error('peerConnection not exist!');
      return
    }
    conn.peerconnection.setRemoteDescription(new RTCSessionDescription(evt));
  }
  
  // -------- handling user UI event -----
  /*-----
  // start the connection upon user request
  function connect() {
    if (!peerStarted && localStream && socketReady) { // **
    //if (!peerStarted && localStream) { // --
      sendOffer();
      peerStarted = true;
    } else {
      alert("Local stream not running yet - try again.");
    }
  }
  ----------*/
  
  // call others before connecting peer
  function call() {
    if (! isLocalStreamStarted()) {
      alert("Local stream not running yet. Please [Start Video] or [Start Screen].");
      return;
    }
    if (! socketReady) {
      alert("Socket is not connected to server. Please reload and try again.");
      return;
    }
 
    // call others, in same room
    console.log("call others in same room, befeore offer");
    Cso_socket.json.send({type: "call"});
  }
  
  // stop the connection upon user request
  function hangUp() {
    console.log("Hang up.");
    Cso_socket.json.send({type: "bye"});
    detachAllVideo();
    stopAllConnections();
  }
 
  /*--
  function stop() {
    peerConnection.close();
    peerConnection = null;
    //peerStarted = false; --
  }
  --*/
 
  
