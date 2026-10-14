import test from 'node:test';
import assert from 'node:assert/strict';
import {createLondonScenery} from '../src/london.js';
test('London scenery only renders where the viewport intersects Stage 2',()=>{
 const previous=globalThis.Image;globalThis.Image=class {};
 try {
  const scenery=createLondonScenery(),calls=[];
  const ctx=new Proxy({}, {get:(_,key)=>key==='createLinearGradient'?()=>({addColorStop(){}}):(...args)=>calls.push([key,...args]),set:()=>true});
  for(const camera of [0,450,3300,4950]){calls.length=0;scenery.draw(ctx,camera,0,1200,675,1650);assert.equal(calls.length,0);}
  for(const camera of [1000,1650,2500]){calls.length=0;scenery.draw(ctx,camera,0,1200,675,1650);assert.deepEqual(calls.find(c=>c[0]==='rect'),['rect',1650-camera,0,1650,675]);assert.ok(calls.some(c=>c[0]==='clip'));}
 }finally{globalThis.Image=previous;}
});
