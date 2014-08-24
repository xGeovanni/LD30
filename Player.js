/*
 * 
 */
 
"use strict";

function Player(game, spritesheet, arms){
	this.game = game;
	game.gameObjects.push(this);

	var pos = new Vector2(canvas.width / 10, canvas.height / 4);
	this.constX = canvas.width / 2;
	this.lockX = false;

	Rect.call(this, pos, [30, 60]);
	PhysicsObject.call(this, pos, this);
	HasHealth.call(this, 200);

	this.speed = 170;
	this.jumpVel = -200;

	var walkRight = new Animation([spritesheet[0][0], spritesheet[1][0], spritesheet[2][0], spritesheet[3][0]], 10, false);
	var walkLeft = new Animation([spritesheet[0][1], spritesheet[1][1], spritesheet[2][1], spritesheet[3][1]], 10, false);

	var idleRight = new Animation([spritesheet[0][2]], 1, false);
	var idleLeft = new Animation([spritesheet[1][2]], 1, false);

	this.animator = new Animator(["walkRight", "walkLeft", "idleRight", "idleLeft"], [walkRight, walkLeft, idleRight, idleLeft]);

	this.arms = arms;

	this.leftArm = arms[1][0];
	this.rightArm = arms[0][0];
	this.armPoint = new Vector2(this.size[0] * (1/2), this.size[1] * (2/7))

	this.timeBetweenShots = .16;
	this.timeUntilShot = 0;

	window.onmousedown = function(e){ Game.player.onClick(e); };

	this.update = function(deltaTime){
		this.handleInput();

		if (! this.lockX){
			if (this.pos.x >= this.constX){
				this.lockX = true;
				this.constX = this.pos.x;
			}
		}

		this.timeUntilShot -= deltaTime;

		if (this.pos.y > canvas.height){
			this.fallInToCorrupt();
		}

		if (mousePos.x >= this.pos.x){
			if (this.velocity.x !== 0){
				if (this.animator.state !== "walkRight"){
					this.animator.setState("walkRight");
				}
			}

			else if (this.animator.state !== "idleRight"){
				this.animator.setState("idleRight");
			}
		}
		else{
			if (this.velocity.x !== 0){
				if (this.animator.state !== "walkLeft"){
					this.animator.setState("walkLeft");
				}
			}
			else if (this.animator.state !== "idleLeft"){
				this.animator.setState("idleLeft");
			}
		}
	};

	this.handleInput = function(){
		if (Key.isDown(Key.A)){
			this.velocity.x = -this.speed;
			
		}
		else if (Key.isDown(Key.D)){
			this.velocity.x = this.speed;
		}
		else{
			this.velocity.x = 0;
		}

		if (Key.isDown(Key.W)){
			this.jump();
		}
	};

	this.onClick = function(e){
		if (e.button === 0){
			this.fire();
		}
	};

	this.fire = function(){
		if (this.timeUntilShot > 0){
			return;
		}
		this.timeUntilShot = this.timeBetweenShots;

		var pos = this.pos.copy().add(this.armPoint);

		new Bullet(pos, pos.angleTo(mousePos), this);
	};

	this.jump = function(){
		if (! this.grounded){
			return;
		}

		this.velocity.y += this.jumpVel;
	};

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
			this.grounded = false;
		}
		else{
			this.collideY();
		}

		while (PhysicsManager.rectCollides(this.collider, this)){
			this.pos.y -= PhysicsManager.game.currentWorld.tileSize.y;
			this.collider.pos = this.pos;
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
		this.drawArm();
		this.animator.draw(ctx, this.pos);
	};

	this.drawArm = function(ctx){
		var pos = this.pos.copy().add(this.armPoint);
		var arm = mousePos.x >= this.pos.x ? this.rightArm : this.leftArm;
		var offset = mousePos.x >= this.pos.x ?  new Vector2(arm.width / 2 - 8, arm.height / 2) : new Vector2(arm.width / 2 - 8, arm.height / 2 * -1);
		var rotation = toRadians(pos.angleTo(mousePos)) * -1 + Math.PI / 2;

		drawRotatedImage(arm, pos.copy().add(offset.copy().rotate(rotation)), rotation);
	}
}
