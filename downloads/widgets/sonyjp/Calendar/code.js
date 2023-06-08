/**
* Calendar
*
* @fileoverview A simple calendar with current day highlighting.
*
* Copyright (C) 2008 Sony Corporation
*/
var Calendar;
var weekday;
var today;
var month;
var year;


/**
* Initialize
*/
var init = function(){  
	showCal();
	widgetLogEnable();
	widgetLogLevelLow('Calendar','init');
}

/**
* Build and display calendar
*/
var showCal = function() {

	//  Set Arrays for the Days and Months
	var dow = new Array('S','M','T','W','T','F','S');
	var moy = new Array('January','February','March','April','May','June','July','August','September','October','November','December');

	//  Init Vars
	Calendar = new Date();
	weekday = Calendar.getDay();    // get Day
	today = Calendar.getDate();    // get Date
	month = Calendar.getMonth();    // get Month
	year = Calendar.getFullYear();	    // get year

	var DAYS_OF_WEEK = 7;    // Always 7 Days in a week
	var DAYS_OF_MONTH = 31;    // Always 31 days in a month
	var cal;

	Calendar.setDate(1);    // Start the calendar day at '1'
	Calendar.setMonth(month);    // Start the calendar month at now

	// Formatting
	var TR_start = '<TR>';
	var TR_end = '</TR>';
	var highlight_start = '<TD WIDTH="30"><TABLE CELLSPACING=0 CLASS="today"><TR><TD WIDTH=20><CENTER>';
	var highlight_end   = '</CENTER></TD></TR></TABLE>';
	var TD_start = '<TD WIDTH="30" CLASS="day"><CENTER>';
	var TD_end = '</CENTER></TD>';
	cal =  '<TABLE BORDER=0 CELLSPACING=0 CELLPADDING=0><TR><TD>';
	cal += '<TABLE BORDER=0 CELLSPACING=0 CELLPADDING=2>' + TR_start;
	cal += '<TD CLASS="year" COLSPAN="' + DAYS_OF_WEEK + '" ><CENTER>';
	cal += moy[month]  + ' ' + year + TD_end + TR_end;
	cal += TR_start;

	// Loops for the week
	for(index=0; index < DAYS_OF_WEEK; index++){
		// Highlight Today's Date
		if(weekday == index){
			cal += TD_start + dow[index] + TD_end;
		// Display Day
		}else{
			cal += TD_start + dow[index] + TD_end;
		}
	}

	cal += TD_end + TR_end;
	cal += TR_start;

	for(index=0; index < Calendar.getDay(); index++){
		cal += TD_start + '  ' + TD_end;
	}

	for(index=0; index < DAYS_OF_MONTH; index++){

		if( Calendar.getDate() > index ){

			week_day =Calendar.getDay();

			// Start new row
			if(week_day == 0){
				cal += TR_start;
			}

			if(week_day != DAYS_OF_WEEK){
				// var loop for incrementing
				var day  = Calendar.getDate();

				// Today's Day
				if( today==Calendar.getDate() ){
					cal += highlight_start + day + highlight_end + TD_end;
				// Display Day
				}else{
					cal += TD_start + day + TD_end;
				}
			}

			// Last Row for end of month
			if(week_day == DAYS_OF_WEEK){
				cal += TR_end;
			}
		}

		// Increment dates until end of month
		Calendar.setDate(Calendar.getDate()+1);

	}// End for loop

	cal += '</TD></TR></TABLE></TABLE>';

	document.getElementById("calendar").innerHTML = cal;
}

/**
* Check for new date when Screen is shown
*/
var goForeground = function(){
	var _date = new Date();

	widgetLogLevelLow('Calendar',_date.getDate() + " " + today);
		
	if(_date.getDate() != today){
		init();	
	}
}

