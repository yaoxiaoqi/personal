Bridge.Game = function(game){
	this._player = null; //玩家
	this._boardGroup = null; //板子
	this.sprites = {}; //精灵族
    this._fontStyle = null; 
	Bridge._position = 0;
    Bridge._scoreText = null;
    Bridge._score = 0; //得分
    Bridge._health = 0; //小鸡仔的生命
	Bridge._chickSpeed = 0;
	Bridge._upSpeed = 0;
	Bridge._rotationSpeed = 0;
};

Bridge.Game.prototype = {
    create: function() { //初始化
		this._boardGroup = this.add.group();
        var background = this.add.sprite(0, 0, 'background'); //背景
		this.sprites.background = background;
		var water = this.add.sprite(0, Bridge.GAME_HEIGHT-370, 'water'); //水
		this.sprites.water = water;
		var cloud = this.add.sprite(50,0,'cloud');
		this.sprites.cloud = cloud;
		var score = this.add.sprite(10, 5, 'score-bg'); //得分
		this.sprites.score = score;
		var bgm = this.add.audio('bgm');
		this.sprites.bgm = bgm;
		this.sprites.bgm.play();
		var fallwater = this.add.audio('fallwater');
		this.sprites.fallwater = fallwater;
		//this._player = this.add.sprite(5, 760, 'chick-idle');
		//this._player.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12], 10, true);  //待修改，站着的动画
		//this._player.animations.play('idle'); //站着的动画
  
		//this._spawnBridgeTimer = 0;
		Bridge._health = 4; //小鸡仔的生命初始为3条命
		Bridge._position = Math.floor(0.1 * Bridge.GAME_WIDTH);
		Bridge._score = 0;
		Bridge._upSpeed = 10;
		Bridge._rotationSpeed = 0.314159;
		Bridge._chickSpeed = 10;
		//this.add.sprite(Bridge._position,GAME_HEIGHT-160,'board');
		
		this._fontStyle = { //分数字体的设定
			font: "40px Arial", 
			fill: "#FFCC00", 
			stroke: "#333", 
			strokeThickness: 5, 
			align: "center" 
		};
		Bridge._scoreText = this.add.text(120, 20, "0", this._fontStyle);
  
		
		
		this.sprites.chick = createChick(this);
		this.sprites.board1 = spawnBoard(this);
		this.sprites.board2 = spawnBoard(this,true);
		this.sprites.bridge = createBridge(this);
		
		
	},
	update: function() { //管理游戏的主循环
		//关卡时间
/* 		this._spawnCandyTimer += this.time.elapsed;
		if(this._spawnCandyTimer > 1000) {
			this._spawnCandyTimer = 0;
			Candy.item.spawnCandy(this);
		} */
		if(!Bridge._health){
			//this.add.sprite((Bridge.GAME_WIDTH-345)/2, (Bridge.GAME_HEIGHT-271)/2, 'game-over');
		}
	},
	isDownInTheRightArea:function(){
/* 		if(game.options.input=='touch'){
			var minY=Math.round((1-game.options.touchPercent)*game.world.height);
			if(game.input.activePointer.isDown&&game.input.activePointer.y>minY){
				return true;
			}
			return false;
		}
		else{ */
			if(this.input.activePointer.isDown){
				return true;
			}
			return false;
		}
	//}
};

//创建两个板子
function spawnBoard(game,flag) {
	var spawnGap = Math.floor(Math.max(Math.random(),0.1)*(Bridge.GAME_HEIGHT-270)); //设置第二个桥的位置 
	
	if(flag){
		var board = game.add.sprite(Bridge._position + game.camera.x + spawnGap+84,Bridge.GAME_HEIGHT-250,'board');
	}
	else{
		var board = game.add.sprite(Bridge._position + game.camera.x,Bridge.GAME_HEIGHT-250,'board'); 
	}
	return board;
	
	//game.input.onDown.add(createBridge, this);
	//console.log(this);
	//bridge.events..add(this.removeBridge,this);
    // ...
    // ...
};

function createBridge(game){
	var bridge = game.add.sprite(game.sprites.board1.x+84,Bridge.GAME_HEIGHT-250,'brick');
	bridge.anchor=new PIXI.Point(0,1);
	bridge.scale.setTo(0.3,0.3);
	bridge.state='inactive';
	bridge.cat=game.sprites.chick;
	bridge.show=function(){
		this.visible=true;
	};
	bridge.hide=function(){
		this.visible=false;
	};
	bridge.inactive=function(){};
	bridge.mount=function(){
		this.height=this.height+Bridge._upSpeed;
		game.sprites.chick.construct();
	};
	bridge.fall=function(){
		if(this.rotation>=1.5707){
			this.rotation=1.5707;
			this.state="none";
			game.sprites.chick.state="run";
		}
		else{
			this.rotation+=Bridge._rotationSpeed;
		}
	};
	bridge.fallMore=function(){
		if(this.rotation>=3.1414){
			this.rotation=3.1414;
		}
		else{this.rotation+=0.1;}
	};
	bridge.none=function(){};
	bridge.update=function(){
		if(this.state=='inactive'){
			this.hide();
		}
		if(this.state=='inactive'&&game.state.getCurrentState().isDownInTheRightArea()){
			this.state='mount';
		}
		if(this.state=='mount'&&!game.state.getCurrentState().isDownInTheRightArea()){
			this.state='fall';
		}
		if(this.state=='mount'){
			this.show();
		}
		this[this.state]();
	};
	bridge.hasRightSize=function(){
		if(this.x+this.height>=game.sprites.board2.x&&this.x+this.height<game.sprites.board2.x+84){
			return true;
		}
		else{
			//console.log(false);
			return false;
		}
	};
	bridge.getEnd=function(){
		return this.x+this.height;
	};
	return bridge;
};

