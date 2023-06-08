/*
 * Copyright 2008 Koozyt, Inc. All rights reserved.
 *
 * This source code is being distributed under the terms specified in
 * an exclusive license agreement with Sony Computer Science
 * Laboratories, Inc.  Please do not use it for any other purposes.
 *
 * This source code is distributed AS IS without warranty. We are not
 * liable for any bugs herein, nor can we be held responsible for any
 * programs written based on this code.
 *
 * This source code may not be distributed (in whole or in parts) to
 * any parties. Please contact Sony Computer Science Laboratories for
 * redistribution rights.
 */

var debug = 0;
var pe = null;
var extension = null;
var loc;
var timer0 = null;
var is_first = true;

var slideshow_interval = 60000;

var start_frame = 0;
var end_frame = -1;
var cur_frame = -1;
var splash_mode = 1;
var info_mode = 0;
var slide_mode = 0;
var range = 1000;
var direction_mode = 1;
var count = 20;

var msg_fail_pos = '現在地取得に失敗しました。前回の位置で検索します。';
var msg_fail_pos_none = '現在地取得に失敗しました。代わりに東京都千代田区を検索します。';
var key = "07420f38980bf437";
var key_doko = "86c9b696f1198cb682aceedec90cd092";

var service_hp = {
	main_url: "http://mtl.recruit.co.jp/sandbox/koko/redirect.php?&uri=http%3A%2F%2Fhotpepper.jp%3Fvos%3Dnhppapis00002",
	service_url: "http://mtl.recruit.co.jp/sandbox/koko/hotpepper/gourmet/v1/?key=%KEY%&lat=%LAT%&lng=%LNG%&range=%RANGE%&count=%COUNT%&format=jsonp&callback=callback_hp&vos=nhppapis00002",
	map_url: "http://www.placeengine.com/map?x=%LNG%&y=%LAT%",
	image: "images/logo_hp.png",
	image_push: "images/logo_hp_push.png",
	range_to_param: function(range) {
		if (range <= 300)
			return 1;
		else if (range <= 500)
			return 2;
		else if (range <= 1000)
			return 3;
		else if (range <= 2000)
			return 4;
		return 5;
	}
};

var service_hpbeauty = {
	main_url: "http://mtl.recruit.co.jp/sandbox/koko/redirect.php?uri=http%3A%2F%2Fbeauty.hotpepper.jp%3Fvos%3Dnhppapis00002",
	service_url: "http://mtl.recruit.co.jp/sandbox/koko/beauty/salon/v1/?key=%KEY%&lat=%LAT%&lng=%LNG%&range=%RANGE%&count=%COUNT%&format=jsonp&callback=callback_hpbeauty&vos=nhppapis00002",
	map_url: "http://www.placeengine.com/map?x=%LNG%&y=%LAT%",
	image: "images/logo_hpb.png",
	image_push: "images/logo_hpb_push.png",
	range_to_param: function(range) {
		if (range <= 300)
			return 1;
		else if (range <= 500)
			return 2;
		else if (range <= 1000)
			return 3;
		else if (range <= 2000)
			return 4;
		return 5;
	}
};

var service_doko = {
	main_url: "http://mtl.recruit.co.jp/sandbox/koko/redirect.php?uri=http%3A%2F%2Fwww.doko.jp%3Fvos%3Dnhppapis00002",
	service_url: "http://mtl.recruit.co.jp/sandbox/koko/v1/getStation/?key=%KEY_DOKO%&lat_jgd=%LAT%&lon_jgd=%LNG%&radius=%RANGE%&pagesize=20&format=json&callback=callback_doko&vos=nhppapis00002",
	map_url: "http://www.placeengine.com/map?x=%LNG%&y=%LAT%",
	image: "images/logo_station.png",
	image_push: "images/logo_station_push.png",
	range_to_param: function(range) { return Math.floor(range / 2); }
};

var service_all = new Array(service_hp, service_hpbeauty, service_doko);
var num_service = service_all.length;
var cur_service = 0;

