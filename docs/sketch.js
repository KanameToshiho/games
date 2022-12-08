const m = 5 - 1;
var boards = [...new Array(m)].map((_,i) => [...new Array(m)].map((_,j) => 0));// 1 <= / , -1 <= \
const wid = 400;
const hei = 400;
var flag=false;
var dflag = false;
const margin = 50;
const FW = false;
const DF = true;
var MyRole = FW;
var turn = FW;
var bless = true;
var win = false;
var lose = false;
var FirstPoint = new Array(2);
var FinishPoint = new Array(2);
FinishPoint[0] = -1
const ws = (wid-margin*2)/m;
const hs = (hei-margin*2)/m;
function setup() {
  createCanvas(wid,hei);

  
}
function Hishi(){
  if(MyRole==DF){lose=true}else{win=true}
}
function PtoP(x,y){
  let k = new Array(2);
  k[0]=x*ws+margin;
  k[1]=y*hs+margin;
  return k
}
function sonoba(x,y){
  if( 0<=x && x<m && 0<=y && y<m){return boards[x][y]}else{return 0}
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
          if(sonoba(x-1,y)==1 && sonoba(x-1,y+1)==-1 && sonoba(x,y+1)==1){Hishi();}
          if(sonoba(x+1,y)==1 && sonoba(x+1,y-1)==-1 && sonoba(x,y-1)==1){Hishi();}
        }else{
          boards[x][y]=1;
          if(MyRole){if(sonoba(x-1,y+1)==1 || sonoba(x+1,y-1)==1){boards[x][y]=0;}} //
          if(sonoba(x-1,y)==-1 && sonoba(x-1,y-1)==1 && sonoba(x,y-1)==-1){Hishi();}
          if(sonoba(x+1,y)==-1 && sonoba(x,y+1)==-1 && sonoba(x+1,y+1)==1){Hishi();}
        }
        if(boards[x][y]!=0){if(!bless){turn=!turn;}else{bless=false;}};
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
  textAlign(CENTER);
  textSize(50);
  if(win){text("YOU WIN!",wid/2,hei/2)}
  if(lose){text("YOU LOSE",wid/2,hei/2)}
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