import test from 'node:test';
import assert from 'node:assert/strict';
import {createSanFranciscoScenery} from '../src/san-francisco.js';
test('San Francisco scenery only renders where the viewport intersects Stage 3',()=>{
 const previous=globalThis.Image;globalThis.Image=class {};
 try {
  const scenery=createSanFranciscoScenery(),calls=[];
  const ctx=new Proxy({}, {get:(_,key)=>key==='createLinearGradient'?()=>({addColorStop(){}}):(...args)=>calls.push([key,...args]),set:()=>true});
  for(const camera of [0,1650,2100,4950]){calls.length=0;scenery.draw(ctx,camera,0,1200,675,1650);assert.equal(calls.length,0);}
  for(const camera of [2500,3300,4200]){calls.length=0;scenery.draw(ctx,camera,0,1200,675,1650);assert.deepEqual(calls.find(c=>c[0]==='rect'),['rect',3300-camera,0,1650,675]);assert.ok(calls.some(c=>c[0]==='clip'));}
 }finally{globalThis.Image=previous;}
});
