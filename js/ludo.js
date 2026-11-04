/* ---- Ludo ---- */
(function(){
var TR=[[1,6],[2,6],[3,6],[4,6],[5,6],[6,5],[6,4],[6,3],[6,2],[6,1],[6,0],[7,0],[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[9,6],[10,6],[11,6],[12,6],[13,6],[14,6],[14,7],[14,8],[13,8],[12,8],[11,8],[10,8],[9,8],[8,9],[8,10],[8,11],[8,12],[8,13],[8,14],[7,14],[6,14],[6,13],[6,12],[6,11],[6,10],[6,9],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8],[0,7],[0,6]];
var YD=[[1.5,1.5],[3.5,1.5],[1.5,3.5],[3.5,3.5]],G=$('ldg'),B=$('lud'),st=$('ldst'),rb=$('ldroll'),set={};
TR.forEach(function(c){set[c[0]+','+c[1]]=1});
for(var y=0;y<15;y++)for(var x=0;x<15;x++){var k=x+','+y,cl='k';if(set[k])cl='t';
 if(y==7&&x>=1&&x<=5)cl='r';if(y==7&&x>=9&&x<=13)cl='y';if(k=='1,6')cl='r';if(k=='13,8')cl='y';
 if(x<6&&y<6)cl='yr';if(x>8&&y>8)cl='yy';if(x>5&&x<9&&y>5&&y<9)cl='ce';
 var d=document.createElement('div');d.className=cl;G.appendChild(d)}
var T=[[0,0,0,0],[0,0,0,0]],tk=[[],[]],turn=0,r=0,wait=0,over=0;
function cell(pl,p){var c,h;if(p<=51)c=TR[(p-1+26*pl)%52];else{h=p-51;c=[pl?14-h:h,7]}return[c[0]+.5,c[1]+.5]}
function pos(pl,i){var p=T[pl][i];if(!p){var q=YD[i];return pl?[15-q[0],15-q[1]]:q}return cell(pl,p)}
function can(pl,i){var p=T[pl][i];return p?p+r<=57:r==6}
function draw(){for(var pl=0;pl<2;pl++)for(var i=0;i<4;i++){var q=pos(pl,i),e=tk[pl][i];e.style.left=q[0]/15*100+'%';e.style.top=q[1]/15*100+'%';e.classList.toggle('gl',!!(wait&&pl==turn&&can(pl,i)))}}
function next(){turn=1-turn;st.textContent=NM[turn]+', roll the dice';draw()}
function move(i){wait=0;var p=T[turn][i],np=p?p+r:1,o=1-turn;T[turn][i]=np;
 if(np<=51)for(var q=0;q<4;q++){var qp=T[o][q];if(qp&&qp<=51&&(qp-1+26*o)%52==(np-1+26*turn)%52)T[o][q]=0}
 draw();
 if(T[turn].every(function(v){return v==57})){over=1;st.textContent=NM[turn]+' wins!';return}
 if(r==6)st.textContent=NM[turn]+' rolled a 6, roll again';else next()}
for(var pl=0;pl<2;pl++)for(var i=0;i<4;i++)(function(pl,i){var e=document.createElement('button');e.className='tk';e.setAttribute('aria-label',NM[pl]+' token '+(i+1));e.style.background=PCOL[pl];
 e.addEventListener('click',function(){if(wait&&pl==turn&&can(pl,i))move(i)});B.appendChild(e);tk[pl][i]=e})(pl,i);
draw();
rb.addEventListener('click',function(){
 if(wait||over)return;r=1+Math.floor(Math.random()*6);rb.textContent='Roll ('+r+')';
 var m=[0,1,2,3].filter(function(i){return can(turn,i)});
 if(!m.length){st.textContent=NM[turn]+' rolled '+r+', no move';setTimeout(next,800);return}
 if(m.length==1){move(m[0]);return}
 wait=1;st.textContent=NM[turn]+' rolled '+r+', tap a token';draw()});
})();

