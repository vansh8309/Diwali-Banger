/* ---- Mirror ---- */
(function(){
var N=256,mc=document.getElementById('mc'),mx=mc.getContext('2d'),msg=document.getElementById('mmsg'),btn=document.getElementById('camBtn');
var sc=document.createElement('canvas');sc.width=sc.height=N;var sx=sc.getContext('2d',{willReadFrequently:true});
var map=new Int32Array(N*N);
for(var y=0;y<N;y++)for(var x=0;x<N;x++){
  var nx=(x+.5)/N*2-1,ny=(y+.5)/N*2-1,r2=nx*nx+ny*ny,p=y*N+x;
  if(r2>1){map[p]=-1;continue}
  var k=.62+.38*r2,u=Math.min(N-1,Math.floor((-nx*k+1)/2*N)),v=Math.min(N-1,Math.floor((ny*k+1)/2*N));
  map[p]=(v*N+u)*4;
}
var out=mx.createImageData(N,N),vid=document.createElement('video');vid.playsInline=true;vid.muted=true;
var on=false,shotB=document.getElementById('mrShotB');
function frame(){
  if(!on)return;
  var vw=vid.videoWidth,vh=vid.videoHeight;
  if(vw){var s=Math.min(vw,vh);sx.drawImage(vid,(vw-s)/2,(vh-s)/2,s,s,0,0,N,N);
    var d=sx.getImageData(0,0,N,N).data,o=out.data;
    for(var p=0;p<N*N;p++){var i=map[p],q=p*4;
      if(i<0){o[q+3]=0;continue}
      o[q]=Math.min(255,d[i]*1.08);o[q+1]=d[i+1];o[q+2]=d[i+2]*.88;o[q+3]=255}
    mx.putImageData(out,0,0)}
  requestAnimationFrame(frame);
}
btn.addEventListener('click',async function(){
  if(on){on=false;(vid.srcObject||{getTracks:function(){return[]}}).getTracks().forEach(function(t){t.stop()});
    mx.clearRect(0,0,N,N);msg.style.display='flex';msg.textContent='Your reflection appears here.';btn.textContent='Turn on the mirror';shotB.disabled=true;return}
  try{
    var st=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:false});
    vid.srcObject=st;await vid.play();on=true;msg.style.display='none';btn.textContent='Turn off the mirror';shotB.disabled=false;frame();
  }catch(e){
    msg.style.display='flex';
    msg.textContent='Camera blocked. Allow camera access for this page in your browser settings, then try again.';
  }
});

/* ---- Mirror selfie: countdown, sharp full-resolution convex render, shareable poster ---- */
var nameIn=document.getElementById('mrName'),nameMsg=document.getElementById('mrMsg');
var pan=Share.panel({out:'mrOut',img:'mrImg',dl:'mrDl',share:'mrShare',copy:'mrCopy',note:'mrNote'},Share.invite('mirror'));
function cleanName(){return nameIn.value.replace(/\s+/g,' ').trim().slice(0,20)}
/* same convex mapping as the live view, rendered at higher resolution from the current video frame */
function hiRes(n){
  var vw=vid.videoWidth,vh=vid.videoHeight,s=Math.min(vw,vh);
  var a=document.createElement('canvas');a.width=a.height=n;var ac=a.getContext('2d',{willReadFrequently:true});
  ac.drawImage(vid,(vw-s)/2,(vh-s)/2,s,s,0,0,n,n);
  var d=ac.getImageData(0,0,n,n).data,c=document.createElement('canvas');c.width=c.height=n;var cx=c.getContext('2d'),o=cx.createImageData(n,n),od=o.data;
  for(var y=0;y<n;y++)for(var x=0;x<n;x++){
    var nx=(x+.5)/n*2-1,ny=(y+.5)/n*2-1,r2=nx*nx+ny*ny;if(r2>1)continue;
    var k=.62+.38*r2,u=Math.min(n-1,Math.floor((-nx*k+1)/2*n)),v=Math.min(n-1,Math.floor((ny*k+1)/2*n)),i=(v*n+u)*4,q=(y*n+x)*4;
    od[q]=Math.min(255,d[i]*1.08);od[q+1]=d[i+1];od[q+2]=d[i+2]*.88;od[q+3]=255}
  cx.putImageData(o,0,0);return c;
}
function countdown(){
  return new Promise(function(res){var n=3;msg.classList.add('count');msg.style.display='flex';msg.textContent=n;
    var t=setInterval(function(){n--;if(n>0){msg.textContent=n}else{clearInterval(t);msg.classList.remove('count');msg.style.display='none';res()}},900)});
}
shotB.addEventListener('click',function(){
  var name=cleanName();
  if(!name){nameMsg.textContent='Add your name first so it goes on the image.';nameIn.focus();return}
  if(!on)return;
  nameMsg.textContent='';shotB.disabled=true;shotB.textContent='Get ready...';
  countdown().then(function(){
    if(!on)throw 0;
    var face=hiRes(760);shotB.textContent='Making...';
    return Share.poster({
      title:(name+'\u2019s mirror selfie').toUpperCase(),heading:'MIRROR CORNER',sub:'Bent by a convex mirror',qr:'mirror',
      paint:function(x,W){
        var cx=W/2,cy=590,R=380,rim=410;
        x.save();x.shadowColor='rgba(212,33,28,.45)';x.shadowBlur=60;x.shadowOffsetY=18;x.fillStyle='#d4211c';x.beginPath();x.arc(cx,cy,rim,0,6.283);x.fill();x.restore();
        x.strokeStyle='#fff1d6';x.lineWidth=10;x.beginPath();x.arc(cx,cy,rim-16,0,6.283);x.stroke();
        x.save();x.beginPath();x.arc(cx,cy,R,0,6.283);x.clip();x.drawImage(face,cx-R,cy-R,R*2,R*2);
        var gl=x.createRadialGradient(cx-R*.45,cy-R*.55,10,cx-R*.3,cy-R*.4,R*.9);gl.addColorStop(0,'rgba(255,255,255,.30)');gl.addColorStop(.5,'rgba(255,255,255,.05)');gl.addColorStop(1,'rgba(255,255,255,0)');
        x.fillStyle=gl;x.fillRect(cx-R,cy-R,R*2,R*2);x.restore();
      }
    });
  }).then(function(blob){
    if(!blob)throw 0;
    pan.show(blob,Share.caption(name,'took a selfie in the Mirror Corner','mirror'),'my-diwali-banger-mirror.png');
  }).catch(function(){if(on)alert('Could not make the image. Please try again.')}).then(function(){shotB.textContent='Take mirror selfie';shotB.disabled=!on});
});
})();
