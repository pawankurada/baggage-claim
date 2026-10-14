// Stage 5 scenery, including its final landing/letter backdrop. No gameplay state.
export const losAngelesAssets={pier:'public/assets/level5-los-angeles/coast/santa-monica.svg'};
export function createLosAngelesScenery(){
 const pier=new Image();pier.src=losAngelesAssets.pier;
 const rect=(ctx,x,y,w,h,color,r=0)=>{ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();};
 function palm(ctx,x,y,size=1){ctx.save();ctx.translate(x,y);ctx.scale(size,size);ctx.strokeStyle='#ac886f';ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(-8,-100,7,-195);ctx.stroke();
  for(let i=0;i<7;i++){const angle=-Math.PI+i*Math.PI/6;ctx.strokeStyle=i%2?'#788c73':'#657e68';ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(7,-195);ctx.quadraticCurveTo(7+Math.cos(angle)*34,-209+Math.sin(angle)*25,7+Math.cos(angle)*65,-185+Math.sin(angle)*32);ctx.stroke();}ctx.restore();}
 return {draw(ctx,camera,time,W,H,sectionWidth,worldWidth){
  const start=sectionWidth*4;if(camera+W<=start)return;
  ctx.save();ctx.beginPath();ctx.rect(start-camera,0,worldWidth-start,H);ctx.clip();ctx.translate(start-camera,0);
  // One sunset palette across the entire LA stage and final landing.
  const sunset=ctx.createLinearGradient(0,0,0,H);sunset.addColorStop(0,'#b6a0bd');sunset.addColorStop(.4,'#e7a7a8');sunset.addColorStop(.75,'#f4c191');sunset.addColorStop(1,'#f8d9ac');
  ctx.fillStyle=sunset;ctx.fillRect(0,0,worldWidth-start,H);
  ctx.fillStyle='#ffe6b8';ctx.beginPath();ctx.arc(1530+(camera-start)*.06,253,48,0,7);ctx.fill();
  ctx.fillStyle='#b6b495';ctx.beginPath();ctx.moveTo(260,418);ctx.bezierCurveTo(380,342,480,336,620,312);ctx.bezierCurveTo(760,300,920,380,1090,413);ctx.lineTo(1090,550);ctx.lineTo(260,550);ctx.fill();
  // Custom tall, square block lettering inspired by the hillside sign.
  const glyphs={H:[[[0,0],[0,43]],[[21,0],[21,43]],[[0,21],[21,21]]],O:[[[3,0],[18,0],[21,4],[21,39],[18,43],[3,43],[0,39],[0,4],[3,0]]],L:[[[0,0],[0,43],[21,43]]],Y:[[[0,0],[10.5,21],[21,0]],[[10.5,21],[10.5,43]]],W:[[[0,0],[3,43],[10.5,23],[18,43],[21,0]]],D:[[[0,0],[0,43],[15,43],[21,36],[21,7],[15,0],[0,0]]]};
  ctx.save();ctx.translate(467,302);ctx.lineWidth=6;ctx.lineJoin='bevel';ctx.lineCap='butt';
  [...'HOLLYWOOD'].forEach((letter,i)=>{ctx.save();ctx.translate(i*30,-Math.sin(i/8*Math.PI)*8);
   // Short rear supports and ground shadows seat each letter on the slope.
   rect(ctx,-3,45,27,3,'#9b9e80',2);rect(ctx,3,40,2,7,'#96977e');rect(ctx,17,40,2,7,'#96977e');
   ctx.strokeStyle='#fff6e5';for(const points of glyphs[letter]){ctx.beginPath();points.forEach(([x,y],j)=>j?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}ctx.restore();});ctx.restore();
  // Two separated facades leave a generous sidewalk and clear jump route.
  rect(ctx,125,396,120,154,'#ddb7a4',4);rect(ctx,121,392,128,7,'#a99a85',2);
  for(const x of [140,195])rect(ctx,x,417,35,40,'#eee6cd',3);
  rect(ctx,137,482,96,22,'#897e6e',2);
  ctx.save();ctx.textAlign='center';ctx.fillStyle='#fff0d7';ctx.font='bold 9px Georgia';ctx.fillText('BEVERLY HILLS',185,497);ctx.restore();
  rect(ctx,140,513,90,37,'#899e96',2);
  // Art Deco cinema: stepped roof, projecting letterboard, glass entrance.
  rect(ctx,315,377,250,173,'#e2d8c4',3);
  rect(ctx,337,365,206,16,'#e2d8c4',2);rect(ctx,360,354,160,16,'#e2d8c4',2);
  for(const x of [329,343,537,551])rect(ctx,x,381,3,24,'#c5b9a5');
  rect(ctx,303,410,274,48,'#a28b91',3);rect(ctx,308,415,264,37,'#f7ead6',2);
  ctx.save();ctx.textAlign='center';ctx.fillStyle='#856675';ctx.font='bold 19px Georgia';ctx.fillText('SUNSET CINEMA',440,401);
  ctx.fillStyle='#4e5257';ctx.font='bold 15px Arial';ctx.fillText('PRIDE AND PREJUDICE',440,433);ctx.font='8px Arial';ctx.fillText('NOW SHOWING  •  A LITTLE ROMANCE',440,446);ctx.restore();
  for(let i=0;i<15;i++){ctx.fillStyle='#ffe6aa';ctx.beginPath();ctx.arc(313+i*18,456,1.8,0,7);ctx.fill();}
  rect(ctx,335,481,210,69,'#a29687',2);
  for(const x of [342,410,478]){rect(ctx,x,487,59,63,'#657d7b',2);rect(ctx,x+4,491,51,37,'#a8bfba',1);rect(ctx,x+27,532,2,9,'#e7d8b6');}
  rect(ctx,313,477,12,73,'#d0c2ae');rect(ctx,555,477,10,73,'#d0c2ae');
  // Palms occupy open pavement, away from shop lettering and cinema marquee.
  palm(ctx,65,550,1);palm(ctx,635,550,.72);
  // Coast and Santa Monica pier, behind the clear playable platforms.
  rect(ctx,780,416,worldWidth-start-780,H-416,'#b8b4c4');
  const water=ctx.createLinearGradient(0,416,0,550);water.addColorStop(0,'#b8b4c4');water.addColorStop(1,'#d9c1ba');ctx.fillStyle=water;ctx.fillRect(780,416,worldWidth-start-780,134);
  if(pier.complete&&pier.naturalWidth)ctx.drawImage(pier,1130+(camera-start)*.09,286,480,155);
  ctx.strokeStyle='#f8dabb99';ctx.lineWidth=2;for(let i=0;i<10;i++){const x=910+i*115+Math.sin(time*.65+i)*5;ctx.beginPath();ctx.moveTo(x,449+i%3*22);ctx.lineTo(x+57,449+i%3*22);ctx.stroke();}
  ctx.fillStyle='#ebd2ac';ctx.beginPath();ctx.moveTo(760,550);ctx.bezierCurveTo(1120,526,1410,530,worldWidth-start,548);ctx.lineTo(worldWidth-start,H);ctx.lineTo(760,H);ctx.fill();
  palm(ctx,1480,550,.95);palm(ctx,2050,550,1.15);
  // Quiet birthday atmosphere near the actual finish; the ending logic is untouched.
  for(const x of [1690,2110])rect(ctx,x,454,4,96,'#a08b7b',2);
  ctx.strokeStyle='#a08b7b';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(1692,454);ctx.quadraticCurveTo(1902,490,2112,454);ctx.stroke();
  for(let i=0;i<9;i++){const f=i/8;ctx.fillStyle='#ffe8b4';ctx.shadowColor='#f0bf8b';ctx.shadowBlur=8;ctx.beginPath();ctx.arc(1692+420*f,458+72*f*(1-f),3,0,7);ctx.fill();}ctx.shadowBlur=0;
  ctx.fillStyle='#fff1db';ctx.font='18px Georgia';for(const [x,y] of [[1770,327],[1980,300],[2120,365]])ctx.fillText('♡',x,y+Math.sin(time*.8+x)*5);
  ctx.font='14px Georgia';ctx.fillText('✧',1840,369+Math.sin(time)*3);ctx.fillText('✧',2040,399+Math.sin(time+1)*3);
  ctx.restore();
 }};
}


