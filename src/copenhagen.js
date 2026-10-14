// Stage 4 scenery only; all coordinates are local and clipped to its section.
export const copenhagenAssets={nyhavn:'public/assets/level4-copenhagen/nyhavn/facades.svg'};
export function createCopenhagenScenery(){
 const facades=new Image();facades.src=copenhagenAssets.nyhavn;
 const rect=(ctx,x,y,w,h,color,r=0)=>{ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();};
 const image=(ctx,x,y,w,h)=>{if(facades.complete&&facades.naturalWidth)ctx.drawImage(facades,x,y,w,h);};
 function bike(ctx,x,y,color='#657b75'){
  ctx.save();ctx.translate(x,y);ctx.strokeStyle='#6b7972';ctx.lineWidth=2;
  for(const cx of [-20,23]){ctx.beginPath();ctx.arc(cx,-12,12,0,7);ctx.stroke();}
  ctx.strokeStyle=color;ctx.beginPath();ctx.moveTo(-20,-12);ctx.lineTo(-8,-34);ctx.lineTo(4,-12);ctx.lineTo(-20,-12);ctx.lineTo(14,-34);ctx.lineTo(23,-12);ctx.moveTo(4,-12);ctx.lineTo(14,-34);ctx.lineTo(23,-36);ctx.stroke();
  rect(ctx,-13,-37,12,3,'#6b7972',1);rect(ctx,20,-34,15,11,'#bd9f74',2);ctx.restore();
 }
 function boat(ctx,x,y,time,color){
  ctx.save();ctx.translate(x,y+Math.sin(time*.9+x)*2);
  ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(-52,0);ctx.lineTo(55,0);ctx.quadraticCurveTo(40,20,22,21);ctx.lineTo(-31,21);ctx.closePath();ctx.fill();
  rect(ctx,-25,-24,51,24,'#f0e4c8',3);rect(ctx,-18,-18,14,12,'#9fbac0',2);rect(ctx,5,-18,14,12,'#9fbac0',2);
  rect(ctx,0,-86,3,62,'#8f9281');ctx.fillStyle='#fff4df';ctx.beginPath();ctx.moveTo(-4,-82);ctx.lineTo(-4,-29);ctx.lineTo(-39,-29);ctx.closePath();ctx.fill();
  // The flag is fixed to the second boat's mast and bobs with the boat.
  if(x>1000){rect(ctx,3,-84,25,16,'#b76c60');rect(ctx,10,-84,2,16,'#f7eedc');rect(ctx,3,-77,25,2,'#f7eedc');}
  ctx.restore();
 }
 return {draw(ctx,camera,time,W,H,sectionWidth){
  const start=sectionWidth*3,end=sectionWidth*4;if(camera+W<=start||camera>=end)return;
  ctx.save();ctx.beginPath();ctx.rect(start-camera,0,sectionWidth,H);ctx.clip();ctx.translate(start-camera,0);
  const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#e4e9db');sky.addColorStop(.6,'#f7e6cb');sky.addColorStop(1,'#b8d4d3');ctx.fillStyle=sky;ctx.fillRect(0,0,sectionWidth,H);
  const drift=(camera-start)*.1;
  // Colorful waterfront is the centerpiece, kept below the bag and sky.
  rect(ctx,450,417,1200,H-417,'#a5c8cb');
  image(ctx,25,286,390,264);
  image(ctx,650+drift,268,680,166);
  rect(ctx,645+drift,427,690,10,'#b9ae99',2);
  // Reflections echo the Nyhavn palette without obscuring the foreground route.
  const colors=['#cba15f','#b97866','#a6b8af','#c38d72','#d5c293','#95adb6'];
  ctx.save();ctx.globalAlpha=.18;
  colors.forEach((color,i)=>{for(let j=0;j<5;j++)rect(ctx,671+drift+i*104+Math.sin(time+j)*4,443+j*11,63-j*6,6,color,2);});ctx.restore();
  boat(ctx,587,479,time,'#ab7666');boat(ctx,1425,455,time,'#6e9293');
  // Bicycles are parked on the street, safely above ground and outside jumps.
  bike(ctx,160,550,'#778e7c');bike(ctx,324,550,'#a96f61');bike(ctx,1245,550,'#768c92');
  // Low harbor railings and café tables are scenery, never platforms.
  for(const [x,width] of [[45,300],[1160,420]]){
   rect(ctx,x,521,width,3,'#788a80');for(let p=x;p<x+width;p+=38)rect(ctx,p,513,3,37,'#788a80');
  }
  for(const x of [73,283,1350]){rect(ctx,x,514,40,5,'#a18b70',2);rect(ctx,x+19,519,3,31,'#738478');}
  // Warm lights at the harbor finish, with visible supporting poles.
  for(const x of [1140,1585])rect(ctx,x,450,4,100,'#88927e',2);
  ctx.strokeStyle='#88927e';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(1142,450);ctx.quadraticCurveTo(1364,487,1587,450);ctx.stroke();
  for(let i=0;i<10;i++){const f=i/9;ctx.fillStyle='#fff0bd';ctx.shadowBlur=7;ctx.shadowColor='#e8bd7d';ctx.beginPath();ctx.arc(1142+445*f,450+74*f*(1-f)+4,3,0,7);ctx.fill();}ctx.shadowBlur=0;
  for(const x of [1070,1540]){rect(ctx,x,534,34,16,'#ae876e',3);for(let i=0;i<5;i++){ctx.fillStyle=i%2?'#c28c83':'#d9bf79';ctx.beginPath();ctx.arc(x+4+i*6,530,4,0,7);ctx.fill();}}
  ctx.restore();
 }};
}
