/*** Setting up playing field ***/
const container = document.querySelector('.container');
var table = document.createElement('table');


for(var i=0; i<15;i++){
	var row = document.createElement('tr');
	for(var j=0; j<15;j++){
		var cell = document.createElement('td');

		cell.innerHTML+='<input type="checkbox">';
		row.appendChild(cell);
	}
	table.appendChild(row);
}
container.appendChild(table);

/*** Game Tools ***/
var startBtn = document.createElement('div');
startBtn.innerHTML="Start Game";
document.body.insertBefore(startBtn,container);
document.body.children[1].addEventListener('click', begin);	

var scoreboard = document.createElement('div');
scoreboard.classList.add('scoreboard');
var liveScore = document.createElement('p');
var scoreHeader = document.createElement('p');
liveScore.innerHTML="Live score:";
scoreHeader.innerHTML="Top 3 scores:"
scoreboard.appendChild(liveScore);
scoreboard.appendChild(scoreHeader);
document.body.insertBefore(scoreboard,container);

/*** Global parameters ***/
var topScores = [0,0,0]; // top three scores
var eventkey = 2; // direction according to keypress of left, up, down, right. default 2===right
var restart=true; //prevents starting another snake while game ongoing
var totalScore=0; //in-game score
var bonusAmount=10; //bonus points for bonus object
var topscores = document.querySelector('.scoreboard').lastElementChild;
var livescore = document.querySelector('.scoreboard').firstElementChild;
//console.log("start game");

document.getElementsByTagName('body')[0].style.overflow="hidden";
document.body.addEventListener('keydown',(e)=>{
	eventkey=e.code==="ArrowLeft"?37:(e.code==="ArrowUp"?38:(e.code==="ArrowRight"?39:40));
})

/*** Game Methods ***/

function addVecs(a,b){ return [a[0]+b[0],a[1]+b[1]];}
 
function clearBoard(snake,lastDeleted){ 
	table.rows[lastDeleted[0]].cells[lastDeleted[1]].firstElementChild.checked=false;
	var k=0;
	for(var c of snake){
		if(k!==0) table.rows[c[0]].cells[c[1]].firstElementChild.checked=false;
		k=1;
	}
}

function randPoint(firstPoint=false){
	if(firstPoint){
		var c = Math.round(Math.random()*3);
		var point;
		switch(c){
			case 0: point = [1,Math.round(Math.random())*14]; break;
			case 1: point = [Math.round(Math.random())*14,1]; break;
			case 2: point = [14,Math.round(Math.random())*14]; break;
			default: point = [Math.round(Math.random())*14,14]; break;
		}
		eventkey=3-c;
		return point;
	}
	var x = Math.round(Math.random()*14)
	var y = Math.round(Math.random()*14)
	while(table.rows[x].cells[y].firstElementChild.checked){
		x = Math.round(Math.random()*14)
		y = Math.round(Math.random()*14)
	}
	return [x,y];
}
function bonusPoint(prev,b){
	if(prev!=undefined)table.rows[prev[0]].cells[prev[1]].firstElementChild.classList.remove('bonus');
	if(b==true){ table.rows[prev[0]].cells[prev[1]].firstElementChild.classList.remove('bonus'); return; }
	var point = randPoint();
	var x=point[0]
	var y=point[1]
	table.rows[x].cells[y].firstElementChild.classList.add('bonus');
	return [x,y];
}

