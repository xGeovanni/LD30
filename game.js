/*
 * 
 */
 
"use strict";
 
canvas.oncontextmenu = function(e){ e.preventDefault(); return false; };

var Game = {
	
	started : true,

	normalBG : "#00A0FF",
	corruptBG : "#700090",

	timeBetweenSwitchWorld : 10,
	timeUntilSwitchWorld : 0,

	currentWorld : null,
	normalWorld : null,
	corruptWorld : null,

	normalWorldRender : null,
	corruptWorldRender : null,

	tileset : null,
	
	intro : function(){
		
	},
	
	init : function(){
		this.intro();

		this.tileset = new Tileset(tileset, [8, 32], [16, 16], 1);

		this.normalWorldRender = document.createElement("canvas");
		this.corruptWorldRender = document.createElement("canvas");

		this.normalWorld = new World(this.tileset, this.normalWorldRender);
		this.corruptWorld = new World(this.tileset, this.corruptWorldRender);

		this.normalWorldRender.width = this.normalWorld.size.x * this.normalWorld.tileSize.x;
		this.normalWorldRender.height = this.normalWorld.size.y * this.normalWorld.tileSize.y;

		this.normalWorld.screenBottomRight = [this.normalWorldRender.width, this.normalWorldRender.height];

		this.normalWorld.fillTiles(this.normalWorldRender.getContext("2d"));

		this.corruptWorldRender.width = this.corruptWorld.size.x * this.corruptWorld.tileSize.x;
		this.corruptWorldRender.height = this.corruptWorld.size.y * this.corruptWorld.tileSize.y;

		this.corruptWorld.screenBottomRight = [this.corruptWorldRender.width, this.corruptWorldRender.height];

		this.corruptWorld.fillTiles(this.corruptWorldRender.getContext("2d"));

		this.switchToNormalWorld();

		this.timeUntilSwitchWorld = this.timeBetweenSwitchWorld;
	},
	
	update : function(){
		
		if (! this.started){
			if (Key.isDown(Key.ENTER)){
				this.started = true;
			}
			
			return;
		}

		this.timeUntilSwitchWorld -= deltaTime;

		if (this.timeUntilSwitchWorld <= 0){
			this.switchWorld();
			this.timeUntilSwitchWorld = this.timeBetweenSwitchWorld;
		}
	},
	
	render : function(){
		
		if (! this.started){
			this.intro();
			return;
		}

		if (this.currentWorld === this.normalWorld){
			ctx.drawImage(this.normalWorldRender, 0, 0);
		}
		else if (this.currentWorld === this.corruptWorld){
			ctx.drawImage(this.corruptWorldRender, 0, 0);
		}
	},

	switchWorld : function(){
		if (this.currentWorld === this.normalWorld){
			this.switchToCorrupWorld();
		}
		else if (this.currentWorld === this.corruptWorld){
			this.switchToNormalWorld();
		}
	},

	switchToNormalWorld : function(){
		canvas.style.background = this.normalBG;
		this.currentWorld = this.normalWorld;
	},

	switchToCorrupWorld : function(){
		canvas.style.background = this.corruptBG;
		this.currentWorld = this.corruptWorld;
	},
}

function init(){
	Game.init();
}

function update(){
	updateDeltaTime();
	Game.update();
}

function render(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	Game.render();
}

function main(){
	console.time('init timer');
	init();
	console.timeEnd('init timer');
	
	window.setInterval(update, 5);
	
	(function animloop(){
  		requestAnimFrame(animloop);
  		render();
	})();
}

setTimeout(main, 100);
