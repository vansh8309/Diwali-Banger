/* Pocket DJ: a tiny beat maker. All sounds are synthesised with the Web Audio API (no audio files). */
(function(){
var grid=document.getElementById('djGrid');if(!grid)return;
var $=function(i){return document.getElementById(i)};
var LANES=[['k','Kick'],['s','Snare'],['h','Hat'],['d','Dhol'],['b','Bass']];
var PRE={
 house:{n:'House',bpm:124,roots:[45,48,43,45],oct:false,p:{k:'1000100010001000',s:'0000100000001000',h:'0010001000100010',d:'0000000000000000',b:'0010001000100010'}},
 disco:{n:'Disco',bpm:116,roots:[40,43,45,43],oct:true,p:{k:'1000100010001000',s:'0000100000001000',h:'1111111111111111',d:'0000000000000000',b:'1111111111111111'}},
 bolly:{n:'Bollywood',bpm:104,roots:[38,38,41,43],oct:false,p:{k:'1000001000100010',s:'0000100000001010',h:'1010101010101010',d:'0010000100100100',b:'1000001000100000'}}
};
var pat={},cur='house',bpm=124,ac,master,an,nb,playing=false,step=0,next=0,timer=0,raf=0,Q=[],rollLeft=0,dropWanted=false;
var cells={},eq=$('djEq'),bars=eq?eq.children:[],ball=document.querySelector('#disco .disco'),playB=$('djPlay'),dropB=$('djDrop'),bpmI=$('djBpm'),bpmV=$('djBpmV');

/* grid */
LANES.forEach(function(L){
  var row=document.createElement('div');row.className='dj-row';
  var lab=document.createElement('span');lab.className='dj-l';lab.textContent=L[1];row.appendChild(lab);
  var st=document.createElement('div');st.className='dj-steps';cells[L[0]]=[];
  for(var i=0;i<16;i++)(function(i){
    var b=document.createElement('button');b.className='dj-s'+(i%4===0?' q':'');b.setAttribute('aria-label',L[1]+' step '+(i+1));
    b.addEventListener('click',function(){pat[L[0]][i]=pat[L[0]][i]?0:1;paint();if(!playing)preview(L[0],i)});
    cells[L[0]].push(b);st.appendChild(b)})(i);
  row.appendChild(st);grid.appendChild(row);
});
function paint(){LANES.forEach(function(L){cells[L[0]].forEach(function(b,i){var on=!!pat[L[0]][i];b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)})})}
function load(name){
  cur=name;var P=PRE[name];bpm=P.bpm;bpmI.value=bpm;bpmV.textContent=bpm;
  LANES.forEach(function(L){pat[L[0]]=P.p[L[0]].split('').map(Number)});
  document.querySelectorAll('[data-dj]').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.dj===name)});paint();
}
document.querySelectorAll('[data-dj]').forEach(function(b){b.addEventListener('click',function(){load(b.dataset.dj)})});
bpmI.addEventListener('input',function(){bpm=+bpmI.value;bpmV.textContent=bpm});

/* audio */
function ensure(){
  if(ac)return;
  ac=new (window.AudioContext||window.webkitAudioContext)();
  var comp=ac.createDynamicsCompressor();master=ac.createGain();master.gain.value=.85;an=ac.createAnalyser();an.fftSize=256;an.smoothingTimeConstant=.7;
  master.connect(comp);comp.connect(an);an.connect(ac.destination);
  nb=ac.createBuffer(1,ac.sampleRate,ac.sampleRate);var d=nb.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=Math.random()*2-1;
}
function noise(t,dur,hp,g){var s=ac.createBufferSource();s.buffer=nb;var f=ac.createBiquadFilter();f.type='highpass';f.frequency.value=hp;var o=ac.createGain();
  o.gain.setValueAtTime(g,t);o.gain.exponentialRampToValueAtTime(.001,t+dur);s.connect(f);f.connect(o);o.connect(master);s.start(t,Math.random()*.4,dur+.05)}
function tone(t,type,f0,f1,dur,g){var o=ac.createOscillator(),e=ac.createGain();o.type=type;o.frequency.setValueAtTime(f0,t);if(f1!==f0)o.frequency.exponentialRampToValueAtTime(f1,t+dur*.6);
  e.gain.setValueAtTime(g,t);e.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(e);e.connect(master);o.start(t);o.stop(t+dur+.05)}
