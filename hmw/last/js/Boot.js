var Bridge = {};
Bridge.Boot = function(game) {};
Bridge.Boot.prototype = {
    preload: function() {
        this.load.image('preloaderBar', 'img/loading-bar.png');
    },
    create: function() {
        this.input.maxPointers = 1;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.setScreenSize(true);
        this.state.start('Preloader');
    }
};