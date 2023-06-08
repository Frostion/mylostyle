/**
* To-Do List
*
* @fileoverview A user manageable list of things to do with the ability to add, delete and complete tasks.
*
* Copyright (C) 2008 Sony Corporation
*/

/*
This widget sample demonstrates loading an XML file into mylo using XMLHttpRequest.
Saving information from mylo to an XML file within a widget directory.
Parses database records in an XML format and then migrating that database into an array.
Navigating through record sets using an array as the database engine.
Using array functions such as splice(),  push(), and pop() to add and delete array records.
Basically this widget is a miniature database engine which can be used to display information stored within XML files. 
*/

var extension = new Extension();
var current_rec = 0; // Array index value for the current record.
var first_rec = 0;  // Array index value for the first record.
var prev_rec = 0;  // Array index value for the previous record. This value increments or decrements.
var last_rec = 0; // Array index value for the last record. Subtract 1 because all arrays start with index of 0.
var next_rec = 1; // Array index value for the next record. This value increments or decrements.
var total_rec = 0; 
var addRecFlag = 0; // 0 = update and save record, 1 = insert and save record
var help_rec = 0;
var help_flag = 0;
var title_doc = "";
var loadString = "";
var loadCount = 0;
var http_request = false;
var theItem;
var theCompleted;
var theToDoID;


/**
* Initializes and displays the first To-Do record.
*/
function init(){
	loadList();
	goHelp();
}

/**
* Load the current to-do list
*/
function loadList(){
	makeRequest('temp.xml');
}

/**
* Create array for the database
*/
DoItemArray = new Array();

/**
* Use RequestHttp to load the XML file
*/
function makeRequest(url) {

	http_request = new RequestHttp();
	http_request.open('GET', url, generateDbArray);
	http_request.send(null);
} 

/**
* Parses the XML file and loads each item and child elements into the array used to navigate the database 
*/
function generateDbArray(flag, request) { 

	if(flag == true){
		var xmldoc = request.responseXML;
		
		if(xmldoc != ''){
			var root = xmldoc.getElementsByTagName('root').item(0); 
			var x=xmldoc.getElementsByTagName('item');

			total_rec = x.length;
			last_rec = total_rec - 1;
			document.getElementById("itemTotal").innerHTML = x.length;;

			for(i=0; i<x.length; i++) {
				var record = x[i];
				var xtheItem = record.getElementsByTagName("theItem")[0].textContent;
				var xtheCompleted = record.getElementsByTagName("theCompleted")[0].textContent;
				var xtheToDoID = record.getElementsByTagName("theToDoID")[0].textContent;

				DoItemArray.push(new newRecord(xtheItem, xtheCompleted, xtheToDoID));
			}
		}
	}
} 

/**
* Creates a new item record
*/
function newRecord(t_item,t_completed,t_doID) {
	this.t_item = t_item;
	this.t_completed = t_completed;
	this.t_doID = t_doID;
}

/**
* Add a new to-do item
*/
function addRec(){
	if(addRecFlag == 0){
		document.form1.Item.value = "";
		document.getElementById("itemID").innerHTML = DoItemArray.length + 1;
		document.form1.Completed.checked = false;
		addRecFlag = 1;
	}
}

/**
* Delete current to-do item
*/
function deleteRec(){
	if(addRecFlag == 0 && help_flag == 0){
		if(current_rec == last_rec){
			DoItemArray.pop();
			last_rec = DoItemArray.length - 1;
			total_rec = DoItemArray.length;
			current_rec = last_rec;
		}else{
			DoItemArray.splice(current_rec,1);
			last_rec = DoItemArray.length - 1;
			total_rec = DoItemArray.length;
		}
        
		if(DoItemArray.length == 0){
			current_rec = -1;
			total_rec = 0;
			goHelp();	
		}else{
			document.form1.Item.value = DoItemArray[current_rec].t_item;
			document.getElementById("itemID").innerHTML = current_rec + 1;
			document.getElementById("itemTotal").innerHTML = total_rec;

			if(DoItemArray[current_rec].t_completed == "True"){
				document.form1.Completed.checked = true;
			}else{
				document.form1.Completed.checked = false;
			}
		}
	}
}

