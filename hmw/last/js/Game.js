Bridge.Game = function(game){
	this._player = null; //���
	this._boardGroup = null; //����
	this.sprites = {}; 
    this._fontStyle = null; 
	Bridge._position = 0;
    Bridge._scoreText = null;
    Bridge._score = 0; //�÷�
    Bridge._health = 0; //С���е�����
	Bridge._chickSpeed = 0;
	Bridge._upSpeed = 0;
	Bridge._rotationSpeed = 0;
};

Bridge.Game.prototype = {
    create: function() { //��ʼ��
		this._boardGroup = this.add.group();
        var background = this.add.sprite(0, 0, 'background'); //����
		this.sprites.background = background;
		var water = this.add.sprite(0, Bridge.GAME_HEIGHT-370, 'water'); //ˮ
		this.sprites.water = water;
		var cloud = this.add.sprite(50,0,'cloud'); //��
		this.sprites.cloud = cloud;
		var score = this.add.sprite(10, 5, 'score-bg'); //�÷�
		this.sprites.score = score;
		var bgm = this.add.audio('bgm'); //��������
		this.sprites.bgm = bgm;
		this.sprites.bgm.play();
		var fallwater = this.add.audio('fallwater'); //��ˮ��
		this.sprites.fallwater = fallwater;
  
		Bridge._health = 4; //С���е�������ʼΪ4����
		Bridge._position = Math.floor(0.1 * Bridge.GAME_WIDTH);
		Bridge._score = 0;
		Bridge._upSpeed = 10;
		Bridge._rotationSpeed = 0.314159;
		Bridge._chickSpeed = 10;
		
		//����������趨
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
	//������Ϸ����ѭ��
	update: function() { 
	},
	//�ж��Ƿ��������߰���Ļ
	isDownInTheRightArea:function(){
		if(this.input.activePointer.isDown){
			return true;
		}
		return false;
	}
};

//������������
function spawnBoard(game,flag) {
	var spawnGap = Math.floor(Math.max(Math.random(),0.1)*(Bridge.GAME_HEIGHT-270)); //���õڶ����ŵ�λ�� 
	//����1
	if(flag){
		var board = game.add.sprite(Bridge._position + game.camera.x + spawnGap+84,Bridge.GAME_HEIGHT-250,'board');
	}
	//����2
	else{
		var board = game.add.sprite(Bridge._position + game.camera.x,Bridge.GAME_HEIGHT-250,'board'); 
	}
	return board;
};
//������
function createBridge(game){
	//����ͼƬ
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
	//δ����״̬
	bridge.inactive=function(){};
	//������״̬
	bridge.mount=function(){
		this.height=this.height+Bridge._upSpeed;
		game.sprites.chick.construct();
	};
	//����״̬
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
	//��ˮ״̬
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
	//�ж����Ƿ���ϵڶ���ľ��
	bridge.hasRightSize=function(){
		if(this.x+this.height>=game.sprites.board2.x&&this.x+this.height<game.sprites.board2.x+84){
			return true;
		}
		else{
			return false;
		}
	};
	//���ڻ�ȡ��β���ĺ�����
	bridge.getEnd=function(){
		return this.x+this.height;
	};
	return bridge;
};
//����С��
function createChick(game){
	var chick = game.add.sprite(Bridge._position,Bridge.GAME_HEIGHT-250-60,'chick'); //�趨���ĳ�ʼλ�ã�Ҫ�ģ���
	chick.scale.setTo(0.4,0.4);
	chick.animations.add('stop',[0],15,true);
	chick.animations.add('run',[0,1,2],15,true);
	chick.animations.add('construct',[3,4],15,true);
	chick.state='stop';
	//��������״̬
	chick.construct=function(){
		this.animations.play('construct');
	};
	//�ܶ�״̬
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
		game.world.resize(game.world.width + Bridge._chickSpeed,Bridge.GAME_HEIGHT); //400Ϊ��Ϸ���
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
		//��û���ϵڶ���ľ�壬��С���������ߵ���ľ���β�ˣ���ʼ����
		else if(!game.sprites.bridge.hasRightSize()&&game.sprites.bridge.getEnd()-this.width<=this.x){
			this.state='fall';
			
			game.sprites.fallwater.play();
			Bridge._score -= 10;
			Bridge._scoreText.setText(Bridge._score);
		}
	};
	//��ֹ״̬
	chick.stop=function(){
		this.animations.play('stop');
	};
	//��ˮ״̬
	chick.fall=function(){
		if(this.y <= Bridge.GAME_HEIGHT){
			this.y=this.y+10;
			this.animations.play('construct');
			game.sprites.bridge.state='fallMore';
		}
		//��С������������ִ�гͷ�����
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
	//�ؽ�״̬
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