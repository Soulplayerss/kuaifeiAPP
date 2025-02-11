// 此sdk 需要jQ库支持

var RtcAddrHeader="https://rtc.minirtc.com"
var TurnServerUrl="114.116.249.245:3478";
var Turnicename="admin";
var Turnpass="qweasdzxc";
function hasUserMedia() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.msGetUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    return !!navigator.getUserMedia;
}
function hasRTCPeerConnection() {
    window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection || window.msRTCPeerConnection;
    return !!window.RTCPeerConnection;
}



function checkWebrtc(){
  if(hasUserMedia()&& hasRTCPeerConnection()) {
    return true;
  }
  return false;
}

//获取turn 权限
function GetDevTurnAuth(strAuthId,strAuthCode,strDevId,FpCallback)
{
	var datajson={
			 AuthId:strAuthId,
			 AuthCode:strAuthCode,
			 DevId:strDevId
    };

	var InitDevAuthTurn=RtcAddrHeader+"/Iot/Dev/GetDevAuthTurn";
	$.ajax({
				type: "POST",
				url:InitDevAuthTurn,
				data:JSON.stringify(datajson),
				dataType:"json",
				success: function(data)
				{
					if(data.code==200){
						console.log(data);
						TurnServerUrl= data.turn;
						Turnicename  = data.icename;
						Turnpass     = data.pass;
						FpCallback(1,"turn-ok");
					}else{
						FpCallback(0,"turn-auth-err");
					}
				},
				error:function (event,qq, XMLHttpRequest)
				{
					FpCallback(0,"turn-net-err");
				 // alert("GetRtcSdpOffer://" + qq+XMLHttpRequest);
				}
			});
}

//turn 服务器的realm 必须为realm
function SetDevTurnAuth(turnurl,icename,pass)
{
	TurnServerUrl=turnurl;
    Turnicename=icename;
    Turnpass=pass;
}