/**
* Save the current list of items
*/
function saveList(){ 
if(help_flag == 0){
	if(addRecFlag == 1){ // 0 = update and save record, 1 = insert and save record
		theID = DoItemArray.length;
		theItem = document.form1.Item.value;

		if(document.form1.Completed.checked == true){
			theCompleted = "True";
		}else{
			theCompleted = "False";
		}
		
		theToDoID  = DoItemArray.length + 1 ;
		DoItemArray.push(new newRecord(theItem, theCompleted, theToDoID));
		last_rec = DoItemArray.length - 1;
		current_rec = last_rec;
		total_rec = DoItemArray.length;
		
		document.getElementById("itemTotal").innerHTML = total_rec;
		document.getElementById("itemID").innerHTML = DoItemArray.length;
		
		addRecFlag = 0;
	}else{
		DoItemArray[current_rec].t_item = document.form1.Item.value;
	}
	saveFile();
}
}
/**
* Write current item list to XML file
*/
function saveFile(){
	//BUILD XML STRING THEN SAVE TO TEMP.XML
	title_doc = "To-Do-List";
    var parseString;
	var arrayXMLLoop = DoItemArray.length;
	var rawTopTemp = '<?xml version="1.0" encoding="UTF-8"?><root>'+'<TheTitle>'+title_doc+'</TheTitle><data>';
	var rawBottomTemp = '</data></root>';
	var rawTempFile = rawTopTemp;
	var idCount = 0;

	for (var r = 0; r < arrayXMLLoop; r++) {
		parseString = "";
		parseString = replaceChars(DoItemArray[r].t_item);
		idCount = r+1;
		rawTempFile = rawTempFile+'<item><theToDoID>'+idCount+'</theToDoID><theItem>'+parseString+'</theItem><theCompleted>'+DoItemArray[r].t_completed+'</theCompleted></item>';
	}
	
	rawTempFile = rawTempFile+rawBottomTemp;

	extension.saveFile(Extension.fileType.TEMP, onSaveXML, rawTempFile); // complete path for the temp file
}

function replaceChars(oldString){
var stringItem = oldString;
var charValue = "&amp;";
stringItem = stringItem.replace(/&/g, charValue);
charValue = "&quot;";
stringItem = stringItem.replace(/"/g, charValue);
charValue = "&apos;";
stringItem = stringItem.replace(/'/g, charValue);
charValue = "&lt;";
stringItem = stringItem.replace("<", charValue);
charValue = "&gt;";
stringItem = stringItem.replace(">", charValue);
return  stringItem;
}

/**
* Callback from XML save function
*/
function onSaveXML(){
	// do nothing
}

/**
* Navigates the first record in the array.
*/
function goFirst(){
help_flag = 0;
addRecFlag = 0;

	current_rec = first_rec;

	document.form1.Item.value = DoItemArray[current_rec].t_item;
	document.getElementById("itemID").innerHTML = current_rec + 1;
	document.getElementById("itemTotal").innerHTML = total_rec;
	
	if(DoItemArray[current_rec].t_completed == "True"){
		document.form1.Completed.checked = true;
	}else{
		document.form1.Completed.checked = false;
	}
}

/**
* Navigates the previous record in the array.
*/
function goPrev(){
help_flag = 0;
addRecFlag = 0;

	if(current_rec != 0){
		current_rec = current_rec - 1;
	}

	document.form1.Item.value = DoItemArray[current_rec].t_item;
	document.getElementById("itemID").innerHTML = current_rec + 1;
	document.getElementById("itemTotal").innerHTML = total_rec;
	
	if(DoItemArray[current_rec].t_completed == "True"){
		document.form1.Completed.checked = true;
	}else{
		document.form1.Completed.checked = false;
	}
}

/**
* Navigates the next record in the array.
*/
function goNext(){
help_flag = 0;
addRecFlag = 0;

	if(current_rec != last_rec){
		current_rec = current_rec + 1;
	}

	document.form1.Item.value = DoItemArray[current_rec].t_item;
	document.getElementById("itemID").innerHTML = current_rec + 1;
    document.getElementById("itemTotal").innerHTML = total_rec;
	
	if(DoItemArray[current_rec].t_completed == "True"){
		document.form1.Completed.checked = true;
	}else{
		document.form1.Completed.checked = false;
	}
}

/** 
* Navigates the last record in the array.
*/
function goLast(){
help_flag = 0;
addRecFlag = 0;

	current_rec = last_rec;
	
	document.form1.Item.value = DoItemArray[current_rec].t_item;
	document.getElementById("itemID").innerHTML = current_rec + 1;
	document.getElementById("itemTotal").innerHTML = total_rec;
	
	if(DoItemArray[current_rec].t_completed == "True"){
		document.form1.Completed.checked = true;
	}else{
		document.form1.Completed.checked = false;
	}
}

/**
* Post completed status for current record
*/
function postChange(){
	if(document.form1.Completed.checked == true){
		DoItemArray[current_rec].t_completed = "True"; 
	}else{
		DoItemArray[current_rec].t_completed = "False";
	}
}

/**
* Shows the help screen
*/
function goHelp(){
		help_flag = 1

		document.form1.Item.value = document.form1.help1.value;
		document.getElementById("itemID").innerHTML = "Help";
		document.getElementById("itemTotal").innerHTML = total_rec;
}