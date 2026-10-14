// Stage 2 decoration only. Coordinates and clipping are local to its section.
export const londonAssets = {
  neighborhood: 'public/assets/level2-london/neighborhood/kings-college.svg',
  skyline: 'public/assets/level2-london/skyline/london.svg',
};
export function createLondonScenery() {
  const images={};
  for(const [key,url] of Object.entries(londonAssets)){const img=new Image();img.src=url;images[key]=img;}
  const rect=(ctx,x,y,w,h,color,r=0)=>{ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();};
  const image=(ctx,key,x,y,w,h)=>{const img=images[key];if(img?.complete&&img.naturalWidth)ctx.drawImage(img,x,y,w,h);};
  function tree(ctx,x,y,size=1){ctx.save();ctx.translate(x,y);ctx.scale(size,size);rect(ctx,-5,-90,10,90,'#8f8973',3);for(const [cx,cy,r] of [[-20,-100,31],[20,-105,34],[0,-132,34]]){ctx.fillStyle=cx<0?'#94ac85':'#a7ba90';ctx.beginPath();ctx.arc(cx,cy,r,0,7);ctx.fill();}ctx.restore();}
  function bench(ctx,x,y){rect(ctx,x,y-34,90,13,'#97866d',3);rect(ctx,x,y-14,90,6,'#97866d',2);rect(ctx,x+10,y-8,4,8,'#53665d');rect(ctx,x+76,y-8,4,8,'#53665d');}
  return {draw(ctx,camera,time,W,H,sectionWidth){
    const start=sectionWidth,end=sectionWidth*2;
    if(camera+W<=start||camera>=end)return;
    ctx.save();ctx.beginPath();ctx.rect(start-camera,0,sectionWidth,H);ctx.clip();
    ctx.translate(start-camera,0);
    const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#dce9e9');sky.addColorStop(.65,'#eff0df');sky.addColorStop(1,'#e5ead5');ctx.fillStyle=sky;ctx.fillRect(0,0,sectionWidth,H);
    // Small, distant silhouettes reward the ascent. Parallax stays inside Stage 2.
    image(ctx,'skyline',650+(camera-start)*.18,231,620,160);
    ctx.fillStyle='#cedbc0';ctx.beginPath();ctx.moveTo(0,555);ctx.bezierCurveTo(500,540,610,355,980,390);ctx.bezierCurveTo(1220,410,1410,460,1650,478);ctx.lineTo(1650,H);ctx.lineTo(0,H);ctx.fill();
    ctx.fillStyle='#b9cba7';ctx.beginPath();ctx.moveTo(370,550);ctx.bezierCurveTo(600,510,640,424,820,445);ctx.bezierCurveTo(1090,462,1190,523,1650,539);ctx.lineTo(1650,H);ctx.lineTo(370,H);ctx.fill();
    // Winding park path is scenery, with no collision changes.
    ctx.strokeStyle='#e8ddc6';ctx.lineWidth=17;ctx.beginPath();ctx.moveTo(555,550);ctx.bezierCurveTo(675,521,760,460,922,468);ctx.bezierCurveTo(1030,475,1080,505,1225,514);ctx.stroke();
    image(ctx,'neighborhood',35,250,365,300);
    tree(ctx,445,550,.95);tree(ctx,1230,550,.85);tree(ctx,1580,550,1.05);
    bench(ctx,925,518);bench(ctx,1470,550);
    // One iconic street prop: a red telephone box grounded beside the café.
    rect(ctx,355,442,47,108,'#af6258',4);rect(ctx,351,437,55,9,'#994f49',4);
    rect(ctx,362,464,32,73,'#c4d3cb',2);
    for(const x of [372,383])rect(ctx,x,464,2,73,'#ad665d');
    for(const y of [481,498,515])rect(ctx,362,y,32,2,'#ad665d');
    ctx.fillStyle='#f6e5cf';ctx.font='7px Arial';ctx.fillText('TELEPHONE',358,455);
    // Street lamps and a small park sign tie the three beats together.
    for(const x of [25,417]){rect(ctx,x,387,4,163,'#53665d',2);rect(ctx,x-7,375,18,22,'#f8e8b8',3);rect(ctx,x-9,372,22,4,'#53665d',2);}
    // A two-post park sign on the ground beside the right-hand bench.
    // Keep the skyline and jumping route clear above it.
    for(const x of [1302,1414])rect(ctx,x,496,6,54,'#7f8c74',2);
    rect(ctx,1288,461,150,38,'#758c74',4);
    rect(ctx,1293,466,140,28,'#82987e',3);
    ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#f7f0db';ctx.font='14px Georgia';ctx.fillText('PRIMROSE HILL',1363,480);ctx.restore();
    // Low planting beds anchor the posts without obscuring the sign face.
    for(const [x,y,r] of [[1294,545,10],[1308,544,12],[1321,547,8],[1406,546,9],[1420,544,12],[1435,547,8]]){ctx.fillStyle='#9caf88';ctx.beginPath();ctx.arc(x,y,r,Math.PI,0);ctx.fill();}
    ctx.restore();
  }};
}
