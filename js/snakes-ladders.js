/* ---- Snakes & Ladders ---- */
(function(){
var L={4:14,9:31,20:38,28:84,40:59,51:67,63:81},S={17:7,54:34,62:19,64:60,87:24,93:73,95:75,99:78};
var B=$('slb'),g=document.createElement('div');g.className='gr10';
for(var r=9;r>=0;r--)for(var c=0;c<10;c++){var d=document.createElement('div');d.textContent=r*10+(r%2?10-c:c+1);if((r+c)%2)d.className='a';g.appendChild(d)}
B.appendChild(g);
function xy(n){var r=Math.floor((n-1)/10),c=(n-1)%10;if(r%2)c=9-c;return[c*10+5,(9-r)*10+5]}
var h='';
for(var k in L){var a=xy(+k),b=xy(L[k]);h+='<line x1="'+a[0]+'" y1="'+a[1]+'" x2="'+b[0]+'" y2="'+b[1]+'" stroke="#ffd60a" stroke-width="2.4" stroke-linecap="round" opacity=".92"/><line x1="'+a[0]+'" y1="'+a[1]+'" x2="'+b[0]+'" y2="'+b[1]+'" stroke="#4a0d12" stroke-width="1" stroke-dasharray="1 2.2"/>'}
for(k in S){a=xy(+k);b=xy(S[k]);var dx=b[0]-a[0],dy=b[1]-a[1],mx=(a[0]+b[0])/2-dy*.2,my=(a[1]+b[1])/2+dx*.2;
 h+='<path d="M'+a[0]+' '+a[1]+' Q'+mx+' '+my+' '+b[0]+' '+b[1]+'" fill="none" stroke="#1f8a70" stroke-width="2.2" stroke-linecap="round" opacity=".92"/><circle cx="'+a[0]+'" cy="'+a[1]+'" r="2.4" fill="#1f8a70"/><circle cx="'+(a[0]-.8)+'" cy="'+(a[1]-.6)+'" r=".5" fill="#fff"/><circle cx="'+(a[0]+.8)+'" cy="'+(a[1]-.6)+'" r=".5" fill="#fff"/>'}
B.insertAdjacentHTML('beforeend','<svg viewBox="0 0 100 100">'+h+'</svg>');
var P=[0,0],T=[],turn=0,busy=0,over=0,st=$('slst'),rb=$('slroll');
for(var i=0;i<2;i++){var t=document.createElement('div');t.className='tk';t.style.background=PCOL[i];B.appendChild(t);T.push(t)}
function place(i){var q=xy(P[i]||1);T[i].style.left=q[0]+(i?2.6:-2.6)+'%';T[i].style.top=q[1]+'%'}
place(0);place(1);
function done(){if(P[turn]==100){over=1;st.textContent=NM[turn]+' wins!';rb.textContent='Done';return}turn=1-turn;busy=0;st.textContent=NM[turn]+', roll the dice'}
rb.addEventListener('click',function(){
  if(busy||over)return;busy=1;var d=1+Math.floor(Math.random()*6),tg=P[turn]+d,t=turn;rb.textContent='Roll ('+d+')';
  if(tg>100){st.textContent='Needs an exact roll';setTimeout(done,700);return}
  st.textContent=NM[t]+' rolled '+d;
  (function walk(){if(P[t]<tg){P[t]++;place(t);setTimeout(walk,130)}else{var j=L[tg]||S[tg];
    if(j){st.textContent=L[tg]?'Ladder! Up you go':'Snake! Down you slide';setTimeout(function(){P[t]=j;place(t);setTimeout(done,450)},450)}else done()}})();
});
})();

