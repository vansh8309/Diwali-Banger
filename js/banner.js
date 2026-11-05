/* Animates the official banner: slow push-in, sparkler sparks, embers, a light sweep. */
(function(){
var ban=document.getElementById('banner'),cv=document.getElementById('bnfx'),pp=document.getElementById('bnPP');
if(!ban||!cv)return;
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
if(reduce)return;
var W=1600,H=900,k=Math.min(2,window.devicePixelRatio||1);
cv.width=W*k;cv.height=H*k;var c=cv.getContext('2d');c.scale(k,k);
/* positions are in banner-image pixels (1600 x 900) */
var EM=[{x:686,y:274,r:95,rate:70},{x:862,y:218,r:120,rate:95}];
var STARS=[{x:975,y:130,s:16},{x:884,y:98,s:12},{x:757,y:186,s:12},{x:1022,y:83,s:10},{x:640,y:215,s:11}];
var P=[],MOTE=[],raf=0,paused=false,vis=true,last=0,acc=[0,0];
function rnd(a,b){return a+Math.random()*(b-a)}
function spark(e){var a=rnd(0,6.283),v=rnd(40,230);
  P.push({x:e.x+rnd(-6,6),y:e.y+rnd(-6,6),vx:Math.cos(a)*v,vy:Math.sin(a)*v-30,life:0,max:rnd(.45,1.1),ember:false,w:rnd(1.4,2.6)})}
function ember(e){P.push({x:e.x+rnd(-30,30),y:e.y+rnd(-20,20),vx:rnd(-18,18),vy:rnd(-30,-6),life:0,max:rnd(1.6,3.2),ember:true,w:rnd(1.4,3)})}
for(var i=0;i<26;i++)MOTE.push({x:rnd(0,W),y:rnd(0,H),vy:rnd(-14,-4),r:rnd(.8,2.1),ph:rnd(0,6)});
function star(x,y,s,a){c.globalAlpha=a;c.fillStyle='#fff4c8';c.beginPath();
  c.moveTo(x,y-s);c.lineTo(x+s*.16,y-s*.16);c.lineTo(x+s,y);c.lineTo(x+s*.16,y+s*.16);c.lineTo(x,y+s);c.lineTo(x-s*.16,y+s*.16);c.lineTo(x-s,y);c.lineTo(x-s*.16,y-s*.16);c.closePath();c.fill()}
function frame(t){
  raf=0;if(paused||!vis)return;
  var dt=Math.min(.05,(t-last)/1000||0);last=t;
  c.clearRect(0,0,W,H);c.globalCompositeOperation='lighter';
  EM.forEach(function(e,i){
    acc[i]+=e.rate*dt;while(acc[i]>=1){acc[i]--;spark(e);if(Math.random()<.12)ember(e)}
    var f=.8+.2*Math.sin(t/60+i*2)+.1*Math.sin(t/23);
    var g=c.createRadialGradient(e.x,e.y,0,e.x,e.y,e.r);g.addColorStop(0,'rgba(255,238,180,'+(.5*f).toFixed(3)+')');g.addColorStop(.35,'rgba(255,176,60,'+(.2*f).toFixed(3)+')');g.addColorStop(1,'rgba(255,140,40,0)');
    c.globalAlpha=1;c.fillStyle=g;c.fillRect(e.x-e.r,e.y-e.r,e.r*2,e.r*2)});
  for(var j=P.length-1;j>=0;j--){var p=P[j];p.life+=dt;if(p.life>=p.max){P.splice(j,1);continue}
    var px=p.x,py=p.y;p.vy+=(p.ember?-4:170)*dt;p.vx*=p.ember?1:.985;p.x+=p.vx*dt;p.y+=p.vy*dt;
    var a=1-p.life/p.max;
    if(p.ember){c.globalAlpha=a*.8;c.fillStyle='#ffb347';c.beginPath();c.arc(p.x,p.y,p.w,0,6.283);c.fill()}
    else{c.globalAlpha=a;c.strokeStyle=a>.55?'#fff2c2':'#ffb02e';c.lineWidth=p.w;c.lineCap='round';c.beginPath();c.moveTo(px,py);c.lineTo(p.x,p.y);c.stroke()}}
  STARS.forEach(function(s,i){var a=.5+.5*Math.sin(t/430+i*1.9);star(s.x,s.y,s.s*(.7+.3*a),Math.max(0,a-.15))});
  MOTE.forEach(function(m){m.y+=m.vy*dt;m.x+=Math.sin(t/1400+m.ph)*.25;if(m.y<-5){m.y=H+5;m.x=rnd(0,W)}
    c.globalAlpha=.25+.25*Math.sin(t/700+m.ph);c.fillStyle='#ffe9b0';c.beginPath();c.arc(m.x,m.y,m.r,0,6.283);c.fill()});
  c.globalAlpha=1;c.globalCompositeOperation='source-over';
  raf=requestAnimationFrame(frame);
}
function kick(){if(!raf&&!paused&&vis)raf=requestAnimationFrame(frame)}
new IntersectionObserver(function(e){vis=e[0].isIntersecting;kick()},{threshold:.05}).observe(ban);
document.addEventListener('visibilitychange',function(){vis=!document.hidden;kick()});
pp.addEventListener('click',function(){
  paused=!paused;ban.classList.toggle('paused',paused);pp.setAttribute('aria-pressed',paused);
  pp.textContent=paused?'Play animation':'Pause animation';kick();
});
kick();
})();
