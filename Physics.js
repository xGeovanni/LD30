/*
 * 
 */
 
"use strict";

var PhysicsManager = {

	physicsObjects : [],

	collidingTiles : [0, 1, 2];

	g : new Vector2(0, 20),

	update : function(deltaTime){
		for (var i=physicsObjects.length-1; i <= 0; i--){
			physicsObjects[i].physicsUpdate(deltaTime);
			physicsObjects[i].uniquePhysicsUpdate(deltaTime);
		}
	},
};

function PhysicsObject(pos, collider){
	PhysicsManager.physicsObjects.push(this);

	this.pos = new Vector2(pos[0], pos[1]);
	this.velocity = new Vector2(0, 0);

	this.collider = collider;

	this.physicsUpdate = function(deltaTime){
		this.velocity.add(PhysicsManager.g.copy().mul(deltaTime));

		var canMove = [1, 1];
		this.pos[0] += this.velocity[0] * deltaTime * canMove[0];
		this.pos[1] += this.velocity[1] * deltaTime * canMove[1];
	};

	this.uniquePhysicsUpdate = function(deltaTime){

	};
} 
