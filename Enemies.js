/*
 * 
 */
 
"use strict";

var BatTileset = new Tileset(bat, [3, 2], [24, 16]);
var RabbitTileset = new Tileset(rabbit, [3, 2], [24, 16]);
var SlimeTileset0 = new Tileset(slime, [2, 2], [64, 64]);
var SlimeTileset1 = new Tileset(SlimeTileset0[1][0], [2, 2], [32, 32]);
var SlimeTileset2 = new Tileset(SlimeTileset1[1][0], [2, 2], [16, 16]);
var ZombieTileset = new Tileset(zombie, [4, 2], [30, 60]);

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

	this.damage = 1;

	this.timeBetweenDealDamage = 0.04;
	this.timeUntilDealDamage = 0;

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

		this.timeUntilDealDamage -= deltaTime;

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

	this.onCollisionX = function(){
		if (this.hit[0] == Game.player){
			if (this.timeUntilDealDamage <= 0){
				Game.player.takeDamage(this.damage);
				this.timeUntilDealDamage = this.timeBetweenDealDamage;
			}
		}
	}

	this.onCollisionY = function(){
		if (this.hit[0] == Game.player){
			if (this.timeUntilDealDamage <= 0){
				Game.player.takeDamage(this.damage);
				this.timeUntilDealDamage = this.timeBetweenDealDamage;
			}
		}
	}
};

function Slime(pos, gen){
	this.gen = gen !== undefined ? gen : 0;

	var size = [64 / (this.gen * 2 + (this.gen === 0 ? 1 : 0)), 64 / (this.gen * 2 + (this.gen === 0 ? 1 : 0))];
	this.jumpVel = 70 * (this.gen * 2 + (this.gen === 0 ? 1 : 0));

	if (this.gen === 0){
		this.tileset = SlimeTileset0;
	}
	else if (this.gen === 1){
		this.tileset = SlimeTileset1;
	}
	else if (this.gen === 2){
		this.tileset = SlimeTileset2;
	}

	this.leftImage = this.tileset[0][0];
	this.rightImage = this.tileset[0][1];

	this.timeBetweenDealDamage = .2;
	this.timeUntilDealDamage = 0;

	this.image = this.rightImage;

	this.damage = 36 / (this.gen+1);

	Enemy.call(this, pos, size, 60 / (this.gen+1), 30 * (this.gen+1));

	this.AI = function(player, deltaTime){
		if (this.pos.distanceTo(player.pos) < this.reactionDist){
			this.velocity.x = this.speed * (this.pos.x >= player.pos.x ? -1 : 1);
		}
		else{
			this.velocity.x = 0;
		}

		if (this.detectHole()){
			if (this.gen === 0){
				this.velocity.x = 0;
			}
			else{
				this.jump();
			}
		}

		this.timeUntilDealDamage -= deltaTime;

		if (this.velocity[0] >= 0){
			this.image = this.rightImage;
		}
		else{
			this.image = this.leftImage;
		}
	};

	this.jump = function(){
		if (! this.grounded){
			return;
		}

		this.velocity.y -= this.jumpVel;
	};

	this.onCollisionX = function(){
		this.jump();

		if (this.hit[0] == Game.player){
			if (this.timeUntilDealDamage <= 0){
				Game.player.takeDamage(this.damage);
				this.timeUntilDealDamage = this.timeBetweenDealDamage;
			}
		}
	}

	this.uniqueDraw = function(ctx){
		ctx.drawImage(this.image, this.pos[0], this.pos[1]);
	}

	this.die = function(){
		this.dead = true;

		if (this.gen < 2){
			for (var i=0; i < 2; i++){
				new Slime([Random.range(this.pos.x, this.pos.x + this.size.x), Random.range(this.pos.y, this.pos.y + this.size.y)], this.gen+1);
			}
		}
	}
}

function Gen2Slime(pos){
	Slime.call(this, pos, 1)
}

function Zombie (pos){
	Enemy.call(this, pos, [30, 60], 80, 170);

	this.jumpVel = 200;
	this.damage = 15;

	this.timeBetweenDealDamage = 0.2;
	this.timeUntilDealDamage = 0;

	var left = new Animation(ZombieTileset[0], 8, true);
	var right = new Animation(ZombieTileset[0], 8, true);

	this.animator = new Animator(["left", "right"], [left, right]);

	this.AI = function(player, deltaTime){
		if (this.pos.distanceTo(player.pos) < this.reactionDist){
			this.velocity.x = this.speed * (this.pos.x >= player.pos.x ? -1 : 1);
		}
		else{
			this.velocity.x = 0;
		}

		if (this.detectHole()){
			if (this.gen === 0){
				this.velocity.x = 0;
			}
			else{
				this.jump();
			}
		}

		this.timeUntilDealDamage -= deltaTime;

		if (this.velocity.x < 0){
			if (this.animator.state !== "left"){
				this.animator.setState("left");
			}
		}
		else if (this.animator.state !== "right"){
			this.animator.setState("right");
		}
	};

	this.onCollisionX = function(){
		this.jump();

		if (this.hit[0] == Game.player){
			if (this.timeUntilDealDamage <= 0){
				Game.player.takeDamage(this.damage);
				this.timeUntilDealDamage = this.timeBetweenDealDamage;
			}
		}
	}

	this.jump = function(){
		if (! this.grounded){
			return;
		}

		this.velocity.y -= this.jumpVel;
	};

	this.uniqueDraw = function(ctx){
		this.animator.draw(ctx, this.pos);
	}
}

function Eye(pos){
	//Rare semi-boss fight.

	Enemy.call(this, pos, [64, 64], 500, 150);

	this.timeBetweenChangeYdir = .5;
	this.timeUntilChangeYdir = 0;

	this.xdir = 0;

	this.damage = 2;

	this.image = eye;

	this.centre = new Vector2(0, 0);

	this.timeBetweenDealDamage = 0.05;
	this.timeUntilDealDamage = 0;

	this.minDesiredHeight = 120;

	this.AI = function(player, deltaTime){
		this.timeUntilChangeYdir -= deltaTime;
		
		this.xdir = this.pos.x >= player.pos.x ? -1 : 1;

		this.velocity.x = (this.xdir + (Random.choice([-1, 1]) * (1/4) * Math.random())) * this.speed;

		if (this.timeUntilChangeYdir <= 0){
			var dir = Random.choice([-1, 1]);

			if (this.centre.x < this.minDesiredHeight){
				dir = -1;
			}

			this.velocity.y = Math.random() * dir * this.speed;
			this.timeUntilChangeYdir = this.timeBetweenChangeYdir;
		}

		this.centre.x = this.pos.x + this.size.x / 2;
		this.centre.y = this.pos.y + this.size.y / 2;

		this.timeUntilDealDamage -= deltaTime;
	};

	this.uniqueDraw = function(ctx){
		drawRotatedImage(this.image, this.centre, toRadians(this.centre.angleTo(Game.player.pos)) - Math.PI * (3/2));
	}

	this.onCollisionX = function(){
		if (this.hit[0] == Game.player){
			if (this.timeUntilDealDamage <= 0){
				Game.player.takeDamage(this.damage);
				this.timeUntilDealDamage = this.timeBetweenDealDamage;
			}
		}
	}

	this.onCollisionY = function(){
		if (this.hit[0] == Game.player){
			if (this.timeUntilDealDamage <= 0){
				Game.player.takeDamage(this.damage);
				this.timeUntilDealDamage = this.timeBetweenDealDamage;
			}
		}
	}
}