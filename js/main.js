let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let width = canvas.width; //384
let height = canvas.height; //664
let width1 = width/100;
let height1 = height/100;


let GameStart = true;
let blocks = [];
let col = 10;
let row = 10;
let bomb = 15;
let win_bomb = bomb;
let lose = true;
let bombs = bomb;
let win = col*row;
let now = 0;	

let width2 = (width - (width1*6))/row;

let	bombImg = new Image();
    bombImg.src = 'img/Bomb.png';

let panelImg = new Image();
    panelImg.src = 'img/Panel.png';

let smileImg = new Image();
    smileImg.src = 'img/Smile.png';

let flagImg = new Image();
    flagImg.src = 'img/Flag.png';

function start(){
	blocks = [];
	for (let y = 0; y < col; y++) {
		for (let x = 0; x < row; x++) {	
			blocks.push({"x":x, "y":y, "bomb":0, "checked":false, "flag":false});
		}
	}
	draw();
}

function draw(){
 	clear();

	if(win != win_bomb && lose ){
		ctx.fillStyle = "white";
		ctx.font = "100px Arial";
		if(bombs>=0){
			ctx.fillText("0"+bombs, width1*3, width2*2+width1*4, width2*3);
		} else{ 
			ctx.fillText(bombs, width1*3, width2*2+width1*4, width2*3);
		}	
	}
	
	ctx.drawImage(smileImg, width1*3+width2*(row/2)-width2, width1*4, width2*2, width2*2);
	
	if(win != win_bomb && lose ){
		ctx.fillStyle = "white";
		ctx.font = "100px Arial";
		if(now<10){
			ctx.fillText("00"+now, width1*3+width2*7, width2*2+width1*4, width2*3);
		} else if (now<100){
			ctx.fillText("0"+now, width1*3+width2*7, width2*2+width1*4, width2*3);
		} else if(now<1000){
			ctx.fillText(now, width1*3+width2*7, width2*2+width1*4, width2*3);
		} else{
			ctx.fillText("999", width1*3+width2*7, width2*2+width1*4, width2*3);
		}
	}


	if(lose){
		$.each(blocks, function(index, value){
			if(win == win_bomb){
				ctx.fillStyle = "yellow";
				ctx.font = "70px Arial";
				ctx.fillText("Ви виграли!", 120, 500);
			}else if(value.checked==true){
				ctx.strokeStyle='rgba(36, 35, 39, 1.0)';
				ctx.strokeRect(width1*3+value.x*width2, height1*18+value.y*width2, width2, width2);
			
				if(value.bomb >= 9){
					ctx.drawImage(bombImg, width1*3+value.x*width2, height1*18+value.y*width2, width2, width2);
				} else if(value.bomb != 0){
					textNum(value.bomb, value.x, value.y);
				}
			} else {
				ctx.drawImage(panelImg, width1*3+value.x*width2, height1*18+value.y*width2, width2, width2);
			}
			if(value.flag == true && win != win_bomb){
				ctx.drawImage(flagImg, width1*3+value.x*width2, height1*18+value.y*width2, width2, width2);
			} 
		})
	} else {
		losed();
	}
}

function textNum(number, x, y){
	ctx.fillStyle='rgba(35, 255, 35, 1.0)';
	ctx.font = "30px Arial";
	ctx.fillText(number, width1*3+x*width2+10, height1*18+y*width2+30);
}

function generateBomb(x, y){

	$.each(blocks, function(index, value){
		let rand = Math.random();
		if(rand < 0.1 && value.bomb != 9 && bomb > 0 && value.x != x && value.y != y){
			value.bomb = 9;
			bomb--;
			number(value.x-1, value.y-1);
			number(value.x,   value.y-1);
			number(value.x+1, value.y-1);
			number(value.x-1, value.y);
			number(value.x+1, value.y);
			number(value.x-1, value.y+1);
			number(value.x,   value.y+1);
			number(value.x+1, value.y+1);
		} 
	}); if(bomb>0){generateBomb(x, y);}
}

function number(x, y){
	if(x>=0 && y>=0 && x<col && y<row) {
    	$.each(blocks, function(index, value){
    		if(value.x == x && value.y == y){
    			value.bomb++;
    		}
    	})
    }
}

function checked(x, y){
	if(x>=0 && y>=0 && x<col && y<row) {
    	$.each(blocks, function(index, value){
    		if(value.x == x && value.y == y && value.checked == false && value.flag == false){
    			value.checked = true;
    			win--;
    			if(value.bomb == 0){
	    			checked(value.x-1, value.y-1);
					checked(value.x,   value.y-1);
					checked(value.x+1, value.y-1);
					checked(value.x-1, value.y);
					checked(value.x+1, value.y);
					checked(value.x-1, value.y+1);
					checked(value.x,   value.y+1);
					checked(value.x+1, value.y+1);
				}
    		}
    	})
    }
}

function losed(){
	ctx.fillStyle = "red";
	ctx.font = "70px Arial";
	ctx.fillText("Ви програли!", 120, 500);
}

function clear(){
	ctx.clearRect(0, 0, width, height);
}

function restart(){
	bomb = 15;
	now = 0;
	bombs = bomb;
	lose = true;
	GameStart = true;
	win = row*col;
	start();
	draw();
}


document.oncontextmenu = function(e) {
    return false;
};
 
$('canvas').mousedown(function(e){
	let X = e.offsetX || 0;
	let Y = e.offsetY || 0;

	let mouseX = Math.floor((X-width1*3)/width2);
	let mouseY = Math.floor((Y-height1*18)/width2);
  
	if(GameStart){
		generateBomb(mouseX, mouseY);
		GameStart = false;
	}

	if(lose){
		$.each(blocks, function(index, value){
			if(value.x == mouseX && value.y == mouseY && e.which == 3 && value.checked == false ){
				if(value.flag == true){
					value.flag = false;
					bombs++;
				} else{
					value.flag = true;
					bombs--;
				}
				
			} else if(value.x == mouseX && value.y == mouseY && value.flag == false){
	    		checked(value.x, value.y);
	    		if(value.bomb >= 9){
	    			lose = false;
	    		} 
	    	}
	    })
	}
	if(X >= width1*3+width2*(row/2)-width2 && X <= width1*3+width2*(row/2)+width2 && Y >= width1*3 && Y <= width2*2+width1*3 ){
		restart();
	}

	draw();	
})

function time(){
	now++;
}

$(function(){
	start();
	setTimeout(draw, 10);
	setInterval(time, 1000);
	setInterval(draw, 1000);
})