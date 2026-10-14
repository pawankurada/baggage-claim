import test from 'node:test';
import assert from 'node:assert/strict';
import {stageView} from '../src/stage-view.js';
test('camera never reveals a neighboring city on a standard viewport',()=>{
 for(let stage=0;stage<5;stage++)for(const local of [0,100,790,1649]){
  const view=stageView(stage*1650+local,1200,1650,5,8950);
  assert.equal(view.stage,stage);assert.ok(view.camera>=view.start);assert.ok(view.camera+1200<=view.end);
 }
});
test('extra-wide view centers the current section; next city activates only at its boundary',()=>{
 const first=stageView(1649,1900,1650,5,8950),next=stageView(1650,1900,1650,5,8950);
 assert.equal(first.stage,0);assert.equal(first.camera,-125);assert.equal(first.end,1650);
 assert.equal(next.stage,1);assert.equal(next.camera,1525);assert.equal(next.start,1650);
});
