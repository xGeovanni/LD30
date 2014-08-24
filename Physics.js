/*
 * 
 */
 
"use strict";

var PhysicsManager = {

	game : null,

	physicsObjects : [],

	collidingTiles : [0, 1, 2, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 30, 31],

	g : new Vector2(0, 250),
	epsilon : 0.01,

	start : function(game){
		this.game = game;
	},

	update : function(deltaTime){
		for (var i=this.physicsObjects.length-1; i >= 0; i--){

			this.physicsObjects[i].physicsUpdate(deltaTime);
			this.physicsObjects[i].uniquePhysicsUpdate(deltaTime);
		}
	},

	rectCollides : function(rect){
		if (rect.pos.y < this.game.currentWorld.pos.y){
			return true;
		}

		var tiles = this.game.currentWorld.tilesOverlapRect(rect);

		for (var i=tiles.length-1; i >= 0; i--){
			var index = this.collidingTiles.indexOf(this.game.currentWorld.getTileType(tiles[i]));
			if (index !== -1){
				return true;
			}
		}

		return false;
	},
};

function PhysicsObject(pos, collider){
	PhysicsManager.physicsObjects.push(this);

	this.pos = new Vector2(pos[0], pos[1]);
	this.velocity = new Vector2(0, 0);

	this.collider = collider;

	this.physicsUpdate = function(deltaTime){
		this.velocity.add(PhysicsManager.g.copy().mul(deltaTime));

		var canMove = this.checkMove();

		if (canMove[0]){
			this.pos[0] += this.velocity[0] * deltaTime;
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

	this.uniquePhysicsUpdate = function(deltaTime){
		//Hook.
	};

	this.checkMove = function(){
		var canMove = [false, false];

		var testX = this.collider.copy();
		var testY = this.collider.copy();

		testX.pos.x += this.velocity[0] * deltaTime;
		testY.pos.y += this.velocity[1] * deltaTime;

		canMove[0] = ! PhysicsManager.rectCollides(testX);
		canMove[1] = ! PhysicsManager.rectCollides(testY);

		return canMove;
	}

	this.collideX = function(){
		this.velocity[0] = 0;
		this.onCollisionX();
	}
	this.collideY = function(){
		this.velocity[1] = 0;
		this.onCollisionY();
	}

	this.onCollisionX = function(){
		//Hook.
	}
	this.onCollisionY = function(){
		//Hook.
	}
} 
