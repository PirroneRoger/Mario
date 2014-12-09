   game.PlayerEntity = me.Entity.extend({
   init: function(x, y, settings){
       //all of marios png info.
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
   
       //calls upon each image to make animation work.
       this.renderable.addAnimation("idle", [3]);
       this.renderable.addAnimation("bigIdle", [19]);
       this.renderable.addAnimation("smallWalk", [8, 9, 10, 11, 12, 13], 80);
       this.renderable.addAnimation("bigWalk", [14, 15, 16, 17, 18, 19], 80);
       this.renderable.addAnimation("shrink", [0, 1, 2, 3], 80);
       this.renderable.addAnimation("grow", [4, 5, 6, 7], 80);
       
       this.renderable.setCurrentAnimation("idle");
       
       //This sets the speed for Mario.
       this.big = false;
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
        if(!this.big)
            if(this.body.vel.x !== 0){
                //uses small walk animation.
                if(!this.renderable.isCurrentAnimation("smallWalk") && !this.renderable.isCurrentAnimation("grow") && !this.renderable.isCurrentAnimation("shrink")) {
                    this.renderable.setCurrentAnimation("smallWalk");
                    this.renderable.setAnimationFrame();
                }
        }else{
            //This code sets mario's idle position.
            this.renderable.setCurrentAnimation("idle");
        
        //animation code for the bigwalk 
    }else{
        if(this.body.vel.x !== 0){
            if(!this.renderable.isCurrentAnimation("bigWalk") && !this.renderable.isCurrentAnimation("grow") && !this.renderable.isCurrentAnimation("shrink")) {
                this.renderable.setCurrentAnimation("bigWalk");
                this.renderable.setAnimationFrame();
            }
        }else{
            this.renderable.setCurrentAnimation("bigIdle");
        }
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
        
        //This code is to make mario jump on the badguy and the badguy dies.
        if(response.b.type === 'badguy'){
            if(ydif<= -115){
                response.b.alive = false;
            }else{
                if(this.big){
                    //if mario hits a bad guy he will jump a little bit.
                    this.big = false;
                    this.body.vel.y -= this.body.accel.y * me.timer.tick;
                    this.jumping = true;
                    this.renderable.setCurrentAnimation("shrink", "idle");
                    this.renderable.setAnimationFrame();
                }else{
                //if mario hits a bad guy then it goes back to the menu.
                    me.state.change(me.state.MENU);
                 }
            }
            //animation stuff for the mushroom
        }else if(response.b.type === 'mushroom'){
            this.renderable.setCurrentAnimation("grow", "bigIdle");
            this.big = true;
            me.game.world.removeChild(response.b);
        }
    }
});

//spawning code
game.LevelTrigger = me.Entity.extend({
  init: function(x, y, settings){
      this._super(me.Entity, 'init', [x, y, settings]);
      this.body.onCollision = this.onCollision.bind(this);
      this.level = settings.level;
      this.xSpawn = settings.xSpawn;
      this.ySpawn = settings.ySpawn;
  },
    //collision code for levels
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
       this.body.setVelocity(50, .1);
   
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


//code for the mushroom and it's respective demensions.
game.Mushroom = me.Entity.extend({
    init: function(x, y, settings) {
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