function startGame(){
	
	var p = snake[snake.length-1];
	
	if(i!==0) {
		snake.unshift(addVecs(snake[0],states[eventkey%37]))
	}
	else{ 
		snake.unshift(addVecs(snake[0],[0,1]))
	};
	
	var s = [snake[0][0],snake[0][1]]
	if( s[0]<0 || s[0]>14 || s[1]<0 || s[1]>14 || table.rows[s[0]].cells[s[1]].firstElementChild.checked){
		gameOver=true;
		alert("game over"); 
		restart=true;
		
		prev=bonusPoint(prev,true);
		
		clearInterval(interval);
		clearBoard(snake,p);
		
		topScores.push(totalScore);
		topScores=topScores.sort().reverse();
		
		topscores.innerHTML = "Top 3 scores: "+topScores[0]+", "+topScores[1]+", "+topScores[2]+".";
		
		console.log(topScores);
		topScores.pop();
		totalScore=0;
		
		
	}else{
		if(table.rows[s[0]].cells[s[1]].firstElementChild.classList.contains('bonus')) {
			totalScore+=bonusAmount;
			prev=bonusPoint(prev);
			console.log(totalScore);
			livescore.innerHTML="Live score: "+totalScore;
		}
		else{
			table.rows[p[0]].cells[p[1]].firstElementChild.checked=false;
			snake.pop();
		}
		table.rows[s[0]].cells[s[1]].firstElementChild.checked=true; 
	}
	i=1;
}

var snake;
var states;
var prev;
var interval;
var gameOver;
var p;

/*** 'Game engine' ***/
function begin(){
	
	if(!restart) return 
	restart=false
	
	var table = document.querySelector('table');
	var startPoint = randPoint(true); //c=0, st:3,  c=1, st:2,  c=2, st:1, c=3 st:0
	snake = [startPoint];
	states = [[0,-1],[-1,0],[0,1],[1,0]];//Direction the snake should head to
	
	prev = bonusPoint();
	gameOver = false;
	var i=0;
	
	interval = setInterval(startGame,400); 
};	

//if(gameOver) clearInterval(interval);


//function genRand
//generate random coordinate, check if input is checked, if so repeat, if not, add to classList bonus icon.
// add extra condition to game, to check if there is bonus, ++bonusAmount to score. 
// Do similar for normal goalPost, add appropriate icon.
//If gameOver, offer to try again. 
//Possibly keep track of history, by appending to a container for scores, structures as a table.

/////TWO pieces: shouldn't be able to eat backwards, shouldn't gameover without using making a move;







/*** canvas animation from stackExchange ***/
/* const canvas = document.querySelector('#canvas');
canvas.width = 600//window.innerWidth;
canvas.height = 400//window.innerHeight;

const context = canvas.getContext("2d");

//canvas.addEventListener('mousemove', drawRect);

function drawRect(event){
	var x = event.clientX;
	var y = event.clientY;
	
	context.rect(x,y,20,20)
	context.stroke()
}



const ctx = context;

function render(time) {
  time *= 0.001;
  resizeCanvasToDisplaySize(ctx.canvas);
 
  ctx.fillStyle = "#DDE";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.save();
 
  const spacing = 74;
  const size = 48;
  const across = ctx.canvas.width  / spacing + 1;
  const down   = ctx.canvas.height / spacing + 1;
  const s = Math.sin(time);
  const c = Math.cos(time);
  for (let y = 0; y <= down; ++y) {
    for (let x = 0; x <= across; ++x) {
      ctx.setTransform(c, -s, s, c, x * spacing, y * spacing);
      ctx.strokeRect(-size / 2, -size / 2, size, size);
    }
  }
  
  ctx.restore();
  
  requestAnimationFrame(render);
}
requestAnimationFrame(render);

function resizeCanvasToDisplaySize(canvas) {
   // look up the size the canvas is being displayed
   const width = canvas.clientWidth;
   const height = canvas.clientHeight;

   // If it's resolution does not match change it
   if (canvas.width !== width || canvas.height !== height) {
     canvas.width = width;
     canvas.height = height;
     return true;
   }

   return false;
}


// returns true iff the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
function intersects(a,b,c,d,p,q,r,s) {
  var det, gamma, lambda;
  det = (c - a) * (s - q) - (r - p) * (d - b);
  if (det === 0) {
    return false;
  } else {
    lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
    gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
    return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
  }
};

//****** LOOK INTO WEBGL SOMETIME ******* */