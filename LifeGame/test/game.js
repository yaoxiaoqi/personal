var gridSize = 10;
var gridCnt = 100;
var isStart = false;
var c,cxt;
var map,preMap;
var loop;
var lifeDens = 0.2;
var fRate = 10;
var lineColor = "#eeeeee";
var aliveColor = "#ffc0cb",
	deadColor = "#000000",
	wallColor = "#ffffff";
	


var init = function(){
	initMap();
	c = document.getElementById("myCanvas");
	cxt = c.getContext("2d");
	cxt.clearRect(0,0,myCanvas.width,myCanvas.height);	
	paintLine();
	randomMap();
	paint();
};

/*init map arrays*/
var initMap = function (){
	map = new Array(gridCnt);
	preMap = new Array(gridCnt);
	for (var i = 0;i < gridCnt;i++){
		map[i] = new Array(gridCnt);
		preMap[i] = new Array(gridCnt);
	}
	for(var i = 0;i < gridCnt;i++){
		for(var j = 0;j < gridCnt;j++){
			map[i][j] = 0;
			preMap[i][j] = -1;
		}
	}
};

/*paint line*/
var paintLine = function (){
	cxt.strokeStyle = lineColor;
    for (var i = 0; i <= gridCnt; i++) {
        cxt.moveTo(0, i * gridSize);
        cxt.lineTo(gridSize * gridCnt, i * gridSize);
    }
    for (var i = 0; i <= gridCnt; i++) {
        cxt.moveTo(i * gridSize, 0);
        cxt.lineTo(i * gridSize, gridSize * gridCnt);
    }
    cxt.stroke();
};

/*paint map*/
var paint = function () {
	cxt.save();
    for (var x = 0; x < map.length; x++) {
        for (var y = 0; y < map[x].length; y++) {
			if(map[x][y] === preMap[x][y]){
				continue;
			}
            if (map[x][y] == 1) {
				cxt.fillStyle = aliveColor;
                cxt.fillRect(y * gridSize + 1, x * gridSize + 1, gridSize - 2, gridSize - 2);
            }
			else if(map[x][y] == 0){
				cxt.fillStyle = deadColor;
				cxt.fillRect(y * gridSize + 1, x * gridSize + 1, gridSize - 2, gridSize - 2);
			}
			else{
				cxt.fillStyle = wallColor;
				cxt.fillRect(y * gridSize + 1, x * gridSize + 1, gridSize - 2, gridSize - 2);
			}
        }
    }
	cxt.restore();
};

function mouseClick(event) {
	var x = parseInt((event.offsetY) / gridSize);
    var y = parseInt((event.offsetX) / gridSize);
	if(map[x][y] != 2){
		map[x][y] = 2;
	}
    else{
		map[x][y] = 0;
	}
	//map[x][y] = !map[x][y];
    paint();
};

var isPositiveInt = function (str){
	return /^\+?[1-9]\d*$/.test(str);
};

var isNumber = function (str){
	return  ((/^[+,-]?\d+(\.\d*)?$/.test(str))||(/^\.\d+$/.test(str)));
};

var isCorrectFormat = function (gridCnt,fRate,lifeDens){
	if(!isPositiveInt(gridCnt) || parseInt(gridCnt)<20||parseInt(gridCnt)>110){
		//alert("网格规模应为20-110的正整数");
		return false;
	}
	if(!isNumber(fRate) ||parseFloat(fRate)<=0){
		//alert("帧率应为大于0的正数");
		return false;
	}
	if(!isNumber(lifeDens) || parseFloat(lifeDens) < 0||parseFloat(lifeDens)>1){
		//alert("活细胞密度应为0-1的正数");
		return false;
	}
	return true;
};

function submitForm() {
	stop();
	isStart = false;
	var a = document.getElementById ("gridCnt").value;
	var b = document.getElementById ("fRate").value;
	var c = document.getElementById ("lifeDens").value;
	if(isCorrectFormat(a,b,c)){
		gridCnt = parseInt(a);
		fRate = parseFloat(b);
		lifeDens = parseFloat(c);
		gridSize = myCanvas.width/gridCnt;
		init();
	}
};

function getStart(){
	isStart = !isStart;
	if(isStart){
		start();
	}
	if(!isStart){
		stop();
	}
}

/*randomize map*/
var randomMap = function (){
	for (var x = 0; x < map.length; x++) {
        for (var y = 0; y < map[x].length; y++) {
			map[x][y] = (Math.random() < lifeDens)? 1:0;
		}
	}
	//paint();
};

var judge = function (x,y){
	var lifecnt = 0;
	//判断墙壁
	if(map[x][y] === 2){
		return map[x][y];
	}
	for(var dx = -2;dx <= 2;dx++){
		if(dx === 0 || (x + dx) < 0 ||(x + dx) >= gridCnt){
			continue;
		}
		else{
			if(map[x + dx][y] == 1){
				lifecnt++;
			}
		}
	}
	for(var dy = -2;dy <= 2;dy++){
		if(dy === 0 ||(y + dy) < 0 ||(y + dy) >= gridCnt){
			continue;
		}
		else{
			if(map[x][y + dy] == 1){
				lifecnt++;
			}
		}
	}
	if(lifecnt === 3){
		return 1;
	}
	else if(lifecnt === 2){
		console.log("yo");
		return map[x][y];
	}
	else{
		return 0;
	}
};

/*change state*/
var change = function (){
	for (var i = 0;i < gridCnt;i++){
		for(var j = 0;j < gridCnt;j++){
			preMap[i][j] = judge(i,j);
		}
	}
	var temp;
	for (var i = 0;i < gridCnt;i++){
		for(var j = 0;j < gridCnt;j++){
			temp = map[i][j];
			map[i][j] = preMap[i][j];
			preMap[i][j] = temp;
		}
	}
};

var start = function (){
	loop = setInterval(function () {
		change();
        paint();
    }, 1000/fRate);
};

var stop = function (){
	clearInterval(loop);
};

/*press Enter key to start or pause*/
$(function(){  
	$(document).keydown(function (e) {
		if (e.keyCode == 83){
			isStart = !isStart;
			if(isStart){
				start();
			}
			if(!isStart){
				stop();
			}
		}
		else if (e.keyCode == 27) {
			isStart = false;
			stop();
			for (var i = 0; i < gridCnt; i++) {
				for (var j = 0; j < gridCnt; j++) {
					map[i][j] = 0;
					preMap[i][j] = -1;
				}
			}
			paint();
			
		}
	})
 });

 //just for testing
 window.__test__ = {
	 initMap_: initMap,
	 judge_: judge,
	 change_: change,
	 isNumber_:isNumber,
	 isPositiveInt_: isPositiveInt,
	 isCorrectFormat_: isCorrectFormat,
	 getGridCnt: function(){
		 return gridCnt;
	 },
	 setGridCnt: function(val){
		 gridCnt = val;
	 },
	 getGridSize: function(){
		 return gridSize;
	 },
	 setGridSize: function(val){
		 gridSize = val;
	 },
	 getLifeDens: function(){
		 return lifeDens;
	 },
	 setLifeDens: function(val){
		 lifeDens = val;
	 },
	 getMapElem: function(x,y){
		 return map[x][y];
	 },
	 setMapElem: function(x,y,val){
		 map[x][y] = val;
	 },
	 getPreMapElem: function(x,y){
		 return preMap[x][y];
	 },
	 setPreMapElem: function(x,y,val){
		 preMap[x][y] = val;
	 },
 }
 
 window.lifegame = init;


