/*
 * 
 */
 
"use strict";

function World(tileset, render){

	var intToTileRender = {
		0 : [tileset[0][0], tileset[1][0], tileset[2][0]], //Ground.
		1 : [tileset[0][1], tileset[1][2], tileset[2][3]], //Grass.	
	};

	Grid.call(this, new Vector2(0, 0), new Vector2(450, 20), new Vector2(16, 16), render, 0, intToTileRender);
}
