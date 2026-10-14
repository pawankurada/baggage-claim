// Stage 3 scenery only. Every layer is clipped to this section's world bounds.
export const sanFranciscoAssets={
 houses:'public/assets/level3-san-francisco/hill-street/victorians.svg',
 cableCar:'public/assets/level3-san-francisco/cable-car/car.svg',
 bridge:'public/assets/level3-san-francisco/bridge/golden-gate.svg',
};
export function createSanFranciscoScenery(){
 const images={};for(const [key,url] of Object.entries(sanFranciscoAssets)){const img=new Image();img.src=url;images[key]=img;}
 const rect=(ctx,x,y,w,h,color,r=0)=>{ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();};
 const image=(ctx,key,x,y,w,h)=>{const img=images[key];if(img?.complete&&img.naturalWidth)ctx.drawImage(img,x,y,w,h);};
 return {draw(ctx,camera,time,W,H,sectionWidth){
  const start=sectionWidth*2,end=sectionWidth*3;if(camera+W<=start||camera>=end)return;
  ctx.save();ctx.beginPath();ctx.rect(start-camera,0,sectionWidth,H);ctx.clip();ctx.translate(start-camera,0);
  const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#d1e5ef');sky.addColorStop(.65,'#f0efe3');sky.addColorStop(1,'#c3d9dc');ctx.fillStyle=sky;ctx.fillRect(0,0,sectionWidth,H);
  // Open bay, muted far shore and a small rust-red suspension bridge.
  rect(ctx,420,360,1230,H-360,'#afced5');
  ctx.fillStyle='#b6c9bd';ctx.beginPath();ctx.moveTo(420,367);ctx.bezierCurveTo(650,336,750,350,900,322);ctx.bezierCurveTo(1190,290,1410,350,1650,336);ctx.lineTo(1650,377);ctx.lineTo(420,377);ctx.fill();
  const drift=(camera-start)*.14;
  image(ctx,'bridge',675+drift,203,640,175);
  // A light fog ribbon stays below the bridge's towers.
  ctx.fillStyle='#f5f4e866';ctx.beginPath();ctx.ellipse(1060+drift,350,480,15,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#e8f2ed88';ctx.lineWidth=2;
  for(let i=0;i<8;i++){const x=540+i*137+Math.sin(time*.5+i)*6;ctx.beginPath();ctx.moveTo(x,401+i%3*18);ctx.lineTo(x+50,401+i%3*18);ctx.stroke();}
  // Sloping residential street behind the unchanged stepping platforms.
  ctx.fillStyle='#aebba1';ctx.beginPath();ctx.moveTo(0,550);ctx.lineTo(0,495);ctx.lineTo(560,378);ctx.lineTo(690,550);ctx.fill();
  ctx.strokeStyle='#e3d9c4';ctx.lineWidth=15;ctx.beginPath();ctx.moveTo(0,540);ctx.lineTo(510,436);ctx.stroke();
  ctx.strokeStyle='#8b9593';ctx.lineWidth=29;ctx.beginPath();ctx.moveTo(0,563);ctx.lineTo(522,456);ctx.stroke();
  ctx.strokeStyle='#c8d2cd';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,556);ctx.lineTo(522,449);ctx.moveTo(0,571);ctx.lineTo(522,464);ctx.stroke();
  image(ctx,'houses',28,285,410,265);
  // One decorative cable car on the hill; no movement or collision mechanics.
  ctx.save();ctx.translate(480,465);ctx.rotate(-.19);image(ctx,'cableCar',-70,-82,140,82);ctx.restore();
  // Coastal overlook beyond bag 3, with a planted verge and a bench.
  ctx.fillStyle='#97ae96';ctx.beginPath();ctx.moveTo(760,550);ctx.bezierCurveTo(900,518,1130,518,1650,546);ctx.lineTo(1650,H);ctx.lineTo(760,H);ctx.fill();
  rect(ctx,1135,503,90,13,'#9a8873',3);rect(ctx,1135,526,90,6,'#9a8873',2);for(const x of [1146,1210])rect(ctx,x,532,4,18,'#64796b');
  for(const x of [1070,1330,1510]){ctx.fillStyle='#93aa8c';ctx.beginPath();ctx.ellipse(x,541,27,12,0,0,7);ctx.fill();}
  // Waterfront birds, small enough to stay part of the distant view.
  ctx.strokeStyle='#839b9e';ctx.lineWidth=1.5;for(const [x,y] of [[1030,170],[1080,188]]){ctx.beginPath();ctx.moveTo(x-8,y);ctx.quadraticCurveTo(x-3,y-5,x,y);ctx.quadraticCurveTo(x+3,y-5,x+8,y);ctx.stroke();}
  ctx.restore();
 }};
}
