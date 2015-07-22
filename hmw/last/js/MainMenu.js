Bridge.MainMenu = function(game) {};
Bridge.MainMenu.prototype = {
    create: function() {
        this.add.sprite(0, 0, 'background');
        //this.add.sprite(-130, Bridge.GAME_HEIGHT-514, 'chick-cover'); 
		this.add.sprite(50,0,'cloud');
        this.add.sprite((Bridge.GAME_WIDTH-444)/2, 100, 'title'); //title
		this.add.sprite(0,Bridge.GAME_HEIGHT-370,'water');
        this.add.button(Bridge.GAME_WIDTH-401-10, Bridge.GAME_HEIGHT-143-10,'button-start', this.startGame, this, 1, 0, 2);
    },
    startGame: function() {
        this.state.start('Game');
    }
};