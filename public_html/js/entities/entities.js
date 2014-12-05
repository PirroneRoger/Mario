   game.PlayerEntity = me.Entity.extend({
   init: function(x, y, settings){
       this._super(me.Entity, 'init', [x, y, {
               image: "mario",
               spritewidth: "128",
               spriteheight: "128",
               width: 128,
               height: 128,
               getShape: function(){
                   return (new me.Rect(0, 0, 30, 128)).toPolygon();
               }
       }]);
   
       this.renderable.addAnimation("idle", [3]);
       this.renderable.addAnimation("smallWalk", [8, 9, 10, 11, 12, 13], 80);
       
       this.renderable.setCurrentAnimation("idle");
       
       //This sets the speed for Mario.
       this.body.setVelocity(5, 20);
       me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
   },
    // This is the directions function.
    update: function(delta){
        if(me.input.isKeyPressed("right")) {
            this.flipX(false);
            //smooths out animation
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            
        }else if(me.input.isKeyPressed("left")) {
            this.flipX(true);
            //smooths out animation
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
        }else{
            this.body.vel.x = 0;
        }
        
        this.body.update(delta);
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        //this code sests the animation.
        if(this.body.vel.x !== 0){
            //uses small walk animation.
            if(!this.renderable.isCurrentAnimation("smallWalk")) {
                this.renderable.setCurrentAnimation("smallWalk");
                this.renderable.setAnimationFrame();
            }
        }else{
            //This code sets mario's idle position.
            this.renderable.setCurrentAnimation("idle");
        }
        if(this.body.vel.x !== 0){
            if(!this.renderable.isCurrentAnimation("smallWalk")) {
                this.renderable.setCurrentAnimation("smallWalk");
                this.renderable.setAnimationFrame();
            }
        }else{
            this.renderable.setCurrentAnimation("idle");
        }
            
    
        if (me.input.isKeyPressed('up')){
            // make sure we are not already jumping or falling
            if (!this.body.jumping && !this.body.falling) {
                // set current vel to the maximum defined value
                // gravity will then do the rest
                this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                // set the jumping flag
                this.body.jumping = true;
            }
 
        }
        //updates mario and goes again.
        this._super(me.Entity, "update", [delta]);
        return true;
      },   
    
    collideHandler: function(response){
        var ydif = this.pos.y - response.b.pos.y;
        console.log(ydif);
        
        //This code is to make mario jump on the badguy and the badguy dies.
        if(response.b.type === 'badguy'){
            if(ydif<= -115){
                response.b.alive = false;
            }else{
                //if mario hits a bad guy then it goes back to the menu.
                me.state.change(me.state.MENU);
            }    
        }
    }
});


game.LevelTrigger = me.Entity.extend({
  init: function(x, y, settings){
      this._super(me.Entity, 'init', [x, y, settings]);
      this.body.onCollision = this.onCollision.bind(this);
      this.level = settings.level;
      this.xSpawn = settings.xSpawn;
      this.ySpawn = settings.ySpawn;
  },
    
    onCollision: function(){
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        me.levelDirector.loadLevel(this.level);
        me.state.current().resetPlayer(this.xSpawn, this.ySpawn);
    }
});

//This starts the badguy code.
game.BadGuy = me.Entity.extend({
    init: function(x, y, settings){
        this._super(me.Entity, 'init', [x, y, {
               image: "slime",
               spritewidth: "60",
               spriteheight: "28",
               width: 60,
               height: 28,
               getShape: function(){
                   return (new me.Rect(0, 0, 60, 28)).toPolygon();
               }
       }]);
       //respective size for the sprite.
       this.spritewidth = 60;
       var width = settings.width;
       x = this.pos.x;
       this.startX = x;
       this.endX = x + width - this.spritewidth;
       this.pos.x = x + width -this.spritewidth;
       this.updateBounds();

       this.alwaysUpdate = true;
       
       this.walkLeft = false;
       this.alive = true;
       this.type = "badguy";
       
       //starts the animation for the bad guy.
       this.renderable.addAnimation("run", [0, 1, 2], 80);
       //sets speed
       this.body.setVelocity(4, 6);
   
    },
    //this code sets mario walking to the left and right.
    update: function(delta){
        this.body.update(delta);
        //checks the collision do he doesn't fall through the ground.
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        
        if(this.alive){
            if(this.walkLeft && this.pos.x <= this.startX) {
                    this.walkLeft = false;
                }else if(!this.walkLeft && this.pos.x >= this.endX) {
                    this.walkLeft = true;
                }
                //flips the character when he walks left.
                this.flipX(!this.walkLeft);
                this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;
        }else{
            //removes the respective sprite
            me.game.world.removeChild(this);
        }
        
        this._super(me.Entity, "update", [delta]);
        return true;
    },
    
    collideHandler: function(){
        
    }
    
    
});



game.Mushroom = me.Entity.extend({
    intit: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "mushroom",
                spritewidth: "64",
                spriteheight: "64",
                width: 64,
                height: 64,
                getShape: function() {
                    return (new me.Rect(0, 0, 64, 64)).toPolygon();
                }
            }]);
        
        me.collision.check(this);
        this.type = "mushroom";
    }

});