    game.PlayScreen = me.ScreenObject.extend({
	
	onResetEvent: function() {
		// reset the score
		game.data.score = 0;
                me.levelDirector.loadLevel("RogerLevel01");
                //x,y where the mario resets
                this.resetPlayer(0, 400);
                
                
                //all direcitons for arrow keys
                me.input.bindKey(me.input.KEY.RIGHT, "right");
                me.input.bindKey(me.input.KEY.UP, "up");
                me.input.bindKey(me.input.KEY.LEFT, "left");

		// add our HUD to the game world
		this.HUD = new game.HUD.Container();
		me.game.world.addChild(this.HUD);
	},


	/**
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		// remove the HUD from the game world
		me.game.world.removeChild(this.HUD);
	},
        
        //reset's player function
        resetPlayer: function(x, y){
            var player = me.pool.pull("mario", 0, 400, {});
            me.game.world.addChild(player, 4);
        }
});
