/*
 * 
 */
 
"use strict";

var BatTileset = new Tileset(bat, [3, 2], [24, 16]);
var RabbitTileset = new Tileset(rabbit, [3, 2], [24, 16]);

function Enemy(pos, size, health, speed){
	Rect.call(this, pos, size);
	PhysicsObject.call(this, pos, this);
	HasHealth.call(this, health);

	this.speed = speed;

	this.reactionDist = 800;

	Game.gameObjects.push(this);
	this.dead = false;

	this.volPerBlood = 50;

	this.update = function(deltaTime){
		if (this.dead){
			return;
		}

		if (this.pos.y > canvas.height){
			this.die(true);
		}

		this.AI(Game.player, deltaTime);
	};

	this.draw = function(ctx){
		if (this.dead){
			return;
		}

		if (this.uniqueDraw){
			this.uniqueDraw(ctx);
		}
		else{
			ctx.fillStyle = "#000000";
			ctx.fillRect(this.pos[0], this.pos[1], this.size[0], this.size[1]);
		}
	};

	this.AI = function(){
		//Hook
	}

	this.detectHole = function(advance){
		if (this.velocity.x === 0){
			return false;
		}

		var direction = this.velocity.x < 0 ? -1 : 1;
		advance = advance !== undefined ? advance : 1;
		var tileSize = Game.currentWorld.tileSize;

		var tile = Game.currentWorld.pxToTileCoords([this.pos.x + (tileSize[0] * direction * advance), canvas.height - tileSize[1]]);

		if (! Game.currentWorld.tileExists(tile)){
			return true;
		}

		return Game.currentWorld.getTileType(tile) === -1;
	}

	this.die = function(blockAnim){
		this.dead = true;

		if (!blockAnim){
			var nBlood = Math.floor(this.size.x * this.size.y / this.volPerBlood);

			for (; nBlood >= 0; nBlood--){
				var pos = new Vector2(Random.range(this.pos.x, this.pos.x + this.size.x), Random.range(this.pos.y, this.pos.y + this.size.y));
				new Blood(pos);
			}
		}
	}
};

function Rabbit(pos){
	Enemy.call(this, pos, [24, 16], 10, 40);

	this.timeBetweenChangeXdir = 1;
	this.timeUntilChangeXdir = 0;

	var left = new Animation(RabbitTileset[0], 4, true);
	var right = new Animation(RabbitTileset[1], 4, true);

	this.animator = new Animator(["left", "right"], [left, right]);

	this.AI = function(player, deltaTime){
		this.timeUntilChangeXdir -= deltaTime;

		if (this.timeUntilChangeXdir <= 0){
			this.velocity.x = Random.uniform(-1, 1) * this.speed;
			this.timeUntilChangeXdir = this.timeBetweenChangeXdir;
		}

		if (this.detectHole()){
			this.velocity.x *= -1;
		}

		if (this.velocity.x < 0){
			if (this.animator.state !== "left"){
				this.animator.setState("left");
			}
		}
		else if (this.animator.state !== "right"){
			this.animator.setState("right");
		}
	};

	this.uniqueDraw = function(ctx){
		this.animator.draw(ctx, this.pos);
	}
}

function Bat(pos){
	Enemy.call(this, pos, [24, 16], 30, 200);

	this.timeBetweenChangeYdir = .5;
	this.timeUntilChangeYdir = 0;

	var left = new Animation(BatTileset[1], 4, true);
	var right = new Animation(BatTileset[0], 4, true);

	this.animator = new Animator(["left", "right"], [left, right]);

	this.xdir = 0;

	this.AI = function(player, deltaTime){
		this.timeUntilChangeYdir -= deltaTime;

		if (this.pos.distanceTo(player.pos) < this.reactionDist){
			this.xdir = this.pos.x >= player.pos.x ? -1 : 1;
		}

		this.velocity.x = (this.xdir + (Random.choice([-1, 1]) * (1/4) * Math.random())) * this.speed;

		if (this.timeUntilChangeYdir <= 0){
			this.velocity.y = Math.random() * Random.choice([-1, 1]) * this.speed;
			this.timeUntilChangeYdir = this.timeBetweenChangeYdir;
			this.xdir = Random.choice([-1, 1]);
		}

		if (this.velocity.x < 0){
			if (this.animator.state !== "left"){
				this.animator.setState("left");
			}
		}
		else if (this.animator.state !== "right"){
			this.animator.setState("right");
		}
	};

	this.uniqueDraw = function(ctx){
		this.animator.draw(ctx, this.pos);
	}
};