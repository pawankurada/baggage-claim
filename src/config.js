import {quizzes} from './quizzes.js';
import {birthdayLetter} from './letter.js';
// Edit all birthday content and artwork here. Local artwork belongs in public/assets/.
export const config = {
  quizzes,
  name: 'Mini',
  title: 'This could’ve been a card,\nbut you deserve more.',
  subtitle: 'Five cities. Five challenges. Five bags.\nGet them all right and there’s something waiting for you at the end.',
  finalLetter: birthdayLetter,
  endingMessage: 'I’m taking the 5 bags you collected in exchange for this letter. Symbolically, I’m taking away any baggage that’s holding you down. Romantically, I’m here for you. Financially, this is the best I can do.',
  audio: {
    backgroundMusic: 'public/assets/audio/love-story-8bit.mp3',
    endingMusic: 'public/assets/audio/down-8bit.wav', // Plays after the record scratch.
    musicVolume: 0.3,
    effectsVolume: 0.12,
    scratchVolume: 0.55,
  },
  bags: [
    { message: 'Message 1', color: '#a96e50', image: null },
    { message: 'Message 2', color: '#bd9380', image: null },
    { message: 'Message 3', color: '#81765b', image: null },
    { message: 'Message 4', color: '#a47877', image: null },
    { message: 'Message 5', color: '#795247', image: null },
  ],
  artwork: { character: 'public/assets/character/mini.svg', finishCharacter: 'public/assets/character/pawan.svg', reunionCharacter: 'public/assets/character/pawan-reunion.svg' }, // Replace with your own transparent character artwork.
  level: {
    sections: [
      { city: 'Hyderabad', caption: 'a little taste of home' },
      { city: 'London', caption: 'colonizers... but gave you a banging personality' },
      { city: 'San Francisco', caption: 'can perhaps make your boyfriend rich' },
      { city: 'Copenhagen', caption: 'our ~~honeymoon~~ Scandinavian research project' },
      { city: 'Los Angeles', caption: 'only hollywood can handle your drama' },
    ],
    finishText: 'Your letter is waiting',
    sectionWidth: 1650,
    groundY: 550,
    // Relative to each section: [x, y, width]. Change these to redesign the route.
    platforms: [[0,550,660],[760,550,890],[470,465,150],[700,405,170],[960,465,170]],
    bagPosition: { x: 790, y: 355 },
  },
  physics: { speed: 165, jump: 600, gravity: 1400, coyoteTime: .12, jumpBuffer: .18 },
};


