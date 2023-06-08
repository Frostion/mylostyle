/*
 * Copyright 2007,2008 Sony Corporation
 */

RSSWidgetList.ENTRY = null;
LED_NEWARRIVAL = 'new_arrival';
LED_ENABLE = 'enable';
LED_DISABLE = 'disable';
var prefObject = null;
var extension = new Extension(5);
var content_list = null;
var updateButton = null;
var upButton = null;
var downButton = null;
var last_articles_num = null;
var openWebFlg = false;
var callOpenWeb = function(_url) {
	if(openWebFlg == false){
		openWebFlg = true;
		extension.openWeb(_url);
	}
};
var rssWidgetObject = {
	_this: this,
	feedTitle: '',
	feedUrl: '',
	lastUpdateTime: null,
	articles: null,
	notify: true,
	updateTimer: null,
	backgroundTimer:null,
	refreshButtonTimer:null,
	focused:false,
	initFileLoad:false,
	onPreferenceLoaded: function() {
		widgetLogLevelLow( 'RSS Widget','onPreferenceLoaded' );
		rssWidgetObject.feedTitle = prefObject.getValueByName('feed_name');
		document.getElementById( "FEED_TITLE" ).innerText = rssWidgetObject.feedTitle;
		notifyReadyWidget();
	},
	onPreferenceChanged: function() {
		try{
			widgetLogLevelLow( 'RSS Widget','onPreferenceChanged' );
			rssWidgetObject.feedTitle = prefObject.getValueByName('feed_name');
			if (document.getElementById( "FEED_TITLE" )){
				document.getElementById( "FEED_TITLE" ).innerText = rssWidgetObject.feedTitle;
			}
			if (rssWidgetObject.feedUrl !== prefObject.getValueByName('feed_url')){
				widgetLogLevelLow( 'RSS Widget','Cleaning Article List' );
				content_list.jumpTo(0);
				content_list.clearTable();
				clearLastUpdateDate();	
			} else {
				var marqueeFlag = true;
				if(prefObject.getValueByName('marquee') == 'on'){
					marqueeFlag = true;
				} else {
					marqueeFlag = false;
				}
				widgetLogLevelLow( 'RSS Widget','refreshMarquee' );
				refreshMarquee(marqueeFlag);			
			}
		} catch (e){
			widgetLogLevelLow( 'RSS Widget','onPreferenceChanged:'+e );
		}
	},
	registerFeed: function(_notifyCallback,_commandCallback) {
		widgetLogLevelLow( 'RSS Widget','registerFeed - URL:'+ rssWidgetObject.feedUrl);
		updateLastUpdateDate = function(){
			widgetLogLevelMiddle( 'RSS Widget','updateLastUpdateDate - No Action' );
		};
		var _command = extension.generateAppCmd( 'RSSA', 'ADD', rssWidgetObject.feedUrl );
		extension.sendCmd( _command, _commandCallback);
		extension.setNotify( 'RSSA', _notifyCallback );
	},
	registerFeedReqCallback: function() {
		widgetLogLevelMiddle( 'RSS Widget','registerFeedRequest sent' );
	},
	registerFeedReqCallbackDisable: function() {
		widgetLogLevelMiddle( 'RSS Widget','registerFeedRequest sent - Button Refresh Disable' );
		disableRefreshButton();
	},
	registerFeedRes: function( result ) {
		widgetLogLevelLow( 'RSS Widget','registerFeedRes - initFileLoad - clear ' );
		rssWidgetObject.initFileLoad = false;
		if( result == "1" || result == 'true' || result === true ) {
			widgetLogLevelLow( 'RSS Widget','registerFeed success!' );
		} else {
			widgetLogLevelLow( 'RSS Widget','registerFeed failed!' );
		}
		widgetLogLevelLow( 'RSS Widget','calling updateRequest' );
		rssWidgetObject.updateRequest.call( rssWidgetObject._this );
	},
	registerFeedResJSON: function( result ) {
		widgetLogLevelLow('RSS Widget','registerFeedResJSON - Initial Mode - set');
		rssWidgetObject.initFileLoad = true;
		if( result == "1" || result == 'true' || result === true ) {
			widgetLogLevelLow( 'RSS Widget','registerFeed success!' );
		} else {
			widgetLogLevelLow( 'RSS Widget','registerFeed failed!' );
		}
		widgetLogLevelLow( 'RSS Widget','calling openEntryListFile' );
		rssWidgetObject.openEntryListFile.call( rssWidgetObject._this );
	},
	unregisterFeed: function() {
		widgetLogLevelLow( 'RSS Widget','unregisterFeed - URL:'+ rssWidgetObject.feedUrl);
		var _command = extension.generateAppCmd( 'RSSA', 'DEL', rssWidgetObject.feedUrl );
		extension.sendCmd( _command, rssWidgetObject.unregisterFeedReqCallback );
		extension.setNotify( 'RSSA', rssWidgetObject.unregisterFeedRes );
	},
	unregisterFeedReqCallback: function() {
		widgetLogLevelMiddle( 'RSS Widget','unregisterFeedRequest sent' );
	},
	unregisterFeedRes: function( result ) {
		if( result == "1" || result == 'true' || result === true)
		{
			widgetLogLevelLow( 'RSS Widget','unregisterFeed success!' );
		}
		else
		{
			widgetLogLevelLow( 'RSS Widget','unregisterFeed failed!' );
		}
	},
	deleteFileRes: function() {
		widgetLogLevelMiddle( 'RSS Widget','deleteFileRequest sent' );
	},
	changeFeed : function(){
		widgetLogLevelLow( 'RSS Widget','Deleting Entry JSON File' );
		extension.deleteFile( 'entry.json', rssWidgetObject.deleteFileRes );
		widgetLogLevelLow( 'RSS Widget','Unregistering previous feed:'+ rssWidgetObject.feedUrl);
		var _command = extension.generateAppCmd( 'RSSA', 'DEL', rssWidgetObject.feedUrl );
		extension.sendCmd( _command, rssWidgetObject.unregisterFeedReqCallback );
		extension.setNotify( 'RSSA', rssWidgetObject.changeFeedRes );
	},
	changeFeedRes : function( result ){
		if( result == "1" || result == 'true' || result === true)
		{
			widgetLogLevelLow( 'RSS Widget','unregisterFeed success!' );
		}
		else
		{
			widgetLogLevelLow( 'RSS Widget','unregisterFeed failed!' );
		}
		rssWidgetObject.feedUrl = prefObject.getValueByName('feed_url');
		widgetLogLevelLow( 'RSS Widget','Registering new feed:'+ rssWidgetObject.feedUrl);
		var _onlyLog = function(result){
			if (result == "1" || result == 'true' || result === true) {
				widgetLogLevelLow('RSS Widget', 'registerFeed success!');
			} else {
				widgetLogLevelLow('RSS Widget', 'registerFeed failed!');
			}
		}
		rssWidgetObject.registerFeed.call( rssWidgetObject._this ,_onlyLog,rssWidgetObject.registerFeedReqCallback);
	},
	updateRequest: function() {
		widgetLogLevelLow( 'RSS Widget','update' );
		var _command = extension.generateAppCmd( 'RSSA', 'UPDATE', rssWidgetObject.feedUrl );
		extension.sendCmd( _command, rssWidgetObject.updateReqResponse );
		extension.setNotify( 'RSSA', rssWidgetObject.updateRes );
	},
	updateReqResponse: function() {
		widgetLogLevelMiddle( 'RSS Widget','updateRequest sent' );
	},
	updateRes: function( result ) {
		if( result == "1" || result == 'true' || result === true){
			widgetLogLevelLow( 'RSS Widget','update success!' );
			updateLastUpdateDate = _updateLastBhv;
			rssWidgetObject.getEntryList.call( rssWidgetObject._this );
		} else {
			widgetLogLevelLow( 'RSS Widget','update failed!' );
			enableRefreshButton();
		}
	},
	getEntryList: function() {
		widgetLogLevelLow( 'RSS Widget','getEntryList' );
		var _command = extension.generateAppCmd( 'RSSA', 'ENTRY', rssWidgetObject.feedUrl );
		extension.sendCmd( _command, rssWidgetObject.getEntryListReqCallback );
		extension.setNotify( 'RSSA', rssWidgetObject.getEntryListRes );
	},
	getEntryListReqCallback: function() {
		widgetLogLevelLow( 'RSS Widget','getEntryListRequest sent' );
	},
	getEntryListRes: function( _result ) {
		if( _result == "1" || _result == 'true' || _result === true) {
			widgetLogLevelLow( 'RSS Widget','get Entry List success!' );
			rssWidgetObject.openEntryListFile.call( rssWidgetObject._this );
		} else 	{
			widgetLogLevelLow( 'RSS Widget','get Entry List failed!' );
			enableRefreshButton();
		}
	},
	openEntryListFile: function() {
		widgetLogLevelLow( 'RSS Widget', 'openEntryListFile' );
		extension.readFile('dropbox/entry.json',rssWidgetObject.openEntryListFileCallback);
	},
	openEntryListFileCallback : function(status,response){
		if (status === true){
			rssWidgetObject.articles = eval('(' + response.responseText + ')');
			widgetLogLevelLow( 'RSS Widget', 'found ' + rssWidgetObject.articles.length + ' articles.' );
			rssWidgetObject.populateEntryList.call( rssWidgetObject._this );
		} 
		else {
			widgetLogLevelLow( 'RSS Widget', 'file not found' );
			widgetLogLevelLow( 'RSS Widget','openEntryListFileCallback - initFileLoad - clear ' );
			rssWidgetObject.initFileLoad = false;
		}
	},
	populateEntryList: function() {
		widgetLogLevelLow( 'RSS Widget', 'populateEntryList' );
		var _articles_num = rssWidgetObject.articles.length;
		if (last_articles_num == null){
			last_articles_num = _articles_num;
		}
		var _list_positions_num = content_list.nodeMatrix.length;
		var _new_Item = false;
		var _updateFlag = false;
		var marqueeFlag = true;
		if(prefObject.getValueByName('marquee') == 'on'){
			marqueeFlag = true;
		} else {
			marqueeFlag = false;
		}
		var selectedEntryId = null;
		var position = content_list.currentPosition;
		var entryMap = content_list.nodeMatrix[position];
		if (entryMap.get(RSSWidgetList.ENTRY)!== undefined && entryMap.get(RSSWidgetList.ENTRY)!==null){
			selectedEntryId = entryMap.get(RSSWidgetList.ENTRY).entryId;
			widgetLogLevelMiddle( 'RSS Widget', 'Selected Id:'+entryMap.get(RSSWidgetList.ENTRY).entryId );
			widgetLogLevelMiddle( 'RSS Widget', 'Selected Title:'+entryMap.get(RSSWidgetList.ENTRY).entryTitle );
		}
		if (_articles_num == _list_positions_num || (_articles_num < 6 && last_articles_num == _articles_num)){
			for (var _i=0;_i<_articles_num;_i++){
				var _listMap = content_list.nodeMatrix[_i]; 
				var _entryOnList = null;
				if (_listMap.get(RSSWidgetList.ENTRY)!==undefined && _listMap.get(RSSWidgetList.ENTRY)!==null){
					_entryOnList = _listMap.get(RSSWidgetList.ENTRY);
					var _arrivedEntry = rssWidgetObject.articles[_i];
					if (_arrivedEntry.entryId == _entryOnList.entryId && _arrivedEntry.entryTitle == _entryOnList.entryTitle){
						widgetLogLevelMiddle( 'RSS Widget', 'Dont change:'+_i );
						continue;
					} else {
						widgetLogLevelMiddle( 'RSS Widget', 'Change at:'+_i );
						_updateFlag = true;
						break;
					}
				} else {
					widgetLogLevelMiddle( 'RSS Widget', 'First Time' );
					_updateFlag = true;
					break;
				}
			}
		} else {
			widgetLogLevelMiddle( 'RSS Widget', 'Length is different' );
			_updateFlag = true;
		}
		var targetPos = null;
		if (_updateFlag === true){
			widgetLogLevelMiddle( 'RSS Widget', 'Making Update...' );
			if (_articles_num < 6 ) {
				content_list.clearTable();
				content_list.setVirtualRows(6);
			} else {
				content_list.setVirtualRows(_articles_num);
			}			
			for (var _y=0; _y<_articles_num; _y++){
				var _entry = rssWidgetObject.articles[_y];
				if (selectedEntryId !==null && (selectedEntryId === _entry.entryId)){
					targetPos = _y;
					widgetLogLevelMiddle( 'RSS Widget', 'Found position at '+_y + ' - Title:'+ _entry.entryTitle );
				}
				if (_entry.isNew === true || _entry.isNew == 'true'){
					_new_Item = true;
				}
				content_list.updateItemProperty(_y,RSSWidgetList.ENTRY,_entry);
				content_list.updateItem(_y, '<p class="entry_title" id="#A'+_y+'"><span id="#S'+_y+'">' + _entry.entryTitle + '</span></p>' + '<p class="entry_subtitle">' + getFormattedDate(_y) + '</p>' );
				refreshMarqueeAt(_y,marqueeFlag);
				if (_entry.cacheUrl !== undefined && _entry.cacheUrl !== null){
					widgetLogLevelMiddle( 'RSS Widget', 'Entry '+_y+ ' on cache' );
					content_list.updateItemProperty(_y, RSSWidgetList.SELECTED_URL, _entry.cacheUrl );
				} else {
					content_list.updateItemProperty(_y, RSSWidgetList.SELECTED_URL, _entry.entryLink );
				}
			}
			if (targetPos === null){
				content_list.jumpTo(0);
				refreshScrollBar();
				widgetLogLevelMiddle( 'RSS Widget', 'Change position to 0' );
			} else if (selectedEntryId !==null && targetPos !== selectedEntryId) {
				content_list.jumpTo(targetPos,content_list.scrollOffSet);
				refreshScrollBar();
				widgetLogLevelMiddle( 'RSS Widget', 'Change position to '+targetPos );
			} else {
				widgetLogLevelMiddle( 'RSS Widget', 'Dont Update Position...' );
			}
		} else {
			widgetLogLevelMiddle( 'RSS Widget', 'Dont Update...' );
		}
		updateLastUpdateDate();
		if (_new_Item ) {
			widgetLogLevelLow( 'RSS Widget', 'find new entry' );
		  	if ( rssWidgetObject.notify ){
				if (rssWidgetObject.initFileLoad == false) {
					newItemNotify();
				} 
			}
		}
		content_list.setDefaultClickBehavior( openUrl );
		content_list.enterKeyBehaviour = openUrl;
		enableRefreshButton();
		last_articles_num = _articles_num;
		widgetLogLevelLow('RSS Widget','populateEntryList - Initial Mode - clear');
		rssWidgetObject.initFileLoad = false;
	}
};
var getPreferenceObject = function() {
	return prefObject;
};
var getNetworkStatus = function() {
	var _status = mylo.System.getNetworkStatus();
	return(_status);
};
var onTimer = function() {
	widgetLogLevelLow( 'RSS Widget', 'Timer Event' );
	if (getNetworkStatus()){
		widgetLogLevelMiddle( 'RSS Widget','Connected - ForeGround Timer - Update (Register)' );
		rssWidgetObject.registerFeed.call( rssWidgetObject._this ,rssWidgetObject.registerFeedRes,rssWidgetObject.registerFeedReqCallbackDisable);
	} else {
		widgetLogLevelMiddle( 'RSS Widget','Not connected - NO OPERATION' );
	}
	_updateDate();
};
var onBackgroundTimer = function(){
	if (mylo.System.getGroundStatus() == mylo.constant.FORE_GROUND){
		widgetLogLevelLow( 'RSS Widget', 'Refresh Event' );
		widgetLogLevelMiddle( 'RSS Widget','Option Menu - Update (Register)' );
		rssWidgetObject.registerFeed.call( rssWidgetObject._this ,rssWidgetObject.registerFeedRes,rssWidgetObject.registerFeedReqCallbackDisable);
	} 
};
var enableRefreshButton = function(){
	if (updateButton.enableFlag == false){
		updateButton.enable();
		if (rssWidgetObject.refreshButtonTimer !== undefined && rssWidgetObject.refreshButtonTimer !== null) {
			clearTimeout(rssWidgetObject.refreshButtonTimer);
			rssWidgetObject.refreshButtonTimer = null;
		}
	}
};
var disableRefreshButton = function(){
	if (updateButton.enableFlag == true){
		updateButton.disable();
		rssWidgetObject.refreshButtonTimer = setTimeout( enableRefreshButton, 180000 );
	}
};
var changePreference = function( _preferenceObject, _updateFlag ) {
	if (_updateFlag === true){
		prefObject = _preferenceObject;
		widgetLogLevelMiddle( 'RSS Widget','Feed Data Changed - SAVING FILE' );
		extension.saveFile( Extension.fileType.CONFIG, rssWidgetObject.onPreferenceChanged, _preferenceObject.save() );
	}
	return;
};
var prefCallback = function() {
	widgetLogLevelLow( 'RSS Widget', 'prefCallback' );
	rssWidgetObject.onPreferenceLoaded.call( rssWidgetObject._this );
};
var init = function() {
	widgetLogEnable();
	rssWidgetObject.focused = false;
	_initialize();
	prefObject = new Preferences( prefCallback );
};
var _initialize = function(){
	widgetLogLevelLow( 'RSS Widget','Initialize' );
	var _width = windowWidth * 0.99 - 24; 
	var _height = windowHeight - 133;  
	var _content_rows = ( _height / 48 ) >> 0;
	if( _content_rows <= 0 ) _content_rows = 1;
	var _upb = document.getElementById( 'UPDATE_BUTTON' );
	var _feedTitle = document.getElementById( "FEED_TITLE" );
	if (_upb !== undefined && _feedTitle !== undefined){
		var _maxWidth = _upb.offsetLeft - _feedTitle.offsetLeft - 12;
		_feedTitle.style.width = _maxWidth + 'px';
		_feedTitle.style.maxWidth = _maxWidth + 'px';
	}
	_feedTitle.innerText = 'RSS';
	try {
		widgetLogLevelLow( 'RSS Widget','Creating List' );
		content_list = new RSSWidgetList('tablebase', 'RSS_READER_WIDGET_CONTENT',false);
	    content_list.setRows(_content_rows);
		content_list.setVirtualRows(6);
		content_list.setDefault(0);
	} catch (e){
		widgetLogLevelLow( 'RSS Widget','LIST:'+e );
	}
	widgetLogLevelLow( 'RSS Widget','Creating ScrollBar' );
	RSScrollBar.plugTo = plugToReplace;
	RSScrollBar.plugTo(content_list);
	content_list.setWidth( _width - 7 );
	var _scrollWidth = content_list.currentHighlightedItem.offsetWidth + 13;
	content_list.internalScrollBar.scrollBar.style.left = _scrollWidth+'px';
	widgetLogLevelLow( 'RSS Widget','Activating Buttons' );
	updateButton = new RSSWidgetButton('UPDATE_BUTTON_IMG','UPDATE_BUTTON','images/bt_update_normal.png','images/bt_update_push.png','images/bt_update_disable.png');
	updateButton.behaviour = function(){rssWidgetObject.registerFeed.call( rssWidgetObject._this ,rssWidgetObject.registerFeedRes,rssWidgetObject.registerFeedReqCallbackDisable);};
	updateButton.myHtmlImage.style.backgroundImage = 'url("images/bt_update_normal.png")';
	upButton = new RSSWidgetButton('UP_BUTTON_IMG','UP_SCROLL_BUTTON','images/bt_up_normal.png','images/bt_up_push.png');
	downButton = new RSSWidgetButton('DOWN_BUTTON_IMG','DOWN_SCROLL_BUTTON','images/bt_down_normal.png','images/bt_down_push.png');
	content_list.setButtons(upButton,downButton);
	widgetLogLevelLow( 'RSS Widget','List Buttons Set' );
	content_list.setRows = setRowsReplace;
	document.getElementById('master_table').style.visibility = 'visible';
};
function widgetKeyDown(evt, key) {
	if( key == mylo.KeyCode.BACK ) {
	 	return true;
	}
	content_list.keyEvent(evt, key);
	   		return false;
}
function plugToReplace(uiobject){
	var _range = uiobject.nodeMatrix.length;
	var _pages = (_range / uiobject.parentTable.rows.length) >> 0;
	if (_pages == 1){
		_pages += 1;
	}
	var _height = uiobject.getHeight();
	uiobject.internalScrollBar = this;
	return this.create(uiobject.control,_range,_pages,_height);
}
var adjustWindowSize = function() {
	widgetLogLevelMiddle( 'RSS Widget','adjustWindowSize' );
	var _width = windowWidth * 0.99 - 24; 
	var _height = windowHeight - 133; 
	widgetLogLevelMiddle( 'RSS Widget', '_content_height=' + _height );
	var _content_rows = ( _height / 48 ) >> 0;
	if( _content_rows <= 0 ) _content_rows = 1;
	if(content_list.nodeMatrix.length < _content_rows){
		content_list.setVirtualRows(_content_rows);
	}
	widgetLogLevelMiddle( 'RSS Widget', '_content_rows=' + _content_rows );
	content_list.setRows = setRowsReplace;
	content_list.setWidth( _width - 7 ); 
	refreshMarqueeAt(0,false);
	content_list.jumpTo( 0 );
	content_list.setRows( _content_rows );
	refreshScrollBar();
	refreshMarqueeAt(0,true);
	var _upb = document.getElementById( 'UPDATE_BUTTON' );
	var _feedTitle = document.getElementById( "FEED_TITLE" );
	if (_upb !== undefined && _feedTitle !== undefined){
		var _maxWidth = _upb.offsetLeft - _feedTitle.offsetLeft - 12;
		widgetLogLevelMiddle( 'RSS Widget','_upb.offsetLeft:'+_upb.offsetLeft );
		widgetLogLevelMiddle( 'RSS Widget','_feedTitle.offsetLeft:'+_feedTitle.offsetLeft );
		_feedTitle.style.width = _maxWidth + 'px';
		_feedTitle.style.maxWidth = _maxWidth + 'px';
	}
};
var refreshScrollBar = function(){
	var _width = content_list.currentHighlightedItem.offsetWidth + 13;
	content_list.internalScrollBar.scrollBar.style.left = _width+'px';
	var _pages = ( content_list.nodeMatrix.length / content_list.parentTable.rows.length ) >> 0;
	if (content_list.nodeMatrix.length > content_list.parentTable.rows.length && content_list.nodeMatrix.length < content_list.parentTable.rows.length*2){
		_pages = 2;
	} else if (content_list.nodeMatrix.length == content_list.parentTable.rows.length){
		_pages = 1;
	}
	content_list.internalScrollBar.configureScroll( content_list.nodeMatrix.length, _pages, content_list.getHeight());
};
var widgetResize = function() {
	adjustWindowSize();
};
var disableWidget = function() {
	if (rssWidgetObject.updateTimer !== null){
		widgetLogLevelLow('RSS Widget','Clear Foreground Timer');
		clearInterval( onTimer, 3600000 );
	}
	if (rssWidgetObject.backgroundTimer !== null){
		widgetLogLevelLow('RSS Widget','Clear Background Timer');
		clearInterval(onBackgroundTimer,0);
	}
	if (rssWidgetObject.refreshButtonTimer !== null){
		widgetLogLevelLow('RSS Widget','Clear Refresh Button Timer');
		clearTimeout(rssWidgetObject.refreshButtonTimer);
	}
	rssWidgetObject.unregisterFeed.call( rssWidgetObject._this );
};
var inFocus = function() {
	rssWidgetObject.focused = true;
	activeFocus();
	if(prefObject.getValueByName('marquee') == 'on'){
		var position = content_list.currentPosition;
		var _visibleIndex = content_list.currentHighlightedItem.rowIndex;
		content_list.jumpTo(position,content_list.scrollOffSet,_visibleIndex);
	}
  	newItemNotifyCancel();
};
var outFocus = function(){
	rssWidgetObject.focused = false;
	if(prefObject.getValueByName('marquee') == 'on'){
		var position = content_list.currentPosition;
		var articleName = document.getElementById('#S'+position);
		if (articleName !== undefined && articleName !== null){
			articleName.innerHTML = rssWidgetObject.articles[position].entryTitle;
		}
	}
	removeFocus();
	refreshButtons();
};
var refreshButtons = function(){
	var _upButton = content_list.upButton;
	var _downButton = content_list.downButton;
	var _updateButton = updateButton;
	var _upImage = _upButton.myHtmlImage;
	var _downImage = _downButton.myHtmlImage;
	var _updateImage = _updateButton.myHtmlImage;
	_upButton.release(_upImage);
	_downButton.release(_downImage);
	_updateButton.release(_updateImage);
	widgetLogLevelLow('RSS Widget','Buttons Refreshed');
};
var removeFocus = function(){
	content_list.currentHighlightedItem.style.color = '#666666';
	content_list.currentHighlightedItem.style.backgroundColor = '#FFFFFF';
	content_list.upKeyBehaviour = function(){};
	content_list.downKeyBehaviour =  function(){};
};
var activeFocus = function(){
	content_list.currentHighlightedItem.style.color = '#FFFFFF';
	content_list.currentHighlightedItem.style.backgroundColor = '#FFAA00';
	content_list.upKeyBehaviour = content_list.selectPreviousItem;
	content_list.downKeyBehaviour =  content_list.selectNextItem;
};
var goForeground = function() {
	widgetLogLevelLow( 'RSS Widget','goForeground' );
	widgetLogLevelLow( 'RSS Widget','Update Date Format' );
	_updateDate();
	openWebFlg = false;
};
var openUrl = function( _itemMap ) {
	widgetLogLevelMiddle( 'RSS Widget','openUrl' );
	var _url = _itemMap.get( RSSWidgetList.SELECTED_URL );
	if (_url !== undefined && _url !== null){
		widgetLogLevelMiddle( 'RSS Widget','openUrl:' + _url );
		callOpenWeb( _url );
	}
};
var newItemNotify = function() {
	widgetLogLevelMiddle( 'RSS Widget','newItemNotify' );
	var _led = document.getElementById( 'LED_IMG' );
	_led.src = 'images/LED_newarrival.png';
	_led.led = LED_NEWARRIVAL;
	extension.ledOn();
};
var newItemNotifyCancel = function() {
	widgetLogLevelMiddle( 'RSS Widget','newItemNotifyCancel' );
	var _led = document.getElementById( 'LED_IMG' );
	if (_led.led){
		widgetLogLevelMiddle( 'RSS Widget','LED_STATUS:'+_led.led );
		if (_led.led == LED_NEWARRIVAL){
			_led.src = 'images/LED_set.png';
			_led.led = LED_ENABLE;
			extension.ledOff();
		}
	}
};
var enableNotification = function() {
	widgetLogLevelMiddle( 'RSS Widget','enableNotification' );
	rssWidgetObject.notify = true;
	var _led = document.getElementById( 'LED_IMG' );
	_led.src = 'images/LED_set.png';
	_led.led = LED_ENABLE;
	extension.ledOff();
};
var disableNotification = function() {
	widgetLogLevelMiddle( 'RSS Widget','disableNotification' );
	rssWidgetObject.notify = false;
	var _led = document.getElementById( 'LED_IMG' );
	_led.src = 'images/LED_preset.png';
	_led.led = LED_DISABLE;
	extension.ledOff();
};
var updateLastUpdateDate = function() {
	widgetLogLevelMiddle( 'RSS Widget','updateLastUpdateDate - No Action' );
};
var _updateLastBhv = function(){
	widgetLogLevelMiddle( 'RSS Widget','updateLastUpdateDate - Date Updated' );
	rssWidgetObject.lastUpdateTime = new Date();
	_updateDate();
};
var _updateDate = function(){
	if (rssWidgetObject.lastUpdateTime !== null) {
		var _last_updated_date = document.getElementById('LAST_UPDATED_DATE');
		widgetLogLevelMiddle( 'RSS Widget','Evaluating Date Format' );
		if (gridWidth >= 21) {
			_last_updated_date.innerText = printDateTimeString(rssWidgetObject.lastUpdateTime);
		}
		else {
			_last_updated_date.innerText = '';
		}
	} 
};
var clearLastUpdateDate = function(){
	widgetLogLevelMiddle( 'RSS Widget','clearLastUpdateDate' );
	rssWidgetObject.lastUpdateTime = null;
	var _last_updated_date = document.getElementById( 'LAST_UPDATED_DATE' );
	_last_updated_date.innerText = ''
};
var marqueer = function(item,string,_this){
	var _marquee = window.document.createElement('MARQUEE');
	_marquee.innerHTML = string;
	_marquee.width = item.parentNode.offsetWidth;
	_marquee.height = item.parentNode.offsetHeight;
	_marquee.setAttribute('LOOP','1');
	_marquee.setAttribute('SCROLLAMOUNT','250');
	_marquee.setAttribute('SCROLLDELAY','1');
	_marquee.setAttribute('BEHAVIOR','SLIDE');
	_marquee.setAttribute('DIRECTION','LEFT');
	var dummyDiv = document.createElement('DIV');
	dummyDiv.appendChild(_marquee);
	return dummyDiv.innerHTML;
};
var refreshMarquee = function(marqueeFlag){
	try {
		if (rssWidgetObject.articles){
			var articlesLength = rssWidgetObject.articles.length;
			var listLength = content_list.nodeMatrix.length;
			if (articlesLength == listLength){
				widgetLogLevelLow('RSS Widget','Changing Scroll Mode');
				for (var _i=0;_i<=articlesLength - 1;_i++){
					content_list.updateItem(_i, '<p class="entry_title" id="#A'+_i+'"><span id="#S'+_i+'">' + rssWidgetObject.articles[_i].entryTitle + '</span></p>' + '<p class="entry_subtitle">' + getFormattedDate(_i) + '</p>' );
					content_list.updateItemProperty(_i, RSSWidgetList.SELECTED_URL, rssWidgetObject.articles[_i].entryLink );
					refreshMarqueeAt(_i,marqueeFlag);
				}
			}
		}
	} catch (e){
		widgetLogLevelLow('RSS Widget','refreshMarquee:'+e);
	}
};
var getFormattedDate = function(index){
	var _str = '';
	var _now = new Date();
	var _artDate = rssWidgetObject.articles[index].lastUpdated;
	if (_artDate !== undefined && _artDate !== null && _artDate !== ''){
		var _lastUpdate = new Date();
		_lastUpdate.setTime( _artDate * 1000 );
		_str = printDateTimeString( _lastUpdate );
	} else {
		_str = '<pre> </pre>'
	}
	return _str;
};
var refreshMarqueeAt = function(_i,marqueeFlag){
	if(marqueeFlag === true){
		content_list.updateItemProperty(_i, RSSWidgetList.ON_HIGHLIGHT, onHighLight);
		content_list.updateItemProperty(_i, RSSWidgetList.ON_UNSELECT, onUnselect);
	} else {
		content_list.updateItemProperty(_i, RSSWidgetList.ON_HIGHLIGHT, function(){});
		content_list.updateItemProperty(_i, RSSWidgetList.ON_UNSELECT, function(){});
	}
};
var onHighLight = function(itemMap,event,refreshFlag){
	var position = content_list.currentPosition;
	var articleName = document.getElementById('#S'+position);
	if (rssWidgetObject.focused === true){
		if (articleName !== undefined && articleName !== null){
			if (articleName.offsetWidth >= content_list.currentHighlightedItem.offsetWidth){
				var marquee = marqueer(articleName,rssWidgetObject.articles[position].entryTitle,this);
				articleName.innerHTML = marquee;
			}
		}
	}
};
var onUnselect = function(itemMap,event,refreshFlag){
	var lastPosition = content_list.currentHighlightedItem.rowIndex+content_list.scrollOffSet;
	var articleName = document.getElementById('#S'+lastPosition);
	if (articleName !== undefined && articleName !== null){
		if (articleName.innerHTML !==  rssWidgetObject.articles[lastPosition].entryTitle){
			articleName.innerHTML = rssWidgetObject.articles[lastPosition].entryTitle;
		}
	}
};
var printDateTimeString = function( _datetime ) {
	var _str = '';
		var _now = new Date();
		if ( _now.getYear() == _datetime.getYear() && _now.getMonth() == _datetime.getMonth() && _now.getDate() == _datetime.getDate() ){
			var _minutes = _datetime.getMinutes().toString();
			if ( _minutes.length == 1 ){
				_minutes = '0' + _minutes;
			}
			if ( _datetime.getHours() >= 12 ){
				if ( _datetime.getHours() > 12 ){
					_str = ( _datetime.getHours() - 12 ) + ':' + _minutes + ' PM';		
				} else {
					_str = _datetime.getHours() + ':' + _minutes + ' PM';							
				}
			} else {
				if ( _datetime.getHours() === 0 ){
					_str = '12:' + _minutes + ' AM';
				} else {
					_str = _datetime.getHours() + ':' + _minutes + ' AM';
				}
			}
		} else {
			_str = ( _datetime.getMonth() + 1 ) + '/' + _datetime.getDate();
		}
		return _str;
};
var goActive = function(){
	if( prefObject.getValueByName('notify') == 'on' ){
		if (rssWidgetObject.notify !== true || (rssWidgetObject.feedUrl !== prefObject.getValueByName('feed_url')) || rssWidgetObject.feedUrl == ''){
			widgetLogLevelLow('RSS Widget','goActive - notify(on) - set');
			enableNotification();
		} else {
			widgetLogLevelLow('RSS Widget','goActive - notify(on) - dont refresh');
		}
	} else {
		disableNotification();
	}
	if (rssWidgetObject.feedUrl !== prefObject.getValueByName('feed_url')){
		if (rssWidgetObject.feedUrl !== null && rssWidgetObject.feedUrl !==''){
			rssWidgetObject.changeFeed.call( rssWidgetObject._this );
		} else {
			rssWidgetObject.feedUrl = prefObject.getValueByName('feed_url');
			rssWidgetObject.registerFeed.call( rssWidgetObject._this ,rssWidgetObject.registerFeedResJSON,rssWidgetObject.registerFeedReqCallback);
		}
	} 
	if (rssWidgetObject.updateTimer === null){
		rssWidgetObject.updateTimer = setInterval( onTimer, 3600000 );
	}
	if (rssWidgetObject.backgroundTimer === null){
		rssWidgetObject.backgroundTimer = setBackgroundInterval(onBackgroundTimer,0);
	}
	_updateDate();
};
LIST_ROW_HEIGHT = 50;
Function.prototype.bindAsEventListener = function(object) {
	var __method = this;
	return function(event) {
		return __method.call(object, event || window.event);
	};
};
function RSSWidgetList(id, parent_id,focusFlag) {
	this.currentHighlightedItem= null;
	this.parentTable= null;
	this.nodeMatrix= null;
	this.scrollOffSet= 0;
	this.internalScrollBar= null;
	this.hightLightStyle = [];
	this.unselectedStyle = [];
	this.control = null;
	this.container = null;
	this.defaultClickBehavior = function(itemMap){};
	this.currentPosition = 0;
	this.upButton= null;
	this.downButton= null;
	this.keyEvent =  null;
	this.clickIt;
	this.focused = true;
	this.upLimit = false;
	this.downLimit = false;
	this.UNSELECTED_STYLE = 'listitem';
	this.HIGHLIGHTED_STYLE = 'listitem_highlighted';
	this.TABLE_STYLE = 'list';
	this.init = function(id, parent,focusFlag){
		try{
			var _control = window.document.createElement('DIV');
			_control.id = id;
			_control.style.border = '0px';
			var _parentTable = window.document.createElement('DIV');
			_parentTable.rows = [];
			_parentTable.rowIndex = 0;
			_control.appendChild(_parentTable);
			_parentTable.className = this.TABLE_STYLE;
			_parentTable.align = 'left';
			_parentTable.style.overflow = 'hidden';
			this.container = window.document.getElementById(parent);
			if (this.container) this.container.appendChild(_control);
			this.control = _control;
			this.container.style.overflow = 'hidden';
			this.parentTable = _parentTable;
			this.clickIt = this.defaultClickIt;
			this.upKeyBehaviour = function(){};
			this.downKeyBehaviour = function(){};
			this.HIGHLIGHTED_STYLE = this.UNSELECTED_STYLE;
			_control = null;
			_parentTable = null;
		} catch (e){
			widgetLogLevelLow( 'LIST','init():'+e);
		}
};
	this.setDefault = function(index){
		var _tableNode = this.parentTable;
		if (_tableNode){
			var _defaultCell = _tableNode.rows[index-0];
			_defaultCell.className = this.HIGHLIGHTED_STYLE;
			this.currentHighlightedItem = _defaultCell;
		}
		if (index == 0){
			this.upLimit = true;
			this.downLimit = false;
		} else if (index >= this.nodeMatrix.length) {
			this.downLimit = true;
			this.upLimit = false;
		}
		_tableNode = null;
	};
	this.setDefaultClickBehavior = function (behavior){
		if (behavior instanceof Object){
			this.defaultClickBehavior = behavior;
		}
	};
	this.refresh = function(){
		this.highlightIt(this.currentHighlightedItem,true,null);
	};
	this.highlightIt = function(item,refreshFlag,event) {
		this.currentPosition = item.rowIndex + this.scrollOffSet;
		var itemMap = this.nodeMatrix[item.getAttribute(RSSWidgetList.GLOBAL_INDEX)];
		var highlightFunction = itemMap.get(RSSWidgetList.ON_HIGHLIGHT);
		if (highlightFunction !== undefined && this.focused == true){
			itemMap.put(RSSWidgetList.HTML_ITEM,item);
			highlightFunction(itemMap,event,refreshFlag);
		}
		if (this.internalScrollBar) this.internalScrollBar.setPosition(this.currentPosition);
		if(this.currentHighlightedItem) {
			var lastPosition = this.currentHighlightedItem.rowIndex+this.scrollOffSet;
			if (lastPosition !== this.currentPosition){
				var lastMap = this.nodeMatrix[lastPosition];
				var unselectFunction = lastMap.get(RSSWidgetList.ON_UNSELECT);
				if (unselectFunction !== undefined && this.focused == true){
					unselectFunction(lastMap,event,refreshFlag);
				}
			}
			if (refreshFlag == true){
				this.currentHighlightedItem.style.color = '#666666';
				this.currentHighlightedItem.style.backgroundColor = '#FFFFFF';
			}
		}
		if(item) {
			if (refreshFlag == true){
				if (rssWidgetObject.focused === true){
					item.style.color = '#FFFFFF';
					item.style.backgroundColor = '#FFAA00';
				}
				this.currentHighlightedItem = item;
				this.currentHighlightedItem.parentNode.rowIndex = item.rowIndex;
			}
		}
		if (this.currentPosition === 0)	 {
			this.upLimit = true;	
			this.downLimit = false;
		} else if (this.currentPosition > this.nodeMatrix.length - 2){
			this.downLimit = true;
			this.upLimit = false;
		} else {
			this.upLimit = false;
			this.downLimit = false;
		}
		return this.currentPosition;
	};
	this.focusProcessor = function(element,event){};
	this.defaultClickIt = function(item,event){
		var index = this.highlightIt(item,true,event);
		var itemMap = this.nodeMatrix[index];
		itemMap.put(RSSWidgetList.HTML_ITEM,item);
		var linkedFunction = itemMap.get(RSSWidgetList.LINKED_FUNCTION);
		if (linkedFunction !==null && linkedFunction !== undefined){
			linkedFunction(itemMap,event);
		} else {
			this.defaultClickBehavior(itemMap);
		}
		return itemMap;
	};
	this.selectPreviousItem = function() {
		var _tableNode = this.parentTable;
		var _tablelen = _tableNode.rows.length;
		var _position = this.getPosition();
		if (this.upLimit == true){
			this.jumpTo(this.nodeMatrix.length-1);
		} else {
			if (_position > 0){
				if (_position - 1 >= 0) --_position;
				var _previousItem = _tableNode.rows[_position];
				this.highlightIt(_previousItem,true);
				_previousItem = null;
			} else {
				if (this.scrollOffSet > 0){
					--this.scrollOffSet;
					for (var i = 0; i<=_tablelen - 1;i++){
						this._setContent(i,this.scrollOffSet,_tableNode);
					}
					this.highlightIt(this.currentHighlightedItem,false);
				}
			}
		}
		_tableNode = null;
	};
	this.selectNextItem = function() {
		var _position = this.getPosition();
		var _tableNode = this.parentTable;
		var _tablelen = _tableNode.rows.length - 1;
		if (this.downLimit == true){
			this.jumpTo(0);
		} else {
			if (_position < _tablelen){
			if (_position + 1 <= _tablelen) ++_position;
			var _nextItem = _tableNode.rows[_position];
				this.highlightIt(_nextItem,true);
				_nextItem = null;
			} else {
				if ((_position + this.scrollOffSet) < (this.nodeMatrix.length - 1)){
					++this.scrollOffSet;
					for (var i = 0; i<=_tablelen;i++){
						this._setContent(i,this.scrollOffSet,_tableNode);
					}
					this.highlightIt(this.currentHighlightedItem,false);
				}
			}
		}
		_tableNode = null;
	};
	this.jumpTo = function (index,scrollOffset,visibleIndex){
		var _tableNode = this.parentTable;
		var _tablelen = _tableNode.rows.length;
		var _highlight = null;
		if (index < _tablelen) {
			if (typeof(scrollOffset)!=="undefined"){
				this.scrollOffSet = scrollOffset;
			} else {
				this.scrollOffSet = 0;
			}
			if (typeof(visibleIndex)!=="undefined"){
				_hightlight = _tableNode.rows[visibleIndex];
			} else {
				_hightlight = _tableNode.rows[index];
			}
			for (var i = 0;i<=_tablelen-1;i++){
				this._setContent(i,this.scrollOffSet,_tableNode);
			}
			this.highlightIt(_hightlight,true);
		} else {
			if (typeof(scrollOffset)!=="undefined"){
				this.scrollOffSet = scrollOffset;
			} else {
				this.scrollOffSet = (index-_tablelen)+1;
			}
			if (typeof(visibleIndex)!=="undefined"){
				_hightlight = _tableNode.rows[visibleIndex];
			} else{
				_hightlight = _tableNode.rows[index - this.scrollOffSet];
			}
			for (var i=0; i<=_tablelen-1;i++){
				this._setContent(i,this.scrollOffSet,_tableNode);
			}
			this.highlightIt(_hightlight,true);
		}
		return _hightlight;
	};
	this._setContent = function(index,scrollOffSet,tableNode){
		tableNode.rows[index].innerHTML = this.nodeMatrix[index+scrollOffSet].get(RSSWidgetList.STRING_VALUE);
		tableNode.rows[index].setAttribute(RSSWidgetList.GLOBAL_INDEX,index+scrollOffSet);
	};
	this.clearTable = function(){
		var _tableNode = this.parentTable;
		if(_tableNode){
			var lenrows = _tableNode.rows.length;
			for (var i = lenrows-1; i >= 0; i--){
				_tableNode.rows[i].innerHTML = "<pre> </pre>";
			}
		}
		this.setVirtualRows(lenrows);
		_tableNode = null;
	};
	this.setRows = function(rows){
		var _tableNode = this.parentTable;
		var addrows = rows - _tableNode.childNodes.length;
		if(addrows>=0){
			for (var i = 0; i<addrows; i++){
				var td1 = document.createElement('DIV');
				td1.className = this.UNSELECTED_STYLE;
				td1.myList = this;
				td1.setAttribute("onclick","this.myList.clickIt(this,event)");
				td1.setAttribute(RSSWidgetList.GLOBAL_INDEX,i);
				td1.innerHTML = "<pre> </pre>";
				td1.rowIndex = i;
				_tableNode.appendChild(td1);
				_tableNode.rows.push(td1);
			}
		} else {
			var removerows = _tableNode.rows.length - rows;
			for(i = removerows; i>0;i--){
				var thisNode = _tableNode.rows[_tableNode.rows.length-1];
				_tableNode.removeChild(thisNode);
				_tableNode.rows.pop();
			}
		}
		_tableNode = null;
		this.setHeight((LIST_ROW_HEIGHT*rows)-(rows - 1));
	};
	this.setVirtualRows = function(rows){
		var _tableNode = this.parentTable;
		var _nodeMatrix = new Array();
		for (var i = rows-1;i>=0;i--){
			var nodeBean = new Map();
			nodeBean.put(RSSWidgetList.STRING_VALUE,'<pre> </pre>');
			_nodeMatrix[i] = nodeBean;
		}
		this.nodeMatrix = _nodeMatrix;
		if (_tableNode.rows.length > rows){
			this.setRows(rows);
		}
	};
	this.getPosition = function(){
		return this.currentHighlightedItem.parentNode.rowIndex;
	};
	this.setWidth = function(width){
		var _tableNode = this.control;
		if(_tableNode){
			_tableNode.style.width = width + "px";
		}
		_tableNode = null;
	};
	this.getWidth = function(){
		return this.control.scrollWidth;
	};
	this.setHeight = function(height){
		var _tableNode = this.control;
		if(_tableNode){
			_tableNode.style.height = height + "px";
		}
		_tableNode = null;
	};
	this.getHeight = function(){
		return this.control.scrollHeight;
	};
	this.updateItem = function(index,element){
		var _tableNode = this.parentTable;
		var _scrollOffSet = this.scrollOffSet;
		var _visibleIndex = _tableNode.rows.length + _scrollOffSet;
		if(_tableNode){
			if (index < _visibleIndex && index >= _scrollOffSet){
				_tableNode.rows[index - _scrollOffSet].innerHTML = element;
			}
			this.updateItemProperty(index,RSSWidgetList.STRING_VALUE,element);
		}
	};
	this.updateItemProperty = function(index,propName,propValue){
		this.nodeMatrix[index].put(propName,propValue);
	};
	this.setButtons = function (up,down){
		this.upButton = up;
		this.downButton = down;
		this.upButton.behaviour = function(){content_list.upKeyBehaviour()};
		this.downButton.behaviour = function(){content_list.downKeyBehaviour()};
	};
	this.leftKeyBehaviour = function(){};
	this.rightKeyBehaviour = function(){};
	this.upKeyBehaviour = function(){};
	this.downKeyBehaviour = function(){};
	this.enterKeyBehaviour = function(){};
	this.onKeyDown = function(evt) {
		evt = (evt) ? evt : ((window.event) ?	event : null);
		if (evt) {
			switch (evt.keyCode) {
				case mylo.KeyCode.LEFT:
					this.leftKeyBehaviour(this.nodeMatrix[this.currentPosition]);
					break;
				case mylo.KeyCode.UP:
					this.upKeyBehaviour();
					break;
				case mylo.KeyCode.RIGHT:
					this.rightKeyBehaviour(this.nodeMatrix[this.currentPosition]);
					break;
				case mylo.KeyCode.DOWN:
					this.downKeyBehaviour();
					break;
				case mylo.KeyCode.ENTER:
					this.enterKeyBehaviour(this.nodeMatrix[this.currentPosition]);
					break;
			}
		}
	}
	this.init(id, parent_id,focusFlag);
	this.keyEvent = this.onKeyDown.bindAsEventListener(this);
}
var setRowsReplace = function(rows){
	var _tableNode = this.parentTable;
	var _modifier = _tableNode.childNodes.length;
	var addrows = rows - _modifier;
	if(addrows>=0){
		var actualPos = _modifier + this.scrollOffSet;
		var compElement = this.nodeMatrix[actualPos+addrows];
		var replaceMode = false;
		if ((compElement !== undefined || compElement !== null)){
			replaceMode = true;
		}
		for (var i = 0; i<addrows; i++){
			var td1 = document.createElement('DIV');
			td1.className = this.UNSELECTED_STYLE;
			td1.myList = this;
			td1.setAttribute("onclick","this.myList.clickIt(this,event)");
			if (replaceMode === false){
				td1.setAttribute(RSSWidgetList.GLOBAL_INDEX,i);
				td1.innerHTML = "<pre> </pre>";
			} else {
				td1.setAttribute(RSSWidgetList.GLOBAL_INDEX,actualPos+i);
				td1.innerHTML = this.nodeMatrix[actualPos+i].get(RSSWidgetList.STRING_VALUE);
			}
			td1.rowIndex = i+_modifier;
			_tableNode.appendChild(td1);
			_tableNode.rows.push(td1);
		}
	} else {
		var removerows = _tableNode.rows.length - rows;
		for(i = removerows; i>0;i--){
			var thisNode = _tableNode.rows[_tableNode.rows.length - 1];
			_tableNode.removeChild(thisNode);
			_tableNode.rows.pop();				
		}
	}
	_tableNode = null;
	this.setHeight((LIST_ROW_HEIGHT*rows)-(rows - 1));
};
function RSSWidgetButton(id,parent,normalImage,pushImage, disableImage) {
	this.id = null;
	this.normalImage = null;
	this.pushImage = null;
	this.disableImage = null;
	this.enableFlag = true;
	this.behaviour = null;
	this.myHtmlImage = null;
	this.init = function (id,parent,normalImage,pushImage,disableImage){
		preloadImages(id,normalImage,pushImage,disableImage);
		this.id = id;
		this.normalImage = normalImage;
		this.pushImage = pushImage;
		this.disableImage = disableImage;
		var _button = window.document.getElementById(id);
		_button.id = id;
		_button.setAttribute("onmousedown","this.myloButton.buttonDown(this,event)");
		_button.setAttribute("onmouseup","this.myloButton.release(this,event)");
		_button.myloButton = this;
		_button.style.cursor = 'pointer';
		this.myHtmlImage = _button;
	};
	this.buttonDown = function(btn,event){
		if (this.enableFlag === true) {
			btn.src = this.pushImage;
			this.behaviour(btn);
		}
		return true;
	};
	this.release = function(btn,event){
		if (this.enableFlag === true) {
			btn.src = this.normalImage;
		}
		return true;
	};
	this.enable = function (){
		this.myHtmlImage.src= this.normalImage;
		this.myHtmlImage.setAttribute("onmousedown","this.myloButton.buttonDown(this,event)");
		this.myHtmlImage.setAttribute("onmouseup","this.myloButton.release(this,event)");
		this.enableFlag = true;
	};
	this.disable = function (){
		this.myHtmlImage.src = this.disableImage;
		this.myHtmlImage.setAttribute("onmousedown","");
		this.myHtmlImage.setAttribute("onmouseup","");
		this.enableFlag = false;
	};
	if (disableImage == null) disableImage = normalImage;
	if (pushImage == null) pushImage = normalImage;
	this.init(id,parent,normalImage,pushImage,disableImage);
};
SLIDER_NORMAL_STYLE = 'scrollitem';
SLIDER_HIGHLIGHTED_STYLE = 'scroll_highlighted';
BAR_NORMAL_STYLE = 'scrollbar';
var RSScrollBar = {
	slider: null,
	scrollBar: null,
	range: null,
	pages: null,
	sliderSize: null,
	step: null,
	scrollIndex: null,
	container: null,
	borderAjust: 0,
	create: function(parent,_range,_pages,_height){
		var _scrollBar = window.document.createElement('DIV');
		var _slider = window.document.createElement('DIV');
		if (typeof(parent) == 'string'){
			this.container = window.document.getElementById(parent);
		} else {
			this.container = parent;
		}
		_slider.className = SLIDER_NORMAL_STYLE;
		_scrollBar.className = BAR_NORMAL_STYLE;
		_scrollBar.appendChild(_slider);
		this.container.appendChild(_scrollBar);
		this.scrollBar = _scrollBar;
		this.slider = _slider;
		this.configureScroll(_range,_pages,_height);
		this.setPosition(0);
		_scrollBar = null;
		_slider = null;
		return this;
	},
	setPosition: function(_val){
		var _slider = this.slider;
		var _range = this.range - 1;
		var _step = this.step;
		var _position = null;
		if (_val >= _range) _val=_range;
		if (_val < 0) _val=0;
		_val = _val >> 0;
		_position = _val * _step >> 0;
		_slider.style.top = _position;
		this.scrollIndex = _val;
		_slider = null;
	},
	configureScroll: function(_range,_pages,_height){
		var _visibleArea = (_range / _pages) >> 0;
		var _sliderPercent = (_visibleArea*100)/_range;
		var _sliderSize = (_sliderPercent*_height)/100;
		var _step = (_height - _sliderSize - this.borderAjust) / (_range-1);
		var _slider = this.slider;
		_slider.style.height = _sliderSize + "px";
		this.range = _range;
		this.pages = _pages;
		this.scrollIndex = 0;
		this.setHeight(_height);
		this.sliderSize = _sliderSize;
		this.step = _step;
	},
	setHeight: function(height){
		var _barNode = this.scrollBar;
		if(_barNode){
			_barNode.style.height = height + "px";
		}
		_barNode = null;
	},
	plugTo: function(uiobject){
		var _range = uiobject.nodeMatrix.length;
		var _pages = (_range / uiobject.parentTable.rows.length) >> 0;
		if (_pages == 1){
			_pages += 1;
		}
		var _height = uiobject.getHeight() - 2;
		var _width = uiobject.getWidth();
		uiobject.setWidth(_width - 24);
		uiobject.internalScrollBar = this;
		return this.create(uiobject.control,_range,_pages,_height);
	}
};
RSSWidgetList.SELECTED_URL = 'url';
RSSWidgetList.LINKED_FUNCTION = 'function';
RSSWidgetList.STRING_VALUE = 'string';
RSSWidgetList.HTML_ITEM = 'html_item';
RSSWidgetList.DOM_ITEM = 'dom_item';
RSSWidgetList.FOCUS_ELEMENT_ID = 'focus_element';
RSSWidgetList.GLOBAL_INDEX = 'gbIndex';
RSSWidgetList.ON_HIGHLIGHT = 'on_highlight';
RSSWidgetList.ON_UNSELECT = 'on_unselect';
function preloadImages()
{
	if (document.images)
	{
		var _imgName = preloadImages.arguments[0];
		var _cnt;
		imgBuffer[_imgName] = new Array;
		for (_cnt = 1; _cnt < preloadImages.arguments.length; _cnt++)
		{
			imgBuffer[_imgName][preloadImages.arguments[_cnt]] = new Image();
			imgBuffer[_imgName][preloadImages.arguments[_cnt]].src = preloadImages.arguments[_cnt];
		}
	}
}
var imgBuffer; imgBuffer = new Array;
