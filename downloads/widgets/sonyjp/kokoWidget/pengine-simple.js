// PlaceEngine JavaScript API
// $Id: pengine.js,v 1.31 2008/03/06 16:12:23 rekimoto Exp $
// Copyright(c)2005-2007 Jun Rekimoto

var referer = "http://referers.koozyt.com/mylo/kokowidget/index.html";

var __pe = null;
function PEngine(cb) {
    this.version = "1.01";
    this.host = "http://www.placeengine.com/api";
    this.rtagd = "http://127.0.0.1:5448";
    this.debug = false;
    this.clientexists = false;
    this.appkey = null;
    this.rtag = null;
    this.time = null;
    this.sameserver = false;
    this.x = 0;
    this.y = 0;
    this.numap = 0;
    this.onGetWifi = null;
    this.onFindClient = null;
    this.onGetLocation = null;
    this.onMessage = null;
    this.idstatus = null;
    this.lang_en = false;
    if (cb != null) {
	if (cb.host != null) { this.host = cb.host; }
	if (cb.rtagd != null) { this.rtagd = cb.rtagd; }
	if (cb.debug != null) { this.debug = cb.debug; }
	if (cb.lang_en != null) { this.lang_en = cb.lang_en; }
	if (cb.sameserver != null) { this.sameserver = cb.sameserver;}
	if (cb.idstatus != null) { this.idstatus = cb.idstatus; }
	if (cb.onGetLocation != null) { this.onGetLocation = cb.onGetLocation;}
	if (cb.onMessage != null) { this.onMessage = cb.onMessage;}
	if (cb.onGetWifi != null) { this.onGetWifi = cb.onGetWifi;}
	if (cb.onFindClient != null) { this.onFindClient = cb.onFindClient;}
	if (cb.appkey != null) {this.appkey = cb.appkey;}
    }
    this.callback = cb;


    function sendScript(url){
	if (this.debug) alert("peSendScript: " + url);
	var s = document.createElement("script");
	s.src= url;
	s.charset="UTF-8";
	document.body.appendChild(s);
    }
    PEngine.prototype.sendScript = sendScript;

    function message(str, is_error) {
	if (this.debug) alert("msg:"+ str);
	if (this.idstatus != null && document.getElementById(this.idstatus) != null) document.getElementById(this.idstatus).innerHTML = str;
	if (__pe.onMessage != null) __pe.onMessage(str, is_error);
    }
    PEngine.prototype.message = message;

    function errmsg(code) {
	if (this.debug) alert("errmsg:"+ code);
	if (this.idstatus != null) {
	    if (code<=-100) {
		__pe.message(this.lang_en ?
			     "Not registered in PlaceEngine DB"		     
			     :
			     "まだ位置情報が登録されていません。", true);
	    } else if (code<=0) {
		__pe.message((this.lang_en ?
			      "Cannot get Wi-Fi information. No access points nearby of Wi-Fi device is OFF.":
			      "Wi-Fi情報が取得できません。周辺にアクセスポイントが無いか, 無線LANがOFFになっています。") + code, true);
	    }
	}
    }
    PEngine.prototype.errmsg = errmsg;

    function getLocation() {
	this.numap = 0;
	if (this.appkey != null) {
	    this.sendScript(this.rtagd + "/rtagjs?t=" + (new Date().getTime()) + "&appk=" + this.appkey);
	} else {
	    this.sendScript(this.rtagd + "/rtagjs?t=" + (new Date().getTime()));
	}
    }
    PEngine.prototype.getLocation = getLocation;

    function submitRtag(rtag,time) {
	var param = 'rtag=' + rtag + "&t=" + time;
	if (this.appkey != null) {
	    param += "&appk=" + this.appkey;
	}
	//param += "&ref=" + encodeURIComponent(location.href);
	param += "&ref=" + encodeURIComponent(referer);
	if (this.sameserver) {
	    param += '&fmt=json';
	    if (this.lang_en) param += "&lang=en";
	    new Ajax.Request('/api/loc', {method:'get',parameters:param,onComplete:recvLoc2});
	} else {
	    //this.sendScript(this.host + "/loc?" + param);
	    var _req = new RequestHttp();
	    if(_req) {
		_req.open('GET', this.host + '/loc?' + param, recvLoc3);
		_req.setRequestHeader('Referer', referer);
		_req.send(null);
	    }
	}
    }
    PEngine.prototype.submitRtag = submitRtag;
    __pe = this;

    this.message("PlaceEngineを起動してください。", false);

    this.sendScript(this.rtagd + "/ackjs?t=" + (new Date().getTime()));
    return this;
}
// from PlaceEngine server
function recvLoc(x, y, range, info) {
    if (__pe == null) return;
    if (__pe.debug) alert("recvLoc: " + x + "," + y + ",range=" + range + "," + info);
    __pe.x = x;
    __pe.y = y;
    if (x !=0 && y != 0 && range >= 0) {
	// success;
    } else if (info.msg != null && info.msg.length > 0) {
	__pe.message(info.msg, true);
    } else {
	__pe.errmsg(range);
    }
    if (__pe.onGetLocation != null) __pe.onGetLocation(x, y, range, info);
}
// from PlaceEngine server
// callback from locserver (when sameserver==true)
function recvLoc2(r) {
    if (__pe == null) return;
    if (__pe.debug) alert("recvLoc: " + r.responseText);
    var val = eval(r.responseText);
    if (val.length >= 4) 
	recvLoc(val[0], val[1], val[2], val[3]);
}
function recvLoc3(issue, r) {
	recvLoc2(r);
}
// from rtagd
function recvRTAG(rtag,numap,time){
    if (__pe == null) return;
    if (__pe.debug) alert("recvRTAG: " + numap);
    if (numap >= 0) __pe.numap = numap;
    if (rtag != null && rtag != undefined) __pe.rtag = rtag;
    if (time!=null) __pe.time = time;
    if (numap > 0) {
	// success;
    } else if (numap == -4 || numap == -5 || numap == -6) {
	__pe.message((__pe.lang_en?"Refused retrieving Wi-Fi information":"Wi-Fi情報取得が拒絶されました(")+numap+")", true);
    } else if (numap < 0) {
	__pe.message(__pe.lang_en?"Wi-Fi device is OFF":"無線LANがOFFです", true);
    } else {
	__pe.message((__pe.lang_en?"Cannot get Wi-Fi information. No access ponts nearby of Wi-Fi device is OFF. (":"Wi-Fi情報が取得できません。周辺にアクセスポイントがないか無線LANがOFFになっています(")+numap+")", true);
    }
    var askserver = true;
    if (__pe.onGetWifi != null) askserver = __pe.onGetWifi(rtag,numap);
    if (numap > 0 && askserver) __pe.submitRtag(rtag,time);
}
// callback from rtagd
function ackRTAG(ver){
    if (__pe == null) return;
    if (__pe.debug) alert("ackRTAG");
    __pe.message(__pe.lang_en?"<b>PlaceEngine</b> client found":"<b>PlaceEngine</b>クライアントが見つかりました。", false);
    __pe.clientexists = true;
    if (__pe.onFindClient != null) {__pe.onFindClient(ver);}
}

