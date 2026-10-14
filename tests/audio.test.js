import test from 'node:test';
import assert from 'node:assert/strict';
import {createGameAudio} from '../src/audio.js';
test('music starts from a user action, stops at finish, and restarts on replay',()=>{
 const tracks=[],previousAudio=globalThis.Audio,previousWindow=globalThis.window;
 globalThis.Audio=class{constructor(src){this.src=src;this.currentTime=0;tracks.push(this);}play(){this.playing=true;return Promise.resolve();}pause(){this.playing=false;}};
 globalThis.window={};
 try{const sound=createGameAudio({backgroundMusic:'song.mp3',endingMusic:'next.mp3',musicVolume:.3,effectsVolume:.12});
  assert.equal(tracks[0].playing,undefined);sound.start();assert.equal(tracks[0].playing,true);assert.equal(tracks[0].loop,true);
  sound.finish();assert.equal(tracks[0].playing,false);assert.equal(tracks[0].currentTime,0);
  sound.start();assert.equal(tracks[0].playing,true);assert.equal(tracks[1].playing,false);
 }finally{globalThis.Audio=previousAudio;globalThis.window=previousWindow;}
});
