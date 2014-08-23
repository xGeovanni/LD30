/*
 * 
 */
 
"use strict";

function Player(game){
	this.game = game;

	var pos = new Vector2(canvas.width, canvas.height)).div(2);

	Rect.call(this, pos, [20, 50]);
	PhysicsObject.call(this, pos, this);

	this.update = function(deltaTime){

	}
}
