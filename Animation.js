"use strict";

var AnimationThread = {
	_intervalID : 0,
	animations : [],
	
	_d : new Date(),
	_time : 0,
	_deltaTime : 0,
	_lastTime : 0,

	 updateDeltaTime : function(){
		this._d = new Date();
		this._time = this._d.getTime() / 1000;
		this._deltaTime = this._time - this._lastTime;
		this._lastTime = this._time;
	},
	
	start : function(){		
		this._intervalID = window.setInterval(function(){ AnimationThread.update(); }, 5);
		
		this.updateDeltaTime();
	},
	
	end : function(){
		window.clearInterval(this._intervalID);
	},
	
	update : function(){
		this.updateDeltaTime();
		
		for (var i = this.animations.length-1; i >= 0; i--){
			this.animations[i].update(this._deltaTime);
		}
	},
	
	add : function(animation){
		this.animations.push(animation);
	}
}

function Animation(images, rate, oscillate, enabled){
    this.images = images;
    this.interval = 1 / rate;
    this.timeUntilAnimate = this.interval;
    this.i = 0;
    this.enabled = enabled !== undefined ? enabled : true;
    
    this.oscillate = oscillate; //Whether to go back and forth between the images or repeat from the start.
    this.direction = 1;
    
    this.image = this.images[this.i];
    
    AnimationThread.add(this);
    
    this.animate = function(){
        this.image = this.images[this.i];
        
        this.i += 1 * this.direction;
        
        if (this.i >= this.images.length || (this.i < 0 && this.direction == -1)){
            if (! this.oscillate){
                this.i = 0;
            }
            else{
                this.direction *= -1;
                this.i += this.direction;
            }
        }
    }
    
    this.update = function(deltaTime){        
        this.timeUntilAnimate -= deltaTime;
        
        if (this.timeUntilAnimate <= 0){
            this.animate();
            this.timeUntilAnimate = this.interval;
        }
    }
    
    this.draw = function(ctx, pos, rotation){
		if (rotation === undefined){
			ctx.drawImage(this.image, pos[0], pos[1]);
		}
		else{
			drawRotatedImage(this.image, pos, rotation);
		}
    }
}

function Animator(states, animations){	
	if (atates.length !== animations.length){
		throw "There must be as many animations as states.";
	}
	
	for (var i=0; i < states.length; i++){
		this[states[i]] = animations[i];
	}
	
	this.state = states[0];
	this.animation = this[this.state];
	
	this.fireOneShot = function(state){
		this.prevState = this.state;
		this.setState(state);
		
		var t = this.animation.interval * this.animation.images.length * (this.animation.oscillate ? 2 : 1);
		
		window.setTimeout(this.endOneShot, t * 1000);
	}
	
	this.endOneShot = function(){
		this.setState(this.prevState);
	}
	
	this.setState = function(state){
		this.state = state;
		this.animation = this[this.state];
		this.animation.i = 0;
		this.animation.timeUntilAnimate = this.animation.interval;
	}
	
	this.update = function(deltaTime){
		this.animation.update(deltaTime);
	}
	
	this.draw = function(ctx, pos, rotation){
		this.animation.draw(ctx, pos, rotation);
	}
}
