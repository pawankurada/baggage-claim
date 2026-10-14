// Music uses supplied files; short effects are synthesized locally.
export function createGameAudio(settings){
 let context,endingTimer;
 const music=new Audio(settings.backgroundMusic);music.loop=true;music.volume=settings.musicVolume;
 const ending=settings.endingMusic?new Audio(settings.endingMusic):null;
 if(ending)ending.volume=settings.musicVolume;
 const play=track=>track?.play()?.catch(()=>{});
 function unlock(){const Context=window.AudioContext||window.webkitAudioContext;if(Context){context??=new Context();context.resume().catch(()=>{});}}
 function tone(from,to,duration,delay=0){if(!context)return;const now=context.currentTime+delay,osc=context.createOscillator(),gain=context.createGain();osc.type='triangle';osc.frequency.setValueAtTime(from,now);osc.frequency.exponentialRampToValueAtTime(to,now+duration);gain.gain.setValueAtTime(settings.effectsVolume,now);gain.gain.exponentialRampToValueAtTime(.001,now+duration);osc.connect(gain);gain.connect(context.destination);osc.start(now);osc.stop(now+duration);}
 function scratch(){if(!context)return;const duration=.85,buffer=context.createBuffer(1,context.sampleRate*duration,context.sampleRate),data=buffer.getChannelData(0);
  for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*(.35+.65*Math.abs(Math.sin(i/context.sampleRate*29)));
  const source=context.createBufferSource(),filter=context.createBiquadFilter(),gain=context.createGain(),now=context.currentTime;
  source.buffer=buffer;filter.type='bandpass';filter.Q.value=.7;filter.frequency.setValueAtTime(3200,now);filter.frequency.exponentialRampToValueAtTime(350,now+.25);filter.frequency.exponentialRampToValueAtTime(2400,now+.48);filter.frequency.exponentialRampToValueAtTime(180,now+duration);
  const volume=settings.scratchVolume??.55;
  gain.gain.setValueAtTime(volume,now);gain.gain.setValueAtTime(volume,now+.55);gain.gain.exponentialRampToValueAtTime(.001,now+duration);source.connect(filter);filter.connect(gain);gain.connect(context.destination);source.start();source.stop(now+duration);
 }
 return {
  start(){clearTimeout(endingTimer);unlock();ending?.pause();if(ending)ending.currentTime=0;music.pause();music.currentTime=0;play(music);},
  jump(){tone(220,650,.16);},
  quizOpen(){tone(440,660,.12);tone(660,880,.16,.09);},
  answerCorrect(){tone(523,523,.12);tone(659,659,.14,.09);tone(1047,1047,.25,.18);},
  answerWrong(){tone(260,180,.16);tone(180,125,.18,.12);},
  collect(){tone(660,880,.15);tone(880,1320,.22,.1);},
  finish(){clearTimeout(endingTimer);music.pause();music.currentTime=0;scratch();endingTimer=setTimeout(()=>play(ending),900);},
 };
}
