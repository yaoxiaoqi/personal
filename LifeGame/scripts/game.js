var gridSize = 10;
var gridCnt = 100;
var isStart = false;
var map;
var preMap;
var loop;
var lineColor = "#eeeeee";
var aliveColor = "#ffc0cb";
var deadColor = "#000000";
map = new Array(gridCnt);
preMap = new Array(gridCnt);
for (var i = 0;i < gridCnt;i++){
	map[i] = new Array(gridCnt);
	preMap[i] = new Array(gridCnt);
}

/*init map*/
for(var i = 0;i < gridCnt;i++){
	for(var j = 0;j < gridCnt;j++){
		map[i][j] = 0;
		preMap[i][j] = -1;
	}
}
var c = document.getElementById("myCanvas");
var cxt = c.getContext("2d");
paintLine();
initMap();
paint();

function paintLine(){
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
}

/*paint map*/
function paint() {
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
			else{
				cxt.fillStyle = deadColor;
				cxt.fillRect(y * gridSize + 1, x * gridSize + 1, gridSize - 2, gridSize - 2);
			}
        }
    }
	cxt.restore();
}

function mouseClick(event) {
    var y = parseInt((event.offsetX) / gridSize);
    var x = parseInt((event.offsetY) / gridSize);
    map[x][y] = !map[x][y];
    paint();
}

/*randomize map*/
function initMap(){
	map[25][50] = 1;
	map[26][49] = 1;
	map[26][50] = 1;
	map[26][51] = 1;
	map[27][50] = 1;
	map[28][49] = 1;
	map[28][50] = 1;
	map[28][51] = 1;
}

function judge(){
	var lifecnt = 0;
	if(arguments.length === 2){
		gridx = arguments[0];
		gridy = arguments[1];
	}
	for(var i = gridx - 1;i <= gridx + 1;i++){
		for(var j = gridy - 1;j <= gridy + 1;j++){
			if(i < 0 || j < 0 || i >= gridCnt || j>= gridCnt ||(i == gridx && j == gridy)){
				continue;
			}
			else{
				lifecnt += map[i][j];
			}
		}
	}
	if(lifecnt === 3){
		return 1;
	}
	else if(lifecnt === 2){
		return map[gridx][gridy];
	}
	else{
		return 0;
	}
}

/*change state*/
function change(){
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
}

function start() {
    loop = setInterval(function () {
		change();
        paint();
    }, 100);
}

function stop(){
	clearInterval(loop);
}



/*press Enter key to start or pause*/
$(function(){  
	$(document).keydown(function (e) {
		if (e.keyCode == 13){
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