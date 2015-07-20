Bridge.Preloader = function(game){
    Bridge.GAME_WIDTH = 600;
    Bridge.GAME_HEIGHT = 400;
};
Bridge.Preloader.prototype = {
    preload: function() {
        this.stage.backgroundColor = '#B4D9E7';
        this.preloadBar = this.add.sprite((Bridge.GAME_WIDTH-311)/2,(Bridge.GAME_HEIGHT-27)/2, 'preloaderBar');
        this.load.setPreloadSprite(this.preloadBar); //加载进度条
  
        this.load.image('background', 'img/background.jpg');
        this.load.image('water', 'img/water.png');
        //this.load.image('chick-cover', 'img/chick-cover.png'); //首页的鸡
        //this.load.image('title', 'img/title.png');
        //this.load.image('game-over', 'img/gameover.png');
        //this.load.image('score-bg', 'img/score-bg.png');
		this.load.image('board', 'img/board.jpg'); //板子
		
		//需要动画的放这里！
        //this.load.spritesheet('monster-idle','img/monster-idle.png', 103, 131);
        this.load.spritesheet('button-start','img/button-start.png', 401, 143);
    },
    create: function() {
        this.state.start('MainMenu');
    }
};