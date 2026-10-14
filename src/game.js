import {showBagQuiz} from './quiz.js';
import {stageView} from './stage-view.js';
import {createGameAudio} from './audio.js';
import {config} from './config.js';
import {createWorld,landingSurface} from './world.js';
import {createHyderabadScenery} from './hyderabad.js';
import {createLondonScenery} from './london.js';
import {createSanFranciscoScenery} from './san-francisco.js';
import {createCopenhagenScenery} from './copenhagen.js';
import {createLosAngelesScenery} from './los-angeles.js';
const canvas=document.querySelector('#game'), ctx=canvas.getContext('2d');
const overlay=document.querySelector('#overlay'), hud=document.querySelector('#hud');
const counter=document.querySelector('#counter'), section=document.querySelector('#section');
const stageIntro=document.querySelector('#stage-intro');
const stageTransition=document.querySelector('#stage-transition');
let seenStages=new Set(),stageIntroRemaining=0;
let W=1200;
const H=675, world=createWorld(config), keys=new Set(), images=new Map();
const audio=createGameAudio(config.audio);
canvas.width=W;canvas.height=H;
canvas.tabIndex=0;
const scenery=createHyderabadScenery();
const londonScenery=createLondonScenery();
const sanFranciscoScenery=createSanFranciscoScenery();
const copenhagenScenery=createCopenhagenScenery();
const losAngelesScenery=createLosAngelesScenery();
for(const url of [config.artwork.character,config.artwork.finishCharacter,config.artwork.reunionCharacter,...config.bags.map(b=>b.image)].filter(Boolean)){const img=new Image();img.src=url;images.set(url,img);}
let reunionTime=0,reunionStartX=0,reunited=false;
let state='title',player,camera=0,collected=new Set(),checkpoint,jumpQueued=0,coyote=0,time=0,particles=[],last=0;
function resizeViewport(){
 const wrap=canvas.parentElement;if(!wrap?.clientWidth||!wrap.clientHeight)return;
 W=Math.round(H*wrap.clientWidth/wrap.clientHeight);canvas.width=W;canvas.height=H;
 camera=stageView(player?.x||0,W,config.level.sectionWidth,world.bags.length,world.width).camera;
}
window.addEventListener('resize',resizeViewport);
if(typeof ResizeObserver!=='undefined')new ResizeObserver(resizeViewport).observe(canvas.parentElement);
resizeViewport();
function text(tag,value,cls){const el=document.createElement(tag);el.textContent=value;if(cls)el.className=cls;return el;}
function showCard(type,title,body,label,action){keys.clear();jumpQueued=0;overlay.replaceChildren();const card=text('div','','card '+type);if(type!=='letter')card.append(text('div',type==='title'?'Welcome to Baggage Claim':'A LITTLE SOMETHING FOR YOU','eyebrow'),text('div','♡','heart'));card.append(text('h1',title),text('p',body));const button=text('button',label);button.onclick=action;card.append(button);if(type==='title')card.append(text('div','← → MOVE     ·     SPACE JUMP','controls'));overlay.append(card);if(type==='letter'){card.tabIndex=-1;card.focus({preventScroll:true});card.scrollTop=0;}else button.focus();}
function start(){reunited=false;reunionTime=0;audio.start();seenStages.clear();section.dataset.stage='';player={x:100,y:480,w:34,h:64,vx:0,vy:0,face:1,grounded:false};checkpoint={x:100,y:480};camera=0;collected=new Set();particles=[];keys.clear();jumpQueued=0;coyote=0;state='playing';overlay.replaceChildren();hud.hidden=false;canvas.focus({preventScroll:true});updateHud();}
function updateHud(){counter.textContent=`Bags: ${collected.size} / ${world.bags.length}`;const stage=Math.min(world.bags.length-1,Math.floor(player.x/config.level.sectionWidth));
 if(section.dataset.stage===String(stage))return;
 if(section.dataset.stage!=='')stageTransition.replaceChildren(text('div','','city-fade'));
 section.dataset.stage=String(stage);
 const name=config.level.sections[stage] || {city:'A little birthday adventure',caption:''};
 const heading=text('strong',`${String(stage+1).padStart(2,'0')} ${name.city} •`);
 const caption=text('span',' ');
 name.caption.split(/(~~.*?~~)/g).forEach(part=>caption.append(text(part.startsWith('~~')?'s':'span',part.startsWith('~~')?part.slice(2,-2):part)));
 section.replaceChildren(heading,caption);
 if(!seenStages.has(stage)){
  seenStages.add(stage);stageIntroRemaining=3.6;stageIntro.hidden=false;
  const card=text('div','','stage-title-card');
  card.append(text('div',`${String(stage+1).padStart(2,'0')} ${name.city}`,'stage-city'));
  const subtitle=text('div','','stage-caption');
  name.caption.split(/(~~.*?~~)/g).forEach(part=>subtitle.append(text(part.startsWith('~~')?'s':'span',part.startsWith('~~')?part.slice(2,-2):part)));
  card.append(subtitle);stageIntro.replaceChildren(card);
 }
}
function celebrate(){state='ending';hud.hidden=true;for(let i=0;i<90;i++)particles.push({x:Math.random()*W,y:-Math.random()*H,v:40+Math.random()*100,color:['#bd8b75','#d9b865','#a5af8e'][i%3]});showCard('',`Happy Birthday ${config.name} ❤️`,config.endingMessage,'Open Your Letter',()=>{state='letter';showCard('letter',`For ${config.name}, with love`,config.finalLetter,'Play Again',start);});}
document.querySelector('#restart').onclick=start;
window.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Space','KeyA','KeyD'].includes(e.code)){e.preventDefault();if(state==='playing'){keys.add(e.code);if(e.code==='Space'&&!e.repeat)jumpQueued=config.physics.jumpBuffer;}}});
window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>{keys.clear();jumpQueued=0;});document.addEventListener('visibilitychange',()=>{keys.clear();last=0;});
function update(dt){time+=dt;stageIntroRemaining=Math.max(0,stageIntroRemaining-dt);stageIntro.hidden=stageIntroRemaining===0||state==='ending'||state==='letter';if(state==='reunion'){reunionTime+=dt;const ease=Math.min(1,reunionTime/1.2);player.x=reunionStartX+(world.finish-37-reunionStartX)*ease;player.y=config.level.groundY-player.h;if(reunionTime>=3.4)celebrate();return;}if(state!=='playing')return;
 const p=player,f=config.physics;const left=keys.has('KeyA')||keys.has('ArrowLeft'),right=keys.has('KeyD')||keys.has('ArrowRight');p.vx=(Number(right)-Number(left))*f.speed;if(p.vx)p.face=Math.sign(p.vx);
 coyote=p.grounded?f.coyoteTime:Math.max(0,coyote-dt);jumpQueued=Math.max(0,jumpQueued-dt);
 if(jumpQueued>0&&coyote>0){audio.jump();p.vy=-f.jump;p.grounded=false;coyote=0;jumpQueued=0;}
 const bottom=p.y+p.h;p.vy+=f.gravity*dt;p.x=Math.max(0,Math.min(world.width-p.w,p.x+p.vx*dt));p.y+=p.vy*dt;p.grounded=false;
 if(p.vy>=0){const surface=landingSurface(p,bottom,world.surfaces);if(surface){p.y=surface.y-p.h;p.vy=0;p.grounded=true;checkpoint={x:p.x,y:p.y};}}
 if(p.y>H+70){p.x=checkpoint.x;p.y=checkpoint.y;p.vy=0;p.vx=0;jumpQueued=0;coyote=0;}
 camera=stageView(p.x,W,config.level.sectionWidth,world.bags.length,world.width).camera;updateHud();
 for(const bag of world.bags){if(!collected.has(bag.id)&&Math.abs(p.x+p.w/2-bag.x)<43&&Math.abs(p.y+p.h/2-bag.y)<60){
  state='quiz';keys.clear();jumpQueued=0;audio.quizOpen();
  showBagQuiz(document,overlay,config.quizzes[bag.id],()=>{
   if(state!=='quiz'||collected.has(bag.id))return;
   collected.add(bag.id);audio.collect();updateHud();state='playing';overlay.replaceChildren();keys.clear();jumpQueued=0;canvas.focus({preventScroll:true});
  },undefined,audio);break;
 }}
 if(state==='playing'&&p.x+p.w/2>=world.finish-65&&p.grounded&&collected.size===world.bags.length){audio.finish();state='reunion';reunited=true;reunionTime=0;reunionStartX=p.x;p.vx=0;p.face=1;keys.clear();hud.hidden=true;stageIntroRemaining=0;}
}
function round(x,y,w,h,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();}
function bagArt(x,y,color,url){
 const img=images.get(url);if(img?.complete&&img.naturalWidth){ctx.drawImage(img,x-30,y-35,60,65);return;}
 ctx.save();ctx.translate(x,y);
 // Sculptural tote: flared wings, a dipped opening, and a rounded tapered base.
 ctx.strokeStyle=color;ctx.lineWidth=3.5;ctx.lineCap='round';
 ctx.beginPath();ctx.moveTo(-12,-5);ctx.bezierCurveTo(-9,-45,9,-45,13,-5);ctx.stroke();
 ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(-35,-16);
 ctx.bezierCurveTo(-24,-20,-14,-7,0,-6);
 ctx.bezierCurveTo(14,-7,25,-20,35,-16);
 ctx.bezierCurveTo(32,6,25,22,15,28);
 ctx.quadraticCurveTo(0,32,-15,28);ctx.bezierCurveTo(-25,22,-32,6,-35,-16);
 ctx.closePath();ctx.fill();
 // Soft side folds give the small silhouette depth without photo texture.
 ctx.fillStyle='#43271c25';ctx.beginPath();ctx.moveTo(-35,-16);ctx.quadraticCurveTo(-25,2,-15,28);ctx.quadraticCurveTo(-30,17,-35,-16);ctx.fill();
 ctx.beginPath();ctx.moveTo(35,-16);ctx.quadraticCurveTo(25,2,15,28);ctx.quadraticCurveTo(30,17,35,-16);ctx.fill();
 ctx.strokeStyle='#f6dec18c';ctx.lineWidth=.8;ctx.beginPath();
 ctx.moveTo(-32,-15);ctx.quadraticCurveTo(0,2,32,-15);
 ctx.moveTo(-27,-13);ctx.quadraticCurveTo(-27,12,-17,22);
 ctx.moveTo(27,-13);ctx.quadraticCurveTo(27,12,17,22);ctx.stroke();
 // Long front handle curves around the body, distinct from the rear arch.
 ctx.strokeStyle='#43271c35';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-12,-8);ctx.bezierCurveTo(-16,31,16,31,12,-8);ctx.stroke();
 ctx.strokeStyle=color;ctx.lineWidth=2.5;ctx.stroke();
 ctx.strokeStyle='#f6dec177';ctx.lineWidth=.65;ctx.stroke();
 ctx.restore();
}
function drawReunion(){
 const pose=images.get(config.artwork.reunionCharacter),progress=Math.min(1,reunionTime/1.2);
 ctx.save();ctx.translate(world.finish+10,config.level.groundY-3);ctx.rotate(-progress*.1);
 if(pose?.complete&&pose.naturalWidth)ctx.drawImage(pose,0,50,220,150,-68,-93,136,93);
 ctx.restore();
 // The banner lowers beside him, then fades away before the kiss.
 if(reunionTime<1.2){ctx.save();ctx.globalAlpha=1-progress;const y=350+progress*130;
  round(world.finish-56,y,112,26,5,'#fff0d5');ctx.fillStyle='#71554b';ctx.textAlign='center';ctx.font='10px Georgia';ctx.fillText('Come get your letter!',world.finish,y+17);ctx.restore();}
 if(reunionTime>1.2){const pop=Math.min(1,(reunionTime-1.2)/.35);ctx.save();ctx.translate(world.finish-3,config.level.groundY-109);ctx.scale(pop,pop);ctx.fillStyle='#cc7582';ctx.font='32px Georgia';ctx.textAlign='center';ctx.fillText('♥',0,Math.sin(time*3)*2);ctx.restore();}
}
function draw(){ctx.clearRect(0,0,W,H);
 const view=stageView(player?.x||0,W,config.level.sectionWidth,world.bags.length,world.width);
 camera=view.camera;
 // Extra-wide screens receive current-city atmosphere outside its playable bounds.
 const palettes=[['#e9c4ba','#f1d1b5'],['#dce9e9','#e5ead5'],['#d2e6ed','#e7eadc'],['#e4e9d9','#f7e7c8'],['#b6a0bd','#f8d9ac']];
 const colors=palettes[view.stage]||palettes[0],sky=ctx.createLinearGradient(0,0,0,H);
 sky.addColorStop(0,colors[0]);sky.addColorStop(1,colors[1]);ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
 ctx.fillStyle='#c5ae8e';ctx.fillRect(0,config.level.groundY,W,H-config.level.groundY);
 ctx.save();ctx.beginPath();ctx.rect(view.start-camera,0,view.end-view.start,H);ctx.clip();
 if(view.stage===0){scenery.background(ctx,camera,time,W,H,config.level.sectionWidth);scenery.midground(ctx,camera,time,config.level.sectionWidth,config.level.groundY);}
 if(view.stage===1)londonScenery.draw(ctx,camera,time,W,H,config.level.sectionWidth);
 if(view.stage===2)sanFranciscoScenery.draw(ctx,camera,time,W,H,config.level.sectionWidth);
 if(view.stage===3)copenhagenScenery.draw(ctx,camera,time,W,H,config.level.sectionWidth);
 if(view.stage===4)losAngelesScenery.draw(ctx,camera,time,W,H,config.level.sectionWidth,world.width);
 ctx.save();ctx.translate(-camera,0);
 for(let i=0;i<world.bags.length;i++){const base=i*config.level.sectionWidth;for(let j=0;j<9;j++){const x=base+120+j*180;ctx.strokeStyle='#a5ab83';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,550);ctx.lineTo(x,526);ctx.stroke();ctx.fillStyle=j%2?'#d7a69a':'#e1bf87';ctx.beginPath();ctx.arc(x,523,5,0,7);ctx.fill();}}
 for(const s of world.surfaces){const elevated=s.y!==config.level.groundY;
  if(elevated){round(s.x-3,s.y-3,s.w+6,26,8,'#fff8e9');round(s.x,s.y+5,s.w,22,6,'#715a47');}
  round(s.x,s.y,s.w,elevated?20:H-s.y+40,6,elevated?'#977454':'#c5ae8e');
  round(s.x,s.y,s.w,8,4,elevated?'#526b4e':'#98a17e');
  if(elevated){round(s.x+8,s.y+2,s.w-16,2,1,'#d9e1af');}
 }
 for(const b of world.bags)if(!collected.has(b.id)){const bob=Math.sin(time*2+b.id)*5;ctx.fillStyle='#fff9e966';ctx.beginPath();ctx.arc(b.x,b.y+bob,47,0,7);ctx.fill();bagArt(b.x,b.y+bob,b.color,b.image);ctx.fillStyle='#ad8c66';ctx.font='17px Georgia';ctx.fillText('✧',b.x+37,b.y-25+bob);}
 const greeter=images.get(config.artwork.finishCharacter);
 if(reunited){drawReunion();}else if(greeter?.complete&&greeter.naturalWidth){
  const beat=Math.sin(time*5),bounce=Math.abs(beat)*3;
  ctx.save();ctx.translate(world.finish,config.level.groundY);ctx.scale(.62,.62);
  // Alternate steps while the raised banner and torso sway together.
  for(const [sx,dx,pivot,angle] of [[88,-22,-8,beat*.18],[110,0,9,-beat*.18]]){
   ctx.save();ctx.translate(pivot,-50);ctx.rotate(angle);
   ctx.drawImage(greeter,sx,150,22,50,dx-pivot,0,22,50);ctx.restore();
  }
  ctx.translate(beat*3,-50-bounce);ctx.rotate(beat*.035);
  ctx.drawImage(greeter,0,0,220,150,-110,-150,220,150);
  round(-81,-144,162,28,4,'#fff0d5');ctx.fillStyle='#71554b';ctx.textAlign='center';ctx.font='14px Georgia';
  ctx.fillText(collected.size<world.bags.length?'Collect every bag first':'Come get your letter!',0,-125);ctx.restore();
 }
 const p=player||{x:250,y:486,w:34,h:64,face:1};const img=images.get(config.artwork.character);if(img?.complete&&img.naturalWidth){ctx.save();ctx.translate(p.x+p.w/2,p.y);if(reunited){ctx.translate(0,18);ctx.rotate(Math.min(1,reunionTime/1.2)*.1);ctx.translate(0,-18);}ctx.scale(p.face,1);// Feet meet the platform's upper outline, three pixels above collision height.
ctx.translate(-32,p.h-83);
if(config.artwork.character?.endsWith('/mini.svg')){
 const walking=state==='playing'&&p.grounded&&Math.abs(p.vx)>0;
 const stride=walking?Math.sin(time*12)*.32:0;
 const airborne=state==='playing'&&!p.grounded;
 for(const [sx,dx,pivot,angle] of [[36,18,25,airborne?-.18:stride],[64,32,39,airborne?.18:-stride]]){
  ctx.save();ctx.translate(pivot,55);ctx.rotate(angle);
  ctx.drawImage(img,sx,110,28,50,dx-pivot,0,14,25);ctx.restore();
 }
 // Torso stays steady while the trouser legs and shoes swing beneath it.
 ctx.drawImage(img,0,0,128,110,0,0,64,55);
}else ctx.drawImage(img,0,0,64,80);ctx.restore();}else{const sway=state==='playing'&&p.vx?Math.sin(time*12)*3:0;round(p.x-4,p.y+7,42,44,18,'#49362f');round(p.x+8,p.y+45,7,19+sway,3,'#735548');round(p.x+23,p.y+45,7,19-sway,3,'#735548');round(p.x+3,p.y+28,30,27,10,'#cc8b76');round(p.x+6,p.y+8,24,23,10,'#d8a27e');ctx.fillStyle='#49362f';ctx.beginPath();ctx.ellipse(p.x+17,p.y+8,16,9,0,Math.PI,0);ctx.fill();ctx.fillStyle='#49362f';ctx.fillRect(p.x+(p.face>0?24:10),p.y+18,2,3);ctx.fillStyle='#8d7663';ctx.font='9px Arial';ctx.fillText('PLACEHOLDER',p.x-17,p.y-12);}
 ctx.restore();if(view.stage===0)scenery.foreground(ctx,camera,time,config.level.sectionWidth,config.level.groundY);ctx.restore();if(state==='ending'||state==='letter')for(const part of particles){part.y+=part.v/60;if(part.y>H)part.y=-10;ctx.save();ctx.translate(part.x+Math.sin(time+part.x)*12,part.y);ctx.rotate(time);ctx.fillStyle=part.color;ctx.fillRect(-3,-3,6,10);ctx.restore();}}
function frame(stamp){const dt=last?Math.min((stamp-last)/1000,.033):0;last=stamp;update(dt);draw();requestAnimationFrame(frame);}
showCard('title',config.title,config.subtitle,'Start the Adventure',start);requestAnimationFrame(frame);














