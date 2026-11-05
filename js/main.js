var $=function(i){return document.getElementById(i)};
document.querySelectorAll('[data-go]').forEach(function(b){b.addEventListener('click',function(){var e=document.querySelector(b.dataset.go);e&&e.scrollIntoView({behavior:'smooth'})})});
document.querySelectorAll('[data-tab]').forEach(function(b){b.addEventListener('click',function(){
  document.querySelectorAll('[data-tab]').forEach(function(x){x.classList.toggle('on',x===b)});
  document.querySelectorAll('.pnl').forEach(function(x){x.classList.toggle('on',x.id===b.dataset.tab)})})});
var PCOL=['#c1121f','#ffd60a'],NM=['Red','Yellow'];
/* back to top: appears once the hero banner has scrolled away */
(function(){
var b=$('toTop'),ban=$('banner');if(!b||!ban)return;var tick=false;
function upd(){tick=false;b.classList.toggle('show',window.scrollY>ban.offsetHeight-60)}
window.addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});
b.addEventListener('click',function(){window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})});
upd();
})();
