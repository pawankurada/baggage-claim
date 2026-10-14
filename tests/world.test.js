import test from 'node:test';
import assert from 'node:assert/strict';
import {config} from '../src/config.js';
import {createWorld,landingSurface} from '../src/world.js';
test('number of bags also determines level length',()=>{for(const count of [1,5,7]){const world=createWorld({...config,bags:Array.from({length:count},()=>({message:'note'}))});assert.equal(world.bags.length,count);assert.equal(world.finish,count*config.level.sectionWidth+550);assert.ok(world.surfaces.some(s=>s.x<=world.finish&&s.x+s.w>world.finish));}});
test('landing catches a descending player, but does not catch from below or outside',()=>{const surfaces=[{x:100,y:400,w:100}];assert.ok(landingSurface({x:120,y:360,w:34,h:64},390,surfaces));assert.equal(landingSurface({x:120,y:360,w:34,h:64},410,surfaces),undefined);assert.equal(landingSurface({x:220,y:360,w:34,h:64},390,surfaces),undefined);});
test('default route jumps and gaps fit the physics',()=>{const maxHeight=config.physics.jump**2/(2*config.physics.gravity);const maxDistance=config.physics.speed*2*config.physics.jump/config.physics.gravity;assert.ok(maxHeight>85);assert.ok(maxDistance>100);assert.equal(createWorld(config).bags.length,5);});

