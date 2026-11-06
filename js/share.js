/* Shared helpers for the shareable images (Glam & Glitter Bar, Mirror Corner):
   poster builder (frame, name title, event details, QR code) and the share / copy / download panel. */
window.Share=(function(){
var TICKETS='https://communitie.in/events/diwali-banger',SITE='https://diwali-banger.runs-at.dev/';
/* QR codes (33x33 modules, error correction M) for SITE+'#glam' and SITE+'#mirror'. Regenerate if SITE changes. */
var QR={glam:["111111101010011011101110001111111", "100000101101111000111000101000001", "101110101110011100000100001011101", "101110100111001010101011101011101", "101110101101110110000011001011101", "100000100111111110010010101000001", "111111101010101010101010101111111", "000000000000011110100011000000000", "100111111101001001001011110010111", "010001011110011101010111000011100", "010000100110110110000011010011101", "110101000101010010101111110100101", "000101101111110101010101011100001", "000100000100001000111100111101000", "101100110010101101111100001011000", "110111001110111010101000110010101", "110110111100011100001011111111000", "000100000101001101011010001010111", "111011111101011101110111000101101", "101010000110000010000011010011101", "100101100101011010110110101101000", "101101011101101000000000001110100", "100101101011001001011000111100011", "101111010001100101011010000100111", "110101111100001010001000111111001", "000000001110111101100101100010110", "111111101111011101010001101010100", "100000101001111111110111100011101", "101110101111001111010111111110011", "101110101011110010100010110100101", "101110100111110100010111010110011", "100000100101001000111011111111111", "111111101011110101010000100110000"],
mirror:["111111100111011011101110001111111", "100000101111000000100000101000001", "101110101110001110010110001011101", "101110101101101010101011101011101", "101110100100011111001010001011101", "100000100101011101010001101000001", "111111101010101010101010101111111", "000000001100100110111011000000000", "100000101101111011011001111001110", "101001001101011101010111000011100", "000011100100111111001010000010100", "010011001010110001101100101111101", "111111101000110101010101001000001", "011000001010110000100100101101011", "000000110111111111101110011111010", "011010001010000010101000110010101", "111010110100101101000010110110001", "011001011110010110011001001001111", "110011110001111101110111000101101", "010011000110111010011011011011110", "111011101001110000100100110011010", "101010011000100000000000010110100", "100100111111011000010001110001010", "100001011001011110011001000011110", "110110100110110010001000111111010", "000000001000010101111101100010101", "111111100101111111000011101010110", "100000100100000111110111100011101", "101110100011111110011110111111010", "101110100111011001100001110111001", "101110100010100100010111010110111", "100000100111111000100010100111100", "111111101111100111000010101100010"]};
function $(i){return document.getElementById(i)}
function rr(x,a,b,w,h,r){x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath()}
function fonts(){return document.fonts&&document.fonts.load?Promise.all([document.fonts.load("64px 'Bowlby One'"),document.fonts.load("700 34px 'Barlow Condensed'"),document.fonts.load("500 30px 'Barlow Condensed'")]).catch(function(){}):Promise.resolve()}
function line(x,txt,font,px,y,col,maxW){var sz=+/(\d+)px/.exec(font)[1];x.fillStyle=col;do{x.font=font.replace(/\d+px/,sz+'px');sz-=2}while(x.measureText(txt).width>maxW&&sz>16);x.fillText(txt,px,y)}

/* o: {title, heading, sub, qr:'glam'|'mirror', paint(ctx,W,H)} -> Promise<Blob> (1080x1350 PNG) */
function poster(o){
  return fonts().then(function(){
    var W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;var x=c.getContext('2d');
    var g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#5a1018');g.addColorStop(1,'#2a0a0d');x.fillStyle=g;x.fillRect(0,0,W,H);
    for(var row=0;row<2;row++)for(var i=0;i<W/24+1;i++){x.fillStyle=(i+row)%2?'#7a1018':'#f6e7bd';x.fillRect(i*24,row*24,24,24);x.fillRect(i*24,H-48+row*24,24,24)}
    var rg=x.createRadialGradient(540,560,40,540,560,560);rg.addColorStop(0,'rgba(255,214,10,.35)');rg.addColorStop(1,'rgba(255,214,10,0)');x.fillStyle=rg;x.fillRect(0,0,W,H);
    var fs=64;x.textAlign='center';
    do{x.font=fs+"px 'Bowlby One', Impact, sans-serif";fs-=2}while(x.measureText(o.title).width>960&&fs>30);
    x.fillStyle='#c1121f';x.fillText(o.title,544,134);x.fillStyle='#ffd60a';x.fillText(o.title,540,130);
    o.paint(x,W,H);
    x.textAlign='left';var LW=690;
    line(x,o.heading,"46px 'Bowlby One', Impact, sans-serif",70,1072,'#ffd60a',LW);
    line(x,o.sub,"700 34px 'Barlow Condensed', sans-serif",70,1112,'#f6e7bd',LW);
    line(x,'Diwali Banger',"700 42px 'Barlow Condensed', sans-serif",70,1170,'#ffd60a',LW);
    line(x,'Sat 7th Nov  |  5pm to 12am',"700 34px 'Barlow Condensed', sans-serif",70,1208,'#f6e7bd',LW);
    line(x,'Padel.hy Social Club rooftop,',"500 30px 'Barlow Condensed', sans-serif",70,1244,'#f6e7bd',LW);
    line(x,'DSL Virtue Mall, Hyderabad',"500 30px 'Barlow Condensed', sans-serif",70,1278,'#f6e7bd',LW);
    var Q=QR[o.qr],M=5,n=Q.length,qs=n*M,pad=20,cw=qs+pad*2,cx=W-70-cw,cy=1034;
    x.fillStyle='#fff';rr(x,cx,cy,cw,cw+44,14);x.fill();
    x.fillStyle='#1d0b0d';for(var r=0;r<n;r++)for(var k=0;k<n;k++)if(Q[r].charAt(k)==='1')x.fillRect(cx+pad+k*M,cy+pad+r*M,M,M);
    x.textAlign='center';var cs=26,cap='SCAN TO TRY IT';do{x.font="700 "+cs+"px 'Barlow Condensed', sans-serif";cs-=2}while(x.measureText(cap).width>cw-16&&cs>12);
    x.fillStyle='#7a1018';x.fillText(cap,cx+cw/2,cy+cw+28);
    return new Promise(function(res){c.toBlob(res,'image/png')});
  });
}
function invite(key){return 'Come to Diwali Banger! Sat 7th Nov, 5pm to 12am, Padel.hy Social Club rooftop, DSL Virtue Mall, Hyderabad.\nGet tickets: '+TICKETS+'\nTry it yourself: '+SITE+'#'+key}
function caption(name,what,key){return name+' '+what+' for Diwali Banger! Sat 7th Nov, 5pm to 12am, Padel.hy Social Club rooftop, DSL Virtue Mall, Hyderabad.\nGet tickets: '+TICKETS+'\nTry it yourself: '+SITE+'#'+key}

/* ids: {out,img,dl,share,copy,note}. One click on Share copies the invite text AND opens the share sheet with the image. */
function panel(ids,defaultText){
  var out=$(ids.out),img=$(ids.img),dl=$(ids.dl),shareB=$(ids.share),copyB=$(ids.copy),note=$(ids.note),file=null,text='';
  shareB.addEventListener('click',function(){
    if(!file)return;
    var copied=false,cp=navigator.clipboard?navigator.clipboard.writeText(text).then(function(){copied=true},function(){}):Promise.resolve();
    var d={files:[file],title:'Diwali Banger',text:text};if(navigator.canShare&&!navigator.canShare(d))d={files:[file]};
    navigator.share(d).then(function(){return cp}).then(function(){note.textContent=copied?'Shared. The invite text with the ticket link is also copied. Paste it as the caption if your app left it out.':'Shared.'})
     .catch(function(e){if(e&&e.name!=='AbortError')note.textContent='Sharing failed. Use Download and Copy invite text instead.'});
  });
  copyB.addEventListener('click',function(){
    var t=text||defaultText;
    (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){note.textContent='Invite text copied.'},function(){note.textContent=t});
  });
  return{
    show:function(blob,txt,fname){
      file=new File([blob],fname,{type:'image/png'});text=txt;
      if(img.dataset.u)URL.revokeObjectURL(img.dataset.u);var u=URL.createObjectURL(blob);img.dataset.u=u;img.src=u;dl.href=u;dl.setAttribute('download',fname);
      var can=!!(navigator.canShare&&navigator.canShare({files:[file]}));shareB.style.display=can?'':'none';
      note.textContent=can?'Share sends the image and copies the invite text (with the ticket link) at the same time.':'Your browser cannot share images directly. Download the image and copy the invite text to send together.';
      out.hidden=false;out.scrollIntoView({behavior:'smooth',block:'nearest'});
    },
    hide:function(){out.hidden=true;file=null}
  };
}
return{poster:poster,panel:panel,caption:caption,invite:invite,rr:rr};
})();
