/*
 * Copyright 2007,2008 Sony Corporation
 */

var CELL_PREFIX = 'cell';
var IMG_PREFIX = 'img';
var CONTACT_PREFIX = 'contact';
var CONTACT_ITEM_VIEW_PREFIX = 'friendItemView';
var CONTACT_NAME_PREFIX = 'contactName';
var CONTACT_IMG_PREFIX = 'contactImage';
var PAGE_PREFIX = 'page';
var MAX_AVATAR_LIST = 90;
var MAX_CONTACT_LIST = 5;
var MAX_CONTACT_NAME = 9;
var WIDTH_CELL_DIV = 67;
var HEIGHT_CELL_DIV = 67;
var WIDTH_CRITERIA1 = 442;
var WIDTH_CRITERIA2 = 654;
var TITLE_ID = 'myContactsTitle';
var TITLE_STRING = 'My Contacts';
var PAGE_SETUP_NAME = 'setup';
var TABLE_CLASS_NAME = 'bTable';
var CENTER_TOP_NAME = 'centerCelTop';
var CENTER_LEFT_NAME = 'centerCelLeft';
var CENTER_RIGHT_NAME = 'centerCelRight';
var CENTER_BOTTOM_NAME = 'centerCelBottom';
var CENTER_SEPARATOR_A_NAME = 'centerCelSeparatorA';
var CENTER_SEPARATOR_B_NAME = 'centerCelSeparatorB'; 
var RIGHT_BT_NAME = 'btRight';
var PAGE_DISPLAY_NAME = 'PageDisplay';
var CONTACT_LIST_NAME = 'friendWaku';
var CONTACT_BASE_VIEW_NAME = 'friendViewBase';
var CONTACT_TITLE_NAME = 'friendFont';
var PAGE_ELEM_NAMES = Array( PAGE_SETUP_NAME,
							 TABLE_CLASS_NAME,
							 CENTER_TOP_NAME,
							 CENTER_LEFT_NAME,
							 CENTER_RIGHT_NAME, 
							 CENTER_BOTTOM_NAME, 
							 CENTER_SEPARATOR_A_NAME, 
							 CENTER_SEPARATOR_B_NAME, 
							 RIGHT_BT_NAME,
							 PAGE_DISPLAY_NAME );
