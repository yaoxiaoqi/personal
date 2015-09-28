var gridSize = 10;
var gridCnt = 100;
var isStart = false;
var map;
var aroundCnt;
var loop;
map = new Array(gridCnt);
aroundCnt = new Array(gridCnt);
for (var i = 0;i < gridCnt;i++){
	map[i] = new Array(gridCnt);
	aroundCnt[i] = new Array(gridCnt);
}

for(var i = 0;i < gridCnt;i++){
	for(var j = 0;j < gridCnt;j++){
		map[i][j] = 0;
		aroundCnt[i][j] = 0;
	}
}
var c = document.getElementById("myCanvas");
var cxt = c.getContext("2d");
cxt.fillStyle = "#000000";
paint();


function paint() {
	cxt.save();
    cxt.fillStyle = "#000000";
	cxt.strokeStyle = "#eeeeee";
    for (var i = 0; i <= gridCnt; i++) {
        cxt.moveTo(0, i * gridSize);
        cxt.lineTo(gridSize * gridCnt, i * gridSize);
    }
    for (var i = 0; i <= gridCnt; i++) {
        cxt.moveTo(i * gridSize, 0);
        cxt.lineTo(i * gridSize, gridSize * gridCnt);
    }
    cxt.stroke();
    for (var x = 0; x < map.length; x++) {
        for (var y = 0; y < map[x].length; y++) {
			if(aroundCnt[x][y] === 2){
				continue;
			}
            if (map[x][y] == 1) {
				cxt.fillStyle = "#ffc0cb";
                cxt.fillRect(y * gridSize + 1, x * gridSize + 1, gridSize - 2, gridSize - 2);
            }
			else{
				cxt.fillStyle = "#000000";
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
	return lifecnt;
}

function change(){
	for (var i = 0;i < gridCnt;i++){
		for(var j = 0;j < gridCnt;j++){
			aroundCnt[i][j] = judge(i,j);
		}
	}
	for (var i = 0;i < gridCnt;i++){
		for(var j = 0;j < gridCnt;j++){
			if(aroundCnt[i][j] === 3){
				if(map[i][j] === 1){
					aroundCnt[i][j] = 2;
				}
				else{
					map[i][j] = 1;
				}
			}
			else if(aroundCnt[i][j] === 2){
			}
			else{
				if(map[i][j] === 0){
					aroundCnt[i][j] = 2;
				}
				else{
					map[i][j] = 0;
				}	
			}
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

 $(function(){   
      $(document).keypress(function (e) {
	  if (e.keyCode == 13){
        isStart = !isStart;
		if(isStart){
			start();
		}
		if(!isStart){
			stop();
		}
	  }
     })
 });