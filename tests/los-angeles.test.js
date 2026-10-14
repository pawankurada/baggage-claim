import test from 'node:test';
import assert from 'node:assert/strict';
import {createLosAngelesScenery} from '../src/los-angeles.js';
test('Los Angeles scenery only renders where the viewport intersects Stage 5',()=>{
 const previous=globalThis.Image;globalThis.Image=class {};
 try {
  const scenery=createLosAngelesScenery(),calls=[];
  const ctx=new Proxy({}, {get:(_,key)=>key==='createLinearGradient'?()=>({addColorStop(){}}):(...args)=>calls.push([key,...args]),set:()=>true});
  for(const camera of [0,4950,5400]){calls.length=0;scenery.draw(ctx,camera,0,1200,675,1650,8950);assert.equal(calls.length,0);}
  for(const camera of [6000,6600,8000]){calls.length=0;scenery.draw(ctx,camera,0,1200,675,1650,8950);assert.deepEqual(calls.find(c=>c[0]==='rect'),['rect',6600-camera,0,2350,675]);assert.ok(calls.some(c=>c[0]==='clip'));}
 }finally{globalThis.Image=previous;}
});