function OpenDevRtcVideo(strauthId,strauthCode,strdevId,dataType,VideoId,callback)
{
  	// alert("xx");
	 var nDialogueId=0;
	 var strAuthId   = strauthId;
	 var strAuthCode = strauthCode;
	 var strDevId    = strdevId;
	 var nDataType   = dataType;
	 var mRtcConnection;
	 var VideoCell = VideoId;
	 var FpCallback= callback;
	 //将网页的候选IP地址给设备
	 function AddIceCandidateToDev(candi){
		var jsondata={
			AuthId:strAuthId,
			AuthCode:strAuthCode,
			DevId:strDevId,
			method:"AddCandidate",
			data:{
				DialogueId:nDialogueId,
				candidate:candi.candidate,
				sdpMid:candi.sdpMid,
				sdpMLineIndex:candi.sdpMLineIndex
			}
		};
		var AddCandidateUrl=RtcAddrHeader+"/Iot/Dev/OnDevComSet";
		$.ajax({
				type: "POST",
				url:AddCandidateUrl,
				data: JSON.stringify(jsondata),
				success: function(msg)
				{
						 console.log(msg);
				},
				error:function (event,qq, XMLHttpRequest)
				{
					FpCallback(strDevId,nDataType,"net-err");
				  //alert("SetRtcSdpAnser"+qq+XMLHttpRequest);
				}
			});

	}

	 function AddIceCandsToDev(candis){
		var jsondata={
			AuthId:strAuthId,
			AuthCode:strAuthCode,
			DevId:strDevId,
			method:"AddCandidates",
			data:{
				DialogueId:nDialogueId,
				candis:candis
			}
		};
		var AddCandidateUrl=RtcAddrHeader+"/Iot/Dev/OnDevComSet";
		$.ajax({
				type: "POST",
				url:AddCandidateUrl,
				data: JSON.stringify(jsondata),
				success: function(msg)
				{
						 console.log(msg);
				},
				error:function (event,qq, XMLHttpRequest)
				{
					FpCallback(strDevId,nDataType,"net-err");
				  //alert("SetRtcSdpAnser"+qq+XMLHttpRequest);
				}
			});

	}

	 var CandiArry = new Array();
	 //开始连接
	 function startPeerConnection(audiostream)
	 {
		 CandiArry = new Array();
		var datajson={
			 AuthId:strAuthId,
			 AuthCode:strAuthCode,
			 DevId:strDevId,
			 method:"GetRtcSdpOffer",
			 data:{
				 iceurl:TurnServerUrl,
				 iceuname:Turnicename,
				 iceupass:Turnpass,
				 icerealm:"realm",
				 audio:nDataType,
			 }
		};/**/


		var configX = {
		   'iceServers': [
				{
					 'urls': 'turn:'+ datajson.data.iceurl,
					 'username': datajson.data.iceuname,
					 'credential':datajson.data.iceupass ,
					 "xxx":""
				}
				]
		};

		 console.log(configX);
		// alert("1");
		mRtcConnection = new RTCPeerConnection(configX);

	     //mRtcConnection.ontrack = handleRemoteTrackAdded;
		mRtcConnection.onaddstream = handleRemoteStreamAdded;

		if(nDataType&&audiostream!=null)
		    mRtcConnection.addStream(audiostream);

		mRtcConnection.onicecandidate = function(event)
		{ console.log(event);
			  //这个逻辑是否需要优化
			  if (event.candidate) {
				 console.log("local:"+JSON.stringify(event.candidate));
				 AddIceCandidateToDev(event.candidate);
				// var candi=event.candidate;
				 //var xx={candidate:candi.candidate,
				//		sdpMid:candi.sdpMid,
					//	sdpMLineIndex:candi.sdpMLineIndex};
				 //CandiArry.push(candi);
				//  alert("2");
			  }else{
				// alert("1");
				// AddIceCandsToDev(CandiArry);
			  }

		};
		//rtc 连接状态改变
		mRtcConnection.oniceconnectionstatechange = function(event)
		{
			 console.log(mRtcConnection.iceConnectionState);
			 FpCallback(strDevId,nDataType,mRtcConnection.iceConnectionState);
		};

		//获取设备SDP
		var GetRtcSdpOfferUrl=RtcAddrHeader+"/Iot/Dev/OnDevComSet";
		$.ajax({
				type: "POST",
				url:GetRtcSdpOfferUrl,
				data:JSON.stringify(datajson),
				dataType:"json",
				success: function(data)
				{
					if(data.code==200){
						var msg = data.data;
						if(msg.status==200){
							 nDialogueId = msg.DialogueId;
							 var jsonObj = {type:"offer",sdp:msg.ipcsdp};
							 mRtcConnection.setRemoteDescription(new RTCSessionDescription(jsonObj));
							 console.log("ttt:"+msg.ipccand);
							 //此处是返回的设备本地的有线网络地址
							 //var sss={candidate:msg.ipccand,sdpMid:"0",sdpMLineIndex:0};
							 //remotecan = new RTCIceCandidate(sss);
							 mRtcConnection.createAnswer().then(createAnswerAndSendMessage, handleCreateAnswerError);
						}else{
							alert("limit");
						}
					}else{
						FpCallback(strDevId,data.code,data.reason);
					}
				},
				error:function (event,qq, XMLHttpRequest)
				{
					FpCallback(strDevId,nDataType,"net-err");
				}
			});
	}
	//获取设备的地址
	function GetDevIceCandidates(){
		var jsondata={
			 AuthId:strAuthId,
			 AuthCode:strAuthCode,
			 DevId:strDevId,
			 method:"GetCandis",
			 data:{
				 DialogueId:nDialogueId
			 }
		};
		var GetCandisHandlerUrl=RtcAddrHeader+"/Iot/Dev/OnDevComSet";
		$.ajax({
				type: "POST",
				url:  GetCandisHandlerUrl,
				data: JSON.stringify(jsondata),
				dataType:"json",
				success: function(data)
				{
					if(data.code==200)
					{
						var msg =data.data;
						if(msg.status==200){
							console.log(msg.cands.length);
							if(msg.cands.length==0)
							{
							   GetDevIceCandidates();
							}else{
								for(var i=0;i<msg.cands.length;i++) {
									 var Item =msg.cands[i];
									 var sss={candidate:Item,sdpMid:"0",sdpMLineIndex:0};
									 console.log(JSON.stringify(sss));
									 var remotecan = new RTCIceCandidate(sss);
									 mRtcConnection.addIceCandidate(remotecan).catch(e =>
									 {
										console.log("Failure during addIceCandidate(): " + e.name);
									 });
								}
							}

						}else{
							 alert("GetDevIceCandidates not find DialogueId");
							 alert(msg);
						}
					}else{
						 FpCallback(strDevId,nDataType,"dev-err");
					}

				},
				error:function (event,qq, XMLHttpRequest)
				{
					FpCallback(strDevId,nDataType,"net-err");
				}
			});
	}


    //请求设备播放语音
	function OnReqRtcAuidoPlay(ssrc){
		var jsondata={
			 AuthId:strAuthId,
			 AuthCode:strAuthCode,
			 DevId:strDevId,
			 method:"ReqRtcAuidoPlay",
			 data:{
				 DialogueId:nDialogueId,
				 ssrc:parseInt(ssrc),
		         CreateChn:0,
		         DialogueId:nDialogueId,
				 //音频 PCMA G711 8k
		         nEnType:1
			 }
		};
		var ReqRtcAuidoPlayUrl=RtcAddrHeader+"/Iot/Dev/OnDevComSet";
		$.ajax({
				type: "POST",
				url:  ReqRtcAuidoPlayUrl,
				data: JSON.stringify(jsondata),
				dataType:"json",
				success: function(data)
				{
					console.log(JSON.stringify(data));
					if(data.code==200)
					{
						 FpCallback(strDevId,nDataType,"Dev-Audio-TalkOk");
					}else{
						 FpCallback(strDevId,nDataType,"Dev-Audio-TalkErr");
					}

				},
				error:function (event,qq, XMLHttpRequest)
				{
					FpCallback(strDevId,nDataType,"net-err");
				}
			});
	}

	//设置应答，将sdp 给设备
	function createAnswerAndSendMessage(answer) {
		var sdp = answer.sdp;
		if(nDataType>0)
		{
			var index =  sdp.indexOf("ssrc:");
			if(index<0)
			{
				alert("ssrc info");
			}
			if(sdp.length-index>30)
			{
				 var audiossrc  =  sdp.substr(index+5,25);
				 index      =  audiossrc.indexOf(" ");
				 audiossrc  =  audiossrc.substr(0,index);
				 audiossrc  =   audiossrc.trim();
				 //请求设备播放器音频
				 OnReqRtcAuidoPlay(audiossrc);
			}
		}

		mRtcConnection.setLocalDescription( answer);

		var SetRtcSdpAnserUrl=RtcAddrHeader+"/Iot/Dev/OnDevComSet";
		var jsondata={
			 AuthId:strAuthId,
			 AuthCode:strAuthCode,
			 DevId:strDevId,
			 method:"SetRtcSdpAnser",
			 data:{
			 DialogueId:nDialogueId,
				 sdp:answer.sdp
			 }
		};
		$.ajax({
				type: "POST",
				url:SetRtcSdpAnserUrl,
				data: JSON.stringify(jsondata),
				dataType:"json",
				success: function(data)
				{
					if(data.code==200)
					{
						var msg =data.data;
						if(msg.status==200){
							 console.log("ok");
							 GetDevIceCandidates();
						}else{
							 alert("createAnswerAndSendMessage not find DialogueId");
						}
					}else{
						FpCallback(strDevId,nDataType,"dev-err");
					}

				},
				error:function (event,qq, XMLHttpRequest)
				{
					FpCallback(strDevId,nDataType,"net-err");
				}
		});
	}

	function handleCreateAnswerError(error) {
		 alert(error);
		console.log('CreateAnswer() error: ', error);
	 }

    function handleRemoteTrackAdded(ev) {
		VideoCell.srcObject = ev.streams[0];
		VideoCell.play()
	}



	function handleRemoteStreamAdded(event) {

		 VideoCell.srcObject = event.stream;
		 VideoCell.play();
	}
	if(nDataType==1 || nDataType==2 ){
		if(hasUserMedia()){
			navigator.getUserMedia(
			{
			  audio: true,
			  video: false,
			},
			stream => {
				   startPeerConnection(stream);
			},
			err => {
				console.log(err);
			});
		}else{
		}
	}else{
        startPeerConnection(null);
	}


	 var jsonInfo={
		 DlgId:nDialogueId,
	     RtcConn:mRtcConnection
	 }

	return jsonInfo;
}

