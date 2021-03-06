const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const width = canvas.width; 
const height = canvas.height; 
const onePercentWidth = width/100;
const onePercentHeight = height/100;

let gameStart = true;
let blocks = [];
const col = 10;
const row = 10;
const bomb = 15;

let sizeCell = (width - (onePercentWidth*6))/row;

let numberBomb=0;
let flag = bomb;
let time = 0;

let loss = false;
let victory = col*row-bomb;

let flagOrNotFlag = false;
let numberColors = ['#4C64AC', '#01A000', '#FF0204', '#2A4692', '#8B0E04', '#46BCBF', '#544769', '#C0C0C0',];

const bombImg = new Image();
    bombImg.src = 'img/Bomb.png';

const panelImg = new Image();
    panelImg.src = 'img/Panel.png';

const smileImg = new Image();
    smileImg.src = 'img/Smile.png';

const flagImg = new Image();
    flagImg.src = 'img/Flag.png';

const shovelImg = new Image();
    shovelImg.src = 'img/Shovel.png';

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

	ctx.fillStyle = "white";
	ctx.font = "100px Arial";
	if(flag<10 && flag>=0){
		ctx.fillText("00"+flag, onePercentWidth*3, sizeCell*2+onePercentWidth*4, sizeCell*3);
	} else if(flag<100 && flag>=0){ 
		ctx.fillText("0"+flag, onePercentWidth*3, sizeCell*2+onePercentWidth*4, sizeCell*3);
	} else{
		ctx.fillText(flag, onePercentWidth*3, sizeCell*2+onePercentWidth*4, sizeCell*3);
	}

	ctx.drawImage(smileImg, onePercentWidth*3+sizeCell*(row/2)-sizeCell, onePercentWidth*4, sizeCell*2, sizeCell*2);

	ctx.fillStyle = "white";
	ctx.font = "100px Arial";
	if(time<10){
		ctx.fillText("00"+time, onePercentWidth*3+sizeCell*7, sizeCell*2+onePercentWidth*4, sizeCell*3);
	} else if (time<100){
		ctx.fillText("0"+time, onePercentWidth*3+sizeCell*7, sizeCell*2+onePercentWidth*4, sizeCell*3);
	} else if(time<1000){
		ctx.fillText(time, onePercentWidth*3+sizeCell*7, sizeCell*2+onePercentWidth*4, sizeCell*3);
	} else{
		ctx.fillText("999", onePercentWidth*3+sizeCell*7, sizeCell*2+onePercentWidth*4, sizeCell*3);
	}

	$.each(blocks, function(index, value){
		if(loss==true){
			ctx.strokeStyle='rgba(36, 35, 39, 1.0)';
			ctx.strokeRect(onePercentWidth*3+value.x*sizeCell, onePercentHeight*18+value.y*sizeCell, sizeCell, sizeCell);
			if(value.bomb >= 9){
				ctx.drawImage(bombImg, onePercentWidth*3+value.x*sizeCell, onePercentHeight*18+value.y*sizeCell, sizeCell, sizeCell);
			} else if(value.bomb>0 && value.bomb <9){
				inputNumber(value.bomb, value.x, value.y);
			} 
		}else if(value.flag == true){
			ctx.drawImage(panelImg, onePercentWidth*3+value.x*sizeCell, onePercentHeight*18+value.y*sizeCell, sizeCell, sizeCell);
			ctx.drawImage(flagImg, onePercentWidth*3+value.x*sizeCell, onePercentHeight*18+value.y*sizeCell, sizeCell, sizeCell);
		} else if (value.checked == true){
			ctx.strokeStyle='rgba(36, 35, 39, 1.0)';
			ctx.strokeRect(onePercentWidth*3+value.x*sizeCell, onePercentHeight*18+value.y*sizeCell, sizeCell, sizeCell);
			if(value.bomb>0 && value.bomb <9){
				inputNumber(value.bomb, value.x, value.y);
			}
		} else {
			ctx.drawImage(panelImg, onePercentWidth*3+value.x*sizeCell, onePercentHeight*18+value.y*sizeCell, sizeCell, sizeCell);
		}
	})

	ctx.strokeStyle='rgba(36, 35, 39, 1.0)';
	ctx.strokeRect(onePercentWidth*3+sizeCell*(row/2)-sizeCell, onePercentHeight*84, sizeCell*2, sizeCell*2);
	
	if(flagOrNotFlag){
		ctx.drawImage(flagImg, onePercentWidth*3+sizeCell*(row/2)-sizeCell, onePercentHeight*84, sizeCell*2, sizeCell*2);
	} else {
		ctx.drawImage(shovelImg, onePercentWidth*3+sizeCell*(row/2)-sizeCell, onePercentHeight*84, sizeCell*2, sizeCell*2);
	}
	
}

