/*
 * Copyright 2007,2008 Sony Corporation
 */

var Preset_ErrMessage = 'Click Logo and Tune In first';
var LastTuned_ErrMessage = 'Click Logo and Tune In!';
var extension = new Extension();
var openWebFlg = false;
var callOpenWeb = function(_url) {
	if(openWebFlg == false){
		openWebFlg = true;
		extension.openWeb(_url);
	}
};
var shoutCastWidget = {
	prefObject : null,
	prefDefaults:null,
	innerSelect: null,
	nowPlayingDivBase:null,
	nowPlayingDiv:null,
	channelSpan:null,
	nowPlayingDivText: null,
	nowPlayIndex : null,
	nowPlayJSONData: null,
	selectTimerOut : null,
	themeTimerOut : null,
	lastTunedFlag : false,
	widgetMode : null,
	clearButton : null,
	playPauseButton:null,
	setButton:null,
	hasIntervalNotify:false,
	start : function(){
		_this.prefObject = new Preferences(_this.generateBase);
		return this;
	},
	generateBase : function(){
		if(_this.prefObject != null){
			var _prefObject = _this.prefObject;
			var _prefItems = _prefObject.prefsItems;
			var _prefLen = _prefItems.length - 1;
			for (var _i=0;_i<=_prefLen;_i++){
				if ('LastTuned_ErrMessage' == _prefItems[_i].name) {
					LastTuned_ErrMessage = _prefItems[_i].value;
				} else if ('Preset_ErrMessage' == _prefItems[_i].name) {
					Preset_ErrMessage = _prefItems[_i].value;
				}
			}
		}
		var channelSpan = document.getElementById('CHANNEL');
		_this.channelSpan = channelSpan;
		var nowPlayingDivBase = document.getElementById('THEME_NAME');
		_this.nowPlayingDivBase = nowPlayingDivBase;
		var nowPlayingDiv = document.getElementById('THEME_SPAN');
		_this.nowPlayingDiv = nowPlayingDiv;
		var stationSelect = new INetRadioSelector('SELECTOR');
		_this.innerSelect = stationSelect;
		_this.toPlayMode(-1);
		adjustSelectSize();
		if (_this.playPauseButton.enableFlag === true){
			_this.playPauseButton.disable();
		}
		return this;
	},
	_generatePlayModeHtml : function(){
		var _pos1 = document.getElementById('POS1');
		var _pos2 = document.getElementById('POS2');
		var _pos3 = document.getElementById('POS3');
		var _pos4 = document.getElementById('POS4');
		var _pos5 = document.getElementById('POS5');
		_pos1.className = 'POS1';
		_pos2.className = 'POS2';
		var _setPos2 = '<button id="PRESET_BUTTON">Preset</button>';
		_pos2.innerHTML = _setPos2;
		_pos3.className = 'POS3';
		var _setPos3 = '<button id="LAST_TUNED_BUTTON">Last<BR>Tuned</button>';
		_pos3.innerHTML = _setPos3;
		_pos4.className = 'POS4';
		var _setPos4 = '<img id="upButton" src="images/bt_up_normal.png" width="24" height="24"/>';
		_pos4.innerHTML = _setPos4;
		_pos5.className = 'POS5';
		var _setPos5 = '<img id="downButton" src="images/bt_down_normal.png" width="24" height="24"/>';
		_pos5.innerHTML = _setPos5;
	},
	_generatePresetModeHtml : function(){
		var _pos1 = document.getElementById('POS1');
		var _pos2 = document.getElementById('POS2');
		var _pos3 = document.getElementById('POS3');
		var _pos4 = document.getElementById('POS4');
		var _pos5 = document.getElementById('POS5');
		_pos1.className = 'POS1_S';
		var _setPos1 = '<button id="SET_BUTTON">Set</button></td>';		
		_pos1.innerHTML = _setPos1;
		_pos2.className = 'POS2_S';
		var _setPos2 = '<button id="CANCEL_BUTTON">Back</button>';
		_pos2.innerHTML = _setPos2;
		_pos3.className = 'POS3_S';
		var _setPos3 = '<button id="CLEAR_BUTTON">Clear</button>';
		_pos3.innerHTML = _setPos3;
		_pos4.className = 'POS4_S';
		var _setPos4 = '<img id="upButtonSet" src="images/bt_preset_up_normal.png" width="24" height="24"/>';
		_pos4.innerHTML = _setPos4;
		_pos5.className = 'POS5_S';
		var _setPos5 = '<img id="downButtonSet" src="images/bt_preset_down_normal.png" width="24" height="24"/>';
		_pos5.innerHTML = _setPos5;
	},
	_makePlayModeButtons : function(){
		var upButton = new INetRadioButton('upButton','POS4','images/bt_up_normal.png','images/bt_up_push.png','images/bt_up_disable.png');
		var downButton = new INetRadioButton('downButton','POS5','images/bt_down_normal.png','images/bt_down_push.png','images/bt_down_disable.png');
		var presetButton = new INetRadioTextButton('PRESET_BUTTON','POS2','#5555FF','#82A5FF','#20208A');
		presetButton.behaviour = function(){_this.presetBhv();};
		var lastTunedButton = new INetRadioTextButton('LAST_TUNED_BUTTON','POS3','#5555FF','#82A5FF','#20208A');
		lastTunedButton.behaviour = function(){
			_this._afterDecodeBhv = function(){
				if (_this.lastTunedFlag === true){
					widgetLogLevelLow( 'SHOUTCast Widget', 'Load Last Tuned and Play it' );
					if (_this.playPauseButton.enableFlag === false){
						_this.playPauseButton.enable();
					}
					_this._playLastTnd();
				} else {
					_this.innerSelect.jumpTo(-1);
					setFontSizeAndText( _this.nowPlayingDiv, LastTuned_ErrMessage );
					_this.nowPlayingDiv.innerHTML = LastTuned_ErrMessage;
					themeMarqueeOnClick(_this.nowPlayingDiv, null);
					_this.nowPlayingDiv.setAttribute('onclick', 'themeMarqueeOnClick(this,event)');
					if (_this.playPauseButton.enableFlag === true){
						_this.playPauseButton.disable();
					}
				}
			};
			_this.lastTunedBhv();
		};
		return {upButton:upButton,downButton:downButton};		
	},
	_makePresetModeButtons: function(){
		var upButton = new INetRadioButton('upButtonSet','POS4','images/bt_preset_up_normal.png','images/bt_preset_up_push.png','images/bt_preset_up_disable.png');
		var downButton = new INetRadioButton('downButtonSet','POS5','images/bt_preset_down_normal.png','images/bt_preset_down_push.png','images/bt_preset_down_disable.png');
		var setButton = new INetRadioTextButton('SET_BUTTON','POS1','#B4B4B4','#DCDCDC','#5A5A5A');
		setButton.behaviour = function(){_this.setBhv();};
		if (_this.lastTunedFlag === false){
			setButton.disable();
			setFontSizeAndText( _this.nowPlayingDiv, Preset_ErrMessage );
			themeMarqueeOnClick(_this.nowPlayingDiv, null);
			_this.nowPlayingDiv.setAttribute('onclick', 'themeMarqueeOnClick(this,event)');
		}
		_this.setButton = setButton;
		_this._configExeButton(setButton.behaviour);
		var cancelButton = new INetRadioTextButton('CANCEL_BUTTON','POS2','#B4B4B4','#DCDCDC','#5A5A5A');
		cancelButton.behaviour = function(){_this.cancelBhv();};
		var clearButton = new INetRadioTextButton('CLEAR_BUTTON','POS3','#B4B4B4','#DCDCDC','#5A5A5A');
		clearButton.behaviour = function(){_this.clearBhv();};
		_this.clearButton = clearButton;
		return {upButton:upButton,downButton:downButton};
	},
	lastTunedBhv : function(){
		widgetLogLevelLow( 'SHOUTCast Widget', 'Loading Last Tuned Station' );
		extension.readFile('http://127.0.0.1/Audio/lasttuned.pls', _this._decodeLastTnd);
	},
	presetBhv : function(){
		try {
			var _presetFunc = function(){
				widgetLogLevelLow( 'SHOUTCast Widget', 'presetBhv - start' );
				_this.nowPlayingDiv.innerHTML = '';
				if (_this.lastTunedFlag === true){
					var _playListItem = _this.innerSelect.getMap(-1).get(Preferences.PREFS_ITEM);
					setFontSizeAndText( _this.nowPlayingDiv, _playListItem.title );
					_this.nowPlayingDiv.setAttribute('onclick','themeMarqueeOnClick(this,event)');
				}
				_this.toPresetMode();
				_this.innerSelect.jumpTo(0);
				widgetLogLevelLow( 'SHOUTCast Widget', 'presetBhv - end' );
			};
			_this._afterDecodeBhv = function(){
				widgetLogLevelLow( 'SHOUTCast Widget', 'Load Last Tuned only' );
				_presetFunc();
			};
			_this.lastTunedBhv();
		} catch (e){
			widgetLogLevelLow( 'SHOUTCast Widget', 'Preset - Exception:'+e );
		}
	},
	clearBhv : function(){
		widgetLogLevelLow( 'SHOUTCast Widget', 'clearBhv' );
		var prefItem = _this._registerPrefItem('','');
		prefItem.pls = null;
		var _index = _this.innerSelect.scrollOffSet;
		var selectedMap = _this.innerSelect.getMap(_index);
		var _channelNumber = selectedMap.get(shoutCastWidget.CHANNEL_NUMBER);
		_this.innerSelect.updateItem(_index,'<span id="CHANNEL">ch'+_channelNumber+'</span><span id="SELECTOR_SPAN"><PRE> </PRE></span>');
		_this.innerSelect.jumpTo(_this.innerSelect.scrollOffSet);
	},
	setBhv : function(){
		try {
			widgetLogLevelLow( 'SHOUTCast Widget', 'setBhv' );
			var _stationMap = _this.innerSelect.getMap(-1);
			if (_stationMap){
				var _stationData = _stationMap.get(Preferences.PREFS_ITEM);
				if (!_stationData.pls){
					widgetLogLevelLow( 'SHOUTCast Widget', 'setBhv - Warning .pls no defined');
				}
				var prefItem = _this._registerPrefItem(_stationData.title,plsParser.serializePls(_stationData.pls,true));
				prefItem.pls = _stationData.pls;
			}
			var _index = _this.innerSelect.scrollOffSet;
			widgetLogLevelLow( 'SHOUTCast Widget', 'Set channel '+ _index);
			_this.toPlayMode(_index);
		} catch (e){
			widgetLogLevelLow( 'SHOUTCast Widget', 'Set - Exception: '+e);
		}
	},
	_registerPrefItem : function(title,value){
		var _index = _this.innerSelect.scrollOffSet;
		var selectedMap = _this.innerSelect.nodeMatrix[_index];
		var thisPrefs = selectedMap.get(Preferences.PREFS_ITEM);
		thisPrefs.title = title;
		thisPrefs.value = value;
		_this.prefObject.prefsItems[_index] = thisPrefs;
		_this.saveConfigXml(_this.prefObject);
		return thisPrefs;
	},
	cancelBhv : function(){
		widgetLogLevelLow( 'SHOUTCast Widget', 'cancelBhv' );
		_this.toPlayMode(-1);
	},
	playPauseBhv : function(_status){
		if (_status == shoutCastWidget.PLAY_MODE) {
			var _index = _this.innerSelect.scrollOffSet;
			var selectedMap = _this.innerSelect.getMap(_index);
			var thisPrefs = selectedMap.get(Preferences.PREFS_ITEM);
			if (thisPrefs.pls !== undefined && thisPrefs.pls !== null){
				_this.play(thisPrefs.pls);
			}
		} else {
			_this.stop();
			_this.nowPlayingDiv.innerHTML = '';
		}
		_this.widgetMode = _status;
	},
	_changePlayPauseIcon : function(_status){
		var _pos1 = document.getElementById('POS1');
		var pauseButton = null;
		var _setPos1 = null;
		var _refreshFlag = false;
		try {
			var _pausePlayImage = document.getElementById('pause');
			if (_status == shoutCastWidget.PLAY_MODE && (!_pausePlayImage || (_pausePlayImage && _pausePlayImage.name !== 'pause'))) {
				_setPos1 = '<img name="pause" id ="pause" src="images/bt_pause_normal.png" width="24" height="24"/>';
				_pos1.innerHTML = _setPos1;
				pauseButton = new INetRadioButton('pause', 'POS1', 'images/bt_pause_normal.png', 'images/bt_pause_push.png', 'images/bt_play_disable.png');
				pauseButton.behaviour = function(){
					_this.playPauseBhv(shoutCastWidget.PLAY_MODE_PAUSED);
				};
				if (isMarqueeFinished() == true){
					_selectRestoreFunc(true);
				}
			} else if (_status == shoutCastWidget.PLAY_MODE_PAUSED && (!_pausePlayImage ||(_pausePlayImage && _pausePlayImage.name !== 'play'))){
				_setPos1 = '<img name="play" id ="pause" src="images/bt_play_normal.png" width="24" height="24"/>';
				_pos1.innerHTML = _setPos1;
				pauseButton = new INetRadioButton('pause', 'POS1', 'images/bt_play_normal.png', 'images/bt_play_push.png', 'images/bt_play_disable.png');
				pauseButton.behaviour = function(){
					_this.playPauseBhv(shoutCastWidget.PLAY_MODE);
				};
				if (isMarqueeFinished() == true){
					_selectRestoreFunc(true);
				}
				clearThemeDisplay();
			}
			if (pauseButton !== null){
				_this.playPauseButton = pauseButton;
				_this._configExeButton(pauseButton.behaviour);
				return pauseButton;
			} else {
				return _this.playPauseButton;
			}
		} catch (e){
			widgetLogLevelLow( 'SHOUTCast Widget', '_changePlayPauseIcon - Exception: '+e );
		}
	},
	_configExeButton : function(func){
		_this.innerSelect.exeBehaviour = func;
	},
	toPlayMode : function(chnJump){
		try {
			if (chnJump === undefined || chnJump === null){
				var chnJump = 0;
			}
			_this._generatePlayModeHtml();
			var buttons = _this._makePlayModeButtons();
			_this.innerSelect.setButtons(buttons.upButton,buttons.downButton);
			_this.innerSelect.buttonProcess = playModeBtnProcess;
			_this.innerSelect.behaviour = playModeBehaviour;
			var _playModeMatrix = [];
			var preferences = _this.prefObject;
			var prefLen = preferences.prefsItems.length;
			var _jumpIndex = 0;
			var j=0;
			for (var i=0;i<=prefLen-1;i++){
				var prefItem = preferences.prefsItems[i];
				if ((-1 != prefItem.name.indexOf('pst')) && prefItem.title !== '' && prefItem.value !== ''){
					var _itemMap = new Map();
					if (!prefItem.pls || prefItem.pls === null){
						prefItem.pls = plsParser.XMLtoPlsObject(prefItem);
					}
					_itemMap.put(INetRadioSelector.STRING_VALUE,'<span id="CHANNEL">ch'+(i+1)+'</span><span id="SELECTOR_SPAN" onclick="selectMarqueeOnClick(this,event)">'+prefItem.title+'</span>');
					_itemMap.put(Preferences.PREFS_ITEM,prefItem);
					_itemMap.put(shoutCastWidget.CHANNEL_NUMBER,i+1);
					_playModeMatrix.push(_itemMap);
					if (chnJump !== -1 && chnJump == i){
						_jumpIndex = j;
						widgetLogLevelLow( 'SHOUTCast Widget', 'Found position:'+j +' - Index'+i);
					}
					j++;
				}
			}
			if (chnJump == -1) _jumpIndex = -1;
			_playModeMatrix[LAST_TUNED]=_this._getLastTuned();
			_this.nowPlayingDiv.innerHTML = '';
			_this.widgetMode = shoutCastWidget.PLAY_MODE;
		} catch (e){
			widgetLogLevelLow( 'SHOUTCast Widget', 'PLAY (toPlayMode - 1) - Exception:'+e);
		}
		try {
			if (_playModeMatrix.length>0){
				_this.innerSelect.nodeMatrix = _playModeMatrix;
				widgetLogLevelLow( 'SHOUTCast Widget', 'Jumping to position '+_jumpIndex );
				_this.innerSelect.jumpTo(_jumpIndex);
			} else {
				widgetLogLevelLow( 'SHOUTCast Widget', 'Initial Mode');
				_this.innerSelect.nodeMatrix = _playModeMatrix;
				_this.innerSelect.upButton.disable();
				_this.innerSelect.downButton.disable();
				_this.innerSelect.jumpTo(-1);
				if (_this.playPauseButton.enableFlag === true && _this.lastTunedFlag === false){
					_this.playPauseButton.disable();
				}
			}
		} catch (e){
			widgetLogLevelLow( 'SHOUTCast Widget', 'Play - Exception:'+e );
		}
	},
	_getLastTuned : function(){
		if (_this.lastTunedFlag === true){
			var _lstTuned = _this.innerSelect.getMap(-1);
			var _prefs = _lstTuned.get(Preferences.PREFS_ITEM);
			if (!_prefs.pls){
				widgetLogLevelLow( 'SHOUTCast Widget', 'Warning - NO .pls in Pref Item' );
			}
			return _lstTuned;
		} else {
			var _emptyItem = new Map();
			_emptyItem.put(INetRadioSelector.STRING_VALUE,'');
			_emptyItem.put(shoutCastWidget.CHANNEL_NUMBER,-1);
			return _emptyItem;
		}
	},
	toPresetMode : function(){
		_this._generatePresetModeHtml();
		var buttons = _this._makePresetModeButtons();
		_this.innerSelect.setButtons(buttons.upButton,buttons.downButton);
		_this.innerSelect.buttonProcess = setModeBtnProcess;
		_this.innerSelect.behaviour = setModeBehaviour;
		var preferences = _this.prefObject;
		var pst_cnt = 0;
		for (var i=0;i<preferences.prefsItems.length;i++){
			var prefItem = preferences.prefsItems[i];
			if(-1 != prefItem.name.indexOf('pst')){
				pst_cnt++;
			}
		}
		var prefLen = preferences.prefsItems.length;
		var _previousLastTnd = _this._getLastTuned(); 
		_this.innerSelect.setElements(pst_cnt);
		for (var i=0;i<=prefLen-1;i++){
			var prefItem = preferences.prefsItems[i];
			if(-1 != prefItem.name.indexOf('pst')){
				_this.innerSelect.nodeMatrix[i] = new Map();
				_this.innerSelect.updateItemProperty(i,Preferences.PREFS_ITEM,prefItem);
				_this.innerSelect.updateItemProperty(i,shoutCastWidget.CHANNEL_NUMBER,i+1);	
				var _title = '<pre> </pre>';
				if (prefItem.value !== ''){
					_title = prefItem.title;
				} 
				_this.innerSelect.updateItem(i,'<span id="CHANNEL">ch'+(i+1)+'</span><span id="SELECTOR_SPAN" onclick="selectMarqueeOnClick(this,event)">'+_title+'</span>');
			}
		}
		_this.innerSelect.nodeMatrix[LAST_TUNED] = _previousLastTnd;
		_this.widgetMode = shoutCastWidget.SET_MODE;
	},
	play : function(stationData){
		if (_this.hasIntervalNotify === true) {
			extension.releaseInterval();
			_this.hasIntervalNotify = false;
			widgetLogLevelLow('SHOUTCast Widget', 'Releasing IntervalNotify: play');
		}
		widgetLogLevelLow( 'SHOUTCast Widget', 'PLAY - START' );
		_this.nowPlayJSONData = null;
		var _selectedIndex = shoutCastWidget.innerSelect.scrollOffSet;
		var _selectedMap = shoutCastWidget.innerSelect.getMap(_selectedIndex);
		var _channelNumber = _selectedMap.get(shoutCastWidget.CHANNEL_NUMBER);
		_this.nowPlayIndex = _channelNumber; 
		_this.saveXmlTemp(stationData,_this._playCmd);
	},
	_playCmd : function(_issue){
		if (_issue === true) {
				extension.IntervalNotify('INRA', _this._playCmdNotify);
				widgetLogLevelLow('SHOUTCast Widget', 'Setting IntervalNotify: _playCmd');
				_this.hasIntervalNotify = true;
			widgetLogLevelLow('SHOUTCast Widget', 'Sending Play Command');
			extension.playRadio();
		} else {
			widgetLogLevelLow('SHOUTCast Widget', '_playCmd : Save XML File FAILED!');
			_this.nowPlayIndex = null;
		}
	},
	_playCmdNotify : function(_issue, _data){
		widgetLogLevelLow( 'SHOUTCast Widget', 'Received Play Notification:'+ _issue);
		if( _issue ) {
			widgetLogLevelLow( 'SHOUTCast Widget', 'Play OK');
			extension.readFile('http://127.0.0.1/Audio/radiostatus.json',notifyCaller(_this._showRadioState,_this.nowPlayIndex));
		} else {
			widgetLogLevelLow( 'SHOUTCast Widget', 'Play Error');
		}
	},
	_showRadioState : function(_issue, _respons, _channelNumber ){
			widgetLogLevelLow( 'SHOUTCast Widget', '_showRadioState - _channelNumber: '+_channelNumber);
			_this.nowPlayJSONData = eval('(' + _respons.responseText + ')');
			var _isSelectedChannel = isNowPlayingChannel();
			var _themeDisplay = _this.nowPlayingDiv;
			if (_this.nowPlayJSONData.status){
				widgetLogLevelLow( 'SHOUTCast Widget', '_showRadioState - status: '+_this.nowPlayJSONData.status);
				if (_this.nowPlayJSONData.status == 'PLAY'){
					if (_this.widgetMode !== shoutCastWidget.SET_MODE && (_isSelectedChannel !== null && _isSelectedChannel === true )){
						if (_this.nowPlayJSONData.title && (_this.nowPlayIndex !== null && _this.nowPlayIndex == _channelNumber)){
							widgetLogLevelLow( 'SHOUTCast Widget', '_showRadioState - title: '+_this.nowPlayJSONData.title);
							widgetLogLevelLow( 'SHOUTCast Widget', 'themeTimerOut: '+_this.themeTimerOut);
							var _oldTitle = trim(_themeDisplay.innerText);
							var _newTitle = trim(_this.nowPlayJSONData.title);
							widgetLogLevelLow( 'SHOUTCast Widget', '_oldTitle:'+_oldTitle);
							widgetLogLevelLow( 'SHOUTCast Widget', '_newTitle:'+_newTitle);
								if (_oldTitle !== _newTitle) {
									setFontSizeAndText( _themeDisplay, _newTitle );
									themeMarqueeOnClick(_themeDisplay, null);
									_themeDisplay.setAttribute('onclick', 'themeMarqueeOnClick(this,event)');
									widgetLogLevelLow( 'SHOUTCast Widget', '_showRadioState - TITLE DIFFERENT');
								} else {
									widgetLogLevelLow( 'SHOUTCast Widget', '_showRadioState - TITLE EQUAL');
								}
						}
						_this._changePlayPauseIcon(shoutCastWidget.PLAY_MODE);
					}
				} else {
					_this.nowPlayJSONData = null;
					if (_this.widgetMode !== shoutCastWidget.SET_MODE) {
						_this._changePlayPauseIcon(shoutCastWidget.PLAY_MODE_PAUSED);
					}
				}
			}
	},
	_launchRelease : function(){
		extension.releaseInterval('INRA');
		_this.hasIntervalNotify = false;
		widgetLogLevelLow( 'SHOUTCast Widget', 'Interval released');
		_this.nowPlayIndex = null; 
			_this._changePlayPauseIcon(shoutCastWidget.PLAY_MODE_PAUSED);
		_this.nowPlayJSONData = null;
		widgetLogLevelLow( 'SHOUTCast Widget', '_launchRelease - OK');
	},
	stop : function(){
		extension.stopRadio();
		widgetLogLevelLow( 'SHOUTCast Widget', 'Sending Stop Command' );
		_this._launchRelease();
	},
	_playLastTnd : function(){
		_this.innerSelect.jumpTo(-1);
		_this.playPauseBhv(shoutCastWidget.PLAY_MODE );
	},
	_decodeLastTnd : function( _issue, _respons ){
		widgetLogLevelLow( 'SHOUTCast Widget', '_decodeLastTnd - _issue:'+ _issue);
		var _responseText = _respons.responseText;
		widgetLogLevelLow( 'SHOUTCast Widget', '_decodeLastTnd - _respons.responseText:'+ _responseText);
		if (_issue === true) {
			var lastTuned = plsParser.parsePls(_responseText);
			var _map = new Map();
			var _lastTndItem = new Item();
			_lastTndItem.title = lastTuned.entries[0].strmTitle;
			_lastTndItem.pls = lastTuned;
			_map.put(INetRadioSelector.STRING_VALUE, '<span id="CHANNEL"><PRE> </PRE></span><span id="SELECTOR_SPAN" onclick="selectMarqueeOnClick(this,event)">' + _lastTndItem.title + '</span>');
			_map.put(Preferences.PREFS_ITEM, _lastTndItem);
			_map.put(shoutCastWidget.CHANNEL_NUMBER, -1);
			_this.innerSelect.nodeMatrix[LAST_TUNED] = _map;
			_this.lastTunedFlag = true;
		} else {
			_this.lastTunedFlag = false;
		}
		_this._afterDecodeBhv();
	},
	saveXmlTemp : function(stationData,callback){
		try {
			widgetLogLevelLow( 'SHOUTCast Widget', 'Serializing PLS Data:'+ stationData);
			var toTemp = plsParser.serializePls(stationData,false);
			widgetLogLevelLow( 'SHOUTCast Widget', 'Saving data to tmp.xml:'+toTemp );
			extension.saveFile(Extension.fileType.TEMP, callback, toTemp);
		} catch (e){
			widgetLogLevelLow( 'SHOUTCast Widget', 'saveXmlTemp - Exception: '+e );
		}
		return true;
	},
	saveConfigXml : function (_prefObject){
		widgetLogLevelLow( 'SHOUTCast Widget', 'Saving myloConfig.xml' );
		extension.saveFile( Extension.fileType.CONFIG, _this.saveConfigXmlCallBack, _prefObject.save() );	
	},
	saveConfigXmlCallBack : function(){
		widgetLogLevelLow( 'SHOUTCast Widget', 'myloConfig.xml was saved successfully!');
	},
	_afterDecodeBhv: function(){}
};
LAST_TUNED = 'lst';
shoutCastWidget.PLAY_MODE = 'play_mode';
shoutCastWidget.PLAY_MODE_PAUSED = 'play_mode_paused';
shoutCastWidget.SET_MODE = 'set_mode';
shoutCastWidget.CHANNEL_NUMBER = 'CH_NUMBER';
var _this = shoutCastWidget;
var init = function(){
	widgetLogEnable();
	document.getElementById('BASEDIV').style.visibility = 'visible';
	shoutCastWidget.start();
};
function widgetKeyDown(evt, key) {
	if( key == mylo.KeyCode.BACK ) {
	 	if (shoutCastWidget.widgetMode == shoutCastWidget.SET_MODE){
			shoutCastWidget.cancelBhv();		
		} else {
			return true;
		}
	}
	shoutCastWidget.innerSelect.keyEvent(evt, key);
	return false;
}
var widgetResize = function() {
	adjustSelectSize();
};
var outFocus = function(){
	if (shoutCastWidget.widgetMode == shoutCastWidget.SET_MODE){
		shoutCastWidget.cancelBhv();	
	} else {
		clearAllMarquee();
	}
};
var goBackground = function(){
	if (shoutCastWidget.widgetMode == shoutCastWidget.SET_MODE){
		shoutCastWidget.cancelBhv();	
	}
};
var goForeground = function() {
	widgetLogLevelLow( 'SHOUTCast Widget', 'goForeground()' );
	openWebFlg = false;
};
var disableWidget = function(){
	widgetLogLevelLow( 'SHOUTCast Widget', 'Disabling widget processes' );
	extension.releaseInterval('INRA');
	extension.stopRadio();
};
var adjustSelectSize = function(){
	widgetLogLevelLow( 'SHOUTCast Widget', 'Selector Resize' );
	try {
		var _width = windowWidth - 60;
		var _select = document.getElementById('SELECTOR'); 
		_select.style.width = _width+'px';
		_select.style.minWidth = _width+'px';
		_select.style.maxWidth = _width+'px';
		var _themeWidth = windowWidth - 60;
		var _themeName = document.getElementById('THEME_NAME');
		_themeName.style.width = _themeWidth+'px';
		_themeName.style.minWidth = _themeWidth+'px';
		_themeName.style.maxWidth = _themeWidth+'px';
		var _selectMarquee = document.getElementById('select_marquee');
		if (_selectMarquee){
			_selectMarquee.width = _width-45;
			_selectMarquee.setAttribute('width',_width-45);
		}
		var _themeMarquee = document.getElementById('theme_marquee');
		if (_themeMarquee){
			_themeMarquee.width = _width;
			_themeMarquee.setAttribute('width',_width);
		}
	} catch (e){
		widgetLogLevelLow( 'SHOUTCast Widget', 'Resize Exception: '+e );
	}
};
var marqueer = function(item,string,_modifier,_id){
		var _width = windowWidth - 60;
		var _marquee = window.document.createElement('MARQUEE');
		_marquee.innerHTML = string;
		_marquee.id = _id;
		_marquee.setAttribute('width',_width-_modifier);
		widgetLogLevelLow( 'SHOUTCast Widget', 'item.offsetHeight: '+ item.offsetHeight);
		_marquee.setAttribute('height',item.offsetHeight);
		_marquee.setAttribute('id',_id);
		_marquee.setAttribute('LOOP','1');
		_marquee.setAttribute('SCROLLAMOUNT','250');
		_marquee.setAttribute('SCROLLDELAY','1');
		_marquee.setAttribute('BEHAVIOR','SLIDE');
		_marquee.setAttribute('DIRECTION','LEFT');
		var _scrollAnchor = window.document.createElement('a');
		_scrollAnchor.id = _id+'_anchor';
		_scrollAnchor.href = '#';
		_scrollAnchor.setAttribute('onclick','return false;');
		_scrollAnchor.innerHTML = '<pre> </pre>';
		var dummyDiv = document.createElement('DIV');
		dummyDiv.appendChild(_marquee);
		_marquee.appendChild(_scrollAnchor);
		return dummyDiv.innerHTML;
};
var selectMarqueeOnClick = function(span,event){
	var _selectorSpan = document.getElementById('SELECTOR_SPAN');
	var _width = windowWidth - 60;
	if (_selectorSpan.offsetWidth >= _width){
		var _innerText = span.innerText;
		_selectorSpan.innerHTML = marqueer(span,_innerText,45,'select_marquee');
		widgetLogLevelLow( 'SHOUTCast Widget', 'Clearing timers: select' );
		_resetATimer(shoutCastWidget.selectTimerOut);
		shoutCastWidget.selectTimerOut = null;	
		widgetLogLevelLow( 'SHOUTCast Widget', 'Setting timers: select' );
		_selectRestoreFunc = caller(_restoreText,_selectorSpan,_innerText,false);
		shoutCastWidget.selectTimerOut = setTimeout(_selectRestoreFunc,60000);
	}
};
var clearThemeDisplay = function (){
	widgetLogLevelLow( 'SHOUTCast Widget', 'clearThemeDisplay' );
	var _themeMarquee = document.getElementById('theme_marquee');
	if (_themeMarquee){
		_restoreText(shoutCastWidget.nowPlayingDiv,'',true);
	} else {
		shoutCastWidget.nowPlayingDiv.innerHTML = '';
	}
};
var _selectRestoreFunc = function(){};
var themeMarqueeOnClick = function(span,event){
	var _width = windowWidth - 60;
	if (shoutCastWidget.nowPlayingDiv.offsetWidth >= _width){
		var _innerText = span.innerText;
		shoutCastWidget.nowPlayingDiv.innerHTML = marqueer(span,_innerText,0,'theme_marquee');
		widgetLogLevelLow( 'SHOUTCast Widget', 'Clearing timers: theme' );
		_resetATimer(shoutCastWidget.themeTimerOut);
		shoutCastWidget.themeTimerOut = null;
		widgetLogLevelLow( 'SHOUTCast Widget', 'Setting timers: theme' );
		_themeRestoreFunc = caller(_restoreText,shoutCastWidget.nowPlayingDiv,_innerText,true);
		shoutCastWidget.themeTimerOut = setTimeout(_themeRestoreFunc,60000);
	}
};
var setFontSizeAndText = function( element, setStr ) {
	var length = setStr.length;
	var fontSize = '24px';
	var i;
	for( i = 0; i < length; i++ ) {
		if( escape( setStr.charAt( i ) ).charAt( 1 ) == 'u' ) {
			fontSize = '20px';
			break;
		}
	}
	_this.nowPlayingDivBase.style.fontSize = fontSize;
	element.innerHTML = setStr;
};
var isMarqueeFinished = function(){
	var _width = windowWidth - 60;
	var _marqueeAnchor = document.getElementById('select_marquee_anchor');
	if (_marqueeAnchor){
		widgetLogLevelLow( 'SHOUTCast Widget', 'isMarqueeFinished -  marquee found' );
		var _anchorLeft = _marqueeAnchor.offsetLeft;
		widgetLogLevelLow( 'SHOUTCast Widget', 'isMarqueeFinished - width:'+ _width + ' - left:'+_anchorLeft);
		if (_anchorLeft <= _width){
			return true;
		}
	}
	return false;
};
var _themeRestoreFunc = function(){};
var _restoreText = function(_item,_text,marqueeFlag,extraParam){
	widgetLogLevelLow( 'SHOUTCast Widget', 'extraParam:'+ extraParam);
	widgetLogLevelLow( 'SHOUTCast Widget', 'Restoring to text before marquee' );
	_item.innerHTML = _text;
	if (marqueeFlag === true){
		widgetLogLevelLow('SHOUTCast Widget', 'Clearing timers: theme');
		_resetATimer(shoutCastWidget.themeTimerOut);
		shoutCastWidget.themeTimerOut = null;
		_themeRestoreFunc = function(){
		};
	} else {
		widgetLogLevelLow('SHOUTCast Widget', 'Clearing timers: select');
		_resetATimer(shoutCastWidget.selectTimerOut);
		shoutCastWidget.selectTimerOut = null;
		_selectRestoreFunc = function(){
		};
	}
};
var clearAllMarquee = function(){
	var _selectMarquee = document.getElementById('select_marquee');
	if (_selectMarquee){
		_selectRestoreFunc(true);
	}
	var _themeMarquee = document.getElementById('theme_marquee');
	if (_themeMarquee){
		_themeRestoreFunc(true);
	}
};
var openLogo = function(){
	widgetLogLevelLow( 'SHOUTCast Widget', 'Opening SHOUTCast Web Site' );
	callOpenWeb('http://www.shoutcast.com');
};
var playIfPlaying = function(){
	var _isNowPlayFlag = null;
	try {
		_isNowPlayFlag = isNowPlayingChannel();
		if (_isNowPlayFlag !== null && _isNowPlayFlag === true && isStatusOnPlay() === true) {
			shoutCastWidget._changePlayPauseIcon(shoutCastWidget.PLAY_MODE);
			widgetLogLevelLow('SHOUTCast Widget', 'playIfPlaying - Change to Play');
			if (shoutCastWidget.nowPlayJSONData !== null) {
				shoutCastWidget.nowPlayingDiv.innerHTML = shoutCastWidget.nowPlayJSONData.title;
			}
		} else 	{
			shoutCastWidget._changePlayPauseIcon(shoutCastWidget.PLAY_MODE_PAUSED);
			widgetLogLevelLow('SHOUTCast Widget', 'playIfPlaying - Change to Pause');	
			shoutCastWidget.nowPlayingDiv.innerHTML = '';
		}
		if (shoutCastWidget.playPauseButton !== null && shoutCastWidget.playPauseButton.enableFlag === false){
			shoutCastWidget.playPauseButton.enable();
		}
	} catch (e){
		widgetLogLevelLow('SHOUTCast Widget', 'playIfPlaying - Exception: '+e);
	}
	return _isNowPlayFlag;
};
var isStatusOnPlay = function(){
	var _result = false;
	var _data = shoutCastWidget.nowPlayJSONData;
	if (_data!==null){
		if (typeof(_data.status)!=='undefined' && _data.status == 'PLAY') {
			_result = true;
		}
	}
	return _result;
};
var isNowPlayingChannel = function(){
	try {
		if (shoutCastWidget.nowPlayIndex !== null) {
			var _selectedIndex = shoutCastWidget.innerSelect.scrollOffSet;
			var _selectedMap = shoutCastWidget.innerSelect.getMap(_selectedIndex);
			var _channelNumber = _selectedMap.get(shoutCastWidget.CHANNEL_NUMBER) - 0;
			if (_channelNumber === shoutCastWidget.nowPlayIndex) {
				widgetLogLevelLow( 'SHOUTCast Widget', 'Now playing station selected.' );
				return true;
			} else{
				widgetLogLevelLow( 'SHOUTCast Widget', 'Different from actual station selected.' );
				return false;
			}
		} else {
			widgetLogLevelLow( 'SHOUTCast Widget', 'No playing stations now' );
			return null;		
		}
	} catch (e){
		widgetLogLevelLow( 'SHOUTCast Widget', 'isNowPlayingChannel - Exception: '+e );
	}
};
var	caller = function(func, arg1,arg2,arg3) {
	return function(extraParam) { func(arg1,arg2,arg3,extraParam);};
};
var notifyCaller = function(func,arg1,arg2){
	return function(_callparam1,_callparam2){
		func(_callparam1,_callparam2,arg1,arg2);
	};
};
var playModeBtnProcess = function(){
	if (this.upButton !== null && this.downButton !== null){
		var _matrixLength = this.nodeMatrix.length;
		if ((this.scrollOffSet === 0 && shoutCastWidget.lastTunedFlag === false) || this.scrollOffSet == -1) this.downButton.disable();
		else if (this.downButton.enableFlag === false || (this.scrollOffSet === 0 && shoutCastWidget.lastTunedFlag === true)) this.downButton.enable();
		if (this.scrollOffSet > _matrixLength - 2 && this.scrollOffSet !== -1 || _matrixLength === 0) this.upButton.disable();
		else if (this.upButton.enableFlag === false || (_matrixLength >0 && this.scrollOffSet == -1)) this.upButton.enable();
	}
	_resetTimers();
};
var playModeBehaviour = function(index,_map){
	playIfPlaying();
};
var setModeBtnProcess = function(){
	if (this.upButton !== null && this.downButton !== null){
		if (this.scrollOffSet === 0) this.downButton.disable();
		else if (this.downButton.enableFlag === false) this.downButton.enable();
		if (this.scrollOffSet > this.nodeMatrix.length - 2) this.upButton.disable();
		else if (this.upButton.enableFlag === false) this.upButton.enable();
	}
	_resetTimers();
};
var setModeBehaviour = function(index,_map){
	var _prefItem = _map.get(Preferences.PREFS_ITEM);
	if (!_prefItem || _prefItem.value === ''){
		shoutCastWidget.clearButton.disable();
	} else {
		shoutCastWidget.clearButton.enable();
	}
};
var _resetTimers = function(){
	widgetLogLevelLow( 'SHOUTCast Widget', 'Clearing timers: select' );
	_resetATimer(shoutCastWidget.selectTimerOut);
	shoutCastWidget.selectTimerOut = null;
	_selectRestoreFunc = function(){};
	widgetLogLevelLow( 'SHOUTCast Widget', 'Clearing timers: theme' );
	_resetATimer(shoutCastWidget.themeTimerOut);
	shoutCastWidget.themeTimerOut = null;
	_themeRestoreFunc = function(){};
};
var _resetATimer = function (_timer){
	if (_timer !== null){
		widgetLogLevelLow( 'SHOUTCast Widget', 'Clearing timers:'+_timer );
		clearTimeout(_timer);
	}
};
var plsParser = {
	LINE_FEED : '\n',
	EQUAL : '=',
	ENTRY_OPEN : '<entry>',
	ENTRY_CLOSE : '</entry>',
	COMMA : ',',
	parsePls : function(strText){
		try {	
			var index = 0;
			var outputPlayList = new PlayList();
			var step1Array = strText.split('\n');
			var step1Length = step1Array.length;
			var step2Array = [];
			for (var i=0;i<=step1Length-1;i++){
				var _extract = step1Array[i];
				if (_extract.length < 3) continue;
				var _indExtract = _extract.indexOf('=');
				if (_indExtract!==-1){
					step2Array.push([_extract.substring(0,_indExtract),_extract.substring(_indExtract+1,_extract.length)]);
				} else {
					step2Array.push([_extract]);
				}
			}
			var step2Length = step2Array.length;
			if (step2Array[0][0] !== PlayList.PLAYLIST_TOKEN){
				return null;		
			}
			var listSizeToken = this.findToken(step2Array,index,PlayList.NUMBER_OF_ENTRIES_TOKEN);
			var listSize = null;
			if (listSizeToken === null){ 
				listSize = 1;
			} else {
				listSize = listSizeToken[0]-0;
			}
			outputPlayList.listSize = listSize;
			var versionToken = this.findToken(step2Array,index,PlayList.VERSION_TOKEN);
			if (versionToken !==null){
				outputPlayList.version = versionToken[0]-0;
			} 
			var index = 0;
			for (var y=1;y<=listSize;y++){
				var fileToken = this.findToken(step2Array,index,PlayList.FILE_TOKEN+y);
				if (fileToken === null) break;
				var titleToken = this.findToken(step2Array,fileToken[1]-0,PlayList.TITLE_TOKEN+y);
				titleToken[0] = titleToken[0].replace(/^\((\S+).*[0-9]\)(\s)/,'');
				var lengthToken = this.findToken (step2Array,titleToken[1]-0,PlayList.LENGTH_TOKEN+y);
				if (lengthToken === null) break;
				outputPlayList.entries.push(new PlayList.Entry(fileToken[0],titleToken[0],lengthToken[0]-0));
				index = lengthToken[1]-0;
			}
			return outputPlayList;
		} catch (e){
			widgetLogLevelLow( 'SHOUTCast Widget', 'Parse Exception:'+e );
		}
	},
	findToken : function(matrix,index,tofind){
		var matrixlen = matrix.length-1;
		for (var i=index;i<=matrixlen;i++){
			var token = matrix[i];
			if (token.length==2 && token[0]==tofind){
				return [token[1],i];
			}
		}
		return null;
	},
	serializePls : function(playList,compress){
		try {
			var _outPut = '';
			if (compress === false){
				_outPut += PlayList.PLAYLIST_TOKEN + plsParser.LINE_FEED;
				_outPut += PlayList.NUMBER_OF_ENTRIES_TOKEN+plsParser.EQUAL+playList.listSize+plsParser.LINE_FEED;
				var entries = playList.entries;
				var entriesLength = entries.length-1;
				for (var i=0;i<=entriesLength;i++){
					_outPut += PlayList.FILE_TOKEN+(i+1)+plsParser.EQUAL+entries[i].strmFile+plsParser.LINE_FEED;
					_outPut += PlayList.TITLE_TOKEN + (i + 1) + plsParser.EQUAL + '(#'+i+' - 1/100) '+entries[i].strmTitle + plsParser.LINE_FEED;
					_outPut += PlayList.LENGTH_TOKEN+(i+1)+plsParser.EQUAL+entries[i].strmLength+plsParser.LINE_FEED;
				}
				if (playList.version !==null){
					_outPut += PlayList.VERSION_TOKEN+plsParser.EQUAL+playList.version+plsParser.LINE_FEED;
				}
			} else {
				var entries = playList.entries;
				var entriesLength = entries.length-1;
				if (entriesLength > 19){
					entriesLength = 19;
				}
				var entryString = '';
				for (var i=0;i<=entriesLength;i++){
					if (entryString !== ''){
						entryString += plsParser.COMMA;
					}
					entryString += entries[i].strmFile;
				}
				_outPut = entryString;	
			}
			return _outPut;
		} catch (e){
			widgetLogLevelLow( 'SHOUTCast Widget', 'serializePls - Exception: '+e );
		}
	},
	_extractTag : function(_text,_tagName){
		var _xIndex = _text.indexOf('<'+_tagName+'>');
		var _yIndex = _text.indexOf('</'+_tagName+'>');
		return _text.substring(_xIndex+_tagName.length+2,_yIndex);
	},
	XMLtoPlsObject : function (prefItem){
		var _entries = null;
		var _title = prefItem.title;
		var _xmlString = prefItem.value;
		_entries = _xmlString.split(',');
		var _outputPls = new PlayList();
		_outputPls.listSize = _entries.length;
		widgetLogLevelLow( 'SHOUTCast Widget', 'XMLtoPlsObject - title: '+ _title);
		_outputPls.version = 2;
		var _entryLen = _entries.length;
		for (var i=0;i<_entryLen;i++){
			_outputPls.entries.push(new PlayList.Entry(_entries[i],_title,-1));
		}
		return _outputPls;
	}
};
function trim(text) {
	return text.replace(/^\s+|\s+$/g,"");
}
function PlayList(){
	this.listSize = null;
	this.version = null;
	this.entries = [];
	PlayList.Entry = function(_file,_title,_length){
		this.strmFile = _file;
		this.strmTitle = _title;
		this.strmLength = _length;
	};
}
PlayList.PLAYLIST_TOKEN = '[playlist]';
PlayList.FILE_TOKEN = 'File';
PlayList.TITLE_TOKEN = 'Title';
PlayList.LENGTH_TOKEN = 'Length';
PlayList.NUMBER_OF_ENTRIES_TOKEN = 'numberofentries';
PlayList.VERSION_TOKEN = 'Version';
function INetRadioButton(id,parent,normalImage,pushImage,disableImage) {
	this.id = null;
	this.normalImage = null;
	this.pushImage = null;
	this.disableImage = null;
	this.enableFlag = true;
	this.behaviour = null;
	this.myHtmlImage = null;
	this.container = null;
	this.init = function (id,parent,normalImage,pushImage,disableImage){
		preloadImages(normalImage,pushImage,disableImage);
		this.id = id;
		this.normalImage = normalImage;
		this.pushImage = pushImage;
		this.disableImage = disableImage;
		var _container = window.document.getElementById(parent);
		this.container = _container;
		var _button = window.document.getElementById(id);
		_button.id = id;
		_button.style.cursor = 'pointer';
		_container.setAttribute("onmousedown","this.myloButton.buttonDown(this,event)");
		_container.setAttribute("onmouseup","this.myloButton.release(this,event)");
		_container.myloButton = this;
		_container.style.cursor = 'pointer';
		this.myHtmlImage = _button;
	};
	this.buttonDown = function(btn,event){
		this.myHtmlImage.src = this.pushImage;
		if (this.behaviour) this.behaviour(btn);
		return false;
	};
	this.release = function(btn,event){
		this.myHtmlImage.src = this.normalImage;
		return false;
	};
	this.enable = function (){
		this.myHtmlImage.src= this.normalImage;
		this.container.setAttribute("onmousedown","this.myloButton.buttonDown(this,event)");
		this.container.setAttribute("onmouseup","this.myloButton.release(this,event)");
		this.enableFlag = true;
	};
	this.disable = function (){
		this.myHtmlImage.src = this.disableImage;
		this.container.setAttribute("onmousedown","");
		this.container.setAttribute("onmouseup","");
		this.enableFlag = false;
	};
	this.init(id,parent,normalImage,pushImage,disableImage);
}
function INetRadioTextButton(id,parent,normalColor,pushColor,disableColor) {
	this.id = null;
	this.normalColor = null;
	this.pushColor = null;
	this.disableColor = null;
	this.enableFlag = true;
	this.behaviour = null;
	this.myHtmlImage = null;
	this.container = null;
	this.init = function (id,parent,normalColor,pushColor,disableColor){
		this.id = id;
		this.normalColor = normalColor;
		this.pushColor = pushColor;
		this.disableColor = disableColor;
		var _container = window.document.getElementById(parent);
		this.container = _container;
		var _button = window.document.getElementById(id);
		_button.id = id;
		_button.style.cursor = 'pointer';
		_container.setAttribute("onmousedown","this.myloButton.buttonDown(this,event)");
		_container.setAttribute("onmouseup","this.myloButton.release(this,event)");
		_container.myloButton = this;
		_container.style.cursor = 'pointer';
		this.myHtmlImage = _button;
	};
	this.buttonDown = function(btn,event){
		this.myHtmlImage.style.color = this.pushColor;
		if (this.behaviour) this.behaviour(btn);
		return false;
	};
	this.release = function(btn,event){
		this.myHtmlImage.style.color = this.normalColor;
		return false;
	};
	this.enable = function (){
		this.myHtmlImage.style.color = this.normalColor;
		this.container.setAttribute("onmousedown","this.myloButton.buttonDown(this,event)");
		this.container.setAttribute("onmouseup","this.myloButton.release(this,event)");
		this.enableFlag = true;
	};
	this.disable = function (){
		this.myHtmlImage.style.color = this.disableColor;
		this.container.setAttribute("onmousedown","");
		this.container.setAttribute("onmouseup","");
		this.enableFlag = false;
	};
	this.init(id,parent,normalColor,pushColor,disableColor);
}
Function.prototype.bindAsEventListener = function(object) {
  	var __method = this;
  	return function(event) {
    	return __method.call(object, event || window.event);
  	};
};
function INetRadioSelector(parent_id) {
	this.nodeMatrix= [];
	this.scrollOffSet= 0;
	this.control = null;
	this.upButton= null;
	this.downButton= null;
	this.keyEvent =  null;
	this.id = null;
	this.value = null;
	this.behaviour = function(){};
	this.selectorText =  null;
	this.enableFlag = false;
	this.init = function(parent_id){
		var _control = window.document.getElementById(parent_id);
		this.control = _control;
		this.id = _control.id;
		this.control.mySelector = this;
		this.fullEnable();
	};
	this.exeBehaviour = function(){};
	this.fullEnable = function(){
		this.enableFlag = true;
		this.buttonProcess = playModeBtnProcess;
	};
	this.fullDisable = function(){
		this.enableFlag = false;
		this.buttonProcess = function(){
			if (this.upButton !== null && this.downButton !== null){
				this.upButton.disable();
				this.downButton.disable();
			}
		};
		this.buttonProcess();
	};
	this.buttonProcess = function() {};
	this.selectPreviousItem = function() {
		if (this.scrollOffSet > 0 || (this.scrollOffSet === 0 && shoutCastWidget.lastTunedFlag === true && shoutCastWidget.widgetMode !== shoutCastWidget.SET_MODE)){
			this.jumpTo(--this.scrollOffSet);
		}
	};
	this.selectNextItem = function() {
		if (this.scrollOffSet < (this.nodeMatrix.length - 1)){
			this.jumpTo(++this.scrollOffSet);
		}
  	};
	this.jumpTo = function (index){
		var _contentElement = this.getMap(index);
		this.scrollOffSet = index;
		this.behaviour(this.scrollOffSet,_contentElement);
		this.control.innerHTML = _contentElement.get(INetRadioSelector.STRING_VALUE);
		this.value = this.control.innerHTML;
		this.buttonProcess();
		var _selectorSpan = document.getElementById('SELECTOR_SPAN');
		if (_selectorSpan) {
			var _selectMarquee = document.getElementById('select_marquee');
			if (!_selectMarquee) {
				selectMarqueeOnClick(_selectorSpan, null);
			}
		}
	};
	this.getMap = function(index){
		if (index == -1){
			return this.nodeMatrix[LAST_TUNED];
		} else {
			return this.nodeMatrix[index];
		}
	};
	this.setElements = function(elements){
		var _nodeMatrix = [];
		for (var i = elements-1;i>=0;i--){
			var nodeBean = new Map();
			nodeBean.put(INetRadioSelector.STRING_VALUE,'<pre> </pre>');
			_nodeMatrix[i] = nodeBean;
		}
		this.nodeMatrix = _nodeMatrix;
	};
	this.setWidth = function(width){
		var _baseNode = this.control;
		_baseNode.style.width = width + "px";
	};
	this.getWidth = function(){
		return this.control.scrollWidth;
	};
	this.setHeight = function(height){
		var _baseNode = this.control;
		_baseNode.style.height = height + "px";
	};
	this.getHeight = function(){
		return this.control.scrollHeight;
	};
	this.updateItem = function(index,element){
		var _scrollOffSet = this.scrollOffSet;
		if (element === null){
			this.updateItemProperty(index,INetRadioSelector.STRING_VALUE,element);
		} else {
			if (typeof(element) == 'string'){
				if (index == _scrollOffSet){
					this.control.innerHTML = element;
				}
				this.updateItemProperty(index,INetRadioSelector.STRING_VALUE,element);
			} 
		}
		_scrollOffSet = null;
	};
	this.updateItemProperty = function(index,propName,propValue){
		this.getMap(index).put(propName,propValue);
	};
	this.setButtons = function (up,down){
		this.upButton = up;
		this.downButton = down;
		this.upButton.behaviour = function(){	shoutCastWidget.innerSelect.selectNextItem();};
		this.downButton.behaviour = function(){shoutCastWidget.innerSelect.selectPreviousItem();};
	};
	this.onKeyDown = function(evt) {
		evt = (evt) ? evt : ((window.event) ? event : null);
		if (evt) {
			switch (evt.keyCode) {
				case mylo.KeyCode.EXE:
					this.exeBehaviour();
					break;
				case mylo.KeyCode.LEFT:
					break;
				case mylo.KeyCode.UP:
					this.selectNextItem();
					break;
				case mylo.KeyCode.RIGHT:
					break;
				case mylo.KeyCode.DOWN:
					this.selectPreviousItem();
					break;
			}
		}
	};
	this.init(parent_id);
	this.keyEvent = this.onKeyDown.bindAsEventListener(this);
}
INetRadioSelector.PREVIOUS_BUTTON = 'PREVIOUS_BUTTON';
INetRadioSelector.NEXT_BUTTON = 'NEXT_BUTTON';
SELECT_STYLE = 'select';
INetRadioSelector.STRING_VALUE = 'string';
INetRadioSelector.HTML_ITEM = 'html_item';
INetRadioSelector.GLOBAL_INDEX = 'gbIndex';
function preloadImages()
{
	if (document.images)
	{
		var _imgName = preloadImages.arguments[0];
		var _cnt;
		imgBuffer[_imgName] = [];
		for (_cnt = 1; _cnt < preloadImages.arguments.length; _cnt++)
		{
			imgBuffer[_imgName][preloadImages.arguments[_cnt]] = new Image();
			imgBuffer[_imgName][preloadImages.arguments[_cnt]].src = preloadImages.arguments[_cnt];
		}
	}
}
var imgBuffer; imgBuffer = [];
