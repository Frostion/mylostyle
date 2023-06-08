/**
* Slide Puzzle
*
* @fileoverview A 16 piece picture puzzle with a shuffle function that re-orders the pieces. 
*
* Copyright (C) 2008 Sony Corporation
*/

var emptyId = null;
var emptyFn = "images/empty.png";
var pic = new Array();
var pfn = new Array();
var cpn = new Array();
var gameLevel = 100;

var _pfn = function (i) {
	if (i == emptyId) {
		return emptyFn;
	}
	else {
		return pfn[i];
	}
}

var coordX = function (i) {
	return (i % 4);
}

var coordY = function (i) {
	return ((i - (i % 4)) / 4);
}

var tileId = function (x, y) {
	return (x + 4 * y);
}

var isEmpty = function (i) {
	if (0 > i) {
		return (false);
	}
	if (i > 15) {
		return (false);
	}
	return (cpn[i] == emptyId);
}

var isEmptyXY = function (x, y) {
	if (0 > x) {
		return (false);
	}
	if (x > 3) {
		return (false);
	}
	if (0 > y) {
		return (false);
	}
	if (y > 3) {
		return (false);
	}
	return (cpn[x + 4 * y] == emptyId);
}

var swapTile = function (i, j) {
	var cpnF = cpn[i];
  	cpn[i] = cpn[j];
	cpn[j] = cpnF;
	pic[i].src = _pfn(cpn[i]);
	pic[j].src = _pfn(cpn[j]);
}

var moveTile = function (moveFrom, moveTo) {
	if (isEmpty(moveTo)) {
		moveFromX = coordX(moveFrom);
		moveFromY = coordY(moveFrom);
		moveToX = coordX(moveTo);
		moveToY = coordY(moveTo);
		if (moveFromX == moveToX) {
			if (((moveFromY - moveToY) * (moveFromY - moveToY)) == 1) {
				swapTile (moveFrom, moveTo);
			}
		}
		else if (moveFromY == moveToY) {
			if (((moveFromX - moveToX) * (moveFromX - moveToX)) == 1) {
				swapTile (moveFrom, moveTo);
			}
		}
	}
}

var rand4 = function () {
	var n = Math.floor(4 * Math.random());
	if (n == 4) {
		n = rand4();
	}
	return (n);
}

var shuffle = function () {
	var table = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
	var c, i, j, ix, iy, m;
	var locE = 15;

	for (c = gameLevel; c > 0; c --) {
		i = locE;
		ix = coordX(i);
		iy = coordY(i);
		m = rand4();
		switch (m) {
		 case 0:
			if (ix > 0) {
				j = tileId(ix - 1, iy);
			}
			else {
				continue;
			}
			break;
		 case 1:
			if (3 > ix) {
				j = tileId(ix + 1, iy);
			}
			else {
				continue;
			}
			break;
		 case 2:
			if (iy > 0) {
				j = tileId(ix, iy - 1);
			}
			else {
				continue;
			}
			break;
		 case 3:
			if (3 > iy) {
				j = tileId(ix, iy + 1);
			}
			else {
				continue;
			}
			break;
		 default:
			break;
		}
		swapTile (i, j);
		locE = j;
	}
	gameLevel += rand4();
}
	
var clickTile = function (i) {	
	if (isEmpty(i)) {
		// do nothing
	}
	else {
		var X = coordX(i);
		var Y = coordY(i);
		if (isEmptyXY(X - 1, Y)) {
			moveTile(i, tileId(X - 1, Y));
			return;
		}
		if (isEmptyXY(X + 1, Y)) {
			moveTile(i, tileId(X + 1, Y));
			return;
		}
		if (isEmptyXY(X, Y-1)) {
			moveTile(i, tileId(X , Y - 1));
			return;
		}
		if (isEmptyXY(X, Y+1)) {
			moveTile(i, tileId(X, Y + 1));
			return;
		}
	}
}

var initSixteenImage = function () {
	var i, j;
	for (i = 16; i > 0; i --) {
		j = i - 1;
		pic[j].src=pfn[cpn[j]];
	}
}

var initSixteenStart = function () {
	emptyId = 15;
	pic[cpn[emptyId]].src=emptyFn;
}

var initSixteen = function () {
	pic[0] = document.images["body11i"];
	pic[1] = document.images["body21i"];
	pic[2] = document.images["body31i"];
	pic[3] = document.images["body41i"];
	pic[4] = document.images["body12i"];
	pic[5] = document.images["body22i"];
	pic[6] = document.images["body32i"];
	pic[7] = document.images["body42i"];
	pic[8] = document.images["body13i"];
	pic[9] = document.images["body23i"];
	pic[10] = document.images["body33i"];
	pic[11] = document.images["body43i"];
	pic[12] = document.images["body14i"];
	pic[13] = document.images["body24i"];
	pic[14] = document.images["body34i"];
	pic[15] = document.images["body44i"];

	pfn[0] = "images/pic01.png";
	pfn[1] = "images/pic02.png";
	pfn[2] = "images/pic03.png";
	pfn[3] = "images/pic04.png";
	pfn[4] = "images/pic05.png";
	pfn[5] = "images/pic06.png";
	pfn[6] = "images/pic07.png";
	pfn[7] = "images/pic08.png";
	pfn[8] = "images/pic09.png";
	pfn[9] = "images/pic10.png";
	pfn[10] = "images/pic11.png";
	pfn[11] = "images/pic12.png";
	pfn[12] = "images/pic13.png";
	pfn[13] = "images/pic14.png";
	pfn[14] = "images/pic15.png";

	{
		var i;
		for (i = 16; i > 0; i --) {
			cpn[i-1] = i - 1;
		}
	}

	initSixteenImage();
	initSixteenStart();
	shuffle();
}

var init = function() {
	initSixteen();
}