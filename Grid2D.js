// Class assumes access to GameMaths.js and 2D Shapes.js

"use strict";

function Grid(topleft, gridSize, tileSize, canvas, defaultTile, intToTileRender){

	Rect.call(this, topleft, new Vector2(gridSize[0] * tileSize[0], gridSize[1] * tileSize[1]));
	
	this.topleft = new Vector2(topleft[0], topleft[1]);
	this.gridSize = gridSize;
	this.tileSize = tileSize;
	this.pxSize = [this.gridSize[0] * this.tileSize[0], this.gridSize[1] * this.tileSize[1]];
	
	this.canvas = canvas;
	
	this.intToTileRender = intToTileRender;
	
	this.screenBottomRight = [canvas.width, canvas.height];
	
	this.defaultTile = defaultTile ? defaultTile : 0;
	
	this.tileTypes = [];
	
	this.animationImported = (typeof AnimationThread !== undefined);
	
	for (var i=0; i < this.gridSize[0]; i++){
		this.tileTypes.push([]);
			
		for(var j=0; j < this.gridSize[1]; j++){
			this.tileTypes[i][j] = this.defaultTile;
		}
	}
	
	this.fillDefault = function(tile){
		tile = tile === undefined ? this.defaultTile : tile;
		
		for (var i=0; i < this.gridSize[0]; i++){
			for(var j=0; j < this.gridSize[1]; j++){
				this.tileTypes[i][j] = tile;
			}
		}
	};

	this.getTileType = function(tile){
		return this.tileTypes[tile[0]][tile[1]];
	}

	this.setTileType = function(tile, type){
		this.tileTypes[tile[0]][tile[1]] = type;
	}
	
	this.tileContext = function(type, type2, surroundingToNewTile){
		/*
		 * up : 1000
		 * right : 0100
		 * left : 0010
		 * down : 0001
		 */

		var sTileOfType = "";
		var tile = [];
		
		for (var i=0; i < this.gridSize[0]; i++){
			for(var j=0; j < this.gridSize[1]; j++){
				if (this.tileTypes[i][j] !== type){
					continue;
				}
				
				tile = [i, j];
				sTileOfType = "";
				
				if (tile[1] > 0){
					sTileOfType += Number(this.tileTypes[tile[0]][tile[1] - 1] === type2 ? "1" : "0");
				}
				else{
					sTileOfType += "0";
				}
				if (tile[0] > 0){
					sTileOfType += Number(this.tileTypes[tile[0] - 1][tile[1]] === type2 ? "1" : "0");
				}
				else{
					sTileOfType += "0";
				}
				if (tile[0] < this.gridSize[0] - 1){
					sTileOfType += Number(this.tileTypes[tile[0] + 1][tile[1]] === type2 ? "1" : "0");
				}
				else{
					sTileOfType += "0";
				}
				if (tile[1] < this.gridSize[1] - 1){
					sTileOfType += Number(this.tileTypes[tile[0]][tile[1] + 1] === type2 ? "1" : "0");
				}
				else{
					sTileOfType += "0";
				}
				
				for (var s in surroundingToNewTile){
					if (typeof s === "string" && this._sTileOfTypeEqual(s, sTileOfType)){
						this.tileTypes[i][j] = surroundingToNewTile[s];
					}
				}
			}
		}
	};

	this._sTileOfTypeEqual = function(a, b){
		for (var i=a.length-1; i >= 0; i--){
			if (!(a[i] === "*" || b[i] === "*" || a[i] === b[i])){
				return false;
			}
		}

		return true;
	};
	
	this.pxToTileCoords = function(point){
		var x = point[0] - this.topleft[0];
		var y = point[1] - this.topleft[1];

		var tile = [];
		
		tile[0] = Math.floor(x / this.tileSize[0]);
		tile[1] = Math.floor(y / this.tileSize[1]);
		
		return tile;
	}
	
	this.tileToPxCoords = function(tile){
		var point = [tile[0] * this.tileSize[0], tile[1] * this.tileSize[1]];
		
		point[0] += this.topleft[0];
		point[1] += this.topleft[1];
		
		return point;
	}
	
	this.draw = function(ctx, colour, width){
		ctx.strokeStyle = colour ? colour : "#000000";
		ctx.lineWidth = width ? width : 1;
		
		var end_x = this.topleft[0] + this.gridSize[0] * this.tileSize[0];
		var end_y = this.topleft[1] + this.gridSize[1] * this.tileSize[1];
		
		ctx.beginPath();
		
		var i = this.gridSize[0] + 1;
		
		while(i--){
			var pos = this.topleft[0] + i * this.tileSize[0];
			
			ctx.moveTo(pos, this.topleft[1]);
			ctx.lineTo(pos, end_y);
		}
		
		var j = this.gridSize[1] + 1;
		
		while(j--){
			var pos = this.topleft[1] + j * this.tileSize[1];
						
			ctx.moveTo(this.topleft[0], pos);
			ctx.lineTo(end_x, pos);
		}
		
		ctx.stroke();
	};
	
	this.surroundingTiles = function(tile, adjacent, diagonal){
		adjacent = adjacent === undefined ? true : adjacent;
		diagonal = diagonal === undefined ? true : diagonal;
		
		var tiles = [];
		
		if (tile[0] < 0 || tile[0] > this.gridSize[0] || tile[1] < 0 || tile[1] > this.gridSize[1]){
			throw "Invalid tile co-ordiantes:" + tile;
		}
		
		if (adjacent){
			if (tile[0] > 0){
				tiles.push([tile[0] - 1, tile[1]]);
			}
			if (tile[0] < this.gridSize[0] - 1){
				tiles.push([tile[0] + 1, tile[1]]);
			}
			if (tile[1] > 0){
				tiles.push([tile[0], tile[1] - 1]);
			}
			if (tile[1] < this.gridSize[1] - 1){
				tiles.push([tile[0], tile[1] + 1]);
			}
		}
		
		if (diagonal){
			if (tile[0] > 0 && tile[1] > 0){
				tiles.push([tile[0] - 1, tile[1] - 1]);
			}
			if (tile[0] < this.gridSize[0] - 1 && tile[1] < this.gridSize[1] - 1){
				tiles.push([tile[0] + 1, tile[1] + 1]);
			}
			if (tile[0] < this.gridSize[0] - 1 && tile[1] > 0){
				tiles.push([tile[0] + 1, tile[1] - 1]);
			}
			if (tile[0] > 0 && tile[1] - 1 < this.gridSize[1]){
				tiles.push([tile[0] - 1, tile[1] + 1]);
			}
		}
		
		return tiles;
	};

	this.tilesOverlapRect = function(rect){
		//Function currently only works on rects fully inside the grid. To fix after LD.

		if (! this.containsRect(rect)){
			return [];
		}

		var startTile = this.pxToTileCoords(rect.pos);
		var endTile = this.pxToTileCoords([rect.pos[0] + rect.size[0], rect.pos[1] + rect.size[1]]);

		var tiles = [];

		for (var i=startTile[0]; i <= endTile[0]; i++){
			for(var j=startTile[1]; j <= endTile[1]; j++){
				tiles.push([i, j]);
			}
		}

		return tiles;
	}
	
	this.fillTiles = function(ctx){
		
		if (this.intToTileRender === undefined){
			throw "Grid2D Error: An object is required which maps tile type to a certain colour.";
		}
		
		var start_i = Math.floor(-this.topleft[0] / this.tileSize[0]);
		var start_j = Math.floor(-this.topleft[1] / this.tileSize[1]);
		
		if (start_i >= this.gridSize[0] || start_j >= this.gridSize[1]){
			return;
		}
		
		if (start_i < 0){
			start_i = 0;
		}
		
		if (start_j < 0){
			start_j = 0;
		}
		
		var end_i = Math.ceil((this.screenBottomRight[0] - this.topleft[0]) / this.tileSize[0]);
		var end_j = Math.ceil((this.screenBottomRight[1] - this.topleft[1]) / this.tileSize[1]);
		
		for (var i=start_i; i < end_i; i++){
			if (i < 0 || i >= this.gridSize[0]){
				continue;
			}
			
			for(var j=start_j; j < end_j; j++){
				
				if (j < 0 || j >= this.gridSize[1]){
					continue;
				}
				
				var type = this.tileTypes[i][j];
				
				if (type === -1){
					continue;
				}
				
				var x = this.topleft[0] + i * this.tileSize[0];
				var y = this.topleft[1] + j * this.tileSize[1];
				
				var render = this.intToTileRender[type];

				this._fillTile(ctx, x, y, render);
			}
		}
	};

	this._fillTile = function(ctx, x, y, render){
		if (typeof render === "string"){
			ctx.fillStyle = render;	
			ctx.fillRect(x, y, this.tileSize[0] + 1, this.tileSize[1] + 1);
		}
		else if (this.animationImported && (render instanceof Animator || render instanceof Animation)){
			render.draw(ctx, [x, y]);
		}
		else if (render instanceof Array){
			return this._fillTile(ctx, x, y, Random.choice(render));
		}
		else{
			ctx.drawImage(render, x, y);
		}
	};
}
