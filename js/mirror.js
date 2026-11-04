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
var on=false;
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
    mx.clearRect(0,0,N,N);msg.style.display='flex';msg.textContent='Your reflection appears here.';btn.textContent='Turn on the mirror';return}
  try{
    var st=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:false});
    vid.srcObject=st;await vid.play();on=true;msg.style.display='none';btn.textContent='Turn off the mirror';frame();
  }catch(e){
    msg.style.display='flex';
    msg.textContent='Camera blocked. Allow camera access for this page in your browser settings, then try again.';
  }
});
})();

