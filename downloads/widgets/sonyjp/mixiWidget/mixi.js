/*
 * Copyright 2007,2008 Sony Corporation
 */

var BASE_ID 					= 'base';					
var LED_PART_ID					= 'ledBase';				
var LOGIN_FORM_ID 				= 'loginForm';				
var MAIN_FORM_ID 				= 'mainForm';				
var EMAIL_FIELD_ID 				= 'email';					
var PASSWD_FIELD_ID 			= 'password';				
var AUTOLOGIN_CHECKBOX_ID		= 'autologin';				
var LABEL_EMAIL_ID				= 'emailLabel';				
var LABEL_PASSWD_ID				= 'passwdLabel';			
var LABEL_AUTO_LOGIN_ID			= 'autologinLabel';			
var NEWARRIVE_NOTIFY_ID 		= 'newarriveNotify';		
var NEWARRIVE_DIARY_ID 			= 'newarriveDiary';			
var NEWARRIVE_COMMUNITY_ID	 	= 'newarriveCommunity';		
var NEWARRIVE_TRACKS_ID 		= 'newarriveTracks';		
var UPDATETIME_BASE_ID 			= 'updatedTimeBase';		
var UPDATETIME_ID 				= 'updatedTime';			
var MESSAGE_ID 					= 'message';				
var LOGO_BUTTON_ID 					= 'logo';							
var LOGIN_BUTTON_ID 				= 'loginButton';					
var LOGOUT_BUTTON_ID 				= 'logoutButton';					
var UPDATETIME_BUTTON_ID 			= 'updatedTimeBase';				
var NEWARRIVE_NOTIFY_BUTTON_ID 		= 'newarriveNotifyButton';			
var NEWARRIVE_DIARY_BUTTON_ID 		= 'newarriveDiaryButton';			
var NEWARRIVE_COMMUNITY_BUTTON_ID 	= 'newarriveCommunityButton';		
var NEWARRIVE_TRACKS_BUTTON_ID 		= 'newarriveTracksButton';			
var NEWARRIVE_BUTTON_PART_LEFT_DIV_ID 	= 'newarrive_button_left';		
var NEWARRIVE_BUTTON_PART_RIGHT_DIV_ID 	= 'newarrive_button_right';		
var NEWARRIVE_BUTTON_PART_CENTER_DIV_ID = 'newarrive_button_tsunagi';	
var NO_ARRIVED_CLASS 			= 'noarriveLabel';
var NEW_ARRIVED_CLASS 			= 'newarriveLabel';
var NORMAL_MESSAGE_CLASS 		= 'normalMessage';
var ERROR_MESSAGE_CLASS 		= 'errorMessage';
var messageString = {
	'CONECTION_ERROR'			:	'ネットワークに接続できません',
	'UNAUTHORIZED_ERROR'		:	'メールアドレス、パスワードが異なるか本体時刻設定が正しくありません。',	
	'OTHER_ERROR'				:	'エラーが発生しました',
	'NOTHING'					:	'',
	'LOGIN_PROGRESS'			:	'ログイン中です...',
};
var NEWARRIVE_NOTIFY_MESSAGE_ON		= '新着があります！';
var NEWARRIVE_NOTIFY_MESSAGE_OFF	= '新着はありません';
var LABEL_EMAIL_MESSAGE				= 'e-mail';
var LABEL_PASSWD_MESSAGE			= 'password';
var LABEL_AUTO_LOGIN_MESSAGE		= '次回から自動的にログイン';
var NEWARRIVE_DIARY_MESSAGE			= 'マイミクシィ最新日記';
var NEWARRIVE_COMMUNITY_MESSAGE		= 'コミュニティ最新書き込み';
var NEWARRIVE_TRACKS_MESSAGE		= '足あと';
var SEPARATER_EMAIL_PASSWD = ',';
var PREFERENCE_LED 					= 'led';
var PREFERENCE_UPDATE 				= 'update';
var PREFERENCE_AUTOLOGIN 			= 'autologin';
var PREFERENCE_ENCODED_EMAILPASSWD	= 'encryptEmailPasswd';
var PREF_BOOL_ON 		= 'on';
var PREF_BOOL_OFF 		= 'off';
var prefLedMode 			= PREF_BOOL_OFF;
var prefAutologinMode 		= PREF_BOOL_OFF;
var prefEncodedEmailPasswd 	= null;
var prefUpdateIntervalName	= null;
var PREF_UPDATE_INTERVAL_LIST = null;
var MIXI_SERVICE_DOC_TRAKS_URL	= 'http://mixi.jp/atom/tracks/r=2';
var MIXI_SERVICE_DOC_NOTIFY_URL	= 'http://mixi.jp/atom/notify/r=3';
var MIXI_SERVICE_DOC_UPDATE_URL	= 'http://mixi.jp/atom/updates/r=1';
var MIXI_SERVICE_DOC 			= MIXI_SERVICE_DOC_NOTIFY_URL;
var MIXI_OPEN_MIXI_HOME_URL					= 'http://mixi.jp/home.pl?survey.ref=mylo';
var MIXI_OPEN_NEWARRIVE_NOTIFY_URL			= 'http://mixi.jp/home.pl?survey.ref=mylo';
var MIXI_OPEN_NEWARRIVE_DIARY_URL			= 'http://mixi.jp/new_friend_diary.pl?survey.ref=mylo';
var MIXI_OPEN_NEWARRIVE_COMMUNITY_URL		= 'http://mixi.jp/new_bbs.pl?survey.ref=mylo';
var MIXI_OPEN_NEWARRIVE_TRACKS_URL_PARAM	= 'survey.ref=mylo';
var MIXI_NEWARRIVE_TRACKS_URL_ALTERNATE		= 'alternate';
var XML_ENTRY_UPDATES_CATEGORY_COMMUNITY 	= 'bbs';
var XML_ENTRY_UPDATES_CATEGORY_DIARY 		= 'diary';
var LOGIN_TIMEOUT = 3 * 60 * 1000;
var prefObject = null;
var extension = new Extension();
var updateForeTimerId = null;
var updateBackTimerId = null;
var initalized = false;					
var isInFocus = false;					
var LEDState = {
	UNKNOWN					:	-1,
	OFF						:	0,
	ON						:	1,
};
var ledStatus = LEDState.UNKNOWN;
var LoginState = {
	LOGOUT						:	0,
	BEFORE_LOGINED				:	1,
	AFTER_LOGINED				:	2,
};
var loginStatus = LoginState.LOGOUT;
var openWebFlg = false;
var onLoginPhase = {
	UNKNOWN							:	0,
	SERVICE_DOC_NOTIFY				:	1,
	NEWARRIVE_DOC_NOTIFY			:	2,
	SERVICE_DOC_TRACKS				:	3,
	NEWARRIVE_DOC_TRACKS			:	4,
	SERVICE_DOC_UPDATE				:	5,
	NEWARRIVE_DOC_UPDATE			:	6,
	WSSE_NONCE_BASE64_SHA1			:	100,
	WSSE_NONCE_ENCODE_BASE64		:	101,
	WSSE_PASSWD_DIGEST_BASE64_SHA1	:	102,
};
var onLoginInfo = {
	loginPhaseStartTime		:	null,
	lastLoginSuccessTime	:	null,
	currentPhase 			:	onLoginPhase.UNKNOWN,
	responceCode			:	0,
	loginSuccess			:	false,
	newarriveNotifyFlg		:	false,
	newarriveTracksFlg		:	false,
	newarriveDiaryFlg		:	false,
	newarriveCommunityFlg	:	false,
	wsseHeader 				:	'',
	wsseUsername 			:	'',
    wssePasswordDigest 		:	'',
    wsseNonce 				:	'',
    wsseNonceEncoded 		:	'',
    wsseCcreated 			:	'',
};
var ETAG_CURRENT_REQUEST_URL	= 'ETAG_CURRENT_REQUEST_URL';
var ETag						= Array();
var resourceData = null;
var tempResourceData = null;
var buttonState = {
	NORMAL					:	'normal',
	PUSH					:	'push',
	DISABLE					:	'disable',
	FOCUS					:	'focus',
	currentMouseDownObject	:	null,
};
var buttonFocusInfo = {
	state 				:  {
								UNKNOWN					:	0,
								EMAIL					:	1,
								PASSWORD				:	2,
								AUTOLOGIN				:	3,
								LOGIN					:	4,
								UPDATETIME				:	5,
								NEWARRIVE_NOTIFY		:	6,
								NEWARRIVE_DIARY			:	7,
								NEWARRIVE_COMMUNITY		:	8,
								NEWARRIVE_TRACKS		:	9,
								LOGOUT					:	10,
							},
	current				: 	0,
	object				:	null,
	focusImage 			:	null,
	normatImage			:	null,
	disableImage		:	null,
};
var initialize = function() {
	try {
		widgetLogEnable();
		debugWriteLog( '### Mixi initialize', '');
		widgetResize();
		initResourceData();
		drawLoginForm();
		document.getElementById( LABEL_EMAIL_ID ).innerText = LABEL_EMAIL_MESSAGE;
		document.getElementById( LABEL_PASSWD_ID ).innerText = LABEL_PASSWD_MESSAGE;
		document.getElementById( LABEL_AUTO_LOGIN_ID ).innerText = LABEL_AUTO_LOGIN_MESSAGE;
		document.getElementById( NEWARRIVE_DIARY_ID ).innerText = NEWARRIVE_DIARY_MESSAGE;
		document.getElementById( NEWARRIVE_COMMUNITY_ID ).innerText = NEWARRIVE_COMMUNITY_MESSAGE;
		document.getElementById( NEWARRIVE_TRACKS_ID ).innerText = NEWARRIVE_TRACKS_MESSAGE;
		prefObject = new Preferences( prefCallback );
	}
	catch(e){
		debugAlert('Error: initialize():' + e);
	}
	return ;
}
var finishInitialize = function() {
	debugWriteLog( '### Mixi finishInitialize', '');
	try {
		if(prefAutologinMode == PREF_BOOL_ON && getEmail() && getPasswd()){
			drawBeforeMainForm();
		}
		else{
			drawLoginForm();
		}
		document.getElementById(BASE_ID).style.display = 'block';
		if(initalized == false && typeof(notifyReadyWidget) == 'function'){
			notifyReadyWidget();
		}
	}
	catch(e){
		debugAlert('Error: finishInitialize():' + e);
	}
}
var initResourceData = function() {
	resourceData = new Array();
	resourceData.newArriveNotify = null;
	resourceData.newArriveTracks = null;
	resourceData.newArriveDiary = null;
	resourceData.newArriveCommunity = null;
	resourceData.ETag = null;
	resourceData.lastLoginSuccessTime = null;
	resourceData.newarriveNotifyFlg = false;
	resourceData.newarriveTracksFlg = false;
	resourceData.newarriveDiaryFlg = false;
	resourceData.newarriveCommunityFlg = false;
	return(resourceData);
}
var getPreferenceObject = function() {
	return prefObject;
}
var prefSaveCallback = function() {
}
var changePreference = function(prefObject,changeFlag){
	if (changeFlag == true){
		extension.saveFile(Extension.fileType.CONFIG, prefSaveCallback, prefObject.save());
		prefCallback();
	}
	return;
}
var getUpdateInterval = function() {
	var _value = null;
	if(prefUpdateIntervalName && PREF_UPDATE_INTERVAL_LIST){
		_value = PREF_UPDATE_INTERVAL_LIST[prefUpdateIntervalName];
	}
	else{
		debugAlert('Error: getUpdateInterval()');
	}
	return(_value);
}
var getPrefOptionsValueHashArray = function(_item, _numberFlg) {
	var _hashArray = new Array();
	if( _item ){
		for(var _i = 0; _i < _item.options.length; _i++){
			var _text = _item.options[_i].text;
			var _value = _item.options[_i].value;
			if(_numberFlg){
				_hashArray[_text] = parseInt(_value);
				if(isNaN(_hashArray['_text'])){
					_hashArray['_text'] = 0;
				}
			}
			else{
				_hashArray[_text] = _value;
			}
		}
	}
	return(_hashArray);
}
var prefCallback = function() {
	try {
		debugWriteLog( '### Mixi prefCallback', '');
		var _prefObject = getPreferenceObject();
		var _prefItems = _prefObject.prefsItems;
		var _prefLen = _prefItems.length - 1;
		var _prefHashItems = new Array();
		for (var _i=0;_i<=_prefLen;_i++){
			debugWriteLog( '### Mixi prefCallback', 'pref name = ' + _prefItems[_i].name + ' value = ' + _prefItems[_i].value);
			if (PREFERENCE_LED == _prefItems[_i].name) {
				prefLedMode = _prefItems[_i].value;
			} else if (PREFERENCE_UPDATE == _prefItems[_i].name) {
				prefUpdateIntervalName = _prefItems[_i].value;
			} else if (PREFERENCE_AUTOLOGIN == _prefItems[_i].name) {
				prefAutologinMode = _prefItems[_i].value;
			} else if (PREFERENCE_ENCODED_EMAILPASSWD == _prefItems[_i].name) {
				prefEncodedEmailPasswd = _prefItems[_i].value;
			}
		 	_prefHashItems[_prefItems[_i].name] = _prefItems[_i];
		}
		if( PREF_UPDATE_INTERVAL_LIST == null){
			PREF_UPDATE_INTERVAL_LIST = getPrefOptionsValueHashArray(_prefHashItems[PREFERENCE_UPDATE],true);
		}
		updateLED();
		updateAutologin();
		setTimer();
		if(initalized == false){
			if(prefAutologinMode == PREF_BOOL_ON){
				loadResourceData();
			}
			else{
				initResourceData();
				finishInitialize();
			}
		}
	}
	catch(e){
		debugAlert('Error prefCallback:' + e);
	}
	return prefObject;
}
var dummyCallback = function() {};
var setPrefItemValue = function(_itemName, _itemValue) {
	try {
		var _prefObject = getPreferenceObject();
		if(_prefObject){
			for(var _j = 0; _j < _prefObject.prefsItems.length; _j++){
				if (_prefObject.prefsItems[_j].name == _itemName){
					_prefObject.prefsItems[_j].value = _itemValue;
					break;
				}
			}
			extension.saveFile( Extension.fileType.CONFIG, dummyCallback, _prefObject.save() );
		}
	}
	catch(e){
		debugAlert('Error setPrefItemValue:' + e);
	}
}
var getPrefItemValue = function(_itemName) {
	var _itemValue = null;
	try {
		var _prefObject = getPreferenceObject();
		if(_prefObject){
			for(var _j = 0; _j < _prefObject.prefsItems.length; _j++){
				if (_prefObject.prefsItems[_j].name == _itemName){
					_itemValue = _prefObject.prefsItems[_j].value;
					break;
				}
			}
		}
	}
	catch(e){
		debugAlert('Error getPrefItemValue:' + e);
	}
	return(_itemValue);
}
var getNetworkStatus = function() {
	return(mylo.System.getNetworkStatus());
};
var isScreenModeActive = function() {
	if(mylo.constant.SCREEN_MODE_ACTIVE == mylo.System.getScreenMode()){
		return(true);
	}
	return(false);
};
var drawLoginForm = function() {
	debugWriteLog( '### Mixi drawLoginForm', '');
	if(initalized == true){
		enableLED(false);
		updateLED();
	}
	document.getElementById(LOGIN_FORM_ID).style.display = 'block';
	document.getElementById(MAIN_FORM_ID).style.display = 'none';
	document.getElementById(UPDATETIME_BASE_ID).style.display = 'none;';
	setLoginStatus(LoginState.LOGOUT);
	buttonFocusInfo.object = null;
	buttonFocusInfo.current = buttonFocusInfo.state.UNKNOWN;
	setDefaultButtonFocus();
}
var drawMainForm = function() {
	debugWriteLog( '### Mixi drawMainForm', '');
	setLoginStatus(LoginState.AFTER_LOGINED);
	updateNewarrive();
	document.getElementById(EMAIL_FIELD_ID).blur();
	document.getElementById(PASSWD_FIELD_ID).blur();
	document.getElementById(MAIN_FORM_ID).style.display = 'block';
	document.getElementById(UPDATETIME_BASE_ID).style.display = 'block;';
	document.getElementById(LOGIN_FORM_ID).style.display = 'none';
	buttonFocusInfo.object = null;
	buttonFocusInfo.current = buttonFocusInfo.state.UNKNOWN;
	setDefaultButtonFocus();
	updateLastLoginSuccessTime();
}
var drawBeforeMainForm = function() {
	setLoginStatus(LoginState.BEFORE_LOGINED);
	updateNewarrive();
	document.getElementById(EMAIL_FIELD_ID).blur();
	document.getElementById(PASSWD_FIELD_ID).blur();
	document.getElementById(MAIN_FORM_ID).style.display = 'block';
	document.getElementById(UPDATETIME_BASE_ID).style.display = 'block;';
	document.getElementById(LOGIN_FORM_ID).style.display = 'none';
	updateLastLoginSuccessTime();
}
var onLogin = function() {
	try {
		if(isLogined() == false){
			debugWriteLog( '### Mixi onLogin', '');
			if(getNetworkStatus()){
				if(true == checkLoginPhase()){
					var _email = getEmail();
					var _passwd = getPasswd();
					if(_email != null && 0 < _email.length && _passwd != null && 0 < _passwd.length){
						initLoginInfo(false);
						loginPhaseStart();
					}
					else{
						setMessage(messageString.OTHER_ERROR);
					}
				}
				else{
					debugWriteLog( '---------------------------', '');
					debugWriteLog( '--- Mixi onLogin Canceld', '');
					debugWriteLog( '---------------------------', '');
				}
			}
			else{
				setMessage(messageString.CONECTION_ERROR);
			}
		}
	}
	catch(e){
		debugAlert('Error onLogin:' + e);
	}
}
var checkLoginPhase = function() {
	var _status = false;
	try {
		if(false == isLoginPhase()){
			_status = true;
		}
	}
	catch(e){
		debugAlert('Error checkLoginPhase:' + e);
	}
	return(_status);
}
var resetLoginPhase = function() {
	onLoginInfo.loginPhaseStartTime = null;
	onLoginInfo.currentPhase		= onLoginPhase.UNKNOWN;
	setButtonEnable(true);
}
var isLoginPhase = function() {
	return(onLoginInfo.currentPhase != onLoginPhase.UNKNOWN);
}
var _debugNonce = null;
var _debugNonceEncoded = null;
var _debugPasswordDigest = null;
var loginPhaseStart = function() {
	try {
		tempResourceData = null;
		if(getNetworkStatus()){
			if(true == checkLoginPhase()){
				if(resourceData != null){
					tempResourceData = copyArray(resourceData,new Array());
				}
				var _email = getEmail();
				var _passwd = getPasswd();
				if(_email != null && 0 < _email.length && _passwd != null && 0 < _passwd.length){
					setMessage(messageString.LOGIN_PROGRESS);
					onLoginInfo.loginPhaseStartTime = new Date();
					setButtonEnable(false);
					{
						onLoginInfo.wsseUsername = getEmail();
						var _nonce = wsseISO8601datetime() + 'There is more than words';
						onLoginInfo.currentPhase = onLoginPhase.WSSE_NONCE_BASE64_SHA1;
						extension.base64HashSHA1( _nonce, onLoginCallback );
					}
				}
				else{
					setMessage(messageString.OTHER_ERROR);
				}
			}
			else{
				debugWriteLog( '---------------------------', '');
				debugWriteLog( '--- Mixi loginPhaseStart Canceld', '');
				debugWriteLog( '---------------------------', '');
			}
		}
		else{
			if(true == isLogined()){
			}
			setMessage(messageString.CONECTION_ERROR);
		}
	}
	catch(e){
		debugAlert('Error loginPhaseStart:' + e);
	}
}
var onLogout = function() {
	debugWriteLog( '### Mixi onLogout', '');
	if(	LoginState.AFTER_LOGINED == getLoginStatus() ||
		LoginState.BEFORE_LOGINED == getLoginStatus()){
		ETag = Array();
		setEmail('');
		setPasswd('');
		setMessage(messageString.NOTHING);
		prefAutologinMode = PREF_BOOL_OFF;
		updateAutologin();
		prefAutologinMode = PREF_BOOL_OFF;
		setPrefItemValue( PREFERENCE_AUTOLOGIN, prefAutologinMode );
		drawLoginForm();
		initLoginInfo(true);
		encryptEmailPasswd();
		initResourceData();
		deleteResourceData();;
	}
	else{
		drawLoginForm();
		setResponseCodeMessage(onLoginInfo.responceCode);
	}
}
var onAutologin = function() {
	var _object = document.getElementById(AUTOLOGIN_CHECKBOX_ID);
	if(_object){
		if(_object.checked == true){
			prefAutologinMode = PREF_BOOL_ON;
		}else if(_object.checked == false){
			prefAutologinMode = PREF_BOOL_OFF;
		}
	}
}
var initLoginInfo = function(_flg) {
	onLoginInfo.loginPhaseStartTime		= null;
	onLoginInfo.currentPhase 			= onLoginPhase.UNKNOWN;
	if(_flg == true){
		onLoginInfo.lastLoginSuccessTime	= null;	
	}
	onLoginInfo.loginSuccess 			= false;
	onLoginInfo.newarriveNotifyFlg		= false;
	onLoginInfo.newarriveTracksFlg		= false;
	onLoginInfo.newarriveDiaryFlg		= false;
	onLoginInfo.newarriveCommunityFlg	= false;
	onLoginInfo.wsseHeader 				= '';
	onLoginInfo.wsseUsername 			= '';
	onLoginInfo.wssePasswordDigest 		= '';
	onLoginInfo.wsseNonce 				= '';
	onLoginInfo.wsseNonceEncoded 		= '';
	onLoginInfo.wsseCcreated 			= '';
	tempResourceData = null;
	ledStatus = LEDState.UNKNOWN;
}
var parseService = function(_xml) {
	try {
		debugWriteLog( '### Mixi parseService', '');
		var _url = null;
		if(_xml){
			if ( _xml.getElementsByTagName('service').length ) {
				_url = _xml.getElementsByTagName('collection')[0].getAttribute('href');
			}
		}
		return(_url);
	}
	catch(e){
		debugAlert('Error parseService:' + e);
	}
	return(null);
}
var parseNewArriveNotify = function(_feed, _entrys) {
	var _newarrive = false;
	try {
		debugWriteLog( '### Mixi parseNewArriveNotify', '');
		var _newArriveNotify = new Array();
		if(_feed != null && _entrys != null && _entrys.length != 0){
			for(var _entry_index = 0;_entry_index < _entrys.length; _entry_index++ ){
				var _id = parseEntryElement(_entrys[_entry_index], 'id');
				var _summary = parseEntryElement(_entrys[_entry_index], 'summary');
				var _updated = parseEntryElement(_entrys[_entry_index], 'updated');
				var _updatedDate = ((_updated != null) ? (new Date(_updated)) : null);
				var _category = parseEntryElementAttribute(_entrys[_entry_index], 'category', 'term');
				debugWriteLog( '-------------------------------', '');
				debugWriteLog( 'id='+_id, _updatedDate);
				debugWriteLog( 'summary=' + _summary,'' );
				debugWriteLog( 'category=' + _category, '');
				debugWriteLog( '-------------------------------', '');
				if(_id){
					var _itemArray 			= new Array();
					_itemArray['id'] 		= _id;
					_itemArray['updated'] 	= _updatedDate;
					_itemArray['category'] 	= _category;
					_itemArray['summary'] 	= parseInt(_summary);
					if(isNaN(_itemArray['summary'])){
						_itemArray['summary'] = 0;
					}
					_newArriveNotify[_category] = _itemArray;
					if(_category != null && _category != '' && _category != "report"){
						_newarrive = true;
					}
				}
			}
		}
		resourceData.newArriveNotify = _newArriveNotify;
	}
	catch(e){
		debugAlert('Error parseNewArriveNotify:' + e);
	}
	return(_newarrive);
}
var parseNewArriveTracks = function(_feed, _entrys) {
	var _newarrive = false;
	var _debugCount = '';
	try {
		debugWriteLog( '### Mixi parseNewArriveTracks', '');
		var _newArriveTracks = new Array();
		_newArriveTracks.alternate = getTracksAlternateURL();
		if(_feed){
			var _childNodes = _feed.childNodes;
			if(_childNodes){
				var _href = null;
				var _rel = null;
				for(var _j = 0; _j <_childNodes.length; _j++ ){
					var _childNode = _childNodes[_j];
					if(_childNode && typeof(_childNode) != 'undefined'){
						if(typeof(_childNode.tagName ) != 'undefined' && _childNode.tagName == 'link'){
							_rel = _childNode.getAttributeNode('rel');
 							if(_rel  && typeof(_rel.value ) != 'undefined' && _rel.value == MIXI_NEWARRIVE_TRACKS_URL_ALTERNATE){
								_href = _childNode.getAttributeNode('href');
								if(_href &&  typeof(_href.value ) != 'undefined' && _href.value){
									_newArriveTracks.alternate = _href.value;
								}
								break;
							}
						}
					}
				}
			}
		}
		if(_feed != null && _entrys != null && _entrys.length != 0){
			for(var _entry_index = 0;_entry_index < _entrys.length; _entry_index++ ){
				var _id = parseEntryElement(_entrys[_entry_index], 'id');
				var _updated = parseEntryElement(_entrys[_entry_index], 'updated');
				var _updatedDate = ((_updated != null) ? (new Date(_updated)) : null);
				if(_updatedDate){
					if(typeof(_newArriveTracks.updated) == 'undefined'){
						_newArriveTracks.updated = _updatedDate;
					}
					else{
						if(_newArriveTracks.updated < _updatedDate){
							_newArriveTracks.updated = _updatedDate;
						}
					}
				}
			}
			if(resourceData != null){
				if( typeof(resourceData.newArriveTracks) != 'undefined' && resourceData.newArriveTracks != null){
					if(typeof(resourceData.newArriveTracks.updated) != 'undefined' && resourceData.newArriveTracks.updated != null){
						if(typeof(_newArriveTracks.updated) != 'undefined' && _newArriveTracks.updated != null && (resourceData.newArriveTracks).updated < _newArriveTracks.updated){
							_newarrive = true;
						}
					}
					else{
						_newarrive = true;
					}
				}
				else{
					_newarrive = true;
				}
			}
			else{
				_newarrive = false;
			}
		}
		if(resourceData.newArriveTracks == null){
			_newarrive = false;
		}
		if(_feed){
			resourceData.newArriveTracks = _newArriveTracks;
		}
	}
	catch(e){
		debugAlert('Error parseNewArriveTracks:' + _debugCount + ':' + e);
	}
	return(_newarrive);
}
var parseNewArriveDiary = function(_feed, _entrys) {
	var _newarrive = false;
	try {
		debugWriteLog( '### Mixi parseNewArriveDiary', '');
		var _newArriveDiary = new Array();
		if(_feed != null && _entrys != null && _entrys.length != 0){
			for(var _entry_index = 0;_entry_index < _entrys.length; _entry_index++ ){
				var _category = parseEntryElementAttribute(_entrys[_entry_index], 'category', 'term');
				if(_category != XML_ENTRY_UPDATES_CATEGORY_DIARY){
					continue;
				}
				var _id = parseEntryElement(_entrys[_entry_index], 'id');
				var _summary = parseEntryElement(_entrys[_entry_index], 'summary');
				var _updated = parseEntryElement(_entrys[_entry_index], 'updated');
				var _updatedDate = ((_updated != null) ? (new Date(_updated)) : null);
				debugWriteLog( '********** diary **********', '');
				debugWriteLog( 'id='+_id, _updatedDate);
				debugWriteLog( 'summary=' + _summary,'' );
				debugWriteLog( 'category=' + _category, '');
				debugWriteLog( '********** diary **********', '');
				if(_id){
					var _itemArray 				= new Array();
					_itemArray['id'] 			= _id;
					_itemArray['updated'] 		= _updatedDate;
					_itemArray['category'] 		= _category;
					_itemArray['summary'] 		= parseInt(_summary);
					if(isNaN(_itemArray['summary'])){
						_itemArray['summary'] = 0;
					}
					_newArriveDiary[_id] 		= _itemArray;
					if(resourceData.newArriveDiary != null){
						if(typeof(resourceData.newArriveDiary[_id]) == 'undefined'){
							_newarrive = true;
						}
						else{
							if(typeof(resourceData.newArriveDiary[_id]['summary']) != 'undefined'){
							}
						}
					}
					else{
						_newarrive = false;
					}
				}
			}
		}
		if(resourceData.newArriveDiary == null){
			_newarrive = false;
		}
		resourceData.newArriveDiary = _newArriveDiary;
	}
	catch(e){
		debugAlert('Error parseNewArriveDiary:' + e);
	}
	return(_newarrive);
}
var parseNewArriveCommunity = function(_feed, _entrys) {
	var _newarrive = false;
	try {
		debugWriteLog( '### Mixi parseNewArriveCommunity', '');
		var _newArriveCommunity = new Array();
		if(_feed != null && _entrys != null && _entrys.length != 0){
			for(var _entry_index = 0;_entry_index < _entrys.length; _entry_index++ ){
				var _category = parseEntryElementAttribute(_entrys[_entry_index], 'category', 'term');
				if(_category != XML_ENTRY_UPDATES_CATEGORY_COMMUNITY){
					continue;
				}
				var _id = parseEntryElement(_entrys[_entry_index], 'id');
				var _summary = parseEntryElement(_entrys[_entry_index], 'summary');
				var _updated = parseEntryElement(_entrys[_entry_index], 'updated');
				var _updatedDate = ((_updated != null) ? (new Date(_updated)) : null);
				debugWriteLog( '********** Community **********', '');
				debugWriteLog( 'id='+_id, _updatedDate);
				debugWriteLog( 'summary=' + _summary,'' );
				debugWriteLog( 'category=' + _category, '');
				debugWriteLog( '********** Community **********', '');
				if(_id){
					var _itemArray 				= new Array();
					_itemArray['id'] 			= _id;
					_itemArray['updated'] 		= _updatedDate;
					_itemArray['category'] 		= _category;
					_itemArray['summary'] 		= parseInt(_summary);
					if(isNaN(_itemArray['summary'])){
						_itemArray['summary'] = 0;
					}
					_newArriveCommunity[_id] 	= _itemArray;
					if(resourceData.newArriveCommunity != null){
						if(typeof(resourceData.newArriveCommunity[_id]) == 'undefined'){
							_newarrive = true;
						}
						else{
							if(typeof(resourceData.newArriveCommunity[_id]['summary']) != 'undefined'){
								if(resourceData.newArriveCommunity[_id]['summary'] != _summary){
									_newarrive = true;
								}
							}
						}
					}
					else{
						_newarrive = false;
					}
				}
			}
		}
		if(resourceData.newArriveCommunity == null){
			_newarrive = false;
		}
		resourceData.newArriveCommunity = _newArriveCommunity;
	}
	catch(e){
		debugAlert('Error parseNewArriveCommunity:' + e);
	}
	return(_newarrive);
}
var parseEntryElement = function(_elementNode, _tagName) {
	var _textContent = null;
	try {
		if(_elementNode){
			var _childNodes = _elementNode.childNodes;
			if(_childNodes){
				for(var _j = 0; _j <_childNodes.length; _j++ ){
					var _childNode = _childNodes[_j];
					if(_childNode && typeof(_childNode) != 'undefined'){
						if(_childNode.tagName == _tagName){
							_textContent = _childNode.textContent;
							break;
						}
					}
				}
			}
		}
	}
	catch(e){
		debugAlert('Error parseEntryElement:' + e);
	}
	return(_textContent);
}
var parseEntryElementAttribute = function(_elementNode, _tagName, _attributeName) {
	return(parseEntryElementAttributeByIndex(_elementNode, _tagName, _attributeName, 0));
}
var parseEntryElementAttributeByIndex = function(_elementNode, _tagName, _attributeName, _tagIndex) {
	var _attributeValue = null;
	var _index = 0;
	try {
		if(_elementNode){
			var _childNodes = _elementNode.childNodes;
			if(_childNodes){
				for(var _j = 0; _j <_childNodes.length; _j++ ){
					var _childNode = _childNodes[_j];
					if(_childNode && typeof(_childNode) != 'undefined'){
						if(_childNode.tagName == _tagName){
							if(_index == _tagIndex){
								var _attribute = _childNode.getAttributeNode(_attributeName);
								if(_attribute){
									_attributeValue = _attribute.value;
									break;
								}
							}
							_index++;
						}
					}
				}
			}
		}
	}
	catch(e){
		debugAlert('Error parseEntryElementAttributeByIndex:' + e);
	}
	return(_attributeValue);
}
var onLoginCallback = function(_flag, _request){
	debugWriteLog( '### Mixi onLoginCallback', '');
	var _phase = onLoginInfo.currentPhase;
	try {
		onLoginInfo.responceCode = _request.status;
		if(_request.status == 200 || _request.status == 304){
			debugWriteLog( '###########################', '');
			debugWriteLog( '### Mixi onLoginCallback', 'currentPhase :' + onLoginInfo.currentPhase);
			debugWriteLog( '###                     ', 'status :' + _request.status);
			debugWriteLog( '###########################', '');
			switch(onLoginInfo.currentPhase){
				case onLoginPhase.WSSE_NONCE_BASE64_SHA1:
					if(_request.status == 200){
						onLoginInfo.wsseNonce = _request.responseText;
						onLoginInfo.currentPhase = onLoginPhase.WSSE_NONCE_ENCODE_BASE64;
						extension.encodeBase64(  onLoginInfo.wsseNonce, onLoginCallback );
					}
					break;
				case onLoginPhase.WSSE_NONCE_ENCODE_BASE64:
					if(_request.status == 200){
						onLoginInfo.wsseNonceEncoded = _request.responseText;
						onLoginInfo.wsseCcreated = wsseISO8601datetime();
						var _wssePasswordDigest = onLoginInfo.wsseNonce + onLoginInfo.wsseCcreated + getPasswd();
						onLoginInfo.currentPhase = onLoginPhase.WSSE_PASSWD_DIGEST_BASE64_SHA1;
						extension.base64HashSHA1(  _wssePasswordDigest, onLoginCallback );
					}
					break;
				case onLoginPhase.WSSE_PASSWD_DIGEST_BASE64_SHA1:
					if(_request.status == 200){
						onLoginInfo.wssePasswordDigest = _request.responseText;
 						var _header = 'UsernameToken Username="' + onLoginInfo.wsseUsername + '", PasswordDigest="' + onLoginInfo.wssePasswordDigest + '", Created="' + onLoginInfo.wsseCcreated + '", Nonce="' + onLoginInfo.wsseNonceEncoded + '"';
						onLoginInfo.wsseHeader = _header;
						onLoginInfo.currentPhase = onLoginPhase.SERVICE_DOC_NOTIFY;
						getMixiServiceDocWithPhase(onLoginInfo.currentPhase);
					}
					break;
				case onLoginPhase.SERVICE_DOC_NOTIFY:
				case onLoginPhase.SERVICE_DOC_TRACKS:
				case onLoginPhase.SERVICE_DOC_UPDATE:
					onLoginInfo.loginSuccess = true;
					saveETagString(_request);
					if(_request.status == 200){
						var _url = parseService(_request.responseXML);
						if ( _url ) {
							onLoginInfo.currentPhase++;
							getMixiDoc(_url,onLoginCallback);
						}
					}
					else if(_request.status == 304){
						if(onLoginInfo.currentPhase == onLoginPhase.NEWARRIVE_DOC_NOTIFY){
							onLoginInfo.currentPhase = onLoginPhase.SERVICE_DOC_TRACKS;
							getMixiServiceDocWithPhase(onLoginInfo.currentPhase);
						}
						else if(onLoginInfo.currentPhase == onLoginPhase.NEWARRIVE_DOC_TRACKS){
							onLoginInfo.currentPhase = onLoginPhase.SERVICE_DOC_UPDATE;
							getMixiServiceDocWithPhase(onLoginInfo.currentPhase);
						}
						else if(onLoginInfo.currentPhase == onLoginPhase.NEWARRIVE_DOC_UPDATE){
						}
					}
					break;
				case onLoginPhase.NEWARRIVE_DOC_NOTIFY:
				case onLoginPhase.NEWARRIVE_DOC_TRACKS:
				case onLoginPhase.NEWARRIVE_DOC_UPDATE:
					onLoginInfo.loginSuccess = true;
					saveETagString(_request);
					if(_request.status == 200){
						var _xml = _request.responseXML;
						if ( _xml != null ) {
							var _feed = _xml.getElementsByTagName('feed');
							if ( _feed && _feed.length ) {
								var _newarrive_doc_status = false;
								var _id_str = _feed[0].getElementsByTagName('id')[0].firstChild.nodeValue;
								if ( _id_str ) {
									if( ( _id_str.match(/notify/) && onLoginInfo.currentPhase == onLoginPhase.NEWARRIVE_DOC_NOTIFY) ||
										( _id_str.match(/tracks/) && onLoginInfo.currentPhase == onLoginPhase.NEWARRIVE_DOC_TRACKS) ||
										( _id_str.match(/updates/) && onLoginInfo.currentPhase == onLoginPhase.NEWARRIVE_DOC_UPDATE) ){
										_newarrive_doc_status = true;
									}
								}
								if(_newarrive_doc_status){
									var _entrys = _xml.getElementsByTagName('entry');
									if(onLoginInfo.currentPhase == onLoginPhase.NEWARRIVE_DOC_NOTIFY){
										if(true == parseNewArriveNotify(_feed[0],_entrys)){
											onLoginInfo.newarriveNotifyFlg = true;
											enableLED(true);
										}
										else{
											 onLoginInfo.newarriveNotifyFlg = false;
										}
										onLoginInfo.currentPhase = onLoginPhase.SERVICE_DOC_TRACKS;
										getMixiServiceDocWithPhase(onLoginInfo.currentPhase);
									}
									else if(onLoginInfo.currentPhase == onLoginPhase.NEWARRIVE_DOC_TRACKS){
										if(true == parseNewArriveTracks(_feed[0],_entrys)){
											onLoginInfo.newarriveTracksFlg = true;
											enableLED(true);
										}
										if(null != getTracksAlternateURL()){
											onLoginInfo.currentPhase = onLoginPhase.SERVICE_DOC_UPDATE;
											getMixiServiceDocWithPhase(onLoginInfo.currentPhase);
										}
										else{
											_request.status = 0;
										}
									}
									else if(onLoginInfo.currentPhase == onLoginPhase.NEWARRIVE_DOC_UPDATE){
										if( true == parseNewArriveDiary(_feed[0],_entrys)){
											onLoginInfo.newarriveDiaryFlg = true;
											enableLED(true);
										}
										if( true == parseNewArriveCommunity(_feed[0],_entrys)){
											onLoginInfo.newarriveCommunityFlg = true;
											enableLED(true);
										}
									}
								}
								else{
									if(onLoginInfo.currentPhase != onLoginPhase.NEWARRIVE_DOC_UPDATE){
										onLoginInfo.currentPhase++;
										getMixiServiceDocWithPhase(onLoginInfo.currentPhase);
									}
								}
							}
							else{
								if(onLoginInfo.currentPhase != onLoginPhase.NEWARRIVE_DOC_UPDATE){
									onLoginInfo.currentPhase++;
									getMixiServiceDocWithPhase(onLoginInfo.currentPhase);
								}
							}
						}
						else{
							if(onLoginInfo.currentPhase != onLoginPhase.NEWARRIVE_DOC_UPDATE){
								onLoginInfo.currentPhase++;
								getMixiServiceDocWithPhase(onLoginInfo.currentPhase);
							}
						}
					}
					else if(_request.status == 304){
						switch(onLoginInfo.currentPhase){
							case onLoginPhase.NEWARRIVE_DOC_NOTIFY:
								onLoginInfo.currentPhase = onLoginPhase.SERVICE_DOC_TRACKS;
								getMixiServiceDocWithPhase(onLoginInfo.currentPhase);
								break;
							case onLoginPhase.NEWARRIVE_DOC_TRACKS:
								onLoginInfo.currentPhase = onLoginPhase.SERVICE_DOC_UPDATE;
								getMixiServiceDocWithPhase(onLoginInfo.currentPhase);
								break;
							case onLoginPhase.NEWARRIVE_DOC_UPDATE:
								break;
							default:
								break;
						}
					}
					else{
						debugWriteLog( '===========================', '');
						debugWriteLog( '=== Mixi onLoginCallback', 'status :' + _request.status);
						debugWriteLog( '===========================', '');
					}
					break;
				default:
					break;
			}
		}
		else{
			debugWriteLog( '===========================', '');
			debugWriteLog( '=== Mixi onLoginCallback', 'currentPhase :' + onLoginInfo.currentPhase);
			debugWriteLog( '===                     ', 'status :' + _request.status);
			debugWriteLog( '===========================', '');
		}
		var _finished = false;
		if(	(_phase == onLoginInfo.currentPhase) || 
			(onLoginInfo.responceCode != 200 && onLoginInfo.responceCode != 304) ||
			(false == getNetworkStatus()) ){
			_finished = true;
		}
		var _successed = false;
		if(	_phase == onLoginInfo.currentPhase &&
			onLoginInfo.currentPhase == onLoginPhase.NEWARRIVE_DOC_UPDATE &&
			(onLoginInfo.responceCode == 200 || onLoginInfo.responceCode == 304) ){
			if(null != getTracksAlternateURL()){
				_successed = true;
			}
		}
		if(_finished == true){
			finishLoginCallback( _successed);
		}
	}
	catch( e ){
		debugAlert('Error onLoginCallback:' + e);
		setMessage(messageString.OTHER_ERROR);
		finishLoginCallback( false );
	}
};
var finishLoginCallback = function( _successed){
	debugWriteLog( '### Mixi finishLoginCallback', '');
	try {
		if(true == getNetworkStatus()){
debugWriteLog( '### Mixi finishLoginCallback', 'debug 1');
			if(_successed == true){
debugWriteLog( '### Mixi finishLoginCallback', 'debug 2');
				drawMainForm();
				clearMessage();
				onLoginInfo.lastLoginSuccessTime = new Date();
				updateLastLoginSuccessTime();
				saveResourceData();
				encryptEmailPasswd();
			}
			else{
debugWriteLog( '### Mixi finishLoginCallback', 'debug 3');
				if(isLogined() == false){
debugWriteLog( '### Mixi finishLoginCallback', 'debug 4');
					onLogout();
				}
				else{
debugWriteLog( '### Mixi finishLoginCallback', 'debug 5');
					if(tempResourceData != null){
						resourceData = tempResourceData;
					}
					if(onLoginInfo.responceCode != 200 &&
						 	onLoginInfo.responceCode != 304 &&
							onLoginInfo.responceCode != -1){
						var _temp_response_code = onLoginInfo.responceCode;
						onLogout();
					}
					else if(null == getTracksAlternateURL()){
						onLogout();
					}
				}
			}
		}
		else{
debugWriteLog( '### Mixi finishLoginCallback', 'debug 6');
			if(isLogined() == true){
				if(tempResourceData != null){
					resourceData = tempResourceData;
				}
			}
			setMessage(messageString.CONECTION_ERROR);
		}
		if(	onLoginInfo.newarriveNotifyFlg == false && 
			onLoginInfo.newarriveDiaryFlg == false && 
			onLoginInfo.newarriveCommunityFlg == false && 
			onLoginInfo.newarriveTracksFlg == false){
			enableLED(false);
		}
		resetLoginPhase();
		updateLED();
	} 
	catch(e){
		debugAlert('Error finishLoginCallback:' + e);
		resetLoginPhase();
	}
}
var saveETagString = function(_req) {
	if(_req){
		if(ETag[ETAG_CURRENT_REQUEST_URL]){
			var _url = ETag[ETAG_CURRENT_REQUEST_URL]
			var _etag = '';
			if(_req.getAllResponseHeaders().match( 'ETag' ) ) {
				_etag = _req.getResponseHeader( 'ETag' );
			}
			ETag[_url] = _etag;
		}
	}
	ETag[ETAG_CURRENT_REQUEST_URL] = null;
}
var getMixiServiceDocWithPhase = function(_phase) {
	try {
		debugWriteLog( '### Mixi getMixiServiceDocWithPhase', _phase);
		switch(_phase){
			case onLoginPhase.SERVICE_DOC_NOTIFY:
				getMixiDoc(MIXI_SERVICE_DOC_NOTIFY_URL,onLoginCallback);
				break;
			case onLoginPhase.SERVICE_DOC_TRACKS:
				getMixiDoc(MIXI_SERVICE_DOC_TRAKS_URL,onLoginCallback);
				break;
			case onLoginPhase.SERVICE_DOC_UPDATE:
				getMixiDoc(MIXI_SERVICE_DOC_UPDATE_URL,onLoginCallback);
				break;
			default:
				break;
		}
	}
	catch(e){
		debugAlert('Error getMixiServiceDocWithPhase:' + e);
	}
}
var getMixiDoc = function(_url, _callback) {
	try {
		debugWriteLog( '### Mixi getMixiDoc', _url);
		var _req = new RequestHttp();
		if(_req){
			_req.open('GET', _url, _callback);
			if(onLoginInfo.wsseHeader){
				_req.setRequestHeader('X-WSSE', onLoginInfo.wsseHeader);
			}
			if(ETag[_url] != null && ETag[_url] != ''){
				_req.setRequestHeader('If-None-Match', ETag[_url]);
			}
			ETag[ETAG_CURRENT_REQUEST_URL] = _url;
			_req.send(null);
		}
	}
	catch(e){
		debugAlert('Error getMixiDoc:' + e);
	}
}
var getEmail = function() {
	return(getObjectValue(EMAIL_FIELD_ID));
}
var setEmail = function(_str) {
	setObjectValue(EMAIL_FIELD_ID,_str);
}
var getPasswd = function() {
	return(getObjectValue(PASSWD_FIELD_ID));
}
var setPasswd = function(_str) {
	setObjectValue(PASSWD_FIELD_ID,_str);
}
var setResponseCodeMessage = function(_responseCode) {
	var _messageStr = null;
	switch(_responseCode){
		case 0:
		case -1:
			_messageStr = messageString.CONECTION_ERROR;
			break;
		case 200:
		case 304:
			_messageStr = null;
			break;
		case 401:
			_messageStr = messageString.UNAUTHORIZED_ERROR;
			break;
		default:
			_messageStr = messageString.OTHER_ERROR;
			break;
	}
	if(_messageStr){
		setMessage(_messageStr);
	}
};
var clearMessage = function() {
	setMessage(messageString.NOTHING);
};
var setMessage = function(_messageString) {
	var _class = null;
	var _object = document.getElementById(MESSAGE_ID);
	if(_object){
		if(_messageString == null || _messageString == ''){
			_class = NORMAL_MESSAGE_CLASS;
			_messageString = '';
		}
		else if(-1 != _messageString.indexOf( messageString.LOGIN_PROGRESS )){
			_class = NORMAL_MESSAGE_CLASS;
		}
		else{
			_class = ERROR_MESSAGE_CLASS;
		}
		if(	_messageString != messageString.NOTHING &&
			_messageString != messageString.LOGIN_PROGRESS &&
			_messageString != messageString.UNAUTHORIZED_ERROR &&
			_messageString != messageString.CONECTION_ERROR ){
			_messageString = messageString.OTHER_ERROR;
		}
		_object.className = _class;
		_object.innerHTML = _messageString;
	}
};
var getObjectValue = function(_id) {
	var _value = null;
	var _object = document.getElementById(_id);
	if(_object){
		_value = _object.value;
	}
	return(_value);
}
var setObjectValue = function(_id , _value) {
	var _object = document.getElementById(_id);
	if(_object){
		_object.value = _value;
	}
}
var encryptEmailPasswdFlg = false;
var encryptEmailPasswd = function() {
	debugWriteLog( '### Mixi encryptEmailPasswd');
	var _str = SEPARATER_EMAIL_PASSWD;
	if(prefAutologinMode == PREF_BOOL_ON){
		_str = getEmail() + SEPARATER_EMAIL_PASSWD + "" ;
		_str = _str + getPasswd();
	}
	encryptEmailPasswdFlg = true;
	extension.encryption(_str, encryptEmailPasswdCallback);
}
var encryptEmailPasswdCallback = function(_flag, _request) {
	debugWriteLog( '### Mixi encryptEmailPasswdCallback');
	try {
		if(_request.status == 200){
			var _text = _request.responseText;
			if(_text == null){
				_text = SEPARATER_EMAIL_PASSWD;
			}
			setPrefItemValue( PREFERENCE_ENCODED_EMAILPASSWD, _text );
			setPrefItemValue( PREFERENCE_AUTOLOGIN, prefAutologinMode );
		}
	}
	catch( e ){
		debugAlert('Error encryptEmailPasswdCallback:' + e);
	}
	encryptEmailPasswdFlg = false;
	updateLED();
}
var decryptEmailPasswd = function() {
	debugWriteLog( '### Mixi decryptEmailPasswd');
	var _text =  getPrefItemValue(PREFERENCE_ENCODED_EMAILPASSWD);
	extension.decryption(_text, decryptEmailPasswdCallback);
}
var decryptEmailPasswdCallback = function(_flag, _request){
	debugWriteLog( '### Mixi decryptEmailPasswdCallback', 'stats=' + _request.status);
	try {
		if(_request.status == 200){
			var _text = _request.responseText;
			if(_text){
				var _items = _text.split(SEPARATER_EMAIL_PASSWD);
				if(_items && 1 < _items.length){
					setEmail(_items[0]);
					if(prefAutologinMode == PREF_BOOL_OFF){
						setPasswd('');
					}
					else{
						setPasswd(_items[1]);
					}
				}
			}
		}
	}
	catch( e ){
		debugAlert('Error decryptEmailPasswdCallback:' + e);
	}
	finishInitialize();
}
var saveResourceData = function() {
	debugWriteLog( '### Mixi saveResourceData');
	try {
		if(prefAutologinMode == PREF_BOOL_ON){
			resourceData.lastLoginSuccessTime = onLoginInfo.lastLoginSuccessTime.toString();
			resourceData.newarriveNotifyFlg = (onLoginInfo.newarriveNotifyFlg ? 1 : 0);
			resourceData.newarriveTracksFlg = (onLoginInfo.newarriveTracksFlg ? 1 : 0);
			resourceData.newarriveDiaryFlg = (onLoginInfo.newarriveDiaryFlg ? 1 : 0);
			resourceData.newarriveCommunityFlg = (onLoginInfo.newarriveCommunityFlg ? 1 : 0);
			resourceData.ETag = ETag;
			var _jsonText = convertArrayToJson(resourceData);
			if(_jsonText){
				extension.saveFile(Extension.fileType.TEMP, dummyCallback, _jsonText);
			}
		}
		else{
			deleteResourceData();;
		}
	}
	catch(e){
		debugAlert('Error saveResourceData:' + e);
	}
}
var deleteResourceData = function() {
	debugWriteLog( '### Mixi deleteResourceData');
	extension.saveFile(Extension.fileType.TEMP, dummyCallback, ' ');
}
var loadResourceData = function() {
	debugWriteLog( '### Mixi loadResourceData');
	extension.readFile('temp.xml', onLoadResourceDataCallback);
}
var onLoadResourceDataCallback = function(_flag, _request){
	debugWriteLog( '### Mixi onLoadResourceDataCallback', 'stats=' + _request.status);
	try {
		if(_request.status == 200){
			var _text = _request.responseText;
			if(_text){
				resourceData = convertJsonToArray(_text);
				if(resourceData != null && typeof(resourceData.lastLoginSuccessTime) != 'undefined'){
					debugWriteLog( '### Mixi onLoadResourceDataCallback', 'debug 1');
					if(typeof(resourceData.newArriveNotify) == 'undefined'){
						resourceData.newArriveNotify = null;
					}
					if(typeof(resourceData.newArriveTracks) == 'undefined'){
						resourceData.newArriveTracks = null;
					}
					if(typeof(resourceData.newArriveDiary) == 'undefined'){
						resourceData.newArriveDiary = null;
					}
					if(typeof(resourceData.newArriveCommunity) == 'undefined'){
						resourceData.newArriveCommunity = null;
					}
					if(typeof(resourceData.ETag) != 'undefined'){
						ETag = resourceData.ETag;
					}
					else{
						ETag = new Array();
					}
					if(typeof(resourceData.lastLoginSuccessTime) != 'undefined'){
						onLoginInfo.lastLoginSuccessTime = new Date(resourceData.lastLoginSuccessTime);
					}
					if(typeof(resourceData.newarriveNotifyFlg) != 'undefined'){
						onLoginInfo.newarriveNotifyFlg = ((resourceData.newarriveNotifyFlg) ? true : false);
					}
					if(typeof(resourceData.newarriveTracksFlg) != 'undefined'){
						onLoginInfo.newarriveTracksFlg = ((resourceData.newarriveTracksFlg) ? true : false);
					}
					if(typeof(resourceData.newarriveDiaryFlg) != 'undefined'){
						onLoginInfo.newarriveDiaryFlg = ((resourceData.newarriveDiaryFlg) ? true : false);
					}
					if(typeof(resourceData.newarriveCommunityFlg) != 'undefined'){
						onLoginInfo.newarriveCommunityFlg = ((resourceData.newarriveCommunityFlg) ? true : false);
					}
				}
				else{
					debugWriteLog( '### Mixi onLoadResourceDataCallback', 'debug 2');
					resourceData = null;
				}
			}
		}
		else{
			finishInitialize();
			onLogout();
			return;
		}
	}
	catch( e ){
		debugAlert('Error onLoadResourceDataCallback:' + e);
	}
	decryptEmailPasswd();
}
var getTracksAlternateURL = function(){
	var _url = null;
	if(resourceData.newArriveTracks != null && typeof(resourceData.newArriveTracks) != 'undefined' ){
		if( resourceData.newArriveTracks.alternate != null && typeof(resourceData.newArriveTracks.alternate) != 'undefined'){
			_url = resourceData.newArriveTracks.alternate;
		}
	}
	return(_url);
}
var wsseISO8601datetime = function() {
	var _time		= '';
	try {
		var _now 		= new Date();
		var _year		= _now.getFullYear();
		var _month		= _now.getUTCMonth() + 1;
		var _day  		= _now.getUTCDate();
		var _hour 		= _now.getUTCHours();
		var _minute 	= _now.getUTCMinutes();
		var _second		= _now.getUTCSeconds();
		if (_month <= 9) {
			_month = '0' + _month;
		}
		if (_day <= 9) {
			_day = '0' + _day;
		}
		if (_hour <= 9) {
			_hour = '0' + _hour;
		}
		if (_minute <= 9) {
			_minute = '0' + _minute;
		}
		if (_second <= 9) {
			_second = '0' + _second;
		}
		_time = _year + "-" + _month + "-" + _day + "T" + _hour + ":" + _minute + ":" + _second + 'Z';
	}
	catch(e){
		debugAlert(e);
	}
	return _time;
}
function focusChange( _obj ) {
	alert('focusChang = ' + _obj);
}
var onMouseDownInputControl = function( _obj ){
debugWriteLog('+++ onMouseDownInputControl', '');
	isInFocus = true;
	if(	!isScreenModeActive()){
		return(true);
	}
	if(_obj.id == EMAIL_FIELD_ID){
		setButtonFocus(buttonFocusInfo.state.EMAIL);
	}
	else if(_obj.id == PASSWD_FIELD_ID){
		setButtonFocus(buttonFocusInfo.state.PASSWORD);
	}
	else if(_obj.id == AUTOLOGIN_CHECKBOX_ID){
		setButtonFocus(buttonFocusInfo.state.AUTOLOGIN);
		onAutologin();
		return(false);
	}
	return(true);
}
var onClickInputControl = function( _obj ){
debugWriteLog('+++ onClickInputControl', '');
	isInFocus = true;
	if(	!isScreenModeActive()){
		return(true);
	}
	buttonState.currentMouseDownObject = null;
	if(_obj.id == EMAIL_FIELD_ID){
		setButtonFocus(buttonFocusInfo.state.EMAIL);
	}
	else if(_obj.id == PASSWD_FIELD_ID){
		setButtonFocus(buttonFocusInfo.state.PASSWORD);
	}
	else if(_obj.id == AUTOLOGIN_CHECKBOX_ID){
		setButtonFocus(buttonFocusInfo.state.AUTOLOGIN);
		onAutologin();
		return(false);
	}
	return(true);
}
var onMouseDownButton = function( _obj ){
	if(!isScreenModeActive()){
		return(true);
	}
	if(false == isLoginPhase()){
		buttonState.currentMouseDownObject = _obj;
		changeButtonImage(_obj, buttonState.PUSH);
		setButtonFocusWithObject(_obj);
	}
}
var onMouseUpButton = function( _obj ){
	if(!isScreenModeActive()){
		return(true);
	}
	if(false == isLoginPhase()){
		buttonState.currentMouseDownObject = null;
		changeButtonImage(_obj, buttonState.NORMAL);
	}
}
var callOpenWeb = function(_url) {
	if(openWebFlg == false){
		openWebFlg = true;
		extension.openWeb(_url);
	}
};
var onMouseClickButton = function( _obj ){
	if(!isScreenModeActive()){
		return(true);
	}
	if(false == isLoginPhase()){
		buttonState.currentMouseDownObject = null;
		if(_obj.id == LOGO_BUTTON_ID){
			callOpenWeb(MIXI_OPEN_MIXI_HOME_URL);
		}
		else if(_obj.id == LOGIN_BUTTON_ID){
			changeButtonImage(_obj, buttonState.NORMAL);
			onLogin();
		}
		else if(_obj.id == LOGOUT_BUTTON_ID){
			changeButtonImage(_obj, buttonState.NORMAL);
			onLogout();
		}
		else if(_obj.id == UPDATETIME_BUTTON_ID){
			changeButtonImage(_obj, buttonState.NORMAL);
			if (getNetworkStatus() && isNotLogout()) {
				loginPhaseStart();
			}
		}
		enableLED(false);
		updateLED();
	}
}
var onMouseDownNewArrive = function( _obj ){
	if(!isScreenModeActive()){
		return(true);
	}
	if(false == isLoginPhase()){
		buttonState.currentMouseDownObject = _obj;
		changeNewArriveButtonImage(_obj,buttonState.PUSH);
	}
}
var onMouseUpNewArrive = function( _obj ){
	if(!isScreenModeActive()){
		return(true);
	}
	if(false == isLoginPhase()){
		buttonState.currentMouseDownObject = null;
		changeNewArriveButtonImage(_obj,buttonState.NORMAL);
	}
}
var onClickNewArrive = function( _obj ){
	if(!isScreenModeActive()){
		return(true);
	}
	if(false != isLoginPhase()){
		return;
	}
	try {
		debugWriteLog( '### Mixi openMixi');
		buttonState.currentMouseDownObject = null;
		if (_obj) {
			var _id = _obj.id;
			if(_id){
				var _url = null;
				switch(_id){
					case NEWARRIVE_NOTIFY_ID + 'Button':
						_url = MIXI_OPEN_NEWARRIVE_NOTIFY_URL;
						onLoginInfo.newarriveNotifyFlg = false;
						break;
					case NEWARRIVE_DIARY_ID + 'Button':
						_url = MIXI_OPEN_NEWARRIVE_DIARY_URL;
						onLoginInfo.newarriveDiaryFlg = false;
						break;
					case NEWARRIVE_COMMUNITY_ID + 'Button':
						_url = MIXI_OPEN_NEWARRIVE_COMMUNITY_URL;
						onLoginInfo.newarriveCommunityFlg = false;
						break;
					case NEWARRIVE_TRACKS_ID + 'Button':
						_url = getTracksAlternateURL();
						if(_url){
							if(-1 != _url.indexOf('?')){
								_url = _url + '&' + MIXI_OPEN_NEWARRIVE_TRACKS_URL_PARAM;
							}
							else{
								_url = _url + '?' + MIXI_OPEN_NEWARRIVE_TRACKS_URL_PARAM;
							}
						}
						onLoginInfo.newarriveTracksFlg = false;
						break;
					default:
						break;
				}
				if(_url){
					setButtonFocusWithObject(_obj);
					updateNewarrive();
					callOpenWeb(_url);
					saveResourceData();
				}
			}
			enableLED(false);
			updateLED();
		}
	}
	catch( e ){
		debugAlert('Error onClickNewArrive:' + e);
	}
}
var onBaseMouseUp = function(_obj){
	if(!isScreenModeActive()){
		return(true);
	}
	if(false != isLoginPhase()){
	}
	if(	buttonState.currentMouseDownObject != null){
		if(buttonState.currentMouseDownObject.id == LOGIN_BUTTON_ID){
			setButtonFocus(buttonFocusInfo.state.LOGIN);
		}
		else if(buttonState.currentMouseDownObject.id == LOGOUT_BUTTON_ID){
			setButtonFocus(buttonFocusInfo.state.LOGOUT);
		}
		else if(buttonState.currentMouseDownObject.id == UPDATETIME_BUTTON_ID){
			setButtonFocus(buttonFocusInfo.state.UPDATETIME);
		}
		else if(buttonState.currentMouseDownObject.id == NEWARRIVE_NOTIFY_BUTTON_ID){
			setButtonFocus(buttonFocusInfo.state.NEWARRIVE_NOTIFY);
		}
		else if(buttonState.currentMouseDownObject.id == NEWARRIVE_DIARY_BUTTON_ID){
			setButtonFocus(buttonFocusInfo.state.NEWARRIVE_DIARY);
		}
		else if(buttonState.currentMouseDownObject.id == NEWARRIVE_COMMUNITY_BUTTON_ID){
			setButtonFocus(buttonFocusInfo.state.NEWARRIVE_COMMUNITY);
		}
		else if(buttonState.currentMouseDownObject.id == NEWARRIVE_TRACKS_BUTTON_ID){
			setButtonFocus(buttonFocusInfo.state.NEWARRIVE_TRACKS);
		}
		else{
			setButtonFocus(buttonFocusInfo.state.UNKNOWN);
		}
	}
	buttonState.currentMouseDownObject = null;
}
var updateAutologin = function() {
	var _object = document.getElementById(AUTOLOGIN_CHECKBOX_ID);
	if(_object){
		if(prefAutologinMode == PREF_BOOL_ON){
			_object.checked = true;
		}else if(prefAutologinMode == PREF_BOOL_OFF){
			_object.checked = false;
		}
	}
}
var enableLED = function(_flg) {
	if(_flg){
		ledStatus = LEDState.ON; 
	}
	else{
		if(ledStatus ==  LEDState.ON){
			ledStatus =  LEDState.OFF;
		}
	}
}
var updateLED = function() {
	var _ledPart = document.getElementById(LED_PART_ID);
	if(_ledPart != null && false == isLoginPhase() && encryptEmailPasswdFlg == false){
		if (prefLedMode == PREF_BOOL_ON) {
			if(	ledStatus == LEDState.ON){
				_ledPart.style.backgroundImage = 'url("./img/LED_newarrival.png")';
			}
			else{
				_ledPart.style.backgroundImage = 'url("./img/LED_set.png")';
			}
			if(	ledStatus == LEDState.ON){
				extension.ledOn();
			}
			else if( ledStatus == LEDState.OFF){
				extension.ledOff();
				ledStatus = LEDState.UNKNOWN;
			}
		} else if (prefLedMode == PREF_BOOL_OFF) {
			if(ledStatus != LEDState.UNKNOWN){
				extension.ledOff();
			}
			_ledPart.style.backgroundImage = 'url("./img/LED_preset.png")';
			ledStatus = LEDState.UNKNOWN;
		}
	}
}
var isLogined = function() {
	return(LoginState.AFTER_LOGINED == getLoginStatus());
};
var isNotLogout = function() {
	return(LoginState.LOGOUT != getLoginStatus());
};
var getLoginStatus = function(  ) {
	return(loginStatus);
};
var setLoginStatus = function( _state ) {
	loginStatus = _state;
};
var changeButtonImage = function( _obj, _src ) {
	var _status = false;
	try {
 		if(_obj != null && isLoginPhase()){
			_src = buttonState.DISABLE;
		}
		if(_obj){
			if(-1 != _obj.id.indexOf(LOGIN_BUTTON_ID)){
				if(-1 != _src.indexOf(buttonState.PUSH)){
					_obj.style.backgroundImage = 'url("./img/mw_login_button_push_focus.png")';
				}
				else if(-1 != _src.indexOf(buttonState.NORMAL)){
					_obj.style.backgroundImage = 'url("./img/mw_login_button_normal.png")';
				}
				else if(-1 != _src.indexOf(buttonState.FOCUS)){
					_obj.style.backgroundImage = 'url("./img/mw_login_button_normal_focus.png")';
				}
				else if(-1 != _src.indexOf(buttonState.DISABLE)){
					_obj.style.backgroundImage = 'url("./img/mw_login_button_disable.png")';
				}
				_status = true;
			}
			else if(-1 != _obj.id.indexOf(LOGOUT_BUTTON_ID)){
				if(-1 != _src.indexOf(buttonState.PUSH)){
					_obj.style.backgroundImage = 'url("./img/mw_logout_button_push_focus.png")';
				}
				else if(-1 != _src.indexOf(buttonState.NORMAL)){
					_obj.style.backgroundImage = 'url("./img/mw_logout_button_normal.png")';
				}
				else if(-1 != _src.indexOf(buttonState.FOCUS)){
					_obj.style.backgroundImage = 'url("./img/mw_logout_button_normal_focus.png")';
				}
				else if(-1 != _src.indexOf(buttonState.DISABLE)){
					_obj.style.backgroundImage = 'url("./img/mw_logout_button_disable.png")';
				}
				_status = true;
			}
			else if(-1 != _obj.id.indexOf(UPDATETIME_BUTTON_ID)){
				if(-1 != _src.indexOf(buttonState.PUSH)){
					_obj.style.backgroundImage = 'url("./img/mw_update_button_push_focus.png")';
				}
				else if(-1 != _src.indexOf(buttonState.NORMAL)){
					_obj.style.backgroundImage = 'url("./img/mw_update_button_normal.png")';
				}
				else if(-1 != _src.indexOf(buttonState.FOCUS)){
					_obj.style.backgroundImage = 'url("./img/mw_update_button_normal_focus.png")';
				}
				else if(-1 != _src.indexOf(buttonState.DISABLE)){
					_obj.style.backgroundImage = 'url("./img/mw_update_button_disable.png")';
				}
				_status = true;
			}
		}
	}
	catch( e ){
		debugAlert('Error changeButtonImage:' + e);
	}
	return(_status);
}
var changeNewArriveButtonImage = function( _obj, _src ) {
	var _status = false;
	try {
 		if(_obj != null && isLoginPhase()){
			_src = buttonState.DISABLE;
		}
		if(_obj){
			var _left_div = null;
			var _center_div = null;
			var _right_div = null;
			var _childNodes = _obj.childNodes;
			if(_childNodes){
				for(var _j = 0; _j <_childNodes.length; _j++ ){
					var _childNode = _childNodes[_j];
					if(_childNode && typeof(_childNode) != 'undefined'){
						if(typeof(_childNode.tagName) != 'undefined' && _childNode.tagName.toLowerCase() == 'div'){
							if(_childNode.id == NEWARRIVE_BUTTON_PART_LEFT_DIV_ID){
								_left_div = _childNode;
							}
							else if(_childNode.id == NEWARRIVE_BUTTON_PART_CENTER_DIV_ID){
								_center_div = _childNode;
							}
							else if(_childNode.id == NEWARRIVE_BUTTON_PART_RIGHT_DIV_ID){
								_right_div = _childNode;
							}
						}
					}
					if(_left_div && _center_div && _right_div ){
						break;
					}
				}
			}
			if(_left_div && _center_div && _right_div ){
				if(-1 != _src.indexOf(buttonState.PUSH)){
					_left_div.style.backgroundImage 	= 'url("./img/mw_button_left_push_focus.png")';
					_center_div.style.backgroundImage 	= 'url("./img/mw_button_tsunagi_push_focus.png")';
					_right_div.style.backgroundImage 	= 'url("./img/mw_button_right_push_focus.png")';
				}
				else if(-1 != _src.indexOf(buttonState.NORMAL)){
					_left_div.style.backgroundImage 	= 'url("./img/mw_button_left_normal.png")';
					_center_div.style.backgroundImage 	= 'url("./img/mw_button_tsunagi_normal.png")';
					_right_div.style.backgroundImage 	= 'url("./img/mw_button_right_normal.png")';
				}
				else if(-1 != _src.indexOf(buttonState.FOCUS)){
					_left_div.style.backgroundImage 	= 'url("./img/mw_button_left_focus.png")';
					_center_div.style.backgroundImage	= 'url("./img/mw_button_tsunagi_focus.png")';
					_right_div.style.backgroundImage 	= 'url("./img/mw_button_right_focus.png")';
				}
				else if(-1 != _src.indexOf(buttonState.DISABLE)){
					_left_div.style.backgroundImage 	= 'url("./img/mw_button_left_disable.png")';
					_center_div.style.backgroundImage 	= 'url("./img/mw_button_tsunagi_disable.png")';
					_right_div.style.backgroundImage 	= 'url("./img/mw_button_right_disable.png")';
				}
				_status = true;
			}
		}
	}
	catch( e ){
		debugAlert('Error changeNewArriveButtonImage:' + e);
	}
	return(_status);
}
var updateNewarrive = function() {
	try {
		document.getElementById(NEWARRIVE_NOTIFY_ID).className =
			(onLoginInfo.newarriveNotifyFlg ? NEW_ARRIVED_CLASS : NO_ARRIVED_CLASS);
		document.getElementById(NEWARRIVE_TRACKS_ID).className =
			(onLoginInfo.newarriveTracksFlg ? NEW_ARRIVED_CLASS : NO_ARRIVED_CLASS);
		document.getElementById(NEWARRIVE_DIARY_ID).className =
			(onLoginInfo.newarriveDiaryFlg ? NEW_ARRIVED_CLASS : NO_ARRIVED_CLASS);
		document.getElementById(NEWARRIVE_COMMUNITY_ID).className =
			(onLoginInfo.newarriveCommunityFlg ? NEW_ARRIVED_CLASS : NO_ARRIVED_CLASS);
		if(	onLoginInfo.newarriveNotifyFlg == true){
			document.getElementById(NEWARRIVE_NOTIFY_ID).style.color = 'rgb(255,0,0)';
			document.getElementById(NEWARRIVE_NOTIFY_ID).innerHTML = NEWARRIVE_NOTIFY_MESSAGE_ON;
		}
		else{
			document.getElementById(NEWARRIVE_NOTIFY_ID).style.color = 'rgb(219,207,197)';
			document.getElementById(NEWARRIVE_NOTIFY_ID).innerHTML = NEWARRIVE_NOTIFY_MESSAGE_OFF;
		}
		updateLED();
	}
	catch( e ){
		debugAlert('Error updateNewarrive:' + e);
	}
}
var updateLastLoginSuccessTime = function() {
	try {
		debugWriteLog( '### Mixi updateLastLoginSuccessTime');
		var _object = document.getElementById(UPDATETIME_ID);
		if(_object){
			var _lastUpdate = onLoginInfo.lastLoginSuccessTime;
			if(_lastUpdate){
				var _text = "";
				var _now = new Date();
				var _today = new Date(_now.getFullYear(), _now.getMonth(), _now.getDate());
				if(_today.getTime() <= _lastUpdate.getTime()){
					var _ampm = 'am';
					var _hours = _lastUpdate.getHours();
					if(_hours < 12){
						_ampm = 'am';
						_hours = _lastUpdate.getHours();
					}
					else{
						_ampm = 'pm';
						_hours = _lastUpdate.getHours() -12;
					}
					if(_hours == 0){
						_hours = 12;
					}
					if(_hours < 10){
						_text = _text + '0'
					}
					_text = _text + _hours + ':';
					if(_lastUpdate.getMinutes() < 10){
						_text = _text + '0'
					}
					_text = _text + _lastUpdate.getMinutes();
					_text = _text  + ' ' + _ampm;
				}
				else{
					if(_lastUpdate.getMonth() < 10){
						_text = _text + '0'
					}
					_text = _text + (_lastUpdate.getMonth() + 1) + '/';
					if(_lastUpdate.getDate() < 10){
						_text = _text + '0'
					}
					_text = _text + _lastUpdate.getDate();
				}
				_object.innerHTML = _text;
			}
			else{
				_object.innerHTML = '';
			}
		}
	}
	catch( e ){
		debugAlert('Error updateLastLoginSuccessTime:' + e);
	}
}
var setDefaultButtonFocus = function( ) {
debugWriteLog('+++ setDefaultButtonFocus', '');
	if(buttonFocusInfo.current ==  buttonFocusInfo.state.UNKNOWN){
		if(false == isNotLogout()){
			if(getEmail() == ''){
				setButtonFocus(buttonFocusInfo.state.EMAIL);
			}
			else if(getPasswd() == ''){
				setButtonFocus(buttonFocusInfo.state.PASSWORD);
			}
			else{
				setButtonFocus(buttonFocusInfo.state.EMAIL);
			}
		}
		else{
			if(onLoginInfo.newarriveNotifyFlg == true){
				setButtonFocus(buttonFocusInfo.state.NEWARRIVE_NOTIFY);
			}
			else if(onLoginInfo.newarriveDiaryFlg == true){
				setButtonFocus(buttonFocusInfo.state.NEWARRIVE_DIARY);
			}
			else if(onLoginInfo.newarriveCommunityFlg == true){
				setButtonFocus(buttonFocusInfo.state.NEWARRIVE_COMMUNITY);
			}
			else if(onLoginInfo.newarriveTracksFlg == true){
				setButtonFocus(buttonFocusInfo.state.NEWARRIVE_TRACKS);
			}
			else{
				setButtonFocus(buttonFocusInfo.state.NEWARRIVE_NOTIFY);
			}
		}
	}
	else{
		setButtonFocus(buttonFocusInfo.current);
	}
}
var setButtonFocusWithObject = function( _object) {
debugWriteLog('+++ setButtonFocusWithObject', '');
	try {
		var _status = buttonFocusInfo.state.UNKNOWN;
		if(_object !== null){
			if(_object == document.getElementById(UPDATETIME_BUTTON_ID)){
				_status = buttonFocusInfo.state.UPDATETIME;
			}
			else if(_object == document.getElementById(LOGIN_BUTTON_ID)){
				_status = buttonFocusInfo.state.LOGIN;
			}
			else if(_object == document.getElementById(LOGOUT_BUTTON_ID)){
				_status = buttonFocusInfo.state.LOGOUT;
			}
			else if(_object == document.getElementById(EMAIL_FIELD_ID)){
				_status = buttonFocusInfo.state.EMAIL;
			}
			else if(_object == document.getElementById(PASSWD_FIELD_ID)){
				_status = buttonFocusInfo.state.PASSWORD;
			}
			else if(_object == document.getElementById(AUTOLOGIN_CHECKBOX_ID)){
				_status = buttonFocusInfo.state.AUTOLOGIN;
			}
			else if(_object == document.getElementById(NEWARRIVE_NOTIFY_BUTTON_ID)){
				_status = buttonFocusInfo.state.NEWARRIVE_NOTIFY;
			}
			else if(_object == document.getElementById(NEWARRIVE_DIARY_BUTTON_ID)){
				_status = buttonFocusInfo.state.NEWARRIVE_DIARY;
			}
			else if(_object == document.getElementById(NEWARRIVE_COMMUNITY_BUTTON_ID)){
				_status = buttonFocusInfo.state.NEWARRIVE_COMMUNITY;
			}
			else if(_object == document.getElementById(NEWARRIVE_TRACKS_BUTTON_ID)){
				_status = buttonFocusInfo.state.NEWARRIVE_TRACKS;
			}
			setButtonFocus(_status);
		}
	}
	catch( e ){
		debugAlert('Error setButtonFocusWithObject:' + e);
	}
}
var setButtonFocus = function( _state) {
debugWriteLog('+++ setButtonFocus', _state);
	try {
		if(buttonFocusInfo.object != null){
			switch(buttonFocusInfo.current){
				case buttonFocusInfo.state.LOGIN:
				case buttonFocusInfo.state.LOGOUT:
				case buttonFocusInfo.state.UPDATETIME:
					changeButtonImage(buttonFocusInfo.object,buttonState.NORMAL);
					break;
				case buttonFocusInfo.state.EMAIL:
				case buttonFocusInfo.state.PASSWORD:
					buttonFocusInfo.object.style.borderColor = "#808080"
					buttonFocusInfo.object.blur();	
					break;
				case buttonFocusInfo.state.AUTOLOGIN:
					buttonFocusInfo.object.style.borderColor = "#808080"
					buttonFocusInfo.object.blur();	
					break;
				case buttonFocusInfo.state.NEWARRIVE_NOTIFY:
				case buttonFocusInfo.state.NEWARRIVE_DIARY:
				case buttonFocusInfo.state.NEWARRIVE_COMMUNITY:
				case buttonFocusInfo.state.NEWARRIVE_TRACKS:
					changeNewArriveButtonImage(buttonFocusInfo.object,buttonState.NORMAL);
					break;
			}
		}
		buttonFocusInfo.current = _state;
		if(isInFocus == true){
			switch(_state){
				case buttonFocusInfo.state.UPDATETIME:
					buttonFocusInfo.object = document.getElementById(UPDATETIME_BUTTON_ID);
					break;
				case buttonFocusInfo.state.LOGIN:
					buttonFocusInfo.object = document.getElementById(LOGIN_BUTTON_ID);
					break;
				case buttonFocusInfo.state.LOGOUT:
					buttonFocusInfo.object = document.getElementById(LOGOUT_BUTTON_ID);
					break;
				case buttonFocusInfo.state.EMAIL:
					buttonFocusInfo.object = document.getElementById(EMAIL_FIELD_ID);
					break;
				case buttonFocusInfo.state.PASSWORD:
					buttonFocusInfo.object = document.getElementById(PASSWD_FIELD_ID);
					break;
				case buttonFocusInfo.state.AUTOLOGIN:
					buttonFocusInfo.object = document.getElementById(AUTOLOGIN_CHECKBOX_ID);
					break;
				case buttonFocusInfo.state.NEWARRIVE_NOTIFY:
					buttonFocusInfo.object = document.getElementById(NEWARRIVE_NOTIFY_BUTTON_ID);
					break;
				case buttonFocusInfo.state.NEWARRIVE_DIARY:
					buttonFocusInfo.object = document.getElementById(NEWARRIVE_DIARY_BUTTON_ID);
					break;
				case buttonFocusInfo.state.NEWARRIVE_COMMUNITY:
					buttonFocusInfo.object = document.getElementById(NEWARRIVE_COMMUNITY_BUTTON_ID);
					break;
				case buttonFocusInfo.state.NEWARRIVE_TRACKS:
					buttonFocusInfo.object = document.getElementById(NEWARRIVE_TRACKS_BUTTON_ID);
					break;
				default:
					buttonFocusInfo.current = buttonFocusInfo.state.UNKNOWN;
					buttonFocusInfo.object = null;
					break;
			}
		}
		else{
			buttonFocusInfo.current = buttonFocusInfo.state.UNKNOWN;
			buttonFocusInfo.object = null;
		}
		if(buttonFocusInfo.object){
			switch(_state){
				case buttonFocusInfo.state.LOGIN:
				case buttonFocusInfo.state.LOGOUT:
				case buttonFocusInfo.state.UPDATETIME:
					changeButtonImage(buttonFocusInfo.object,buttonState.FOCUS);
					break;
				case buttonFocusInfo.state.EMAIL:
				case buttonFocusInfo.state.PASSWORD:
					buttonFocusInfo.object.style.borderColor = "#FF0000"
					buttonFocusInfo.object.focus();	
					break;
				case buttonFocusInfo.state.AUTOLOGIN:
					buttonFocusInfo.object.style.borderColor = "#FF0000"
					buttonFocusInfo.object.focus();	
					break;
				case buttonFocusInfo.state.NEWARRIVE_NOTIFY:
				case buttonFocusInfo.state.NEWARRIVE_DIARY:
				case buttonFocusInfo.state.NEWARRIVE_COMMUNITY:
				case buttonFocusInfo.state.NEWARRIVE_TRACKS:
					changeNewArriveButtonImage(buttonFocusInfo.object,buttonState.FOCUS);
					break;
				default:
					buttonFocusInfo.current = buttonFocusInfo.state.UNKNOWN;
					buttonFocusInfo.object = null;
					break;
			}
		}
		else{
			buttonFocusInfo.current = buttonFocusInfo.state.UNKNOWN;
			buttonFocusInfo.object = null;
		}
	}
	catch( e ){
		debugAlert('Error setButtonFocus:' + e);
	}
}
var setButtonEnable = function( _flg ) {
	var _debugCount = '';
	try {
		var _buttonState = buttonState.NORMAL;
		if(false == _flg){
			 _buttonState = buttonState.DISABLE;
		}
		changeButtonImage(document.getElementById(LOGIN_BUTTON_ID),		_buttonState);
		changeButtonImage(document.getElementById(LOGOUT_BUTTON_ID),	_buttonState);
		changeButtonImage(document.getElementById(UPDATETIME_BUTTON_ID),_buttonState);
		changeNewArriveButtonImage(document.getElementById(NEWARRIVE_NOTIFY_BUTTON_ID),		_buttonState);
		changeNewArriveButtonImage(document.getElementById(NEWARRIVE_DIARY_BUTTON_ID),		_buttonState);
		changeNewArriveButtonImage(document.getElementById(NEWARRIVE_COMMUNITY_BUTTON_ID),	_buttonState);
		document.getElementById(EMAIL_FIELD_ID).disabled = !_flg;
		document.getElementById(PASSWD_FIELD_ID).disabled = !_flg;
		document.getElementById(AUTOLOGIN_CHECKBOX_ID).disabled = !_flg;
		if(	null != getTracksAlternateURL()){
			changeNewArriveButtonImage(document.getElementById(NEWARRIVE_TRACKS_BUTTON_ID),	_buttonState);
		}
		else{
			changeNewArriveButtonImage(document.getElementById(NEWARRIVE_TRACKS_BUTTON_ID),	buttonState.DISABLE);
		}
		if(_flg == true){
			if(	typeof(buttonFocusInfo.current) != 'undefined' && buttonFocusInfo.current != buttonFocusInfo.state.UNKNOWN){
				setButtonFocus(buttonFocusInfo.current);
			}
			else{
				setDefaultButtonFocus();
			}
		}
	}
	catch( e ){
		debugAlert('Error setButtonEnable:' + e);
	}
}
var sCopyArrayCallDepth = 0;
var copyArray = function( _array, _copyArray) {
	if(_copyArray == null){
		_copyArray = new Array();
	}
	try {
		sCopyArrayCallDepth++;
		for(var _key in _array){
			if(typeof(_array[_key])!= 'undefined'){
				if(typeof(_array[_key]) == 'string'){
					_copyArray[_key] = _array[_key];
				}
				else if(typeof(_array[_key]) == 'number'){
					_copyArray[_key] = _array[_key];
				}
				else if(typeof(_array[_key]) == 'object'){
					if(_key == 'updated'){
						_copyArray[_key] = new Date(_array[_key].toString());
					}
					else{
						var _tempCopyArray = new Array();
						_copyArray[_key] = copyArray(_array[_key], _tempCopyArray);
					}
				}
				else{
				}
			}
		}
		sCopyArrayCallDepth--;
	}
	catch(e){
		debugAlert('Error copyArray:' + e);
	}
	return(_copyArray);
}
var sConvertArrayToJsonCallDepth = 0;
var sJsonText = null;
var convertArrayToJson = function( _array) {
	try {
		var _log = '';
		if(sConvertArrayToJsonCallDepth == 0){
			sJsonText = '{';
		}
		sConvertArrayToJsonCallDepth++;
		_log += 'JSON(' + sConvertArrayToJsonCallDepth + '):'
		for(var _key in _array){
			if(typeof(_array[_key])!= 'undefined'){
				if(typeof(_array[_key]) == 'string'){
					var _string_value = _array[_key].replace(/"/g, '\\"');
					_string_value = _string_value.replace(/'/g, "\\'");
					sJsonText += '"' + _key +  '" : "' + _string_value + '",';
				}
				else if(typeof(_array[_key]) == 'number'){
					sJsonText += '"' +_key + '" : ' + _array[_key] + ',';
				}
				else if(typeof(_array[_key]) == 'object'){
					if(_key == 'updated'){
						debugWriteLog('>>>Date:' + _key , _array[_key] );
						sJsonText += '"' +_key + '" : "' + _array[_key].toString() + '",';
					}
					else{
						sJsonText += '"' +_key + '" : { ';
						convertArrayToJson(_array[_key]);
						sJsonText += '},';
					}
				}
				else{
				}
			}
		}
		sConvertArrayToJsonCallDepth--;
		if(sConvertArrayToJsonCallDepth == 0){
			sJsonText += '}';
			return(sJsonText);
		}
	}
	catch(e){
		debugAlert('Error convertArrayToJson:' + e);
	}
	return("");
}
var convertJsonToArray = function( _json) {
	var _array = null;
	try {
		if(_json != null){
			_array = eval( '(' + _json + ')' );
			convertDateStrToDate(_array);
		}
	}
	catch(e){
		debugAlert('Error convertJsonToArray:' + e);
		_array = null;
	}
	return(_array);
}
var convertDateStrToDate = function(_array) {
	try {
		for(var _key in _array){
			if(typeof(_array[_key])!= 'undefined'){
				if(typeof(_array[_key]) == 'string'){
					if(_key == 'updated'){
						_array[_key] = new Date(_array[_key]);
					}
				}
				else if(typeof(_array[_key]) == 'object'){
					convertDateStrToDate(_array[_key]);
				}
			}
		}
	}
	catch(e){
		debugAlert('Error convertDateStrToDate:' + e);
	}
}
var debugCompareJsonWithArray = function( _json, _array) {
	var _jsonArray = convertJsonToArray(_json);
	if(_jsonArray != null){
		return(	debugCompareArray(_jsonArray, _array) && 
				debugCompareArray(_array, _jsonArray));
	}
	return(false);
}
var sDebugCompareArrayCallDepth = 0;
var sDebugCompareArrayKeyPath = '';
var debugCompareArray = function( _array1, _array2) {
	var _status = true;
	try {
		if(sDebugCompareArrayCallDepth == 0){
			sDebugCompareArrayKeyPath = '';
		}
		sDebugCompareArrayCallDepth++;
		{
			for(var _key in _array1){
				var _tempDebugCompareArrayKeyPath = sDebugCompareArrayKeyPath;
				sDebugCompareArrayKeyPath = sDebugCompareArrayKeyPath + '[' + _key + ']';
				if(	_array1[_key] != null && typeof(_array1[_key]) != 'undefined' && 
					_array2[_key] != null && typeof(_array2[_key]) != 'undefined'){
					if(typeof(_array1[_key]) == typeof(_array2[_key]) ){
						if(typeof(_array1[_key]) == 'number' || typeof(_array1[_key]) == 'string'){
							if(_array1[_key] != _array2[_key]){
								debugAlert('Error debugCompareArray:value:' + _key);
								_status = false;
							}
						}
						else if(typeof(_array1[_key]) == 'object'){
							if(_key == 'updated'){
								debugWriteLog('###Date:' + _key , _array1[_key] );
								debugWriteLog('###Date:' + _key , _array2[_key] );
								if(_array1[_key].toString() != _array2[_key].toString()){
									debugAlert('Error debugCompareArray:updated value:' + _key);
									debugAlert((_array1[_key].toString()) + ',' + (_array2[_key].toString()));
									_status = false;
								}
							}
							else{
								_status = debugCompareArray(_array1[_key], _array2[_key]);
							}
						}
					}
					else{
						debugAlert('Error debugCompareArray:value type:' + _key);
						_status = false;
					}
				}
				else{
					if(	_array1[_key] != null && typeof(_array1[_key]) != 'function' &&
						_array2[_key] != null &&  typeof(_array2[_key]) != 'function'){
						debugAlert('Error debugCompareArray:value is undefined:' + _key);
						_status = false;
					}
				}
				sDebugCompareArrayKeyPath = _tempDebugCompareArrayKeyPath;
				if(_status == false){
					break;
				}
			}
		}
		sDebugCompareArrayCallDepth--;
	}
	catch(e){
		debugAlert('Error debugCompareArray:' + e);
	}
	return(_status);
}
var clearTimer = function() {
	if (updateForeTimerId != null && updateForeTimerId  > 0) {
		clearInterval(updateForeTimerId);
		updateForeTimerId = null;
	}
	if (updateBackTimerId != null && updateBackTimerId  > 0) {
		clearBackgroundInterval(updateBackTimerId);
		updateBackTimerId = null;
	}
	updateForeTimerId = null;
	updateBackTimerId = null;
}
var setTimer = function() {
	clearTimer();
	if(getUpdateInterval() > 0){
		updateForeTimerId = setInterval(onForeUpdateTimer, getUpdateInterval());
		updateBackTimerId = setBackgroundInterval(onBackUpdateTimer, getUpdateInterval());
	}
	else{
		updateBackTimerId = setBackgroundInterval(onBackUpdateTimer,0);
	}
}
var onForeUpdateTimer = function() {
	debugWriteLog( '### Mixi onForeUpdateTimer', '');
	if (getNetworkStatus() && isNotLogout()) {
		loginPhaseStart();
	}
}
var onBackUpdateTimer = function() {
	debugWriteLog( '### Mixi onBackUpdateTimer', '');
	if (getNetworkStatus() && isNotLogout()) {
		loginPhaseStart();
	}
}
var goActive = function() {
	debugWriteLog( '### Mixi goActive', '');
	if(initalized == false){
		initalized = true;
		if(prefAutologinMode == PREF_BOOL_ON && getNetworkStatus() && getEmail() && getPasswd()){
			loginPhaseStart();
		}
	}
	if(true == isNotLogout()){
		updateLastLoginSuccessTime();
	}
}
var disableWidget = function() {
	if(prefAutologinMode != PREF_BOOL_ON){
	}
};
var	widgetKeyDown = function(evt, key)	{
	if(!isScreenModeActive()){
		return(true);
	}
	if(isInFocus == false){
		return(isInFocus);
	}
 	if(false != isLoginPhase()){
		return(true);
	}
	var _newState = buttonFocusInfo.state.UNKNOWN;
	if(buttonFocusInfo.current != buttonFocusInfo.state.UNKNOWN){
		if(false == isNotLogout()){
			switch (key) {
				case mylo.KeyCode.RIGHT:
				case mylo.KeyCode.LEFT:
					break;
				case mylo.KeyCode.DOWN:
					if( buttonFocusInfo.state.EMAIL <= buttonFocusInfo.current &&
						buttonFocusInfo.current < buttonFocusInfo.state.LOGIN){
						_newState = buttonFocusInfo.current + 1;
					}
					break;
				case mylo.KeyCode.UP:
					if( buttonFocusInfo.state.EMAIL < buttonFocusInfo.current &&
						buttonFocusInfo.current <= buttonFocusInfo.state.LOGIN){
						_newState = buttonFocusInfo.current - 1;
					}
					else{
						_newState = buttonFocusInfo.state.EMAIL;
					}
					break;
				case mylo.KeyCode.ENTER:
					if(buttonFocusInfo.object !== null){
						switch(buttonFocusInfo.current){
							case buttonFocusInfo.state.LOGIN:
								onMouseClickButton(buttonFocusInfo.object);
								break;
							case buttonFocusInfo.state.AUTOLOGIN:
								break;
							default:
								break;
						}
					}
					return false;
					break;
				default:
					break;
			}
		}
		else{
			switch (key) {
				case mylo.KeyCode.RIGHT:
				case mylo.KeyCode.LEFT:
					break;
				case mylo.KeyCode.DOWN:
					if( buttonFocusInfo.state.UPDATETIME <= buttonFocusInfo.current &&
						buttonFocusInfo.current < buttonFocusInfo.state.LOGOUT){
						_newState = buttonFocusInfo.current + 1;
					}
					break;
				case mylo.KeyCode.UP:
					if( buttonFocusInfo.state.UPDATETIME < buttonFocusInfo.current &&
						buttonFocusInfo.current <= buttonFocusInfo.state.LOGOUT){
						_newState = buttonFocusInfo.current - 1;
					}
					break;
				case mylo.KeyCode.ENTER:
					if(buttonFocusInfo.object !== null){
						switch(buttonFocusInfo.current){
							case buttonFocusInfo.state.UPDATETIME:
							case buttonFocusInfo.state.LOGOUT:
								onMouseClickButton(buttonFocusInfo.object);
								break;
							case buttonFocusInfo.state.NEWARRIVE_NOTIFY:
							case buttonFocusInfo.state.NEWARRIVE_DIARY:
							case buttonFocusInfo.state.NEWARRIVE_COMMUNITY:
							case buttonFocusInfo.state.NEWARRIVE_TRACKS:
								onClickNewArrive(buttonFocusInfo.object);
								break;
							default:
								break;
						}
					}
					return false;
					break;
				default:
					break;
			}
		}
	}
	if( _newState != buttonFocusInfo.state.UNKNOWN){
		setButtonFocus(_newState);
		return false;
	}
	return true;
};
var goBackground = function() {
};
var goForeground = function() {
	if(true == isNotLogout()){
		updateLastLoginSuccessTime();
	}
	openWebFlg = false;
};
var inFocus = function() {
debugWriteLog('+++ inFocus', '');
	isInFocus = true;
	enableLED(false);
	updateLED();
	setDefaultButtonFocus();
}
var outFocus = function() {
debugWriteLog('+++ outFocus', '');
	isInFocus = false;
	if(buttonFocusInfo.object != null){
		setButtonFocus(buttonFocusInfo.state.UNKNOWN);
	}
};
var widgetResize = function() {
}
var debugWriteLog = function(name, func){
	if(func){
		widgetLogLevelLow(name, func);
	}
	else{
		widgetLogLevelLow(name, '');
	}
}
var debugAlert = function(message) {
	widgetLogLevelLow( 'mixi Widget', message );
};
