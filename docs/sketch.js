const m = 5 - 1;
var boards = [...new Array(m)].map((_,i) => [...new Array(m)].map((_,j) => 0));// 1 <= / , -1 <=  \

var gs = 0;
const hei = 375;
const wid = 375;
var flag=false;
var dflag = false;
const margin = 50;
const FW = false;
const DF = true;
var MyRole = FW;
var turn = null;
var bless = true;
var win = false;
var lose = false;
var FirstPoint = new Array(2);
var FinishPoint = new Array(2);
var ename="待機中"
FinishPoint[0] = -1
const ws = (wid-margin*2)/m;
const hs = (hei-margin*2)/m;
  const socket=io("https://onlineapi.glitch.me", {
	  "force new connection" : true,
	  "reconnectionAttempts": "Infinity",
	  "transports" : ["websocket"]
  });
function setup() {
	
  createCanvas(wid,hei+60);
  document.getElementById("defaultCanvas0").classList.add("vanish");
  var uname = prompt("ユーザー名を入力してください!");
  if(!uname){uname=""}
  if(uname.trim()==""){uname="名無し";console.log("a")}
　.replace(/&/g, '&lt;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, "&#x27;");
  socket.emit("enter",{username:uname});
  socket.emit("req",{});
  let btn = document.getElementById("plusb");
  btn.onclick = function(){
		document.getElementById("rooms").classList.add("vanish");
		document.getElementById("defaultCanvas0").classList.remove("vanish");
		socket.emit("create",{roomname:"O",turn:false})
	}
  let btn2 = document.getElementById("reqb");
  btn2.onclick = function(){
		socket.emit("req");
	}
}
socket.on("roomdata",(e)=>{
	let hj = document.getElementById("jj");
	hj.innerHTML="";
  for(var i=0;i<e.length;i++){
	if(e[i]!=null){
	if(!e[i].status){
		let ins = document.createElement('li');
		ins.innerHTML = (e[i].hostname);
		ins.setAttribute('id', i);
		ins.addEventListener('click', join_);
		hj.appendChild(ins);
		}
	}
  }
})
socket.on("signaling",(e)=>{
	socket.emit("start")
	console.log("signaling");
	ename = e.from;
	turn=FW;
	gs=100;
})
socket.on("start",(e)=>{
	turn=FW;
	console.log("sdanlk");
})
socket.on("action",(e)=>{
	console.log(e)
	boards[e.x][e.y]=e.st;
	if(!bless){turn=!turn;}else{bless=!bless;}
		x=e.x;y=e.y;
		iswin(x,y)
})
socket.on("close",(e)=>{
	socket.emit("closed");
	alert("対戦相手との接続が切れました。");
	if(!lose){win=true;}
	turn=null;
	socket.emit("leave");
})
socket.on("lg",function(){
	
	alert("対戦相手との接続が切れました。");
	if(!lose){win=true;}
	turn=null;
    socket.emit("leave");
})
function iswin(x,y){
		if(boards[x][y]==-1){
          if(sonoba(x-1,y)==1 && sonoba(x-1,y+1)==-1 && sonoba(x,y+1)==1){Hishi();}
          if(sonoba(x+1,y)==1 && sonoba(x+1,y-1)==-1 && sonoba(x,y-1)==1){Hishi();}
		  if(sonoba(x+1,y)==-1 && sonoba(x+2,y)==-1 && sonoba(x+3,y)==-1){Hishi();}
		  if(sonoba(x,y+1)==-1 && sonoba(x,y+2)==-1 && sonoba(x,y+3)==-1){Hishi();}
        }else{
          if(sonoba(x-1,y)==-1 && sonoba(x-1,y-1)==1 && sonoba(x,y-1)==-1){Hishi();}
          if(sonoba(x+1,y)==-1 && sonoba(x,y+1)==-1 && sonoba(x+1,y+1)==1){Hishi();}
		  if(sonoba(x+1,y)==1 && sonoba(x+2,y)==1 && sonoba(x+3,y)==1){Hishi();}
		  if(sonoba(x,y+1)==1 && sonoba(x,y+2)==1 && sonoba(x,y+3)==1){Hishi();}
        }
}
function join_(e){
	document.getElementById("rooms").classList.add("vanish");
	document.getElementById("defaultCanvas0").classList.remove("vanish")
	let path = e.path || e.composedPath()
	let c = path[0].getAttribute("id")
	socket.emit("join",{roomid:c});
	MyRole=DF;
	ename = path[0].innerHTML;
	gs=100;
}
function req(){
	socket.emit("req",{});
}
function Hishi(){
  if(MyRole==DF){lose=true}else{win=true}
  turn=null;
  socket.emit("end",{});
  socket.emit("leave");
}
socket.on("end",function(){
	socket.emit("leave");
})
socket.on("error",function(){
	alert("エラーが発生しました。");
	location.reload();
})
function PtoP(x,y){
  let k = new Array(2);
  k[0]=x*ws+margin;
  k[1]=y*hs+margin;
  return k
}
function sonoba(x,y){
  x_= (x+m)%m;y_ = (y+m)%m;
  return boards[x_][y_]
}
function draw() {
  background(220);
  for(var i=0;i<m;i++){
    for(var j=0;j<m;j++){
      if(boards[i][j]==1){line(PtoP(i,j+1)[0],PtoP(i,j+1)[1],PtoP(i+1,j)[0],PtoP(i+1,j)[1]);}
      if(boards[i][j]==-1){line(PtoP(i,j)[0],PtoP(i,j)[1],PtoP(i+1,j+1)[0],PtoP(i+1,j+1)[1]);}
    }
  }
  for(var i=0;i<=m;i++){
    for(var j=0;j<=m;j++){
      ellipse(PtoP(i,j)[0], PtoP(i,j)[1], 10);
    }
  }
  if(dflag && !mouseIsPressed){ // マウス離す
    if(FinishPoint[0] != -1){
      x=Math.floor((FirstPoint[0]+FinishPoint[0])/2);
      y=Math.floor((FirstPoint[1]+FinishPoint[1])/2);
      if(boards[x][y]==0){
        if(FinishPoint[0]-FirstPoint[0] == FinishPoint[1]-FirstPoint[1]){
          boards[x][y]=-1;
          if(MyRole){if(sonoba(x+1,y+1)==-1 || sonoba(x-1,y-1)==-1){boards[x][y]=0;}} //
		  iswin(x,y);
        }else{
          boards[x][y]=1;
          if(MyRole){if(sonoba(x-1,y+1)==1 || sonoba(x+1,y-1)==1){boards[x][y]=0;}} //
		  iswin(x,y);
        }
        if(boards[x][y]!=0){if(!bless){
			turn=!turn;
			socket.emit("action",{x:x,y:y,st:boards[x][y],r:false});
			}else{bless=false;socket.emit("action",{x:x,y:y,st:boards[x][y],r:true});}
		}
      }
    }
  }
  if(mouseIsPressed && flag){
    let s = PtoP(FirstPoint[0],FirstPoint[1]);
    mx = mouseX;my = mouseY;FinishPoint[0] = -1;
    for(var i=0;i<=m;i++){
      for(var j=0;j<=m;j++){
        if( (mouseX - i*ws-margin)**2 + (mouseY - j*hs-margin)**2 <=20**2 && (FirstPoint[0]-i)**2>=1 && (FirstPoint[1]-j)**2>=1){FinishPoint[0]=i;FinishPoint[1]=j;mx=PtoP(i,j)[0];my=PtoP(i,j)[1]}
      }
    }
    line(s[0],s[1],mx,my);
  }
  dflag = mouseIsPressed;
  fill(0)
  textAlign(CENTER);
  textSize(50);
  if(win){text("YOU WIN!",wid/2,hei/2)}
  if(lose){text("YOU LOSE",wid/2,hei/2)}
  if(gs){gs--;text("GAME START",wid/2,hei/2)}
  line(0,hei,wid,hei);
  textSize(20);
  text("対戦相手:" + ename,wid/2,hei+20)
  if(MyRole!=turn){fill(200)}
  text("YOUR TURN",wid/2,hei+40)
  fill(255)
}
function mousePressed(){
  flag = false;
  for(var i=0;i<=m;i++){
    for(var j=0;j<=m;j++){
      if( MyRole==turn && (mouseX - i*ws-margin)**2 + (mouseY - j*hs-margin)**2 <=20**2 ){FirstPoint[0]=i;FirstPoint[1]=j;flag = true;}
    }
  }
}
function keyPressed(){
  if(keyCode === UP_ARROW){
    MyRole=!MyRole;
  }
  return false;
}
