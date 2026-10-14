// Level 1 decoration only. No collisions, player state, or collectible state live here.
export const hyderabadAssets = {
  auto: 'public/assets/level1-hyderabad/autos/auto.svg',
  street: 'public/assets/level1-hyderabad/street/shops.svg',
  biryani: 'public/assets/level1-hyderabad/biryani/handi.svg',
  charminar: 'public/assets/level1-hyderabad/charminar/charminar.svg',
  zero40: 'public/assets/level1-hyderabad/zero40/lounge.svg',
  zero40Sign: null, // Optional transparent logo/sign PNG; drawn over the illustrated sign.
  prabhas: 'public/assets/level1-hyderabad/prabhas/portrait-no-text.png',
};

export function createHyderabadScenery(assets = hyderabadAssets) {
  const images = new Map();
  for (const [key, url] of Object.entries(assets)) {
    if (!url) continue;
    const image = new Image();
    image.src = url;
    images.set(key, image);
  }
  function image(ctx, key, x, y, w, h) {
    const img = images.get(key);
    if (img?.complete && img.naturalWidth) ctx.drawImage(img, x, y, w, h);
  }
  function rect(ctx, x, y, w, h, color, radius = 0) {
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.roundRect(x, y, w, h, radius); ctx.fill();
  }
  function label(ctx, value, x, y, size = 13, color = '#775b50') {
    ctx.fillStyle = color; ctx.font = `${size}px Georgia`; ctx.fillText(value, x, y);
  }
  function lights(ctx, x, y, width, count = 9) {
    ctx.strokeStyle='#8a705f';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y);
    ctx.quadraticCurveTo(x+width/2,y+35,x+width,y);ctx.stroke();
    for(let i=0;i<count;i++) {
      const f=i/(count-1), lx=x+width*f, ly=y+70*f*(1-f);
      ctx.fillStyle='#ffe4a3';ctx.shadowColor='#efb861';ctx.shadowBlur=10;
      ctx.beginPath();ctx.arc(lx,ly+5,3,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
    }
  }
  return {
    background(ctx, camera, time, W, H, sectionWidth) {
      ctx.save();
      const gradient=ctx.createLinearGradient(0,0,0,H);
      gradient.addColorStop(0,'#f3e5df');gradient.addColorStop(1,'#faf1db');
      ctx.fillStyle=gradient;ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#f8f0dc';ctx.beginPath();ctx.arc(970-camera*.04,135,65,0,Math.PI*2);ctx.fill();
      for(let i=-1;i<12;i++) {
        const x=i*330-camera*.18;ctx.fillStyle=i%2?'#e2d8c7':'#e8ddcf';
        ctx.beginPath();ctx.ellipse(x,590,360,230,0,Math.PI,0);ctx.fill();
      }
      // Hyderabad fills its complete section, ending exactly at London's boundary.
      ctx.save();ctx.beginPath();ctx.rect(0,0,Math.max(0,sectionWidth-camera),H);ctx.clip();
      const sunset=ctx.createLinearGradient(0,0,0,H);
      sunset.addColorStop(0,'#e9c4ba');sunset.addColorStop(1,'#f1d1b5');
      ctx.fillStyle=sunset;ctx.fillRect(0,0,W,H);
      for(let i=0;i<Math.ceil(sectionWidth/120)+3;i++) {
        const x=i*120-camera*.85,top=320+(i%4)*25;
        rect(ctx,x,top,90,550-top,i%2?'#d4b7ac':'#ddc1af',3);
        for(let j=0;j<3;j++)rect(ctx,x+14+j*23,top+23,9,18,'#ead4be',2);
      }
      // Keep the minarets at the same height, stretching the lower façade to street level.
      image(ctx,'charminar',615-camera*.85,95,350,468);
      // A cinema portrait fixed to a background building, not suspended above it.
      const posterX=990-camera*.85;
      rect(ctx,posterX-22,300,124,250,'#ccb0a2',3);
      rect(ctx,posterX-27,295,134,9,'#b69b8e',2);
      rect(ctx,posterX-4,318,88,128,'#ae9686',3);
      image(ctx,'prabhas',posterX,322,80,120);
      for(const x of [posterX-7,posterX+61])rect(ctx,x,469,25,35,'#e6ccaf',2);
      ctx.restore();
      ctx.restore();
    },
    midground(ctx, camera, time, sectionWidth, groundY) {
      ctx.save();ctx.translate(-camera,0);
      // One condensed neighbourhood, entirely before the first collectible (x=790).
      image(ctx,'zero40',20,groundY-140,230,140);
      image(ctx,'zero40Sign',37,groundY-127,90,23);
      rect(ctx,23,groundY-5,224,5,'#72726b');
      // Chai shop with a rooftop biryani billboard, not a separate restaurant zone.
      image(ctx,'street',265,335,300,205);
      rect(ctx,267,196,300,128,'#a56852',9);
      rect(ctx,275,204,284,112,'#f4dfb8',5);
      label(ctx,"Mini's Biryani",288,237,25,'#805344');
      label(ctx,'Definitely  better than Bawarchi',288,262,13,'#805344');
      image(ctx,'biryani',447,267,98,48);
      rect(ctx,280,324,5,11,'#826858');rect(ctx,550,324,5,11,'#826858');
      // Festoon lights belong to the street, supported by poles above the rooftops.
      for(const x of [12,645]) {
        rect(ctx,x,165,5,groundY-165,'#9b8777',2);
        rect(ctx,x-4,160,13,6,'#826858',3);
      }
      lights(ctx,14,165,633,15);
      ctx.restore();
    },
    foreground() {
      // Intentionally empty: roadside decorations belong above the ground surface.
    },
  };
}
