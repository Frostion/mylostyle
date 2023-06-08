/**
* 
* Calculator
*
* @fileoverview This is a sample Calculator.  The logic for the code is to (1) save all button presses from the user in the form of a string (ie. 3+2+6) and (2) utilize the eval javascript function to evaluate the string.
*
* Copyright (C) 2008 Sony Corporation
*
*/


/**
* eValString is passed to the eval() function for computation. When passing mathematical expressions to eval() the order of operation starts with 
* multiplication, division, addition, and then subtraction. Not taking this in consideration will often yield unexpected results. If you need to 
* evaluate a lower order operation first, surround that segment within a set of parenthesis.
*/
var eValString = "";
var operationFlag = 0; //This flag is set to 1 to avoid possible errors from entering two or more sequential operations.
var computationFlag = 0; //Value of 1 replaces parenthesis by telling the operation function to evaluate the prior expression and chain that result with the next operation.
var lastResult = 0; // Variable used for chaining the results until user clears everything.
var resultFlag = 0; //Value of 1 replaces parenthesis by telling the operation function to evaluate the prior expression and chain that result with the next operation.
var lastNumber = "";
var lastOperation = "";
var equalFlag = 0;
var isNum = 0;
var isPeriod = 0;
var display = "";

/**
* Clears all global variables and clears the calculator screen
*/
var clearDisplay = function(){
	eValString = "";
	computationFlag = 0;
	operationFlag = 0;
	lastResult = 0;
	resultFlag = 0;
	lastNumber = "";
	lastOperation = "";
	equalFlag = 0;
	isNum = 0;
	isPeriod = 0;
	display = "";
	document.getElementById("sumDisplay").innerHTML = "";
	document.getElementById("funcDisplay").innerHTML = "";
}

/**
* Handles all of the operation buttons on the calculator
*/
var operationClick = function(Operation){
	if(Operation == '/' && operationFlag == 0 && computationFlag == 1 || Operation == '*'  && operationFlag == 0 && computationFlag == 1 || Operation == '+' && operationFlag == 0 && computationFlag == 1 || Operation == '-'  && operationFlag == 0 && computationFlag == 1){

		document.getElementById("funcDisplay").innerHTML = Operation;
		equalFlag = 0;
		lastOperation = Operation;

		// This is the equivalent of surrounding a lower order operation within parenthesis by forcing an evaluation prior to the next operation.
		if(resultFlag == 1){
			lastResult = eval(eValString);
			eValString = lastResult
			document.getElementById("sumDisplay").innerHTML = lastResult;
		}
		eValString = eValString + Operation;
		operationFlag = 1;

	}else if(Operation == '=' && operationFlag == 0 && computationFlag == 1 ){

		//Handle equal being used in secession
		if(equalFlag == 1){
			eValString = eValString + lastOperation + lastNumber;
			lastResult = eval(eValString);
			eValString = lastResult
			document.getElementById("sumDisplay").innerHTML = lastResult;
		}else{
			lastResult = eval(eValString);
			eValString = lastResult
			equalFlag = 1;
			document.getElementById("sumDisplay").innerHTML = lastResult;
		}
	} 
	resultFlag = 1;
	isNum = 0;
	isPeriod = 0;
	display = "";
} 

/**
* Handles all of the number buttons on the calculator
*/
var numClick = function(NumberClick){
	if(NumberClick == '.' && isPeriod == 1){
		// do nothing
	}else{

		if(computationFlag == 0){
			computationFlag = 1; 
		}
		
		eValString = eValString + NumberClick;
		lastNumber = NumberClick;

		if(isNum == 1){
			display = display + NumberClick;
			document.getElementById("sumDisplay").innerHTML = display;
		}else{
			document.getElementById("sumDisplay").innerHTML = NumberClick;
			display = NumberClick;
		}

		operationFlag = 0;  
		isNum = 1;
	}

	if(NumberClick == '.'){
		isPeriod = 1;
	}
}

/**
* This event is triggered whenever a mylo button is pressed
*/
var widgetKeyDown  = function( evt, key ) {

	/**
	* Capture relevant button presses
	*/
	switch ( key ) {
		case mylo.KeyCode.N0:
			numClick('0');
		break;
		case mylo.KeyCode.N1:
			numClick('1');
		break;
		case mylo.KeyCode.N2:
			numClick('2');
		break;
		case mylo.KeyCode.N3:
			numClick('3');
		break;
		case mylo.KeyCode.N4:
			numClick('4');
		break;
		case mylo.KeyCode.N5:
			numClick('5');
		break;
		case mylo.KeyCode.N6:
			numClick('6');
		break;
		case mylo.KeyCode.N7:
			numClick('7');
		break;
		case mylo.KeyCode.N8:
			numClick('8');
		break;
		case mylo.KeyCode.N9:
			numClick('9');
		break;
		case mylo.KeyCode.PERIOD:
			numClick('.');
		break;
		case mylo.KeyCode.ENTER:
			operationClick('=');
		break;
		case mylo.KeyCode.BS:
			clearDisplay();
		break;
		case (mylo.KeyCode.FN_L || mylo.KeyCode.FN_R) && mylo.KeyCode.G:
			operationClick('+');
		break;
		case (mylo.KeyCode.FN_L || mylo.KeyCode.FN_R) && mylo.KeyCode.V:
			operationClick('*');
		break;
		case mylo.KeyCode.HYPHEN:
			operationClick('-');
		break;
		case mylo.KeyCode.SLASH:
			operationClick('/');
		break;
	}
}

var onMouseDownButton = function(_obj){
	var _imageId = _obj.id.substr(_obj.id.indexOf("_")+1,_obj.id.length); 
	_obj.src = "images/"+ _imageId +"_down.png";
}

var onMouseUpButton = function(_obj){
	var _imageId = _obj.id.substr(_obj.id.indexOf("_")+1,_obj.id.length); 
	_obj.src = "images/"+ _imageId +".png";
}