function init() {
	if (debug) {
		alert("init");
		alert(window.navigator.appName);
	}

	extension = new Extension();

	prefObject = new Preferences(prefCallback);

	pe = new PEngine({
		idstatus:null,
		appkey:appkey,
		onGetWifi:on_getwifi,
		onGetLocation:on_getlocation,
		onMessage:on_message,
	});

	set_service();
}

function open_page(url) {
//	if (window.confirm('ブラウザを起動します。よろしいですか?'))
		extension.openWeb(url);
}

function clear_timers() {
	stop_slideshow();
}

function randomSort ( myArray ) {
  var i = myArray.length;
  if ( i == 0 ) return false;
  while ( --i ) {
    var j = Math.floor( Math.random() * ( i + 1 ) );
    var tempi = myArray[i];
    var tempj = myArray[j];
    myArray[i] = tempj;
    myArray[j] = tempi;
  }
}

function bubbleSort(myArray, compare) {
	var i, j;

	for (i = 0; i < myArray.length - 1; i++) {
		for (j = 1; j < myArray.length - i; j++) {
			if (compare(myArray[j - 1], myArray[j]) > 0) {
				var temp0 = myArray[j - 1];
				var temp1 = myArray[j];
				myArray[j - 1] = temp1;
				myArray[j] = temp0;
			}
		}
	}
}

function button_down(name) {
	$(name).src = "images/" + name + "_push.png";
	return true;
}

function button_up(name) {
	$(name).src = "images/" + name + ".png";
	return true;
}

function button_jump(name, url) {
	button_down(name);
	button_up(name);

	open_page(url);
}

function set_splash(is_enable) {
	if (is_enable) {
		Element.hide('content');
		Element.show('splash');
	}
	else {
		Element.show('content');
		Element.hide('splash');
	}

	splash_mode = is_enable;
}

/*
 * Functions for Get Location.
 */
function getlocation() {
	set_splash(false);

	button_down('getposition');
	button_up('getposition');
	set_btn_info(false);

	$('pestatus').innerHTML = "現在地取得中… <img src='images/searchwait11.gif' align='bottom' />";
	$('content').innerHTML = "<img id='main_scanning' src='images/wifiraderanim.gif' />";

	pe.getLocation();
}

function on_getwifi(rtag, numap) {
	if (numap > 0) {
		return true;
	}
	else {
		if (loc.is_known) {
			alert(msg_fail_pos);
		}
		else {
			alert(msg_fail_pos_none);
			loc.is_known = 1;
			save_position(loc);
		}

		$('pestatus').innerHTML = "<marquee behavior='scroll'>" + loc.info.addr + loc.info.floor + "</marquee>";
		get_data(loc);
		return false;
	}
}

function on_getlocation(x, y, r, info) {
	var url = "http://www.placeengine.com/map?x=" + x + "&y=" + y; 

	if (debug)
		alert("on_getlocation");

	is_first = false;

	if (r > 0) {
		if (info.floor == null)
			info.floor = '';

		loc = { x:x, y:y, range:r, info:info, is_known:1 };
		save_position(loc);
		$('pestatus').innerHTML = "<marquee behavior='scroll'>" + info.addr + info.floor + "</marquee>";
	}
	else {
		$('pestatus').innerHTML = "<marquee behavior='scroll'>" + info.msg + "</marquee>";
		if (loc.is_known) {
			alert(info.msg);
			alert(msg_fail_pos);
		}
		else {
			alert(info.msg);
			alert(msg_fail_pos_none);
			loc.is_known = 1;
			save_position(loc);
		}
	}

	stop_slideshow();
	get_data(loc);
}

function on_message(message, is_error) {
	if (is_error)
		alert(message);

	$('pestatus').innerHTML = "<marquee behavior='slide' loop='2'>" + message + "</marquee>";
	$('content').innerHTML = '';
}

