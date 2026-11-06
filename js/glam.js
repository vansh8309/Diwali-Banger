/* Glam & Glitter Bar: dress up an illustrated face, earn a Glam score, share the result as an image with event details. */
(function(){
var svg=document.getElementById('gmSvg');if(!svg)return;
var NS='http://www.w3.org/2000/svg',$=function(i){return document.getElementById(i)};
var SK=['#f3c9a5','#e0a97d','#c68863','#8d5a3c'],SH=['#c1121f','#d4a017','#1f8a70','#7a3fb0','#e0457b','#2a5fd1'],
    LP=['#c1121f','#8a1538','#e0457b','#ff6f61','#6b1d2a'],BL=['#ff6f91','#ff8a5c','#e0457b','#c1121f'],
    ST=['#c1121f','#0f9d6e','#f4efe6','#2a5fd1'],GL=['#ffd54a','#f4a896','#e8eef5','#ff4d6d','#35d6a0'],NAT='#c27a70';
var S0={skin:1,shadow:-1,liner:0,lips:-1,blush:-1,bindi:0,stone:0,tikka:0,nath:0,jhumka:0,gems:0,gl:-1},S={};
var ROWS=[
 {k:'skin',l:'Skin tone',t:'sw',v:SK},
 {k:'shadow',l:'Eyeshadow',t:'sw',v:SH,none:1},
 {k:'liner',l:'Liner',t:'tx',v:['None','Kajal','Winged']},
 {k:'lips',l:'Lips',t:'sw',v:LP,none:1},
 {k:'blush',l:'Blush',t:'sw',v:BL,none:1},
 {k:'bindi',l:'Bindi',t:'tx',v:['None','Dot','Teardrop','Ornate']},
 {k:'stone',l:'Kundan stone',t:'sw',v:ST},
 {k:'jw',l:'Kundan jewellery',t:'tg',v:[['tikka','Maang tikka'],['nath','Nath'],['jhumka','Jhumkas'],['gems','Face gems']]},
 {k:'gl',l:'Glitter',t:'sw',v:GL,none:1,extra:1}
];
var gl=$('gmGl'),STEPS=[
 ['Eyeshadow',function(){return S.shadow>=0}],['Liner',function(){return S.liner>0}],['Lips',function(){return S.lips>=0}],
 ['Blush',function(){return S.blush>=0}],['Bindi',function(){return S.bindi>0}],['Maang tikka',function(){return S.tikka}],
 ['Nath',function(){return S.nath}],['Jhumkas',function(){return S.jhumka}],['Face gems',function(){return S.gems}],
 ['Glitter',function(){return gl.childNodes.length>=40}]];

/* controls */
var rowsEl=$('gmRows'),btns=[];
function reg(b,k,v,mode){b.dataset.k=k;b.dataset.v=v;b.dataset.m=mode||'';btns.push(b);return b}
ROWS.forEach(function(r){
  var d=document.createElement('div');d.className='gm-row';
  var l=document.createElement('span');l.className='gm-l';l.textContent=r.l;d.appendChild(l);
  var o=document.createElement('div');o.className='gm-o';
  if(r.t==='tg'){r.v.forEach(function(p){var b=document.createElement('button');b.className='opt tx';b.textContent=p[1];reg(b,p[0],1,'tg');o.appendChild(b)})}
  else{
    if(r.none){var n=document.createElement('button');n.className='opt sw none';n.setAttribute('aria-label',r.l+' off');reg(n,r.k,-1);o.appendChild(n)}
    r.v.forEach(function(x,i){var b=document.createElement('button');
      if(r.t==='sw'){b.className='opt sw';b.style.background=x;b.setAttribute('aria-label',r.l+' '+(i+1))}else{b.className='opt tx';b.textContent=x}
      reg(b,r.k,i);o.appendChild(b)});
  }
  if(r.extra){
    var sp=document.createElement('button');sp.className='opt tx';sp.textContent='Sprinkle burst';sp.addEventListener('click',function(){if(S.gl<0)S.gl=0;burst();apply()});o.appendChild(sp);
    var cl=document.createElement('button');cl.className='opt tx';cl.textContent='Clear';cl.addEventListener('click',function(){gl.textContent='';apply()});o.appendChild(cl);
  }
  d.appendChild(o);rowsEl.appendChild(d);
});
btns.forEach(function(b){b.addEventListener('click',function(){
  var k=b.dataset.k,v=+b.dataset.v;
  if(b.dataset.m==='tg')S[k]=S[k]?0:1;else S[k]=v;
  apply()})});

var stepsEl=$('gmSteps');STEPS.forEach(function(s){var li=document.createElement('li');li.textContent=s[0];stepsEl.appendChild(li)});

/* apply state to SVG */
function disp(id,on){$(id).setAttribute('display',on?'inline':'none')}
function apply(){
  svg.querySelectorAll('.sk').forEach(function(e){e.setAttribute('fill',SK[S.skin])});
  svg.querySelectorAll('.st').forEach(function(e){e.setAttribute('fill',ST[S.stone])});
  var sh=$('gmSh');sh.setAttribute('opacity',S.shadow<0?0:.75);sh.childNodes.forEach(function(p){if(p.setAttribute)p.setAttribute('fill',SH[Math.max(0,S.shadow)])});
  disp('gmLk',S.liner===1);disp('gmLw',S.liner===2);
  $('gmLp').setAttribute('fill',S.lips<0?NAT:LP[S.lips]);
  disp('gmBu',S.blush>=0);if(S.blush>=0){$('gmBl0').setAttribute('stop-color',BL[S.blush]);$('gmBl1').setAttribute('stop-color',BL[S.blush])}
  disp('gmB1',S.bindi===1);disp('gmB2',S.bindi===2);disp('gmB3',S.bindi===3);
  disp('gmTk',S.tikka);disp('gmNa',S.nath);disp('gmJh',S.jhumka);disp('gmGe',S.gems);
  btns.forEach(function(b){var k=b.dataset.k,on=b.dataset.m==='tg'?!!S[k]:S[k]===+b.dataset.v;b.setAttribute('aria-pressed',on)});
  svg.classList.toggle('spr',S.gl>=0);disp('gmZn',S.gl>=0);
  $('gmHint').textContent=S.gl>=0?'Sprinkle mode is on. Drag over the dotted areas: cheeks, eyes and a touch on the nose.':'Pick a glitter colour, then drag over the cheeks, eyes and nose to sprinkle.';
  score();
}
var lastTitle='';
function score(){
  var done=0;[].forEach.call(stepsEl.children,function(li,i){var d=STEPS[i][1]();li.classList.toggle('done',!!d);if(d)done++});
  var pts=done*10;$('gmBar').style.width=pts+'%';$('gmScore').textContent='Glam score '+pts+' / 100';
  var t=pts>=100?'Maharani Mode':pts>=70?'Diwali Diva':pts>=40?'Festive Fab':pts>0?'Warming up':'Bare-faced';
  $('gmTitle').textContent=t;score.t=t;score.p=pts;
}

/* glitter: only on cheeks, eyelids/under-eyes and a little on the nose, evenly spaced */
var faceEl=$('gmFace');
var CHEEK=[[117,207,19,17],[183,207,19,17]],EYE=[[121,158,24,18],[179,158,24,18]],NOSE=[[150,188,5,13]],BALL=[[121,160,21,9.5],[179,160,21,9.5]];
function inEl(z,x,y){var dx=(x-z[0])/z[2],dy=(y-z[1])/z[3];return dx*dx+dy*dy<=1}
function anyEl(zs,x,y){for(var i=0;i<zs.length;i++)if(inEl(zs[i],x,y))return true;return false}
function allowed(x,y){
  if(anyEl(BALL,x,y))return false;
  if(!(anyEl(CHEEK,x,y)||(anyEl(EYE,x,y)&&y>=144)||anyEl(NOSE,x,y)))return false;
  try{var p=svg.createSVGPoint();p.x=x;p.y=y;if(faceEl.isPointInFill&&!faceEl.isPointInFill(p))return false}catch(e){}
  return true;
}
var GAP=3.9;
function crowded(x,y){var n=gl.childNodes;for(var i=n.length-1;i>=0;i--){var e=n[i],dx=x-(+e.dataset.x),dy=y-(+e.dataset.y);if(dx*dx+dy*dy<GAP*GAP)return true}return false}
function add(x,y){
  var col=GL[S.gl<0?0:S.gl],el;
  if(Math.random()<.14){var s=2.2+Math.random()*1.4,q=s*.28;el=document.createElementNS(NS,'path');
    el.setAttribute('d','M'+x+' '+(y-s)+'L'+(x+q)+' '+(y-q)+'L'+(x+s)+' '+y+'L'+(x+q)+' '+(y+q)+'L'+x+' '+(y+s)+'L'+(x-q)+' '+(y+q)+'L'+(x-s)+' '+y+'L'+(x-q)+' '+(y-q)+'Z')}
  else{el=document.createElementNS(NS,'circle');el.setAttribute('cx',x.toFixed(1));el.setAttribute('cy',y.toFixed(1));el.setAttribute('r',(.7+Math.random()*1.3).toFixed(1))}
  el.dataset.x=x;el.dataset.y=y;el.setAttribute('fill',col);el.setAttribute('opacity',(.75+Math.random()*.25).toFixed(2));
  if(Math.random()<.18){el.setAttribute('class','tw');el.style.animationDelay=(Math.random()*1.4).toFixed(2)+'s'}
  gl.appendChild(el);
}
function tryAdd(x,y){if(gl.childNodes.length<600&&allowed(x,y)&&!crowded(x,y)){add(x,y);return true}return false}
function sprinkle(x,y,r,tries){for(var i=0;i<tries;i++){var a=Math.random()*6.283,d=Math.sqrt(Math.random())*r;tryAdd(x+Math.cos(a)*d,y+Math.sin(a)*d)}}
function fill(zs,tries){for(var i=0;i<tries;i++){var z=zs[i%zs.length],a=Math.random()*6.283,d=Math.sqrt(Math.random());tryAdd(z[0]+Math.cos(a)*d*z[2],z[1]+Math.sin(a)*d*z[3])}}
function burst(){fill(CHEEK,260);fill(EYE,200);fill(NOSE,40)}
var down=false;
function pt(e){var p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse())}
svg.addEventListener('pointerdown',function(e){if(S.gl<0)return;down=true;try{svg.setPointerCapture(e.pointerId)}catch(x){}var p=pt(e);sprinkle(p.x,p.y,16,10);score()});
svg.addEventListener('pointermove',function(e){if(!down)return;var p=pt(e);sprinkle(p.x,p.y,16,10);score()});
['pointerup','pointercancel'].forEach(function(t){svg.addEventListener(t,function(){down=false})});

/* reset + surprise */
function rnd(n){return Math.floor(Math.random()*n)}
function reset(){for(var k in S0)S[k]=S0[k];gl.textContent='';apply();hideOut()}
$('gmReset').addEventListener('click',reset);
$('gmSurp').addEventListener('click',function(){
  S.skin=S.skin;S.shadow=rnd(SH.length);S.liner=1+rnd(2);S.lips=rnd(LP.length);S.blush=rnd(BL.length);S.bindi=1+rnd(3);S.stone=rnd(ST.length);
  S.tikka=1;S.nath=Math.random()<.8?1:0;S.jhumka=1;S.gems=Math.random()<.8?1:0;S.gl=rnd(GL.length);gl.textContent='';burst();apply();
});

/* image + share (poster, QR and share panel come from js/share.js) */
var nameIn=$('gmName'),nameMsg=$('gmNameMsg');
var pan=Share.panel({out:'gmOut',img:'gmImg',dl:'gmDl',share:'gmShare',copy:'gmCopy',note:'gmNote'},Share.invite('glam'));
function hideOut(){pan.hide()}
function loadImg(src){return new Promise(function(res,rej){var i=new Image();i.onload=function(){res(i)};i.onerror=rej;i.src=src})}
function cleanName(){return nameIn.value.replace(/\s+/g,' ').trim().slice(0,20)}
function faceImage(){
  var clone=svg.cloneNode(true);clone.setAttribute('xmlns',NS);clone.setAttribute('width',900);clone.setAttribute('height',1140);clone.removeAttribute('class');
  var zn=clone.querySelector('#gmZn');if(zn)zn.remove();
  return loadImg('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(clone)));
}
$('gmMake').addEventListener('click',function(){
  var name=cleanName();
  if(!name){nameMsg.textContent='Add your name first so it goes on the image.';nameIn.focus();return}
  nameMsg.textContent='';
  var b=$('gmMake');b.textContent='Making...';b.disabled=true;
  faceImage().then(function(face){
    return Share.poster({
      title:(name+'\u2019s Diwali look').toUpperCase(),heading:score.t.toUpperCase(),sub:'Glam score '+score.p+' / 100',qr:'glam',
      paint:function(x,W){var fw=663,fh=840,fx=(W-fw)/2,fy=160;
        x.save();Share.rr(x,fx,fy,fw,fh,24);x.clip();x.drawImage(face,fx,fy,fw,fh);x.restore();
        Share.rr(x,fx,fy,fw,fh,24);x.lineWidth=8;x.strokeStyle='#f6e7bd';x.stroke()}
    });
  }).then(function(blob){
    if(!blob)throw 0;
    pan.show(blob,Share.caption(name,'just glammed up at the Glam & Glitter Bar','glam'),'my-diwali-banger-look.png');
  }).catch(function(){alert('Could not make the image. Please try again.')}).then(function(){b.textContent='Make my image';b.disabled=false});
});

reset();
})();
