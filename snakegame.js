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

var speedLabel = document.createElement('label');
speedLabel.innerHTML="Speed ";
var speedBtn = document.createElement('input');
speedBtn.classList.add("speed");
speedBtn.type="range";
speedBtn.min="3";
speedBtn.max="9";
speedBtn.value="5";
speedLabel.appendChild(speedBtn);
container.appendChild(speedLabel);
//Defual for speed needed...

/*** Global parameters ***/
var topScores = [0,0,0]; // top three scores
var eventkey = 2; // direction according to keypress of left, up, down, right. default 2===right
var previouskey; //to prevent from eating backwards
var restart=true; //prevents starting another snake while game ongoing
var totalScore=0; //in-game score
var bonusAmount=10; //bonus points for bonus object
var topscores = document.querySelector('.scoreboard').lastElementChild;
var livescore = document.querySelector('.scoreboard').firstElementChild;
var speed=500;
//console.log("start game");
speedBtn.addEventListener('change',(e)=>{speed=100*parseInt(e.target.value);})
//document.getElementsByTagName('body')[0].style.overflow="hidden";
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
	if(previouskey!==eventkey && ((previouskey%37%2==0 && eventkey%37%2==0) || (previouskey%37%2==1 && eventkey%37%2==1))){
		//return //will pause the game.
		eventkey=previouskey 
	}
	var p = snake[snake.length-1];
	
	if(i!==0) { snake.unshift(addVecs(snake[0],states[eventkey%37])) }
	else{ snake.unshift(addVecs(snake[0],[0,1]))	};
	
	var s = [snake[0][0],snake[0][1]]
	if( s[0]<0 || s[0]>14 || s[1]<0 || s[1]>14 || table.rows[s[0]].cells[s[1]].firstElementChild.checked){
		gameOver=true;
		alert("game over"); 
		restart=true;
		
		prev=bonusPoint(prev,true);
		
		clearInterval(interval);
		clearBoard(snake,p);
		
		topScores.push(totalScore);
		topScores=topScores.sort(function(a,b){return (+a) - (+b);}).reverse();
		
		topscores.innerHTML = "Top 3 scores: "+topScores[0]+", "+topScores[1]+", "+topScores[2]+".";
		
		//console.log(topScores);
		topScores.pop();
		totalScore=0;
		livescore.innerHTML="Live score: "+totalScore;
		
	}else{
		if(table.rows[s[0]].cells[s[1]].firstElementChild.classList.contains('bonus')) {
			totalScore+=bonusAmount;
			prev=bonusPoint(prev);
			//console.log(totalScore);
			livescore.innerHTML="Live score: "+totalScore;
		}
		else{
			table.rows[p[0]].cells[p[1]].firstElementChild.checked=false;
			snake.pop();
		}
		table.rows[s[0]].cells[s[1]].firstElementChild.checked=true; 
	}
	i=1;
	previouskey=eventkey;
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
	
	interval = setInterval(startGame,1000-speed); 
};	

// Mobile-version to be added very soon