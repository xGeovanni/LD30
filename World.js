/*
 * 
 */
 
"use strict";

function World(tileset, render){

	var intToTileRender = {
		0 : [tileset[0][0], tileset[1][0], tileset[2][0]], //Ground.
		1 : [tileset[0][1], tileset[1][1], tileset[2][1]], //Grass.
		2 : [tileset[3][1]],
	};

	var grassSurroundingToNewTile = {
		"***1" : 2,
	};

	Grid.call(this, new Vector2(0, 0), new Vector2(450, 20), new Vector2(16, 16), render, -1, intToTileRender);

	this.buildAsNormalWorld = function(){
		var groundRows = 5;

		for (var i=0; i < this.size.x; i++){
			for (var j=0; j < groundRows; j++){
				this.tileTypes[i][this.size.y-j] = 0;
			}
		}

		for (var i=0; i < this.size.x; i++){
			this.tileTypes[i][this.size.y-groundRows] = (Random.chance(.3) ? 0 : 1);
		}

		for (var i=0; i < this.size.x; i++){
			this.tileTypes[i][this.size.y-groundRows-1] = 1;
		}

		this.tileContext(1, 1, grassSurroundingToNewTile);
	};

	this.buildAsCorruptWorld = function(){
		
	};
}
