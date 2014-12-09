   game.TitleScreen = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {
                //calls upon the respective title image.
                me.game.world.addChild( new me.Sprite (0, 0, me.loader.getImage('title-screen')), -10);
                //makes if you press 'enter' the gamerr starts.
                me.input.bindKey(me.input.KEY.ENTER, "start");
                
                me.game.world.addChild(new (me.Renderable.extend ({
                    init: function(){
                        //all the font stuff for the title-screen.
                        this._super(me.Renderable, 'init',[510, 30, me.game.viewport.width, me.game.viewport.height]);
                        this.font = new me.Font("Arial", 46, "white");
                    },
                    
                    draw: function(renderer){
                        //what we ee when we start the game
                        this.font.draw(renderer.getContext(), "Crap-ario Game", 450, 130);
                        this.font.draw(renderer.getContext(), "Press ENTER to play!", 250, 530);
                    }
                    
                })));
                
                 
                this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, KeyCode, edge){
                    if(action === "start"){
                        me.state.change(me.state.PLAY);
                        me.event.unsubscribe(this.handler);
                    }
                });
                
	},
	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
        
        //thid code kills the 'press enter to play' button so it doesn't work ingame.
	onDestroyEvent: function() {
		me.input.unbindKey(me.input.KEY.ENTER);
	}
});
