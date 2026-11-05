/* Diya painting: colour a diya, place it in a flower rangoli, light it. */
(function(){
var art=document.getElementById('dyArt');if(!art)return;
var $=function(i){return document.getElementById(i)},rang=$('dyRang'),msg=$('dyMsg'),next=$('dyNext'),pal=$('dyPal');
var COLS=['#c1121f','#ff8a1f','#ffd60a','#1f8a70','#2a7de1','#e0457b','#7a3fb0','#f6e7bd','#d4af37'],cur=COLS[0],step=0,painted={},n=0;
var M0='Pick a colour, then tap parts of the diya.';

COLS.forEach(function(c,i){var b=document.createElement('button');b.style.background=c;b.setAttribute('aria-label','Colour '+(i+1));b.setAttribute('aria-pressed',i===0);
  b.addEventListener('click',function(){cur=c;[].forEach.call(pal.children,function(x){x.setAttribute('aria-pressed',x===b)})});pal.appendChild(b)});

art.addEventListener('click',function(e){
  var t=e.target.closest('[data-r]');if(!t||step)return;
  t.setAttribute('fill',cur);if(!painted[t.dataset.r]){painted[t.dataset.r]=1;n++}
  t.classList.remove('pop');void t.getBoundingClientRect();t.classList.add('pop');
  msg.textContent=n<3?'Nice. Keep going.':n<6?'Looking good. Colour the dots and the base too, or place it in the rangoli.':'Beautiful. Time for the rangoli.';
});

function ring(count,cy,rx,ry,cols){var h='';for(var i=0;i<count;i++)h+='<ellipse cx="200" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="'+cols[i%cols.length]+'" stroke="#2a0a0d" stroke-width="2" transform="rotate('+(i*360/count)+' 200 200)"/>';return h}
function build(){
  var h='<defs><radialGradient id="dyGl"><stop offset="0" stop-color="#ffcf5a" stop-opacity=".95"/><stop offset=".5" stop-color="#ff8a1f" stop-opacity=".35"/><stop offset="1" stop-color="#ff8a1f" stop-opacity="0"/></radialGradient></defs>';
  h+='<circle cx="200" cy="200" r="194" fill="#2a0a0d" stroke="#f6e7bd" stroke-width="5"/><g id="dyRg">';
  h+=ring(16,62,22,46,['#e0457b','#ff8a1f'])+ring(12,100,20,36,['#ffd60a','#c1121f'])+ring(8,135,18,26,['#f6e7bd','#1f8a70']);
  for(var i=0;i<36;i++){var a=i*Math.PI/18;h+='<circle cx="'+(200+Math.cos(a)*180).toFixed(1)+'" cy="'+(200+Math.sin(a)*180).toFixed(1)+'" r="4" fill="#ffd60a"/>'}
  h+='</g><circle id="dyGlow" cx="200" cy="180" r="190" fill="url(#dyGl)"/>';
  var d=$('dyG').outerHTML.replace(' id="dyG"','');
  h+='<g id="dyPlace" class="drop"><g transform="translate(125 135) scale(.5)">'+d+'</g></g>';
  rang.innerHTML=h;
}
function sparks(){
  for(var i=0;i<18;i++){var c=document.createElementNS('http://www.w3.org/2000/svg','circle');
    c.setAttribute('class','spk');c.setAttribute('cx',(120+Math.random()*160).toFixed(0));c.setAttribute('cy',(150+Math.random()*60).toFixed(0));
    c.setAttribute('r',(1.5+Math.random()*2).toFixed(1));c.setAttribute('fill',Math.random()<.5?'#ffd60a':'#ff8a1f');
    c.style.setProperty('--dx',((Math.random()-.5)*80).toFixed(0)+'px');c.style.animationDelay=(Math.random()*.8).toFixed(2)+'s';rang.appendChild(c);
    (function(x){setTimeout(function(){x.remove()},3400)})(c)}
}
function reset(){
  step=0;painted={};n=0;art.querySelectorAll('[data-r]').forEach(function(e){e.setAttribute('fill',e.dataset.f)});
  art.classList.remove('off');rang.classList.add('off');rang.classList.remove('lit');rang.innerHTML='';
  next.textContent='Place in the rangoli';msg.textContent=M0;
}
next.addEventListener('click',function(){
  if(step===0){step=1;build();art.classList.add('off');rang.classList.remove('off');next.textContent='Light the diya';msg.textContent='Your diya is in the rangoli. Now light it.'}
  else if(step===1){step=2;rang.classList.add('lit');sparks();next.textContent='Paint another';msg.textContent='Shubh Deepavali! Come paint a real one at the event. It is free.'}
  else reset();
});
$('dyReset').addEventListener('click',reset);
})();
