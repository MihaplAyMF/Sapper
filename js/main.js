var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
var array = [];
var x1 = 10;
var y1 = 10;

function draw(){

	clear()

	ctx.fillStyle='rgba(35, 255, 35, 1.0)';
	ctx.beginPath();
	ctx.fillRect(0, 0, 648,152);
	ctx.closePath();
	ctx.fill();

	for(i=0; i<array.length; i++){
		ctx.strokeStyle='rgba(35, 255, 35, 1.0)';
		ctx.beginPath();
		ctx.strokeRect(24+array[i][0]*60, 364+array[i][1]*60, 60, 60);
		ctx.closePath();
		ctx.fill();
	}
}
	
function sapper(){
	i = 0;
	for (var x = 0; x < x1; x++) {	
		for (var y = 0; y < y1; y++) {
			array[i] = [x, y];
			i++;
		}
	}
}	

function clear(){
	ctx.clearRect(0, 0, width, height);
}

$(function(){
	sapper();
 	draw();
})