function get_data(loc) {
	var service = service_all[cur_service];
	var url;

	if (debug)
		alert("get_data");

	stop_slideshow();
	set_slide_mode(slide_mode, false);
	set_btn_info(false);

	$('content').innerHTML = '<div id="info">データ取得中…</div><img id="main_loading" src="images/loadinfo.gif" />';

	url = service.service_url;
	url = url.replace(/%KEY%/g, key);
	url = url.replace(/%KEY_DOKO%/g, key_doko);
	url = url.replace(/%LAT%/g, loc.y);
	url = url.replace(/%LNG%/g, loc.x);
	url = url.replace(/%RANGE%/g, service.range_to_param(range));
	url = url.replace(/%COUNT%/g, count);

	var s = document.createElement("script");
	s.src = url;
	s.charset="UTF-8";
	document.body.appendChild(s);
}

/*
 * Functions for map.
 */
function goto_map(event) {
	var url;

	/*
	if (event.pageX > 40)
		return;
	*/

	if (!is_first) {
		url = service_all[cur_service].map_url;
		url = url.replace(/%LAT%/g, loc.y);
		url = url.replace(/%LNG%/g, loc.x);

		open_page(url);
	}
}

/*
 * Functions for displaying a shop.
 */
function show_shop(index, info_mode) {
	if (end_frame < 0)
		return;

	Element.show('title' + index);
	if (info_mode) {
		Element.hide('photo' + index);
		Element.show('desc' + index);
	}
	else {
		Element.show('photo' + index);
		Element.hide('desc' + index);
		if (direction_mode) {
			Element.show('arrow' + index);
			Element.show('distance' + index);
		}
		else {
			Element.hide('arrow' + index);
			Element.hide('distance' + index);
		}
	}
}

function hide_shop(index) {
	if (end_frame < 0)
		return;

	Element.hide('title' + index);
	Element.hide('photo' + index);
	Element.hide('desc' + index);
}

function delta(x1, y1, x2, y2) {
	x1 = x1 * Math.PI / 180.0;
	y1 = y1 * Math.PI / 180.0;
	x2 = x2 * Math.PI / 180.0;
	y2 = y2 * Math.PI / 180.0;

	var A = 6378137;	// 地球の赤道半径(6378137m)

	var dx = A * (x2-x1) * Math.cos( y1 );
	var dy = A * (y2-y1); 

	return {x:dx, y:dy};
}

function distance(x1, y1, x2, y2) {
	var d = delta(x1, y1, x2, y2);

	return Math.floor(Math.sqrt(d.x * d.x + d.y * d.y));
}

function direction(x1, y1, x2, y2, is_file) {
	var d = delta(x1, y1, x2, y2);
	var v = Math.atan2(d.y, d.x) * 180.0 / Math.PI;
	var unit = 22.5;
	var dir;
	var name;


	if (-1 * unit <= v && v < 1 * unit) {
		dir = "east";
		name = "東";
	}
	else if (unit <= v && v < 3 * unit) {
		dir = "northeast";
		name = "北東";
	}
	else if (3 * unit <= v && v < 5 * unit) {
		dir = "north";
		name = "北";
	}
	else if (5 * unit <= v && v < 7 * unit) {
		dir = "northwest";
		name = "北西";
	}
	else if (7 * unit <= v || v < -7 * unit) {
		dir = "west";
		name = "西";
	}
	else if (-7 * unit <= v && v < -5 * unit) {
		dir = "southwest";
		name = "南西";
	}
	else if (-5 * unit <= v && v < -3 * unit) {
		dir = "south";
		name = "南";
	}
	else if (-3 * unit <= v && v < -1 * unit) {
		dir = "southeast";
		name = "南東";
	}

	if (is_file)
		return "images/arrow_" + dir + ".png";
	else
		return name;
}

/*
 * Functions to change services.
 */
function set_service() {
	var i;

	stop_slideshow();

	if (end_frame >= 0) {
		for (i = start_frame; i <= end_frame; i++)
			hide_shop(i);
		end_frame = -1;
	}

	$('btn_logo').src = service_all[cur_service].image;

	if (!is_first)
		get_data(loc);
}

function goto_service() {
	var url = service_all[cur_service].main_url;

	$('btn_logo').src = service_all[cur_service].image_push;
	$('btn_logo').src = service_all[cur_service].image;

	open_page(url);
}

