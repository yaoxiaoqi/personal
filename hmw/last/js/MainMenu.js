Bridge.MainMenu = function(game) {};
Bridge.MainMenu.prototype = {
    create: function() {
        this.add.sprite(0, 0, 'background');
        //this.add.sprite(-130, Bridge.GAME_HEIGHT-514, 'chick-cover'); 
        //this.add.sprite((Bridge.GAME_WIDTH-395)/2, 60, 'title'); //title
        this.add.button(Bridge.GAME_WIDTH-401-10, Bridge.GAME_HEIGHT-143-10,'button-start', this.startGame, this, 1, 0, 2);
    },
    startGame: function() {
        this.state.start('Game');
    }
};