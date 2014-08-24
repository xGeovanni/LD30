/*
 * 
 */
 
"use strict";

function Particle(pos, velocity, radius, colour){
	Circle.call(this, pos, radius, colour);

	this.pos = this.centre;

	this.velocity = velocity;

	Game.gameObjects.push(this);

	this.dead = false;

	this.update = function(deltaTime){
		if (this.dead){
			return;
		}

		this.centre.add(this.velocity.copy().mul(deltaTime));

		this.uniqueUpdate(deltaTime);
	};

	this.uniqueUpdate = function(deltaTime){
		//Hook.
	}

	this.draw = function(){
		if (this.dead){
			return;
		}

		ctx.beginPath();
		ctx.arc(this.centre[0], this.centre[1], this.radius, 0, 2 * Math.PI);
		ctx.fillStyle = this.colour;
		ctx.fill();
	}

	this.die = function(){
		this.dead = true;
	}
}

function Bullet(pos, direction, owner){
	var speed = 400;

	Particle.call(this, pos, null, 2, "#666666");
	PhysicsObject.call(this, pos, this.toRect());

	this.velocity = direction.mul(speed);

	this.pos = this.centre;

	this.owner = owner;

	this.damage = 20 + Random.range(-5, 6);

	this.uniqueUpdate = function(deltaTime){
		if (this.pos.x < 0 || this.pos.x > canvas.width || this.pos.y > canvas.height){
			this.die();
		}

		for (var i = Game.gameObjects.length-1; i >= 0; i--){
			if (Game.gameObjects[i] === this.owner || Game.gameObjects[i].dead){
				continue;
			}

			if (Game.gameObjects[i].collider.collidePoint(this.centre)){
				this.die();

				if (Game.gameObjects[i].takeDamage){
					Game.gameObjects[i].takeDamage(this.damage);
				}
			}
		}
	}

	this.draw = function(){
		if (this.dead){
			return;
		}

		ctx.beginPath();
		ctx.arc(this.centre[0], this.centre[1], this.radius, 0, 2 * Math.PI);
		ctx.strokeStyle = "#000000";
		ctx.stroke();
		ctx.fillStyle = this.colour;
		ctx.fill();
	}

	this.onCollisionX = function(){
		this.die();
	}
	this.onCollisionY = function(){
		this.die();
	}
}

function Blood(pos, speed){
	Particle.call(this, pos, null, Random.range(2, 5), "#8A0707");
	PhysicsObject.call(this, pos, this.toRect());
	this.solid = false;

	this.pos = this.centre;

	var speed = speed !== undefined ? speed : 160;

	this.velocity = new Vector2(Math.random() * Random.choice([1, -1]) * speed, -1 * Random.range(speed / 2, speed));

	this.onCollisionX = function(){
		this.die();
	}
	this.onCollisionY = function(){
		this.die();
	}

	this.uniqueUpdate = function(){
	}

	this.draw = function(){
		if (this.dead){
			return;
		}

		ctx.beginPath();
		ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI);
		ctx.fillStyle = this.colour;
		ctx.fill();
	}
}