function kick(t,v){tone(t,'sine',165,46,.34,.95*v);noise(t,.012,2500,.35*v)}
function snare(t,v){noise(t,.17,1300,.55*v);tone(t,'triangle',210,150,.1,.35*v)}
function hat(t,v,open){noise(t,open?.2:.05,7500,.2*v)}
function dhol(t,v){tone(t,'sine',360,240,.16,.5*v);noise(t,.025,3000,.25*v)}
function bass(t,m,v){var f=440*Math.pow(2,(m-69)/12),o=ac.createOscillator(),lp=ac.createBiquadFilter(),e=ac.createGain();
  o.type='sawtooth';o.frequency.value=f;lp.type='lowpass';lp.frequency.setValueAtTime(900,t);lp.frequency.exponentialRampToValueAtTime(220,t+.2);
  e.gain.setValueAtTime(.4*v,t);e.gain.exponentialRampToValueAtTime(.001,t+.24);o.connect(lp);lp.connect(e);e.connect(master);o.start(t);o.stop(t+.28)}
function crash(t){noise(t,1.1,4500,.5)}
function preview(l,i){ensure();ac.resume();var t=ac.currentTime+.01;hit(l,i,t,1)}
function hit(l,i,t,v){var P=PRE[cur];
  if(l==='k')kick(t,v);else if(l==='s')snare(t,v);else if(l==='h')hat(t,(i%4===2?1:.6)*v,i%4===2&&cur==='house');
  else if(l==='d')dhol(t,v);else if(l==='b'){var m=P.roots[i>>2]+(P.oct&&i%2?12:0);bass(t,m,v)}}

function sched(){
  while(next<ac.currentTime+.14){
    var t=next,i=step;
    if(i===0&&dropWanted){dropWanted=false;rollLeft=16}
    if(rollLeft>0){
      var vel=.25+.75*(16-rollLeft)/16;snare(t,vel);if(rollLeft%2===0)hat(t,.8,false);
      rollLeft--;
      if(rollLeft===0){var tt=t+60/bpm/4;Q.push({t:tt,f:flash});crash(tt);kick(tt,1)}
    }else{
      LANES.forEach(function(L){if(pat[L[0]][i])hit(L[0],i,t,1)});
      if(pat.k[i])Q.push({t:t,f:pulse});
    }
    Q.push({t:t,f:(function(i){return function(){mark(i)}})(i)});
    next+=60/bpm/4;step=(step+1)%16;
  }
}
var lastMark=-1;
function mark(i){if(lastMark>=0)LANES.forEach(function(L){cells[L[0]][lastMark].classList.remove('cur')});LANES.forEach(function(L){cells[L[0]][i].classList.add('cur')});lastMark=i}
function pulse(){ball.classList.add('kick');setTimeout(function(){ball.classList.remove('kick')},90)}
function flash(){var s=$('disco');s.classList.add('flash');setTimeout(function(){s.classList.remove('flash')},350)}
function viz(){
  raf=0;if(!playing)return;
  while(Q.length&&Q[0].t<=ac.currentTime){Q.shift().f()}
  var d=new Uint8Array(an.frequencyBinCount);an.getByteFrequencyData(d);
  for(var i=0;i<bars.length;i++){var v=d[2+Math.floor(i*50/bars.length)]/255;bars[i].style.height=(8+Math.pow(v,1.3)*92)+'%'}
  raf=requestAnimationFrame(viz);
}
function start(){
  ensure();ac.resume();playing=true;step=0;next=ac.currentTime+.06;Q=[];
  timer=setInterval(sched,25);eq.classList.add('live');playB.textContent='Stop';playB.setAttribute('aria-pressed',true);dropB.disabled=false;
  if(!raf)raf=requestAnimationFrame(viz);
}
function stop(){
  playing=false;clearInterval(timer);rollLeft=0;dropWanted=false;Q=[];
  if(lastMark>=0){LANES.forEach(function(L){cells[L[0]][lastMark].classList.remove('cur')});lastMark=-1}
  eq.classList.remove('live');[].forEach.call(bars,function(b){b.style.height=''});
  playB.textContent='Play';playB.setAttribute('aria-pressed',false);dropB.disabled=true;ball.classList.remove('kick');
}
playB.addEventListener('click',function(){playing?stop():start()});
dropB.addEventListener('click',function(){if(playing){dropWanted=true;dropB.classList.add('armed');setTimeout(function(){dropB.classList.remove('armed')},1800)}});
document.addEventListener('visibilitychange',function(){if(document.hidden&&playing)stop()});
/* be polite: stop when the section is well out of view */
new IntersectionObserver(function(e){if(!e[0].isIntersecting&&playing)stop()},{rootMargin:'40% 0px 40% 0px'}).observe($('disco'));
load('house');
})();