function goto_service_down(name) {
	$(name).src = service_all[cur_service].image_push;
	return true;
}

function goto_service_up(name) {
	$(name).src = service_all[cur_service].image;
	return true;
}

function prev_service() {
	button_down('btn_left');
	button_up('btn_left');

	cur_service = (cur_service + num_service - 1) % num_service;
	set_service();
}

function next_service() {
	button_down('btn_right');
	button_up('btn_right');

	cur_service = (cur_service + 1) % num_service;
	set_service();
}

/*
 * Functions for slide mode.
 */
function set_slide_mode(is_enable, is_permanent) {
	if (is_enable && end_frame > 0) {
		Element.show('control');
		Element.hide('getposition');
		set_btn_info(false);
	}
	else {
		Element.hide('control');
		Element.show('getposition');
		set_btn_info(true);
	}

	if (is_permanent)
		slide_mode = is_enable;
}

function goto_shop() {
	var url = $('url' + cur_frame).innerHTML;

	button_down('web_start');
	button_up('web_start');

	open_page(url);
}

function next_shop(endflag) {
	button_down('btn_next');
	button_up('btn_next');

	if (end_frame < 0)
		/*
		 * No slide show loaded.
		 */
		return;

	hide_shop(cur_frame);

	if (cur_frame >= end_frame)
		cur_frame = start_frame;
	else
		cur_frame++;

	if (!endflag)
		show_shop(cur_frame, info_mode);

	//reschedule_slideshow();
}

function prev_shop(endflag) {
	button_down('btn_prev');
	button_up('btn_prev');

	if (end_frame < 0)
		/*
		 * No slide show loaded.
		 */
		return;

	hide_shop(cur_frame);

	if (cur_frame <= start_frame)
		cur_frame = end_frame;
	else
		cur_frame--;

	if (!endflag)
		show_shop(cur_frame, info_mode);

	//reschedule_slideshow();
}

function cancel_slide_mode() {
	button_down('btn_back');
	button_up('btn_back');

	set_slide_mode(false, true);
}

/*
 * Functions for info mode.
 */
function set_info_mode(is_enable, is_permanent) {
	show_shop(cur_frame, is_enable);

	if (is_enable) {
		set_btn_info(false);
		Element.hide('btnViewMap');
		Element.hide('lblAddr');
		Element.hide('getposition');
		Element.show('return');
	}
	else {
		set_btn_info(true);
		Element.show('btnViewMap');
		Element.show('lblAddr');
		Element.show('getposition');
		Element.hide('return');
	}

	if (is_permanent)
		info_mode = is_enable;
}

function set_btn_info(is_enable) {
	if (is_enable && end_frame > 0) {
		Element.show('btn_info_div');
		Element.hide('btn_info_push');
		Element.show('btn_info');
		$('btn_info').src = "images/btn_info.gif";
	}
	else {
		Element.hide('btn_info_div');
	}
}

function btn_info_down() {
	Element.hide('btn_info');
	Element.show('btn_info_push');
}

function btn_info_up() {
	Element.hide('btn_info_push');
	Element.show('btn_info');
}

function back_to_photo() {
	button_down('return');
	button_up('return');

	set_info_mode(false, true);
}

/*
 * Functions for slide show.
 */
function start_slideshow() {
	cur_frame = end_frame;
	next_shop(0);
}

function stop_slideshow() {
	if (timer0 != null) {
		clearTimeout(timer0);
		timer0 = null;
	}
}

function reschedule_slideshow() {
	stop_slideshow();
	timer0 = setTimeout("next_shop(0)", slideshow_interval);
}

/*
 * Callbacks.
 */