function inputNumber(number, x, y){
	 for(let i = 1; i<9; i++){
	 	if(number == i){
	 		ctx.fillStyle= numberColors[i-1];
			ctx.font = "30px Arial";
			ctx.fillText(number, onePercentWidth*3+x*sizeCell+10, onePercentHeight*18+y*sizeCell+30);
	 	}
	 }
}

function generateBomb(){ 
	$.each(blocks, function(index, value){
		let rand = Math.random();
		if(rand < 0.1 && numberBomb < bomb && value.bomb != 9 ){
			value.bomb = 9;
			numberBomb++;
			numberInCell(value.x, value.y);
		}
	})
	if(numberBomb<bomb){generateBomb();}	
}


function numberInCell(x, y){
	$.each(blocks, function(index, value){
		for(i = -1; i<2; i++){
			for(j = -1; j<2; j++){
				if(value.x == x+i && value.y == y+j && value.bomb <9){
					value.bomb++;
				}
			}
		}
	})
}

function checked(x, y){
	$.each(blocks, function(index, value){
		if(value.x == x && value.y == y && value.checked == false && value.flag == false){
			value.checked = true;
			victory--;
			if(value.bomb == 0){

				for(let a = -1; a<2; a++){
					for(let b = -1; b<2; b++){
						checked(value.x+a, value.y+b);
					}
				}
			}
		} 
	})
}

function clear(){
	ctx.clearRect(0, 0, width, height);
}

function restart(){
	gameStart = true;
	numberBomb = 0;
	loss = false;
	victory = col*row-bomb;
	flag = bomb;
	time = 0;
	start();
}

document.oncontextmenu = function (){
	return false
};

$('canvas').mousedown(function(e){
		let X = e.offsetX || 0;
		let Y = e.offsetY || 0;


		let mouseX = Math.floor((X-onePercentWidth*3)/sizeCell);
		let mouseY = Math.floor((Y-onePercentHeight*18)/sizeCell);

		if(gameStart){
			generateBomb();
			gameStart = false;
		}

		if(loss==false && victory != 0){
			if(flagOrNotFlag){
				$.each(blocks, function(index, value){
					if(value.x == mouseX && value.y == mouseY && e.which == 3 && value.checked == false){
						checked(value.x, value.y);
			    		if(value.bomb >= 9){
			    			loss = true;
			    		} 
					} else if(value.x == mouseX && value.y == mouseY && value.checked == false){
			    		if(value.flag == true){
							value.flag = false;
							flag++;
						} else{
							value.flag = true;
							flag--;
						}
		    		}
	    		})
			} else {
				$.each(blocks, function(index, value){
					if(value.x == mouseX && value.y == mouseY && e.which == 3 && value.checked == false ){
						if(value.flag == true){
							value.flag = false;
							flag++;
						} else{
							value.flag = true;
							flag--;
						}
					} else if(value.x == mouseX && value.y == mouseY && value.flag == false){
			    		checked(value.x, value.y);
			    		if(value.bomb >= 9){
			    			loss = true;
			    		} 
		    		}
	    		})
			}
		}

		if(X >= onePercentWidth*3+sizeCell*(row/2)-sizeCell && X <= onePercentWidth*3+sizeCell*(row/2)+sizeCell && Y >= onePercentWidth*3 && Y <= onePercentWidth*3+sizeCell*2){
			restart();
		}
		if(X >= onePercentWidth*3+sizeCell*(row/2)-sizeCell && X <= onePercentWidth*3+sizeCell*(row/2)+sizeCell && Y >= onePercentHeight*84 && Y <= onePercentHeight*84+sizeCell*2){
			if(flagOrNotFlag){
				flagOrNotFlag = false;
			} else {
				flagOrNotFlag = true;
			}
		}
		draw();
	})

function second(){
	if(victory!=0 && loss!=true){
		time++;
	}
	draw();
}

$(function(){
	start()
	setInterval(second, 1000);
	setInterval(draw, 20);
})