function CloseDevRtcVideo(info)
{
	if(info.RtcConn!=null)
	info.RtcConn.close();
}

function  SetVideoQuali( nQua,devId,authId,authCode)
{
				var chn1MaxCodeRate=800;
				var chn1MaxFrameRate=20;
				var chn1PicWh=2;
				if(nQua==0)
				{
					chn1MaxFrameRate=20;
					chn1MaxCodeRate=600;
					chn1PicWh=1;
				}else if(nQua==1)
				{
					chn1MaxFrameRate=20;
					chn1MaxCodeRate=800;
					chn1PicWh=2;
				}else if(nQua>=2)
				{
					chn1MaxCodeRate=1200;
					chn1PicWh=3;
					chn1MaxFrameRate=15;
				}


				var jsondataXXX={
					 method: "SetVideoCfg",
					 AuthId:authId,
					 AuthCode:authCode,
					 DevId:devId,
                     data:{
					       chn1MaxCodeRate: chn1MaxCodeRate,
				           chn1MaxFrameRate: chn1MaxFrameRate,
					       chn1PicWh:chn1PicWh
				     }
				};

				var xUrl=RtcAddrHeader+"/Iot/Dev/OnDevComSet";
				 $.ajax({
								type: "POST",
								url:xUrl,
								data: JSON.stringify(jsondataXXX),
								success: function(msg)
								{
										 console.log(msg);
								},
								error:function (event,qq, XMLHttpRequest)
								{

								}
						  });
}




