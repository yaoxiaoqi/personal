Bridge.Game = function(game) {
    this._player = null; //玩家
	this._boardGroup = null; //板子
    //this._fontStyle = null;
	//Bridge._position = 0;
    //Bridge._scoreText = null;
    //Bridge._score = 0; //得分
    Bridge._health = 0; //小鸡仔的生命
	Bridge._upSpeed = 0;
	Bridge._rotationSpeed = 0;
	Bridge._isThrough = false;
	Bridge._isOnDown = false;
};
Bridge.Game.prototype = {
    create: function() { //初始化
        this.add.sprite(0, 0, 'background'); //背景
		this.add.sprite(-30, Bridge.GAME_HEIGHT-160, 'water'); //水
		
		//this.add.sprite(10, 5, 'score-bg'); //得分
		//this.add.button(Bridge.GAME_WIDTH-96-10, 5, 'button-pause', this.managePause, this); //暂停键
  
		//this._player = this.add.sprite(5, 760, 'chick-idle');
		//this._player.animations.add('idle', [0,1,2,3,4,5,6,7,8,9,10,11,12], 10, true);  //待修改，站着的动画
		//this._player.animations.play('idle'); //站着的动画
  
		//this._spawnBridgeTimer = 0;
		Bridge._health = 3; //小鸡仔的生命初始为3条命
		Bridge._position = Math.floor(0.1 * GAME_WIDTH);
		Bridge._upSpeed = 10;
		Bridge._rotationSpeed = 0.314159;
		//this.add.sprite(Bridge._position,GAME_HEIGHT-160,'board');
		
		this._fontStyle = { //分数字体的设定
			font: "40px Arial", 
			fill: "#FFCC00", 
			stroke: "#333", 
			strokeThickness: 5, 
			align: "center" 
		};
		//Bridge._scoreText = this.add.text(120, 20, "0", this._fontStyle);
  
		this._boardGroup = this.add.group();
		Bridge.item.spawnBoard(this);
	},
	update: function() { //管理游戏的主循环
		//关卡时间
/* 		this._spawnCandyTimer += this.time.elapsed;
		if(this._spawnCandyTimer > 1000) {
			this._spawnCandyTimer = 0;
			Candy.item.spawnCandy(this);
		} */
		if(Bridge._isThrough){
			Bridge.item.spawnBoard(this);
		}
		if(!Bridge._health){
			this.add.sprite((Candy.GAME_WIDTH-594)/2, (Candy.GAME_HEIGHT-271)/2, 'game-over');
			Bridge._isThrough = false;
		}
	},
	isDownInTheRightArea:function(){
		if(game.options.input=='touch'){
			var minY=Math.round((1-game.options.touchPercent)*game.world.height);
			if(game.input.activePointer.isDown&&game.input.activePointer.y>minY){
				return true;
			}
			return false;
		}
		else{
			if(game.input.activePointer.isDown){
				return true;
			}
			return false;
		}
	}
};
Bridge.item = {
	//增加新桥
	spawnBoard:function(game) {
		var spawnGap = Math.floor(Math.max(Math.random()*0.7,0.05)*Bridge.GAME_WIDTH); //设置第二个桥的位置 
		//var bridgeType = Math.floor(Math.random()*5); //0普通的桥,1静止时间，2增加分数，3飞行，4减少分数
		var board1 = game.add.sprite(Bridge._position,GAME_WIDTH-150,'board'); //创建两个板子
		var board2 = game.add.sprite(Bridge._position+spawnGap+84,GAME_WIDTH-150,'board');
		
		game.events.onDown.add(this.createBridge, this);
		
		game._boardGroup.add(board1);
		game._boardGroup.add(board2);
		//bridge.events..add(this.removeBridge,this);
        // ...
        // ...
    },
	createBridge: function(){
		var bridge = game.add.sprite(game.sprites.board1.x+game.sprites.board1.width,GAME_HEIGHT-150);
		bridge.anchor=new PIXI.Point(0,1);
		bridge.scale.setTo(0.3,0.3);
		bridge.state='inactive';
		bridge.show=function(){
			this.visible=true;
		};
		bridge.hide=function(){
			this.visible=false;
		};
		bridge.inactive=function(){};
		bridge.mount=function(){
			this.height=this.height+Bridge._upSpeed;
			//game.sprites.cat.construct();
		};
		bridge.fall=function(){
			if(this.rotation>=1.5707){
				this.rotation=1.5707;
				this.state="none";
				//game.sprites.cat.state="run";
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
			if(this.x+this.height>game.sprites.board2.x&&this.x+this.height<game.sprites.board2.x+game.sprites.board2.width){
				return true;
			}
			else{return false;}
		};
		bridge.getEnd=function(){
			return this.x+this.height;
		};
		return bridge;
	}
};