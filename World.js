/*
 * 
 */
 
"use strict";

function World(tileset, render){

	var intToTileRender = {
		0 : [tileset[0][0], tileset[1][0], tileset[2][0]], //Ground.
		1 : [tileset[0][1], tileset[1][1], tileset[2][1]], //Grass.
		2 : [tileset[3][1]], //Other Grass.
		
		10 : tileset[0][2], //Corrupt Ground.
		11 : tileset[1][2],	
		12 : tileset[2][2],
		13 : tileset[3][2],
		14 : tileset[4][2],
		15 : tileset[5][2],
		16 : tileset[6][2],
		17 : tileset[7][2],
		18 : tileset[0][3],
		19 : tileset[1][3],
		20 : tileset[2][3],
		21 : tileset[3][3],
		22 : tileset[4][3],
		23 : tileset[5][3],
		24 : tileset[6][3],
		25 : tileset[7][3],

		30 : [tileset[3][0], tileset[4][0], tileset[5][0]],
		31 : [tileset[6][0], tileset[7][0], tileset[7][1]],
	};

	Grid.call(this, new Vector2(0, 0), new Vector2(300, 20), new Vector2(16, 16), render, -1, intToTileRender);

	this.buildAsNormalWorld = function(){
		var groundRows = 5;

		for (var i=0; i < this.gridSize.x; i++){
			for (var j=0; j < groundRows; j++){
				this.tileTypes[i][this.gridSize.y-j] = 0;
			}
		}

		for (var i=0; i < this.gridSize.x; i++){
			this.tileTypes[i][this.gridSize.y-groundRows] = (Random.chance(.3) ? 0 : 1);
		}

		for (var i=0; i < this.gridSize.x; i++){
			this.tileTypes[i][this.gridSize.y-groundRows-1] = 1;
		}

		var minHoleWidth = 2;
		var maxHoleWidth = 16;

		var numHoles = 9;

		for (; numHoles > 0; numHoles--){
			var holeWidth = Random.range(minHoleWidth, maxHoleWidth);
			var startPos = Random.range(0, this.gridSize.x - holeWidth);

			for (var i=0; i < holeWidth; i++){
				for(var j=this.gridSize.y-1; j >= 0; j--){
					this.tileTypes[startPos+i][j] = -1;
				}
			}
		}

		var grassSurroundingToNewTile = {
			"***1" : 2,
		};

		var groundSurroundingToNewTile = {
			"*10*" : 30,
			"*01*" : 31,
		};

		this.tileContext(1, 1, grassSurroundingToNewTile);
		this.tileContext(0, -1, groundSurroundingToNewTile);
	};

	this.buildAsCorruptWorld = function(){
		var groundRows = 4;

		for (var i=0; i < this.gridSize.x; i++){
			for (var j=0; j < groundRows; j++){
				this.tileTypes[i][this.gridSize.y-j] = 10;
			}
		}

		for (var i=0; i < this.gridSize.x; i++){
			this.tileTypes[i][this.gridSize.y-groundRows] = (Random.chance(.3) ? -1 : 10);
		}

		for (var i=0; i < this.gridSize.x; i++){
			this.tileTypes[i][this.gridSize.y-groundRows-1] = (Random.chance(.5) ? -1 : 10);
		}

		for (var i=0; i < this.gridSize.x; i++){
			this.tileTypes[i][this.gridSize.y-groundRows-1] = (Random.chance(.8) ? -1 : 10);
		}

		var minHoleWidth = 2;
		var maxHoleWidth = 16;

		var numHoles = 9;

		for (; numHoles > 0; numHoles--){
			var holeWidth = Random.range(minHoleWidth, maxHoleWidth);
			var startPos = Random.range(0, this.gridSize.x - holeWidth);

			for (var i=0; i < holeWidth; i++){
				for(var j=this.gridSize.y-1; j >= 0; j--){
					this.tileTypes[startPos+i][j] = -1;
				}
			}

		}

		var surroundingToNewTileCorrupt = {
			"0000" : 10,
			"1000" : 11,
			"0100" : 12,
			"0010" : 13,
			"0001" : 14,
			"1100" : 15,
			"1010" : 16,
			"0011" : 17,
			"0101" : 18,
			"1110" : 19,
			"1101" : 20,
			"0111" : 21,
			"1011" : 22,
			"1111" : 23,
			"0110" : 24,
			"1001" : 25,
		};

		this.tileContext(10, -1, surroundingToNewTileCorrupt);
	};
}
