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

function Bullet(pos, direction){
	var speed = 400;

	Particle.call(this, pos, null, 2, "#666666");
	PhysicsObject.call(this, pos, this.toRect());

	this.velocity = direction.mul(speed);

	this.pos = this.centre;

	this.uniqueUpdate = function(deltaTime){
		if (this.pos.x < 0 || this.pos.x > canvas.width || this.pos.y > canvas.height){
			this.die();
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