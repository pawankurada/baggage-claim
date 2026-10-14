import {showBagQuiz} from '../src/quiz.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {config} from '../src/config.js';
import {createWorld,landingSurface} from '../src/world.js';
test('full game loop: movement, jump, fall, five paused quizzes, ending, letter, replay',()=>{
 const elements=new Map();
 const element=()=>({dataset:{},children:[],append(...items){this.children.push(...items);},replaceChildren(...items){this.children=items;},focus(){},getContext(){return {};}});
 const document={querySelector(id){if(!elements.has(id))elements.set(id,element());return elements.get(id);},createElement:element,addEventListener(){}};
 const sandbox={showBagQuiz:(doc,overlay,quiz,claim)=>showBagQuiz(doc,overlay,quiz,claim,fn=>fn()),createGameAudio:()=>({start(){},jump(){},quizOpen(){},collect(){},finish(){}}),config,createWorld,landingSurface,createHyderabadScenery:()=>({background(){},midground(){},foreground(){}}),createLondonScenery:()=>({draw(){}}),createSanFranciscoScenery:()=>({draw(){}}),createCopenhagenScenery:()=>({draw(){}}),createLosAngelesScenery:()=>({draw(){}}),document,window:{addEventListener(){}},requestAnimationFrame(){},Image:class{}};
 const source=readFileSync(new URL('../src/game.js',import.meta.url),'utf8').replace(/^import .*;\r?\n/gm,'');
 vm.createContext(sandbox);vm.runInContext(source+`
 start(); keys.add('KeyD'); update(.1); if(player.x<=100)throw Error('movement');
 keys.clear(); update(.1); jumpQueued=.14;update(.01);if(player.vy>=0)throw Error('jump');
 player.y=800;update(.01);if(player.y>600)throw Error('respawn');
 for(const bag of world.bags){
  const count=collected.size;player.x=bag.x-17;player.y=bag.y-32;player.vy=0;update(.001);
  if(state!=='quiz'||collected.size!==count)throw Error('bag awarded before quiz');
  const before={x:player.x,y:player.y},card=overlay.children[0],answers=card.children[2].children;
  const wrong=config.quizzes[bag.id].options.findIndex(o=>!o.correct),correct=config.quizzes[bag.id].options.findIndex(o=>o.correct);
  for(let attempt=0;attempt<12;attempt++){answers[wrong].onclick();update(.1);if(state!=='quiz'||collected.size!==count||player.x!==before.x||player.y!==before.y)throw Error('retry or freeze');}
  if(card.children[3].textContent!==config.quizzes[bag.id].options[wrong].feedback)throw Error('custom feedback');
  answers[correct].onclick();if(collected.size!==count||card.children.at(-1).hidden)throw Error('claim must be explicit');
  card.children.at(-1).onclick();card.children.at(-1).onclick();if(collected.size!==count+1||state!=='playing')throw Error('claim once');
  update(0);if(state!=='playing')throw Error('quiz reopened');
 }
 if(collected.size!==5)throw Error('counter');player.x=world.finish-70;player.y=config.level.groundY-player.h;player.vy=0;update(.001);if(state!=='reunion'||player.x>=world.finish)throw Error('arrival should trigger before passing greeter');update(3.5);if(state!=='ending')throw Error('finish');overlay.children[0].children.at(-1).onclick();if(state!=='letter')throw Error('letter');overlay.children[0].children.at(-1).onclick();if(state!=='playing'||collected.size)throw Error('replay');
 // Traverse the real route with movement and jump input, without teleporting.
 for(let step=0;step<12000 && state!=='ending';step++){
   if(state==='quiz'){const quiz=config.quizzes[Math.floor(player.x/config.level.sectionWidth)];overlay.children[0].children[2].children[quiz.options.findIndex(o=>o.correct)].onclick();overlay.children[0].children.at(-1).onclick();}
   keys.add('KeyD');const local=player.x%config.level.sectionWidth;
   if(player.grounded&&((local>440&&local<465&&player.y+player.h>500)||(local>590&&local<620&&player.y+player.h>450)))jumpQueued=.14;
   update(1/60);
 }
 if(state!=='ending'||collected.size!==5)throw Error('route incomplete at '+player.x+'; bags '+collected.size);
 `,sandbox);
 assert.ok(true);
});





