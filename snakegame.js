const container = document.querySelector('.container');
var table = document.createElement('table');

for(var i=0; i<15;i++){
	var row = document.createElement('tr');
	for(var j=0; j<15;j++){
		var cell = document.createElement('td');
		if(j<5 && i===0){cell.innerHTML+='<input type="checkbox" checked>';}
		else{cell.innerHTML+='<input type="checkbox">';}
		row.appendChild(cell);
		
	}
	table.appendChild(row);
}
container.appendChild(table);
var eventkey = 2;
//document.body.addEventListener('keydown',(e)=>{
//	console.log(e.code);
//	eventkey=e.code==="ArrowLeft"?37:(e.code==="ArrowUp"?38:(e.code==="ArrowRight"?39:40));
//	})

var startBtn = document.createElement('div');
startBtn.innerHTML="Start Game";
document.body.insertBefore(startBtn,container);
document.body.children[1].addEventListener('click', begin);		


console.log("start game");
document.getElementsByTagName('body')[0].style.overflow="hidden";
document.body.addEventListener('keydown',(e)=>{
	eventkey=e.code==="ArrowLeft"?37:(e.code==="ArrowUp"?38:(e.code==="ArrowRight"?39:40));
	console.log(e.code, eventkey);
})
var table = document.querySelector('table');
var snake = [[0,4],[0,3],[0,2],[0,1],[0,0]];
var states = [[0,-1],[-1,0],[0,1],[1,0]];
function addVecs(a,b){return [a[0]+b[0],a[1]+b[1]];} 
var interval;
var gameOver = false;
var i=0;
function startGame(){	
	var p = snake.pop()
	console.log(eventkey)
	if(i!==0) {snake.unshift(addVecs(snake[0],states[eventkey%37]))}
	else{snake.unshift(addVecs(snake[0],[0,1]))};
	var s = [snake[0][0],snake[0][1]];
	console.log(s)
	//console.log(table.rows[s[0]].cells[s[1]]);
	if( s[0]<0 || s[0]>14 || s[1]<0 || s[1]>14 || table.rows[s[0]].cells[s[1]].firstElementChild.checked){
		gameOver=true;
		alert("game over"); clearInterval(interval);
	}else{
		table.rows[p[0]].cells[p[1]].firstElementChild.checked=false;
		table.rows[s[0]].cells[s[1]].firstElementChild.checked=true; 
	}
	i=1;
	
}

function begin(){
	 interval = setInterval(startGame,500);
};	

if(gameOver) clearInterval(interval);











/*** canvas animation from stackExchange ***/
const canvas = document.querySelector('#canvas');
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

//****** LOOK INTO WEBGL SOMETIME *******