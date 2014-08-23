/*
 * 
 */
 
"use strict";
 
canvas.oncontextmenu = function(e){ e.preventDefault(); return false; };

var Game = {
	
	started : false,
	
	
	intro : function(){
		
	},
	
	init : function(){
		this.intro();
	},
	
	update : function(){
		
		if (! this.started){
			if (Key.isDown(Key.ENTER)){
				this.started = true;
			}
			
			return;
		}
	},
	
	render : function(){
		
		if (! this.started){
			this.intro();
			return;
		}
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