function createChick(game){
	var chick = game.add.sprite(Bridge._position,Bridge.GAME_HEIGHT-250-60,'chick'); //设定鸡的初始位置（要改！）
	chick.scale.setTo(0.4,0.4);
	chick.animations.add('stop',[0],15,true);
	chick.animations.add('run',[0,1,2],15,true);
	chick.animations.add('construct',[3,4],15,true);
	chick.state='stop';
	chick.construct=function(){
		this.animations.play('construct');
		//game.sprites.crcrcr.play();
	};
	chick.run=function(){
		this.animations.play('run');
/* 		game.state.getCurrentState().livesText.x+=game.options.catSpeed;
		game.state.getCurrentState().durationText.x+=game.options.catSpeed;
		game.state.getCurrentState().scoreText.x+=game.options.catSpeed;
		game.state.getCurrentState().levelText.x+=game.options.catSpeed; */
		this.x += Bridge._chickSpeed;
		game.sprites.background.x += Bridge._chickSpeed;
		game.sprites.water.x += Bridge._chickSpeed;
		game.sprites.score.x += Bridge._chickSpeed;
		game.sprites.cloud.x += Bridge._chickSpeed;
		Bridge._scoreText.x += Bridge._chickSpeed;
/* 		if(game.options.input=='button'){
			game.sprites.button.x+=game.options.catSpeed;
		} */
		game.world.resize(game.world.width + Bridge._chickSpeed,Bridge.GAME_HEIGHT); //400为游戏宽度
		console.log(game.world.width);
		game.camera.x = this.x - Bridge._position;
		if(game.sprites.board2.x<=this.x&&game.sprites.bridge.hasRightSize()){
			this.state='stop';
			//game.sprites.miaou.play('',2.5);
			//game.state.getCurrentState().score=game.state.getCurrentState().score+game.options.pointPerBridge;
			//game.score=game.score+game.options.pointPerBridge;
			//game.state.getCurrentState().scoreText.text=game.options.scoreText+game.state.getCurrentState().score+game.options.scoreTextEnd;
/* 			if(game.level==0&&game.state.getCurrentState().score>=game.options.pointsToLevel1){
				game.level=1;
				if(game.options.difficulty+game.options.difficultyPerLevel<10){
					game.options.difficulty+=game.options.difficultyPerLevel;
				}
			}
			else if(game.state.getCurrentState().score>=(game.level+1)*game.options.percentToLevelUp*100&&game.level>=1){
				game.level++;
				if(game.options.difficulty+game.options.difficultyPerLevel<10){
					game.options.difficulty+=game.options.difficultyPerLevel;
				}
			} 
			game.state.getCurrentState().levelText.text=game.options.levelText+game.level+game.options.levelTextEnd; */
			game.sprites.board1.destroy();
			game.sprites.board1=game.sprites.board2;
			game.sprites.board2=spawnBoard(game,true);
			game.sprites.bridge.destroy();
			game.sprites.bridge=createBridge(game);
			Bridge._score += 5;
			Bridge._scoreText.setText(Bridge._score);
		}
		else if(!game.sprites.bridge.hasRightSize()&&game.sprites.bridge.getEnd()-this.width<=this.x){
			this.state='fall';
			
			game.sprites.fallwater.play();
			console.log("play");
			Bridge._score -= 10;
			Bridge._scoreText.setText(Bridge._score);
		}
	};
	chick.stop=function(){
		this.animations.play('stop');
	};
	chick.fall=function(){
		
		this.y=this.y+10;
		this.animations.play('construct');
		game.sprites.bridge.state='fallMore';
		if(this.y > Bridge.GAME_HEIGHT){
			Bridge._health--;
			//game.state.getCurrentState().livesText.text=game.options.livesText+game.state.getCurrentState().lives+game.options.livesTextEnd;
			if(Bridge._score < 0 || Bridge._health<= 0){
				game.add.sprite(((Bridge.GAME_WIDTH - 345)/2 + game.camera.x), (Bridge.GAME_HEIGHT-271)/2 - 40, 'game-over');
				game.add.button(((Bridge.GAME_WIDTH - 363)/2 + game.camera.x),Bridge.GAME_HEIGHT - 250,'button-restart', function(){game.state.start('Game');}, game,1,0,2);
				game.sprites.bgm.destroy();
				//game.state.start('Game');
			}
			else{this.state='respawn';}
		}
	};
	chick.respawn=function(){
		this.y=Bridge.GAME_HEIGHT-250-60;
		game.sprites.board2.x=this.x;
		game.sprites.board1.destroy();
		game.sprites.board1=game.sprites.board2;
		game.sprites.board2=spawnBoard(game,true);
		game.sprites.bridge.destroy();
		game.sprites.bridge=createBridge(game);
		//game.sprites.bgm.pause();
		this.state='stop';
	};
	chick.update=function(){
		this[this.state]();
	};
	return chick;
}