/**
* World Clock
*
* @fileoverview A world clock that uses the foreground timer to show minute and hour hands. The timezone offset is user-selectetable through widget preferences.
*
* Copyright (C) 2008 Sony Corporation
*/

var extension = new Extension();
var timezone = "";
var locationName = "";
var curDate;

/**
* Checks the minute and hour functions to update the clock
*/
var init = function(){
	//Set initial variables
	tzOffReq = "";
	locationName = "";
	curHour = -1;
	curMin = -1;

	//timezone offset initially set to the current one
	curDate = new Date();
	timezone = curDate.getTimezoneOffset();

	// Set the initial time 
	changeTime();
	ctInterval = setInterval(changeTime, 60000);
	  
	//Enable the preferences menu
	prefObject = new Preferences(prefCallback);

}

/**
* Acquire the preferences information
*/
var prefCallback = function() {

	_tz = prefObject.getItemByName('timezone');

	for (_i = 0; _i < _tz.options.length; _i++){
		if (_tz.value == _tz.options[_i].text){

			if(_tz.value == "mylo System Time"){

				timezone = curDate.getTimezoneOffset();
				locationName = "";

			}else{
				timezone = _tz.options[_i].value;
				_ln = _tz.value;

				//Name to be displayed inside the clock, first remove the GMT offset at the beginning of the string
				locationName = _ln.slice(_ln.indexOf(" "));
			}
			break;
		}
	}
	
	//Update the time to the new TZ
	changeTime();

	notifyReadyWidget();
	return prefObject;
};


/**
* Callback when the preference starts
*/
var getPreferenceObject = function() {
	return prefObject;
}


/**
* Callback when the preference ends
*/
var changePreference = function(prefObject, updateFlag) {
	if (updateFlag == true){
		extension.saveFile(Extension.fileType.CONFIG, saveCallback, prefObject.save());  
		prefCallback();
	}
	return;
}


/**
* Callback when the preference is saved
*/
var saveCallback = function() {};


/**
* Change the clock time
*/
var changeTime = function(){

	//Get the current Date/Time
	var today = new Date();

	//Check for numeric timezone info from preferences
	if(tzOffReq != timezone){
		//Requested timezone offset from GMT in minutes
		tzOffReq = timezone;
	}

	//Current timezone offset from GMT in minutes
	tzOffCur = today.getTimezoneOffset();

	//Should only happen when clock starts for the first time on device
	if(isNaN(tzOffReq)){
		tzOffReq = tzOffCur;
	}

	//Timezone offset to adjust the current time by in milliseconds
	tzOff = (tzOffCur - tzOffReq) * 60000;

	//Time in milliseconds since 1/1/1970
	timeCode = today.getTime() + tzOff;

	//New date using the requested new timezone;
	today.setTime(timeCode);

	//Store the time elements
	var hour = today.getHours();
	var min = today.getMinutes();



	//Hands rotate twice in a 24 hour day
	if(hour >= 12) { hourUS = hour - 12; } else { hourUS = hour; }

	//Change hour settings when the hour changes
	if(curHour != hourUS){

		//Change the hour hand
		curHour = hourUS;
		document.getElementById("hourhand").src = "images/hours/"+hourUS+".png";

		//Display AM/PM
		if(hour >= 0 && hour <= 11){
			 document.getElementById("ampm").innerHTML = "AM";
		}else{
			document.getElementById("ampm").innerHTML = "PM";
		}

		//Display a yellow AM/PM during the day and grey AM/PM during the night hours
		if(hour >= 6 && hour <= 17){
			document.getElementById("ampm").style.color = "yellow";
		}else{
			document.getElementById("ampm").style.color = "#BBBBBB";
		}
	}

	//Change the minute hand when the minute changes
	if(curMin != min){
		curMin = min;
		document.getElementById("minutehand").src = "images/minutes/"+min+".png";
	}

 

	//Change the location name if the time zone has changed
	if(document.getElementById("locationName").innerHTML != locationName){
		document.getElementById("locationName").innerHTML = locationName;
	}
}
