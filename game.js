/*
 * 
 */
 
"use strict";
 
canvas.oncontextmenu = function(e){ e.preventDefault(); return false; };

var Game = {
	
	started : false,

	normalBG : "#00A0FF",
	corruptBG : "#553377",

	currentWorld : null,
	normalWorld : null,
	corruptWorld : null,

	normalWorldRender : null,
	corruptWorldRender : null,

	normalWorldBookends : [],
	corruptWorldBookends : [],

	tileset : null,

	worldOffset : new Vector2(0, 0),

	player : null,

	gameObjects : [],

	nSpawnsOnWorldSwitch : 20,

	timeBetweenSpawnEnemy : 2,
	timeUntilSpawnEnemy : null,

	normalEnemySpawnProbabilityTable : { //Great variable names, huh?
		"Rabbit" : 1,
	},

	corruptEnemySpawnProbabilityTable : {
		"Bat" : .45,
		"Zombie" : 0.25,
		"Gen2Slime" : .15,
		"Slime" : 0.12,
		"Eye" : 0.03,
	},

	enemyStringToClass : {
		"Rabbit" : Rabbit,
		"Bat" : Bat,
		"Slime" : Slime,
		"Gen2Slime" : Gen2Slime,
		"Zombie" : Zombie,
		"Eye" : Eye,
	},
	
	intro : function(){
		ctx.drawImage(title, 0, 0);
	},
	
	init : function(){
		if (window.innerWidth < canvas.width && this.windowIsMaximized()){
			canvas.width = document.innerWidth;
		}

		this.intro();

		this.tileset = new Tileset(tileset, [8, 32], [16, 16], 1);

		this.createWorlds();

		this.switchToNormalWorld();

		this.timeUntilSwitchWorld = this.timeBetweenSwitchWorld;

		PhysicsManager.start(this);
		AnimationThread.start();

		loadTileSets();

		this.player = new Player(this, new Tileset(Derrick, [8, 4], [30, 60], 1), new Tileset(arms, [2, 1], [46, 15], 1));

		this.spawnInitialEnemies();
		this.timeUntilSpawnEnemy = this.timeBetweenSpawnEnemy;

		ctx.font = "12px Verdana";
	},
	
	update : function(){
		
		if (! this.started){
			if (Key.isDown(Key.ENTER)){
				this.started = true;
			}
			
			return;
		}

		this.currentWorld.topleft.x = this.worldOffset.x;
		this.currentWorld.pos.x = this.worldOffset.x;

		if (this.worldOffset.x >= canvas.width / 2){
			this.scroll(-(this.currentWorld.size.x));
		}

		if (this.worldOffset.x <= -1 * (this.currentWorld.size.x - canvas.width / 2)){
			this.scroll(this.currentWorld.size.x);
		}

		PhysicsManager.update(deltaTime);
		
		for (var i=this.gameObjects.length-1; i >= 0; i--){
			this.gameObjects[i].update(deltaTime);
		}

		this.timeUntilSpawnEnemy -= deltaTime;

		if (this.timeUntilSpawnEnemy <= 0 ){
			this.spawnEnemy();
			this.timeUntilSpawnEnemy = this.timeBetweenSpawnEnemy;
		}
	},
	
	render : function(){
		
		if (! this.started){
			this.intro();
			return;
		}

		if (this.currentWorld === this.normalWorld){
			ctx.drawImage(this.normalWorldRender, this.worldOffset.x, this.worldOffset.y);
		}
		else if (this.currentWorld === this.corruptWorld){
			ctx.drawImage(this.corruptWorldRender, this.worldOffset.x, this.worldOffset.y);
		}

		for (var i=this.gameObjects.length-1; i >= 0; i--){
			this.gameObjects[i].draw(ctx);
		}

		this.showBookends();

		this.player.drawHUD(ctx);

		//ctx.fillText(Math.floor(1 / deltaTime), 100, 100); //FPS Display
	},

	scroll : function(delta){
		this.worldOffset.x += delta;

		for (var i=this.gameObjects.length-1; i >= 0; i--){
			if (this.gameObjects[i] === this.player){
				continue;
			}

			this.gameObjects[i].pos.x += delta;
		}
	},

	spawnEnemy : function(){
		var table = this.currentWorld === this.normalWorld ? this.normalEnemySpawnProbabilityTable : this.corruptEnemySpawnProbabilityTable;

		var seed = Math.random();
		var cumulative = 0;

		var pos = new Vector2(Random.range(this.worldOffset.x, this.worldOffset.x + this.currentWorld.size.x), canvas.height / 2);

		while(pos.x > 0 && pos.x < canvas.width){
			//No spawning enemies on-screen.
			pos.x += Random.range(this.worldOffset.x, this.worldOffset.x + this.currentWorld.size.x);
		}

		for (var enemy in table){
			cumulative += table[enemy];

			if (seed < cumulative){
				new this.enemyStringToClass[enemy](pos);
				return;
			}
		}
	},

	spawnInitialEnemies : function(){
		for(var i = this.nSpawnsOnWorldSwitch; i > 0; i--){
			this.spawnEnemy();
		}
	},

	showBookends : function(){
		if (this.worldOffset.x > 0){
			var bookend = this.currentWorld === this.normalWorld ? this.normalWorldBookends[1] : this.corruptWorldBookends[1];
			ctx.drawImage(bookend, Math.ceil(this.currentWorld.topleft.x - canvas.width / 2) + 1, 0);
		}

		else if (this.worldOffset.x < -1 * (this.currentWorld.size.x - canvas.width)){
			var bookend = this.currentWorld === this.normalWorld ? this.normalWorldBookends[0] : this.corruptWorldBookends[0];
			ctx.drawImage(bookend, Math.floor(this.currentWorld.topleft.x + this.currentWorld.size.x) - 1, 0);
		}
	},

	switchWorld : function(){
		this.gameObjects = this.gameObjects.slice(0, 1);
		PhysicsManager.dropAllButPlayer();

		if (this.currentWorld === this.normalWorld){
			this.switchToCorruptWorld();
		}
		else if (this.currentWorld === this.corruptWorld){
			this.switchToNormalWorld();
		}

		this.spawnInitialEnemies();
	},

	switchToNormalWorld : function(){
		canvas.style.background = this.normalBG;
		this.currentWorld = this.normalWorld;
	},

	switchToCorruptWorld : function(){
		canvas.style.background = this.corruptBG;
		this.currentWorld = this.corruptWorld;
	},

	createWorlds : function(){
		this.normalWorldRender = document.createElement("canvas");
		this.corruptWorldRender = document.createElement("canvas");

		this.normalWorld = new World(this.tileset, this.normalWorldRender);
		this.corruptWorld = new World(this.tileset, this.corruptWorldRender);

		this.normalWorld.buildAsNormalWorld();
		this.corruptWorld.buildAsCorruptWorld();

		this.normalWorldRender.width = this.normalWorld.size.x;
		this.normalWorldRender.height = this.normalWorld.size.y;

		this.normalWorld.screenBottomRight = [this.normalWorldRender.width, this.normalWorldRender.height];

		this.normalWorld.fillTiles(this.normalWorldRender.getContext("2d"));

		this.corruptWorldRender.width = this.corruptWorld.size.x;
		this.corruptWorldRender.height = this.corruptWorld.size.y;

		this.corruptWorld.screenBottomRight = [this.corruptWorldRender.width, this.corruptWorldRender.height];

		this.corruptWorld.fillTiles(this.corruptWorldRender.getContext("2d"));

		this.normalWorldBookends[0] = subCanvas(this.normalWorldRender, 0, 0, canvas.width / 2, canvas.height);
		this.normalWorldBookends[1] = subCanvas(this.normalWorldRender, this.normalWorld.size.x - canvas.width / 2, 0, canvas.width / 2, canvas.height);

		this.corruptWorldBookends[0] = subCanvas(this.corruptWorldRender, 0, 0, canvas.width / 2, canvas.height);
		this.corruptWorldBookends[1] = subCanvas(this.corruptWorldRender, this.corruptWorld.size.x - canvas.width / 2, 0, canvas.width / 2, canvas.height);
	},

	windowIsMaximized : function(){
		return screen.availWidth == window.innerWidth;
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
	
	window.setInterval(update, 1);
	
	(function animloop(){
  		requestAnimFrame(animloop);
  		render();
	})();
}

main();
