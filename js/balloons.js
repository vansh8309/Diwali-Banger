/* ---- Balloon range ---- */
(function(){
var cv=document.getElementById('cv'),c=cv.getContext('2d'),ov=document.getElementById('ov'),
scE=document.getElementById('sc'),tmE=document.getElementById('tm'),W,H,dpr;
var cols=['#ffd60a','#c1121f','#f6e7bd','#e0457b','#ff8a1f','#1f8a70'];
var bs=[],ps=[],rings=[],score=0,left=30,running=false,last=0,spawn=0,tick=0;
function size(){dpr=window.devicePixelRatio||1;var r=cv.getBoundingClientRect();W=r.width;H=r.height;cv.width=W*dpr;cv.height=H*dpr;c.setTransform(dpr,0,0,dpr,0,0)}
size();window.addEventListener('resize',size);
function add(){var r=24+Math.random()*16;bs.push({x:r+Math.random()*(W-2*r),y:H+r*1.4,r:r,vy:50+Math.random()*60+score*.8,ph:Math.random()*6,col:cols[Math.floor(Math.random()*cols.length)]})}
function pop(b){score++;scE.textContent=score;for(var i=0;i<16;i++){var a=Math.random()*6.28,s=80+Math.random()*180;ps.push({x:b.x,y:b.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:1,col:b.col})}rings.push({x:b.x,y:b.y,l:1})}
cv.addEventListener('pointerdown',function(e){
  if(!running)return;var r=cv.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
  for(var i=bs.length-1;i>=0;i--){var b=bs[i],dx=(x-b.x)/b.r,dy=(y-b.y)/(b.r*1.25);
    if(dx*dx+dy*dy<1.25){pop(b);bs.splice(i,1);return}}
  rings.push({x:x,y:y,l:1,miss:1});
});
function drawB(b){
  c.strokeStyle='#ffffff55';c.lineWidth=1;c.beginPath();c.moveTo(b.x,b.y+b.r*1.25);
  c.quadraticCurveTo(b.x+Math.sin(tick*2+b.ph)*8,b.y+b.r*2,b.x,b.y+b.r*2.8);c.stroke();
  c.fillStyle=b.col;c.beginPath();c.ellipse(b.x,b.y,b.r,b.r*1.25,0,0,6.283);c.fill();
  c.beginPath();c.moveTo(b.x,b.y+b.r*1.25);c.lineTo(b.x-5,b.y+b.r*1.25+8);c.lineTo(b.x+5,b.y+b.r*1.25+8);c.fill();
  c.fillStyle='#ffffff55';c.beginPath();c.ellipse(b.x-b.r*.35,b.y-b.r*.45,b.r*.18,b.r*.3,.5,0,6.283);c.fill();
}
function loop(t){
  var dt=Math.min(.05,(t-last)/1000||0);last=t;tick+=dt;
  c.clearRect(0,0,W,H);
  if(running){left-=dt;spawn-=dt;if(spawn<=0){add();spawn=Math.max(.3,.8-score*.012)}
    tmE.textContent=Math.max(0,Math.ceil(left));if(left<=0)end()}
  for(var i=bs.length-1;i>=0;i--){var b=bs[i];b.y-=b.vy*dt;b.x+=Math.sin(tick*1.5+b.ph)*.4;if(b.y<-b.r*3)bs.splice(i,1);else drawB(b)}
  for(i=ps.length-1;i>=0;i--){var p=ps[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=300*dt;p.l-=dt*1.6;
    if(p.l<=0){ps.splice(i,1);continue}c.globalAlpha=p.l;c.fillStyle=p.col;c.beginPath();c.arc(p.x,p.y,4,0,6.283);c.fill()}
  for(i=rings.length-1;i>=0;i--){var g=rings[i];g.l-=dt*3;if(g.l<=0){rings.splice(i,1);continue}
    c.globalAlpha=g.l;c.strokeStyle=g.miss?'#ffffff':'#ffb627';c.lineWidth=2;c.beginPath();c.arc(g.x,g.y,(1-g.l)*(g.miss?18:46)+4,0,6.283);c.stroke()}
  c.globalAlpha=1;requestAnimationFrame(loop);
}
function end(){running=false;ov.style.display='flex';document.getElementById('ovt').textContent=score+(score===1?' balloon popped':' balloons popped');
  document.getElementById('ovs').textContent=score>=25?'Sharpshooter. See you at the gallery.':'Good aim. Try for a higher score.';document.getElementById('go').textContent='Play again'}
document.getElementById('go').addEventListener('click',function(){size();bs=[];ps=[];score=0;left=30;spawn=0;scE.textContent=0;tmE.textContent=30;ov.style.display='none';running=true;cv.focus({preventScroll:true})});
requestAnimationFrame(loop);
})();

