/*
 * 
 */
 
"use strict";

function Player(game, spritesheet){
	this.game = game;
	game.gameObjects.push(this);

	var pos = new Vector2(canvas.width / 10, canvas.height / 4);
	this.constX = canvas.width / 2;
	this.lockX = false;

	Rect.call(this, pos, [30, 60]);
	PhysicsObject.call(this, pos, this);

	this.speed = 170;
	this.jumpVel = -200;

	this.collideYThisFrame = false;
	this.grounded = false;

	var walkRight = new Animation([spritesheet[0][0], spritesheet[1][0], spritesheet[2][0], spritesheet[3][0]], 10, false);
	var walkLeft = new Animation([spritesheet[0][1], spritesheet[1][1], spritesheet[2][1], spritesheet[3][1]], 10, false);

	var idleRight = new Animation([spritesheet[0][2]], 1, false);
	var idleLeft = new Animation([spritesheet[1][2]], 1, false);

	this.animator = new Animator(["walkRight", "walkLeft", "idleRight", "idleLeft"], [walkRight, walkLeft, idleRight, idleLeft]);

	this.update = function(deltaTime){
		this.handleInput();

		if (! this.lockX){
			if (this.pos.x >= this.constX){
				this.lockX = true;
				this.constX = this.pos.x;
			}
		}

		if (this.pos.y > canvas.height){
			this.fallInToCorrupt();
		}
	};

	this.handleInput = function(){
		if (Key.isDown(Key.A)){
			this.velocity.x = -this.speed;
			if (this.animator.state !== "walkLeft"){
				this.animator.setState("walkLeft");
			}
		}
		else if (Key.isDown(Key.D)){
			this.velocity.x = this.speed;
			if (this.animator.state !== "walkRight"){
				this.animator.setState("walkRight");
			}
		}
		else{
			this.velocity.x = 0;

			if (this.animator.state === "walkRight"){
				this.animator.setState("idleRight");
			}
			else if (this.animator.state === "walkLeft"){
				this.animator.setState("idleLeft");
			}
		}

		if (Key.isDown(Key.W)){
			this.jump();
		}
	}

	this.jump = function(){
		if (! this.grounded){
			return;
		}

		this.velocity.y += this.jumpVel;
	}

	this.uniquePhysicsUpdate = function(deltaTime){
		this.grounded = this.collideYThisFrame;
		this.collideYThisFrame = false;
	}

	this.physicsUpdate = function(deltaTime){
		this.velocity.add(PhysicsManager.g.copy().mul(deltaTime));

		var canMove = this.checkMove();

		if (canMove[0]){
			if (this.lockX){
				this.game.scroll(-this.velocity[0] * deltaTime);
			}
			else{
				this.pos[0] += this.velocity[0] * deltaTime;
			}
		}
		else{
			this.collideX();
		}
		if (canMove[1]){
			this.pos[1] += this.velocity[1] * deltaTime * canMove[1];
		}
		else{
			this.collideY();
		}

		this.collider.pos = this.pos;
	};

	this.fallInToCorrupt = function(){
		this.game.switchWorld();
		this.pos.y = 0;
	}

	this.onCollisionY = function(){
		this.collideYThisFrame = true;
	};

	this.draw = function(ctx){
		this.animator.draw(ctx, this.pos);
	};
}