function callback_hp(params) {
	var results = params.results;
	var shops = results.shop;
	var html = '';
	var i;

	randomSort(shops);

	end_frame = shops.length - 1;
	for (i = 0; i < shops.length; i++) {
		html += '<div id="title%INDEX%" class="lblShopName" style="%STYLE%">%NAME%</div>';
		html += '<div id="url%INDEX%" style="%STYLE%">%URL%</div>';
		html += '<div id="photo%INDEX%" class="imgPhoto" style="%STYLE%">';
		html += '<input type="image" src="%IMAGE%" onclick="set_slide_mode(true, true)" />';
		html += '<input type="image" id="arrow%INDEX%" class="imgCompass" src="%ARROW%" />';
		html += '<span id="distance%INDEX%" class="distArea">%DISTANCE%</span>';
		html += '</div>';
		html += '<textarea id="desc%INDEX%" class="desc" rows="8" style="%STYLE%">';
		html += '名前: %NAME%\n';
		html += '住所: %ADDRESS%\n';
		html += 'アクセス: %ACCESS%\n';
		html += '説明: %DESC%\n';
		html += '</textarea>';

		html = html.replace(/%INDEX%/g, i);
		html = html.replace(/%NAME%/g, shops[i].name);
		html = html.replace(/%IMAGE%/g, shops[i].photo.pc.l);
		html = html.replace(/%ARROW%/g,
			direction(loc.x, loc.y, shops[i].lng, shops[i].lat, true));
		html = html.replace(/%DISTANCE%/g,
			distance(loc.x, loc.y, shops[i].lng, shops[i].lat) + 'm');
		html = html.replace(/%URL%/g, shops[i].urls.pc);
		html = html.replace(/%ADDRESS%/g, shops[i].address);
		html = html.replace(/%ACCESS%/g, shops[i].access);
		html = html.replace(/%DESC%/g, shops[i]['catch']);
		html = html.replace(/%STYLE%/g, "display: none");
	}

	$('content').innerHTML = html;

	for (i = 0; i < shops.length; i++)
		hide_shop(i);

	start_slideshow();
	set_slide_mode(slide_mode, true);
	set_btn_info(!slide_mode);
	set_info_mode(info_mode, true);
}

function callback_hpbeauty(params) {
	var results = params.results;
	var shops = results.salon;
	var html = '';
	var i;

	randomSort(shops);

	end_frame = shops.length - 1;
	for (i = 0; i < shops.length; i++) {
		html += '<div id="title%INDEX%" class="lblShopName" style="%STYLE%">%NAME%</div>';
		html += '<div id="url%INDEX%" style="%STYLE%">%URL%</div>';
		html += '<div id="photo%INDEX%" class="imgPhoto" style="%STYLE%">';
		html += '<input type="image" src="%IMAGE%" onclick="set_slide_mode(true, true)" />';
		html += '<input type="image" id="arrow%INDEX%" class="imgCompass" src="%ARROW%" />';
		html += '<span id="distance%INDEX%" class="distArea">%DISTANCE%</span>';
		html += '</div>';
		html += '<textarea id="desc%INDEX%" class="desc" rows="8" style="%STYLE%">';
		html += '名前: %NAME%\n';
		html += '住所: %ADDRESS%\n';
		html += '説明: %DESC%\n';
		html += '</textarea>';

		html = html.replace(/%INDEX%/g, i);
		html = html.replace(/%NAME%/g, shops[i].name);
		html = html.replace(/%IMAGE%/g, shops[i].main.photo.m);
		html = html.replace(/%ARROW%/g,
			direction(loc.x, loc.y, shops[i].lng, shops[i].lat, true));
		html = html.replace(/%DISTANCE%/g,
			distance(loc.x, loc.y, shops[i].lng, shops[i].lat) + 'm');
		html = html.replace(/%URL%/g, shops[i].urls.pc);
		html = html.replace(/%ADDRESS%/g, shops[i].address);
		html = html.replace(/%DESC%/g, shops[i].description);
		html = html.replace(/%STYLE%/g, "display: none");
	}

	$('content').innerHTML = html;

	for (i = 0; i < shops.length; i++)
		hide_shop(i);

	start_slideshow();
	set_slide_mode(slide_mode, true);
	set_btn_info(!slide_mode);
	set_info_mode(info_mode, true);
}

