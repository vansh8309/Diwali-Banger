/* ---- Lanterns and fireworks ---- */
(function(){
var cv=$('sky'),c=cv.getContext('2d'),W,H,ln=[],ps=[],last=0,fired=0,hint=$('hint');
var cols=['#ffd60a','#ff3d6e','#f6e7bd','#ff8a1f','#5ee6c1','#ff6bd6'];
function size(){var d=window.devicePixelRatio||1,r=cv.getBoundingClientRect();W=r.width;H=r.height;cv.width=W*d;cv.height=H*d;c.setTransform(d,0,0,d,0,0)}
size();window.addEventListener('resize',size);
function burst(x,y){var a=cols[Math.floor(Math.random()*cols.length)],b=cols[Math.floor(Math.random()*cols.length)];
 for(var i=0;i<56;i++){var an=Math.random()*6.283,sp=50+Math.random()*170;ps.push({x:x,y:y,vx:Math.cos(an)*sp,vy:Math.sin(an)*sp,l:1,col:i%3?a:b})}}
cv.addEventListener('pointerdown',function(e){var r=cv.getBoundingClientRect();hint.style.display='none';
 ln.push({x:e.clientX-r.left,y:e.clientY-r.top,vy:38+Math.random()*26,ph:Math.random()*6,lim:H*(.1+Math.random()*.25)})});
new IntersectionObserver(function(en){if(en[0].isIntersecting&&!fired){fired=1;for(var i=0;i<9;i++)setTimeout(function(){burst(W*(.12+Math.random()*.76),H*(.12+Math.random()*.4))},500+i*520)}},{threshold:.5}).observe(cv);
function lantern(l){var s=l.s||1;c.save();c.translate(l.x,l.y);
 var gl=c.createRadialGradient(0,0,4,0,0,56);gl.addColorStop(0,'#ffb02ecc');gl.addColorStop(1,'#ffb02e00');c.fillStyle=gl;c.beginPath();c.arc(0,0,56,0,6.283);c.fill();
 c.fillStyle='#ff9f1c';c.beginPath();c.moveTo(-13,-18);c.lineTo(13,-18);c.lineTo(17,16);c.lineTo(-17,16);c.closePath();c.fill();
 c.fillStyle='#ffe08a';c.beginPath();c.ellipse(0,6,6,9,0,0,6.283);c.fill();
 c.fillStyle='#7a1018';c.fillRect(-13,-20,26,4);c.fillRect(-17,15,34,3);c.restore()}
function loop(t){var dt=Math.min(.05,(t-last)/1000||0);last=t;c.clearRect(0,0,W,H);
 for(var i=ln.length-1;i>=0;i--){var l=ln[i];l.y-=l.vy*dt;l.x+=Math.sin(t/700+l.ph)*.35;
  if(l.y<l.lim){burst(l.x,l.y);ln.splice(i,1)}else lantern(l)}
 for(i=ps.length-1;i>=0;i--){var p=ps[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=110*dt;p.vx*=.992;p.l-=dt*.55;
  if(p.l<=0){ps.splice(i,1);continue}c.globalAlpha=p.l;c.fillStyle=p.col;c.beginPath();c.arc(p.x,p.y,2.6,0,6.283);c.fill()}
 c.globalAlpha=1;requestAnimationFrame(loop)}
requestAnimationFrame(loop);
})();