var CURRENT_PAGE_NAME = 'currentPage';
var TOTAL_PAGE_NAME = 'totalPage';
var AVATARS_TYPE		=	0;
var SKYPE_TYPE			=	1;
var YAHOO_TYPE			=	2;
var GOOGLE_TYPE			=	3;
var AIM_TYPE			=	4;
var CONTACTS_MAX		=	5;
var contactsInfo = {
	'contacts'			:	Array(CONTACTS_MAX),
	'dataList'			:	Array(CONTACTS_MAX),
	'lastModified'		:	Array(CONTACTS_MAX),
	'updateFlag'		:	Array(CONTACTS_MAX),
	'requestHttp'		:	Array(CONTACTS_MAX),
	'validIm'			:	Array(CONTACTS_MAX),
};
var URL_PARSE_CGI		= '/cgi-bin/contacts.cgi';
var contactsUrl = new Array(
	URL_PARSE_CGI + '?' + AVATARS_TYPE,
	URL_PARSE_CGI + '?' + SKYPE_TYPE,
	URL_PARSE_CGI + '?' + YAHOO_TYPE,
	URL_PARSE_CGI + '?' + GOOGLE_TYPE,
	URL_PARSE_CGI + '?' + AIM_TYPE
);
var timerType = {
	'ONTIMER_IDLE'		 	: 0,
	'ONTIMER_FORGROUND' 	: 1,
	'ONTIMER_BACKGROUND' 	: 2,
};
var updateContactsInfo = {
 	'requestCnt'			: 0,									
 	'completeCnt'			: 0,									
 	'startIndex'			: SKYPE_TYPE,							
 	'currentRequest'		: SKYPE_TYPE,							
  	'currentTimerType'		: timerType.ONTIMER_IDLE,				
};
var APP_ID = [ '', 'SKYPE', 'YAHOO', 'GTALK', 'AIM'];
var UPDATE_WAITING = 0;
var UPDATE_COMPLETE = 1;
var UPDATE_NO_CHANGE = 2;
var UPDATE_FAIL = 3;
var DEBUG_LOG			= false;	
var isInFocus = false;
var openContactsDate = null;
var NEXT_BT_NAME = 'nextBt';
var PREV_BT_NAME = 'prevBt';
var ENABLE_PREV_BT = 'img/bt_left_normal.png';
var DISABLE_PREV_BT = 'img/bt_left_disable.png';
var PRESSED_PREV_BT = 'img/bt_left_push.png';
var ENABLE_NEXT_BT = 'img/bt_right_normal.png';
var DISABLE_NEXT_BT = 'img/bt_right_disable.png';
var PRESSED_NEXT_BT = 'img/bt_right_push.png';
var AVATAR_IMG_PREFIX = '/MyContacts/setting/images/';
var PREFERENCE_INTERVAL = 'duration';
var UPDATE_INTERVAL_LIST = {
	'1 min' : 60000,
	'5 min' : 300000,
	'10 min': 600000
};
var PREFERENCE_ITEM_SKYPE 	= 'Skype';
var PREFERENCE_ITEM_YAHOO 	= 'Yahoo';
var PREFERENCE_ITEM_GOOGLE 	= 'Google';
var PREFERENCE_ITEM_AIM 	= 'AIM';
var SELECTED_AVATAR = 'hoverimgLink';
var NORMAL_AVATAR = 'imgLink';
var SELECTED_CONTACT = 'friendSelected';
var NORMAL_CONTACT = 'friendNormal';
var SELECTED_CONTACT_TEXT = 'friendSelectedTxt';
var NORMAL_CONTACT_TEXT = 'friendNormalTxt';
var STATUS_AVAILABLE = 'Available';
var STATUS_OFFLINE = 'Offline';
var STATUS_UNSUBSCRIBE = 'Unsubscribe';
var STATUS_OFFLINEVOICEMAIL = 'OfflineVoicemail';
var AVATAR_PER_PAGE = 15;
var AVATAR_PER_ROW = 3;
var AVATAR_LIST_MODE = 1;
var CONTACT_LIST_MODE = 2;
var widgetMode = AVATAR_LIST_MODE;
var totalAvatar = 0;
var totalPage = 6;
var currentPage = 1;
var currentIndex = 0;
var maxPageMode = 3;
var pageMode = 1;
var contactIndex = 0;
var totalContact = 0;
var prefObject = null;
var extension = new Extension();
var foreTimerId = -1;
var BackTimerId = -1;
var checkInterval = 60000;
var getPreferenceObject = function() {
	openConfig();
	return null;
};
var saveCallback = function() {};
var changePreference = function( prefObject, changeFlag ) {
	if( changeFlag == true ) {
		extension.saveFile( Extension.fileType.CONFIG, saveCallback, prefObject.save() );
		prefCallback();
	}
	return;
};
var getPreferenceResource = function(_itemName) {
	var _value = null;
	if(prefObject && _itemName){
		_value = prefObject.getValueByName(_itemName);
		if(_value == 'off'){
			_value = false;
		}
		else if(_value == 'on'){
			_value = true;
		}
	}
	return(_value);
}
var updatePreferenceResource = function() {
	if(prefObject){
		contactsInfo.validIm[AVATARS_TYPE] 	= true;
		contactsInfo.validIm[SKYPE_TYPE] 	= getPreferenceResource(PREFERENCE_ITEM_SKYPE);
		contactsInfo.validIm[YAHOO_TYPE] 	= getPreferenceResource(PREFERENCE_ITEM_YAHOO);
		contactsInfo.validIm[GOOGLE_TYPE] 	= getPreferenceResource(PREFERENCE_ITEM_GOOGLE);
		contactsInfo.validIm[AIM_TYPE] 		= getPreferenceResource(PREFERENCE_ITEM_AIM);
	}
};
var prefCallback = function() {
	updatePreferenceResource();
	if(typeof(notifyReadyWidget) == 'function'){
		notifyReadyWidget();
	}
	return prefObject;
};
var isOnline = function( status ) {
	if(getNetworkStatus()){
		if( status == STATUS_OFFLINE || status == STATUS_UNSUBSCRIBE ||  status == STATUS_OFFLINEVOICEMAIL) {
			return false;
		} else {
			return true;
		}
	}
	else{
		return false;
	}
};
var	onClickCell	= function( item ) {
	var _x = window.event.clientX;
	var _y = window.event.clientY;
	if(_x != 0 && _y != 0){
		highlightIt(item);
	}
}
var	highlightIt	= function( item ) {
	if( widgetMode == CONTACT_LIST_MODE ) {
		return;
	}
	var _id = item.id;
	var _id_parts = _id.split( '_' );
	if( _id_parts.length == 2 ) {
		var _index = ( _id_parts[1] - 0 );
		if( currentIndex != _index ) {
			highlight( _index );
		}
		var _avatar = pageMode * AVATAR_PER_PAGE * ( currentPage - 1 ) + currentIndex;
		selectAvatar( _avatar );
	}
};
var highlight = function( index ) {
	var _currentItemId = CELL_PREFIX + '_' + currentIndex;
	var _currentImgId = IMG_PREFIX + '_' + currentIndex;
	var _current = document.getElementById( _currentItemId );
	var _currentImg = document.getElementById( _currentImgId );
	var _newItemId = CELL_PREFIX + '_' + index;
	var _newImgId = IMG_PREFIX + '_' + index;
	var _newItem = document.getElementById( _newItemId );
	var _newImg = document.getElementById( _newImgId );
	if( _currentImg ) {
		_currentImg.className = NORMAL_AVATAR;
	}
	if( _newImg ) {
		_newImg.className = SELECTED_AVATAR;
	}
	if( index >= 0 ) {
		currentIndex = index;
	}
};
var selectLeftItem = function() {
	if( currentIndex % AVATAR_PER_ROW == 0 ) {
		if( currentIndex < AVATAR_PER_PAGE ) {
			if( currentPage > 1 ) {
				--currentPage;
				highlight(currentIndex + ( pageMode - 1 ) * AVATAR_PER_PAGE + ( AVATAR_PER_ROW - 1 ));
				updateAvatarList();
			}
		} else {
			highlight( currentIndex - AVATAR_PER_PAGE + ( AVATAR_PER_ROW - 1 ) );
		}
	} else {
		highlight( currentIndex - 1 );
	}
};
var selectRightItem = function() {
	if( currentIndex % AVATAR_PER_ROW == AVATAR_PER_ROW - 1 ) {
		if( currentIndex > ( pageMode - 1 ) * AVATAR_PER_PAGE ) {
			if( currentPage < totalPage ) {
				++currentPage;
				highlight(currentIndex - ( pageMode - 1 ) * AVATAR_PER_PAGE - ( AVATAR_PER_ROW - 1 ));
				updateAvatarList();
			}
		} else {
			highlight( currentIndex + AVATAR_PER_PAGE - ( AVATAR_PER_ROW - 1 ) );
		}
	} else {
		highlight( currentIndex + 1 );
	}
};
var selectUpItem = function() {
	if( ( currentIndex % AVATAR_PER_PAGE ) >= AVATAR_PER_ROW ) {
		highlight( currentIndex - AVATAR_PER_ROW );
	}
};
var	selectDownItem = function() {
	if( ( currentIndex % AVATAR_PER_PAGE ) + AVATAR_PER_ROW < AVATAR_PER_PAGE ) {
		highlight( currentIndex + AVATAR_PER_ROW );
	}
};
var selectCurrentAvatar = function() {
	var _id = CELL_PREFIX + '_' + currentIndex;
	var _cell = document.getElementById( _id );
	if( _cell ) {
		highlightIt( _cell );
	}
};
var changePageMode = function( mode ) {
	var _absIndex = ( currentPage - 1) * pageMode * AVATAR_PER_PAGE + currentIndex;
	currentPage = ( _absIndex - ( _absIndex % ( mode * AVATAR_PER_PAGE ) ) ) / ( mode * AVATAR_PER_PAGE );
	highlight(_absIndex - currentPage * mode * AVATAR_PER_PAGE);
	++currentPage;
	if( mode < pageMode ) {
		for( var _i = pageMode; _i > mode; --_i ) {
			var _p = document.getElementById( PAGE_PREFIX + '_' + _i.toString() );
			if( _p ) {
				_p.style.display = 'none';
			}
		}
	} else if( pageMode < mode ) {
		for( var _i = mode; _i > pageMode; --_i ) {
			var _p = document.getElementById( PAGE_PREFIX + '_' + _i.toString() );
			if( _p ) {
				_p.style.display = 'block';
			}
		}
	}
	var _len = PAGE_ELEM_NAMES.length;
	for( var _i = _len - 1; _i >= 0; --_i ) {
		var _name = PAGE_ELEM_NAMES[_i];
		var _item = document.getElementById( _name );
		if( _item ) {
			_item.className = _name + mode.toString();
		}
	}
	pageMode = mode;
};
var initCurSel = function() {
	currentIndex = 0;
};
var gotoPrevPage = function() {
	if( currentPage > 1 ) {
		--currentPage;
	}
	updateAvatarList();
};
var downPrevBt = function() {
	if(widgetMode != AVATAR_LIST_MODE){
		return;
	}
	if( currentPage > 1 ) {
		var _bt = document.getElementById( PREV_BT_NAME );
		_bt.src = PRESSED_PREV_BT;
	}
};
var gotoNextPage = function() {
	if(widgetMode != AVATAR_LIST_MODE){
		return;
	}
	if( currentPage < totalPage ) {
		++currentPage;
	}
	updateAvatarList();
};
var downNextBt = function() {
	if( currentPage < totalPage ) {
		var _bt = document.getElementById( NEXT_BT_NAME );
		_bt.src = PRESSED_NEXT_BT;
	}
};
var getAvatarImage = function( index ) {
	var _avatar = contactsInfo.contacts[AVATARS_TYPE][index];
	if( _avatar == null ) {
		return null;
	}
	if( _avatar.status == STATUS_AVAILABLE ) {
		return AVATAR_IMG_PREFIX + _avatar.on;
	} else {
		return AVATAR_IMG_PREFIX + _avatar.off;
	}
};
var updateAvatarList = function() {
	try {
		widgetLogLevelLow( 'MyContacts Widget', 'updateAvatarList' );
		updatePageDisplay();
		for( var _i = 0; _i < pageMode * AVATAR_PER_PAGE; ++_i ) {
			var _index = ( currentPage - 1 ) * pageMode * AVATAR_PER_PAGE + _i;
			var _cellId = CELL_PREFIX + '_' + _i.toString();
			var _cell = document.getElementById( _cellId );
			var _img = getAvatarImage( _index );
			if(_cell){
				var _curImg = document.getElementById( 'img_' + _i.toString() );
				if(_curImg){
					var _className = 'imgLink';
					if(_img == null){
						_img = 'img/spa.gif';
						_className = 'noLink';
					}
					if(openContactsDate == null){
						if(-1 == _curImg.src.lastIndexOf(_img)) {
							_curImg.src = _img;
							_curImg.srcString = _img;
						}
					}
					else					{
						if(_img == 'img/spa.gif'){
							if(-1 == _curImg.src.lastIndexOf(_img)) {
								_curImg.src = _img;
								_curImg.srcString = _img;
							}
						}
						else{
							var _dateString = openContactsDate.toString();
							var _srcString =  _img + '?' + _dateString;
							if(typeof(_curImg.srcString) == 'string'){
								if(-1 == _curImg.srcString.lastIndexOf(_srcString) ) {
									_curImg.src = _srcString;
									_curImg.srcString = _srcString;
								}
							}
							else{
								_curImg.src = _srcString;
								_curImg.srcString = _srcString;
							}
						}
					}
					if(_curImg.className != 'imgLink'){
						_curImg.className = 'imgLink';
					}
					if(_curImg.id != 'img_' + _i.toString()){
						_curImg.id= 'img_' + _i.toString();
					}
				}
			}
		}
		if(isInFocus){
			highlight( currentIndex );
		}
		else{
			highlight( -1 );
		}
	}
	catch(e){
		debugAlert('Error updateAvatarList:' + e);
	}
};
var updatePageDisplay = function() {
	widgetLogLevelLow( 'MyContacts Widget', 'updatePageDisplay' );
	document.getElementById( CURRENT_PAGE_NAME ).innerHTML = currentPage;
	document.getElementById( TOTAL_PAGE_NAME ).innerHTML = totalPage;
	if( currentPage > 1 ) {
		document.getElementById( PREV_BT_NAME ).src = ENABLE_PREV_BT;
	} else {
		document.getElementById( PREV_BT_NAME ).src = DISABLE_PREV_BT;
	}
	if( currentPage < totalPage ) {
		document.getElementById( NEXT_BT_NAME ).src = ENABLE_NEXT_BT;
	} else {
		document.getElementById( NEXT_BT_NAME ).src = DISABLE_NEXT_BT;
	}
};
var selectContact = function( item ) {
	var _id = item.id;
	var _id_parts = _id.split( '_' );
	if( _id_parts.length == 2 ) {
		var _index = ( _id_parts[1] - 0 );
		if( _index == contactIndex ) {
			var _c = contacts[_index];
			if( isOnline( _c.status ) ) {
				hideContactList();
				extension.openIM( APP_ID[_c.type], _c.id );
			}
		} else {
			contactIndex = _index;
			updateContactList();
		}
	}
};
var moveUp = function() {
	if( contactIndex > 0 ) {
		--contactIndex;
	}
	updateContactList();
};
var moveDown = function() {
	if( contactIndex < totalContact - 1 ) {
		++contactIndex;
	}
	updateContactList();
};
var selectCurrentContact = function() {
	var _id = CONTACT_PREFIX + '_' + contactIndex;
	var _contact = document.getElementById( _id );
	if( _contact ) {
		selectContact( _contact );
	}
};
var updateContactList = function() {
	debugLogDateTime('### updateContactList START');
	var _visibleContactNum = 0;
	for( var _i = 0; _i < MAX_CONTACT_LIST; ++_i ) {
		var _id = CONTACT_PREFIX + '_' + _i.toString();
		var _item = document.getElementById( _id );
		var _itemViewId = CONTACT_ITEM_VIEW_PREFIX + '_' + _i.toString();
		var _itemView = document.getElementById( _itemViewId );
		if( _i >= contacts.length ) {
			if(_itemView.style.display != 'none'){
				_itemView.style.display = 'none';
			}
			continue;
		}
		if(_itemView.style.display != 'block'){
			_itemView.style.display = 'block';
		}
		_visibleContactNum++;
		var _newClassName = "";
		if( _i == contactIndex ) {
			_newClassName = SELECTED_CONTACT;
		} else {
			_newClassName = NORMAL_CONTACT;
		}
		if(_item.className != _newClassName ){
			_item.className = _newClassName;
		}
		var _info = contacts[_i];
		var _idTxt = CONTACT_NAME_PREFIX + '_' + _i.toString();
		var _txt = document.getElementById( _idTxt );
		if( _txt ) {
			var _newContactName = "";
			var _newClassName = "";
			if( _info.name.length > MAX_CONTACT_NAME ) {
				_newContactName = _info.name.substr( 0, MAX_CONTACT_NAME );
			} else {
				_newContactName = _info.name;
			}
			if(_txt.innerHTML != _newContactName){
				_txt.innerHTML = _newContactName;
			}
			if( _i == contactIndex ) {
				_txt.className = SELECTED_CONTACT_TEXT;
			} else {
				_txt.className = NORMAL_CONTACT_TEXT;
			}
		}
		var _idImg = CONTACT_IMG_PREFIX + '_' + _i.toString();
		var _img = document.getElementById( _idImg );
		if( _img ) {
			var _imName = '';
			switch( _info.type ) {
			case SKYPE_TYPE:
				_imName = 'Skype';
				break;
			case YAHOO_TYPE:
				_imName = 'Yahoo';
				break;
			case GOOGLE_TYPE:
				_imName = 'Google';
				break;
			case AIM_TYPE:
				_imName = 'AIM';
				break;
			}
			if( _imName) {
				var _imgPath = '/MyContacts/icon/' + _imName + '/' + _info.status + '.png';
				if( (typeof(_img.src) == 'undefined') ||
					((typeof(_img.src) != 'undefined') && (-1 == _img.src.lastIndexOf(_imgPath))) ) {
					_img.src = _imgPath;
				}
			}
		}
	}
	updateContactListLocation(_visibleContactNum);
	debugLogDateTime('### updateContactList END');
};
var updateContactListLocation = function(contactListNum) {
	var _view = document.getElementById( CONTACT_BASE_VIEW_NAME );
	if(_view){
		_view.className = CONTACT_BASE_VIEW_NAME + contactListNum.toString();
	}
}
var selectAvatar = function( index ) {
	if( contactsInfo.contacts[AVATARS_TYPE][index] != null &&
		 contactsInfo.contacts[AVATARS_TYPE][index].status == STATUS_AVAILABLE &&
		 widgetMode == AVATAR_LIST_MODE ) {
		 widgetMode = CONTACT_LIST_MODE;
		getContactList( index );
		var _item = document.getElementById( CONTACT_LIST_NAME );
		var _page = ( index - ( index % AVATAR_PER_PAGE ) ) / AVATAR_PER_PAGE + 1;
		_page = ((_page -1) % pageMode) +1;
		_item.className = CONTACT_LIST_NAME + _page;
		var _title = document.getElementById( CONTACT_TITLE_NAME );
		if( _title ) {
			_title.innerHTML = contactsInfo.contacts[AVATARS_TYPE][index].name;
		}
		_item.style.display = 'block';
	}
};
var hideContactList = function() {
	var _item = document.getElementById( CONTACT_LIST_NAME );
	_item.style.display = 'none';
	widgetMode = AVATAR_LIST_MODE;
};
var initialize = function() {
	widgetLogEnable();
	currentIndex = -1;
	currentPage = 1;
	contactsInfo.contacts[AVATARS_TYPE] = new Array( MAX_AVATAR_LIST );
	for(var _i = 0; _i < CONTACTS_MAX; _i++){
		contactsInfo.validIm[_i] = true;
	}
	initializeCell();
	document.getElementById( TITLE_ID ).innerText = TITLE_STRING;
	onChangeAvatarList();
	setTimer();
	prefObject = new Preferences( prefCallback );
};
var initializeCell = function() {
	for( var _i = 0; _i < maxPageMode * AVATAR_PER_PAGE; _i++ ) {
		var _cellId = CELL_PREFIX + '_' + _i.toString();
		var _cell = document.getElementById( _cellId );
		if(_cell != null){
			var _displayPage = ( _i - ( _i % AVATAR_PER_PAGE ) ) / AVATAR_PER_PAGE + 1;
			_displayPage = ((_displayPage -1) % maxPageMode) +1;
			var _row = ((_i - (_i % AVATAR_PER_ROW)) / AVATAR_PER_ROW) % (AVATAR_PER_PAGE / AVATAR_PER_ROW);
			var _col = _i % AVATAR_PER_ROW;
			_cell.style.left = _col * WIDTH_CELL_DIV;
			_cell.style.top = _row * HEIGHT_CELL_DIV;
		}
	}
};
var onForegroundTimer = function() {
	widgetLogLevelLow( 'MyContacts Widget', 'onForegroundTimer' );
	var _skipTimer = checkTimerSkip();
	if(!_skipTimer){
 		updateContactsInfo.currentTimerType = timerType.ONTIMER_FORGROUND;
		updateAvatars();
	}
}
var onBackgroundTimer = function() {
	widgetLogLevelLow( 'MyContacts Widget', 'onBackgroundTimer' );
	var _skipTimer = checkTimerSkip();
	if(!_skipTimer){
 	 	updateContactsInfo.currentTimerType = timerType.ONTIMER_BACKGROUND;
		updateAvatars();
	}
}
var checkTimerSkip = function() {
	var _isNeedSkip = false;
	if(false == isScreenModeActive()){
		_isNeedSkip = true;
	}
	if(isInFocus){
		_isNeedSkip = true;
	}
	if(updateContactsInfo.currentTimerType != timerType.ONTIMER_IDLE){
		_isNeedSkip = true;
	}
	if( widgetMode == CONTACT_LIST_MODE ){
		_isNeedSkip = true;
	}
	return(_isNeedSkip);
}
var updateAvatars = function() {
	try {
		widgetLogLevelLow( 'MyContacts Widget', 'updateAvatars' );
		for(var _j = 0; _j < CONTACTS_MAX; _j++){
			contactsInfo.updateFlag[_j] 	= UPDATE_WAITING;
		}
		updateContactsInfo.requestCnt 		= 0;
		updateContactsInfo.completeCnt 		= 0;
		updateContactsInfo.currentRequest 	= updateContactsInfo.startIndex;
		contactsInfo.requestHttp[AVATARS_TYPE] = 
					sendRequestHttp(contactsUrl[AVATARS_TYPE],
									contactsInfo.lastModified[AVATARS_TYPE],
									avatarsCallback);	
	}
	catch(e){
		debugAlert('Error updateContacts:' + e);
	}
};
var updateContacts = function() {
	try {
		widgetLogLevelLow( 'MyContacts Widget', 'updateContacts' );
		contactsInfo.updateFlag[AVATARS_TYPE] 	= UPDATE_COMPLETE;
		for(var _i = AVATARS_TYPE + 1; _i < CONTACTS_MAX; _i++){
			contactsInfo.updateFlag[_i] 	= UPDATE_WAITING;
		}
		updateContactsInfo.requestCnt 		= 0;
		updateContactsInfo.completeCnt 		= 0;
		updateContactsInfo.currentRequest 	= updateContactsInfo.startIndex;
		if(getNetworkStatus()){
			sendUpdateContactsNextRequestHttp();
		}
		else{
			for(var _j = AVATARS_TYPE + 1; _j < CONTACTS_MAX; _j++){
				contactsInfo.updateFlag[_j] = UPDATE_COMPLETE;
			}
			updateContactsFinished();
		}
	}
	catch(e){
		debugAlert('Error updateContacts:' + e);
	}
};
var avatarsCallback = function( flag, request ) {
	try {
		widgetLogLevelLow( 'MyContacts Widget', 'avatarsCallback' );
		var _completed =_completed = onLoadAvatars(flag, request);
		if(_completed){
			for(var _j = AVATARS_TYPE + 1; _j < CONTACTS_MAX; _j++){
				contactsInfo.lastModified[_j] = undefined;
			}
		}
		if(getNetworkStatus()){
			sendUpdateContactsNextRequestHttp();
		}
		else{
			for(var _j = AVATARS_TYPE + 1; _j < CONTACTS_MAX; _j++){
				contactsInfo.updateFlag[_j] = UPDATE_COMPLETE;
			}
			updateContactsFinished();
		}
	}
	catch(e){
		debugAlert('Error avatarsCallback:' + e);
	}
};
var updateContactsCallback = function( flag, request ) {
	try {
		debugLogDateTime('### ++++++ updateContactsCallback currentRequest:'  + updateContactsInfo.currentRequest);
		var _completed = false;
		_completed = onLoadCommonContactsCallback(flag, request);
		updateContactsInfo.requestCnt++;
		if(_completed){
			updateContactsInfo.completeCnt++;
		}
		updateContactsInfo.currentRequest++;
		if(updateContactsInfo.currentRequest >= CONTACTS_MAX){
			updateContactsFinished();
		}
		else{
			sendUpdateContactsNextRequestHttp();
		}
	}
	catch(e){
		debugAlert('Error updateContactsCallback:' + e);
	}
};
var updateContactsFinished = function(  ) {
	try {
		for(var _j = 0; _j < CONTACTS_MAX; _j++){
			if(contactsInfo.updateFlag[_j] == UPDATE_WAITING){
				contactsInfo.dataList[_j] 		= contactsInfo.contacts[_j];
				contactsInfo.updateFlag[_j] 	= UPDATE_NO_CHANGE;
			}
		}
		updateAvatarStatus();
		updateContactsInfo.currentTimerType = timerType.ONTIMER_IDLE;
	}
	catch(e){
		debugAlert('Error updateContactsFinished:' + e);
	}
};
var sendRequestHttp = function( url, lastModified, callback ) {
	var _r = null;
	try {
		widgetLogLevelLow( 'MyContacts Widget', 'sendRequestHttp' );
		_r = new RequestHttp();
		if(_r != null){
			_r.open( 'GET', url, callback );
			if( lastModified ) {
				_r.setRequestHeader( 'If-Modified-Since', lastModified );
			}
			_r.send( '' );
		}
	}
	catch(e){
		debugAlert('Error sendRequestHttp:' + e);
	}
	return(_r);
};
var sendUpdateContactsNextRequestHttp = function () {
	try {
		while(1){
			var _current = updateContactsInfo.currentRequest;
			if(contactsInfo.validIm[_current] == false){
				contactsInfo.updateFlag[_current] = UPDATE_COMPLETE;
				updateContactsInfo.requestCnt++;
				updateContactsInfo.completeCnt++;
				updateContactsInfo.currentRequest++;
			}
			else{
				contactsInfo.requestHttp[_current] = sendRequestHttp(	contactsUrl[_current],
																		contactsInfo.lastModified[_current], 
																		updateContactsCallback);
				break;
			}
			if(updateContactsInfo.currentRequest >= CONTACTS_MAX -1){
				updateContactsFinished();
				break;
			}
		};
	}
	catch(e){
		debugAlert('Error sendUpdateContactsNextRequestHttp:' + e);
	}
}
var updateAvatarStatus = function() {
	try {
		if( contactsInfo.updateFlag[AVATARS_TYPE] 	> UPDATE_WAITING &&
			 contactsInfo.updateFlag[SKYPE_TYPE] 	> UPDATE_WAITING &&
			 contactsInfo.updateFlag[YAHOO_TYPE] 	> UPDATE_WAITING &&
			 contactsInfo.updateFlag[GOOGLE_TYPE] 	> UPDATE_WAITING &&
			 contactsInfo.updateFlag[AIM_TYPE] 	> UPDATE_WAITING ) {
			if( contactsInfo.updateFlag[AVATARS_TYPE] != UPDATE_NO_CHANGE ||
				 contactsInfo.updateFlag[SKYPE_TYPE] != UPDATE_NO_CHANGE ||
				 contactsInfo.updateFlag[YAHOO_TYPE] != UPDATE_NO_CHANGE ||
				 contactsInfo.updateFlag[GOOGLE_TYPE] != UPDATE_NO_CHANGE ||
				 contactsInfo.updateFlag[AIM_TYPE] != UPDATE_NO_CHANGE ) {
				debugLogDateTime('### updateAvatarStatus START');
				for(var _j = 0; _j < CONTACTS_MAX; _j++){
					contactsInfo.updateFlag[_j] = UPDATE_WAITING;
				}
				for( var _i = contactsInfo.dataList[AVATARS_TYPE].length - 1; _i >= 0; --_i ) {
					var _avatar = contactsInfo.dataList[AVATARS_TYPE][_i];
					if( _avatar == null ) {
						contactsInfo.contacts[AVATARS_TYPE][_i] = null;
						continue;
					}
					if( _avatar.on == '' || _avatar.off == '' || _avatar.members.length == 0 ) {
						contactsInfo.contacts[AVATARS_TYPE][_i] = null;
						continue;
					}
					var _members = _avatar.members;
					var _status = STATUS_OFFLINE;
					for( var _j = _members.length - 1; _j >= 0; --_j ) {
						var _m = _members[_j];
						var _data = Array();
						var _target = getContactData( _m.type, _m.id );
						if( _target != null && isOnline( _target.status ) ) {
							_status = STATUS_AVAILABLE;
							break;
						}
					}
					var _tmp = {};
					_tmp.name = _avatar.name;
					_tmp.on = _avatar.on;
					_tmp.off = _avatar.off;
					_tmp.members = _avatar.members;
					_tmp.status	= _status;
					contactsInfo.contacts[AVATARS_TYPE][_i] = _tmp;
				}
				contactsInfo.dataList[AVATARS_TYPE] = null;
				for(var _j = AVATARS_TYPE+1; _j < CONTACTS_MAX; _j++){
					contactsInfo.contacts[_j] = contactsInfo.dataList[_j];
					contactsInfo.dataList[_j] = null;
				}
				onChangeAvatarList();
				debugLogDateTime('### updateAvatarStatus END');
			}
		}
	}
	catch(e){
		debugAlert('Error updateAvatarStatus:' + e);
	}
};
var getResponseLastModified = function( request ) {
	var _lastModified;
	if( request.getAllResponseHeaders().match( 'Last-Modified' ) ) {
		_lastModified = request.getResponseHeader( 'Last-Modified' );
	}
	return(_lastModified);
};
var onLoadAvatars = function( flag, request ) {
	try {
		if( request.status == 200 || request.status == 304 ) {
			widgetLogLevelLow( 'MyContacts Widget', 'onLoadAvatars' );
			var _lastModified = getResponseLastModified(request);
			var _text = null;
			_text = request.responseText;
			if( _text == null ||
			 	request.status == 304 ) {
				debugLogDateTime('+++ onLoadAvatars status:304');
				contactsInfo.dataList[AVATARS_TYPE] = contactsInfo.contacts[AVATARS_TYPE];
				contactsInfo.updateFlag[AVATARS_TYPE] = UPDATE_NO_CHANGE;
			} else {
				contactsInfo.dataList[AVATARS_TYPE] = Array( MAX_AVATAR_LIST );
				var _tempArray = eval('(' + _text +  ')');
				if(_tempArray != null && _tempArray.length == MAX_AVATAR_LIST){
					for(var _i = 0; _i < MAX_AVATAR_LIST; _i++ ){
						contactsInfo.dataList[AVATARS_TYPE][_i] = _tempArray[(_i + 1)];
					}
					contactsInfo.updateFlag[AVATARS_TYPE] = UPDATE_COMPLETE;
				}
				else{
					contactsInfo.dataList[AVATARS_TYPE] = contactsInfo.contacts[AVATARS_TYPE];
					contactsInfo.updateFlag[AVATARS_TYPE] = UPDATE_NO_CHANGE;
				}
			}
			if(typeof(_lastModified) != 'undefined'){
				contactsInfo.lastModified[AVATARS_TYPE] = _lastModified;
			}
		}
		else {
			contactsInfo.dataList[AVATARS_TYPE] = Array( MAX_AVATAR_LIST );
			contactsInfo.updateFlag[AVATARS_TYPE] = UPDATE_FAIL;
		}
		contactsInfo.requestHttp[AVATARS_TYPE] = null;
		updateAvatarStatus();
		return(contactsInfo.updateFlag[AVATARS_TYPE] != UPDATE_NO_CHANGE);
	}
	catch(e){
		debugAlert('Error onLoadAvatars:' + e);
		return(false);
	}
};
var onLoadCommonContactsCallback = function( flag, request ) {
	try {
		if( request.status == 200 || request.status == 304 ) {
			var _lastModified = getResponseLastModified(request);
			var _text = request.responseText;
			if( _text == null ||
		 		request.status == 304 ) {
				contactsInfo.dataList[updateContactsInfo.currentRequest] = contactsInfo.contacts[updateContactsInfo.currentRequest];
				contactsInfo.updateFlag[updateContactsInfo.currentRequest] = UPDATE_NO_CHANGE;
			} else {
				contactsInfo.dataList[updateContactsInfo.currentRequest] = eval('(' + _text +  ')');
				contactsInfo.updateFlag[updateContactsInfo.currentRequest] = UPDATE_COMPLETE;
			}
			if(typeof(_lastModified) != 'undefined'){
				contactsInfo.lastModified[updateContactsInfo.currentRequest] = _lastModified;
			}
		}
		else {
			contactsInfo.dataList[updateContactsInfo.currentRequest] = Array();
			contactsInfo.updateFlag[updateContactsInfo.currentRequest] = UPDATE_FAIL;
		}
		contactsInfo.requestHttp[updateContactsInfo.currentRequest] = null;
		updateAvatarStatus();
		return(contactsInfo.updateFlag[updateContactsInfo.currentRequest] != UPDATE_NO_CHANGE);
	}
	catch(e){
		debugAlert('Error onLoadCommonContactsCallback:' + e);
		return(false);
	}
};
var openContactsDate = null;
var openConfig = function() {
	if( widgetMode == AVATAR_LIST_MODE ) {
		openContactsDate = new Date();
		extension.openContacts();
	}
};
var getNetworkStatus = function() {
	return mylo.System.getNetworkStatus();
};
var isScreenModeActive = function() {
	if(mylo.constant.SCREEN_MODE_ACTIVE == mylo.System.getScreenMode()){
		return(true);
	}
	return(false);
};
var	widgetKeyDown = function( evt, key ) {
	if( widgetMode == AVATAR_LIST_MODE ) {
		switch( key ) {
		case mylo.KeyCode.LEFT:
			selectLeftItem();
			return false;
		case mylo.KeyCode.UP:
			selectUpItem();
			return false;
		case mylo.KeyCode.RIGHT:
			selectRightItem();
			return false;
		case mylo.KeyCode.DOWN:
			selectDownItem();
			return false;
		case mylo.KeyCode.ENTER:
			selectCurrentAvatar();
			return false;
		case mylo.KeyCode.BACK:
			return true;
		}
	} else if( widgetMode == CONTACT_LIST_MODE ) {
		switch( key ) {
		case mylo.KeyCode.UP:
			moveUp();
			return false;
		case mylo.KeyCode.DOWN:
			moveDown();
			return false;
		case mylo.KeyCode.ENTER:
			selectCurrentContact();
			return false;
		case mylo.KeyCode.BACK:
			hideContactList();
			return false;
		}
	}
	return true;
};
var widgetKeyUp = function( evt, key ) {
};
var saveWindowWidth = 0;
var widgetResize = function() {
	if(saveWindowWidth == document.body.clientWidth){
		return;
	}
	var _w = document.body.clientWidth;
	saveWindowWidth = _w;
	if( _w < WIDTH_CRITERIA1 ) {
		changePageMode( 1 );
	} else if( _w < WIDTH_CRITERIA2 ) {
		changePageMode( 2 );
	} else {
		changePageMode( 3 );
	} 
	totalPage = ( totalAvatar - ( totalAvatar % ( pageMode * AVATAR_PER_PAGE ) ) ) / ( pageMode * AVATAR_PER_PAGE ) + 1;
	if( totalAvatar % ( pageMode * AVATAR_PER_PAGE ) == 0 ) {
		--totalPage;
	}
	updateAvatarList();
	updatePageDisplay();
};
var unsetTimer = function() {
	if( typeof(foreTimerId) != 'undefined' && foreTimerId  != -1) {
		clearInterval( foreTimerId );
		foreTimerId = -1;
	}
	if( typeof(backTimerId) != 'undefined' && backTimerId != -1) {
		clearBackgroundInterval( backTimerId );
		backTimerId = -1;
	}
};
var setTimer = function() {
	widgetLogLevelLow( 'MyContacts Widget', 'setTimer' );
	widgetLogLevelLow( 'MyContacts Widget', 'interval : ' + checkInterval );
	foreTimerId = setInterval( onForegroundTimer, checkInterval -10000 );
	backTimerId = setBackgroundInterval( onBackgroundTimer, 0);
};
var goBackground = function() {
	widgetLogLevelLow( 'MyContacts Widget', 'goBackground' );
};
var goForeground = function() {
	widgetLogLevelLow( 'MyContacts Widget', 'goForeground' );
	onForegroundTimer();
};
var goActive = function() {
	widgetLogLevelLow( 'MyContacts Widget', 'goActive' );
	openContactsDate = new Date();
	contactsInfo.lastModified[AVATARS_TYPE] = null;
	{
 		updateContactsInfo.currentTimerType = timerType.ONTIMER_FORGROUND;
		updateAvatars();
	}
}
var inFocus = function() {
	widgetLogLevelLow( 'MyContacts Widget', 'inFocus:' + isInFocus );
	isInFocus = true;
	if( currentIndex < 0 ) {
		initCurSel();
	}
	if(isScreenModeActive()){
		updateAvatarList();
	}
};
var outFocus = function() {
	hideContactList();
	highlight( -1 );
	isInFocus = false;
	widgetLogLevelLow( 'MyContacts Widget', 'outFocus:' + isInFocus );
};
var onChangeAvatarList = function() {
	try {
		debugLogDateTime('### onChangeAvatarList START');
		totalAvatar = contactsInfo.contacts[AVATARS_TYPE].length;
		updateAvatarList();
		widgetResize();
		debugLogDateTime('### onChangeAvatarList END');
	}
	catch(e){
		debugAlert('Error onChangeAvatarList' + e);
	}
};
var getContact = function( type, id ) {
	var _data = null;
	switch( type ) {
	case SKYPE_TYPE:
	case YAHOO_TYPE:
	case GOOGLE_TYPE:
	case AIM_TYPE:
		_data = contactsInfo.contacts[type];
		break;
	}
	var _target = null;
	if( _data != null ) {
		_target = _data[id];
		if(_target){
			_target.type = type;
			if(typeof(_target.name) == 'undefined'){
				_target.name = id;
			}
			if(typeof(_target.id) == 'undefined'){
				_target.id = id;
			}
			if(typeof(_target.status) == 'undefined'){
				_target.status = STATUS_OFFLINE;
			}
		}
	}
	if( _target == null ) {
		_target = {};
		_target.name = id;
		_target.id = id;
		_target.status = STATUS_OFFLINE;
		_target.type = type;
	}
	return _target;
};
var getContactData = function( type, id ) {
	var _target = null;
	var _data = contactsInfo.dataList[type];
	if( _data != null ) {
		_target = _data[id];
		if(_target){
			if(typeof(_target.type) == 'undefined'){
				_target.type = type;
			}
			if(typeof(_target.name) == 'undefined'){
				_target.name = id;
			}
			if(typeof(_target.id) == 'undefined'){
				_target.id = id;
			}
			if(typeof(_target.status) == 'undefined'){
				_target.status = STATUS_OFFLINE;
			}
		}
	}
	if( _target == null ) {
		_target = {};
		_target.name = id;
		_target.id = id;
		_target.status = STATUS_OFFLINE;
		_target.type = type;
	}
	return _target;
};
var getContactList = function( index ) {
	var _members = contactsInfo.contacts[AVATARS_TYPE][index].members;
	contacts = Array();
	totalContact = 0;
	for( var _i = _members.length - 1; _i >= 0; --_i ) {
		var _c = _members[_i];
		if( _c.id != '' ) {
			contacts.push( getContact( _c.type, _c.id ) );
			++totalContact;
		}
	}
	contactIndex = 0;
	updateContactList();
};
var debugLogDateTime = function(message) {
	if(DEBUG_LOG){
		var _now = new Date();
		var _timeStr = _now.getHours() + ":" + _now.getMinutes() + ":" + _now.getSeconds()  + '.' + (_now.getTime() % 1000);
		widgetLogLevelLow( '(' + _timeStr + ')' , message);
	}
};
var debugAlert = function(message) {
	widgetLogLevelLow( 'MyContacts Widget', message );
};
