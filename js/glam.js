/* Glam & Glitter Bar: dress up an illustrated face, earn a Glam score, share the result as an image with event details. */
(function(){
var svg=document.getElementById('gmSvg');if(!svg)return;
var NS='http://www.w3.org/2000/svg',$=function(i){return document.getElementById(i)};
var TICKETS='https://communitie.in/events/diwali-banger',SITE='https://diwali-banger.runs-at.dev/#glam';
/* QR code for SITE (33x33 modules, error correction M). Regenerate if SITE changes. */
var QR=["111111101010011011101110001111111", "100000101101111000111000101000001", "101110101110011100000100001011101", "101110100111001010101011101011101", "101110101101110110000011001011101", "100000100111111110010010101000001", "111111101010101010101010101111111", "000000000000011110100011000000000", "100111111101001001001011110010111", "010001011110011101010111000011100", "010000100110110110000011010011101", "110101000101010010101111110100101", "000101101111110101010101011100001", "000100000100001000111100111101000", "101100110010101101111100001011000", "110111001110111010101000110010101", "110110111100011100001011111111000", "000100000101001101011010001010111", "111011111101011101110111000101101", "101010000110000010000011010011101", "100101100101011010110110101101000", "101101011101101000000000001110100", "100101101011001001011000111100011", "101111010001100101011010000100111", "110101111100001010001000111111001", "000000001110111101100101100010110", "111111101111011101010001101010100", "100000101001111111110111100011101", "101110101111001111010111111110011", "101110101011110010100010110100101", "101110100111110100010111010110011", "100000100101001000111011111111111", "111111101011110101010000100110000"];
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

/* image + share */
var out=$('gmOut'),img=$('gmImg'),note=$('gmNote'),shareB=$('gmShare'),dl=$('gmDl'),nameIn=$('gmName'),nameMsg=$('gmNameMsg'),file=null,shareText='';
function hideOut(){out.hidden=true;file=null}
function loadImg(src){return new Promise(function(res,rej){var i=new Image();i.onload=function(){res(i)};i.onerror=rej;i.src=src})}
function rr(x,a,b,w,h,r){x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath()}
function cleanName(){return nameIn.value.replace(/\s+/g,' ').trim().slice(0,20)}
function compose(name){
  var clone=svg.cloneNode(true);clone.setAttribute('xmlns',NS);clone.setAttribute('width',900);clone.setAttribute('height',1140);clone.removeAttribute('class');
  var zn=clone.querySelector('#gmZn');if(zn)zn.remove();
  var data='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(clone));
  var fonts=document.fonts&&document.fonts.load?Promise.all([document.fonts.load("64px 'Bowlby One'"),document.fonts.load("700 34px 'Barlow Condensed'")]).catch(function(){}):Promise.resolve();
  return Promise.all([loadImg(data),fonts]).then(function(r){
    var W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;var x=c.getContext('2d');
    var g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#5a1018');g.addColorStop(1,'#2a0a0d');x.fillStyle=g;x.fillRect(0,0,W,H);
    for(var row=0;row<2;row++)for(var i=0;i<W/24+1;i++){x.fillStyle=(i+row)%2?'#7a1018':'#f6e7bd';x.fillRect(i*24,row*24,24,24);x.fillRect(i*24,H-48+row*24,24,24)}
    var rg=x.createRadialGradient(540,560,40,540,560,560);rg.addColorStop(0,'rgba(255,214,10,.35)');rg.addColorStop(1,'rgba(255,214,10,0)');x.fillStyle=rg;x.fillRect(0,0,W,H);
    /* title with the person's name, shrunk to fit */
    var title=(name+'\u2019s Diwali look').toUpperCase(),fs=64;x.textAlign='center';
    do{x.font=fs+"px 'Bowlby One', Impact, sans-serif";fs-=2}while(x.measureText(title).width>960&&fs>30);
    x.fillStyle='#c1121f';x.fillText(title,544,134);x.fillStyle='#ffd60a';x.fillText(title,540,130);
    var fw=663,fh=840,fx=(W-fw)/2,fy=160;
    x.save();rr(x,fx,fy,fw,fh,24);x.clip();x.drawImage(r[0],fx,fy,fw,fh);x.restore();
    rr(x,fx,fy,fw,fh,24);x.lineWidth=8;x.strokeStyle='#f6e7bd';x.stroke();
    /* left: look + event details (each line shrinks to fit beside the QR card) */
    function line(txt,font,y,col,maxW){var sz=+/(\d+)px/.exec(font)[1];x.fillStyle=col;do{x.font=font.replace(/\d+px/,sz+'px');sz-=2}while(x.measureText(txt).width>maxW&&sz>16);x.fillText(txt,70,y)}
    x.textAlign='left';var LW=690;
    line(score.t.toUpperCase(),"46px 'Bowlby One', Impact, sans-serif",1072,'#ffd60a',LW);
    line('Glam score '+score.p+' / 100',"700 34px 'Barlow Condensed', sans-serif",1112,'#f6e7bd',LW);
    line('Diwali Banger',"700 42px 'Barlow Condensed', sans-serif",1170,'#ffd60a',LW);
    line('Sat 7th Nov  |  5pm to 12am',"700 34px 'Barlow Condensed', sans-serif",1208,'#f6e7bd',LW);
    line('Padel.hy Social Club rooftop,',"500 30px 'Barlow Condensed', sans-serif",1244,'#f6e7bd',LW);
    line('DSL Virtue Mall, Hyderabad',"500 30px 'Barlow Condensed', sans-serif",1278,'#f6e7bd',LW);
    /* right: QR to the website */
    var M=5,n=QR.length,qs=n*M,pad=20,cw=qs+pad*2,cx=W-70-cw,cy=1034;
    x.fillStyle='#fff';rr(x,cx,cy,cw,cw+44,14);x.fill();
    x.fillStyle='#1d0b0d';for(var rr_=0;rr_<n;rr_++)for(var cc=0;cc<n;cc++)if(QR[rr_].charAt(cc)==='1')x.fillRect(cx+pad+cc*M,cy+pad+rr_*M,M,M);
    x.textAlign='center';var cs=26,cap='SCAN TO TRY IT';do{x.font="700 "+cs+"px 'Barlow Condensed', sans-serif";cs-=2}while(x.measureText(cap).width>cw-16&&cs>12);
    x.fillStyle='#7a1018';x.fillText(cap,cx+cw/2,cy+cw+28);
    return new Promise(function(res){c.toBlob(res,'image/png')});
  });
}
$('gmMake').addEventListener('click',function(){
  var name=cleanName();
  if(!name){nameMsg.textContent='Add your name first so it goes on the image.';nameIn.focus();return}
  nameMsg.textContent='';
  var b=$('gmMake');b.textContent='Making...';b.disabled=true;
  compose(name).then(function(blob){
    if(!blob)throw 0;
    file=new File([blob],'my-diwali-banger-look.png',{type:'image/png'});
    if(img.dataset.u)URL.revokeObjectURL(img.dataset.u);var u=URL.createObjectURL(blob);img.dataset.u=u;img.src=u;dl.href=u;
    shareText=name+' just glammed up at the Glam & Glitter Bar for Diwali Banger! Sat 7th Nov, 5pm to 12am, Padel.hy Social Club rooftop, DSL Virtue Mall, Hyderabad.\nGet tickets: '+TICKETS+'\nTry the Glam Bar yourself: '+SITE;
    var can=!!(navigator.canShare&&navigator.canShare({files:[file]}));
    shareB.style.display=can?'':'none';
    note.textContent=can?'Share sends the image and copies the invite text (with the ticket link) at the same time.':'Your browser cannot share images directly. Download the image and copy the invite text to send together.';
    out.hidden=false;out.scrollIntoView({behavior:'smooth',block:'nearest'});
  }).catch(function(){alert('Could not make the image. Please try again.')}).then(function(){b.textContent='Make my image';b.disabled=false});
});
shareB.addEventListener('click',function(){
  if(!file)return;
  /* One click: copy the invite text AND open the share sheet with the image (text attached too where the app allows). */
  var copied=false,cp=navigator.clipboard?navigator.clipboard.writeText(shareText).then(function(){copied=true},function(){}):Promise.resolve();
  var d={files:[file],title:'Diwali Banger',text:shareText};if(navigator.canShare&&!navigator.canShare(d))d={files:[file]};
  navigator.share(d).then(function(){return cp}).then(function(){note.textContent=copied?'Shared. The invite text with the ticket link is also copied. Paste it as the caption if your app left it out.':'Shared.'})
   .catch(function(e){if(e&&e.name!=='AbortError')note.textContent='Sharing failed. Use Download and Copy invite text instead.'});
});
$('gmCopy').addEventListener('click',function(){
  var t=shareText||('Come to Diwali Banger! Sat 7th Nov, 5pm to 12am, Padel.hy Social Club rooftop, DSL Virtue Mall, Hyderabad.\nGet tickets: '+TICKETS+'\nTry the Glam Bar yourself: '+SITE);
  (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){note.textContent='Invite text copied.'},function(){note.textContent=t});
});

reset();
})();
