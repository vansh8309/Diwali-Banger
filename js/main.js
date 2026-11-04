document.querySelectorAll('[data-go]').forEach(function(b){b.addEventListener('click',function(){var e=document.querySelector(b.dataset.go);e&&e.scrollIntoView({behavior:'smooth'});if(b.dataset.go==='#range'){}})});


var $=function(i){return document.getElementById(i)};
$('tix').addEventListener('click',function(){var u=(window.SITE_CONFIG||{}).ticketUrl;if(u)window.open(u,'_blank','noopener');else $('tixm').textContent='Tickets are not live yet. Scan the QR on the poster or check back soon.'});
document.querySelectorAll('[data-tab]').forEach(function(b){b.addEventListener('click',function(){
  document.querySelectorAll('[data-tab]').forEach(function(x){x.classList.toggle('on',x===b)});
  document.querySelectorAll('.pnl').forEach(function(x){x.classList.toggle('on',x.id===b.dataset.tab)})})});
var PCOL=['#c1121f','#ffd60a'],NM=['Red','Yellow'];

