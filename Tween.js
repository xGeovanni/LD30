"use strict";

function getImageData(image){
	var canvas = document.createElement("canvas");
	
	canvas.width = image.width;
	canvas.height = image.height;
	
	canvas.getContext("2d").drawImage(image, 0, 0);
	
	return canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
}

function makeTweenedFrames(image1, image2, numFrames){
	
	if (image1.width !== image2.width || image1.height !== image2.height){
		throw "Images must be the same size.";
	}
	
	var t = 1 / numFrames;
	
	var imageData1 = getImageData(image1);
	var imageData2 = getImageData(image2);
	
	var r, g, b, a;
	
	var frames = [];
	
	var canvas;
	var canvasImageData;
	
	for (var i=0; i < numFrames; i++){
		canvas = document.createElement("canvas");
		canvas.width = image1.width;
		canvas.height = image1.height;
		canvasImageData = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
		
		for (a=imageData1.data.length-1; a > 0; a -= 4){
			
			r = a - 3;	
			g = a - 2;
			b = a - 1;
			
			canvasImageData.data[r] = imageData2.data[r] + (imageData1.data[r] - imageData2.data[r]) * t * i;
			canvasImageData.data[g] = imageData2.data[g] + (imageData1.data[g] - imageData2.data[g]) * t * i;
			canvasImageData.data[b] = imageData2.data[b] + (imageData1.data[b] - imageData2.data[b]) * t * i;
			canvasImageData.data[a] = imageData2.data[a] + (imageData1.data[a] - imageData2.data[a]) * t * i;
				
		}
		
		canvas.getContext("2d").putImageData(canvasImageData, 0, 0);
		
		frames.push(canvas);
	}
	
	return frames;
}
