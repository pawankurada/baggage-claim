import test from 'node:test';
import assert from 'node:assert/strict';
import {createCopenhagenScenery} from '../src/copenhagen.js';
test('Copenhagen scenery only renders where the viewport intersects Stage 4',()=>{
 const previous=globalThis.Image;globalThis.Image=class {};
 try {
  const scenery=createCopenhagenScenery(),calls=[];
  const ctx=new Proxy({}, {get:(_,key)=>key==='createLinearGradient'?()=>({addColorStop(){}}):(...args)=>calls.push([key,...args]),set:()=>true});
  for(const camera of [0,3300,3750,6600]){calls.length=0;scenery.draw(ctx,camera,0,1200,675,1650);assert.equal(calls.length,0);}
  for(const camera of [4000,4950,6000]){calls.length=0;scenery.draw(ctx,camera,0,1200,675,1650);assert.deepEqual(calls.find(c=>c[0]==='rect'),['rect',4950-camera,0,1650,675]);assert.ok(calls.some(c=>c[0]==='clip'));}
 }finally{globalThis.Image=previous;}
});