function callback_doko(params) {
	var results = params.results;
	var landmarks = results.landmark;
	var length = Math.min(landmarks.length, 10);
	var name;
	var html = '';
	var i;

	bubbleSort(landmarks, station_compare);

	end_frame = -1;
	html += '<div id="info">';

	html += '<div id="station_list">';
	for (i = 0; i < length; i++) {
		html += '<div style="height: 1.2em; overflow: auto;">';
		html += '<span class="station_title" onclick="open_page(\'%URL%\')">%NAME%</span> ';
		html += '<span class="station_distance">%DIRECTION% %DISTANCE%</span>';
		html += '</div>';

		name = landmarks[i].name.replace(/\(.*\)/, "");
		html = html.replace(/%INDEX%/g, i);
		html = html.replace(/%NAME%/g, name);
		html = html.replace(/%DIRECTION%/g,
			direction(loc.x, loc.y, landmarks[i].lon_jgd,
				landmarks[i].lat_jgd, false));
		html = html.replace(/%DISTANCE%/g,
			distance(loc.x, loc.y, landmarks[i].lon_jgd,
				landmarks[i].lat_jgd) + 'm');
		html = html.replace(/%URL%/g, landmarks[i].dokopcurl);
		html = html.replace(/%STYLE%/g, "display: none");
	}
	html += '</div>';

	for (i = 0; i < length; i++) {
		html += '<div id="title%INDEX%" class="station_title" style="%STYLE%"></div>';
		html += '<div id="photo%INDEX%" class="imgPhoto" style="%STYLE%"></div>';
		html += '<textarea id="desc%INDEX%" class="desc" style="%STYLE%"></textarea>';

		html = html.replace(/%INDEX%/g, i);
		html = html.replace(/%STYLE%/g, "display: none");
	}
	html += '</div>';

	$('content').innerHTML = html;
	set_slide_mode(false, false);
	set_btn_info(!slide_mode);
	set_info_mode(false, false);
}

function station_compare(s0, s1) {
	var d0, d1;

	d0 = distance(loc.x, loc.y, s0.lon_jgd, s0.lat_jgd);
	d1 = distance(loc.x, loc.y, s1.lon_jgd, s1.lat_jgd);

	return d0 - d1;
}

/*
 * Mylo specific functions.
 */
var widgetKeyDown = function(event, key) {
	switch (key) {
	case mylo.KeyCode.LEFT:
		prev_shop(0);
		break;

	case mylo.KeyCode.RIGHT:
		next_shop(0);
		break;

	case mylo.KeyCode.UP:
		next_service();
		break;

	case mylo.KeyCode.DOWN:
		prev_service();
		break;

	case mylo.KeyCode.ENTER:
		if (!slide_mode && !info_mode)
			getlocation();
		break;

	case mylo.KeyCode.SPACE:	// goto info mode.
	case mylo.KeyCode.I:
		if (!slide_mode && cur_service != 2)
			set_info_mode(true, true);
		break;
	}

	return true;
}

var prefCallback = function() {
	var str;
	var array;

	range = prefObject.getValueByName('range');
	count = prefObject.getValueByName('count');
	direction_mode = (prefObject.getValueByName('direction_mode') == "on");

	str = prefObject.getValueByName('default_position');
	array = str.split(',', 5);
	array[0] = (array[0] == '1')? 1 : 0;
	loc = {x:array[1], y:array[2], info:{floor:array[3], addr:array[4]}, is_known:array[0]};

	show_shop(cur_frame, info_mode);

	notifyReadyWidget();

	return prefObject;
}

var getPreferenceObject = function() {
	return prefObject;
}

var changePreference = function(prefObject, updateFlag) {
	prefCallback();
	if (updateFlag == true) {
		extension.saveFile(Extension.fileType.CONFIG, saveCallback,
				prefObject.save());
	}
	return;
}

var saveCallback = function() {};

function save_position(loc) {
	var floor, addr, str;

	floor = (loc.info == null || loc.info.floor == null)? '' : loc.info.floor;
	addr = (loc.info == null || loc.info.addr == null)? '' : loc.info.addr;

	var str = loc.is_known + ',' + loc.x + ',' + loc.y + ',' + floor + ',' + addr;

	prefObject.setValueByName('default_position', str);
	extension.saveFile(Extension.fileType.CONFIG, saveCallback, prefObject.save());
}
