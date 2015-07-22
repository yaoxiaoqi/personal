Bridge.Game = function(game){
	this._player = null; //玩家
	this._boardGroup = null; //板子
	this.sprites = {}; 
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
		var cloud = this.add.sprite(50,0,'cloud'); //云
		this.sprites.cloud = cloud;
		var score = this.add.sprite(10, 5, 'score-bg'); //得分
		this.sprites.score = score;
		var bgm = this.add.audio('bgm'); //背景音乐
		this.sprites.bgm = bgm;
		this.sprites.bgm.play();
		var fallwater = this.add.audio('fallwater'); //落水声
		this.sprites.fallwater = fallwater;
  
		Bridge._health = 4; //小鸡仔的生命初始为4条命
		Bridge._position = Math.floor(0.1 * Bridge.GAME_WIDTH);
		Bridge._score = 0;
		Bridge._upSpeed = 10;
		Bridge._rotationSpeed = 0.314159;
		Bridge._chickSpeed = 10;
		
		//分数字体的设定
		this._fontStyle = { 
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
	//管理游戏的主循环
	update: function() { 
	},
	//判断是否按下鼠标或者按屏幕
	isDownInTheRightArea:function(){
		if(this.input.activePointer.isDown){
			return true;
		}
		return false;
	}
};

//创建两个板子
function spawnBoard(game,flag) {
	var spawnGap = Math.floor(Math.max(Math.random(),0.1)*(Bridge.GAME_HEIGHT-270)); //设置第二个桥的位置 
	//板子1
	if(flag){
		var board = game.add.sprite(Bridge._position + game.camera.x + spawnGap+84,Bridge.GAME_HEIGHT-250,'board');
	}
	//板子2
	else{
		var board = game.add.sprite(Bridge._position + game.camera.x,Bridge.GAME_HEIGHT-250,'board'); 
	}
	return board;
};
//对象：桥
function createBridge(game){
	//加载图片
	var bridge = game.add.sprite(game.sprites.board1.x+84,Bridge.GAME_HEIGHT-250,'brick');
	bridge.anchor=new PIXI.Point(0,1);
	bridge.scale.setTo(0.3,0.3);
	bridge.state='inactive';
	bridge.chick=game.sprites.chick;
	
	bridge.show=function(){
		this.visible=true;
	};
	bridge.hide=function(){
		this.visible=false;
	};
	//未激活状态
	bridge.inactive=function(){};
	//可增长状态
	bridge.mount=function(){
		this.height=this.height+Bridge._upSpeed;
		game.sprites.chick.construct();
	};
	//下落状态
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
	//落水状态
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
	//判定桥是否搭上第二块木板
	bridge.hasRightSize=function(){
		if(this.x+this.height>=game.sprites.board2.x&&this.x+this.height<game.sprites.board2.x+84){
			return true;
		}
		else{
			return false;
		}
	};
	//用于获取桥尾部的横坐标
	bridge.getEnd=function(){
		return this.x+this.height;
	};
	return bridge;
};
//对象：小鸡
function createChick(game){
	var chick = game.add.sprite(Bridge._position,Bridge.GAME_HEIGHT-250-60,'chick'); //设定鸡的初始位置（要改！）
	chick.scale.setTo(0.4,0.4);
	chick.animations.add('stop',[0],15,true);
	chick.animations.add('run',[0,1,2],15,true);
	chick.animations.add('construct',[3,4],15,true);
	chick.state='stop';
	//自由落体状态
	chick.construct=function(){
		this.animations.play('construct');
	};
	//跑动状态
	chick.run=function(){
		this.animations.play('run');
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
			game.sprites.board1.destroy();
			game.sprites.board1=game.sprites.board2;
			game.sprites.board2=spawnBoard(game,true);
			game.sprites.bridge.destroy();
			game.sprites.bridge=createBridge(game);
			Bridge._score += 5;
			Bridge._scoreText.setText(Bridge._score);
		}
		//若没搭上第二块木板，且小鸡不在行走到了木板的尾端，则开始下落
		else if(!game.sprites.bridge.hasRightSize()&&game.sprites.bridge.getEnd()-this.width<=this.x){
			this.state='fall';
			
			game.sprites.fallwater.play();
			Bridge._score -= 10;
			Bridge._scoreText.setText(Bridge._score);
		}
	};
	//静止状态
	chick.stop=function(){
		this.animations.play('stop');
	};
	//落水状态
	chick.fall=function(){
		if(this.y <= Bridge.GAME_HEIGHT){
			this.y=this.y+10;
			this.animations.play('construct');
			game.sprites.bridge.state='fallMore';
		}
		//当小鸡掉出画面则执行惩罚操作
		else{
			Bridge._health--;
			if(Bridge._score < 0 || Bridge._health <= 0){
				this.state = 'stop';
				game.add.sprite(((Bridge.GAME_WIDTH - 345)/2 + game.camera.x), (Bridge.GAME_HEIGHT-271)/2 - 40, 'game-over');
				game.add.button(((Bridge.GAME_WIDTH - 363)/2 + game.camera.x),Bridge.GAME_HEIGHT - 250,'button-restart', function(){game.state.start('Game');}, game,1,0,2);
				game.sprites.bgm.destroy();
			}
			else{this.state='respawn';}
		}
	};
	//重建状态
	chick.respawn=function(){
		this.y = Bridge.GAME_HEIGHT - 250 - 60;
		game.sprites.board2.x = this.x;
		game.sprites.board1.destroy();
		game.sprites.board1 = game.sprites.board2;
		game.sprites.board2 = spawnBoard(game,true);
		game.sprites.bridge.destroy();
		game.sprites.bridge = createBridge(game);
		this.state='stop';
	};
	chick.update=function(){
		this[this.state]();
	};
	return chick;
}